import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateProposalHtml(proposal: any, sections: any[], profile: any) {
  const primaryColor = profile?.primary_color || "#2563EB";
  const secondaryColor = profile?.secondary_color || "#0F1724";
  const companyName = profile?.company_name || "";
  const logoUrl = profile?.logo_url || "";

  const sectionsHtml = sections
    .sort((a: any, b: any) => a.order_index - b.order_index)
    .map(
      (s: any) => `
      <div style="margin-bottom: 24px;">
        <h2 style="color: ${primaryColor}; font-size: 18px; font-weight: 600; margin-bottom: 8px; font-family: 'Helvetica Neue', Arial, sans-serif;">${s.section_title}</h2>
        <p style="font-size: 14px; line-height: 1.8; color: #333; white-space: pre-wrap;">${s.content}</p>
      </div>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 0; size: A4; }
    body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; }
  </style>
</head>
<body>
  <div style="background: ${secondaryColor}; padding: 24px 40px; display: flex; align-items: center; gap: 16px;">
    ${logoUrl ? `<img src="${logoUrl}" style="height: 48px; width: 48px; object-fit: cover; border-radius: 8px;" />` : ""}
    <span style="color: white; font-size: 20px; font-weight: 700;">${companyName}</span>
  </div>
  <div style="height: 4px; background: ${primaryColor};"></div>
  
  <div style="padding: 40px;">
    <h1 style="text-align: center; font-size: 24px; font-weight: 700; margin-bottom: 32px; color: ${secondaryColor};">
      ${proposal.title || "Proposta Comercial"}
    </h1>
    
    ${sectionsHtml}
    
    <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 16px; text-align: center; font-size: 11px; color: #999;">
      Proposta válida por ${proposal.validity_days || 15} dias • ${companyName} • Gerada com PropostaAI
    </div>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      auth: { persistSession: false },
      global: { headers: { authorization: authHeader || "" } },
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { proposalId } = await req.json();
    if (!proposalId) {
      return new Response(JSON.stringify({ error: "proposalId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch proposal
    const { data: proposal, error: pError } = await adminClient
      .from("proposals")
      .select("*")
      .eq("id", proposalId)
      .eq("user_id", user.id)
      .single();

    if (pError || !proposal) {
      return new Response(JSON.stringify({ error: "Proposal not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch sections
    const { data: sections } = await adminClient
      .from("proposal_sections")
      .select("*")
      .eq("proposal_id", proposalId)
      .order("order_index");

    // Fetch profile
    const { data: profile } = await adminClient
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const html = generateProposalHtml(proposal, sections || [], profile);

    // Store HTML as a file in storage and return the URL
    // Since we can't use Puppeteer in Deno edge functions, 
    // we'll store the HTML and let the client handle rendering
    const fileName = `${user.id}/${proposalId}.html`;
    
    const htmlBlob = new Blob([html], { type: "text/html" });
    const { error: uploadError } = await adminClient.storage
      .from("pdfs")
      .upload(fileName, htmlBlob, { 
        contentType: "text/html", 
        upsert: true 
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data: urlData } = adminClient.storage.from("pdfs").getPublicUrl(fileName);

    // Update proposal with PDF URL
    await adminClient
      .from("proposals")
      .update({ pdf_url: urlData.publicUrl })
      .eq("id", proposalId);

    return new Response(
      JSON.stringify({ pdfUrl: urlData.publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-pdf error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
