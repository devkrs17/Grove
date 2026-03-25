variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
}

variable "auth0_domain" {
  description = "Auth0 tenant domain (e.g. grove-dev.us.auth0.com)"
  type        = string
}

variable "auth0_tf_client_id" {
  description = "Client ID of the Terraform M2M app (bootstrap app)"
  type        = string
  sensitive   = true
}

variable "auth0_tf_client_secret" {
  description = "Client secret of the Terraform M2M app (bootstrap app)"
  type        = string
  sensitive   = true
}

variable "dashboard_app_url" {
  description = "Dashboard app base URL"
  type        = string
}

variable "web_app_url" {
  description = "Web/storefront app base URL"
  type        = string
}

variable "seed_org_name" {
  description = "Display name for the seed development organization"
  type        = string
  default     = "Grove Dev Org"
}

variable "seed_org_slug" {
  description = "Slug for the seed org (must match a Payload tenant slug)"
  type        = string
  default     = "grove-dev"
}
