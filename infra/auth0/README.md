# Auth0 Infrastructure (Terraform)

Provisions the Auth0 tenant for Grove's multi-tenant authentication.

## What This Creates

- **Staff database connection** (invite-only, no self-signup)
- **Dashboard client** (regular web app, org login required)
- **Web/storefront client** (regular web app, org login optional)
- **M2M client** (backend-to-Auth0 Management API access)
- **Roles**: owner, manager, worker (matching Payload site-memberships)
- **Seed organization** for development
- **Post-login Action** that injects org_id, tenant_slug, and roles into JWTs

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.5
- An Auth0 tenant ([free tier](https://auth0.com/signup))
- A bootstrap M2M application (see below)

## Bootstrap (One-Time Setup)

Terraform needs an M2M application to authenticate with Auth0. Create it manually:

1. Log in to your Auth0 Dashboard
2. Go to **Applications > Applications > Create Application**
3. Choose **Machine to Machine** and name it "Terraform"
4. Authorize it for the **Auth0 Management API** with these scopes:
   - `read:clients`, `create:clients`, `update:clients`, `delete:clients`
   - `read:connections`, `create:connections`, `update:connections`, `delete:connections`
   - `read:roles`, `create:roles`, `update:roles`, `delete:roles`
   - `read:organizations`, `create:organizations`, `update:organizations`, `delete:organizations`
   - `read:organization_connections`, `create:organization_connections`, `update:organization_connections`, `delete:organization_connections`
   - `read:actions`, `create:actions`, `update:actions`, `delete:actions`
   - `read:client_grants`, `create:client_grants`, `update:client_grants`, `delete:client_grants`
   - `read:organization_members`, `create:organization_members`, `delete:organization_members`
   - `read:organization_invitations`, `create:organization_invitations`
5. Copy the Client ID and Client Secret

## Usage

Set environment variables for the Terraform provider:

```bash
export TF_VAR_auth0_domain="grove-dev.us.auth0.com"
export TF_VAR_auth0_tf_client_id="<bootstrap M2M client ID>"
export TF_VAR_auth0_tf_client_secret="<bootstrap M2M client secret>"
```

Then run:

```bash
cd infra/auth0
terraform init
terraform plan -var-file=environments/dev.tfvars
terraform apply -var-file=environments/dev.tfvars
```

## Outputs

After applying, retrieve outputs for your app `.env` files:

```bash
terraform output dashboard_client_id
terraform output -raw dashboard_client_secret
terraform output web_client_id
terraform output -raw web_client_secret
terraform output m2m_client_id
terraform output -raw m2m_client_secret
terraform output dev_org_id
```

Add these to your app environment:

```
AUTH0_DOMAIN=grove-dev.us.auth0.com
AUTH0_ISSUER_URL=https://grove-dev.us.auth0.com/
AUTH0_DASHBOARD_CLIENT_ID=<from output>
AUTH0_DASHBOARD_CLIENT_SECRET=<from output>
AUTH0_WEB_CLIENT_ID=<from output>
AUTH0_WEB_CLIENT_SECRET=<from output>
AUTH0_M2M_CLIENT_ID=<from output>
AUTH0_M2M_CLIENT_SECRET=<from output>
```

## Environments

| Environment | tfvars file | Auth0 Tenant |
|-------------|-------------|--------------|
| dev | `environments/dev.tfvars` | Separate dev tenant |
| prod | `environments/prod.tfvars` | Separate prod tenant |

Each environment uses a different Auth0 tenant with its own provider credentials.

## What This Does NOT Do

- Next.js auth middleware integration (separate ticket)
- Customer connection setup (separate ticket)
- Payload access control refactoring (separate ticket)
