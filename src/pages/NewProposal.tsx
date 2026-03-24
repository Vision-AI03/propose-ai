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
    id: "dark_premium",
    name: "Dark Premium",
    desc: "Executivo escuro",
    badge: "Marketing · Agências · Tech",
    bg: "#0A0A0A",
    accent: "#ffffff",
    mid: "#1C1C1C",
  },
  {
    id: "corporate_blue",
    name: "Corporate Blue",
    desc: "Corporativo azul",
    badge: "Jurídico · Financeiro · B2B",
    bg: "#0A1628",
    accent: "#2563EB",
    mid: "#0D1E35",
  },
  {
    id: "clean_light",
    name: "Clean Light",
    desc: "Limpo e elegante",
    badge: "Saúde · Educação · Design",
    bg: "#FAFAFA",
    accent: "#1D9E75",
    mid: "#F0F0F0",
  },
  {
    id: "bold_impact",
    name: "Bold Impact",
    desc: "Máximo impacto",
    badge: "Imobiliário · Eventos",
    bg: "#111111",
    accent: "#EF4444",
    mid: "#1a0808",
  },
  {
    id: "gradient_modern",
    name: "Gradient Modern",
    desc: "Moderno vibrante",
    badge: "Startups · SaaS · Inovação",
    bg: "#0D0A1E",
    accent: "#7C3AED",
    mid: "#1a1040",
  },
];

function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("pt-BR");
}

function parseCurrencyValue(formatted: string): number {
  return Number(formatted.replace(/\D/g, "")) || 0;
}

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
  const [clientPain, setClientPain] = useState("");
  const [clientGoal, setClientGoal] = useState("");
  const [expectedMetrics, setExpectedMetrics] = useState("");

  const [templateId, setTemplateId] = useState("dark_premium");
  const [niche, setNiche] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("");
  const [proposalTone, setProposalTone] = useState("executivo");
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
          await supabase.from("user_usage")
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

      const { data: { session } } = await supabase.auth.getSession();

      const { data: result, error: fnError } = await supabase.functions.invoke("generate-proposal", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: {
          clientName,
          clientCompany,
          clientEmail,
          clientPhone,
          clientNiche,
          clientPain,
          clientGoal,
          expectedMetrics,
          templateId,
          proposalTone,
          niche: niche || profile?.niche || "",
          serviceDescription,
          deliverables,
          deadlineDays: parseInt(deadlineDays) || 30,
          totalValue: paymentTerms === "setup_mensal" ? 0 : parseCurrencyValue(totalValue),
          setupValue: paymentTerms === "setup_mensal" ? parseCurrencyValue(setupValue) : undefined,
          monthlyValue: paymentTerms === "setup_mensal" ? parseCurrencyValue(monthlyValue) : undefined,
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
          {/* Dados do cliente */}
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

          {/* Contexto do cliente */}
          <Card className="border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-heading text-[15px] font-semibold text-foreground">Contexto do cliente</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Alimenta o argumento central da proposta</p>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Principal dor / desafio do cliente</Label>
                <Textarea
                  value={clientPain}
                  onChange={(e) => setClientPain(e.target.value)}
                  placeholder="Ex: Perde leads fora do horário, atendimento sobrecarregado, inadimplência alta..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Objetivo principal do cliente</Label>
                <Input
                  value={clientGoal}
                  onChange={(e) => setClientGoal(e.target.value)}
                  placeholder="Ex: Aumentar faturamento 30%, contratar menos, atender mais rápido..."
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Métricas / resultados que sua solução entrega</Label>
                <Input
                  value={expectedMetrics}
                  onChange={(e) => setExpectedMetrics(e.target.value)}
                  placeholder="Ex: Reduz 40% do tempo de atendimento, recupera 25% dos inadimplentes..."
                />
                <p className="text-xs text-muted-foreground">Aparecerá no slide de resultados</p>
              </div>
            </CardContent>
          </Card>

          {/* Serviço */}
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
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Tom da proposta</Label>
                <Select value={proposalTone} onValueChange={setProposalTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executivo">Executivo — formal, dados, autoridade</SelectItem>
                    <SelectItem value="agressivo">Agressivo / Impactante — direto, urgente</SelectItem>
                    <SelectItem value="consultivo">Consultivo — educativo, parceiro, confiança</SelectItem>
                    <SelectItem value="criativo">Criativo — inovador, moderno, diferenciado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Valores */}
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
                    <Input type="text" inputMode="numeric" value={setupValue} onChange={(e) => setSetupValue(formatCurrencyInput(e.target.value))} placeholder="Ex: 2.500" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Valor Mensal (R$)</Label>
                    <Input type="text" inputMode="numeric" value={monthlyValue} onChange={(e) => setMonthlyValue(formatCurrencyInput(e.target.value))} placeholder="Ex: 750" />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">Valor total (R$)</Label>
                  <Input type="text" inputMode="numeric" value={totalValue} onChange={(e) => setTotalValue(formatCurrencyInput(e.target.value))} placeholder="Ex: 5.000" />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Validade da proposta (dias)</Label>
                <Input type="number" value={validityDays} onChange={(e) => setValidityDays(e.target.value)} placeholder="15" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">Informações adicionais</Label>
                <Textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} placeholder="Observações extras..." rows={2} />
              </div>
            </CardContent>
          </Card>

          {/* Template selector */}
          <Card className="border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-heading text-[15px] font-semibold text-foreground">Template da proposta</h3>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-3">
                {templates.map((t) => {
                  const selected = templateId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTemplateId(t.id)}
                      className={`group relative rounded-[10px] border-[1.5px] p-3 flex items-center gap-4 transition-all duration-150 cursor-pointer text-left ${
                        selected
                          ? "border-primary bg-sidebar-accent"
                          : "border-border bg-background hover:border-secondary-foreground/20"
                      }`}
                    >
                      {/* Mini preview */}
                      <div
                        className="w-20 h-12 rounded-md flex-shrink-0 overflow-hidden relative"
                        style={{ background: t.bg }}
                      >
                        <div className="absolute inset-0 flex flex-col p-1.5 gap-1">
                          <div className="h-1.5 w-full rounded-sm" style={{ background: t.accent, opacity: 0.9 }} />
                          <div className="flex gap-1 flex-1">
                            <div className="w-2/5 rounded-sm" style={{ background: t.mid }} />
                            <div className="flex-1 flex flex-col gap-0.5">
                              <div className="h-1 rounded-sm" style={{ background: t.accent, opacity: 0.5 }} />
                              <div className="h-1 w-3/4 rounded-sm" style={{ background: t.mid, opacity: 0.7 }} />
                              <div className="h-1 w-1/2 rounded-sm" style={{ background: t.mid, opacity: 0.5 }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[13px] font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
                            {t.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{t.desc}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground/60">{t.badge}</span>
                      </div>
                      {selected && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                            <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
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
