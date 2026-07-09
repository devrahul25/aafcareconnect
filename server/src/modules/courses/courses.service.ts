import { coursesRepository } from './courses.repository';
import { AppError } from '../../shared/errors/AppError';
import { prisma } from '../../config/database';

export class CoursesService {
  async getCourses(organizationId: string | null, query?: any) {
    return coursesRepository.findAll(organizationId, query);
  }

  async getCourseById(organizationId: string | null, id: string) {
    const course = await coursesRepository.findById(organizationId, id);
    if (!course) {
      throw new AppError('Course not found', 404, 'NOT_FOUND');
    }
    return course;
  }

  async createCourse(organizationId: string | null, data: any, userId?: string) {
    return coursesRepository.create(organizationId, data, userId);
  }

  async updateCourse(organizationId: string | null, id: string, data: any, userId?: string) {
    // Ensure course exists
    await this.getCourseById(organizationId, id);
    return coursesRepository.update(organizationId, id, data, userId);
  }

  async deleteCourse(organizationId: string | null, id: string) {
    // Ensure course exists
    await this.getCourseById(organizationId, id);
    // Note: Due to cascading deletes configured in Prisma, deleting a course
    // will delete all sections, videos, docs, quizzes etc automatically.
    return coursesRepository.delete(organizationId, id);
  }

  // --- Section & Content Management ---

  async addSection(organizationId: string | null, courseId: string, data: any) {
    await this.getCourseById(organizationId, courseId);
    return coursesRepository.createSection(organizationId, courseId, data);
  }

  async updateSection(organizationId: string | null, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.updateSection(organizationId, sectionId, data);
  }

  async deleteSection(organizationId: string | null, courseId: string, sectionId: string) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.deleteSection(organizationId, sectionId);
  }

  async reorderSections(organizationId: string | null, courseId: string, sectionOrders: { id: string; sort_order: number }[]) {
    await this.getCourseById(organizationId, courseId);
    return coursesRepository.reorderSections(organizationId, courseId, sectionOrders);
  }

  // Videos
  async addVideoToSection(organizationId: string | null, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createVideo(organizationId, sectionId, data);
  }

  async updateVideo(organizationId: string | null, courseId: string, sectionId: string, videoId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.updateVideo(organizationId, videoId, data);
  }

  async deleteVideo(organizationId: string | null, courseId: string, sectionId: string, videoId: string) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.deleteVideo(organizationId, videoId);
  }

  // Documents
  async addDocumentToSection(organizationId: string | null, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createDocument(organizationId, sectionId, data);
  }

  async updateDocument(organizationId: string | null, courseId: string, sectionId: string, documentId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.updateDocument(organizationId, documentId, data);
  }

  async deleteDocument(organizationId: string | null, courseId: string, sectionId: string, documentId: string) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.deleteDocument(organizationId, documentId);
  }

  // Rich Text
  async addRichTextToSection(organizationId: string | null, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createRichText(organizationId, sectionId, data);
  }

  async updateRichText(organizationId: string | null, courseId: string, sectionId: string, richTextId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.updateRichText(organizationId, richTextId, data);
  }

  async deleteRichText(organizationId: string | null, courseId: string, sectionId: string, richTextId: string) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.deleteRichText(organizationId, richTextId);
  }

  // Quizzes
  async addQuizToSection(organizationId: string | null, courseId: string, sectionId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.createQuiz(organizationId, sectionId, data);
  }

  async updateQuiz(organizationId: string | null, courseId: string, sectionId: string, quizId: string, data: any) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.updateQuiz(organizationId, quizId, data);
  }

  async deleteQuiz(organizationId: string | null, courseId: string, sectionId: string, quizId: string) {
    await this.verifySectionExists(organizationId, courseId, sectionId);
    return coursesRepository.deleteQuiz(organizationId, quizId);
  }

  async getQuizById(organizationId: string | null, quizId: string) {
    const quiz = await coursesRepository.findQuizById(organizationId, quizId);
    if (!quiz) {
      throw new AppError('Quiz not found', 404, 'NOT_FOUND');
    }
    return quiz;
  }

  // Quiz Questions
  async addQuizQuestion(organizationId: string | null, quizId: string, data: any) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.createQuizQuestion(organizationId, quizId, data);
  }

  async updateQuizQuestion(organizationId: string | null, quizId: string, questionId: string, data: any) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.updateQuizQuestion(organizationId, questionId, data);
  }

  async deleteQuizQuestion(organizationId: string | null, quizId: string, questionId: string) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.deleteQuizQuestion(organizationId, questionId);
  }

  // Quiz Answers
  async addQuizAnswer(organizationId: string | null, quizId: string, questionId: string, data: any) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.createQuizAnswer(organizationId, questionId, data);
  }

  async updateQuizAnswer(organizationId: string | null, quizId: string, questionId: string, answerId: string, data: any) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.updateQuizAnswer(organizationId, answerId, data);
  }

  async deleteQuizAnswer(organizationId: string | null, quizId: string, questionId: string, answerId: string) {
    await this.getQuizById(organizationId, quizId);
    return coursesRepository.deleteQuizAnswer(organizationId, answerId);
  }

  private async verifySectionExists(organizationId: string | null, courseId: string, sectionId: string) {
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

  // ─── Category Management ────────────────────────────────────────────────────

  /** Default categories shown when no courses exist yet */
  private readonly DEFAULT_CATEGORIES = [
    'Safeguarding',
    'Therapeutic Parenting',
    'Attachment',
    'Health & Safety',
    'Legislation',
    'Equality & Diversity',
    'Child Development',
    'First Aid',
    'General',
  ];

  async getCategories(organizationId: string | null): Promise<string[]> {
    const dbCategories = await coursesRepository.findDistinctCategories(organizationId);
    if (dbCategories.length === 0) {
      return this.DEFAULT_CATEGORIES;
    }
    // Merge: DB values first, then any defaults not already present
    const merged = [...new Set([...dbCategories, ...this.DEFAULT_CATEGORIES])];
    return merged.sort();
  }

  async renameCategory(organizationId: string | null, oldName: string, newName: string) {
    if (!oldName || !newName) {
      throw new AppError('Old name and new name are required', 400, 'VALIDATION_ERROR');
    }
    if (oldName === newName) {
      throw new AppError('New name must differ from old name', 400, 'VALIDATION_ERROR');
    }
    const count = await coursesRepository.renameCategory(organizationId, oldName, newName);
    return { renamed: count, old_name: oldName, new_name: newName };
  }

  async deleteCategory(organizationId: string | null, categoryName: string) {
    const courseCount = await coursesRepository.getCourseCountByCategory(organizationId, categoryName);
    if (courseCount > 0) {
      throw new AppError(
        `Cannot delete "${categoryName}" — ${courseCount} course${courseCount > 1 ? 's are' : ' is'} still assigned to it. Reassign them first.`,
        409,
        'CATEGORY_IN_USE'
      );
    }
    // Category has no courses — it only existed in the pre-seeded list; nothing to delete from DB
    return { deleted: categoryName };
  }
}

export const coursesService = new CoursesService();
