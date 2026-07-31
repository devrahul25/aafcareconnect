/*
  Warnings:

  - Changed the type of `type` on the `organizations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "OrganizationType";

-- CreateTable
CREATE TABLE "organization_type_options" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_type_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_category_options" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_category_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_learner_assignments" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "staff_id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "assigned_by_id" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_learner_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module_progress" (
    "id" TEXT NOT NULL,
    "enrolment_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_progress" (
    "id" TEXT NOT NULL,
    "enrolment_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "lesson_type" TEXT NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "time_spent" INTEGER NOT NULL DEFAULT 0,
    "quiz_score" INTEGER,
    "last_viewed_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "employee_id" TEXT,
    "job_role" TEXT,
    "department" TEXT,
    "line_manager" TEXT,
    "start_date" TIMESTAMP(3),
    "employment_status" TEXT,
    "learning_group" TEXT,
    "mandatory_learning_path" TEXT,
    "compliance_category" TEXT,
    "certificate_renewal_cycle" TEXT,
    "notification_preferences" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learner_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "employee_id" TEXT,
    "job_title" TEXT,
    "department" TEXT,
    "employment_type" TEXT,
    "start_date" TIMESTAMP(3),
    "responsibility_scope" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_type_options_name_key" ON "organization_type_options"("name");

-- CreateIndex
CREATE UNIQUE INDEX "course_category_options_name_key" ON "course_category_options"("name");

-- CreateIndex
CREATE INDEX "staff_learner_assignments_organization_id_idx" ON "staff_learner_assignments"("organization_id");

-- CreateIndex
CREATE INDEX "staff_learner_assignments_staff_id_idx" ON "staff_learner_assignments"("staff_id");

-- CreateIndex
CREATE INDEX "staff_learner_assignments_learner_id_idx" ON "staff_learner_assignments"("learner_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_learner_assignments_staff_id_learner_id_key" ON "staff_learner_assignments"("staff_id", "learner_id");

-- CreateIndex
CREATE UNIQUE INDEX "module_progress_enrolment_id_module_id_key" ON "module_progress"("enrolment_id", "module_id");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_progress_enrolment_id_lesson_id_lesson_type_key" ON "lesson_progress"("enrolment_id", "lesson_id", "lesson_type");

-- CreateIndex
CREATE UNIQUE INDEX "learner_profiles_user_id_key" ON "learner_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "learner_profiles_learner_id_key" ON "learner_profiles"("learner_id");

-- CreateIndex
CREATE INDEX "learner_profiles_organization_id_idx" ON "learner_profiles"("organization_id");

-- CreateIndex
CREATE INDEX "learner_profiles_learner_id_idx" ON "learner_profiles"("learner_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_profiles_user_id_key" ON "staff_profiles"("user_id");

-- CreateIndex
CREATE INDEX "staff_profiles_organization_id_idx" ON "staff_profiles"("organization_id");

-- AddForeignKey
ALTER TABLE "staff_learner_assignments" ADD CONSTRAINT "staff_learner_assignments_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_learner_assignments" ADD CONSTRAINT "staff_learner_assignments_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_learner_assignments" ADD CONSTRAINT "staff_learner_assignments_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_learner_assignments" ADD CONSTRAINT "staff_learner_assignments_assigned_by_id_fkey" FOREIGN KEY ("assigned_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_enrolment_id_fkey" FOREIGN KEY ("enrolment_id") REFERENCES "course_enrolments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_progress" ADD CONSTRAINT "module_progress_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "course_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_enrolment_id_fkey" FOREIGN KEY ("enrolment_id") REFERENCES "course_enrolments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_profiles" ADD CONSTRAINT "learner_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner_profiles" ADD CONSTRAINT "learner_profiles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_profiles" ADD CONSTRAINT "staff_profiles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
