import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";

const templates = [
  {
    id: "moderno",
    name: "Moderno",
    colors: ["hsl(217,91%,60%)", "hsl(221,39%,11%)", "hsl(215,28%,17%)"],
  },
  {
    id: "impacto",
    name: "Impacto",
    colors: ["hsl(0,84%,60%)", "hsl(224,54%,8%)", "hsl(215,28%,17%)"],
  },
  {
    id: "narrativo",
    name: "Narrativo",
    colors: ["hsl(160,64%,40%)", "hsl(221,39%,11%)", "hsl(215,28%,17%)"],
  },
  {
    id: "minimalista",
    name: "Minimalista",
    colors: ["hsl(210,20%,98%)", "hsl(224,54%,8%)", "hsl(221,39%,11%)"],
  },
  {
    id: "bold",
    name: "Bold",
    colors: ["hsl(45,96%,64%)", "hsl(224,54%,8%)", "hsl(215,28%,17%)"],
  },
];

export default function NewProposal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [limitModal, setLimitModal] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNiche, setClientNiche] = useState("");
  const [templateId, setTemplateId] = useState("moderno");
  const [niche, setNiche] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [setupValue, setSetupValue] = useState("");
  const [monthlyValue, setMonthlyValue] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("a_vista");
  const [validityDays, setValidityDays] = useState("15");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  useState(() => {
    if (profile?.niche) setNiche(profile.niche);
  });

  const paymentLabels: Record<string, string> = {
    a_vista: "À vista",
    "50_50": "50% entrada + 50% na entrega",
    "2x": "Parcelado em 2x",
    "3x": "Parcelado em 3x",
    "5x": "Parcelado em 5x",
    "10x": "Parcelado em 10x",
    mensal: "Mensal (recorrente)",
    setup_mensal: "Setup + Mensal recorrente",
  };

  const handleGenerate = async () => {
    if (!clientName || !serviceDescription) {
      toast({ title: "Campos obrigatórios", description: "Preencha o nome do cliente e descrição do serviço.", variant: "destructive" });
      return;
    }
    if (!user) return;

    setLoading(true);

    try {
      const { data: usage } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (usage) {
        const firstOfMonth = new Date();
        firstOfMonth.setDate(1);
        firstOfMonth.setHours(0, 0, 0, 0);

        if (new Date(usage.period_start) < firstOfMonth) {
          await supabase
            .from("user_usage")
            .update({ proposals_count: 0, period_start: firstOfMonth.toISOString().split("T")[0] })
            .eq("user_id", user.id);
          usage.proposals_count = 0;
        }

        if (usage.proposals_count >= 50) {
          setLimitModal(true);
          setLoading(false);
          return;
        }
      }

      const { data: result, error: fnError } = await supabase.functions.invoke("generate-proposal", {
        body: {
          clientName,
          clientCompany,
          clientEmail,
          clientPhone,
          clientNiche,
          templateId,
          niche: niche || profile?.niche || "",
          serviceDescription,
          deliverables,
          deadlineDays: parseInt(deadlineDays) || 30,
          totalValue: paymentTerms === "setup_mensal" ? 0 : (parseFloat(totalValue) || 0),
          setupValue: paymentTerms === "setup_mensal" ? (parseFloat(setupValue) || 0) : undefined,
          monthlyValue: paymentTerms === "setup_mensal" ? (parseFloat(monthlyValue) || 0) : undefined,
          paymentTerms: paymentLabels[paymentTerms] || paymentTerms,
          validityDays: parseInt(validityDays) || 15,
          additionalInfo,
        },
      });

      if (fnError) throw fnError;

      if (result?.proposalId) {
        toast({ title: "Proposta gerada com sucesso!" });
        navigate(`/proposals/${result.proposalId}`);
      } else {
        throw new Error("Falha ao gerar proposta");
      }
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes("429")) {
        toast({ title: "Muitas requisições", description: "Aguarde um momento e tente novamente.", variant: "destructive" });
      } else if (err?.message?.includes("402")) {
        toast({ title: "Créditos insuficientes", description: "Adicione créditos à sua conta.", variant: "destructive" });
      } else {
        toast({ title: "Erro ao gerar proposta", description: err.message, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6 border-l-[3px] border-l-primary pl-4">Nova Proposta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <Card className="border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-heading text-[15px] font-semibold text-foreground">Dados do cliente</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Nome do cliente *</Label>
                <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nome do cliente" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Empresa do cliente</Label>
                <Input value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} placeholder="Empresa" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Email</Label>
                  <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="email@cliente.com" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Telefone</Label>
                  <Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="(11) 99999-9999" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Segmento do cliente</Label>
                <Input value={clientNiche} onChange={(e) => setClientNiche(e.target.value)} placeholder="Ex: Tecnologia, Saúde, Construção..." />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-heading text-[15px] font-semibold text-foreground">Serviço</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Nicho / tipo de serviço</Label>
                <Input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder={profile?.niche || "Tipo de serviço"} />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Descrição do serviço *</Label>
                <Textarea value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} placeholder="Descreva o que será feito..." rows={4} />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Principais entregáveis</Label>
                <Textarea value={deliverables} onChange={(e) => setDeliverables(e.target.value)} placeholder="O que o cliente receberá..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Prazo de entrega (dias)</Label>
                <Input type="number" value={deadlineDays} onChange={(e) => setDeadlineDays(e.target.value)} placeholder="30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <Card className="border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-heading text-[15px] font-semibold text-foreground">Valores e condições</h3>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Forma de pagamento</Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_vista">À vista</SelectItem>
                    <SelectItem value="50_50">50% entrada + 50% na entrega</SelectItem>
                    <SelectItem value="2x">Parcelado em 2x</SelectItem>
                    <SelectItem value="3x">Parcelado em 3x</SelectItem>
                    <SelectItem value="5x">Parcelado em 5x</SelectItem>
                    <SelectItem value="10x">Parcelado em 10x</SelectItem>
                    <SelectItem value="mensal">Mensal (recorrente)</SelectItem>
                    <SelectItem value="setup_mensal">Setup + Mensal recorrente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {paymentTerms === "setup_mensal" ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Valor do Setup (R$)</Label>
                    <Input type="number" step="0.01" value={setupValue} onChange={(e) => setSetupValue(e.target.value)} placeholder="Ex: 2500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Valor Mensal (R$)</Label>
                    <Input type="number" step="0.01" value={monthlyValue} onChange={(e) => setMonthlyValue(e.target.value)} placeholder="Ex: 750" />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Valor total (R$)</Label>
                  <Input type="number" step="0.01" value={totalValue} onChange={(e) => setTotalValue(e.target.value)} placeholder="5000.00" />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Validade da proposta (dias)</Label>
                <Input type="number" value={validityDays} onChange={(e) => setValidityDays(e.target.value)} placeholder="15" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Informações adicionais</Label>
                <Textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="Observações extras..." rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-heading text-[15px] font-semibold text-foreground">Template da proposta</h3>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`group relative h-[140px] rounded-[10px] border-[1.5px] p-3 flex flex-col justify-between transition-all duration-150 cursor-pointer ${
                      templateId === t.id
                        ? "border-primary bg-sidebar-accent"
                        : "border-border bg-background hover:border-secondary-foreground/20"
                    }`}
                  >
                    {/* Mini preview */}
                    <div className="flex-1 flex flex-col gap-1.5 pt-1">
                      <div className="h-2 w-full rounded-sm" style={{ backgroundColor: t.colors[0] }} />
                      <div className="flex gap-1 flex-1">
                        <div className="w-1/3 rounded-sm" style={{ backgroundColor: t.colors[1] }} />
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="h-1.5 w-3/4 rounded-sm" style={{ backgroundColor: t.colors[2] }} />
                          <div className="h-1.5 w-1/2 rounded-sm" style={{ backgroundColor: t.colors[2] }} />
                          <div className="h-1.5 w-2/3 rounded-sm" style={{ backgroundColor: t.colors[2] }} />
                        </div>
                      </div>
                    </div>
                    <span className={`text-[13px] font-medium mt-2 ${
                      templateId === t.id ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {t.name}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full h-14 text-[15px] font-heading font-bold gap-3 rounded-[10px] btn-primary-hover bg-primary hover:bg-primary-hover"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Gerando sua proposta...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 animate-spin-slow" />
                Gerar Proposta com IA
              </>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={limitModal} onOpenChange={setLimitModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Limite atingido</DialogTitle>
            <DialogDescription>
              Você atingiu o limite de 50 propostas neste mês. Seu limite será renovado no dia 1º do próximo mês.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setLimitModal(false)}>Entendi</Button>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
