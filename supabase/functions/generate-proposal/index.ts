import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { DARK_PREMIUM, CORPORATE_BLUE, CLEAN_LIGHT, BOLD_IMPACT, GRADIENT_MODERN } from './templates.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`
  if (digits.length === 10) return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`
  return phone
}

function getNichePalette(clientNiche: string) {
  const n = clientNiche.toLowerCase()
  if (/transport|logístic|frete/.test(n))    return { primary: '#1B3A6B', secondary: '#E8650A', accent: '#F5A623' }
  if (/constru|reforma|engenharia/.test(n))  return { primary: '#2D4A1E', secondary: '#C17F24', accent: '#E8A838' }
  if (/saúde|clínica|médic|fisio/.test(n))   return { primary: '#0D4F8B', secondary: '#00A896', accent: '#02C39A' }
  if (/tecnolog|software|sistema/.test(n))   return { primary: '#1A1A2E', secondary: '#6C63FF', accent: '#A78BFA' }
  if (/educa|escola|universidade/.test(n))   return { primary: '#1B4332', secondary: '#2D6A4F', accent: '#52B788' }
  if (/market|agência|publicidade/.test(n))  return { primary: '#2D1B69', secondary: '#E91E8C', accent: '#FF6B9D' }
  if (/financ|contábil|banco/.test(n))       return { primary: '#0A2342', secondary: '#1565C0', accent: '#42A5F5' }
  if (/imobili|corretor/.test(n))            return { primary: '#1A1A1A', secondary: '#8B6914', accent: '#C9A227' }
  if (/jurídic|advocacia/.test(n))           return { primary: '#1C1C2E', secondary: '#4A4E69', accent: '#9A8C98' }
  if (/estétic|beleza|spa/.test(n))          return { primary: '#3D1A47', secondary: '#C06FAC', accent: '#E8A0D0' }
  if (/restaurante|gastronomia|food/.test(n))return { primary: '#1A0A00', secondary: '#8B3A00', accent: '#D4751A' }
  return { primary: '#1B2A4A', secondary: '#2563EB', accent: '#60A5FA' }
}

function buildImagePrompt(clientNiche: string, templateId: string, tone: string): string {
  const n = clientNiche.toLowerCase()

  let style = ''
  if (templateId === 'dark_premium' || templateId === 'bold_impact') {
    style = 'dark moody cinematic, high contrast, dramatic lighting, professional photography, black and white tones'
  } else if (templateId === 'corporate_blue') {
    style = 'clean corporate professional, blue tones, modern office, sharp lighting'
  } else if (templateId === 'clean_light') {
    style = 'bright airy professional, soft natural lighting, minimalist clean, white tones'
  } else if (templateId === 'gradient_modern') {
    style = 'vibrant modern startup, dynamic composition, tech atmosphere, bold colors'
  } else {
    style = tone === 'agressivo'
      ? 'dark dramatic cinematic, high contrast, powerful atmosphere'
      : 'bright professional modern, clean workspace'
  }

  if (/estétic|estetica|beleza|spa|cabelo|nail/.test(n))
    return `modern luxury aesthetic clinic reception, elegant interior design, soft lighting, ${style}`
  if (/jurídic|advocacia|advogad|direito/.test(n))
    return `elegant law office interior, dark wood bookshelves, professional atmosphere, ${style}`
  if (/transport|logístic|frota|caminhão|frete/.test(n))
    return `modern logistics operations center, fleet management, professional, ${style}`
  if (/tecnolog|software|sistema|ti |tech|digital|saas/.test(n))
    return `modern tech startup open office, multiple monitors, clean workspace, collaborative, ${style}`
  if (/imobili|corretor|imóvel|construtora/.test(n))
    return `luxury real estate property modern architecture exterior, upscale neighborhood, ${style}`
  if (/restaurante|gastronomia|food|culinária|bar /.test(n))
    return `upscale restaurant interior, elegant table setting, warm ambient lighting, ${style}`
  if (/saúde|clínica|médic|hospital|odonto|fisio/.test(n))
    return `modern medical clinic reception, clean white interior, professional healthcare, ${style}`
  if (/financ|contábil|contabilidade|contador|invest/.test(n))
    return `modern corporate finance office, professional meeting room, financial district, ${style}`
  if (/constru|reforma|arquitet|engenharia/.test(n))
    return `modern architecture construction project, professional building site, ${style}`
  if (/educa|escola|universidade|cursinho|ensino/.test(n))
    return `modern university campus, students studying, bright educational environment, ${style}`
  if (/market|agência|publicidade|mídia|tráfego/.test(n))
    return `creative marketing agency office, colorful workspace, digital screens, ${style}`
  if (/varejo|loja|comércio|retail|ecommerce/.test(n))
    return `modern retail store interior, clean product display, professional commercial space, ${style}`

  return `modern professional business office interior, executive atmosphere, corporate environment, ${style}`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? ''
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
    const falApiKey = Deno.env.get('FAL_API_KEY') ?? ''

    if (!anthropicApiKey) throw new Error('ANTHROPIC_API_KEY is not configured')

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')

    let userId = 'anonymous'
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split('.')[1]
        const decoded = JSON.parse(atob(token))
        userId = decoded.sub || 'anonymous'
      } catch {
        userId = 'anonymous'
      }
    }

    const body = await req.json()
    const {
      proposalId, templateId,
      clientName, clientCompany, clientEmail, clientPhone, clientNiche,
      niche, serviceDescription, deliverables, deadlineDays,
      totalValue, setupValue, monthlyValue, paymentTerms, validityDays, additionalInfo,
      clientPain, clientGoal, expectedMetrics, proposalTone,
      regenerateId,
    } = body

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    const companyName = profile?.company_name || 'Empresa'
    const myNiche = niche || profile?.niche || 'Geral'
    const primaryColor = profile?.primary_color || null
    const secondaryColor = profile?.secondary_color || null
    const logoUrl = profile?.logo_url || ''
    const companyPhone = profile?.company_phone || ''
    const companyEmail = profile?.company_email || ''
    const companyWebsite = profile?.company_website || ''
    const companyDifferentials = (profile as any)?.company_differentials || ''

    // Verificar limite de uso
    const { data: usage } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (usage) {
      const firstOfMonth = new Date()
      firstOfMonth.setDate(1)
      firstOfMonth.setHours(0, 0, 0, 0)

      if (new Date(usage.period_start) < firstOfMonth) {
        await supabase.from('user_usage')
          .update({ proposals_count: 0, period_start: firstOfMonth.toISOString().split('T')[0] })
          .eq('user_id', userId)
        usage.proposals_count = 0
      }

      if (usage.proposals_count >= 50) {
        return new Response(
          JSON.stringify({ error: 'LIMIT_REACHED' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        )
      }
    }

    // Paleta de cores final
    const palette = getNichePalette(clientNiche || '')
    const finalPrimary = primaryColor || palette.primary
    const finalSecondary = secondaryColor || palette.secondary
    const finalAccent = palette.accent
    const tone = proposalTone || 'executivo'

    // Texto de investimento
    const investimentoTexto = setupValue && monthlyValue
      ? `Setup: R$ ${Number(setupValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} + R$ ${Number(monthlyValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês`
      : `R$ ${Number(totalValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

    // === AGENTE 1: Copywriter Estratégico ===
    console.log('Agente 1: Gerando conteúdo persuasivo...')

    const agent1Response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: 'Você é um copywriter estratégico especializado em propostas comerciais B2B brasileiras. Retorne APENAS JSON válido, sem markdown.',
        messages: [{
          role: 'user',
          content: `Gere conteúdo PERSUASIVO e PERSONALIZADO para uma proposta comercial.

DADOS DO CLIENTE:
- Nome: ${clientName}
- Empresa: ${clientCompany || 'não informada'}
- Segmento: ${clientNiche || 'não informado'}

CONTEXTO DA VENDA:
- Dor principal: ${clientPain || 'não informada'}
- Objetivo: ${clientGoal || 'não informado'}
- Métricas esperadas: ${expectedMetrics || 'não informadas'}

SERVIÇO PROPOSTO:
- Nicho: ${myNiche}
- Descrição: ${serviceDescription}
- Entregáveis: ${deliverables || 'não informados'}
- Prazo: ${deadlineDays || 'não informado'} dias
- Validade: ${validityDays || 15} dias
- Investimento: ${investimentoTexto}

SOBRE A EMPRESA PROPONENTE:
${companyDifferentials || companyName + ' — especialistas em soluções para o segmento.'}

TOM: ${tone}
${tone === 'agressivo' ? '→ Linguagem direta, urgente, foco em resultados imediatos.' : ''}
${tone === 'consultivo' ? '→ Linguagem educativa, posicionamento de parceiro, transformação a longo prazo.' : ''}
${tone === 'criativo' ? '→ Linguagem inovadora, referências ao futuro, diferenciação.' : ''}
${tone === 'executivo' ? '→ Linguagem formal, dados e métricas, autoridade.' : ''}

INSTRUÇÕES:
1. Use a DOR como argumento central nos desafios
2. Conecte a solução ao OBJETIVO do cliente
3. Use MÉTRICAS como prova no slide de resultados
4. Cite DIFERENCIAIS naturalmente no sobre_empresa
5. Seja específico — sem frases genéricas

Retorne APENAS este JSON:
{
  "titulo": "string",
  "subtitulo": "string",
  "sobre_empresa": "string",
  "desafios": [{"titulo":"string","descricao":"string"},{"titulo":"string","descricao":"string"},{"titulo":"string","descricao":"string"}],
  "solucao_titulo": "string",
  "beneficios": [{"titulo":"string","descricao":"string"},{"titulo":"string","descricao":"string"},{"titulo":"string","descricao":"string"},{"titulo":"string","descricao":"string"}],
  "processo": [{"numero":1,"titulo":"string","descricao":"string"},{"numero":2,"titulo":"string","descricao":"string"},{"numero":3,"titulo":"string","descricao":"string"},{"numero":4,"titulo":"string","descricao":"string"},{"numero":5,"titulo":"string","descricao":"string"}],
  "entregaveis": ["string","string","string","string"],
  "metricas": [{"valor":"string","descricao":"string"},{"valor":"string","descricao":"string"},{"valor":"string","descricao":"string"}],
  "proximos_passos": [{"numero":1,"titulo":"string","descricao":"string"},{"numero":2,"titulo":"string","descricao":"string"},{"numero":3,"titulo":"string","descricao":"string"}],
  "chamada_acao": "string"
}`
        }],
      }),
    })

    if (!agent1Response.ok) {
      const err = await agent1Response.text()
      console.error('Agente 1 erro:', agent1Response.status, err)
      if (agent1Response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
          status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      throw new Error(`Claude Agente 1 error: ${agent1Response.status}`)
    }

    const agent1Data = await agent1Response.json()
    if (!agent1Data.content?.[0]) throw new Error('Agente 1 sem conteúdo')

    let copyJson = agent1Data.content[0].text.trim()
    copyJson = copyJson.replace(/^```json?\n?/, '').replace(/\n?```$/, '')

    let copy: any
    try {
      copy = JSON.parse(copyJson)
    } catch {
      // Tenta extrair o JSON entre { e }
      const match = copyJson.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          copy = JSON.parse(match[0])
        } catch {
          console.error('JSON inválido agente 1:', copyJson.substring(0, 500))
          throw new Error('Falha ao parsear conteúdo do Agente 1')
        }
      } else {
        console.error('JSON inválido agente 1:', copyJson.substring(0, 500))
        throw new Error('Falha ao parsear conteúdo do Agente 1')
      }
    }

    console.log('Agente 1 concluído.')

    // === FAL.AI: Gerar imagem ===
    let photoUrl = ''
    if (falApiKey) {
      try {
        console.log('Fal.ai: Gerando imagem...')
        const imagePrompt = buildImagePrompt(clientNiche || myNiche, templateId || 'dark_premium', tone)
        const falRes = await fetch('https://fal.run/fal-ai/flux/schnell', {
          method: 'POST',
          headers: { 'Authorization': `Key ${falApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: imagePrompt, image_size: 'landscape_16_9', num_inference_steps: 4, num_images: 1 }),
        })
        const falData = await falRes.json()
        photoUrl = falData?.images?.[0]?.url || ''
        console.log('photoUrl gerado:', photoUrl?.substring(0, 50))
        console.log('Fal.ai concluído. URL:', photoUrl ? 'ok' : 'vazia')
      } catch (e) {
        console.log('Fal.ai error (não crítico):', e)
      }
    }

    // === PREENCHIMENTO PROGRAMÁTICO DOS PLACEHOLDERS ===
    console.log('Preenchendo template...')

    const templateMap: Record<string, string> = {
      dark_premium: DARK_PREMIUM,
      corporate_blue: CORPORATE_BLUE,
      clean_light: CLEAN_LIGHT,
      bold_impact: BOLD_IMPACT,
      gradient_modern: GRADIENT_MODERN,
    }

    const phoneFmt = formatPhone(companyPhone)
    const logoHtml = logoUrl
      ? `<img src="${logoUrl}" style="height:40px;object-fit:contain">`
      : `<span style="font-family:'Sora',sans-serif;font-weight:800;font-size:18px;color:currentColor">${companyName}</span>`
    const fallbackPhoto = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1280&h=720&fit=crop'

    const replacements: Record<string, string> = {
      '{{FOTO_URL}}':          photoUrl || fallbackPhoto,
      '{{COR_PRIMARIA}}':      finalPrimary,
      '{{COR_SECUNDARIA}}':    finalSecondary,
      '{{COR_ACCENT}}':        finalAccent,
      '{{LOGO}}':              logoHtml,
      '{{EMPRESA}}':           companyName,
      '{{CLIENTE}}':           clientName,
      '{{EMPRESA_CLIENTE}}':   clientCompany || clientName,
      '{{TELEFONE}}':          phoneFmt,
      '{{EMAIL}}':             companyEmail,
      '{{SITE}}':              companyWebsite,
      '{{INVESTIMENTO_TEXTO}}': investimentoTexto,
      '{{VALIDADE}}':          String(validityDays || 15),
      '{{PRAZO}}':             `${deadlineDays || 'A definir'} dias`,
      '{{TITULO}}':            copy.titulo || '',
      '{{SUBTITULO}}':         copy.subtitulo || '',
      '{{SOBRE_EMPRESA}}':     copy.sobre_empresa || '',
      '{{SOLUCAO_TITULO}}':    copy.solucao_titulo || '',
      '{{CHAMADA_ACAO}}':      (copy.chamada_acao || '').substring(0, 120),
      '{{DESAFIO_1_TITULO}}':  copy.desafios?.[0]?.titulo || '',
      '{{DESAFIO_1_DESC}}':    copy.desafios?.[0]?.descricao || '',
      '{{DESAFIO_2_TITULO}}':  copy.desafios?.[1]?.titulo || '',
      '{{DESAFIO_2_DESC}}':    copy.desafios?.[1]?.descricao || '',
      '{{DESAFIO_3_TITULO}}':  copy.desafios?.[2]?.titulo || '',
      '{{DESAFIO_3_DESC}}':    copy.desafios?.[2]?.descricao || '',
      '{{BENEFICIO_1_TITULO}}': copy.beneficios?.[0]?.titulo || '',
      '{{BENEFICIO_1_DESC}}':  copy.beneficios?.[0]?.descricao || '',
      '{{BENEFICIO_2_TITULO}}': copy.beneficios?.[1]?.titulo || '',
      '{{BENEFICIO_2_DESC}}':  copy.beneficios?.[1]?.descricao || '',
      '{{BENEFICIO_3_TITULO}}': copy.beneficios?.[2]?.titulo || '',
      '{{BENEFICIO_3_DESC}}':  copy.beneficios?.[2]?.descricao || '',
      '{{BENEFICIO_4_TITULO}}': copy.beneficios?.[3]?.titulo || '',
      '{{BENEFICIO_4_DESC}}':  copy.beneficios?.[3]?.descricao || '',
      '{{ETAPA_1_TITULO}}':    copy.processo?.[0]?.titulo || '',
      '{{ETAPA_1_DESC}}':      copy.processo?.[0]?.descricao || '',
      '{{ETAPA_2_TITULO}}':    copy.processo?.[1]?.titulo || '',
      '{{ETAPA_2_DESC}}':      copy.processo?.[1]?.descricao || '',
      '{{ETAPA_3_TITULO}}':    copy.processo?.[2]?.titulo || '',
      '{{ETAPA_3_DESC}}':      copy.processo?.[2]?.descricao || '',
      '{{ETAPA_4_TITULO}}':    copy.processo?.[3]?.titulo || '',
      '{{ETAPA_4_DESC}}':      copy.processo?.[3]?.descricao || '',
      '{{ETAPA_5_TITULO}}':    copy.processo?.[4]?.titulo || '',
      '{{ETAPA_5_DESC}}':      copy.processo?.[4]?.descricao || '',
      '{{ENTREGAVEL_1}}':      copy.entregaveis?.[0] || '',
      '{{ENTREGAVEL_2}}':      copy.entregaveis?.[1] || '',
      '{{ENTREGAVEL_3}}':      copy.entregaveis?.[2] || '',
      '{{ENTREGAVEL_4}}':      copy.entregaveis?.[3] || '',
      '{{METRICA_1_VALOR}}':   copy.metricas?.[0]?.valor || '',
      '{{METRICA_1_DESC}}':    copy.metricas?.[0]?.descricao || '',
      '{{METRICA_2_VALOR}}':   copy.metricas?.[1]?.valor || '',
      '{{METRICA_2_DESC}}':    copy.metricas?.[1]?.descricao || '',
      '{{METRICA_3_VALOR}}':   copy.metricas?.[2]?.valor || '',
      '{{METRICA_3_DESC}}':    copy.metricas?.[2]?.descricao || '',
      '{{PASSO_1_TITULO}}':    copy.proximos_passos?.[0]?.titulo || '',
      '{{PASSO_1_DESC}}':      copy.proximos_passos?.[0]?.descricao || '',
      '{{PASSO_2_TITULO}}':    copy.proximos_passos?.[1]?.titulo || '',
      '{{PASSO_2_DESC}}':      copy.proximos_passos?.[1]?.descricao || '',
      '{{PASSO_3_TITULO}}':    copy.proximos_passos?.[2]?.titulo || '',
      '{{PASSO_3_DESC}}':      copy.proximos_passos?.[2]?.descricao || '',
    }

    let htmlContent = templateMap[templateId] ?? DARK_PREMIUM
    for (const [placeholder, value] of Object.entries(replacements)) {
      htmlContent = htmlContent.replaceAll(placeholder, value)
    }

    console.log('Template preenchido.')

    const targetProposalId = regenerateId || proposalId

    if (targetProposalId) {
      await supabase.from('proposals')
        .update({
          html_content: htmlContent,
          template_id: templateId || 'dark_premium',
          photo_url: photoUrl || null,
          status: 'generated',
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetProposalId)
    } else {
      const { data: newProposal, error: insertError } = await supabase
        .from('proposals')
        .insert({
          user_id: userId,
          title: copy.titulo || `Proposta para ${clientName}`,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          client_company: clientCompany,
          client_niche: clientNiche,
          niche: myNiche,
          service_description: serviceDescription,
          deliverables,
          total_value: setupValue ? (Number(setupValue) + Number(monthlyValue)) : (totalValue || null),
          setup_value: setupValue || null,
          monthly_value: monthlyValue || null,
          payment_terms: paymentTerms,
          deadline_days: deadlineDays || null,
          validity_days: validityDays || 15,
          html_content: htmlContent,
          template_id: templateId || 'dark_premium',
          photo_url: photoUrl || null,
          status: 'generated',
          client_pain: clientPain || null,
          client_goal: clientGoal || null,
          proposal_tone: tone,
          expected_metrics: expectedMetrics || null,
        } as any)
        .select()
        .single()

      if (insertError) throw insertError

      await supabase.from('user_usage')
        .update({
          proposals_count: (usage?.proposals_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      return new Response(
        JSON.stringify({ success: true, proposalId: newProposal.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    await supabase.from('user_usage')
      .update({
        proposals_count: (usage?.proposals_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    return new Response(
      JSON.stringify({ success: true, proposalId: targetProposalId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
