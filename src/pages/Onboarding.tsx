import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Loader2, Upload, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Palette, Code, Camera, Users, Building2,
  Hammer, Scale, Heart, GraduationCap, MoreHorizontal
} from "lucide-react";

const NICHES = [
  { label: "Marketing Digital / Social Media", icon: Megaphone },
  { label: "Design Gráfico / UI-UX", icon: Palette },
  { label: "Desenvolvimento Web / Apps", icon: Code },
  { label: "Fotografia / Vídeo", icon: Camera },
  { label: "Consultoria / Coaching", icon: Users },
  { label: "Arquitetura / Interiores", icon: Building2 },
  { label: "Construção / Reformas", icon: Hammer },
  { label: "Serviços Jurídicos", icon: Scale },
  { label: "Saúde / Bem-estar", icon: Heart },
  { label: "Educação / Cursos", icon: GraduationCap },
  { label: "Outros", icon: MoreHorizontal },
];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [companyName, setCompanyName] = useState("");
  const [companyDocument, setCompanyDocument] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  // Step 2
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [secondaryColor, setSecondaryColor] = useState("#0F1724");

  // Step 3
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);

    try {
      let logoUrl = "";
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `${user.id}/logo.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("logos")
          .upload(path, logoFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);
        logoUrl = urlData.publicUrl;
      }

      const selectedNiche = niche === "Outros" ? customNiche : niche;

      const { error } = await supabase
        .from("profiles")
        .update({
          company_name: companyName,
          company_document: companyDocument,
          company_phone: companyPhone,
          company_email: companyEmail || user.email,
          company_website: companyWebsite,
          company_address: companyAddress,
          logo_url: logoUrl || null,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          niche: selectedNiche,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Invalida o cache do profile para o AppLayout ler o onboarding_completed atualizado
      await queryClient.invalidateQueries({ queryKey: ["profile", user.id] });

      toast({ title: "Configuração concluída!", description: "Bem-vindo ao PropostaAI!" });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">PropostaAI</h1>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex items-center gap-2 text-sm font-medium ${
                  s <= step ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    s < step
                      ? "bg-primary text-primary-foreground"
                      : s === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <Check className="h-4 w-4" /> : s}
                </div>
                <span className="hidden sm:inline">
                  {s === 1 ? "Sobre você" : s === 2 ? "Identidade visual" : "Segmento"}
                </span>
              </div>
            ))}
          </div>
          <Progress value={(step / 3) * 100} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Sobre sua empresa</CardTitle>
                  <CardDescription>Informações que aparecerão nas suas propostas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome da empresa *</Label>
                      <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Sua empresa" />
                    </div>
                    <div className="space-y-2">
                      <Label>CNPJ ou CPF</Label>
                      <Input value={companyDocument} onChange={(e) => setCompanyDocument(e.target.value)} placeholder="00.000.000/0001-00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} placeholder="(11) 99999-9999" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email comercial</Label>
                      <Input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="contato@empresa.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Site</Label>
                      <Input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} placeholder="www.empresa.com.br" />
                    </div>
                    <div className="space-y-2">
                      <Label>Endereço</Label>
                      <Input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Cidade, Estado" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)} disabled={!companyName}>Próximo</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Identidade visual</CardTitle>
                  <CardDescription>Personalize suas propostas com sua marca</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Logo da empresa</Label>
                    <div className="flex items-center gap-4">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="h-16 w-16 rounded-lg object-cover border border-border" />
                      ) : (
                        <div className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <Input type="file" accept="image/*" onChange={handleLogoChange} className="max-w-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cor primária</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-10 w-14 rounded cursor-pointer border border-border"
                        />
                        <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="max-w-32" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Cor secundária</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="h-10 w-14 rounded cursor-pointer border border-border"
                        />
                        <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="max-w-32" />
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="rounded-lg border border-border p-4 bg-card">
                    <p className="text-xs text-muted-foreground mb-2">Preview da proposta:</p>
                    <div className="rounded-md overflow-hidden">
                      <div className="h-12 flex items-center px-4 gap-3" style={{ backgroundColor: secondaryColor }}>
                        {logoPreview && <img src={logoPreview} alt="" className="h-8 w-8 rounded object-cover" />}
                        <span className="text-white font-heading font-semibold text-sm">{companyName || "Sua Empresa"}</span>
                      </div>
                      <div className="h-1" style={{ backgroundColor: primaryColor }} />
                      <div className="p-3 bg-card">
                        <div className="h-3 w-3/4 rounded bg-muted mb-2" />
                        <div className="h-2 w-1/2 rounded bg-muted" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                    <Button onClick={() => setStep(3)}>Próximo</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Seu segmento</CardTitle>
                  <CardDescription>Selecione o nicho principal da sua atuação</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {NICHES.map((n) => (
                      <button
                        key={n.label}
                        onClick={() => setNiche(n.label)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border text-sm font-medium transition-all ${
                          niche === n.label
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50 text-foreground"
                        }`}
                      >
                        <n.icon className="h-6 w-6" />
                        <span className="text-center text-xs">{n.label}</span>
                      </button>
                    ))}
                  </div>
                  {niche === "Outros" && (
                    <div className="space-y-2">
                      <Label>Qual seu nicho?</Label>
                      <Input value={customNiche} onChange={(e) => setCustomNiche(e.target.value)} placeholder="Descreva seu segmento" />
                    </div>
                  )}
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
                    <Button
                      onClick={handleFinish}
                      disabled={loading || !niche || (niche === "Outros" && !customNiche)}
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Concluir"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
