"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { Toolbar } from "@/components/shared/toolbar";

type AuthenticatedLayoutProps = {
  children: ReactNode;
};

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const hasSession =
      typeof window !== "undefined" &&
      localStorage.getItem("cspi_session") === "true";

    if (!hasSession) {
      router.replace("/");
      return;
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    );
  }

   return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="
        md:peer-data-[variant=inset]:rounded-none
        md:peer-data-[variant=inset]:shadow-none
        md:peer-data-[variant=inset]:m-0
      ">
        <Toolbar />
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}