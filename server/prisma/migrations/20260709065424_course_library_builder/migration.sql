-- AlterTable
ALTER TABLE "course_sections" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "auto_issue" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "certificate_title" TEXT,
ADD COLUMN     "cpd_hours" DOUBLE PRECISION,
ADD COLUMN     "expiry_months" INTEGER,
ADD COLUMN     "is_template" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parent_template_id" TEXT,
ADD COLUMN     "version" TEXT NOT NULL DEFAULT '1.0',
ALTER COLUMN "organization_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "documents" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quiz_answers" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quiz_questions" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quizzes" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "rich_text_lessons" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "organization_id" DROP NOT NULL;
