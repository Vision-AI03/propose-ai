import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Eye, Pencil, Copy, Trash2, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const perPage = 20;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["history", user?.id, search, statusFilter, page],
    queryFn: async () => {
      let query = supabase
        .from("proposals")
        .select("*", { count: "exact" })
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .range(page * perPage, (page + 1) * perPage - 1);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (search) {
        query = query.or(`client_name.ilike.%${search}%,title.ilike.%${search}%`);
      }

      const { data, count } = await query;
      return { proposals: data ?? [], total: count ?? 0 };
    },
    enabled: !!user,
  });

  const proposals = data?.proposals ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / perPage);

  const handleDuplicate = async (proposal: any) => {
    const { id, created_at, updated_at, pdf_url, ...rest } = proposal;
    const { error } = await supabase.from("proposals").insert({
      ...rest,
      title: `${rest.title} (cópia)`,
      status: "draft",
    });
    if (!error) {
      toast({ title: "Proposta duplicada!" });
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("proposals").delete().eq("id", id);
    if (!error) {
      toast({ title: "Proposta excluída" });
      refetch();
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; className: string }> = {
      draft: { label: "Rascunho", className: "bg-secondary text-muted-foreground" },
      generated: { label: "Gerada", className: "bg-success-bg text-success" },
      sent: { label: "Enviada", className: "bg-sidebar-accent text-primary" },
      approved: { label: "Aprovada", className: "bg-success-bg text-success" },
      rejected: { label: "Rejeitada", className: "bg-destructive/20 text-destructive" },
    };
    const s = map[status] || { label: status, className: "bg-secondary text-muted-foreground" };
    return <span className={`inline-flex items-center text-xs font-medium rounded-md px-2.5 py-1 ${s.className}`}>{s.label}</span>;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="font-heading text-2xl font-bold border-l-[3px] border-l-primary pl-4">Histórico de Propostas</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
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
              {proposals.length === 0 && !isLoading && (
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
  );
}
