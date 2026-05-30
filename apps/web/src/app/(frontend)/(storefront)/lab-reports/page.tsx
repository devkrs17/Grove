import "@/storefront/blinkers/blinkers.css";
import "@/storefront/blinkers/lab-reports.css";
import { BlinkersLabReports } from "@/storefront/blinkers/BlinkersLabReports";
import { getLabReports } from "@/storefront/server";

export const metadata = { title: "Blinkers — Lab reports" };

export default async function StorefrontLabReportsPage() {
  const reports = await getLabReports();
  return (
    <div className="blinkers">
      <BlinkersLabReports reports={reports} />
    </div>
  );
}
