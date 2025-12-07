"use client"

import Image from "next/image"
import Link from "next/link"
import { User2, LogOut, ScrollText } from "lucide-react"
import { useLogout } from "@/hooks/use-logout"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type MenuItem = {
  title: string
  url: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const USERNAME = "CSPI Admin"

const menuItems: MenuItem[] = [
  { title: "Pagaré", url: "/promissory", icon: ScrollText }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const logout = useLogout();

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="p-0 group-data-[collapsible=icon]:!py-2 border-r border-b-black border-8"
      {...props}
    >
      <SidebarHeader>
        {/* Expanded: logo png */}
        <div className="group-data-[collapsible=icon]:hidden flex w-full items-center justify-center px-0">
          <Image
            src="/cspi_full_logo.svg"
            alt="CSPI"
            width={120}
            height={32}
            className="h-10 w-auto"
            priority
          />
        </div>
        {/* Collapsed: avatar */}
        <div className="hidden group-data-[collapsible=icon]:flex w-full items-center justify-center px-0">
          <div className="flex items-center justify-center size-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <span className="font-semibold">C</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:px-0">
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                  <SidebarMenuButton
                    asChild
                    className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!px-0"
                  >
                    <Link
                      href={item.url}
                      className="flex items-center group-data-[collapsible=icon]:justify-center"
                    >
                      <item.icon className="group-data-[collapsible=icon]:mx-auto" />
                      <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:px-0">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* Collapsed show avatar */}
                {/* Expanded show user and mail */}
                <SidebarMenuButton
                  size="lg"
                  className="group cursor-pointer group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!px-0 hover:bg-sidebar-accent/80 focus-visible:ring-2"
                  aria-label="Abrir menú de usuario"
                >
                  <div className="flex items-center justify-center size-8 rounded-full bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:mx-auto">
                    <User2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm mx-1 leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-bold">{USERNAME}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              {/* Dropdown menu, for now only logout opt */}
              <DropdownMenuContent align="start" side="top" className="bg-sidebar">
                <DropdownMenuItem 
                  className="text-destructive focus:cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  <LogOut className="mr-2 size-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>

            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}