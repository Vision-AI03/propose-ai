import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDocument, setCompanyDocument] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [niche, setNiche] = useState("");

  // Visual
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [secondaryColor, setSecondaryColor] = useState("#0F1724");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setCompanyName(profile.company_name || "");
      setCompanyDocument(profile.company_document || "");
      setCompanyPhone(profile.company_phone || "");
      setCompanyEmail(profile.company_email || "");
      setCompanyWebsite(profile.company_website || "");
      setCompanyAddress(profile.company_address || "");
      setNiche(profile.niche || "");
      setPrimaryColor(profile.primary_color || "#2563EB");
      setSecondaryColor(profile.secondary_color || "#0F1724");
      if (profile.logo_url) setLogoPreview(profile.logo_url);
    }
  }, [profile]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      let logoUrl = profile?.logo_url || "";
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `${user.id}/logo.${ext}`;
        await supabase.storage.from("logos").upload(path, logoFile, { upsert: true });
        const { data } = supabase.storage.from("logos").getPublicUrl(path);
        logoUrl = data.publicUrl;
      }

      const { error } = await supabase.from("profiles").update({
        full_name: fullName,
        company_name: companyName,
        company_document: companyDocument,
        company_phone: companyPhone,
        company_email: companyEmail,
        company_website: companyWebsite,
        company_address: companyAddress,
        niche,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        logo_url: logoUrl,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({ title: "Configurações salvas!" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Erro", description: "As senhas não coincidem", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Erro", description: "Mínimo 6 caracteres", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Senha atualizada!" });
      setNewPassword("");
      setConfirmPassword("");
    }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-6">Configurações</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="visual">Identidade Visual</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Dados da empresa</CardTitle>
              <CardDescription>Informações que aparecerão nas suas propostas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome completo</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Nome da empresa</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>CNPJ / CPF</Label>
                  <Input value={companyDocument} onChange={(e) => setCompanyDocument(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email comercial</Label>
                  <Input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Site</Label>
                  <Input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Endereço</Label>
                  <Input value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Nicho</Label>
                  <Input value={niche} onChange={(e) => setNiche(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Salvar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visual">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Identidade Visual</CardTitle>
              <CardDescription>Personalize suas propostas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Logo</Label>
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
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-10 w-14 rounded cursor-pointer border border-border" />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="max-w-32" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cor secundária</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-10 w-14 rounded cursor-pointer border border-border" />
                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="max-w-32" />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-lg border border-border p-4 bg-card">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
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

              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Salvar
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Alterar senha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Nova senha</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="space-y-2">
                <Label>Confirmar nova senha</Label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <Button onClick={handleChangePassword} disabled={saving || !newPassword}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Alterar senha
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
