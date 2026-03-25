resource "auth0_organization" "dev_org" {
  name         = var.seed_org_slug
  display_name = var.seed_org_name

  metadata = {
    payload_tenant_slug = var.seed_org_slug
  }
}

resource "auth0_organization_connections" "dev_org_staff" {
  organization_id = auth0_organization.dev_org.id

  enabled_connections {
    connection_id              = auth0_connection.staff.id
    assign_membership_on_login = false
    is_signup_enabled          = false
    show_as_button             = true
  }
}
