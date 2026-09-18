"use client";

import { usePathname } from "next/navigation";

export default function SiteFrame({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  const path = usePathname();
  const admin = path === "/admin" || path.startsWith("/admin/");
  return (
    <>
      {!admin && header}
      {children}
      {!admin && footer}
    </>
  );
}
