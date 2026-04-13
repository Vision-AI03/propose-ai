import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FileText, FilePlus, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { useProfile } from "@/hooks/useProfile";
import { useProposalActions } from "@/hooks/useProposalActions";
import { ProposalRowActions } from "@/components/ProposalRowActions";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { duplicate, remove } = useProposalActions();
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  const { data: proposals, isLoading: proposalsLoading } = useQuery({
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

  const { data: totalCount } = useQuery({
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
  const remaining = 50 - thisMonthCount;

  const handleDelete = async () => {
    if (!deleteId) return;
    await remove(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <PageHeader
          title={`Olá, ${profile?.full_name || "Usuário"}!`}
          description="Gerencie suas propostas comerciais"
          action={
            <Button
              onClick={() => navigate("/proposals/new")}
              className="gap-2 btn-primary-hover rounded-[10px]"
            >
              <FilePlus className="h-4 w-4" /> Nova Proposta
            </Button>
          }
        />

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-hover border-border">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] uppercase tracking-wider text-muted-foreground mb-2">
                    Total de propostas
                  </p>
                  <p className="text-[40px] font-heading font-bold text-foreground leading-none">
                    {totalCount ?? 0}
                  </p>
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
                  <p className="text-[13px] uppercase tracking-wider text-muted-foreground mb-2">
                    Este mês
                  </p>
                  <p className="text-[40px] font-heading font-bold text-foreground leading-none">
                    {thisMonthCount}
                  </p>
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
                  <p className="text-[13px] uppercase tracking-wider text-muted-foreground mb-2">
                    Disponíveis no mês
                  </p>
                  <p className="text-[40px] font-heading font-bold text-foreground leading-none">
                    {remaining}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <FilePlus className="h-5 w-5 text-violet-400" />
                </div>
              </div>
              <Progress value={(thisMonthCount / 50) * 100} className="h-1 mt-4" />
              <p className="text-[11px] text-muted-foreground mt-1.5">
                {thisMonthCount} / 50 usadas este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Propostas recentes */}
        <Card className="border-border overflow-hidden">
          <CardHeader className="border-b border-border">
            <CardTitle className="font-heading text-lg">Propostas recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {proposalsLoading ? (
              <div className="space-y-0">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </div>
                ))}
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
                      <TableCell>
                        <StatusBadge status={p.status || "draft"} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <ProposalRowActions
                          proposalId={p.id}
                          onView={() => navigate(`/proposals/${p.id}`)}
                          onEdit={() => navigate(`/proposals/${p.id}/edit`)}
                          onDuplicate={() => duplicate(p)}
                          onDelete={() => setDeleteId(p.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-16">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                  Nenhuma proposta ainda
                </h3>
                <p className="text-muted-foreground mb-6">
                  Crie sua primeira proposta comercial com IA
                </p>
                <Button
                  onClick={() => navigate("/proposals/new")}
                  className="gap-2 btn-primary-hover rounded-[10px]"
                >
                  <FilePlus className="h-4 w-4" /> Criar primeira proposta
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir proposta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A proposta será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
