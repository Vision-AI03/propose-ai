import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey =
      Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!supabaseAnonKey) {
      throw new Error("SUPABASE_ANON_KEY (or SUPABASE_PUBLISHABLE_KEY) is not configured");
    }

    if (!anthropicApiKey) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    // Get user from auth header
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized - no token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError?.message);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      clientName, clientCompany, clientEmail, clientPhone,
      niche, serviceDescription, deliverables, deadlineDays,
      totalValue, paymentTerms, validityDays, additionalInfo,
      regenerateId,
    } = body;

    // Admin client for DB operations
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Check usage limits
    const { data: usage } = await adminClient
      .from("user_usage")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (usage) {
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      firstOfMonth.setHours(0, 0, 0, 0);

      if (new Date(usage.period_start) < firstOfMonth) {
        await adminClient
          .from("user_usage")
          .update({
            proposals_count: 0,
            period_start: firstOfMonth.toISOString().split("T")[0],
          })
          .eq("user_id", user.id);
        usage.proposals_count = 0;
      }

      if (usage.proposals_count >= 250) {
        return new Response(JSON.stringify({ error: "LIMIT_REACHED" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Get user profile
    const { data: profile } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const prompt = `Você é um especialista em elaboração de propostas comerciais profissionais para o mercado brasileiro.

Gere uma proposta comercial completa e persuasiva com base nos dados fornecidos.

DADOS DA EMPRESA:
- Empresa: ${profile?.company_name || "Não informado"}
- Segmento: ${niche || profile?.niche || "Geral"}

DADOS DO CLIENTE:
- Cliente: ${clientName}
- Empresa do cliente: ${clientCompany || "Não informado"}

SERVIÇO:
- Descrição: ${serviceDescription}
- Entregáveis: ${deliverables || "A definir"}
- Prazo: ${deadlineDays || 30} dias
- Valor: R$ ${totalValue || "A definir"}
- Pagamento: ${paymentTerms || "À vista"}
- Validade: ${validityDays || 15} dias
${additionalInfo ? `- Informações adicionais: ${additionalInfo}` : ""}

Retorne um JSON com as seguintes seções:
{
  "title": "título da proposta",
  "sections": [
    {"key": "introduction", "title": "Apresentação", "content": "..."},
    {"key": "about_us", "title": "Sobre Nós", "content": "..."},
    {"key": "problem", "title": "O Desafio", "content": "..."},
    {"key": "solution", "title": "Nossa Solução", "content": "..."},
    {"key": "deliverables", "title": "Entregáveis", "content": "..."},
    {"key": "timeline", "title": "Prazo e Cronograma", "content": "..."},
    {"key": "investment", "title": "Investimento", "content": "..."},
    {"key": "payment", "title": "Condições de Pagamento", "content": "..."},
    {"key": "next_steps", "title": "Próximos Passos", "content": "..."}
  ]
}

O conteúdo de cada seção deve ser profissional, persuasivo e personalizado.
Use parágrafos completos, não bullet points genéricos.
Retorne APENAS o JSON, sem texto adicional, sem markdown.`;

    // Call Claude API (Anthropic)
    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": anthropicApiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: "Você é um assistente especializado em criar propostas comerciais profissionais em português brasileiro. Responda APENAS com JSON válido.",
        messages: [
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402 || status === 400) {
        const errorText = await aiResponse.text();
        console.error("Claude API error:", status, errorText);
        return new Response(JSON.stringify({ error: "Erro na API do Claude. Verifique sua chave." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await aiResponse.text();
      console.error("Claude API error:", status, errorText);
      throw new Error(`Claude API error: ${status}`);
    }

    const aiData = await aiResponse.json();
    let aiContent = aiData.content?.[0]?.text || "";

    // Clean markdown code blocks if present
    aiContent = aiContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let proposalData;
    try {
      proposalData = JSON.parse(aiContent);
    } catch {
      console.error("Failed to parse AI response:", aiContent);
      throw new Error("Failed to parse AI response");
    }

    // If regenerating, update existing proposal
    if (regenerateId) {
      await adminClient
        .from("proposals")
        .update({
          title: proposalData.title,
          content: proposalData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", regenerateId);

      // Delete old sections and insert new
      await adminClient.from("proposal_sections").delete().eq("proposal_id", regenerateId);

      const newSections = proposalData.sections.map((s: any, i: number) => ({
        proposal_id: regenerateId,
        section_key: s.key,
        section_title: s.title,
        content: s.content,
        order_index: i,
      }));
      await adminClient.from("proposal_sections").insert(newSections);

      return new Response(JSON.stringify({ proposalId: regenerateId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create new proposal
    const { data: newProposal, error: insertError } = await adminClient
      .from("proposals")
      .insert({
        user_id: user.id,
        title: proposalData.title,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        client_company: clientCompany,
        niche: niche || profile?.niche,
        service_description: serviceDescription,
        deliverables,
        total_value: totalValue || null,
        payment_terms: paymentTerms,
        deadline_days: deadlineDays || null,
        validity_days: validityDays || 15,
        content: proposalData,
        status: "draft",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Insert sections
    const sectionRows = proposalData.sections.map((s: any, i: number) => ({
      proposal_id: newProposal.id,
      section_key: s.key,
      section_title: s.title,
      content: s.content,
      order_index: i,
    }));

    await adminClient.from("proposal_sections").insert(sectionRows);

    // Increment usage
    await adminClient
      .from("user_usage")
      .update({
        proposals_count: (usage?.proposals_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    return new Response(JSON.stringify({ proposalId: newProposal.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-proposal error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
