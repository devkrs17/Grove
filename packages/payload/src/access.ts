import type { Access } from "payload";

export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user);

export const isSuperAdmin: Access = ({ req: { user } }) =>
  Boolean(user?.email && user.email === process.env.SUPER_ADMIN_EMAIL);
