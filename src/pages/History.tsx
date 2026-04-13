import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { useProposalActions } from "@/hooks/useProposalActions";
import { ProposalRowActions } from "@/components/ProposalRowActions";

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { duplicate, remove } = useProposalActions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const perPage = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["history", user?.id, search, statusFilter, page],
    queryFn: async () => {
      let query = supabase
        .from("proposals")
        .select("*", { count: "exact" })
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .range(page * perPage, (page + 1) * perPage - 1);

      if (statusFilter !== "all") query = query.eq("status", statusFilter);
      if (search) query = query.or(`client_name.ilike.%${search}%,title.ilike.%${search}%`);

      const { data, count } = await query;
      return { proposals: data ?? [], total: count ?? 0 };
    },
    enabled: !!user,
  });

  const proposals = data?.proposals ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / perPage);

  const handleDelete = async () => {
    if (!deleteId) return;
    await remove(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <PageHeader title="Histórico de Propostas" />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou título..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="generated">Gerada</SelectItem>
              <SelectItem value="sent">Enviada</SelectItem>
              <SelectItem value="approved">Aprovada</SelectItem>
              <SelectItem value="rejected">Rejeitada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-border overflow-hidden">
          <CardContent className="p-0">
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
                {isLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i} className="border-b border-border">
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : proposals.length > 0 ? (
                  proposals.map((p) => (
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Nenhuma proposta encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page + 1} de {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              Próxima
            </Button>
          </div>
        )}
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
