import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Sparkles, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

export default function ProposalEdit() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editedSections, setEditedSections] = useState<Record<string, string>>({});
  const [editedTitle, setEditedTitle] = useState("");
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (proposal) setEditedTitle(proposal.title || "");
  }, [proposal]);

  useEffect(() => {
    if (sections) {
      const map: Record<string, string> = {};
      sections.forEach((s) => { map[s.id] = s.content || ""; });
      setEditedSections(map);
    }
  }, [sections]);

  const handleSave = useCallback(async () => {
    if (!id) return;
    setSaving(true);
    setSaved(false);

    try {
      await supabase.from("proposals").update({
        title: editedTitle,
        updated_at: new Date().toISOString(),
      }).eq("id", id);

      for (const [sectionId, content] of Object.entries(editedSections)) {
        await supabase.from("proposal_sections").update({
          content,
          updated_at: new Date().toISOString(),
        }).eq("id", sectionId);
      }

      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      queryClient.invalidateQueries({ queryKey: ["proposal-sections", id] });
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }, [id, editedTitle, editedSections, queryClient]);

  // Auto-save every 30s
  useEffect(() => {
    autoSaveTimer.current = setInterval(() => {
      if (Object.keys(editedSections).length > 0) {
        handleSave();
      }
    }, 30000);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [editedSections, handleSave]);

  const handleRegenerate = async () => {
    if (!proposal) return;
    setRegenerating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("generate-proposal", {
        body: {
          clientName: proposal.client_name,
          clientCompany: proposal.client_company,
          clientEmail: proposal.client_email,
          clientPhone: proposal.client_phone,
          niche: proposal.niche,
          serviceDescription: proposal.service_description,
          deliverables: proposal.deliverables,
          deadlineDays: proposal.deadline_days,
          totalValue: proposal.total_value,
          paymentTerms: proposal.payment_terms,
          validityDays: proposal.validity_days,
          regenerateId: id,
        },
      });

      if (error) throw error;
      toast({ title: "Proposta regenerada!" });
      queryClient.invalidateQueries({ queryKey: ["proposal", id] });
      queryClient.invalidateQueries({ queryKey: ["proposal-sections", id] });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setRegenerating(false);
    }
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (!proposal) {
    return <div className="text-center py-12 text-muted-foreground">Proposta não encontrada</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(`/proposals/${id}`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-primary flex items-center gap-1">
              <Check className="h-3 w-3" /> Salvo
            </span>
          )}
          <Button variant="outline" onClick={handleRegenerate} disabled={regenerating} className="gap-2">
            {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Regenerar com IA
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div
          className="h-16 flex items-center px-6 gap-3"
          style={{ backgroundColor: profile?.secondary_color || "#0F1724" }}
        >
          {profile?.logo_url && (
            <img src={profile.logo_url} alt="Logo" className="h-10 w-10 rounded object-cover" />
          )}
          <span className="text-white font-heading font-semibold">{profile?.company_name || "Sua Empresa"}</span>
        </div>
        <div className="h-1" style={{ backgroundColor: profile?.primary_color || "#2563EB" }} />

        <CardContent className="p-6 space-y-6">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="font-heading text-xl font-bold text-center border-dashed"
          />

          {sections?.map((section) => (
            <div key={section.id} className="space-y-2">
              <h3 className="font-heading font-semibold text-primary">{section.section_title}</h3>
              <Textarea
                value={editedSections[section.id] || ""}
                onChange={(e) =>
                  setEditedSections((prev) => ({ ...prev, [section.id]: e.target.value }))
                }
                rows={6}
                className="text-sm leading-relaxed border-dashed resize-y"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="fixed bottom-6 right-6">
        <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar Alterações
        </Button>
      </div>
    </motion.div>
  );
}
