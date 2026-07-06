import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class CoursesRepository {
  async findAll(organizationId: string, filter?: { status?: string; category?: string }) {
    const where: Prisma.CourseWhereInput = { organization_id: organizationId };

    if (filter?.status) where.status = filter.status as any;
    if (filter?.category) where.category = filter.category;

    return prisma.course.findMany({
      where,
      orderBy: { sort_order: 'asc' },
    });
  }

  async findById(organizationId: string, id: string) {
    return prisma.course.findFirst({
      where: { id, organization_id: organizationId },
      include: {
        sections: {
          orderBy: { sort_order: 'asc' },
          include: {
            videos: { orderBy: { sort_order: 'asc' } },
            documents: { orderBy: { sort_order: 'asc' } },
            rich_text_lessons: { orderBy: { sort_order: 'asc' } },
            quizzes: {
              orderBy: { sort_order: 'asc' },
              include: {
                questions: {
                  orderBy: { sort_order: 'asc' },
                  include: { answers: { orderBy: { sort_order: 'asc' } } }
                }
              }
            },
          },
        },
      },
    });
  }

  async create(organizationId: string, data: any, userId?: string) {
    return prisma.course.create({
      data: {
        ...data,
        organization_id: organizationId,
        created_by: userId,
        updated_by: userId,
      },
    });
  }

  async update(organizationId: string, id: string, data: any, userId?: string) {
    return prisma.course.update({
      where: { id, organization_id: organizationId },
      data: {
        ...data,
        updated_by: userId,
      },
    });
  }

  async delete(organizationId: string, id: string) {
    return prisma.course.delete({
      where: { id, organization_id: organizationId },
    });
  }

  // Sections
  async createSection(organizationId: string, courseId: string, data: any) {
    return prisma.courseSection.create({
      data: { ...data, course_id: courseId, organization_id: organizationId },
    });
  }

  async updateSection(organizationId: string, id: string, data: any) {
    return prisma.courseSection.update({
      where: { id, organization_id: organizationId },
      data,
    });
  }

  async deleteSection(organizationId: string, id: string) {
    return prisma.courseSection.delete({ where: { id, organization_id: organizationId } });
  }

  async reorderSections(organizationId: string, courseId: string, sectionOrders: { id: string; sort_order: number }[]) {
    return prisma.$transaction(
      sectionOrders.map((item) =>
        prisma.courseSection.update({
          where: { id: item.id, course_id: courseId, organization_id: organizationId },
          data: { sort_order: item.sort_order },
        })
      )
    );
  }

  // Videos
  async createVideo(organizationId: string, sectionId: string, data: any) {
    return prisma.video.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }

  async updateVideo(organizationId: string, id: string, data: any) {
    return prisma.video.update({ where: { id, organization_id: organizationId }, data });
  }

  async deleteVideo(organizationId: string, id: string) {
    return prisma.video.delete({ where: { id, organization_id: organizationId } });
  }

  // Documents
  async createDocument(organizationId: string, sectionId: string, data: any) {
    return prisma.document.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }

  async updateDocument(organizationId: string, id: string, data: any) {
    return prisma.document.update({ where: { id, organization_id: organizationId }, data });
  }

  async deleteDocument(organizationId: string, id: string) {
    return prisma.document.delete({ where: { id, organization_id: organizationId } });
  }

  // Rich Text
  async createRichText(organizationId: string, sectionId: string, data: any) {
    return prisma.richTextLesson.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }

  async updateRichText(organizationId: string, id: string, data: any) {
    return prisma.richTextLesson.update({ where: { id, organization_id: organizationId }, data });
  }

  async deleteRichText(organizationId: string, id: string) {
    return prisma.richTextLesson.delete({ where: { id, organization_id: organizationId } });
  }

  // Quizzes
  async createQuiz(organizationId: string, sectionId: string, data: any) {
    return prisma.quiz.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }

  async updateQuiz(organizationId: string, id: string, data: any) {
    return prisma.quiz.update({ where: { id, organization_id: organizationId }, data });
  }

  async deleteQuiz(organizationId: string, id: string) {
    return prisma.quiz.delete({ where: { id, organization_id: organizationId } });
  }

  async findQuizById(organizationId: string, id: string) {
    return prisma.quiz.findFirst({
      where: { id, organization_id: organizationId },
      include: {
        questions: {
          orderBy: { sort_order: 'asc' },
          include: { answers: { orderBy: { sort_order: 'asc' } } },
        },
      },
    });
  }

  // Quiz Questions
  async createQuizQuestion(organizationId: string, quizId: string, data: any) {
    return prisma.quizQuestion.create({
      data: { ...data, quiz_id: quizId, organization_id: organizationId },
      include: { answers: true },
    });
  }

  async updateQuizQuestion(organizationId: string, id: string, data: any) {
    return prisma.quizQuestion.update({
      where: { id, organization_id: organizationId },
      data,
      include: { answers: true },
    });
  }

  async deleteQuizQuestion(organizationId: string, id: string) {
    return prisma.quizQuestion.delete({ where: { id, organization_id: organizationId } });
  }

  // Quiz Answers
  async createQuizAnswer(organizationId: string, questionId: string, data: any) {
    return prisma.quizAnswer.create({
      data: { ...data, question_id: questionId, organization_id: organizationId },
    });
  }

  async updateQuizAnswer(organizationId: string, id: string, data: any) {
    return prisma.quizAnswer.update({ where: { id, organization_id: organizationId }, data });
  }

  async deleteQuizAnswer(organizationId: string, id: string) {
    return prisma.quizAnswer.delete({ where: { id, organization_id: organizationId } });
  }

  // ─── Categories ────────────────────────────────────────────────────────────

  async findDistinctCategories(organizationId: string): Promise<string[]> {
    const rows = await prisma.course.findMany({
      where: { organization_id: organizationId, deleted_at: null },
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    });
    return rows.map((r) => r.category).filter(Boolean);
  }

  async getCourseCountByCategory(organizationId: string, category: string): Promise<number> {
    return prisma.course.count({
      where: { organization_id: organizationId, category, deleted_at: null },
    });
  }

  async renameCategory(organizationId: string, oldName: string, newName: string): Promise<number> {
    const result = await prisma.course.updateMany({
      where: { organization_id: organizationId, category: oldName },
      data: { category: newName },
    });
    return result.count;
  }
}

export const coursesRepository = new CoursesRepository();
