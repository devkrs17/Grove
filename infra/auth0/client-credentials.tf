resource "auth0_client_credentials" "dashboard" {
  client_id             = auth0_client.dashboard.id
  authentication_method = "client_secret_post"
}

resource "auth0_client_credentials" "web" {
  client_id             = auth0_client.web.id
  authentication_method = "client_secret_post"
}

resource "auth0_client_credentials" "m2m" {
  client_id             = auth0_client.m2m.id
  authentication_method = "client_secret_post"
}

resource "auth0_client_grant" "management_api" {
  client_id = auth0_client.m2m.id
  audience  = "https://${var.auth0_domain}/api/v2/"
  scopes = [
    "read:users",
    "update:users",
    "create:users",
    "read:organizations",
    "create:organizations",
    "update:organizations",
    "create:organization_invitations",
    "read:organization_members",
    "create:organization_members",
    "delete:organization_members",
    "read:roles",
    "create:role_members",
    "read:connections",
  ]
}
