# Role names MUST match site-memberships.ts option values exactly:
# packages/payload/src/collections/site-memberships.ts

resource "auth0_role" "owner" {
  name        = "owner"
  description = "Org-level owner. Full access across all sites."
}

resource "auth0_role" "manager" {
  name        = "manager"
  description = "Multi-site manager. Manages workers, approves changes."
}

resource "auth0_role" "worker" {
  name        = "worker"
  description = "Site-scoped worker. Day-to-day operations."
}
