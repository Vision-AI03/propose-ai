import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Query Pexels por nicho
function getPexelsQuery(myNiche: string, clientNiche: string): string {
  const combined = `${myNiche} ${clientNiche}`.toLowerCase()

  const queries: [string, string][] = [
    // Transporte e Logística
    ['transport|frete|logíst|entrega|frota',
     'logistics truck fleet highway professional'],
    ['mudança|mudanca',
     'moving truck professional service'],

    // Construção e Engenharia
    ['constru|reforma|engenharia|arquitet',
     'modern construction site architecture professional'],
    ['interior|decoraç|decorac',
     'modern interior design luxury apartment'],

    // Saúde
    ['estétic|estetica|beleza|cosmét|cosmetic|spa',
     'aesthetic clinic beauty treatment room modern'],
    ['odont|dentist|dental',
     'modern dental clinic professional clean'],
    ['fisio|reabilit',
     'physiotherapy clinic rehabilitation professional'],
    ['psicolog|terapia',
     'modern therapy office calm professional'],
    ['nutri',
     'nutrition healthy food modern clinic'],
    ['médic|medic|clínica|clinica',
     'modern medical clinic professional healthcare'],

    // Tecnologia
    ['software|sistema|app|aplicativ',
     'software development modern office technology'],
    ['tecnolog|ti |t.i',
     'modern tech office workspace professional'],

    // Educação
    ['escola|colégio|colegio|ensino fundamental',
     'modern school classroom education professional'],
    ['universidade|faculdade|graduaç',
     'university campus modern education'],
    ['curso|treinamento|capacitaç',
     'professional training corporate education modern'],

    // Marketing e Criativo
    ['marketing|publicidade|propaganda',
     'creative marketing agency modern office'],
    ['social media|conteúdo|conteudo',
     'content creator social media modern studio'],
    ['design|criat',
     'creative design studio modern workspace'],
    ['foto|vídeo|video|film',
     'professional photography studio modern equipment'],

    // Financeiro e Jurídico
    ['financ|contábil|contabil|contabilidade',
     'modern finance office professional business meeting'],
    ['banco|invest|segur',
     'financial investment modern office professional'],
    ['jurídic|jurid|advocacia|advogado|direito',
     'modern law office professional elegant'],

    // Varejo e Alimentação
    ['restaurante|gastronomia|food|aliment',
     'modern restaurant kitchen professional food'],
    ['loja|varejo|retail|moda|roupa',
     'modern retail store fashion professional'],
    ['supermercado|mercearia',
     'modern supermarket store professional'],

    // Imobiliário
    ['imobili|corretor|imóvel|imovel',
     'modern real estate luxury property architecture'],

    // Indústria
    ['indústr|industr|manufatur|fabricaç',
     'modern industrial factory professional manufacturing'],
    ['agro|agrícol|agricol|fazenda',
     'modern agriculture farm professional technology'],

    // Serviços Gerais
    ['limpeza|conservaç|facilities',
     'professional cleaning service corporate modern'],
    ['segurança|securit',
     'professional security modern corporate'],
    ['rh |recursos humanos|recrutamento',
     'human resources professional corporate modern office'],
    ['event|casamento|celebraç',
     'elegant event wedding decoration professional'],
  ]

  for (const [pattern, query] of queries) {
    const regex = new RegExp(pattern, 'i')
    if (regex.test(combined)) return query
  }

  // Fallback genérico mas melhor que antes
  return `${clientNiche} professional business modern office`
}

