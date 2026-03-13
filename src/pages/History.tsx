import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Eye, Pencil, Copy, Trash2, Download, Search } from "lucide-react";
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
      <h1 className="font-heading text-2xl font-bold">Histórico de Propostas</h1>

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
            <SelectItem value="sent">Enviada</SelectItem>
            <SelectItem value="approved">Aprovada</SelectItem>
            <SelectItem value="rejected">Rejeitada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
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
