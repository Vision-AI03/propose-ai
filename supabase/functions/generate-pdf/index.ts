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
    const browserlessApiKey = Deno.env.get("BROWSERLESS_API_KEY") ?? "";

    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    if (!supabaseAnonKey) throw new Error("SUPABASE_ANON_KEY is not configured");
    if (!browserlessApiKey) throw new Error("BROWSERLESS_API_KEY is not configured");

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

    if (!proposal.html_content) {
      return new Response(JSON.stringify({ error: "Proposal has no HTML content" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Calling Browserless for proposal:", proposalId);

    const browserlessUrl = `https://chrome.browserless.io/pdf?token=${browserlessApiKey}`;

    const pdfResponse = await fetch(browserlessUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: proposal.html_content,
        options: {
          landscape: true,
          width: "1280px",
          height: "720px",
          margin: { top: "0", right: "0", bottom: "0", left: "0" },
          printBackground: true,
          preferCSSPageSize: true,
          scale: 1,
        },
        gotoOptions: {
          waitUntil: "networkidle0",
          timeout: 30000,
        },
        addStyleTag: [
          {
            content: `
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              body { margin: 0 !important; padding: 0 !important; }
              .slide {
                page-break-after: always !important;
                break-after: page !important;
                width: 1280px !important;
                height: 720px !important;
                overflow: hidden !important;
                position: relative !important;
              }
              .slide:last-child {
                page-break-after: avoid !important;
                break-after: avoid !important;
              }
            `,
          },
        ],
      }),
    });

    if (!pdfResponse.ok) {
      const errText = await pdfResponse.text();
      console.error("Browserless error:", pdfResponse.status, errText);
      throw new Error(`Browserless error: ${pdfResponse.status} - ${errText.substring(0, 200)}`);
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();
    console.log("PDF gerado, tamanho:", pdfBuffer.byteLength, "bytes");

    const fileName = `${user.id}/${proposalId}.pdf`;
    const { error: uploadError } = await adminClient.storage
      .from("pdfs")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data: urlData } = adminClient.storage.from("pdfs").getPublicUrl(fileName);

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
