import { LayoutDashboard, FilePlus, History, Settings, LogOut, Zap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useProfile } from "@/hooks/useProfile";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Nova Proposta", url: "/proposals/new", icon: FilePlus },
  { title: "Histórico", url: "/history", icon: History },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile();

  const initials =
    profile?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-heading font-bold text-lg text-foreground">
              PropostaAI
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground transition-all duration-150 hover:bg-card hover:text-foreground [&>svg]:h-[18px] [&>svg]:w-[18px]"
                      activeClassName="bg-sidebar-accent text-foreground font-medium border-l-[3px] border-l-primary [&>svg]:text-primary"
                    >
                      <item.icon />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        {/* Informações do usuário */}
        <div className={`px-4 py-3 ${collapsed ? "flex justify-center" : ""}`}>
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground text-xs font-heading font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate leading-tight">
                  {profile?.full_name || "Usuário"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate leading-tight">
                  {profile?.company_name || user?.email || ""}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Logout */}
        <div className="px-2 pb-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                tooltip="Sair"
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground transition-all duration-150 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-[18px] w-[18px]" />
                {!collapsed && <span>Sair</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
