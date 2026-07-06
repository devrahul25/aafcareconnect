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

  async updateSection(organizationId: string, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.updateSection(organizationId, sectionId, data);
  }

  async deleteSection(organizationId: string, courseId: string, sectionId: string) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.deleteSection(organizationId, sectionId);
  }

  async reorderSections(organizationId: string, courseId: string, sectionOrders: { id: string; sort_order: number }[]) {
    await this.getCourseById(organizationId, courseId);
    return coursesRepository.reorderSections(organizationId, courseId, sectionOrders);
  }

  // Videos
  async addVideoToSection(organizationId: string, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createVideo(organizationId, sectionId, data);
  }

  async updateVideo(organizationId: string, courseId: string, sectionId: string, videoId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.updateVideo(organizationId, videoId, data);
  }

  async deleteVideo(organizationId: string, courseId: string, sectionId: string, videoId: string) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.deleteVideo(organizationId, videoId);
  }

  // Documents
  async addDocumentToSection(organizationId: string, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createDocument(organizationId, sectionId, data);
  }

  async updateDocument(organizationId: string, courseId: string, sectionId: string, documentId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.updateDocument(organizationId, documentId, data);
  }

  async deleteDocument(organizationId: string, courseId: string, sectionId: string, documentId: string) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.deleteDocument(organizationId, documentId);
  }

  // Rich Text
  async addRichTextToSection(organizationId: string, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createRichText(organizationId, sectionId, data);
  }

  async updateRichText(organizationId: string, courseId: string, sectionId: string, richTextId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.updateRichText(organizationId, richTextId, data);
  }

  async deleteRichText(organizationId: string, courseId: string, sectionId: string, richTextId: string) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.deleteRichText(organizationId, richTextId);
  }

  // Quizzes
  async addQuizToSection(organizationId: string, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createQuiz(organizationId, sectionId, data);
  }

  async updateQuiz(organizationId: string, courseId: string, sectionId: string, quizId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.updateQuiz(organizationId, quizId, data);
  }

  async deleteQuiz(organizationId: string, courseId: string, sectionId: string, quizId: string) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.deleteQuiz(organizationId, quizId);
  }

  async getQuizById(organizationId: string, quizId: string) {
    const quiz = await coursesRepository.findQuizById(organizationId, quizId);
    if (!quiz) {
      throw new AppError('Quiz not found', 404, 'NOT_FOUND');
    }
    return quiz;
  }

  // Quiz Questions
  async addQuizQuestion(organizationId: string, quizId: string, data: any) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.createQuizQuestion(organizationId, quizId, data);
  }

  async updateQuizQuestion(organizationId: string, quizId: string, questionId: string, data: any) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.updateQuizQuestion(organizationId, questionId, data);
  }

  async deleteQuizQuestion(organizationId: string, quizId: string, questionId: string) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.deleteQuizQuestion(organizationId, questionId);
  }

  // Quiz Answers
  async addQuizAnswer(organizationId: string, quizId: string, questionId: string, data: any) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.createQuizAnswer(organizationId, questionId, data);
  }

  async updateQuizAnswer(organizationId: string, quizId: string, questionId: string, answerId: string, data: any) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.updateQuizAnswer(organizationId, answerId, data);
  }

  async deleteQuizAnswer(organizationId: string, quizId: string, questionId: string, answerId: string) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.deleteQuizAnswer(organizationId, answerId);
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
