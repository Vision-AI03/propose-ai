import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/PageHeader";
import { useProfile } from "@/hooks/useProfile";

// ─── Schema ──────────────────────────────────────────────────────────────────

const formSchema = z.object({
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  clientCompany: z.string().optional().default(""),
  clientEmail: z.string().optional().default(""),
  clientPhone: z.string().optional().default(""),
  clientNiche: z.string().optional().default(""),
  clientPain: z.string().optional().default(""),
  clientGoal: z.string().optional().default(""),
  expectedMetrics: z.string().optional().default(""),
  templateId: z.string().default("dark_premium"),
  niche: z.string().optional().default(""),
  serviceDescription: z.string().min(1, "Descrição do serviço é obrigatória"),
  deliverables: z.string().optional().default(""),
  deadlineDays: z.string().optional().default("30"),
  proposalTone: z.string().default("executivo"),
  paymentTerms: z.string().default("a_vista"),
  totalValue: z.string().optional().default(""),
  setupValue: z.string().optional().default(""),
  monthlyValue: z.string().optional().default(""),
  validityDays: z.string().optional().default("15"),
  additionalInfo: z.string().optional().default(""),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Templates ───────────────────────────────────────────────────────────────

const templates = [
  {
    id: "dark_premium",
    name: "Dark Premium",
    desc: "Executivo escuro",
    badge: "Marketing · Agências · Tech",
    bg: "#0A0A0A",
    accent: "#ffffff",
  },
  {
    id: "corporate_blue",
    name: "Corporate Blue",
    desc: "Corporativo azul",
    badge: "Jurídico · Financeiro · B2B",
    bg: "#0A1628",
    accent: "#2563EB",
  },
  {
    id: "clean_light",
    name: "Clean Light",
    desc: "Limpo e elegante",
    badge: "Saúde · Educação · Design",
    bg: "#FAFAFA",
    accent: "#1D9E75",
  },
  {
    id: "bold_impact",
    name: "Bold Impact",
    desc: "Máximo impacto",
    badge: "Imobiliário · Eventos",
    bg: "#111111",
    accent: "#EF4444",
  },
  {
    id: "gradient_modern",
    name: "Gradient Modern",
    desc: "Moderno vibrante",
    badge: "Startups · SaaS · Inovação",
    bg: "#0D0A1E",
    accent: "#7C3AED",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("pt-BR");
}

function parseCurrencyValue(formatted: string): number {
  return Number(formatted.replace(/\D/g, "")) || 0;
}

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

// ─── Template mini-preview ────────────────────────────────────────────────────

function TemplateMiniPreview({ t }: { t: (typeof templates)[0] }) {
  return (
    <div
      className="w-20 h-12 rounded-md flex-shrink-0 overflow-hidden relative"
      style={{ background: t.bg }}
    >
      {t.id === "dark_premium" && (
        <>
          <svg width="80" height="48" viewBox="0 0 80 48" style={{ position: "absolute", inset: 0, opacity: 0.25 }}>
            <polygon points="0,48 26,0 0,0" fill="white" />
            <polygon points="80,0 54,48 80,48" fill="white" />
          </svg>
          <div style={{ position: "absolute", bottom: 6, left: 8, right: 8 }}>
            <div style={{ height: 2, width: 20, background: t.accent, marginBottom: 3, borderRadius: 1 }} />
            <div style={{ height: 6, width: 46, background: "#fff", opacity: 0.9, borderRadius: 1 }} />
            <div style={{ height: 2, width: 30, background: "#fff", opacity: 0.35, borderRadius: 1, marginTop: 3 }} />
          </div>
        </>
      )}
      {t.id === "corporate_blue" && (
        <>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: t.accent }} />
          <div style={{ position: "absolute", inset: 0, padding: "6px 8px 6px 10px" }}>
            <div style={{ height: 2, width: 36, background: t.accent, marginBottom: 5, borderRadius: 1 }} />
            <div style={{ height: 6, width: 50, background: "#fff", opacity: 0.85, borderRadius: 1 }} />
            <div style={{ height: 2, width: 32, background: "#8ba3c4", borderRadius: 1, marginTop: 4, opacity: 0.7 }} />
          </div>
        </>
      )}
      {t.id === "clean_light" && (
        <>
          <div style={{ position: "absolute", top: 13, left: 0, right: 0, height: 1, background: "#ddd" }} />
          <div style={{ position: "absolute", inset: 0, padding: "6px 8px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ height: 2, width: 14, background: t.accent, marginBottom: 3, borderRadius: 1 }} />
            <div style={{ height: 6, width: 50, background: "#111", opacity: 0.8, borderRadius: 1 }} />
            <div style={{ height: 2, width: 34, background: "#666", opacity: 0.5, borderRadius: 1, marginTop: 3 }} />
          </div>
        </>
      )}
      {t.id === "bold_impact" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
          <div style={{ height: 2, width: 22, background: t.accent, borderRadius: 1 }} />
          <div style={{ height: 7, width: 50, background: "#fff", opacity: 0.95, borderRadius: 1 }} />
          <div style={{ height: 7, width: 38, background: "#fff", opacity: 0.95, borderRadius: 1 }} />
          <div style={{ height: 2, width: 22, background: t.accent, borderRadius: 1 }} />
        </div>
      )}
      {t.id === "gradient_modern" && (
        <>
          <svg width="80" height="48" viewBox="0 0 80 48" style={{ position: "absolute", inset: 0 }}>
            <circle cx="62" cy="8" r="22" fill="none" stroke={t.accent} strokeWidth="0.6" opacity="0.5" />
            <circle cx="18" cy="42" r="16" fill={t.accent} opacity="0.07" />
          </svg>
          <div style={{ position: "absolute", inset: 0, padding: "8px 8px" }}>
            <div style={{ height: 6, width: 46, background: "#fff", opacity: 0.85, borderRadius: 1 }} />
            <div style={{ height: 2, width: 28, background: t.accent, opacity: 0.7, borderRadius: 1, marginTop: 4 }} />
            <div style={{ height: 2, width: 20, background: "#fff", opacity: 0.3, borderRadius: 1, marginTop: 3 }} />
          </div>
        </>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function NewProposal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [limitModal, setLimitModal] = useState(false);
  const { data: profile } = useProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientCompany: "",
      clientEmail: "",
      clientPhone: "",
      clientNiche: "",
      clientPain: "",
      clientGoal: "",
      expectedMetrics: "",
      templateId: "dark_premium",
      niche: "",
      serviceDescription: "",
      deliverables: "",
      deadlineDays: "30",
      proposalTone: "executivo",
      paymentTerms: "a_vista",
      totalValue: "",
      setupValue: "",
      monthlyValue: "",
      validityDays: "15",
      additionalInfo: "",
    },
  });

  const paymentTerms = form.watch("paymentTerms");
  const templateId = form.watch("templateId");

  const handleGenerate = async (values: FormValues) => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const payload = {
        clientName: values.clientName,
        clientCompany: values.clientCompany,
        clientEmail: values.clientEmail,
        clientPhone: values.clientPhone,
        clientNiche: values.clientNiche,
        clientPain: values.clientPain,
        clientGoal: values.clientGoal,
        expectedMetrics: values.expectedMetrics,
        templateId: values.templateId,
        proposalTone: values.proposalTone,
        niche: values.niche || profile?.niche || "",
        serviceDescription: values.serviceDescription,
        deliverables: values.deliverables,
        deadlineDays: parseInt(values.deadlineDays || "30") || 30,
        totalValue: values.paymentTerms === "setup_mensal" ? 0 : parseCurrencyValue(values.totalValue || ""),
        setupValue: values.paymentTerms === "setup_mensal" ? parseCurrencyValue(values.setupValue || "") : undefined,
        monthlyValue: values.paymentTerms === "setup_mensal" ? parseCurrencyValue(values.monthlyValue || "") : undefined,
        paymentTerms: paymentLabels[values.paymentTerms] || values.paymentTerms,
        validityDays: parseInt(values.validityDays || "15") || 15,
        additionalInfo: values.additionalInfo,
      };

      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-proposal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_PUBLISHABLE_KEY,
          "Authorization": `Bearer ${session?.access_token || SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errMsg = `Erro ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody?.error?.includes("limit") || errMsg.includes("429")) {
            setLimitModal(true);
            setLoading(false);
            return;
          }
          errMsg = errBody.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }

      const result = await response.json();

      if (result?.proposalId) {
        toast({ title: "Proposta gerada com sucesso!" });
        navigate(`/proposals/${result.proposalId}`);
      } else {
        throw new Error("Falha ao gerar proposta");
      }
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao gerar proposta", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-6">
      <PageHeader title="Nova Proposta" description="Preencha os dados abaixo e a IA gerará uma proposta profissional" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGenerate)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna esquerda */}
            <div className="space-y-4">
              {/* Dados do cliente */}
              <Card className="border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-heading text-[15px] font-semibold text-foreground">Dados do cliente</h3>
                </div>
                <CardContent className="p-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Nome do cliente *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Empresa do cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Empresa" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground text-sm">Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@cliente.com" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground text-sm">Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 99999-9999" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="clientNiche"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Segmento do cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Tecnologia, Saúde, Construção..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Contexto do cliente */}
              <Card className="border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-heading text-[15px] font-semibold text-foreground">Contexto do cliente</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Alimenta o argumento central da proposta</p>
                </div>
                <CardContent className="p-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="clientPain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Principal dor / desafio do cliente</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ex: Perde leads fora do horário, atendimento sobrecarregado..."
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Objetivo principal do cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Aumentar faturamento 30%, contratar menos..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expectedMetrics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Métricas / resultados que sua solução entrega</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Reduz 40% do tempo de atendimento..." {...field} />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Aparecerá no slide de resultados</p>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Serviço */}
              <Card className="border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-heading text-[15px] font-semibold text-foreground">Serviço</h3>
                </div>
                <CardContent className="p-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="niche"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Nicho / tipo de serviço</FormLabel>
                        <FormControl>
                          <Input placeholder={profile?.niche || "Tipo de serviço"} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Descrição do serviço *</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descreva o que será feito..." rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliverables"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Principais entregáveis</FormLabel>
                        <FormControl>
                          <Textarea placeholder="O que o cliente receberá..." rows={3} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deadlineDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Prazo de entrega (dias)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="30" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="proposalTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Tom da proposta</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="executivo">Executivo — formal, dados, autoridade</SelectItem>
                            <SelectItem value="agressivo">Agressivo / Impactante — direto, urgente</SelectItem>
                            <SelectItem value="consultivo">Consultivo — educativo, parceiro, confiança</SelectItem>
                            <SelectItem value="criativo">Criativo — inovador, moderno, diferenciado</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Coluna direita */}
            <div className="space-y-4">
              {/* Valores */}
              <Card className="border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-heading text-[15px] font-semibold text-foreground">Valores e condições</h3>
                </div>
                <CardContent className="p-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Forma de pagamento</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                          </FormControl>
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
                      </FormItem>
                    )}
                  />

                  {paymentTerms === "setup_mensal" ? (
                    <>
                      <FormField
                        control={form.control}
                        name="setupValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground text-sm">Valor do Setup (R$)</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="Ex: 2.500"
                                {...field}
                                onChange={(e) => field.onChange(formatCurrencyInput(e.target.value))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="monthlyValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground text-sm">Valor Mensal (R$)</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                inputMode="numeric"
                                placeholder="Ex: 750"
                                {...field}
                                onChange={(e) => field.onChange(formatCurrencyInput(e.target.value))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <FormField
                      control={form.control}
                      name="totalValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-muted-foreground text-sm">Valor total (R$)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              inputMode="numeric"
                              placeholder="Ex: 5.000"
                              {...field}
                              onChange={(e) => field.onChange(formatCurrencyInput(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="validityDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Validade da proposta (dias)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="15" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground text-sm">Informações adicionais</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Observações extras..." rows={2} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Template */}
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
                          type="button"
                          onClick={() => form.setValue("templateId", t.id)}
                          className={`group relative rounded-[10px] border-[1.5px] p-3 flex items-center gap-4 transition-all duration-150 cursor-pointer text-left ${
                            selected ? "bg-sidebar-accent" : "bg-background hover:border-secondary-foreground/20"
                          }`}
                          style={{ borderColor: selected ? t.accent : undefined }}
                        >
                          <TemplateMiniPreview t={t} />
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
                                <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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
                type="submit"
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
        </form>
      </Form>

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
