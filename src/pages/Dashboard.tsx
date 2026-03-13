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

  // Redirect to onboarding if not completed
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
  const remaining = 250 - thisMonthCount;

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
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      draft: { label: "Rascunho", variant: "secondary" },
      sent: { label: "Enviada", variant: "default" },
      approved: { label: "Aprovada", variant: "default" },
      rejected: { label: "Rejeitada", variant: "destructive" },
    };
    const s = map[status] || { label: status, variant: "outline" as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">
            Olá, {profile?.full_name || "Usuário"}! 👋
          </h1>
          <p className="text-muted-foreground">Gerencie suas propostas comerciais</p>
        </div>
        <Button onClick={() => navigate("/proposals/new")} className="gap-2">
          <FilePlus className="h-4 w-4" /> Nova Proposta
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de propostas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading font-bold">{totalCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Este mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading font-bold">{thisMonthCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Disponíveis</CardTitle>
            <FilePlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-heading font-bold">{remaining}</p>
            <Progress value={(thisMonthCount / 250) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent proposals */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Propostas recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {proposalsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : proposals && proposals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title || "Sem título"}</TableCell>
                    <TableCell>{p.client_name || "—"}</TableCell>
                    <TableCell>
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
                        <Button size="icon" variant="ghost" onClick={() => navigate(`/proposals/${p.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => navigate(`/proposals/${p.id}/edit`)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDuplicate(p)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2">Nenhuma proposta ainda</h3>
              <p className="text-muted-foreground mb-4">
                Crie sua primeira proposta comercial com IA
              </p>
              <Button onClick={() => navigate("/proposals/new")} className="gap-2">
                <FilePlus className="h-4 w-4" /> Criar primeira proposta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
