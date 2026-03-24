export const DARK_PREMIUM = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#1a1a1a;display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 0;font-family:'Inter',sans-serif}
.slide{width:1280px;height:720px;position:relative;overflow:hidden;flex-shrink:0}
@media print{body{background:black;gap:0;padding:0}.slide{page-break-after:always;break-after:page}.slide:last-child{page-break-after:avoid}}
</style>
</head>
<body>

<!-- SLIDE 1: CAPA -->
<div class="slide" style="background:#0A0A0A">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.06" viewBox="0 0 1280 720" preserveAspectRatio="none">
    <polygon points="0,720 420,0 0,0" fill="#fff"/>
    <polygon points="1280,0 860,720 1280,720" fill="#fff"/>
  </svg>
  <svg style="position:absolute;top:0;right:0;width:200px;height:200px;opacity:.18" viewBox="0 0 200 200">
    <line x1="20" y1="0" x2="200" y2="180" stroke="#fff" stroke-width="1.5"/>
    <line x1="50" y1="0" x2="200" y2="150" stroke="#fff" stroke-width="1.5"/>
    <line x1="80" y1="0" x2="200" y2="120" stroke="#fff" stroke-width="1.5"/>
    <line x1="110" y1="0" x2="200" y2="90" stroke="#fff" stroke-width="1.5"/>
    <line x1="140" y1="0" x2="200" y2="60" stroke="#fff" stroke-width="1.5"/>
    <line x1="170" y1="0" x2="200" y2="30" stroke="#fff" stroke-width="1.5"/>
  </svg>
  <div style="position:absolute;right:0;top:0;width:500px;height:100%;clip-path:polygon(100px 0,100% 0,100% 100%,0 100%)">
    <img src="{{FOTO_URL}}" style="width:100%;height:100%;object-fit:cover;filter:grayscale(85%) contrast(1.2) brightness(.8)">
    <div style="position:absolute;inset:0;background:linear-gradient(to right,#0A0A0A 0%,rgba(10,10,10,.4) 50%,transparent 100%)"></div>
  </div>
  <div style="position:absolute;left:64px;top:0;bottom:0;width:680px;display:flex;flex-direction:column;justify-content:center;gap:20px">
    <div style="margin-bottom:4px">{{LOGO}}</div>
    <h1 style="font-family:'Sora',sans-serif;font-size:54px;font-weight:800;color:#fff;line-height:1.05;text-transform:uppercase;letter-spacing:-1px">{{TITULO}}</h1>
    <p style="font-size:17px;color:#999;font-weight:300;letter-spacing:.3px">{{SUBTITULO}}</p>
    <div style="display:flex;align-items:center;gap:14px;margin-top:4px">
      <div style="width:36px;height:2px;background:{{COR_ACCENT}}"></div>
      <span style="font-size:12px;color:#666;letter-spacing:2.5px;text-transform:uppercase">Proposta para {{CLIENTE}}</span>
    </div>
    <div style="position:absolute;bottom:44px;left:0">
      <span style="font-size:13px;color:#444">{{EMPRESA_CLIENTE}}</span>
    </div>
  </div>
</div>

<!-- SLIDE 2: SOBRE A EMPRESA -->
<div class="slide" style="background:#0D0D0D">
  <div style="position:absolute;left:0;top:0;width:3px;height:100%;background:{{COR_ACCENT}}"></div>
  <div style="display:flex;height:100%">
    <div style="flex:1;padding:64px 60px 64px 80px;display:flex;flex-direction:column;justify-content:center">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;margin-bottom:14px">Sobre nós</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:40px;font-weight:800;color:#fff;text-transform:uppercase;line-height:1.1;margin-bottom:24px">Prazer,<br>{{CLIENTE}}</h2>
      <p style="font-size:15px;color:#bbb;line-height:1.85;max-width:500px">{{SOBRE_EMPRESA}}</p>
    </div>
    <div style="width:420px;height:100%;position:relative;flex-shrink:0">
      <div style="width:100%;height:100%;background:linear-gradient(135deg,#1C1C1C,#0A0A0A)"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to right,#0D0D0D 0%,transparent 35%)"></div>
      <div style="position:absolute;bottom:44px;right:44px;width:72px;height:72px;border:2px solid {{COR_ACCENT}};transform:rotate(45deg)"></div>
    </div>
  </div>
</div>

<!-- SLIDE 3: DESAFIOS -->
<div class="slide" style="background:#111111">
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:36px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Diagnóstico</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff;text-transform:uppercase">Os Desafios do Seu Negócio</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:22px;flex:1">
      <div style="background:#1C1C1C;border:1px solid #2a2a2a;border-top:3px solid {{COR_ACCENT}};border-radius:4px;padding:28px 24px">
        <div style="width:38px;height:38px;border:1.5px solid {{COR_ACCENT}};border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:18px">
          <svg width="16" height="16" fill="none" stroke="{{COR_ACCENT}}" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:17px;font-weight:700;color:#fff;margin-bottom:10px">{{DESAFIO_1_TITULO}}</h3>
        <p style="font-size:13px;color:#888;line-height:1.75">{{DESAFIO_1_DESC}}</p>
      </div>
      <div style="background:#1C1C1C;border:1px solid #2a2a2a;border-top:3px solid {{COR_ACCENT}};border-radius:4px;padding:28px 24px">
        <div style="width:38px;height:38px;border:1.5px solid {{COR_ACCENT}};border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:18px">
          <svg width="16" height="16" fill="none" stroke="{{COR_ACCENT}}" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:17px;font-weight:700;color:#fff;margin-bottom:10px">{{DESAFIO_2_TITULO}}</h3>
        <p style="font-size:13px;color:#888;line-height:1.75">{{DESAFIO_2_DESC}}</p>
      </div>
      <div style="background:#1C1C1C;border:1px solid #2a2a2a;border-top:3px solid {{COR_ACCENT}};border-radius:4px;padding:28px 24px">
        <div style="width:38px;height:38px;border:1.5px solid {{COR_ACCENT}};border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:18px">
          <svg width="16" height="16" fill="none" stroke="{{COR_ACCENT}}" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:17px;font-weight:700;color:#fff;margin-bottom:10px">{{DESAFIO_3_TITULO}}</h3>
        <p style="font-size:13px;color:#888;line-height:1.75">{{DESAFIO_3_DESC}}</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 4: SOLUÇÃO -->
<div class="slide" style="background:linear-gradient(135deg,#0A0A0A 0%,#111111 100%)">
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:28px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Nossa Proposta</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff;text-transform:uppercase">{{SOLUCAO_TITULO}}</h2>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;flex:1">
      <div style="background:#1A1A1A;border:1px solid #2a2a2a;border-left:3px solid {{COR_ACCENT}};border-radius:4px;padding:22px">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_1_TITULO}}</h3>
        <p style="font-size:13px;color:#888;line-height:1.65">{{BENEFICIO_1_DESC}}</p>
      </div>
      <div style="background:#1A1A1A;border:1px solid #2a2a2a;border-left:3px solid {{COR_ACCENT}};border-radius:4px;padding:22px">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_2_TITULO}}</h3>
        <p style="font-size:13px;color:#888;line-height:1.65">{{BENEFICIO_2_DESC}}</p>
      </div>
      <div style="background:#1A1A1A;border:1px solid #2a2a2a;border-left:3px solid {{COR_ACCENT}};border-radius:4px;padding:22px">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_3_TITULO}}</h3>
        <p style="font-size:13px;color:#888;line-height:1.65">{{BENEFICIO_3_DESC}}</p>
      </div>
      <div style="background:#1A1A1A;border:1px solid #2a2a2a;border-left:3px solid {{COR_ACCENT}};border-radius:4px;padding:22px">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_4_TITULO}}</h3>
        <p style="font-size:13px;color:#888;line-height:1.65">{{BENEFICIO_4_DESC}}</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 5: PROCESSO -->
