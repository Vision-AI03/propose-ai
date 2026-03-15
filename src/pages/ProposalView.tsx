import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Pencil, Download, Copy, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProposalView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pdfLoading, setPdfLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const handleDuplicate = async () => {
    if (!proposal) return;
    const { id: _, created_at, updated_at, pdf_url, ...rest } = proposal;
    const { data: newP, error } = await supabase.from("proposals").insert({
      ...rest,
      title: `${rest.title} (cópia)`,
      status: "draft",
    }).select().single();

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }

    if (sections && sections.length > 0 && newP) {
      const newSections = sections.map(({ id: _, proposal_id, ...s }) => ({
        ...s,
        proposal_id: newP.id,
      }));
      await supabase.from("proposal_sections").insert(newSections);
    }

    toast({ title: "Proposta duplicada!" });
    navigate(`/proposals/${newP.id}`);
  };

  const handleDelete = async () => {
    if (!id) return;
    const { error } = await supabase.from("proposals").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Proposta excluída" });
      navigate("/dashboard");
    }
  };

  const handleExportPdf = async () => {
    setPdfLoading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      let element: HTMLElement | null = null;
      let tempContainer: HTMLDivElement | null = null;

      const htmlContent = proposal?.html_content;
      if (htmlContent) {
        // Render html_content into a temporary off-screen container
        tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        tempContainer.style.top = "0";
        tempContainer.style.width = "794px"; // A4 width in px at 96dpi
        tempContainer.style.background = "white";
        tempContainer.innerHTML = htmlContent;
        document.body.appendChild(tempContainer);
        element = tempContainer;
      } else {
        element = document.getElementById("proposal-preview-fallback");
      }

      if (!element) {
        toast({ title: "Erro", description: "Elemento de preview não encontrado", variant: "destructive" });
        setPdfLoading(false);
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      if (tempContainer) {
        document.body.removeChild(tempContainer);
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${proposal?.title || "proposta"}.pdf`);
      toast({ title: "PDF baixado com sucesso!" });
    } catch (err: any) {
      toast({ title: "Erro ao gerar PDF", description: err.message, variant: "destructive" });
    } finally {
      setPdfLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      draft: { label: "Rascunho", variant: "secondary" },
      generated: { label: "Gerada", variant: "default" },
      sent: { label: "Enviada", variant: "default" },
      approved: { label: "Aprovada", variant: "default" },
      rejected: { label: "Rejeitada", variant: "destructive" },
    };
    const s = map[status] || { label: status, variant: "outline" as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!proposal) {
    return <div className="text-center py-12 text-muted-foreground">Proposta não encontrada</div>;
  }

  const htmlContent = (proposal as any)?.html_content;
  const hasHtmlContent = !!htmlContent;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Control panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">{proposal.title || "Proposta"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                {statusBadge(proposal.status || "draft")}
              </div>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Cliente:</span> {proposal.client_name}</p>
                {proposal.client_company && <p><span className="text-muted-foreground">Empresa:</span> {proposal.client_company}</p>}
                {proposal.total_value && (
                  <p><span className="text-muted-foreground">Valor:</span> R$ {Number(proposal.total_value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                )}
                <p><span className="text-muted-foreground">Criada em:</span> {new Date(proposal.created_at).toLocaleDateString("pt-BR")}</p>
              </div>

              <div className="space-y-2 pt-4">
                <Button className="w-full gap-2" variant="outline" onClick={() => navigate(`/proposals/${id}/edit`)}>
                  <Pencil className="h-4 w-4" /> Editar Manualmente
                </Button>
                <Button className="w-full gap-2" onClick={handleExportPdf} disabled={pdfLoading}>
                  {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Exportar PDF
                </Button>
                <Button className="w-full gap-2" variant="outline" onClick={handleDuplicate}>
                  <Copy className="h-4 w-4" /> Duplicar
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full gap-2" variant="destructive">
                      <Trash2 className="h-4 w-4" /> Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir proposta?</AlertDialogTitle>
                      <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3">
          {hasHtmlContent ? (() => {
            const pageCount = (htmlContent.match(/class="pagina"/g) || []).length || 5;
            return (
              <div
                style={{
                  background: '#E5E7EB',
                  borderRadius: '8px',
                  padding: '20px 0',
                  maxHeight: '900px',
                  overflowY: 'auto',
                }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlContent}
                  style={{
                    width: '850px',
                    height: `${pageCount * 1123 + (pageCount - 1) * 24 + 48}px`,
                    border: 'none',
                    background: 'transparent',
                    transform: 'scale(0.55)',
                    transformOrigin: 'top left',
                  }}
                  title="Preview da Proposta"
                  sandbox="allow-same-origin"
                />
              </div>
            );
          })()
          ) : (
            <div id="proposal-preview-fallback">
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
                    Proposta válida por {proposal.validity_days || 15} dias • Gerada com PropostaAI
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
