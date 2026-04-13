import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  "Propostas profissionais geradas em segundos com IA",
  "5 templates visuais para qualquer segmento",
  "Exportação em PDF com sua identidade visual",
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo — brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-[hsl(var(--sidebar-background))] border-r border-border relative overflow-hidden">
        {/* Gradiente decorativo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(217 91% 60% / 0.15), transparent)",
          }}
        />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">PropostaAI</span>
        </div>

        {/* Conteúdo central */}
        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-bold text-foreground leading-tight">
              Propostas comerciais profissionais,{" "}
              <span className="text-primary">geradas com IA</span> em segundos.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Pare de gastar horas criando propostas no Word. Com o PropostaAI, você gera
              apresentações bonitas e persuasivas em menos de 1 minuto.
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

        {/* Footer */}
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
              <CardTitle className="font-heading text-xl">Bem-vindo de volta</CardTitle>
              <CardDescription>Entre com seu email e senha para continuar</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full btn-primary-hover"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
                </Button>
              </form>

              <div className="mt-5 text-center text-sm text-muted-foreground">
                Não tem conta?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                >
                  Criar conta grátis
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