// Formatar telefone brasileiro
function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`
  }
  return phone
}

// Paleta de cores por nicho do cliente
function getNichePalette(clientNiche: string) {
  const n = clientNiche.toLowerCase()
  if (/transport|logístic|frete/.test(n))  return { primary: '#1B3A6B', secondary: '#E8650A', accent: '#F5A623' }
  if (/constru|reforma|engenharia/.test(n)) return { primary: '#2D4A1E', secondary: '#C17F24', accent: '#E8A838' }
  if (/saúde|clínica|médic|fisio/.test(n)) return { primary: '#0D4F8B', secondary: '#00A896', accent: '#02C39A' }
  if (/tecnolog|software|sistema/.test(n)) return { primary: '#1A1A2E', secondary: '#6C63FF', accent: '#A78BFA' }
  if (/educaç|escola|universidade/.test(n)) return { primary: '#1B4332', secondary: '#2D6A4F', accent: '#52B788' }
  if (/marketing|agência|publicidade/.test(n)) return { primary: '#2D1B69', secondary: '#E91E8C', accent: '#FF6B9D' }
  if (/financ|contábil|banco/.test(n))     return { primary: '#0A2342', secondary: '#1565C0', accent: '#42A5F5' }
  if (/imobili|corretor/.test(n))          return { primary: '#1A1A1A', secondary: '#8B6914', accent: '#C9A227' }
  if (/jurídic|advocacia/.test(n))         return { primary: '#1C1C2E', secondary: '#4A4E69', accent: '#9A8C98' }
  return { primary: '#1B2A4A', secondary: '#2563EB', accent: '#60A5FA' }
}

// Instruções visuais por template
function getTemplateInstructions(templateId: string): string {
  const templates: Record<string, string> = {
    impacto: `
TEMPLATE: IMPACTO COM DADOS

CAPA (header 220px):
- Imagem de fundo com overlay gradiente da cor primária (opacity 0.75)
- Logo da empresa no canto superior esquerdo (se disponível)
- Título da proposta em branco, fonte Sora, 36px, bold
- Nome do cliente em destaque com cor accent, 18px
- Badge "Proposta Personalizada" com fundo accent

MÉTRICAS (logo após capa):
- 3 a 4 cards horizontais com números de impacto estimados e realistas para o serviço
- Exemplos coerentes: "70% menos tempo manual", "ROI em 90 dias", "Suporte 24/7"
- Cards com borda superior 4px na cor accent, fundo branco, sombra sutil

GRÁFICO SVG OBRIGATÓRIO:
- Gráfico de barras comparativo "Antes vs Depois" OU linha de projeção de ROI
- Totalmente em SVG puro inline (sem bibliotecas)
- Cores: barras com cor primary e accent
- Eixos com labels relevantes ao serviço
- Título do gráfico acima
- Dados estimados realistas e coerentes com o serviço descrito

PROBLEMA:
- Grid 2x2 com cards de dor do cliente
- Cada card: ícone SVG inline 32px + título bold + texto descritivo
- Ícones temáticos para o nicho

SOLUÇÃO:
- Grid 2x2 de cards com fundo levemente colorido (accent opacity 0.08)
- Borda esquerda 3px accent
- Ícone SVG + título + descrição

ENTREGÁVEIS:
- Lista com checkmarks SVG coloridos na cor accent
- Dois itens por linha em grid

INVESTIMENTO:
- Tabela estilizada, linhas alternadas (zebra)
- Valor total em destaque com fonte grande e cor primary
- Condições de pagamento abaixo

PRÓXIMOS PASSOS:
- Timeline horizontal com 3 etapas numeradas e conectadas por linha

RODAPÉ:
- Fundo cor primary, texto branco
- Logo + dados de contato + validade`,

    narrativo: `
TEMPLATE: NARRATIVO COM FOTO

CAPA (layout duas colunas, altura 280px):
- Coluna esquerda (45%): imagem de fundo preenchendo toda a área com object-fit cover
- Coluna direita (55%): fundo branco, logo no topo, título grande Sora 32px, subtítulo, dados de contato na base

HISTÓRIA:
- Parágrafo empático em primeira pessoa sobre os desafios do negócio do cliente
- Texto rico, sem boxes, foco em narrativa
- Destaque de palavras-chave em bold com cor primary

SOLUÇÃO (duas colunas alternadas):
- Seção texto + elemento visual alternado a cada bloco
- Elemento visual: box colorido com ícone SVG grande centralizado e número de destaque

DIFERENCIAIS:
- Lista vertical com ícones SVG grandes (40px) na cor accent à esquerda
- Título e texto à direita
- Espaçamento generoso entre itens

RESULTADOS:
- Se houver dados numéricos: 3 números gigantes (72px) com cor primary e label abaixo
- Fundo levemente colorido (primary opacity 0.04)

GRÁFICO SVG SE HOUVER DADOS NUMÉRICOS:
- Gráfico de linha mostrando crescimento ou melhoria esperada
- Estilo clean, apenas linhas e pontos, sem grid pesado

