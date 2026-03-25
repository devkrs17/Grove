resource "auth0_client" "dashboard" {
  name               = "Grove Dashboard (${var.environment})"
  app_type           = "regular_web"
  oidc_conformant    = true
  organization_usage = "require"
  callbacks          = ["${var.dashboard_app_url}/api/auth/callback"]
  allowed_logout_urls = [var.dashboard_app_url]
  web_origins        = [var.dashboard_app_url]
  grant_types        = ["authorization_code", "refresh_token"]

  jwt_configuration {
    alg = "RS256"
  }

  refresh_token {
    rotation_type   = "rotating"
    expiration_type = "expiring"
    token_lifetime  = 2592000 # 30 days
    leeway          = 0
  }
}

resource "auth0_client" "web" {
  name               = "Grove Web (${var.environment})"
  app_type           = "regular_web"
  oidc_conformant    = true
  organization_usage = "allow"
  callbacks          = ["${var.web_app_url}/api/auth/callback"]
  allowed_logout_urls = [var.web_app_url]
  web_origins        = [var.web_app_url]
  grant_types        = ["authorization_code", "refresh_token"]

  jwt_configuration {
    alg = "RS256"
  }

  refresh_token {
    rotation_type   = "rotating"
    expiration_type = "expiring"
    token_lifetime  = 2592000
    leeway          = 0
  }
}

resource "auth0_client" "m2m" {
  name        = "Grove Backend (${var.environment})"
  app_type    = "non_interactive"
  grant_types = ["client_credentials"]

  jwt_configuration {
    alg = "RS256"
  }
}
