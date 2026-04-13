import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  "Propostas profissionais geradas em segundos com IA",
  "5 templates visuais para qualquer segmento",
  "Exportação em PDF com sua identidade visual",
];

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: "Erro", description: "As senhas não coincidem", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Erro", description: "A senha deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      toast({ title: "Erro ao criar conta", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Se sessão foi criada imediatamente (email confirmation desativado)
    if (data.session) {
      toast({ title: "Conta criada com sucesso!" });
      navigate("/onboarding");
      return;
    }

    // Se não há sessão, email de confirmação foi enviado
    toast({
      title: "Verifique seu email",
      description: "Enviamos um link de confirmação. Após confirmar, faça login.",
    });
    navigate("/login");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo — brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[hsl(var(--sidebar-background))] border-r border-border relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(217 91% 60% / 0.15), transparent)",
          }}
        />

        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">PropostaAI</span>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-bold text-foreground leading-tight">
              Comece a fechar mais negócios{" "}
              <span className="text-primary">hoje mesmo.</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Crie sua conta grátis e gere sua primeira proposta comercial profissional
              em menos de 2 minutos.
            </p>
          </div>

          <ul className="space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-success-bg flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="h-3 w-3 text-success" />
                </div>
                <span className="text-sm text-foreground/80">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground relative z-10">
          © {new Date().getFullYear()} PropostaAI. Todos os direitos reservados.
        </p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground">PropostaAI</span>
          </div>

          <Card className="border-border bg-card shadow-none">
            <CardHeader className="text-center pb-4">
              <CardTitle className="font-heading text-xl">Criar sua conta</CardTitle>
              <CardDescription>Comece a gerar propostas profissionais com IA</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    placeholder="Seu nome"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita a senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full btn-primary-hover"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta grátis"}
                </Button>
              </form>

              <div className="mt-5 text-center text-sm text-muted-foreground">
                Já tem conta?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Entrar
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
