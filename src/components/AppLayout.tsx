import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

export function AppLayout() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
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

  const proposalsCount = usage?.proposals_count ?? 0;
  const maxProposals = 250;
  const progressPercent = (proposalsCount / maxProposals) * 100;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>{proposalsCount} / {maxProposals} propostas</span>
                <Progress value={progressPercent} className="w-24 h-2" />
              </div>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-heading">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
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