INVESTIMENTO:
- Layout clean centralizado
- Valor em tipografia grande
- Condições em texto menor

CTA FINAL:
- Seção com fundo gradiente (primary → secondary)
- Texto de chamada em branco bold
- Dados de contato grandes

RODAPÉ:
- Fundo branco, linha superior accent
- Dados da empresa centralizados`,

    moderno: `
TEMPLATE: MODERNO COM CARDS

HEADER:
- Barra superior fina com logo à esquerda e dados de contato à direita
- Abaixo: título enorme Sora 52px, palavra-chave principal em cor accent
- Badge pill "Proposta para {nome_cliente}" com fundo accent opacity 0.12

PROBLEMA:
- 3 a 4 cards com borda esquerda 4px primary
- Ícone SVG 24px + título bold + texto curto
- Fundo cards: branco com sombra box-shadow sutil

SOLUÇÃO:
- Grid 2x2 feature cards
- Ícone SVG grande centralizado (40px) com fundo circular accent opacity 0.15
- Título centralizado bold
- Descrição centralizada text-secondary

PROCESSO:
- Timeline vertical
- Círculos numerados com fundo primary
- Conectados por linha vertical tracejada
- Título e descrição à direita de cada etapa

GRÁFICO SVG SE HOUVER DADOS:
- Gráfico de pizza ou donut mostrando distribuição do escopo ou tempo
- SVG puro inline com legendas

ENTREGÁVEIS:
- Duas colunas de pills/badges coloridas
- Cada entregável é um badge com fundo accent opacity 0.1 e texto accent

INVESTIMENTO:
- Card central destacado com fundo gradiente primary → secondary
- Valor em branco gigante
- Lista de inclusões com checkmarks brancos

RODAPÉ MODERNO:
- Grid três colunas: logo | links | contato`,

    minimalista: `
TEMPLATE: MINIMALISTA ELEGANTE

TIPOGRAFIA: Usar Playfair Display para títulos (importar do Google Fonts), Inter para corpo.

