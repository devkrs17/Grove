import type { NavLink } from "./StorefrontNav";

// The storefront's standard category nav, shared by every page so the link set
// is defined once. The "Lab reports" entry belongs to the regulated-goods (COA)
// vertical, so it is included only when the tenant opts in
// (BrandConfig.showLabReports — see getShowLabReports / StorefrontRoot).
export function storefrontNavLinks(showLabReports: boolean): NavLink[] {
  const links: NavLink[] = [
    { label: "Edibles", href: "/shop" },
    { label: "Concentrates", href: "/shop" },
    { label: "Vapes", href: "/shop" },
  ];
  if (showLabReports) {
    links.push({ label: "Lab reports", href: "/lab-reports" });
  }
  return links;
}
