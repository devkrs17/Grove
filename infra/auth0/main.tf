terraform {
  required_version = ">= 1.5"

  required_providers {
    auth0 = {
      source  = "auth0/auth0"
      version = "~> 1.0"
    }
  }

  # TODO: Migrate to remote backend (S3, Terraform Cloud) when team grows.
  # Local state is fine for single-developer use.
}

# Provider reads AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET from env vars.
provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_tf_client_id
  client_secret = var.auth0_tf_client_secret
}