<div class="slide" style="background:#0D0D0D">
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:44px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Como funciona</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff;text-transform:uppercase">Sua Jornada Conosco.</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center">
      <div style="display:flex;width:100%;position:relative;align-items:flex-start">
        <div style="position:absolute;top:24px;left:24px;right:24px;height:1px;background:#2a2a2a;z-index:0"></div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:{{COR_ACCENT}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#000">1</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_1_TITULO}}</h3>
          <p style="font-size:11.5px;color:#666;line-height:1.55">{{ETAPA_1_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#1C1C1C;border:2px solid {{COR_ACCENT}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:{{COR_ACCENT}}">2</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_2_TITULO}}</h3>
          <p style="font-size:11.5px;color:#666;line-height:1.55">{{ETAPA_2_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#1C1C1C;border:2px solid {{COR_ACCENT}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:{{COR_ACCENT}}">3</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_3_TITULO}}</h3>
          <p style="font-size:11.5px;color:#666;line-height:1.55">{{ETAPA_3_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#1C1C1C;border:2px solid {{COR_ACCENT}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:{{COR_ACCENT}}">4</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_4_TITULO}}</h3>
          <p style="font-size:11.5px;color:#666;line-height:1.55">{{ETAPA_4_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#1C1C1C;border:2px solid {{COR_ACCENT}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:{{COR_ACCENT}}">5</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_5_TITULO}}</h3>
          <p style="font-size:11.5px;color:#666;line-height:1.55">{{ETAPA_5_DESC}}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 6: ENTREGÁVEIS -->
<div class="slide" style="background:#111111">
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:36px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">O que você recebe</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff;text-transform:uppercase">Entregáveis do Projeto</h2>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;flex:1;align-content:start">
      <div style="display:flex;align-items:center;gap:16px;background:#1C1C1C;border:1px solid #2a2a2a;border-radius:4px;padding:18px 22px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="{{COR_ACCENT}}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#ddd;font-weight:500">{{ENTREGAVEL_1}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#1C1C1C;border:1px solid #2a2a2a;border-radius:4px;padding:18px 22px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="{{COR_ACCENT}}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#ddd;font-weight:500">{{ENTREGAVEL_2}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#1C1C1C;border:1px solid #2a2a2a;border-radius:4px;padding:18px 22px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="{{COR_ACCENT}}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#ddd;font-weight:500">{{ENTREGAVEL_3}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#1C1C1C;border:1px solid #2a2a2a;border-radius:4px;padding:18px 22px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="{{COR_ACCENT}}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#ddd;font-weight:500">{{ENTREGAVEL_4}}</span>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 7: MÉTRICAS -->
<div class="slide" style="background:#0A0A0A">
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:40px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Resultados</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff;text-transform:uppercase">O que você pode esperar</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px;flex:1;align-items:center">
      <div style="text-align:center;padding:36px 24px;background:#111;border:1px solid #2a2a2a;border-radius:6px">
        <div style="font-family:'Sora',sans-serif;font-size:62px;font-weight:800;color:{{COR_ACCENT}};line-height:1">{{METRICA_1_VALOR}}</div>
        <div style="font-size:14px;color:#999;margin-top:12px;line-height:1.5">{{METRICA_1_DESC}}</div>
      </div>
      <div style="text-align:center;padding:36px 24px;background:#111;border:1px solid #2a2a2a;border-radius:6px">
        <div style="font-family:'Sora',sans-serif;font-size:62px;font-weight:800;color:{{COR_ACCENT}};line-height:1">{{METRICA_2_VALOR}}</div>
        <div style="font-size:14px;color:#999;margin-top:12px;line-height:1.5">{{METRICA_2_DESC}}</div>
      </div>
      <div style="text-align:center;padding:36px 24px;background:#111;border:1px solid #2a2a2a;border-radius:6px">
        <div style="font-family:'Sora',sans-serif;font-size:62px;font-weight:800;color:{{COR_ACCENT}};line-height:1">{{METRICA_3_VALOR}}</div>
        <div style="font-size:14px;color:#999;margin-top:12px;line-height:1.5">{{METRICA_3_DESC}}</div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 8: INVESTIMENTO -->
<div class="slide" style="background:#000000">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.04" viewBox="0 0 1280 720" preserveAspectRatio="none">
    <polygon points="0,720 420,0 0,0" fill="#fff"/>
    <polygon points="1280,0 860,720 1280,720" fill="#fff"/>
  </svg>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column;position:relative;z-index:1">
    <div style="margin-bottom:32px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Proposta Financeira</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff;text-transform:uppercase">Investimento</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div style="background:#111;border:1px solid #2a2a2a;border-radius:8px;padding:52px 80px;text-align:center;min-width:520px">
        <div style="font-family:'Sora',sans-serif;font-size:32px;font-weight:700;color:#FFFFFF;margin-bottom:16px;line-height:1.1">{{INVESTIMENTO_TEXTO}}</div>
        <div style="width:56px;height:2px;background:{{COR_ACCENT}};margin:0 auto 20px"></div>
        <p style="font-size:14px;color:#AAAAAA;line-height:1.8">Prazo de entrega: {{PRAZO}}<br>Validade da proposta: {{VALIDADE}} dias</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 9: PRÓXIMOS PASSOS -->
<div class="slide" style="background:#0A0A0A">
  <div style="padding:48px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:24px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;margin-bottom:6px">Para começar</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:28px;font-weight:800;color:#fff;text-transform:uppercase">Próximos Passos</h2>
    </div>
    <div style="display:flex;gap:18px;margin-bottom:28px">
      <div style="flex:1;background:#1C1C1C;border:1px solid #2a2a2a;border-top:3px solid {{COR_ACCENT}};border-radius:4px;padding:20px">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:{{COR_ACCENT}};margin-bottom:8px;line-height:1">01</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{PASSO_1_TITULO}}</h3>
        <p style="font-size:12px;color:#777;line-height:1.55">{{PASSO_1_DESC}}</p>
      </div>
      <div style="flex:1;background:#1C1C1C;border:1px solid #2a2a2a;border-top:3px solid {{COR_ACCENT}};border-radius:4px;padding:20px">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:{{COR_ACCENT}};margin-bottom:8px;line-height:1">02</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{PASSO_2_TITULO}}</h3>
        <p style="font-size:12px;color:#777;line-height:1.55">{{PASSO_2_DESC}}</p>
      </div>
      <div style="flex:1;background:#1C1C1C;border:1px solid #2a2a2a;border-top:3px solid {{COR_ACCENT}};border-radius:4px;padding:20px">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:{{COR_ACCENT}};margin-bottom:8px;line-height:1">03</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{PASSO_3_TITULO}}</h3>
        <p style="font-size:12px;color:#777;line-height:1.55">{{PASSO_3_DESC}}</p>
      </div>
    </div>
    <div style="border-top:1px solid #1c1c1c;padding-top:22px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <h1 style="font-family:'Sora',sans-serif;font-size:50px;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:-2px">OBRIGADO!</h1>
        <p style="font-size:16px;color:#FFFFFF;margin-top:6px;max-width:600px">{{CHAMADA_ACAO}}</p>
      </div>
      <div style="text-align:right;padding-bottom:40px">
        <div>{{LOGO}}</div>
        <p style="font-size:14px;color:#CCCCCC;margin-top:10px">{{TELEFONE}} • {{EMAIL}}</p>
        <p style="font-size:13px;color:#888888;margin-top:4px">Proposta válida por {{VALIDADE}} dias • PropostaAI</p>
      </div>
    </div>
  </div>
</div>

</body>
</html>`

export const CORPORATE_BLUE = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#070e1a;display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 0;font-family:'Inter',sans-serif}
.slide{width:1280px;height:720px;position:relative;overflow:hidden;flex-shrink:0}
@media print{body{background:#070e1a;gap:0;padding:0}.slide{page-break-after:always;break-after:page}.slide:last-child{page-break-after:avoid}}
</style>
</head>
<body>

<!-- SLIDE 1: CAPA -->
<div class="slide" style="background:#0A1628">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.07" viewBox="0 0 1280 720" preserveAspectRatio="none">
    <rect x="0" y="0" width="1280" height="3" fill="#2563EB"/>
    <circle cx="1100" cy="600" r="400" fill="none" stroke="#2563EB" stroke-width="1"/>
    <circle cx="1100" cy="600" r="300" fill="none" stroke="#2563EB" stroke-width="1"/>
  </svg>
  <div style="position:absolute;left:0;top:0;bottom:0;width:5px;background:linear-gradient(to bottom,#2563EB,#1D4ED8)"></div>
  <div style="position:absolute;right:0;top:0;width:520px;height:100%;clip-path:polygon(80px 0,100% 0,100% 100%,0 100%)">
    <img src="{{FOTO_URL}}" style="width:100%;height:100%;object-fit:cover;filter:grayscale(50%) brightness(.6) saturate(.8)">
    <div style="position:absolute;inset:0;background:linear-gradient(to right,#0A1628 0%,rgba(10,22,40,.6) 50%,transparent 100%)"></div>
  </div>
  <div style="position:absolute;left:64px;top:0;bottom:0;width:680px;display:flex;flex-direction:column;justify-content:center;gap:18px">
    <div>{{LOGO}}</div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:32px;height:2px;background:#2563EB"></div>
      <span style="font-size:11px;color:#2563EB;letter-spacing:3px;text-transform:uppercase">Proposta Comercial</span>
    </div>
    <h1 style="font-family:'Sora',sans-serif;font-size:52px;font-weight:800;color:#fff;line-height:1.05;letter-spacing:-1px">{{TITULO}}</h1>
    <p style="font-size:16px;color:#8ba3c4;font-weight:300">{{SUBTITULO}}</p>
    <div style="margin-top:8px;padding:16px 20px;background:rgba(37,99,235,.12);border:1px solid rgba(37,99,235,.25);border-radius:4px;display:inline-block;align-self:flex-start">
      <span style="font-size:13px;color:#93b4d6">Para: <strong style="color:#fff">{{CLIENTE}}</strong> — {{EMPRESA_CLIENTE}}</span>
    </div>
  </div>
</div>

<!-- SLIDE 2: SOBRE A EMPRESA -->
<div class="slide" style="background:#0D1E35">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#2563EB,transparent)"></div>
  <div style="display:flex;height:100%">
    <div style="flex:1;padding:64px 60px 64px 72px;display:flex;flex-direction:column;justify-content:center">
      <p style="font-size:11px;color:#2563EB;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px">Sobre nós</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:38px;font-weight:800;color:#fff;line-height:1.1;margin-bottom:22px">Prazer,<br>{{CLIENTE}}</h2>
      <p style="font-size:15px;color:#8ba3c4;line-height:1.85;max-width:500px">{{SOBRE_EMPRESA}}</p>
    </div>
    <div style="width:420px;height:100%;position:relative;flex-shrink:0">
      <div style="width:100%;height:100%;background:linear-gradient(135deg,#0D1E35,#06111f)"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to right,#0D1E35 0%,transparent 35%)"></div>
      <div style="position:absolute;bottom:40px;right:40px;padding:12px 20px;background:rgba(37,99,235,.2);border:1px solid rgba(37,99,235,.4);border-radius:4px">
        <span style="font-size:13px;color:#93b4d6;font-weight:500">{{EMPRESA}}</span>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 3: DESAFIOS -->
<div class="slide" style="background:#0A1628">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#2563EB,transparent)"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:36px">
      <p style="font-size:11px;color:#2563EB;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Diagnóstico</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">Os Desafios do Seu Negócio</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;flex:1">
      <div style="background:#0D1E35;border:1px solid #1a3a5c;border-top:3px solid #2563EB;border-radius:4px;padding:28px 22px">
        <div style="width:36px;height:36px;background:rgba(37,99,235,.15);border-radius:4px;display:flex;align-items:center;justify-content:center;margin-bottom:16px">
          <svg width="16" height="16" fill="none" stroke="#2563EB" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:#fff;margin-bottom:10px">{{DESAFIO_1_TITULO}}</h3>
        <p style="font-size:13px;color:#6a8aaa;line-height:1.75">{{DESAFIO_1_DESC}}</p>
      </div>
      <div style="background:#0D1E35;border:1px solid #1a3a5c;border-top:3px solid #2563EB;border-radius:4px;padding:28px 22px">
        <div style="width:36px;height:36px;background:rgba(37,99,235,.15);border-radius:4px;display:flex;align-items:center;justify-content:center;margin-bottom:16px">
          <svg width="16" height="16" fill="none" stroke="#2563EB" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:#fff;margin-bottom:10px">{{DESAFIO_2_TITULO}}</h3>
        <p style="font-size:13px;color:#6a8aaa;line-height:1.75">{{DESAFIO_2_DESC}}</p>
      </div>
      <div style="background:#0D1E35;border:1px solid #1a3a5c;border-top:3px solid #2563EB;border-radius:4px;padding:28px 22px">
        <div style="width:36px;height:36px;background:rgba(37,99,235,.15);border-radius:4px;display:flex;align-items:center;justify-content:center;margin-bottom:16px">
          <svg width="16" height="16" fill="none" stroke="#2563EB" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:#fff;margin-bottom:10px">{{DESAFIO_3_TITULO}}</h3>
        <p style="font-size:13px;color:#6a8aaa;line-height:1.75">{{DESAFIO_3_DESC}}</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 4: SOLUÇÃO -->
<div class="slide" style="background:#0D1E35">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#2563EB,transparent)"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:28px">
      <p style="font-size:11px;color:#2563EB;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Nossa Proposta</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">{{SOLUCAO_TITULO}}</h2>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;flex:1">
      <div style="background:#0A1628;border:1px solid #1a3a5c;border-left:3px solid #2563EB;border-radius:4px;padding:22px">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_1_TITULO}}</h3>
        <p style="font-size:13px;color:#6a8aaa;line-height:1.65">{{BENEFICIO_1_DESC}}</p>
      </div>
      <div style="background:#0A1628;border:1px solid #1a3a5c;border-left:3px solid #2563EB;border-radius:4px;padding:22px">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_2_TITULO}}</h3>
        <p style="font-size:13px;color:#6a8aaa;line-height:1.65">{{BENEFICIO_2_DESC}}</p>
      </div>
      <div style="background:#0A1628;border:1px solid #1a3a5c;border-left:3px solid #2563EB;border-radius:4px;padding:22px">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_3_TITULO}}</h3>
        <p style="font-size:13px;color:#6a8aaa;line-height:1.65">{{BENEFICIO_3_DESC}}</p>
      </div>
      <div style="background:#0A1628;border:1px solid #1a3a5c;border-left:3px solid #2563EB;border-radius:4px;padding:22px">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_4_TITULO}}</h3>
        <p style="font-size:13px;color:#6a8aaa;line-height:1.65">{{BENEFICIO_4_DESC}}</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 5: PROCESSO -->
<div class="slide" style="background:#0A1628">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#2563EB,transparent)"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:44px">
      <p style="font-size:11px;color:#2563EB;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Metodologia</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">Sua Jornada Conosco</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center">
      <div style="display:flex;width:100%;position:relative;align-items:flex-start">
        <div style="position:absolute;top:24px;left:24px;right:24px;height:1px;background:#1a3a5c;z-index:0"></div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#2563EB;display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#fff">1</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_1_TITULO}}</h3>
          <p style="font-size:11.5px;color:#5a7a9a;line-height:1.55">{{ETAPA_1_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#0D1E35;border:2px solid #2563EB;display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#2563EB">2</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_2_TITULO}}</h3>
          <p style="font-size:11.5px;color:#5a7a9a;line-height:1.55">{{ETAPA_2_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#0D1E35;border:2px solid #2563EB;display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#2563EB">3</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_3_TITULO}}</h3>
          <p style="font-size:11.5px;color:#5a7a9a;line-height:1.55">{{ETAPA_3_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#0D1E35;border:2px solid #2563EB;display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#2563EB">4</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_4_TITULO}}</h3>
          <p style="font-size:11.5px;color:#5a7a9a;line-height:1.55">{{ETAPA_4_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#0D1E35;border:2px solid #2563EB;display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#2563EB">5</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_5_TITULO}}</h3>
          <p style="font-size:11.5px;color:#5a7a9a;line-height:1.55">{{ETAPA_5_DESC}}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 6: ENTREGÁVEIS -->
<div class="slide" style="background:#0D1E35">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#2563EB,transparent)"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:36px">
      <p style="font-size:11px;color:#2563EB;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Escopo</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">Entregáveis do Projeto</h2>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;flex:1;align-content:start">
      <div style="display:flex;align-items:center;gap:16px;background:#0A1628;border:1px solid #1a3a5c;border-radius:4px;padding:18px 22px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#c8d9ec;font-weight:500">{{ENTREGAVEL_1}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#0A1628;border:1px solid #1a3a5c;border-radius:4px;padding:18px 22px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#c8d9ec;font-weight:500">{{ENTREGAVEL_2}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#0A1628;border:1px solid #1a3a5c;border-radius:4px;padding:18px 22px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#c8d9ec;font-weight:500">{{ENTREGAVEL_3}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#0A1628;border:1px solid #1a3a5c;border-radius:4px;padding:18px 22px">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#c8d9ec;font-weight:500">{{ENTREGAVEL_4}}</span>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 7: MÉTRICAS -->
<div class="slide" style="background:#0A1628">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#2563EB,transparent)"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:40px">
      <p style="font-size:11px;color:#2563EB;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Resultados</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">O que você pode esperar</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px;flex:1;align-items:center">
      <div style="text-align:center;padding:36px 24px;background:#0D1E35;border:1px solid #1a3a5c;border-radius:6px">
        <div style="font-family:'Sora',sans-serif;font-size:60px;font-weight:800;color:#2563EB;line-height:1">{{METRICA_1_VALOR}}</div>
        <div style="font-size:14px;color:#6a8aaa;margin-top:12px;line-height:1.5">{{METRICA_1_DESC}}</div>
      </div>
      <div style="text-align:center;padding:36px 24px;background:#0D1E35;border:1px solid #1a3a5c;border-radius:6px">
        <div style="font-family:'Sora',sans-serif;font-size:60px;font-weight:800;color:#2563EB;line-height:1">{{METRICA_2_VALOR}}</div>
        <div style="font-size:14px;color:#6a8aaa;margin-top:12px;line-height:1.5">{{METRICA_2_DESC}}</div>
      </div>
      <div style="text-align:center;padding:36px 24px;background:#0D1E35;border:1px solid #1a3a5c;border-radius:6px">
        <div style="font-family:'Sora',sans-serif;font-size:60px;font-weight:800;color:#2563EB;line-height:1">{{METRICA_3_VALOR}}</div>
        <div style="font-size:14px;color:#6a8aaa;margin-top:12px;line-height:1.5">{{METRICA_3_DESC}}</div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 8: INVESTIMENTO -->
<div class="slide" style="background:#06111f">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#2563EB,transparent)"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:32px">
      <p style="font-size:11px;color:#2563EB;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Proposta Financeira</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">Investimento</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div style="background:linear-gradient(135deg,#0D1E35,#0A1628);border:1px solid #1a3a5c;border-radius:8px;padding:52px 80px;text-align:center;min-width:520px">
        <div style="font-family:'Sora',sans-serif;font-size:32px;font-weight:700;color:#FFFFFF;margin-bottom:16px;line-height:1.1">{{INVESTIMENTO_TEXTO}}</div>
        <div style="width:56px;height:2px;background:#2563EB;margin:0 auto 20px"></div>
        <p style="font-size:14px;color:#AAAAAA;line-height:1.8">Prazo de entrega: {{PRAZO}}<br>Validade da proposta: {{VALIDADE}} dias</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 9: PRÓXIMOS PASSOS -->
<div class="slide" style="background:#0A1628">
  <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,#2563EB,transparent)"></div>
  <div style="padding:48px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:24px">
      <p style="font-size:11px;color:#2563EB;letter-spacing:3px;text-transform:uppercase;margin-bottom:6px">Para começar</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:28px;font-weight:800;color:#fff">Próximos Passos</h2>
    </div>
    <div style="display:flex;gap:18px;margin-bottom:28px">
      <div style="flex:1;background:#0D1E35;border:1px solid #1a3a5c;border-top:3px solid #2563EB;border-radius:4px;padding:20px">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:#2563EB;margin-bottom:8px">01</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{PASSO_1_TITULO}}</h3>
        <p style="font-size:12px;color:#5a7a9a;line-height:1.55">{{PASSO_1_DESC}}</p>
      </div>
      <div style="flex:1;background:#0D1E35;border:1px solid #1a3a5c;border-top:3px solid #2563EB;border-radius:4px;padding:20px">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:#2563EB;margin-bottom:8px">02</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{PASSO_2_TITULO}}</h3>
        <p style="font-size:12px;color:#5a7a9a;line-height:1.55">{{PASSO_2_DESC}}</p>
      </div>
      <div style="flex:1;background:#0D1E35;border:1px solid #1a3a5c;border-top:3px solid #2563EB;border-radius:4px;padding:20px">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:#2563EB;margin-bottom:8px">03</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{PASSO_3_TITULO}}</h3>
        <p style="font-size:12px;color:#5a7a9a;line-height:1.55">{{PASSO_3_DESC}}</p>
      </div>
    </div>
    <div style="border-top:1px solid #0d1e35;padding-top:22px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <h1 style="font-family:'Sora',sans-serif;font-size:50px;font-weight:800;color:#fff;letter-spacing:-2px">OBRIGADO!</h1>
        <p style="font-size:16px;color:#FFFFFF;margin-top:6px;max-width:600px">{{CHAMADA_ACAO}}</p>
      </div>
      <div style="text-align:right;padding-bottom:40px">
        <div>{{LOGO}}</div>
        <p style="font-size:14px;color:#CCCCCC;margin-top:10px">{{TELEFONE}} • {{EMAIL}}</p>
        <p style="font-size:13px;color:#888888;margin-top:4px">Proposta válida por {{VALIDADE}} dias • PropostaAI</p>
      </div>
    </div>
  </div>
</div>

</body>
</html>`
export const CLEAN_LIGHT = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#e8e8e8;display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 0;font-family:'Inter',sans-serif}
.slide{width:1280px;height:720px;position:relative;overflow:hidden;flex-shrink:0;background:#FAFAFA}
@media print{body{background:#e0e0e0;gap:0;padding:0}.slide{page-break-after:always;break-after:page}.slide:last-child{page-break-after:avoid}}
</style>
</head>
<body>

<!-- SLIDE 1: CAPA -->
<div class="slide">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.4" viewBox="0 0 1280 720" preserveAspectRatio="none">
    <circle cx="1100" cy="-50" r="500" fill="none" stroke="{{COR_PRIMARIA}}" stroke-width="1"/>
    <circle cx="1100" cy="-50" r="400" fill="none" stroke="{{COR_PRIMARIA}}" stroke-width="1"/>
    <circle cx="1100" cy="-50" r="300" fill="none" stroke="{{COR_PRIMARIA}}" stroke-width=".7"/>
  </svg>
  <div style="position:absolute;right:0;top:0;width:480px;height:100%">
    <img src="{{FOTO_URL}}" style="width:100%;height:100%;object-fit:cover">
    <div style="position:absolute;inset:0;background:linear-gradient(to right,#FAFAFA 0%,rgba(250,250,250,.2) 50%,transparent 100%)"></div>
  </div>
  <div style="position:absolute;left:0;top:0;bottom:0;width:680px;display:flex;flex-direction:column;justify-content:center;padding:0 64px;gap:20px">
    <div style="margin-bottom:4px">{{LOGO}}</div>
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:28px;height:3px;background:{{COR_PRIMARIA}};border-radius:2px"></div>
      <span style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:2.5px;text-transform:uppercase;font-weight:600">Proposta Comercial</span>
    </div>
    <h1 style="font-family:'Sora',sans-serif;font-size:50px;font-weight:800;color:#111;line-height:1.05;letter-spacing:-.5px">{{TITULO}}</h1>
    <p style="font-size:16px;color:#666;font-weight:300;line-height:1.5">{{SUBTITULO}}</p>
    <div style="margin-top:4px;display:flex;align-items:center;gap:10px">
      <div style="width:6px;height:6px;border-radius:50%;background:{{COR_PRIMARIA}}"></div>
      <span style="font-size:13px;color:#888">Preparado para <strong style="color:#333">{{CLIENTE}}</strong> — {{EMPRESA_CLIENTE}}</span>
    </div>
  </div>
</div>

<!-- SLIDE 2: SOBRE A EMPRESA -->
<div class="slide">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:{{COR_PRIMARIA}}"></div>
  <div style="display:flex;height:100%">
    <div style="flex:1;padding:64px 56px 64px 72px;display:flex;flex-direction:column;justify-content:center">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:14px">Sobre nós</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:38px;font-weight:800;color:#111;line-height:1.1;margin-bottom:22px">Prazer,<br>{{CLIENTE}}</h2>
      <p style="font-size:15px;color:#555;line-height:1.9;max-width:500px">{{SOBRE_EMPRESA}}</p>
    </div>
    <div style="width:440px;height:100%;position:relative;flex-shrink:0">
      <div style="width:100%;height:100%;background:linear-gradient(135deg,#e8e8e8,#d0d0d0)"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to right,#FAFAFA 0%,transparent 30%)"></div>
      <div style="position:absolute;bottom:40px;left:40px;padding:10px 18px;background:{{COR_PRIMARIA}};border-radius:4px">
        <span style="font-size:12px;color:#fff;font-weight:600;letter-spacing:.5px">{{EMPRESA}}</span>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 3: DESAFIOS -->
<div class="slide">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:{{COR_PRIMARIA}}"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:36px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px">Diagnóstico</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#111">Os Desafios do Seu Negócio</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;flex:1">
      <div style="background:#fff;border:1px solid #ebebeb;border-top:3px solid {{COR_PRIMARIA}};border-radius:8px;padding:28px 22px;box-shadow:0 2px 12px rgba(0,0,0,.05)">
        <div style="width:38px;height:38px;background:{{COR_PRIMARIA}}1a;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:16px">
          <svg width="16" height="16" fill="none" stroke="{{COR_PRIMARIA}}" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:#111;margin-bottom:10px">{{DESAFIO_1_TITULO}}</h3>
        <p style="font-size:13px;color:#666;line-height:1.75">{{DESAFIO_1_DESC}}</p>
      </div>
      <div style="background:#fff;border:1px solid #ebebeb;border-top:3px solid {{COR_PRIMARIA}};border-radius:8px;padding:28px 22px;box-shadow:0 2px 12px rgba(0,0,0,.05)">
        <div style="width:38px;height:38px;background:{{COR_PRIMARIA}}1a;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:16px">
          <svg width="16" height="16" fill="none" stroke="{{COR_PRIMARIA}}" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:#111;margin-bottom:10px">{{DESAFIO_2_TITULO}}</h3>
        <p style="font-size:13px;color:#666;line-height:1.75">{{DESAFIO_2_DESC}}</p>
      </div>
      <div style="background:#fff;border:1px solid #ebebeb;border-top:3px solid {{COR_PRIMARIA}};border-radius:8px;padding:28px 22px;box-shadow:0 2px 12px rgba(0,0,0,.05)">
        <div style="width:38px;height:38px;background:{{COR_PRIMARIA}}1a;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:16px">
          <svg width="16" height="16" fill="none" stroke="{{COR_PRIMARIA}}" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:#111;margin-bottom:10px">{{DESAFIO_3_TITULO}}</h3>
        <p style="font-size:13px;color:#666;line-height:1.75">{{DESAFIO_3_DESC}}</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 4: SOLUÇÃO -->
<div class="slide">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:{{COR_PRIMARIA}}"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:28px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px">Nossa Proposta</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#111">{{SOLUCAO_TITULO}}</h2>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;flex:1">
      <div style="background:#fff;border:1px solid #ebebeb;border-left:3px solid {{COR_PRIMARIA}};border-radius:8px;padding:22px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#111;margin-bottom:8px">{{BENEFICIO_1_TITULO}}</h3>
        <p style="font-size:13px;color:#666;line-height:1.65">{{BENEFICIO_1_DESC}}</p>
      </div>
      <div style="background:#fff;border:1px solid #ebebeb;border-left:3px solid {{COR_PRIMARIA}};border-radius:8px;padding:22px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#111;margin-bottom:8px">{{BENEFICIO_2_TITULO}}</h3>
        <p style="font-size:13px;color:#666;line-height:1.65">{{BENEFICIO_2_DESC}}</p>
      </div>
      <div style="background:#fff;border:1px solid #ebebeb;border-left:3px solid {{COR_PRIMARIA}};border-radius:8px;padding:22px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#111;margin-bottom:8px">{{BENEFICIO_3_TITULO}}</h3>
        <p style="font-size:13px;color:#666;line-height:1.65">{{BENEFICIO_3_DESC}}</p>
      </div>
      <div style="background:#fff;border:1px solid #ebebeb;border-left:3px solid {{COR_PRIMARIA}};border-radius:8px;padding:22px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#111;margin-bottom:8px">{{BENEFICIO_4_TITULO}}</h3>
        <p style="font-size:13px;color:#666;line-height:1.65">{{BENEFICIO_4_DESC}}</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 5: PROCESSO (timeline estilo Vision AI) -->
<div class="slide">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:{{COR_PRIMARIA}}"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:44px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px">Metodologia</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#111">Sua Jornada Conosco</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center">
      <div style="display:flex;width:100%;position:relative;align-items:flex-start">
        <div style="position:absolute;top:18px;left:18px;right:18px;height:2px;background:#ebebeb;z-index:0"></div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:36px;height:36px;border-radius:50%;background:{{COR_PRIMARIA}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:14px;font-weight:800;color:#fff">1</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#111;margin-top:14px;margin-bottom:6px">{{ETAPA_1_TITULO}}</h3>
          <p style="font-size:11.5px;color:#888;line-height:1.55">{{ETAPA_1_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:36px;height:36px;border-radius:50%;background:#fff;border:2px solid {{COR_PRIMARIA}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:14px;font-weight:800;color:{{COR_PRIMARIA}}">2</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#111;margin-top:14px;margin-bottom:6px">{{ETAPA_2_TITULO}}</h3>
          <p style="font-size:11.5px;color:#888;line-height:1.55">{{ETAPA_2_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:36px;height:36px;border-radius:50%;background:#fff;border:2px solid {{COR_PRIMARIA}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:14px;font-weight:800;color:{{COR_PRIMARIA}}">3</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#111;margin-top:14px;margin-bottom:6px">{{ETAPA_3_TITULO}}</h3>
          <p style="font-size:11.5px;color:#888;line-height:1.55">{{ETAPA_3_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:36px;height:36px;border-radius:50%;background:#fff;border:2px solid {{COR_PRIMARIA}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:14px;font-weight:800;color:{{COR_PRIMARIA}}">4</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#111;margin-top:14px;margin-bottom:6px">{{ETAPA_4_TITULO}}</h3>
          <p style="font-size:11.5px;color:#888;line-height:1.55">{{ETAPA_4_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:36px;height:36px;border-radius:50%;background:#fff;border:2px solid {{COR_PRIMARIA}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:14px;font-weight:800;color:{{COR_PRIMARIA}}">5</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#111;margin-top:14px;margin-bottom:6px">{{ETAPA_5_TITULO}}</h3>
          <p style="font-size:11.5px;color:#888;line-height:1.55">{{ETAPA_5_DESC}}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 6: ENTREGÁVEIS -->
<div class="slide">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:{{COR_PRIMARIA}}"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:36px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px">Escopo</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#111">Entregáveis do Projeto</h2>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;flex:1;align-content:start">
      <div style="display:flex;align-items:center;gap:16px;background:#fff;border:1px solid #ebebeb;border-radius:8px;padding:18px 22px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <div style="width:26px;height:26px;border-radius:50%;background:{{COR_PRIMARIA}};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span style="font-size:14px;color:#333;font-weight:500">{{ENTREGAVEL_1}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#fff;border:1px solid #ebebeb;border-radius:8px;padding:18px 22px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <div style="width:26px;height:26px;border-radius:50%;background:{{COR_PRIMARIA}};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span style="font-size:14px;color:#333;font-weight:500">{{ENTREGAVEL_2}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#fff;border:1px solid #ebebeb;border-radius:8px;padding:18px 22px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <div style="width:26px;height:26px;border-radius:50%;background:{{COR_PRIMARIA}};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span style="font-size:14px;color:#333;font-weight:500">{{ENTREGAVEL_3}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#fff;border:1px solid #ebebeb;border-radius:8px;padding:18px 22px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <div style="width:26px;height:26px;border-radius:50%;background:{{COR_PRIMARIA}};display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span style="font-size:14px;color:#333;font-weight:500">{{ENTREGAVEL_4}}</span>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 7: MÉTRICAS -->
<div class="slide">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:{{COR_PRIMARIA}}"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:40px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px">Resultados</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#111">O que você pode esperar</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px;flex:1;align-items:center">
      <div style="text-align:center;padding:36px 24px;background:#fff;border:1px solid #ebebeb;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.06)">
        <div style="font-family:'Sora',sans-serif;font-size:60px;font-weight:800;color:{{COR_PRIMARIA}};line-height:1">{{METRICA_1_VALOR}}</div>
        <div style="font-size:14px;color:#666;margin-top:12px;line-height:1.5">{{METRICA_1_DESC}}</div>
      </div>
      <div style="text-align:center;padding:36px 24px;background:#fff;border:1px solid #ebebeb;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.06)">
        <div style="font-family:'Sora',sans-serif;font-size:60px;font-weight:800;color:{{COR_PRIMARIA}};line-height:1">{{METRICA_2_VALOR}}</div>
        <div style="font-size:14px;color:#666;margin-top:12px;line-height:1.5">{{METRICA_2_DESC}}</div>
      </div>
      <div style="text-align:center;padding:36px 24px;background:#fff;border:1px solid #ebebeb;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.06)">
        <div style="font-family:'Sora',sans-serif;font-size:60px;font-weight:800;color:{{COR_PRIMARIA}};line-height:1">{{METRICA_3_VALOR}}</div>
        <div style="font-size:14px;color:#666;margin-top:12px;line-height:1.5">{{METRICA_3_DESC}}</div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 8: INVESTIMENTO -->
<div class="slide">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:{{COR_PRIMARIA}}"></div>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:32px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px">Proposta Financeira</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#111">Investimento</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div style="background:#fff;border:1px solid #ebebeb;border-radius:12px;padding:52px 80px;text-align:center;min-width:520px;box-shadow:0 8px 40px rgba(0,0,0,.08)">
        <div style="font-family:'Sora',sans-serif;font-size:32px;font-weight:700;color:{{COR_PRIMARIA}};margin-bottom:16px;line-height:1.1">{{INVESTIMENTO_TEXTO}}</div>
        <div style="width:56px;height:3px;background:{{COR_PRIMARIA}};margin:0 auto 20px;border-radius:2px"></div>
        <p style="font-size:14px;color:#AAAAAA;line-height:1.8">Prazo de entrega: {{PRAZO}}<br>Validade da proposta: {{VALIDADE}} dias</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 9: PRÓXIMOS PASSOS -->
<div class="slide">
  <div style="position:absolute;top:0;left:0;right:0;height:4px;background:{{COR_PRIMARIA}}"></div>
  <div style="padding:48px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:24px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:6px">Para começar</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:28px;font-weight:800;color:#111">Próximos Passos</h2>
    </div>
    <div style="display:flex;gap:18px;margin-bottom:28px">
      <div style="flex:1;background:#fff;border:1px solid #ebebeb;border-top:3px solid {{COR_PRIMARIA}};border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:{{COR_PRIMARIA}};margin-bottom:8px">01</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#111;margin-bottom:6px">{{PASSO_1_TITULO}}</h3>
        <p style="font-size:12px;color:#888;line-height:1.55">{{PASSO_1_DESC}}</p>
      </div>
      <div style="flex:1;background:#fff;border:1px solid #ebebeb;border-top:3px solid {{COR_PRIMARIA}};border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:{{COR_PRIMARIA}};margin-bottom:8px">02</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#111;margin-bottom:6px">{{PASSO_2_TITULO}}</h3>
        <p style="font-size:12px;color:#888;line-height:1.55">{{PASSO_2_DESC}}</p>
      </div>
      <div style="flex:1;background:#fff;border:1px solid #ebebeb;border-top:3px solid {{COR_PRIMARIA}};border-radius:8px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.04)">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;color:{{COR_PRIMARIA}};margin-bottom:8px">03</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#111;margin-bottom:6px">{{PASSO_3_TITULO}}</h3>
        <p style="font-size:12px;color:#888;line-height:1.55">{{PASSO_3_DESC}}</p>
      </div>
    </div>
    <div style="border-top:2px solid #f0f0f0;padding-top:22px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <h1 style="font-family:'Sora',sans-serif;font-size:50px;font-weight:800;color:#111;letter-spacing:-2px">OBRIGADO!</h1>
        <p style="font-size:16px;color:#333333;margin-top:6px;max-width:600px">{{CHAMADA_ACAO}}</p>
      </div>
      <div style="text-align:right;padding-bottom:40px">
        <div>{{LOGO}}</div>
        <p style="font-size:14px;color:#555555;margin-top:10px">{{TELEFONE}} • {{EMAIL}}</p>
        <p style="font-size:13px;color:#888888;margin-top:4px">Proposta válida por {{VALIDADE}} dias • PropostaAI</p>
      </div>
    </div>
  </div>
</div>

</body>
</html>`
export const BOLD_IMPACT = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#111;display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 0;font-family:'Inter',sans-serif}
.slide{width:1280px;height:720px;position:relative;overflow:hidden;flex-shrink:0}
@media print{body{background:#111;gap:0;padding:0}.slide{page-break-after:always;break-after:page}.slide:last-child{page-break-after:avoid}}
</style>
</head>
<body>

<!-- SLIDE 1: CAPA — foto full-screen + overlay -->
<div class="slide">
  <img src="{{FOTO_URL}}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
  <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,.85) 0%,rgba(0,0,0,.5) 60%,rgba(0,0,0,.3) 100%)"></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:60px 80px">
    <div style="margin-bottom:24px">{{LOGO}}</div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <div style="width:40px;height:3px;background:{{COR_ACCENT}}"></div>
      <span style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;font-weight:600">Proposta Exclusiva</span>
    </div>
    <h1 style="font-family:'Sora',sans-serif;font-size:68px;font-weight:900;color:#fff;line-height:1;text-transform:uppercase;letter-spacing:-2px;text-shadow:0 4px 24px rgba(0,0,0,.5);max-width:700px">{{TITULO}}</h1>
    <p style="font-size:18px;color:rgba(255,255,255,.75);margin-top:16px;font-weight:300;max-width:540px">{{SUBTITULO}}</p>
    <div style="margin-top:28px;padding:14px 28px;background:{{COR_ACCENT}};border-radius:4px;display:inline-block">
      <span style="font-size:14px;color:#fff;font-weight:700;letter-spacing:.5px">Para: {{CLIENTE}} — {{EMPRESA_CLIENTE}}</span>
    </div>
  </div>
</div>

<!-- SLIDE 2: SOBRE — layout dividido foto/conteúdo -->
<div class="slide" style="background:#1a0808;display:flex">
  <div style="width:480px;height:100%;position:relative;flex-shrink:0">
    <div style="width:100%;height:100%;background:linear-gradient(135deg,#2a1010,#1a0808)"></div>
    <div style="position:absolute;inset:0;background:linear-gradient(to right,transparent 60%,#1a0808 100%)"></div>
  </div>
  <div style="flex:1;padding:60px 60px 60px 48px;display:flex;flex-direction:column;justify-content:center">
    <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:14px">Sobre nós</p>
    <h2 style="font-family:'Sora',sans-serif;font-size:40px;font-weight:900;color:#fff;text-transform:uppercase;line-height:1.05;margin-bottom:22px">Prazer,<br>{{CLIENTE}}</h2>
    <p style="font-size:15px;color:rgba(255,255,255,.7);line-height:1.85">{{SOBRE_EMPRESA}}</p>
  </div>
</div>

<!-- SLIDE 3: DESAFIOS -->
<div class="slide" style="background:#111">
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:36px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px">O problema</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:40px;font-weight:900;color:#fff;text-transform:uppercase;line-height:1">OS DESAFIOS<br>DO SEU NEGÓCIO</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;flex:1">
      <div style="background:#1a0808;border:1px solid #2a1010;border-top:4px solid {{COR_ACCENT}};border-radius:4px;padding:28px 22px">
        <h3 style="font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#fff;margin-bottom:10px;text-transform:uppercase">{{DESAFIO_1_TITULO}}</h3>
        <p style="font-size:13px;color:rgba(255,255,255,.6);line-height:1.75">{{DESAFIO_1_DESC}}</p>
      </div>
      <div style="background:#1a0808;border:1px solid #2a1010;border-top:4px solid {{COR_ACCENT}};border-radius:4px;padding:28px 22px">
        <h3 style="font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#fff;margin-bottom:10px;text-transform:uppercase">{{DESAFIO_2_TITULO}}</h3>
        <p style="font-size:13px;color:rgba(255,255,255,.6);line-height:1.75">{{DESAFIO_2_DESC}}</p>
      </div>
      <div style="background:#1a0808;border:1px solid #2a1010;border-top:4px solid {{COR_ACCENT}};border-radius:4px;padding:28px 22px">
        <h3 style="font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#fff;margin-bottom:10px;text-transform:uppercase">{{DESAFIO_3_TITULO}}</h3>
        <p style="font-size:13px;color:rgba(255,255,255,.6);line-height:1.75">{{DESAFIO_3_DESC}}</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 4: SOLUÇÃO -->
<div class="slide" style="background:#0d0d0d">
  <div style="padding:56px 64px;height:100%;display:flex;flex-direction:column;justify-content:center">
    <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:12px">A solução</p>
    <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:900;color:#fff;text-transform:uppercase;line-height:1.05;margin-bottom:28px">{{SOLUCAO_TITULO}}</h2>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
      <div style="background:#1a1a1a;border-left:3px solid {{COR_ACCENT}};border-radius:4px;padding:18px">
        <h3 style="font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{BENEFICIO_1_TITULO}}</h3>
        <p style="font-size:12px;color:rgba(255,255,255,.55);line-height:1.6">{{BENEFICIO_1_DESC}}</p>
      </div>
      <div style="background:#1a1a1a;border-left:3px solid {{COR_ACCENT}};border-radius:4px;padding:18px">
        <h3 style="font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{BENEFICIO_2_TITULO}}</h3>
        <p style="font-size:12px;color:rgba(255,255,255,.55);line-height:1.6">{{BENEFICIO_2_DESC}}</p>
      </div>
      <div style="background:#1a1a1a;border-left:3px solid {{COR_ACCENT}};border-radius:4px;padding:18px">
        <h3 style="font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{BENEFICIO_3_TITULO}}</h3>
        <p style="font-size:12px;color:rgba(255,255,255,.55);line-height:1.6">{{BENEFICIO_3_DESC}}</p>
      </div>
      <div style="background:#1a1a1a;border-left:3px solid {{COR_ACCENT}};border-radius:4px;padding:18px">
        <h3 style="font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{BENEFICIO_4_TITULO}}</h3>
        <p style="font-size:12px;color:rgba(255,255,255,.55);line-height:1.6">{{BENEFICIO_4_DESC}}</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 5: PROCESSO -->
<div class="slide" style="background:#111">
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:44px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px">Como funciona</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:40px;font-weight:900;color:#fff;text-transform:uppercase">SUA JORNADA CONOSCO.</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center">
      <div style="display:flex;width:100%;position:relative;align-items:flex-start">
        <div style="position:absolute;top:24px;left:24px;right:24px;height:2px;background:#2a1010;z-index:0"></div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:{{COR_ACCENT}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:18px;font-weight:900;color:#fff">1</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:800;color:#fff;margin-top:14px;margin-bottom:6px;text-transform:uppercase">{{ETAPA_1_TITULO}}</h3>
          <p style="font-size:11.5px;color:rgba(255,255,255,.5);line-height:1.55">{{ETAPA_1_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#1a0808;border:2px solid {{COR_ACCENT}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:18px;font-weight:900;color:{{COR_ACCENT}}">2</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:800;color:#fff;margin-top:14px;margin-bottom:6px;text-transform:uppercase">{{ETAPA_2_TITULO}}</h3>
          <p style="font-size:11.5px;color:rgba(255,255,255,.5);line-height:1.55">{{ETAPA_2_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#1a0808;border:2px solid {{COR_ACCENT}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:18px;font-weight:900;color:{{COR_ACCENT}}">3</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:800;color:#fff;margin-top:14px;margin-bottom:6px;text-transform:uppercase">{{ETAPA_3_TITULO}}</h3>
          <p style="font-size:11.5px;color:rgba(255,255,255,.5);line-height:1.55">{{ETAPA_3_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#1a0808;border:2px solid {{COR_ACCENT}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:18px;font-weight:900;color:{{COR_ACCENT}}">4</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:800;color:#fff;margin-top:14px;margin-bottom:6px;text-transform:uppercase">{{ETAPA_4_TITULO}}</h3>
          <p style="font-size:11.5px;color:rgba(255,255,255,.5);line-height:1.55">{{ETAPA_4_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:#1a0808;border:2px solid {{COR_ACCENT}};display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:18px;font-weight:900;color:{{COR_ACCENT}}">5</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:800;color:#fff;margin-top:14px;margin-bottom:6px;text-transform:uppercase">{{ETAPA_5_TITULO}}</h3>
          <p style="font-size:11.5px;color:rgba(255,255,255,.5);line-height:1.55">{{ETAPA_5_DESC}}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 6: ENTREGÁVEIS -->
<div class="slide" style="background:#0d0d0d">
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:36px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px">Escopo</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:40px;font-weight:900;color:#fff;text-transform:uppercase">ENTREGÁVEIS</h2>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;flex:1;align-content:start">
      <div style="display:flex;align-items:center;gap:16px;background:#1a0808;border:1px solid #2a1010;border-radius:4px;padding:18px 22px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="{{COR_ACCENT}}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#fff;font-weight:600;text-transform:uppercase;letter-spacing:.3px">{{ENTREGAVEL_1}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#1a0808;border:1px solid #2a1010;border-radius:4px;padding:18px 22px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="{{COR_ACCENT}}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#fff;font-weight:600;text-transform:uppercase;letter-spacing:.3px">{{ENTREGAVEL_2}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#1a0808;border:1px solid #2a1010;border-radius:4px;padding:18px 22px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="{{COR_ACCENT}}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#fff;font-weight:600;text-transform:uppercase;letter-spacing:.3px">{{ENTREGAVEL_3}}</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#1a0808;border:1px solid #2a1010;border-radius:4px;padding:18px 22px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="{{COR_ACCENT}}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-size:14px;color:#fff;font-weight:600;text-transform:uppercase;letter-spacing:.3px">{{ENTREGAVEL_4}}</span>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 7: MÉTRICAS -->
<div class="slide" style="background:#111">
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:40px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px">Resultados</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:40px;font-weight:900;color:#fff;text-transform:uppercase">O QUE VOCÊ PODE ESPERAR</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px;flex:1;align-items:center">
      <div style="text-align:center;padding:36px 24px;background:#1a0808;border:2px solid {{COR_ACCENT}};border-radius:4px">
        <div style="font-family:'Sora',sans-serif;font-size:68px;font-weight:900;color:{{COR_ACCENT}};line-height:1">{{METRICA_1_VALOR}}</div>
        <div style="font-size:14px;color:rgba(255,255,255,.6);margin-top:12px;line-height:1.5;text-transform:uppercase;letter-spacing:.5px">{{METRICA_1_DESC}}</div>
      </div>
      <div style="text-align:center;padding:36px 24px;background:#1a0808;border:2px solid {{COR_ACCENT}};border-radius:4px">
        <div style="font-family:'Sora',sans-serif;font-size:68px;font-weight:900;color:{{COR_ACCENT}};line-height:1">{{METRICA_2_VALOR}}</div>
        <div style="font-size:14px;color:rgba(255,255,255,.6);margin-top:12px;line-height:1.5;text-transform:uppercase;letter-spacing:.5px">{{METRICA_2_DESC}}</div>
      </div>
      <div style="text-align:center;padding:36px 24px;background:#1a0808;border:2px solid {{COR_ACCENT}};border-radius:4px">
        <div style="font-family:'Sora',sans-serif;font-size:68px;font-weight:900;color:{{COR_ACCENT}};line-height:1">{{METRICA_3_VALOR}}</div>
        <div style="font-size:14px;color:rgba(255,255,255,.6);margin-top:12px;line-height:1.5;text-transform:uppercase;letter-spacing:.5px">{{METRICA_3_DESC}}</div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 8: INVESTIMENTO -->
<div class="slide">
  <div style="position:absolute;inset:0;background:linear-gradient(135deg,#1a0808 0%,#000 100%)"></div>
  <div style="position:absolute;inset:0;padding:56px 60px;display:flex;flex-direction:column">
    <div style="margin-bottom:32px">
      <p style="font-size:11px;color:{{COR_ACCENT}};letter-spacing:3px;text-transform:uppercase;font-weight:600;margin-bottom:8px">Proposta Financeira</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:40px;font-weight:900;color:#fff;text-transform:uppercase">INVESTIMENTO</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div style="background:rgba(0,0,0,.6);border:2px solid {{COR_ACCENT}};border-radius:4px;padding:52px 80px;text-align:center;min-width:520px;backdrop-filter:blur(10px)">
        <div style="font-family:'Sora',sans-serif;font-size:32px;font-weight:700;color:#FFFFFF;margin-bottom:16px;line-height:1.1">{{INVESTIMENTO_TEXTO}}</div>
        <div style="width:56px;height:3px;background:{{COR_ACCENT}};margin:0 auto 20px"></div>
        <p style="font-size:14px;color:#AAAAAA;line-height:1.8">Prazo: {{PRAZO}} • Validade: {{VALIDADE}} dias</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 9: ENCERRAMENTO -->
<div class="slide">
  <div style="position:absolute;inset:0;background:linear-gradient(to top,#000 0%,#1a0808 100%)"></div>
  <div style="position:absolute;inset:0;padding:48px 60px;display:flex;flex-direction:column;justify-content:space-between">
    <div style="display:flex;gap:18px">
      <div style="flex:1;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1);border-top:3px solid {{COR_ACCENT}};border-radius:4px;padding:20px;backdrop-filter:blur(8px)">
        <div style="font-family:'Sora',sans-serif;font-size:24px;font-weight:900;color:{{COR_ACCENT}};margin-bottom:8px">01</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:800;color:#fff;margin-bottom:6px;text-transform:uppercase">{{PASSO_1_TITULO}}</h3>
        <p style="font-size:12px;color:rgba(255,255,255,.55);line-height:1.55">{{PASSO_1_DESC}}</p>
      </div>
      <div style="flex:1;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1);border-top:3px solid {{COR_ACCENT}};border-radius:4px;padding:20px;backdrop-filter:blur(8px)">
        <div style="font-family:'Sora',sans-serif;font-size:24px;font-weight:900;color:{{COR_ACCENT}};margin-bottom:8px">02</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:800;color:#fff;margin-bottom:6px;text-transform:uppercase">{{PASSO_2_TITULO}}</h3>
        <p style="font-size:12px;color:rgba(255,255,255,.55);line-height:1.55">{{PASSO_2_DESC}}</p>
      </div>
      <div style="flex:1;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.1);border-top:3px solid {{COR_ACCENT}};border-radius:4px;padding:20px;backdrop-filter:blur(8px)">
        <div style="font-family:'Sora',sans-serif;font-size:24px;font-weight:900;color:{{COR_ACCENT}};margin-bottom:8px">03</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:800;color:#fff;margin-bottom:6px;text-transform:uppercase">{{PASSO_3_TITULO}}</h3>
        <p style="font-size:12px;color:rgba(255,255,255,.55);line-height:1.55">{{PASSO_3_DESC}}</p>
      </div>
    </div>
    <div style="display:flex;align-items:flex-end;justify-content:space-between">
      <div>
        <h1 style="font-family:'Sora',sans-serif;font-size:80px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:-3px;line-height:1;text-shadow:0 4px 24px rgba(0,0,0,.5)">OBRIGADO!</h1>
        <p style="font-size:16px;color:#FFFFFF;margin-top:8px;max-width:600px">{{CHAMADA_ACAO}}</p>
      </div>
      <div style="text-align:right;padding-bottom:40px">
        <div>{{LOGO}}</div>
        <p style="font-size:14px;color:#CCCCCC;margin-top:10px">{{TELEFONE}} • {{EMAIL}}</p>
        <p style="font-size:13px;color:#888888;margin-top:4px">Proposta válida por {{VALIDADE}} dias • PropostaAI</p>
      </div>
    </div>
  </div>
</div>

</body>
</html>`
export const GRADIENT_MODERN = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#06040f;display:flex;flex-direction:column;align-items:center;gap:8px;padding:16px 0;font-family:'Inter',sans-serif}
.slide{width:1280px;height:720px;position:relative;overflow:hidden;flex-shrink:0;background:#0D0A1E}
.glass{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(10px);border-radius:8px}
@media print{body{background:#06040f;gap:0;padding:0}.slide{page-break-after:always;break-after:page}.slide:last-child{page-break-after:avoid}}
</style>
</head>
<body>

<!-- SLIDE 1: CAPA -->
<div class="slide">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.35" viewBox="0 0 1280 720">
    <defs>
      <radialGradient id="g1" cx="70%" cy="30%" r="60%">
        <stop offset="0%" stop-color="{{COR_PRIMARIA}}" stop-opacity=".5"/>
        <stop offset="100%" stop-color="{{COR_PRIMARIA}}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="g2" cx="20%" cy="80%" r="50%">
        <stop offset="0%" stop-color="{{COR_SECUNDARIA}}" stop-opacity=".4"/>
        <stop offset="100%" stop-color="{{COR_SECUNDARIA}}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#g1)"/>
    <rect width="1280" height="720" fill="url(#g2)"/>
    <circle cx="900" cy="100" r="250" fill="none" stroke="{{COR_PRIMARIA}}" stroke-width=".5" opacity=".3"/>
    <circle cx="900" cy="100" r="180" fill="none" stroke="{{COR_PRIMARIA}}" stroke-width=".5" opacity=".2"/>
  </svg>
  <div style="position:absolute;right:0;top:0;width:480px;height:100%">
    <img src="{{FOTO_URL}}" style="width:100%;height:100%;object-fit:cover;filter:brightness(.5) saturate(.8)">
    <div style="position:absolute;inset:0;background:linear-gradient(to right,#0D0A1E 0%,rgba(13,10,30,.6) 50%,transparent 100%)"></div>
  </div>
  <div style="position:absolute;left:64px;top:0;bottom:0;width:680px;display:flex;flex-direction:column;justify-content:center;gap:18px">
    <div>{{LOGO}}</div>
    <div style="display:inline-flex;align-items:center;gap:10px;padding:6px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:20px;align-self:flex-start">
      <div style="width:6px;height:6px;border-radius:50%;background:{{COR_PRIMARIA}}"></div>
      <span style="font-size:11px;color:rgba(255,255,255,.7);letter-spacing:2px;text-transform:uppercase">Proposta Comercial</span>
    </div>
    <h1 style="font-family:'Sora',sans-serif;font-size:52px;font-weight:800;line-height:1.05;letter-spacing:-.5px;background:linear-gradient(135deg,#fff 0%,rgba(255,255,255,.7) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent">{{TITULO}}</h1>
    <p style="font-size:16px;color:rgba(255,255,255,.5);font-weight:300">{{SUBTITULO}}</p>
    <div style="padding:12px 18px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;display:inline-block;align-self:flex-start">
      <span style="font-size:13px;color:rgba(255,255,255,.6)">Para: <strong style="color:#fff">{{CLIENTE}}</strong> — {{EMPRESA_CLIENTE}}</span>
    </div>
  </div>
</div>

<!-- SLIDE 2: SOBRE -->
<div class="slide">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.2" viewBox="0 0 1280 720"><circle cx="200" cy="600" r="400" fill="{{COR_PRIMARIA}}" opacity=".15"/></svg>
  <div style="display:flex;height:100%;position:relative;z-index:1">
    <div style="flex:1;padding:64px 56px 64px 72px;display:flex;flex-direction:column;justify-content:center">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;margin-bottom:14px">Sobre nós</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:38px;font-weight:800;color:#fff;line-height:1.1;margin-bottom:22px">Prazer,<br>{{CLIENTE}}</h2>
      <p style="font-size:15px;color:rgba(255,255,255,.6);line-height:1.85;max-width:500px">{{SOBRE_EMPRESA}}</p>
    </div>
    <div style="width:440px;height:100%;position:relative;flex-shrink:0">
      <div style="width:100%;height:100%;background:linear-gradient(135deg,rgba(124,58,237,.15),rgba(13,10,30,.8))"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(to right,#0D0A1E 0%,transparent 35%)"></div>
      <div style="position:absolute;bottom:40px;right:40px;padding:12px 18px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;backdrop-filter:blur(10px)">
        <span style="font-size:13px;color:rgba(255,255,255,.7);font-weight:500">{{EMPRESA}}</span>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 3: DESAFIOS -->
<div class="slide">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.15" viewBox="0 0 1280 720"><circle cx="1100" cy="360" r="500" fill="{{COR_PRIMARIA}}" opacity=".2"/></svg>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column;position:relative;z-index:1">
    <div style="margin-bottom:36px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Diagnóstico</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">Os Desafios do Seu Negócio</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;flex:1">
      <div class="glass" style="padding:28px 22px">
        <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});display:flex;align-items:center;justify-content:center;margin-bottom:16px">
          <svg width="16" height="16" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:#fff;margin-bottom:10px">{{DESAFIO_1_TITULO}}</h3>
        <p style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.75">{{DESAFIO_1_DESC}}</p>
      </div>
      <div class="glass" style="padding:28px 22px">
        <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});display:flex;align-items:center;justify-content:center;margin-bottom:16px">
          <svg width="16" height="16" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:#fff;margin-bottom:10px">{{DESAFIO_2_TITULO}}</h3>
        <p style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.75">{{DESAFIO_2_DESC}}</p>
      </div>
      <div class="glass" style="padding:28px 22px">
        <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});display:flex;align-items:center;justify-content:center;margin-bottom:16px">
          <svg width="16" height="16" fill="none" stroke="#fff" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
        </div>
        <h3 style="font-family:'Sora',sans-serif;font-size:16px;font-weight:700;color:#fff;margin-bottom:10px">{{DESAFIO_3_TITULO}}</h3>
        <p style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.75">{{DESAFIO_3_DESC}}</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 4: SOLUÇÃO -->
<div class="slide">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.15" viewBox="0 0 1280 720"><circle cx="200" cy="200" r="400" fill="{{COR_SECUNDARIA}}" opacity=".3"/></svg>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column;position:relative;z-index:1">
    <div style="margin-bottom:28px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Nossa Proposta</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">{{SOLUCAO_TITULO}}</h2>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;flex:1">
      <div class="glass" style="padding:22px;border-left:2px solid {{COR_PRIMARIA}}">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_1_TITULO}}</h3>
        <p style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.65">{{BENEFICIO_1_DESC}}</p>
      </div>
      <div class="glass" style="padding:22px;border-left:2px solid {{COR_PRIMARIA}}">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_2_TITULO}}</h3>
        <p style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.65">{{BENEFICIO_2_DESC}}</p>
      </div>
      <div class="glass" style="padding:22px;border-left:2px solid {{COR_PRIMARIA}}">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_3_TITULO}}</h3>
        <p style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.65">{{BENEFICIO_3_DESC}}</p>
      </div>
      <div class="glass" style="padding:22px;border-left:2px solid {{COR_PRIMARIA}}">
        <h3 style="font-family:'Sora',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:8px">{{BENEFICIO_4_TITULO}}</h3>
        <p style="font-size:13px;color:rgba(255,255,255,.5);line-height:1.65">{{BENEFICIO_4_DESC}}</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 5: PROCESSO -->
<div class="slide">
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:44px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Metodologia</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">Sua Jornada Conosco</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center">
      <div style="display:flex;width:100%;position:relative;align-items:flex-start">
        <div style="position:absolute;top:24px;left:24px;right:24px;height:1px;background:rgba(255,255,255,.08);z-index:0"></div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:#fff">1</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_1_TITULO}}</h3>
          <p style="font-size:11.5px;color:rgba(255,255,255,.4);line-height:1.55">{{ETAPA_1_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:{{COR_PRIMARIA}}">2</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_2_TITULO}}</h3>
          <p style="font-size:11.5px;color:rgba(255,255,255,.4);line-height:1.55">{{ETAPA_2_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:{{COR_PRIMARIA}}">3</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_3_TITULO}}</h3>
          <p style="font-size:11.5px;color:rgba(255,255,255,.4);line-height:1.55">{{ETAPA_3_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:{{COR_PRIMARIA}}">4</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_4_TITULO}}</h3>
          <p style="font-size:11.5px;color:rgba(255,255,255,.4);line-height:1.55">{{ETAPA_4_DESC}}</p>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 10px;z-index:1">
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-family:'Sora',sans-serif;font-size:17px;font-weight:800;color:{{COR_PRIMARIA}}">5</div>
          <h3 style="font-family:'Sora',sans-serif;font-size:13px;font-weight:700;color:#fff;margin-top:14px;margin-bottom:6px">{{ETAPA_5_TITULO}}</h3>
          <p style="font-size:11.5px;color:rgba(255,255,255,.4);line-height:1.55">{{ETAPA_5_DESC}}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 6: ENTREGÁVEIS -->
<div class="slide">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.15" viewBox="0 0 1280 720"><circle cx="1100" cy="720" r="500" fill="{{COR_SECUNDARIA}}" opacity=".3"/></svg>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column;position:relative;z-index:1">
    <div style="margin-bottom:36px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Escopo</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">Entregáveis do Projeto</h2>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;flex:1;align-content:start">
      <div class="glass" style="display:flex;align-items:center;gap:16px;padding:18px 22px">
        <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span style="font-size:14px;color:rgba(255,255,255,.8);font-weight:500">{{ENTREGAVEL_1}}</span>
      </div>
      <div class="glass" style="display:flex;align-items:center;gap:16px;padding:18px 22px">
        <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span style="font-size:14px;color:rgba(255,255,255,.8);font-weight:500">{{ENTREGAVEL_2}}</span>
      </div>
      <div class="glass" style="display:flex;align-items:center;gap:16px;padding:18px 22px">
        <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span style="font-size:14px;color:rgba(255,255,255,.8);font-weight:500">{{ENTREGAVEL_3}}</span>
      </div>
      <div class="glass" style="display:flex;align-items:center;gap:16px;padding:18px 22px">
        <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span style="font-size:14px;color:rgba(255,255,255,.8);font-weight:500">{{ENTREGAVEL_4}}</span>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 7: MÉTRICAS -->
<div class="slide">
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column">
    <div style="margin-bottom:40px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Resultados</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">O que você pode esperar</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px;flex:1;align-items:center">
      <div class="glass" style="text-align:center;padding:36px 24px">
        <div style="display:inline-block;padding:4px 14px;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});border-radius:20px;margin-bottom:12px">
          <span style="font-size:10px;color:#fff;font-weight:600;letter-spacing:1px;text-transform:uppercase">Resultado</span>
        </div>
        <div style="font-family:'Sora',sans-serif;font-size:60px;font-weight:800;color:#fff;line-height:1;margin-bottom:12px">{{METRICA_1_VALOR}}</div>
        <div style="font-size:14px;color:rgba(255,255,255,.5);line-height:1.5">{{METRICA_1_DESC}}</div>
      </div>
      <div class="glass" style="text-align:center;padding:36px 24px">
        <div style="display:inline-block;padding:4px 14px;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});border-radius:20px;margin-bottom:12px">
          <span style="font-size:10px;color:#fff;font-weight:600;letter-spacing:1px;text-transform:uppercase">Resultado</span>
        </div>
        <div style="font-family:'Sora',sans-serif;font-size:60px;font-weight:800;color:#fff;line-height:1;margin-bottom:12px">{{METRICA_2_VALOR}}</div>
        <div style="font-size:14px;color:rgba(255,255,255,.5);line-height:1.5">{{METRICA_2_DESC}}</div>
      </div>
      <div class="glass" style="text-align:center;padding:36px 24px">
        <div style="display:inline-block;padding:4px 14px;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});border-radius:20px;margin-bottom:12px">
          <span style="font-size:10px;color:#fff;font-weight:600;letter-spacing:1px;text-transform:uppercase">Resultado</span>
        </div>
        <div style="font-family:'Sora',sans-serif;font-size:60px;font-weight:800;color:#fff;line-height:1;margin-bottom:12px">{{METRICA_3_VALOR}}</div>
        <div style="font-size:14px;color:rgba(255,255,255,.5);line-height:1.5">{{METRICA_3_DESC}}</div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 8: INVESTIMENTO -->
<div class="slide">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.2" viewBox="0 0 1280 720"><circle cx="640" cy="360" r="500" fill="{{COR_PRIMARIA}}" opacity=".2"/></svg>
  <div style="padding:56px 60px;height:100%;display:flex;flex-direction:column;position:relative;z-index:1">
    <div style="margin-bottom:32px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Proposta Financeira</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#fff">Investimento</h2>
    </div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center">
      <div class="glass" style="padding:52px 80px;text-align:center;min-width:520px;border:1px solid rgba(255,255,255,.12)">
        <div style="font-family:'Sora',sans-serif;font-size:32px;font-weight:700;color:#FFFFFF;margin-bottom:16px;line-height:1.1">{{INVESTIMENTO_TEXTO}}</div>
        <div style="width:56px;height:2px;background:linear-gradient(to right,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});margin:0 auto 20px;border-radius:2px"></div>
        <p style="font-size:14px;color:#AAAAAA;line-height:1.8">Prazo de entrega: {{PRAZO}}<br>Validade da proposta: {{VALIDADE}} dias</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 9: PRÓXIMOS PASSOS -->
<div class="slide">
  <svg style="position:absolute;inset:0;width:100%;height:100%;opacity:.15" viewBox="0 0 1280 720"><circle cx="200" cy="100" r="400" fill="{{COR_PRIMARIA}}" opacity=".25"/><circle cx="1100" cy="600" r="350" fill="{{COR_SECUNDARIA}}" opacity=".2"/></svg>
  <div style="padding:48px 60px;height:100%;display:flex;flex-direction:column;position:relative;z-index:1">
    <div style="margin-bottom:24px">
      <p style="font-size:11px;color:{{COR_PRIMARIA}};letter-spacing:3px;text-transform:uppercase;margin-bottom:6px">Para começar</p>
      <h2 style="font-family:'Sora',sans-serif;font-size:28px;font-weight:800;color:#fff">Próximos Passos</h2>
    </div>
    <div style="display:flex;gap:18px;margin-bottom:28px">
      <div class="glass" style="flex:1;padding:20px;border-top:2px solid {{COR_PRIMARIA}}">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px">01</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{PASSO_1_TITULO}}</h3>
        <p style="font-size:12px;color:rgba(255,255,255,.4);line-height:1.55">{{PASSO_1_DESC}}</p>
      </div>
      <div class="glass" style="flex:1;padding:20px;border-top:2px solid {{COR_PRIMARIA}}">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px">02</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{PASSO_2_TITULO}}</h3>
        <p style="font-size:12px;color:rgba(255,255,255,.4);line-height:1.55">{{PASSO_2_DESC}}</p>
      </div>
      <div class="glass" style="flex:1;padding:20px;border-top:2px solid {{COR_PRIMARIA}}">
        <div style="font-family:'Sora',sans-serif;font-size:26px;font-weight:800;background:linear-gradient(135deg,{{COR_PRIMARIA}},{{COR_SECUNDARIA}});-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px">03</div>
        <h3 style="font-family:'Sora',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:6px">{{PASSO_3_TITULO}}</h3>
        <p style="font-size:12px;color:rgba(255,255,255,.4);line-height:1.55">{{PASSO_3_DESC}}</p>
      </div>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,.06);padding-top:22px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <h1 style="font-family:'Sora',sans-serif;font-size:50px;font-weight:800;color:#fff;letter-spacing:-2px">OBRIGADO!</h1>
        <p style="font-size:16px;color:#FFFFFF;margin-top:6px;max-width:600px">{{CHAMADA_ACAO}}</p>
      </div>
      <div style="text-align:right;padding-bottom:40px">
        <div>{{LOGO}}</div>
        <p style="font-size:14px;color:#CCCCCC;margin-top:10px">{{TELEFONE}} • {{EMAIL}}</p>
        <p style="font-size:13px;color:#888888;margin-top:4px">Proposta válida por {{VALIDADE}} dias • PropostaAI</p>
      </div>
    </div>
  </div>
</div>

</body>
</html>`
