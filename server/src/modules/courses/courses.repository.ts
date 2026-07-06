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

  async deleteSection(organizationId: string, id: string) {
    return prisma.courseSection.delete({ where: { id, organization_id: organizationId } });
  }

  // Contents
  async createVideo(organizationId: string, sectionId: string, data: any) {
    return prisma.video.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }

  async createDocument(organizationId: string, sectionId: string, data: any) {
    return prisma.document.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }

  async createRichText(organizationId: string, sectionId: string, data: any) {
    return prisma.richTextLesson.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }

  async createQuiz(organizationId: string, sectionId: string, data: any) {
    return prisma.quiz.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }
}

export const coursesRepository = new CoursesRepository();
