output "dashboard_client_id" {
  description = "Auth0 client ID for the Dashboard app"
  value       = auth0_client.dashboard.client_id
}

output "dashboard_client_secret" {
  description = "Auth0 client secret for the Dashboard app"
  value       = auth0_client.dashboard.client_secret
  sensitive   = true
}

output "web_client_id" {
  description = "Auth0 client ID for the Web/storefront app"
  value       = auth0_client.web.client_id
}

output "web_client_secret" {
  description = "Auth0 client secret for the Web/storefront app"
  value       = auth0_client.web.client_secret
  sensitive   = true
}

output "m2m_client_id" {
  description = "Auth0 client ID for the M2M backend app"
  value       = auth0_client.m2m.client_id
}

output "m2m_client_secret" {
  description = "Auth0 client secret for the M2M backend app"
  value       = auth0_client.m2m.client_secret
  sensitive   = true
}

output "dev_org_id" {
  description = "Auth0 Organization ID for the seed dev org"
  value       = auth0_organization.dev_org.id
}

output "auth0_issuer_url" {
  description = "Auth0 issuer URL for JWT validation"
  value       = "https://${var.auth0_domain}/"
}

output "owner_role_id" {
  value = auth0_role.owner.id
}

output "manager_role_id" {
  value = auth0_role.manager.id
}

output "worker_role_id" {
  value = auth0_role.worker.id
}
