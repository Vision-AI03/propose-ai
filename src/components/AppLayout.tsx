import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isSuccess: profileLoaded } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: usage } = useQuery({
    queryKey: ["usage", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  // Redireciona para onboarding se não completado
  if (profileLoaded && profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  const proposalsCount = usage?.proposals_count ?? 0;
  const progressPercent = (proposalsCount / 50) * 100;
  const initials =
    profile?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-[hsl(var(--sidebar-background))]">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
            </div>

            <div className="flex items-center gap-4">
              {/* Contador de uso */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-1.5">
                  <span className="text-sm text-muted-foreground">
                    {proposalsCount} / 50 propostas
                  </span>
                </div>
                <Progress value={progressPercent} className="w-24 h-1.5" />
              </div>

              {/* Avatar com dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground text-xs font-heading font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">
                        {profile?.full_name || "Usuário"}
                      </span>
                      <span className="text-xs text-muted-foreground font-normal truncate">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
