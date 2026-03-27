Walk through the steps to onboard a new client into Grove.

## Prerequisites
- Client's product data (Excel/CSV)
- Client's brand assets (logo, colors, fonts)
- Auth0 tenant provisioned with org

## Onboarding Steps

1. **Create Org in Payload**
   - Add tenant record with client name and slug
   - This is done via Payload admin or seed script

2. **Create Site**
   - Domain: `clientslug.grove.dev` (or custom domain)
   - Status: active
   - Scoped to the new tenant

3. **Configure BrandConfig**
   - Logo (upload to Media first)
   - Primary color, secondary color, accent
   - Typography (heading font, body font)
   - Favicon
   - Site title and metadata

4. **Import Products**
   - Parse Excel/CSV into Product collection format
   - Map custom attributes based on client vertical
   - Upload product images to Media collection
   - Create Product records scoped to Site

5. **Create Staff Users**
   - Create user in Auth0 org
   - Create User record in Payload
   - Create SiteMembership with appropriate role

6. **Verify**
   - Visit `clientslug.grove.dev` — storefront should render
   - Log into dashboard — staff should see their products
   - BrandConfig changes should reflect on storefront

## Seed Script

For dev/staging, use `packages/payload/src/seed.ts`:
```bash
# From repo root
pnpm seed  # if script exists, otherwise run directly
```

## Notes
- First client will be manual. Automate after patterns solidify.
- Product `customAttributes` schema varies by vertical — derive from client's CSV headers.
