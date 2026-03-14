import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  FileText, FilePlus, TrendingUp, Eye, Pencil, Copy, Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile && !profile.onboarding_completed) {
      navigate("/onboarding");
    }
  }, [profile, navigate]);

  const { data: usage } = useQuery({
    queryKey: ["usage", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_usage").select("*").eq("user_id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: proposals, isLoading: proposalsLoading, refetch } = useQuery({
    queryKey: ["proposals", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("proposals")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
    enabled: !!user,
  });

  const { data: allProposals } = useQuery({
    queryKey: ["proposals-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("proposals")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const thisMonthCount = usage?.proposals_count ?? 0;
  const totalCount = allProposals ?? 0;
  const remaining = 50 - thisMonthCount;

  const handleDuplicate = async (proposal: any) => {
    const { id, created_at, updated_at, pdf_url, ...rest } = proposal;
    const { error } = await supabase.from("proposals").insert({
      ...rest,
      title: `${rest.title} (cópia)`,
      status: "draft",
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Proposta duplicada!" });
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("proposals").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Proposta excluída" });
      refetch();
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      draft: { label: "Rascunho", className: "bg-secondary text-muted-foreground border-0 rounded-md px-2.5 py-1" },
      generated: { label: "Gerada", className: "bg-success-bg text-success border-0 rounded-md px-2.5 py-1" },
      sent: { label: "Enviada", className: "bg-sidebar-accent text-primary border-0 rounded-md px-2.5 py-1" },
      approved: { label: "Aprovada", className: "bg-success-bg text-success border-0 rounded-md px-2.5 py-1" },
      rejected: { label: "Rejeitada", className: "bg-destructive/20 text-destructive border-0 rounded-md px-2.5 py-1" },
    };
    const s = map[status] || { label: status, className: "bg-secondary text-muted-foreground border-0 rounded-md px-2.5 py-1" };
    return <span className={`inline-flex items-center text-xs font-medium ${s.className}`}>{s.label}</span>;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-[28px] font-bold text-foreground">
            Olá, {profile?.full_name || "Usuário"}! 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie suas propostas comerciais</p>
        </div>
        <Button onClick={() => navigate("/proposals/new")} className="gap-2 btn-primary-hover rounded-[10px]">
          <FilePlus className="h-4 w-4" /> Nova Proposta
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hover border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] uppercase tracking-wider text-muted-foreground mb-2">Total de propostas</p>
                <p className="text-[40px] font-heading font-bold text-foreground leading-none">{totalCount}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] uppercase tracking-wider text-muted-foreground mb-2">Este mês</p>
                <p className="text-[40px] font-heading font-bold text-foreground leading-none">{thisMonthCount}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] uppercase tracking-wider text-muted-foreground mb-2">Disponíveis</p>
                <p className="text-[40px] font-heading font-bold text-foreground leading-none">{remaining}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <FilePlus className="h-5 w-5 text-violet-400" />
              </div>
            </div>
            <Progress value={(thisMonthCount / 50) * 100} className="h-1 mt-4" />
          </CardContent>
        </Card>
      </div>

      {/* Recent proposals */}
      <Card className="border-border overflow-hidden">
        <CardHeader className="border-b border-border">
          <CardTitle className="font-heading text-lg">Propostas recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {proposalsLoading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : proposals && proposals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-table-header border-b border-border hover:bg-table-header">
                  <TableHead className="text-[12px] uppercase tracking-wider text-muted-foreground font-medium">Título</TableHead>
                  <TableHead className="text-[12px] uppercase tracking-wider text-muted-foreground font-medium">Cliente</TableHead>
                  <TableHead className="text-[12px] uppercase tracking-wider text-muted-foreground font-medium">Valor</TableHead>
                  <TableHead className="text-[12px] uppercase tracking-wider text-muted-foreground font-medium">Status</TableHead>
                  <TableHead className="text-[12px] uppercase tracking-wider text-muted-foreground font-medium">Data</TableHead>
                  <TableHead className="text-[12px] uppercase tracking-wider text-muted-foreground font-medium text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((p) => (
                  <TableRow key={p.id} className="border-b border-border table-row-hover hover:bg-card">
                    <TableCell className="font-medium text-foreground">{p.title || "Sem título"}</TableCell>
                    <TableCell className="text-muted-foreground">{p.client_name || "—"}</TableCell>
                    <TableCell className="font-mono text-success">
                      {p.total_value
                        ? `R$ ${Number(p.total_value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                        : "—"}
                    </TableCell>
                    <TableCell>{statusBadge(p.status || "draft")}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => navigate(`/proposals/${p.id}`)} className="h-8 w-8 text-text-tertiary hover:text-primary transition-colors duration-150">
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => navigate(`/proposals/${p.id}/edit`)} className="h-8 w-8 text-text-tertiary hover:text-yellow-400 transition-colors duration-150">
                          <Pencil className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDuplicate(p)} className="h-8 w-8 text-text-tertiary hover:text-success transition-colors duration-150">
                          <Copy className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)} className="h-8 w-8 text-text-tertiary hover:text-destructive transition-colors duration-150">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">Nenhuma proposta ainda</h3>
              <p className="text-muted-foreground mb-6">
                Crie sua primeira proposta comercial com IA
              </p>
              <Button onClick={() => navigate("/proposals/new")} className="gap-2 btn-primary-hover rounded-[10px]">
                <FilePlus className="h-4 w-4" /> Criar primeira proposta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
