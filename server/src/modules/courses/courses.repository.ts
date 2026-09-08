import { prisma } from '../../config/database';
import { Prisma } from '@prisma/client';

export class CoursesRepository {
  async findAll(organizationId: string | null, filter?: { status?: string; category?: string }) {
    const where: Prisma.CourseWhereInput = { organization_id: organizationId };

    if (filter?.status) where.status = filter.status as any;
    if (filter?.category) where.category = filter.category;

    return prisma.course.findMany({
      where,
      orderBy: { sort_order: 'asc' },
    });
  }

  async findById(organizationId: string | null, id: string) {
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

  async create(organizationId: string | null, data: any, userId?: string) {
    return prisma.course.create({
      data: {
        ...data,
        organization_id: organizationId,
        created_by: userId,
        updated_by: userId,
      },
    });
  }

  async update(organizationId: string | null, id: string, data: any, userId?: string) {
    return prisma.course.update({
      where: { id, organization_id: organizationId },
      data: {
        ...data,
        updated_by: userId,
      },
    });
  }

  async duplicate(organizationId: string | null, id: string, userId?: string) {
    const original = await this.findById(organizationId, id);
    if (!original) return null;

    return prisma.course.create({
      data: {
        organization_id: original.organization_id,
        title: original.title + ' (Copy)',
        description: original.description,
        category: original.category,
        level: original.level,
        duration_minutes: original.duration_minutes,
        thumbnail_url: original.thumbnail_url,
        pass_mark: original.pass_mark,
        is_template: original.is_template,
        parent_template_id: original.parent_template_id,
        version: original.version,
        certificate_enabled: original.certificate_enabled,
        certificate_title: original.certificate_title,
        cpd_hours: original.cpd_hours,
        expiry_months: original.expiry_months,
        auto_issue: original.auto_issue,
        allow_retake: original.allow_retake,
        status: 'DRAFT',
        mandatory: original.mandatory,
        target_roles: original.target_roles,
        sort_order: original.sort_order,
        created_by: userId,
        updated_by: userId,
        sections: {
          create: original.sections.map(section => ({
            organization_id: original.organization_id,
            title: section.title,
            type: section.type,
            sort_order: section.sort_order,
            videos: {
              create: section.videos.map(v => ({
                organization_id: original.organization_id,
                title: v.title,
                s3_key: v.s3_key,
                cloudfront_url: v.cloudfront_url,
                duration_secs: v.duration_secs,
                thumbnail_url: v.thumbnail_url,
                transcript: v.transcript,
                sort_order: v.sort_order,
              }))
            },
            documents: {
              create: section.documents.map(d => ({
                organization_id: original.organization_id,
                title: d.title,
                s3_key: d.s3_key,
                file_type: d.file_type,
                file_size: d.file_size,
                sort_order: d.sort_order,
              }))
            },
            rich_text_lessons: {
              create: section.rich_text_lessons.map(r => ({
                organization_id: original.organization_id,
                title: r.title,
                content: r.content as any,
                sort_order: r.sort_order,
              }))
            },
            quizzes: {
              create: section.quizzes.map(q => ({
                organization_id: original.organization_id,
                title: q.title,
                pass_mark: q.pass_mark,
                time_limit: q.time_limit,
                sort_order: q.sort_order,
                questions: {
                  create: q.questions.map(qq => ({
                    organization_id: original.organization_id,
                    question: qq.question,
                    explanation: qq.explanation,
                    sort_order: qq.sort_order,
                    answers: {
                      create: qq.answers.map(qa => ({
                        organization_id: original.organization_id,
                        text: qa.text,
                        is_correct: qa.is_correct,
                        sort_order: qa.sort_order,
                      }))
                    }
                  }))
                }
              }))
            }
          }))
        }
      }
    });
  }

  async assignTemplate(orgId: string, templateId: string, userId?: string) {
    // 1. Fetch the global template (orgId = null)
    const original = await this.findById(null, templateId);
    if (!original || !original.is_template) return null;

    // 2. Duplicate it into the specific organization
    return prisma.course.create({
      data: {
        organization_id: orgId,
        title: original.title,
        description: original.description,
        category: original.category,
        level: original.level,
        duration_minutes: original.duration_minutes,
        thumbnail_url: original.thumbnail_url,
        pass_mark: original.pass_mark,
        is_template: false,
        parent_template_id: original.id,
        version: original.version,
        certificate_enabled: original.certificate_enabled,
        certificate_title: original.certificate_title,
        cpd_hours: original.cpd_hours,
        expiry_months: original.expiry_months,
        auto_issue: original.auto_issue,
        allow_retake: original.allow_retake,
        status: 'PUBLISHED',
        mandatory: original.mandatory,
        target_roles: original.target_roles,
        sort_order: original.sort_order,
        created_by: userId,
        updated_by: userId,
        sections: {
          create: original.sections.map(section => ({
            organization_id: orgId,
            title: section.title,
            type: section.type,
            sort_order: section.sort_order,
            videos: {
              create: section.videos.map(v => ({
                organization_id: orgId,
                title: v.title,
                s3_key: v.s3_key,
                cloudfront_url: v.cloudfront_url,
                duration_secs: v.duration_secs,
                thumbnail_url: v.thumbnail_url,
                transcript: v.transcript,
                sort_order: v.sort_order,
              }))
            },
            documents: {
              create: section.documents.map(d => ({
                organization_id: orgId,
                title: d.title,
                s3_key: d.s3_key,
                file_type: d.file_type,
                file_size: d.file_size,
                sort_order: d.sort_order,
              }))
            },
            rich_text_lessons: {
              create: section.rich_text_lessons.map(r => ({
                organization_id: orgId,
                title: r.title,
                content: r.content as any,
                sort_order: r.sort_order,
              }))
            },
            quizzes: {
              create: section.quizzes.map(q => ({
                organization_id: orgId,
                title: q.title,
                pass_mark: q.pass_mark,
                time_limit: q.time_limit,
                sort_order: q.sort_order,
                questions: {
                  create: q.questions.map(qq => ({
                    organization_id: orgId,
                    question: qq.question,
                    explanation: qq.explanation,
                    sort_order: qq.sort_order,
                    answers: {
                      create: qq.answers.map(qa => ({
                        organization_id: orgId,
                        text: qa.text,
                        is_correct: qa.is_correct,
                        sort_order: qa.sort_order,
                      }))
                    }
                  }))
                }
              }))
            }
          }))
        }
      }
    });
  }


  async delete(organizationId: string | null, id: string) {
    return prisma.course.delete({
      where: { id, organization_id: organizationId },
    });
  }

  // Sections
  async createSection(organizationId: string | null, courseId: string, data: any) {
    return prisma.courseSection.create({
      data: { ...data, course_id: courseId, organization_id: organizationId },
    });
  }

  async updateSection(organizationId: string | null, id: string, data: any) {
    return prisma.courseSection.update({
      where: { id, organization_id: organizationId },
      data,
    });
  }

  async deleteSection(organizationId: string | null, id: string) {
    return prisma.courseSection.delete({ where: { id, organization_id: organizationId } });
  }

  async reorderSections(organizationId: string | null, courseId: string, sectionOrders: { id: string; sort_order: number }[]) {
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
  async createVideo(organizationId: string | null, sectionId: string, data: any) {
    return prisma.video.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }

  async updateVideo(organizationId: string | null, id: string, data: any) {
    return prisma.video.update({ where: { id, organization_id: organizationId }, data });
  }

  async deleteVideo(organizationId: string | null, id: string) {
    return prisma.video.delete({ where: { id, organization_id: organizationId } });
  }

  // Documents
  async createDocument(organizationId: string | null, sectionId: string, data: any) {
    return prisma.document.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }

  async updateDocument(organizationId: string | null, id: string, data: any) {
    return prisma.document.update({ where: { id, organization_id: organizationId }, data });
  }

  async deleteDocument(organizationId: string | null, id: string) {
    return prisma.document.delete({ where: { id, organization_id: organizationId } });
  }

  // Rich Text
  async createRichText(organizationId: string | null, sectionId: string, data: any) {
    return prisma.richTextLesson.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }

  async updateRichText(organizationId: string | null, id: string, data: any) {
    return prisma.richTextLesson.update({ where: { id, organization_id: organizationId }, data });
  }

  async deleteRichText(organizationId: string | null, id: string) {
    return prisma.richTextLesson.delete({ where: { id, organization_id: organizationId } });
  }

  // Quizzes
  async createQuiz(organizationId: string | null, sectionId: string, data: any) {
    return prisma.quiz.create({ data: { ...data, section_id: sectionId, organization_id: organizationId } });
  }

  async updateQuiz(organizationId: string | null, id: string, data: any) {
    return prisma.quiz.update({ where: { id, organization_id: organizationId }, data });
  }

  async deleteQuiz(organizationId: string | null, id: string) {
    return prisma.quiz.delete({ where: { id, organization_id: organizationId } });
  }

  async findQuizById(organizationId: string | null, id: string) {
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
  async createQuizQuestion(organizationId: string | null, quizId: string, data: any) {
    return prisma.quizQuestion.create({
      data: { ...data, quiz_id: quizId, organization_id: organizationId },
      include: { answers: true },
    });
  }

  async updateQuizQuestion(organizationId: string | null, id: string, data: any) {
    return prisma.quizQuestion.update({
      where: { id, organization_id: organizationId },
      data,
      include: { answers: true },
    });
  }

  async deleteQuizQuestion(organizationId: string | null, id: string) {
    return prisma.quizQuestion.delete({ where: { id, organization_id: organizationId } });
  }

  // Quiz Answers
  async createQuizAnswer(organizationId: string | null, questionId: string, data: any) {
    return prisma.quizAnswer.create({
      data: { ...data, question_id: questionId, organization_id: organizationId },
    });
  }

  async updateQuizAnswer(organizationId: string | null, id: string, data: any) {
    if (data.is_correct === true) {
      const target = await prisma.quizAnswer.findUnique({ where: { id } });
      if (target) {
        await prisma.quizAnswer.updateMany({
          where: { question_id: target.question_id, organization_id: organizationId, id: { not: id } },
          data: { is_correct: false }
        });
      }
    }
    return prisma.quizAnswer.update({ where: { id, organization_id: organizationId }, data });
  }

  async deleteQuizAnswer(organizationId: string | null, id: string) {
    return prisma.quizAnswer.delete({ where: { id, organization_id: organizationId } });
  }

  // ─── Categories ────────────────────────────────────────────────────────────

  async findDistinctCategories(organizationId: string | null): Promise<string[]> {
    const rows = await prisma.course.findMany({
      where: { organization_id: organizationId, deleted_at: null },
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    });
    return rows.map((r) => r.category).filter(Boolean);
  }

  async getCourseCountByCategory(organizationId: string | null, category: string): Promise<number> {
    return prisma.course.count({
      where: { organization_id: organizationId, category, deleted_at: null },
    });
  }

  async renameCategory(organizationId: string | null, oldName: string, newName: string): Promise<number> {
    const result = await prisma.course.updateMany({
      where: { organization_id: organizationId, category: oldName },
      data: { category: newName },
    });
    return result.count;
  }
}

export const coursesRepository = new CoursesRepository();
