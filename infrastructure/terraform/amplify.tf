# ─── AWS Amplify Apps ────────────────────────────────────────────────────────
#
# Frontend applications:
# 1. Shri Academy (artifacts/shri-academy)
# 2. Shri Mentor (artifacts/sri-platform)
#
# These are deployed to AWS Amplify using the IAM service roles provided.

variable "shri_academy_amplify_role_arn" {
  description = "Optional custom IAM Service Role ARN for shri-academy Amplify app"
  type        = string
  default     = ""
}

variable "shri_mentor_amplify_role_arn" {
  description = "Optional custom IAM Service Role ARN for shri-mentor Amplify app"
  type        = string
  default     = ""
}

locals {
  shri_academy_amplify_role_arn = var.shri_academy_amplify_role_arn != "" ? var.shri_academy_amplify_role_arn : "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/shri-academy-amplify-role"
  shri_mentor_amplify_role_arn  = var.shri_mentor_amplify_role_arn != "" ? var.shri_mentor_amplify_role_arn : "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/shri-mentor-amplify-role"
}

# ── Shri Academy Amplify App ──────────────────────────────────────────────────
resource "aws_amplify_app" "shri_academy" {
  name                 = "shri-academy"
  repository           = "https://github.com/${var.github_org}/${var.github_monorepo}"
  iam_service_role_arn = local.shri_academy_amplify_role_arn

  # Vite environment variables required for build constraints
  environment_variables = {
    PORT                      = "8080"
    BASE_PATH                 = "/"
    AMPLIFY_MONOREPO_APP_ROOT = "artifacts/shri-academy"
  }

  # SPA custom rewrite rule to support client-side routing
  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|json)$)([^.]+$)/>"
    status = "200"
    target = "/index.html"
  }
}

resource "aws_amplify_branch" "shri_academy_main" {
  app_id      = aws_amplify_app.shri_academy.id
  branch_name = "main"

  framework         = "Web"
  stage             = "PRODUCTION"
  enable_auto_build = true
}

# ── Shri Mentor Amplify App ───────────────────────────────────────────────────
resource "aws_amplify_app" "shri_mentor" {
  name                 = "shri-mentor"
  repository           = "https://github.com/${var.github_org}/${var.github_monorepo}"
  iam_service_role_arn = local.shri_mentor_amplify_role_arn

  # Vite environment variables required for build constraints
  environment_variables = {
    PORT                      = "8080"
    BASE_PATH                 = "/"
    AMPLIFY_MONOREPO_APP_ROOT = "artifacts/sri-platform"
  }

  # SPA custom rewrite rule to support client-side routing
  custom_rule {
    source = "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|json)$)([^.]+$)/>"
    status = "200"
    target = "/index.html"
  }
}

resource "aws_amplify_branch" "shri_mentor_main" {
  app_id      = aws_amplify_app.shri_mentor.id
  branch_name = "main"

  framework         = "Web"
  stage             = "PRODUCTION"
  enable_auto_build = true
}

# ── Outputs ───────────────────────────────────────────────────────────────────
output "amplify_shri_academy_app_id" {
  value       = aws_amplify_app.shri_academy.id
  description = "AWS Amplify App ID for shri-academy"
}

output "amplify_shri_academy_default_domain" {
  value       = aws_amplify_app.shri_academy.default_domain
  description = "AWS Amplify Default Domain for shri-academy"
}

output "amplify_shri_mentor_app_id" {
  value       = aws_amplify_app.shri_mentor.id
  description = "AWS Amplify App ID for shri-mentor"
}

output "amplify_shri_mentor_default_domain" {
  value       = aws_amplify_app.shri_mentor.default_domain
  description = "AWS Amplify Default Domain for shri-mentor"
}
