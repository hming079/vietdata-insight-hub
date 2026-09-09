import { Link, useRouterState } from "@tanstack/react-router";
import { navGroups, routeMeta } from "./nav-config";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bell,
  ChevronRight,
  LogOut,
  Search,
  Settings,
  Sparkles,
  UserCog,
  Command,
} from "lucide-react";
import type { ReactNode } from "react";

function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-4 py-4">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-card">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="6" rx="7.5" ry="3" />
          <path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
          <path d="M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
        </svg>
      </div>
      <div className="leading-tight">
        <p className="font-display text-sm font-semibold text-foreground">Data Assistant</p>
        <p className="text-[11px] text-muted-foreground">Vietnamese Business AI</p>
      </div>
    </div>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <Logo />
      <nav className="scrollbar-slim flex-1 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.group} className="mb-5">
            <p className="px-2 pb-2 text-[10.5px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.to;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                      )}
                    >
                      {active && (
                        <span className="absolute top-1.5 bottom-1.5 -left-3 w-[3px] rounded-r-full bg-sidebar-primary" />
                      )}
                      <item.icon
                        className={cn(
                          "size-[17px] shrink-0",
                          active ? "text-sidebar-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="rounded border border-primary/25 bg-primary/8 px-1.5 py-px text-[10px] font-semibold text-primary">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button className="mb-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60">
          <Settings className="size-[17px] text-muted-foreground" />
          Settings
        </button>
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-sidebar-accent/60">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {currentUser.initials}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-medium text-foreground">{currentUser.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{currentUser.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Header({ pathname }: { pathname: string }) {
  const meta = routeMeta[pathname] ?? { title: "Data Assistant", group: "Analytics", subtitle: "" };
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-surface px-6">
      <div className="min-w-0">
        <div className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
          <span>Data Assistant</span>
          <ChevronRight className="size-3" />
          <span>{meta.group}</span>
          <ChevronRight className="size-3" />
          <span className="font-medium text-foreground">{meta.title}</span>
        </div>
        <h2 className="truncate font-display text-[15px] font-semibold text-foreground">
          {meta.title}
        </h2>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden lg:block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Tìm kiếm truy vấn, tài liệu, thuật ngữ..."
            className="h-9 w-80 rounded-lg border border-input bg-background pr-16 pl-9 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
          <span className="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            <Command className="size-3" />K
          </span>
        </div>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-[18px]" />
                <span className="absolute top-2 right-2 size-1.5 rounded-full bg-destructive" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>3 thông báo mới</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-6 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg py-1 pr-2 pl-1 transition-colors hover:bg-muted">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {currentUser.initials}
              </span>
              <span className="hidden text-left leading-tight md:block">
                <span className="block text-[13px] font-medium text-foreground">
                  {currentUser.name}
                </span>
                <span className="block text-[11px] text-muted-foreground">Phòng Phân tích</span>
              </span>
              <Badge variant="secondary" className="hidden gap-1 md:inline-flex">
                <Sparkles className="size-3" />
                {currentUser.role}
              </Badge>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCog className="size-4" /> Hồ sơ cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="size-4" /> Cài đặt hệ thống
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut className="size-4" /> Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar pathname={pathname} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header pathname={pathname} />
        <main className="scrollbar-slim min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
