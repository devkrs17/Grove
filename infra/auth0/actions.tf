resource "auth0_action" "enrich_jwt" {
  name    = "grove-enrich-jwt-${var.environment}"
  runtime = "node22"
  deploy  = true

  code = <<-EOT
    exports.onExecutePostLogin = async (event, api) => {
      const namespace = 'https://grove.app/claims';

      if (event.organization) {
        api.idToken.setCustomClaim(namespace + '/org_id', event.organization.id);
        api.accessToken.setCustomClaim(namespace + '/org_id', event.organization.id);

        const tenantSlug = event.organization.metadata?.payload_tenant_slug;
        if (tenantSlug) {
          api.idToken.setCustomClaim(namespace + '/tenant_slug', tenantSlug);
          api.accessToken.setCustomClaim(namespace + '/tenant_slug', tenantSlug);
        }
      }

      if (event.authorization?.roles?.length) {
        api.idToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
        api.accessToken.setCustomClaim(namespace + '/roles', event.authorization.roles);
      }
    };
  EOT

  supported_triggers {
    id      = "post-login"
    version = "v3"
  }
}

resource "auth0_trigger_actions" "post_login" {
  trigger = "post-login"

  actions {
    id           = auth0_action.enrich_jwt.id
    display_name = auth0_action.enrich_jwt.name
  }
}
