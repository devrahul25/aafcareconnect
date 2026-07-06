import { coursesRepository } from './courses.repository';
import { AppError } from '../../shared/errors/AppError';
import { prisma } from '../../config/database';

export class CoursesService {
  async getCourses(organizationId: string, query?: any) {
    return coursesRepository.findAll(organizationId, query);
  }

  async getCourseById(organizationId: string, id: string) {
    const course = await coursesRepository.findById(organizationId, id);
    if (!course) {
      throw new AppError('Course not found', 404, 'NOT_FOUND');
    }
    return course;
  }

  async createCourse(organizationId: string, data: any, userId?: string) {
    return coursesRepository.create(organizationId, data, userId);
  }

  async updateCourse(organizationId: string, id: string, data: any, userId?: string) {
    // Ensure course exists
    await this.getCourseById(organizationId, id);
    return coursesRepository.update(organizationId, id, data, userId);
  }

  async deleteCourse(organizationId: string, id: string) {
    // Ensure course exists
    await this.getCourseById(organizationId, id);
    // Note: Due to cascading deletes configured in Prisma, deleting a course
    // will delete all sections, videos, docs, quizzes etc automatically.
    return coursesRepository.delete(organizationId, id);
  }

  // --- Section & Content Management ---
  
  async addSection(organizationId: string, courseId: string, data: any) {
    await this.getCourseById(organizationId, courseId);
    return coursesRepository.createSection(organizationId, courseId, data);
  }

  async addVideoToSection(organizationId: string, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createVideo(organizationId, sectionId, data);
  }

  async addDocumentToSection(organizationId: string, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createDocument(organizationId, sectionId, data);
  }

  async addRichTextToSection(organizationId: string, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createRichText(organizationId, sectionId, data);
  }

  async addQuizToSection(organizationId: string, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createQuiz(organizationId, sectionId, data);
  }

  private async verifySectionExists(organizationId: string, courseId: string, sectionId: string) {
    const count = await prisma.courseSection.count({
      where: {
        id: sectionId,
        course_id: courseId,
        course: { organization_id: organizationId }
      }
    });
    
    if (count === 0) {
      throw new AppError('Section not found in this course', 404, 'NOT_FOUND');
    }
  }
}

export const coursesService = new CoursesService();
