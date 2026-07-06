-- CreateEnum
CREATE TYPE "EnrolmentStatus" AS ENUM ('ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ComplianceType" AS ENUM ('ALLEGATION', 'COMPLAINT', 'SAFER_CARING', 'MISSING_FROM_CARE', 'REG_44', 'AUDIT', 'POLICY');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "CompliancePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('VALID', 'EXPIRING_SOON', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TrainingCompliance" AS ENUM ('COMPLIANT', 'PARTIAL', 'NON_COMPLIANT');

-- CreateEnum
CREATE TYPE "CarerStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DEREGISTERED', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('SUPERVISING_SOCIAL_WORKER', 'INDEPENDENT_ASSESSOR', 'PANEL_MEMBER', 'TRAINER', 'MANAGER', 'ADMINISTRATOR');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('EMPLOYED', 'SELF_EMPLOYED', 'CONTRACTOR');

-- CreateEnum
CREATE TYPE "WorkforceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "PlacementType" AS ENUM ('EMERGENCY', 'SHORT_TERM', 'LONG_TERM', 'RESPITE', 'PARENT_CHILD');

-- CreateEnum
CREATE TYPE "PlacementStatus" AS ENUM ('REFERRAL', 'MATCHING', 'ACTIVE', 'ENDED', 'BREAKDOWN');

-- CreateTable
CREATE TABLE "course_enrolments" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "EnrolmentStatus" NOT NULL DEFAULT 'ENROLLED',
    "progress_percent" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER,
    "enrolled_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_date" TIMESTAMP(3),
    "certificate_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_enrolments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_records" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "type" "ComplianceType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assigned_to_id" TEXT,
    "carer_id" TEXT,
    "child_name" TEXT,
    "incident_date" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "status" "ComplianceStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "CompliancePriority" NOT NULL DEFAULT 'MEDIUM',
    "outcome" TEXT,
    "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cpd_certificates" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT,
    "issue_date" TIMESTAMP(3) NOT NULL,
    "expiry_date" TIMESTAMP(3),
    "certificate_url" TEXT,
    "cpd_hours" DOUBLE PRECISION,
    "category" TEXT,
    "status" "CertificateStatus" NOT NULL DEFAULT 'VALID',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cpd_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foster_carers" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "ssw_id" TEXT,
    "address" TEXT,
    "approval_date" TIMESTAMP(3),
    "approval_category" TEXT,
    "max_placements" INTEGER,
    "current_placements" INTEGER NOT NULL DEFAULT 0,
    "annual_review_due" TIMESTAMP(3),
    "training_compliance" "TrainingCompliance" NOT NULL DEFAULT 'PARTIAL',
    "status" "CarerStatus" NOT NULL DEFAULT 'ACTIVE',
    "profile_photo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "foster_carers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workforce_members" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role_type" "RoleType" NOT NULL,
    "employment_type" "EmploymentType",
    "dbs_number" TEXT,
    "dbs_expiry" TIMESTAMP(3),
    "contract_url" TEXT,
    "availability" TEXT,
    "status" "WorkforceStatus" NOT NULL DEFAULT 'ACTIVE',
    "caseload_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workforce_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "placements" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "child_name" TEXT NOT NULL,
    "child_dob" TIMESTAMP(3),
    "carer_id" TEXT NOT NULL,
    "ssw_id" TEXT,
    "referral_source" TEXT,
    "placement_start" TIMESTAMP(3),
    "placement_end" TIMESTAMP(3),
    "placement_type" "PlacementType" NOT NULL,
    "status" "PlacementStatus" NOT NULL DEFAULT 'REFERRAL',
    "notes" TEXT,
    "needs_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "placements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "course_enrolments_organization_id_idx" ON "course_enrolments"("organization_id");

-- CreateIndex
CREATE INDEX "course_enrolments_user_id_idx" ON "course_enrolments"("user_id");

-- CreateIndex
CREATE INDEX "course_enrolments_status_idx" ON "course_enrolments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "course_enrolments_course_id_user_id_key" ON "course_enrolments"("course_id", "user_id");

-- CreateIndex
CREATE INDEX "compliance_records_organization_id_idx" ON "compliance_records"("organization_id");

-- CreateIndex
CREATE INDEX "compliance_records_status_idx" ON "compliance_records"("status");

-- CreateIndex
CREATE INDEX "compliance_records_priority_idx" ON "compliance_records"("priority");

-- CreateIndex
CREATE INDEX "compliance_records_type_idx" ON "compliance_records"("type");

-- CreateIndex
CREATE INDEX "cpd_certificates_organization_id_idx" ON "cpd_certificates"("organization_id");

-- CreateIndex
CREATE INDEX "cpd_certificates_user_id_idx" ON "cpd_certificates"("user_id");

-- CreateIndex
CREATE INDEX "cpd_certificates_status_idx" ON "cpd_certificates"("status");

-- CreateIndex
CREATE UNIQUE INDEX "foster_carers_user_id_key" ON "foster_carers"("user_id");

-- CreateIndex
CREATE INDEX "foster_carers_organization_id_idx" ON "foster_carers"("organization_id");

-- CreateIndex
CREATE INDEX "foster_carers_status_idx" ON "foster_carers"("status");

-- CreateIndex
CREATE INDEX "foster_carers_email_idx" ON "foster_carers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "workforce_members_user_id_key" ON "workforce_members"("user_id");

-- CreateIndex
CREATE INDEX "workforce_members_organization_id_idx" ON "workforce_members"("organization_id");

-- CreateIndex
CREATE INDEX "workforce_members_status_idx" ON "workforce_members"("status");

-- CreateIndex
CREATE INDEX "workforce_members_role_type_idx" ON "workforce_members"("role_type");

-- CreateIndex
CREATE INDEX "placements_organization_id_idx" ON "placements"("organization_id");

-- CreateIndex
CREATE INDEX "placements_carer_id_idx" ON "placements"("carer_id");

-- CreateIndex
CREATE INDEX "placements_status_idx" ON "placements"("status");

-- AddForeignKey
ALTER TABLE "course_enrolments" ADD CONSTRAINT "course_enrolments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_enrolments" ADD CONSTRAINT "course_enrolments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_records" ADD CONSTRAINT "compliance_records_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_records" ADD CONSTRAINT "compliance_records_carer_id_fkey" FOREIGN KEY ("carer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cpd_certificates" ADD CONSTRAINT "cpd_certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foster_carers" ADD CONSTRAINT "foster_carers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foster_carers" ADD CONSTRAINT "foster_carers_ssw_id_fkey" FOREIGN KEY ("ssw_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workforce_members" ADD CONSTRAINT "workforce_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_carer_id_fkey" FOREIGN KEY ("carer_id") REFERENCES "foster_carers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placements" ADD CONSTRAINT "placements_ssw_id_fkey" FOREIGN KEY ("ssw_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
