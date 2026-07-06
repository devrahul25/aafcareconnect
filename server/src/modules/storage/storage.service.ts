import { PutObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../../config/s3';
import { env } from '../../config/env';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { AppError } from '../../shared/errors/AppError';

const ALLOWED_MIME_TYPES = {
  videos: ['video/mp4', 'video/webm', 'video/quicktime'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  certificates: ['application/pdf', 'image/png', 'image/jpeg'],
  logos: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'],
  compliance: ['application/pdf', 'image/png', 'image/jpeg']
};

export class StorageService {
  async generateUploadUrl(
    organizationId: string,
    filename: string,
    contentType: string,
    folder: string,
  ) {
    const allowedTypes = ALLOWED_MIME_TYPES[folder as keyof typeof ALLOWED_MIME_TYPES] || [];
    if (!allowedTypes.includes(contentType)) {
      throw new AppError(`Invalid content type for folder ${folder}. Allowed: ${allowedTypes.join(', ')}`, 400, 'INVALID_FILE_TYPE');
    }

    const ext = path.extname(filename);
    const uniqueId = uuidv4();
    const key = `${organizationId}/${folder}/${uniqueId}${ext}`;

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    // URL expires in 1 hour
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // Calculate the CloudFront URL
    const cloudfrontUrl = `https://${env.AWS_CLOUDFRONT_DOMAIN}/${key}`;

    return {
      uploadUrl,
      key,
      cloudfrontUrl,
    };
  }

  // Used for documents to strictly enforce max file size (e.g. 20MB)
  async generatePostPolicy(
    organizationId: string,
    filename: string,
    contentType: string,
    folder: string,
    maxSizeByte: number = 20 * 1024 * 1024
  ) {
    const allowedTypes = ALLOWED_MIME_TYPES[folder as keyof typeof ALLOWED_MIME_TYPES] || [];
    if (!allowedTypes.includes(contentType)) {
      throw new AppError(`Invalid content type for folder ${folder}. Allowed: ${allowedTypes.join(', ')}`, 400, 'INVALID_FILE_TYPE');
    }

    const ext = path.extname(filename);
    const uniqueId = uuidv4();
    // e.g. orgId/documents/2026/07/uuid.pdf
    const datePrefix = new Date().toISOString().substring(0, 7).replace('-', '/');
    const key = `${organizationId}/${folder}/${datePrefix}/${uniqueId}${ext}`;

    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      Conditions: [
        ['content-length-range', 0, maxSizeByte],
        ['eq', '$Content-Type', contentType],
      ],
      Fields: {
        'Content-Type': contentType,
      },
      Expires: 3600, // 1 hour
    });

    return {
      url,
      fields,
      key,
      cloudfrontUrl: `https://${env.AWS_CLOUDFRONT_DOMAIN}/${key}`,
    };
  }

  // MULTIPART UPLOAD FOR VIDEOS (> 100MB)

  async createMultipartUpload(organizationId: string, filename: string, contentType: string) {
    const allowedTypes = ALLOWED_MIME_TYPES.videos;
    if (!allowedTypes.includes(contentType)) {
      throw new AppError('Invalid content type for video', 400, 'INVALID_FILE_TYPE');
    }

    const ext = path.extname(filename);
    const uniqueId = uuidv4();
    const datePrefix = new Date().toISOString().substring(0, 7).replace('-', '/');
    const key = `${organizationId}/videos/${datePrefix}/${uniqueId}${ext}`;

    const command = new CreateMultipartUploadCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const response = await s3Client.send(command);
    return {
      uploadId: response.UploadId,
      key: response.Key,
      cloudfrontUrl: `https://${env.AWS_CLOUDFRONT_DOMAIN}/${response.Key}`,
    };
  }

  async signUploadPart(key: string, uploadId: string, partNumber: number) {
    const command = new UploadPartCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
    });
    
    // Part URLs valid for 1 hour
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { presignedUrl };
  }

  async completeMultipartUpload(key: string, uploadId: string, parts: { ETag: string; PartNumber: number }[]) {
    // Sort parts to ensure S3 completes it correctly
    const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);

    const command = new CompleteMultipartUploadCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: sortedParts,
      },
    });

    await s3Client.send(command);
    return { success: true, key };
  }
}

export const storageService = new StorageService();
