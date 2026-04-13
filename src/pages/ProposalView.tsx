import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Pencil, Download, Copy, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatusBadge, STATUS_OPTIONS } from "@/components/StatusBadge";
import { useProfile } from "@/hooks/useProfile";
import { useProposalActions } from "@/hooks/useProposalActions";

export default function ProposalView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: profile } = useProfile();
  const { duplicate, remove, updateStatus } = useProposalActions();

  const { data: proposal, isLoading } = useQuery({
    queryKey: ["proposal", id],
    queryFn: async () => {
      const { data } = await supabase.from("proposals").select("*").eq("id", id!).single();
      return data;
    },
    enabled: !!id,
  });

  const { data: sections } = useQuery({
    queryKey: ["proposal-sections", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("proposal_sections")
        .select("*")
        .eq("proposal_id", id!)
        .order("order_index");
      return data ?? [];
    },
    enabled: !!id,
  });

  const handleDuplicate = async () => {
    if (!proposal) return;
    const newP = await duplicate(proposal, sections ?? []);
    if (newP) navigate(`/proposals/${newP.id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    const ok = await remove(id);
    if (ok) navigate("/dashboard");
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    await updateStatus(id, newStatus);
  };

  const handleExportPdf = async () => {
    setPdfLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-pdf", {
        body: { proposalId: id },
      });

      if (error) throw new Error(error.message);
      if (!data?.pdfUrl) throw new Error("URL do PDF não retornada");

      const a = document.createElement("a");
      a.href = data.pdfUrl;
      a.download = `${proposal?.title || "proposta"}.pdf`;
      a.target = "_blank";
      a.click();

      toast({ title: "PDF baixado com sucesso!" });
    } catch (err: any) {
      toast({ title: "Erro ao gerar PDF", description: err.message, variant: "destructive" });
    } finally {
      setPdfLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-3">
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Proposta não encontrada.
      </div>
    );
  }

  const htmlContent = (proposal as any)?.html_content;
  const hasHtmlContent = !!htmlContent;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Painel lateral */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-border overflow-hidden">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="font-heading text-base leading-tight">
                  {proposal.title || "Proposta"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Detalhes */}
                <div className="space-y-2 text-sm">
                  {proposal.client_name && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliente</span>
                      <span className="font-medium text-foreground text-right">{proposal.client_name}</span>
                    </div>
                  )}
                  {proposal.client_company && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Empresa</span>
                      <span className="font-medium text-foreground text-right">{proposal.client_company}</span>
                    </div>
                  )}
                  {proposal.total_value && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor</span>
                      <span className="font-medium text-success">
                        R$ {Number(proposal.total_value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Criada em</span>
                    <span className="text-foreground">
                      {new Date(proposal.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                  <Select value={proposal.status || "draft"} onValueChange={handleStatusChange}>
                    <SelectTrigger className="h-9 bg-secondary border-0 text-sm">
                      <SelectValue>
                        <StatusBadge status={proposal.status || "draft"} />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={opt.value} />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ações primária */}
                <Button
                  className="w-full gap-2 btn-primary-hover"
                  onClick={handleExportPdf}
                  disabled={pdfLoading}
                >
                  {pdfLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Exportar PDF
                </Button>

                {/* Ações secundárias */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="gap-2 text-sm"
                    onClick={() => navigate(`/proposals/${id}/edit`)}
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 text-sm"
                    onClick={handleDuplicate}
                  >
                    <Copy className="h-3.5 w-3.5" /> Duplicar
                  </Button>
                </div>

                {/* Ação destrutiva */}
                <Button
                  variant="ghost"
                  className="w-full gap-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Excluir proposta
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-3">
            {hasHtmlContent ? (() => {
              const slideCount = (htmlContent.match(/class="slide"/g) || []).length || 9;
              const scale = 0.44;
              const iframeH = slideCount * 728;
              const containerH = Math.round(iframeH * scale) + 32;
              return (
                <div
                  style={{
                    background: "#1a1a1a",
                    borderRadius: "12px",
                    padding: "16px",
                    maxHeight: "85vh",
                    overflowY: "auto",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      overflowX: "hidden",
                      height: `${containerH}px`,
                      position: "relative",
                    }}
                  >
                    <iframe
                      srcDoc={htmlContent}
                      style={{
                        width: "1280px",
                        height: `${iframeH}px`,
                        border: "none",
                        background: "transparent",
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                        display: "block",
                      }}
                      title="Preview da Proposta"
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              );
            })() : (
              <Card className="overflow-hidden">
                <div
                  className="h-16 flex items-center px-6 gap-3"
                  style={{ backgroundColor: profile?.secondary_color || "#0F1724" }}
                >
                  {profile?.logo_url && (
                    <img src={profile.logo_url} alt="Logo" className="h-10 w-10 rounded object-cover" />
                  )}
                  <span className="text-white font-heading font-semibold">
                    {profile?.company_name || "Sua Empresa"}
                  </span>
                </div>
                <div className="h-1" style={{ backgroundColor: profile?.primary_color || "#2563EB" }} />
                <CardContent className="p-6 space-y-6">
                  <h2 className="font-heading text-xl font-bold text-center">{proposal.title}</h2>
                  {sections?.map((section) => (
                    <div key={section.id} className="space-y-2">
                      <h3 className="font-heading font-semibold text-primary">{section.section_title}</h3>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                        {section.content}
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-border pt-4 text-xs text-muted-foreground text-center">
                    Proposta válida por {proposal.validity_days || 15} dias · Gerada com PropostaAI
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
