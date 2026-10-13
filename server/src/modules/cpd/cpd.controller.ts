import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { sendResponse } from '../../shared/utils/response';
import { CertificateStatus } from '@prisma/client';

export const listCertificates = asyncHandler(async (req: Request, res: Response) => {
    const orgId = req.organizationId!;
    const { user_id, status } = req.query;

    const where: any = { organization_id: orgId };
    if (user_id) where.user_id = user_id as string;
    if (status) where.status = status as CertificateStatus;

    const certs = await prisma.cPDCertificate.findMany({
        where,
        include: {
            user: { select: { id: true, full_name: true, email: true } }
        },
        orderBy: { expiry_date: 'asc' }
    });

    sendResponse(res, 200, certs);
});

export const getCertificate = asyncHandler(async (req: Request, res: Response) => {
    const orgId = req.organizationId!;
    const id = req.params.id as string;
    const cert = await prisma.cPDCertificate.findFirst({
        where: { id, organization_id: orgId },
        include: { user: { select: { id: true, full_name: true, email: true } } }
    });

    if (!cert) {
        return res.status(404).json({ success: false, error: 'Certificate not found' });
    }

    sendResponse(res, 200, cert);
});

export const createCertificate = asyncHandler(async (req: Request, res: Response) => {
    const orgId = req.organizationId!;
    const { user_id, title, provider, category, issue_date, expiry_date, cpd_hours, certificate_url } = req.body;

    const now = new Date();
    const expiry = expiry_date ? new Date(expiry_date) : null;
    let status: CertificateStatus = CertificateStatus.VALID;

    if (expiry) {
        const days = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 0) status = CertificateStatus.EXPIRED;
        else if (days <= 90) status = CertificateStatus.EXPIRING_SOON;
    }

    const cert = await prisma.cPDCertificate.create({
        data: {
            organization_id: orgId,
            user_id,
            title,
            provider,
            category,
            issue_date: issue_date ? new Date(issue_date) : now,
            expiry_date: expiry,
            cpd_hours: cpd_hours ? parseFloat(cpd_hours) : null,
            certificate_url,
            status,
            verified: true
        },
        include: { user: { select: { id: true, full_name: true, email: true } } }
    });

    sendResponse(res, 201, cert);
});

export const updateCertificate = asyncHandler(async (req: Request, res: Response) => {
    const orgId = req.organizationId!;
    const id = req.params.id as string;
    const { title, provider, category, issue_date, expiry_date, cpd_hours, status, verified, certificate_url } = req.body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (provider !== undefined) data.provider = provider;
    if (category !== undefined) data.category = category;
    if (issue_date !== undefined) data.issue_date = new Date(issue_date);
    if (expiry_date !== undefined) {
        data.expiry_date = new Date(expiry_date);
        const now = new Date();
        const days = Math.ceil((data.expiry_date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (days <= 0) data.status = CertificateStatus.EXPIRED;
        else if (days <= 90) data.status = CertificateStatus.EXPIRING_SOON;
        else data.status = CertificateStatus.VALID;
    }
    if (cpd_hours !== undefined) data.cpd_hours = parseFloat(cpd_hours);
    if (status !== undefined) data.status = status;
    if (verified !== undefined) data.verified = verified;
    if (certificate_url !== undefined) data.certificate_url = certificate_url;

    const cert = await prisma.cPDCertificate.update({
        where: { id },
        data,
        include: { user: { select: { id: true, full_name: true, email: true } } }
    });

    sendResponse(res, 200, cert);
});

export const deleteCertificate = asyncHandler(async (req: Request, res: Response) => {
    const orgId = req.organizationId!;
    const id = req.params.id as string;
    await prisma.cPDCertificate.delete({
        where: { id }
    });

    sendResponse(res, 204, null);
});
