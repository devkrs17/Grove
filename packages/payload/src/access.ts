import type { Access } from "payload";

export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user);

export const isSuperAdmin: Access = ({ req: { user } }) =>
  Boolean(user?.email && user.email === process.env.SUPER_ADMIN_EMAIL);

// Media is auth-gated like every other collection, but the file *bytes* must be
// fetchable by anonymous storefront shoppers so product images render. Payload
// runs `read` for both the document API and the static file route, setting
// `isReadingStaticFile` only for the latter — so this opens up image delivery
// without exposing the Media listing to the public.
export const isAuthenticatedOrReadingFile: Access = (args) =>
  args.isReadingStaticFile === true || isAuthenticated(args);
