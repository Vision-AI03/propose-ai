import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useProposalActions() {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["proposals"] });
    queryClient.invalidateQueries({ queryKey: ["proposals-count"] });
    queryClient.invalidateQueries({ queryKey: ["history"] });
  };

  const duplicate = async (proposal: any, sections?: any[]) => {
    const { id, created_at, updated_at, pdf_url, ...rest } = proposal;
    const { data: newP, error } = await supabase
      .from("proposals")
      .insert({ ...rest, title: `${rest.title} (cópia)`, status: "draft" })
      .select()
      .single();

    if (error) {
      toast({ title: "Erro ao duplicar", description: error.message, variant: "destructive" });
      return null;
    }

    if (sections && sections.length > 0 && newP) {
      const newSections = sections.map(({ id: _, proposal_id, ...s }: any) => ({
        ...s,
        proposal_id: newP.id,
      }));
      await supabase.from("proposal_sections").insert(newSections);
    }

    toast({ title: "Proposta duplicada!" });
    invalidateAll();
    return newP;
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("proposals").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
      return false;
    }
    toast({ title: "Proposta excluída" });
    invalidateAll();
    return true;
  };

  const updateStatus = async (proposalId: string, status: string) => {
    const { error } = await supabase
      .from("proposals")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", proposalId);

    if (error) {
      toast({ title: "Erro ao atualizar status", description: error.message, variant: "destructive" });
      return false;
    }
    queryClient.invalidateQueries({ queryKey: ["proposal", proposalId] });
    invalidateAll();
    return true;
  };

  return { duplicate, remove, updateStatus };
}
