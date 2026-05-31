import { notFound } from "next/navigation";
import "@/storefront/kit/kit.css";
import "@/storefront/kit/lab-reports.css";
import { StorefrontLabReports } from "@/storefront/kit/StorefrontLabReports";
import { StorefrontRoot } from "@/storefront/StorefrontRoot";
import { getLabReports, getShowLabReports } from "@/storefront/server";

export const metadata = { title: "Blinkers — Lab reports" };

export default async function StorefrontLabReportsPage() {
  // The COA library is the regulated-goods vertical: a tenant that hasn't opted
  // in has no lab-reports page at all.
  if (!(await getShowLabReports())) notFound();

  const reports = await getLabReports();
  return (
    <StorefrontRoot>
      <StorefrontLabReports reports={reports} />
    </StorefrontRoot>
  );
}