HEADER:
- Logo pequena superior esquerda (32px altura)
- Linha horizontal fina (#E5E5E5)
- Título da proposta em Playfair Display 40px, cor #1A1A1A
- Data e validade alinhados à direita, texto pequeno cinza

APRESENTAÇÃO:
- Texto corrido elegante, sem boxes
- Primeiro parágrafo em fonte levemente maior (18px)
- Espaçamento entre linhas 1.8

SOBRE O PROJETO:
- Linha divisória fina
- Título Playfair Display
- Texto em parágrafos bem espaçados
- Sem ícones, sem cards

ESCOPO:
- Lista numerada com hanging indent elegante
- Números em cor primary, texto em cinza escuro
- Espaçamento generoso entre itens

CRONOGRAMA:
- Tabela sem bordas excessivas
- Apenas linha inferior em cada linha (border-bottom 1px #F0F0F0)
- Header da tabela com texto pequeno maiúsculo espaçado (letter-spacing)

GRÁFICO: Não incluir gráfico neste template — foge da estética minimalista.

INVESTIMENTO:
- Linha horizontal acima e abaixo do valor
- Valor em Playfair Display 48px
- Condições em texto pequeno elegante abaixo

ASSINATURA:
- Linha para assinatura com nome abaixo
- "Proposta válida até {data}" em itálico

RODAPÉ:
- Dados de contato centralizados em fonte pequena
- Linha superior fina`,

    bold: `
TEMPLATE: BOLD IMPACTANTE

HERO (altura 320px):
- Imagem de fundo 100% cobrindo a seção
- Overlay escuro gradiente (rgba(0,0,0,0.65))
- Título em branco maiúsculo Sora 52px bold, sombra de texto sutil
- Subtítulo impactante em branco 20px
- Badge pill com nome do cliente em cor accent

PROBLEMA (fundo cor primary):
- Título branco 28px
- 3 a 4 pontos de dor em branco com ícones SVG brancos à esquerda
- Fundo escuro cria contraste forte

SOLUÇÃO (fundo branco):
- Cards com fundo accent opacity 0.08
- Borda 1px accent
- Ícone SVG grande accent + título primary bold + texto

IMPACTO (fundo gradiente primary → secondary):
- 3 a 4 números gigantes em branco (64px) com label abaixo em branco
- Separados por linhas verticais brancas com opacity 0.3
- Números estimados coerentes com o serviço

GRÁFICO SVG OBRIGATÓRIO:
- Gráfico de barras horizontais "Comparativo de eficiência"
- Barras na cor accent sobre fundo levemente escuro
- Labels em branco

ENTREGÁVEIS (fundo branco):
- Duas colunas, checkmark SVG accent + texto

INVESTIMENTO (fundo primary):
- Valor gigante em accent (56px)
- Condições em branco
- Botão visual CTA com fundo accent

RODAPÉ:
- Fundo muito escuro (#0A0A0A)
- Logo e dados em branco
- Linha superior accent`
  }

  return templates[templateId] || templates['moderno']
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
    const pexelsApiKey = Deno.env.get('PEXELS_API_KEY') ?? ''

    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }

    // Auth check
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized - no token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.json()
    const {
      proposalId, templateId,
      clientName, clientCompany, clientEmail, clientPhone, clientNiche,
      niche, serviceDescription, deliverables, deadlineDays,
      totalValue, setupValue, monthlyValue, paymentTerms, validityDays, additionalInfo,
      regenerateId,
    } = body

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const companyName = profile?.company_name || 'Empresa'
    const myNiche = niche || profile?.niche || 'Geral'
    const primaryColor = profile?.primary_color || null
    const secondaryColor = profile?.secondary_color || null
    const logoUrl = profile?.logo_url || ''
    const companyPhone = profile?.company_phone || ''
    const companyEmail = profile?.company_email || ''
    const companyWebsite = profile?.company_website || ''

    // 1. Verificar limite de uso
    const { data: usage } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (usage) {
      const firstOfMonth = new Date()
      firstOfMonth.setDate(1)
      firstOfMonth.setHours(0, 0, 0, 0)

      if (new Date(usage.period_start) < firstOfMonth) {
        await supabase.from('user_usage')
          .update({ proposals_count: 0, period_start: firstOfMonth.toISOString().split('T')[0] })
          .eq('user_id', user.id)
        usage.proposals_count = 0
      }

      if (usage.proposals_count >= 50) {
        return new Response(
          JSON.stringify({ error: 'LIMIT_REACHED' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        )
      }
    }

    // 2. Buscar foto no Pexels
    let photoUrl = ''
    if (pexelsApiKey) {
      try {
        const pexelsQuery = getPexelsQuery(myNiche, clientNiche || clientCompany || '')
        const pexelsRes = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(pexelsQuery)}&per_page=5&orientation=landscape&size=large`,
          { headers: { Authorization: pexelsApiKey } }
        )
        const pexelsData = await pexelsRes.json()
        const photos = pexelsData?.photos || []
        if (photos.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(photos.length, 3))
          photoUrl = photos[randomIndex]?.src?.large2x || photos[0]?.src?.large || ''
        }
      } catch (e) {
        console.log('Pexels fallback para gradiente:', e)
      }
    }

    // 3. Paleta de cores final
    const palette = getNichePalette(clientNiche || '')
    const finalPrimary = primaryColor || palette.primary
    const finalSecondary = secondaryColor || palette.secondary
    const finalAccent = palette.accent

    // 4. Template e instruções
    const templateInstructions = getTemplateInstructions(templateId || 'moderno')

    // 5. Chamar Claude para gerar HTML completo
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 20000,
        system: `Você é um designer expert em propostas comerciais profissionais para o mercado brasileiro.
REGRA ABSOLUTA: Retorne APENAS o HTML completo começando com <!DOCTYPE html>. Nenhum texto antes ou depois. Nenhum markdown. Nenhum bloco de código.
CRÍTICO: Você DEVE completar o HTML inteiramente até </html>. Nunca pare no meio. Se precisar reduzir conteúdo, simplifique seções mas SEMPRE finalize o documento.`,
        messages: [{
          role: 'user',
          content: `Gere uma proposta comercial COMPLETA em HTML dividida em páginas A4 fixas. Cada página é um div.pagina com dimensões exatas de 210mm × 297mm.

=== DADOS ===
Empresa: ${companyName}
Nicho: ${myNiche}
Telefone: ${formatPhone(companyPhone)}
Email: ${companyEmail}
Site: ${companyWebsite}
Logo: ${logoUrl ? `<img src="${logoUrl}" style="height:40px;object-fit:contain">` : `<span style="font-weight:700;font-size:18px">${companyName}</span>`}
Cliente: ${clientName} — ${clientCompany} (${clientNiche})
Serviço: ${serviceDescription}
Entregáveis: ${deliverables}
Prazo: ${deadlineDays} dias
${setupValue && monthlyValue
  ? `Setup: R$ ${Number(setupValue).toLocaleString('pt-BR', {minimumFractionDigits:2})} + Mensalidade: R$ ${Number(monthlyValue).toLocaleString('pt-BR', {minimumFractionDigits:2})}/mês`
  : `Valor: R$ ${Number(totalValue || 0).toLocaleString('pt-BR', {minimumFractionDigits:2})}`}
Pagamento: ${paymentTerms}
Validade: ${validityDays} dias
Foto contextual: ${photoUrl || ''}

=== IDENTIDADE VISUAL ===
Cor Primária: ${finalPrimary}
Cor Secundária: ${finalSecondary}
Cor Accent: ${finalAccent}

=== CSS BASE OBRIGATÓRIO ===

Inclua este CSS exato no <style>, sem alterações:

@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

@page { size: A4; margin: 0; }

* { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

body { background: #E5E7EB; display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 24px 0; font-family: 'Inter', sans-serif; font-size: 13px; }

.pagina { width: 794px; height: 1123px; background: white; overflow: hidden; position: relative; flex-shrink: 0; }

@media print { body { background: white; gap: 0; padding: 0; } .pagina { page-break-after: always; break-after: page; width: 210mm; height: 297mm; } .pagina:last-child { page-break-after: avoid; } }

=== ESTRUTURA OBRIGATÓRIA DAS PÁGINAS ===

PÁGINA 1 — CAPA:

Layout duas colunas 45%/55%:

Coluna esquerda (45%):
- Se tiver foto: imagem cobrindo 100% da altura com object-fit:cover, sem bordas
- Se não tiver foto: fundo gradiente com cor primária

Coluna direita (55%): fundo branco, padding 40px 32px
- Logo no topo (40px altura)
- Linha divisória fina (1px, cor primária, opacity 0.3)
- Badge pill "Proposta exclusiva para {cliente} • {empresa}" fundo levemente colorido, texto pequeno
- Título principal: Sora 32px bold, cor #1a1a2e, palavra-chave em cor primária
- Subtítulo: Inter 14px, cor #6b7280, line-height 1.6
- Espaço generoso
- Bloco de contatos no rodapé da coluna:
  Linha 1: [ícone telefone svg 14px] {telefone formatado}
  Linha 2: [ícone email svg 14px] {email}
  Linha 3: [ícone globe svg 14px] {site}

PÁGINA 2 — DESAFIOS + SOLUÇÃO:

- Título seção "Os Desafios de {nicho do cliente}" Sora 22px bold, cor #1a1a2e
- Subtítulo cinza 13px
- 4 items de desafio, cada um com:
  border-left 3px cor primária, padding-left 16px
  ícone SVG inline 16px na cor primária
  título bold 14px + texto 13px cinza
  margin-bottom 20px entre items

- Divisória com linha fina + espaço 24px

- Título "Nossa Solução" Sora 22px bold
- Grid 2x2 de cards de solução:
  cada card: padding 16px, border-radius 8px
  fundo #f8fafc, border 1px #e2e8f0
  ícone SVG 24px cor primária + título bold + texto 13px

PÁGINA 3 — PROCESSO + ENTREGÁVEIS:

- Título "Como Funciona o Processo" Sora 22px
- Timeline vertical: círculos numerados cor primária
  conectados por linha vertical tracejada
  4-5 etapas com título bold e descrição 13px

- Divisória

- Título "O Que Está Incluído"
- Grid 2 colunas de entregáveis:
  cada item: ícone check SVG cor primária + texto

PÁGINA 4 — INVESTIMENTO:

- Título "Investimento" Sora 22px
- Subtítulo descritivo cinza

- Card principal de investimento:
  fundo gradiente cor primária → cor secundária
  border-radius 12px, padding 32px
  label "SETUP INICIAL" ou "INVESTIMENTO TOTAL" em branco, 11px, uppercase, letter-spacing 2px
  Valor em branco: Sora 48px bold
  Condições de pagamento em branco 14px abaixo

- Card secundário fundo #f8fafc:
  "O que está incluído:"
  lista de entregáveis com checks coloridos em 2 colunas

- SE tiver gráfico relevante: SVG puro max-height 160px abaixo do card

PÁGINA 5 — PRÓXIMOS PASSOS + ENCERRAMENTO:

- Título "Próximos Passos" Sora 22px
- 3 etapas em cards horizontais lado a lado:
  número em círculo cor primária + título + descrição

- Seção de contato (NÃO é botão, é informação):
  fundo #f8fafc, border-radius 8px, padding 24px
  título "Entre em Contato" centralizado
  DOIS contatos por linha:
  [ícone] {telefone}    [ícone] {email}
  [ícone] {site}        [espaço]
  Texto simples, sem botões, sem links clicáveis

- Rodapé da página:
  linha horizontal fina
  texto centralizado 11px cinza:
  "${companyName} • ${formatPhone(companyPhone)} • ${companyEmail} • Proposta válida por ${validityDays} dias • Gerada com PropostaAI"

- Espaço para assinatura:
  linha horizontal 200px centralizada
  "${clientName} — ${clientCompany}"
  "Assinatura e Data" em texto pequeno cinza

=== REGRAS ABSOLUTAS ===
1. Retorne APENAS o HTML começando com <!DOCTYPE html>
2. Cada .pagina tem height FIXO 1123px — nunca ultrapassar
3. Nenhum elemento com height maior que 200px exceto a imagem da capa
4. Ícones SEMPRE SVG inline — nunca font-awesome
5. Cores: usar as cores fornecidas em todo o documento
6. Linguagem 100% adaptada ao nicho: ${clientNiche}
7. Proibido: botões clicáveis, formulários, links externos, menus de navegação
8. Contatos SEMPRE em texto simples nunca em botões
9. Telefone SEMPRE formatado: (XX) XXXXX-XXXX`
        }]
      })
    })

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text()
      console.error('Claude API error:', claudeResponse.status, errorText)

      if (claudeResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      throw new Error(`Claude API error: ${claudeResponse.status}`)
    }

    const claudeData = await claudeResponse.json()

    if (!claudeData.content || !claudeData.content[0]) {
      throw new Error('Claude não retornou conteúdo')
    }

    let htmlContent = claudeData.content[0].text.trim()

    // Garantir que começa com DOCTYPE
    if (!htmlContent.startsWith('<!DOCTYPE')) {
      const doctypeIndex = htmlContent.indexOf('<!DOCTYPE')
      if (doctypeIndex > -1) {
        htmlContent = htmlContent.substring(doctypeIndex)
      }
    }

    // Remover possíveis blocos markdown
    htmlContent = htmlContent.replace(/^```html\n?/, '').replace(/\n?```$/, '')

    const targetProposalId = regenerateId || proposalId

    if (targetProposalId) {
      // Update existing proposal with HTML
      await supabase.from('proposals')
        .update({
          html_content: htmlContent,
          template_id: templateId || 'moderno',
          status: 'generated',
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetProposalId)
    } else {
      // Create new proposal
      const { data: newProposal, error: insertError } = await supabase
        .from('proposals')
        .insert({
          user_id: user.id,
          title: `Proposta para ${clientName}`,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          client_company: clientCompany,
          niche: myNiche,
          service_description: serviceDescription,
          deliverables,
          total_value: setupValue ? (Number(setupValue) + Number(monthlyValue)) : (totalValue || null),
          payment_terms: paymentTerms,
          deadline_days: deadlineDays || null,
          validity_days: validityDays || 15,
          html_content: htmlContent,
          template_id: templateId || 'moderno',
          status: 'generated',
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Incrementar contador de uso
      await supabase.from('user_usage')
        .update({
          proposals_count: (usage?.proposals_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      return new Response(
        JSON.stringify({ success: true, proposalId: newProposal.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Incrementar contador de uso
    await supabase.from('user_usage')
      .update({
        proposals_count: (usage?.proposals_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

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
