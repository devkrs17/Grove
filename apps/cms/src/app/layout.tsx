import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grove CMS",
  description: "Grove Content Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
