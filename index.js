<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<title>Drone Parsel Sim v4 — Turyap Queen</title>
<link rel="manifest" id="pwa-manifest">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#1a4fa0">
<link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet">
<script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Exo+2:wght@400;700;800&display=swap");
*{margin:0;padding:0;box-sizing:border-box}

/* --- EKLENEN: GECE MODU CSS DEGISKENLERI --- */
body.dark-mode {
  --acc:#3b82f6; --acc2:#60a5fa; --red:#ef4444; --grn:#10b981; --gld:#f59e0b;
  --panel:#1e293b; --bg:#0f172a; --border:rgba(255,255,255,0.15); --txt:#f8fafc; --sub:#94a3b8;
}

:root{--acc:#1a4fa0;--acc2:#2a6fd4;--red:#c82800;--grn:#166a30;--gld:#9a6800;--panel:#fff;--bg:#f4f7fc;--border:rgba(20,70,160,.13);--txt:#1a2438;--sub:#7a8a9a;--ff:"Share Tech Mono",monospace;--ff2:"Exo 2",sans-serif}
html,body{height:100%;overflow:hidden;background:var(--bg);font-family:var(--ff);transition:background 0.3s, color 0.3s;}

/* --- EKLENEN: FAST/PRO BUTON STILLERI VE PIN ANIMASYONU --- */
.mode-toggle-btn{background:var(--bg);border:1px solid var(--border);color:var(--sub);padding:5px 12px;border-radius:15px;font-size:10px;font-weight:bold;font-family:var(--ff);cursor:pointer;margin-left:6px;transition:all 0.3s ease;box-shadow:0 2px 5px rgba(0,0,0,0.05);}
.mode-toggle-btn.act{background:var(--acc);color:#fff;border-color:var(--acc);box-shadow:0 4px 10px rgba(0,0,0,0.15);}
.mode-toggle-btn.pro{background:var(--bg);}
.mode-toggle-btn.pro.act{background:var(--grn);color:#fff;border-color:var(--grn);}
@keyframes dropPin { 0% { transform:translateY(-80px) scale(0.5); opacity:0; } 100% { transform:translateY(0) scale(1); opacity:1; } }

/* FORM */
#fscreen{height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(150deg,#c8dfff,#edf4fb 50%,#c8e8d0);overflow-y:auto;padding:20px}
.fbox{background:rgba(255,255,255,.98);border:1px solid rgba(20,90,200,.16);border-radius:22px;padding:28px 24px;width:100%;max-width:460px;box-shadow:0 10px 50px rgba(10,60,160,.12)}
.fbrand{text-align:center;margin-bottom:12px}
.fbrand-ic{font-size:42px;display:block;animation:bob 3s ease-in-out infinite}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.fbrand-t{font-family:var(--ff2);font-weight:800;font-size:16px;color:var(--acc);letter-spacing:4px;margin-top:4px}
.fbrand-s{font-size:8px;color:#8a9aaa;letter-spacing:3px}
.fbrand-q{font-size:9px;color:var(--gld);letter-spacing:2px;font-weight:700;margin-top:2px}
.fhr{height:1px;background:linear-gradient(90deg,transparent,rgba(20,90,200,.2),transparent);margin:10px 0}
.flbl{font-size:9px;color:var(--acc);letter-spacing:2px;font-weight:700;display:block;margin-bottom:3px}
.finp,.fsel{width:100%;background:#f2f6fc;border:1px solid rgba(20,90,200,.18);border-radius:9px;padding:9px 12px;color:var(--txt);font-size:13px;font-family:var(--ff);outline:none;margin-bottom:8px;transition:all .2s}
.fsel{cursor:pointer}.finp:focus,.fsel:focus{border-color:rgba(20,100,220,.5);box-shadow:0 0 0 3px rgba(20,100,220,.07);background:#fff}
.fsel:disabled{opacity:.5;cursor:not-allowed}
.frow{display:flex;gap:9px}.fg{flex:1}
.sbtn{width:100%;background:linear-gradient(135deg,#0d3d99,#1e66dd);border:none;border-radius:11px;padding:13px;color:#fff;font-size:12px;font-weight:700;font-family:var(--ff);letter-spacing:2px;cursor:pointer;box-shadow:0 5px 18px rgba(10,60,200,.3);transition:all .2s}
.sbtn:hover:not(:disabled){transform:translateY(-2px)}.sbtn:disabled{opacity:.5;cursor:not-allowed}
.sbtn.demo{background:linear-gradient(135deg,#145522,#229944)}
.fbtns{display:flex;gap:9px;margin-top:3px}
.fmsg{font-size:10px;color:var(--sub);text-align:center;margin-top:7px;min-height:16px}
.fmsg.err{color:var(--red)}.fmsg.ok{color:var(--grn)}
/* DOWNLOAD BUTTON - mobile friendly */
.fdl-section{margin-top:12px;padding-top:12px;border-top:1px solid rgba(20,90,200,.08)}
.fdl-title{font-size:8px;color:var(--sub);letter-spacing:2px;text-align:center;margin-bottom:8px}
.fdl-btns{display:flex;gap:8px}
.fdlb{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;background:#fff;border:1.5px solid rgba(20,90,200,.18);border-radius:10px;padding:10px 8px;cursor:pointer;transition:all .2s;text-decoration:none}
.fdlb:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.1);border-color:var(--acc)}
.fdlb-ic{font-size:18px}
.fdlb-t{font-size:10px;font-weight:700;color:var(--acc);letter-spacing:1px}
.fdlb-s{font-size:8px;color:var(--sub)}
.fdlb.g{border-color:rgba(20,120,60,.2)}.fdlb.g .fdlb-t{color:var(--grn)}
.fdlb.share{border-color:rgba(160,80,0,.2)}.fdlb.share .fdlb-t{color:var(--gld)}
/* SIM */
#sscreen{display:none;height:100vh;flex-direction:column}
#topbar{height:44px;flex-shrink:0;background:var(--panel);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 10px;box-shadow:0 2px 10px rgba(0,0,0,.07);z-index:40;gap:6px}
.recdot{width:7px;height:7px;border-radius:50%;background:var(--red);animation:blink 1.1s infinite;flex-shrink:0}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.08}}
.phbadge{background:rgba(200,80,0,.08);border:1px solid rgba(200,80,0,.2);border-radius:12px;padding:2px 8px;font-size:9px;color:#aa4400;white-space:nowrap}
.tbmid{font-family:var(--ff2);font-size:10px;font-weight:700;color:var(--acc);text-align:center;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.tbr{display:flex;align-items:center;gap:6px;flex-shrink:0}
.tbstat{font-size:9px;white-space:nowrap}
.xbtn{background:#f2f5fb;border:1px solid rgba(20,70,160,.14);border-radius:6px;color:var(--sub);padding:3px 9px;cursor:pointer;font-size:9px;font-family:var(--ff);transition:all .2s;white-space:nowrap}
.xbtn:hover{color:var(--acc)}
.hambtn{display:none;background:#f2f5fb;border:1px solid var(--border);border-radius:6px;padding:4px 8px;cursor:pointer;font-size:14px;line-height:1}
#main{flex:1;display:flex;min-height:0;overflow:hidden;position:relative}
/* LEFT PANEL */
#lpanel{width:148px;flex-shrink:0;background:var(--bg);border-right:1px solid var(--border);padding:8px 7px;display:flex;flex-direction:column;gap:4px;overflow-y:auto;z-index:20;transition:transform .25s}
.pt{font-size:8px;color:rgba(20,80,180,.55);letter-spacing:2px;font-weight:700;padding-bottom:3px;border-bottom:1px solid rgba(20,70,160,.08);margin-bottom:2px}
.cb{display:block;width:100%;border-radius:7px;padding:6px 8px;cursor:pointer;font-size:10px;font-family:var(--ff);margin-bottom:2px;text-align:left;border:1px solid rgba(20,70,160,.09);background:#fff;color:var(--sub);transition:all .15s;box-shadow:0 1px 3px rgba(0,0,0,.04)}
.cb:hover{color:var(--acc);border-color:rgba(20,90,200,.25);background:#eef4ff}
.cb.on{border-color:var(--acc2);background:#ddeaff;color:var(--acc);font-weight:700}
.cb.on-g{border-color:#1a7a40;background:#ddf4e8;color:var(--grn);font-weight:700}
.cb.redbtn{border-color:rgba(200,40,0,.3);color:#aa2200}
.cb.redbtn.act{background:#fde8e2;border-color:var(--red);color:var(--red);animation:rp .8s infinite alternate}
@keyframes rp{from{opacity:1}to{opacity:.55}}
.dv{height:1px;background:rgba(20,70,160,.07);margin:2px 0}
/* MAP */
#mapc{flex:1;position:relative;min-width:0;overflow:hidden}
#map{position:absolute;inset:0;width:100%;height:100%}
.ov{position:absolute;z-index:15;background:rgba(255,255,255,.93);border:1px solid var(--border);border-radius:9px;backdrop-filter:blur(10px);box-shadow:0 2px 10px rgba(0,0,0,.09)}
#hud{top:10px;left:10px;padding:7px 11px;display:flex;gap:10px}
#phasind{top:10px;left:50%;transform:translateX(-50%);padding:4px 14px;color:#aa4400;font-size:10px;letter-spacing:2px;white-space:nowrap;border-color:rgba(200,80,0,.22)}
#wxov{top:10px;right:10px;padding:6px 9px;text-align:center;min-width:76px;border-color:rgba(160,120,0,.18)}
#compassov{bottom:80px;left:12px;padding:0;background:none;border:none;box-shadow:none;width:66px;height:66px}
#kurbox{bottom:12px;left:12px;padding:5px 10px;font-size:9px;border-color:rgba(20,120,60,.2);min-width:130px}
#mbar{bottom:12px;left:50%;transform:translateX(-50%);padding:5px 14px;color:var(--grn);font-size:10px;display:none;border-color:rgba(20,120,60,.25);white-space:nowrap}
#tkgmbadge{bottom:12px;right:12px;padding:4px 9px;font-size:8px;color:var(--grn);border-color:rgba(20,120,60,.18)}
#recbadge{top:50%;left:50%;transform:translate(-50%,-50%);padding:8px 20px;color:var(--red);font-size:12px;font-weight:700;letter-spacing:3px;border-color:rgba(200,40,0,.3);display:none;animation:rp .7s infinite alternate}
.hudi{text-align:center;min-width:46px}
.hudl{font-size:7px;color:var(--sub);letter-spacing:1px}
.hudv{font-size:13px;font-weight:700;color:var(--acc);font-family:var(--ff2);line-height:1.2}
/* POI PINS on map */
.poi-pin{position:absolute;pointer-events:none;display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);transition:opacity .4s,transform .4s}
.poi-pin.hidden{opacity:0;transform:translate(-50%,-90%)}
.poi-label{background:rgba(255,255,255,.96);border:1.5px solid rgba(20,70,160,.28);border-radius:16px;padding:4px 10px 4px 7px;display:flex;align-items:center;gap:5px;box-shadow:0 2px 10px rgba(0,0,0,.15);white-space:nowrap;font-family:var(--ff)}
.poi-label-ic{font-size:14px}
.poi-label-name{font-size:10px;font-weight:700;color:#1a3a80}
.poi-label-dist{font-size:8px;color:var(--sub)}
.poi-dot{width:6px;height:6px;border-radius:50%;background:var(--acc);margin-top:3px}
/* Ring labels */
.ring-label{background:rgba(255,255,255,.95);border-radius:7px;padding:4px 8px;font-size:10px;font-weight:700;font-family:var(--ff);box-shadow:0 2px 8px rgba(0,0,0,.12);cursor:pointer;transition:all .2s;white-space:nowrap}
.ring-label:hover{transform:scale(1.05)}
/* RIGHT PANEL */
#rpanel{width:226px;flex-shrink:0;background:var(--bg);border-left:1px solid var(--border);padding:10px;overflow-y:auto;transition:width .22s,padding .22s}
#rpanel.hidden{width:0;padding:0;overflow:hidden}
.rrow{display:flex;justify-content:space-between;font-size:10px;padding:3px 0;border-bottom:1px solid rgba(20,70,160,.05)}
.rk{color:#8a9aaa;flex-shrink:0}.rv{color:var(--txt);text-align:right;max-width:116px;word-break:break-word;font-weight:700}
.rv.big{color:var(--grn);font-size:14px;font-family:var(--ff2)}
.rv.real{color:var(--grn)}.rv.est{color:var(--gld)}
.poii{padding:4px 0;border-bottom:1px solid rgba(20,70,160,.05);font-size:10px;display:flex;align-items:center;gap:5px}
.poid{color:var(--grn);margin-left:auto;flex-shrink:0;font-weight:700;font-size:9px}.poiv{color:var(--txt);flex:1}
.lnk{display:flex;align-items:center;gap:5px;color:var(--acc);font-size:10px;text-decoration:none;padding:4px 0;border-bottom:1px solid rgba(20,70,160,.05)}
.lnk:hover{color:#0a3a90}
.roi-t{width:100%;border-collapse:collapse;margin-top:6px;font-size:10px}
.roi-t td{padding:4px 0;border-bottom:1px solid rgba(20,70,160,.05)}
.roi-k{color:#8a9aaa;width:55%}.roi-v{color:var(--txt);font-weight:700;text-align:right}
.roi-v.g{color:var(--grn)}.roi-v.b{color:var(--acc)}.roi-v.r{color:var(--red)}
.sbar{height:7px;background:#e8edf6;border-radius:4px;margin-top:5px;overflow:hidden}
.sfill{height:100%;border-radius:4px;transition:width 1s ease}
.verdict{border-radius:8px;padding:8px 10px;text-align:center;margin-top:8px;font-family:var(--ff2)}
.verdict.buy{background:linear-gradient(135deg,#ddf4e8,#e8faf0);border:1.5px solid rgba(20,120,60,.3)}
.verdict.hold{background:linear-gradient(135deg,#fff8e0,#fffbe8);border:1.5px solid rgba(160,120,0,.3)}
.verdict.pass{background:linear-gradient(135deg,#fdeae8,#fef0ee);border:1.5px solid rgba(200,40,0,.2)}
/* HELP PANEL */
#help-panel{display:none;position:absolute;inset:0;z-index:50;background:rgba(10,20,60,.7);align-items:center;justify-content:center}
#help-panel.show{display:flex}
.help-box{background:var(--panel);border-radius:16px;padding:22px;max-width:480px;width:92%;max-height:85vh;overflow-y:auto;box-shadow:0 10px 50px rgba(0,0,0,.3)}
.help-title{font-family:var(--ff2);font-weight:800;font-size:16px;color:var(--acc);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.help-sec{margin-bottom:14px}
.help-sec-t{font-size:9px;color:var(--acc);letter-spacing:2px;font-weight:700;padding-bottom:5px;border-bottom:1px solid var(--border);margin-bottom:8px}
.help-item{display:flex;gap:8px;margin-bottom:6px;font-size:11px;color:var(--txt);align-items:flex-start}
.help-item-ic{font-size:14px;flex-shrink:0;margin-top:1px}
.help-close{background:var(--acc);color:#fff;border:none;border-radius:8px;padding:9px 20px;font-family:var(--ff);font-size:11px;cursor:pointer;margin-top:10px;width:100%}
/* BOTTOM BAR */
#bbar{height:42px;flex-shrink:0;background:var(--panel);border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-around;padding:0 6px;z-index:20;box-shadow:0 -2px 8px rgba(0,0,0,.05);overflow-x:auto}
.bi{text-align:center;min-width:56px;flex-shrink:0}
.bl{font-size:7px;color:var(--sub);letter-spacing:1px}
.bv{font-size:11px;font-weight:700;color:var(--acc);font-family:var(--ff2)}
/* DOWNLOAD SHEET (mobile) */
#dl-sheet{display:none;position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.5);align-items:flex-end;justify-content:center}
#dl-sheet.show{display:flex}
.dl-box{background:var(--panel);border-radius:20px 20px 0 0;padding:20px;width:100%;max-width:500px}
.dl-box-title{font-family:var(--ff2);font-weight:800;font-size:14px;color:var(--txt);margin-bottom:14px;display:flex;align-items:center;justify-content:space-between}
.dl-option{display:flex;align-items:center;gap:12px;padding:12px;border:1.5px solid var(--border);border-radius:12px;margin-bottom:9px;cursor:pointer;transition:all .2s}
.dl-option:hover{border-color:var(--acc);background:#f0f5ff}
.dl-option-ic{font-size:26px;width:36px;text-align:center}
.dl-option-t{font-weight:700;font-size:13px;color:var(--txt)}
.dl-option-s{font-size:11px;color:var(--sub);margin-top:2px}
.dl-cancel{width:100%;padding:12px;background:#f0f2f8;border:none;border-radius:10px;font-family:var(--ff2);font-size:13px;font-weight:700;color:var(--sub);cursor:pointer;margin-top:4px}
/* MISC */
.maplibregl-popup-content{background:var(--panel)!important;border:1px solid var(--border)!important;color:var(--txt)!important;font-family:var(--ff)!important;padding:7px 10px!important;border-radius:8px!important;font-size:10px!important;box-shadow:0 4px 16px rgba(0,0,0,.12)!important}
.maplibregl-popup-tip{display:none!important}
input[type=range]{width:100%;accent-color:var(--acc);cursor:pointer}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(20,70,160,.18);border-radius:4px}
#lpov{display:none;position:absolute;inset:0;z-index:19;background:rgba(0,0,0,.15)}
#lpov.show{display:block}
@media(max-width:768px){.hambtn{display:block}#lpanel{position:absolute;top:0;left:0;height:100%;width:158px;transform:translateX(-100%);box-shadow:4px 0 20px rgba(0,0,0,.12)}#lpanel.open{transform:translateX(0)}#rpanel{display:none}.tbmid{font-size:9px}.tbstat{display:none}.hudv{font-size:11px}#phasind{display:none}#tkgmbadge{display:none}#bbar .bi:nth-child(n+5){display:none}}
@media(max-width:480px){.fbox{padding:20px 14px}#hud{top:6px;left:6px;padding:4px 7px}#wxov{top:6px;right:6px}#kurbox{display:none}}
</style>
</head>
<body>

<div id="fscreen">
<div class="fbox">
  <div class="fbrand">
    <span class="fbrand-ic">🛰</span>
    <div class="fbrand-t">DRONE PARSEL SIM</div>
    <div class="fbrand-s">v4.0 · TKGM ENTEGRE</div>
    <div class="fbrand-q">► TURYAP QUEEN · ANTALYA</div>
  </div>
  <div class="fhr"></div>
  <label class="flbl">IL</label>
  <select class="fsel" id="f-il"><option value="">Yukleniyor...</option></select>
  <label class="flbl">ILCE</label>
  <select class="fsel" id="f-ilce" disabled><option value="">Once il secin</option></select>
  <label class="flbl">MAHALLE</label>
  <select class="fsel" id="f-mah" disabled><option value="">Once ilce secin</option></select>
  <div class="frow">
    <div class="fg"><label class="flbl">ADA NO</label><input class="finp" id="f-ada" placeholder="826" inputmode="numeric"></div>
    <div class="fg"><label class="flbl">PARSEL NO</label><input class="finp" id="f-parsel" placeholder="4" inputmode="numeric"></div>
  </div>
  <div class="fbtns">
    <button class="sbtn" id="btn-start" disabled style="flex:2">🚀 DRONE BASLAT</button>
    <button class="sbtn demo" id="btn-demo" style="flex:1">🞼 DEMO</button>
  </div>
  <div class="fmsg" id="f-msg">TKGM verileri yukleniyor...</div>
  <div class="fdl-section">
    <div class="fdl-title">INDIR / PAYLAS</div>
    <div class="fdl-btns">
      <button class="fdlb" id="btn-dl">
        <span class="fdlb-ic">💾</span>
        <div><div class="fdlb-t">INDIR</div><div class="fdlb-s">HTML • Offline</div></div>
      </button>
      <button class="fdlb share" id="btn-share">
        <span class="fdlb-ic">🔗</span>
        <div><div class="fdlb-t">PAYLAS</div><div class="fdlb-s">Mobil • Link</div></div>
      </button>
      <button class="fdlb g" id="pwa-btn">
        <span class="fdlb-ic">📲</span>
        <div><div class="fdlb-t">EKRANA EKLE</div><div class="fdlb-s">PWA</div></div>
      </button>
    </div>
  </div>
</div>
</div>

<div id="dl-sheet">
<div class="dl-box">
  <div class="dl-box-title">
    <span>💾 Dosyayi Indir / Paylas</span>
    <button onclick="closeDlSheet()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--sub)">✕</button>
  </div>
  <div class="dl-option" onclick="doDirectDownload()">
    <div class="dl-option-ic">💾</div>
    <div><div class="dl-option-t">Direkt Indir</div><div class="dl-option-s">HTML dosyasi olarak kaydet</div></div>
  </div>
  <div class="dl-option" onclick="doShareAPI()">
    <div class="dl-option-ic">🔗</div>
    <div><div class="dl-option-t">Paylasim Menusunu Ac</div><div class="dl-option-s">iPhone / Android paylas butonu</div></div>
  </div>
  <div class="dl-option" onclick="doCopyLink()">
    <div class="dl-option-ic">📋</div>
    <div><div class="dl-option-t">GitHub Linkini Kopyala</div><div class="dl-option-s">zamby5.github.io/Sanaldrone</div></div>
  </div>
  <button class="dl-cancel" onclick="closeDlSheet()">Vazgec</button>
</div>
</div>

<div id="sscreen">
<div id="topbar">
  <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
    <button class="hambtn" id="btn-ham">☰</button>
    <div class="recdot"></div>
    <span class="phbadge" id="ph-badge">YAKLASIM</span>
  </div>
  <div class="tbmid" id="tb-title">ADA / PARSEL</div>
  <div class="tbr">
    <button class="xbtn" id="btn-theme" onclick="toggleTheme()">🌙 GECE</button>
    
    <span class="tbstat" style="color:#1a7a40" id="tb-bat">92%</span>
    <span class="tbstat" style="color:#9a6800">GPS</span>
    <span class="tbstat" id="tb-crd" style="color:var(--acc);font-size:8px"></span>
    <button class="xbtn" id="btn-exit">← CIKIS</button>
  </div>
</div>

<div id="main">
<div id="lpov"></div>

<div id="lpanel">
  <div><div class="pt">UCUS MODU</div>
    <button class="cb on" id="btn-cin">🎬 SINEMATIK</button>
    <button class="cb" id="btn-fast">⚡ HIZLI</button>
    <button class="cb" id="btn-stp">⏸ DURDUR</button>
  </div>
  <div class="dv"></div>
  <div><div class="pt">HARITA</div>
    <button class="cb on" id="btn-sat">🛰 UYDU</button>
    <button class="cb" id="btn-osm">🗺 OSM</button>
  </div>
  <div class="dv"></div>
  <div><div class="pt">KATMANLAR</div>
    <button class="cb on-g" id="btn-tkgm">📐 PARSEL SINIRI</button>
    <button class="cb on" id="btn-rings">◯ MESAFE HALKALARI</button>
    <button class="cb on" id="btn-poi-pins">📍 YAKIN CEVRE PINLERI</button>
  </div>
  <div class="dv"></div>
  <div><div class="pt">MEDYA</div>
    <button class="cb" id="btn-ss">📷 EKRAN CIKTISI</button>
    <button class="cb redbtn" id="btn-rec">🎥 VIDEO KAYDET</button>
  </div>
  <div class="dv"></div>
  <div><div class="pt">ANALIZ</div>
    <button class="cb" id="btn-meas">📏 OLCUM ARACI</button>
    <button class="cb" id="btn-poi">📍 POI GUNCELLE</button>
    <button class="cb" id="btn-fin">📊 FINANSAL ANALIZ</button>
    <button class="cb" id="btn-panel">📋 PANEL</button>
  </div>
  <div class="dv"></div>
  <div><div class="pt">BAGLANTILAR</div>
    <button class="cb" id="btn-sv">📷 STREET VIEW</button>
    <button class="cb" id="btn-ge">🌎 GOOGLE EARTH</button>
    <button class="cb" id="btn-tkgml">🏛 TKGM SORGU</button>
  </div>
  <div class="dv"></div>
  <div><div class="pt">YARDIM</div>
    <button class="cb" id="btn-help">❓ KULLANIM KILAVUZU</button>
    <button class="cb" id="btn-dlsim">💾 INDIRME MENUSUNU AC</button>
  </div>
  <div class="dv"></div>
  <div><div class="pt">YUKSEKLIK</div>
    <div style="color:var(--acc);font-size:16px;font-weight:700;text-align:center;font-family:var(--ff2)" id="alt-d">120 m</div>
    <input type="range" id="alt-sl" min="20" max="500" value="120">
    <div style="display:flex;justify-content:space-between;color:var(--sub);font-size:8px"><span>20m</span><span>500m</span></div>
  </div>
  <div class="dv"></div>
  <div><div class="pt">EGIM</div>
    <div style="color:var(--gld);font-size:14px;font-weight:700;text-align:center;font-family:var(--ff2)" id="pitch-d">35</div>
    <input type="range" id="pitch-sl" min="0" max="60" value="35" style="accent-color:var(--gld)">
    <div style="display:flex;justify-content:space-between;color:var(--sub);font-size:8px"><span>Duz</span><span>60</span></div>
  </div>
</div>

<div id="mapc">
  <div id="map"></div>
  <div class="ov" id="hud">
    <div class="hudi"><div class="hudl">YUKSEKLIK</div><div class="hudv" id="h-alt">-- m</div></div>
    <div class="hudi"><div class="hudl">HIZ</div><div class="hudv" id="h-spd" style="color:var(--grn)">--</div></div>
    <div class="hudi"><div class="hudl">YON</div><div class="hudv" id="h-hdg" style="color:var(--gld)">--</div></div>
    <div class="hudi"><div class="hudl">ZOOM</div><div class="hudv" id="h-zoom">--</div></div>
  </div>
  <div class="ov" id="phasind">YAKLASIM</div>
  <div class="ov" id="wxov">
    <div style="font-size:20px" id="wx-ic">?</div>
    <div style="font-size:12px;font-weight:700;color:var(--gld);font-family:var(--ff2)" id="wx-t">--</div>
    <div style="font-size:8px;color:var(--sub);margin-top:1px" id="wx-w">...</div>
  </div>
  <canvas class="ov" id="compassov" width="66" height="66"></canvas>
  <div class="ov" id="kurbox">
    <div style="font-size:7px;color:var(--sub);letter-spacing:1px;margin-bottom:3px">CANLI KUR</div>
    <div id="kur-usd" style="font-size:10px;font-weight:700;color:var(--acc)">USD: --</div>
    <div id="kur-eur" style="font-size:10px;font-weight:700;color:var(--grn)">EUR: --</div>
  </div>
  <div class="ov" id="mbar">📏 <span id="m-st">Ilk noktayi secin</span> <span id="m-res" style="color:var(--txt);font-weight:700"></span></div>
  <div class="ov" id="tkgmbadge">📐 TKGM Kadastral</div>
  <div class="ov" id="recbadge">⏺ KAYIT <span id="rec-t">00:00</span></div>
  <svg style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:8;opacity:.35" width="28" height="28" viewBox="0 0 28 28">
    <line x1="14" y1="0" x2="14" y2="9" stroke="#222" stroke-width="1.2"/>
    <line x1="14" y1="19" x2="14" y2="28" stroke="#222" stroke-width="1.2"/>
    <line x1="0" y1="14" x2="9" y2="14" stroke="#222" stroke-width="1.2"/>
    <line x1="19" y1="14" x2="28" y2="14" stroke="#222" stroke-width="1.2"/>
    <circle cx="14" cy="14" r="4" stroke="#222" fill="none" stroke-width="1"/>
    <circle cx="14" cy="14" r="1.2" fill="#c82800"/>
  </svg>
</div>

<div id="rpanel">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
    <div style="font-size:9px;color:var(--acc);letter-spacing:3px;font-weight:700">PARSEL ANALIZI</div>
    <button id="btn-rclose" style="background:none;border:none;color:var(--sub);cursor:pointer;font-size:14px">X</button>
  </div>
  <div id="rp-imar"></div>
  <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border)">
    <div class="pt">FINANSAL ANALIZ</div>
    <div id="rp-fin" style="color:var(--sub);font-size:10px">Sol panelden Finansal Analiz butonuna basin.</div>
  </div>
  <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border)">
    <div class="pt">YAKIN CEVRE (600m)</div>
    <div id="rp-poi" style="color:var(--sub);font-size:10px">Yukleniyor...</div>
  </div>
  <div style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border)">
    <div class="pt">DIŞ BAGLANTILAR</div>
    <a class="lnk" id="lnk-sv" href="#" target="_blank"><span>📷</span> Street View</a>
    <a class="lnk" id="lnk-ge" href="#" target="_blank"><span>🌎</span> Google Earth</a>
    <a class="lnk" id="lnk-tkgm" href="#" target="_blank"><span>🏛</span> TKGM Parselsorgu</a>
    <a class="lnk" id="lnk-osm" href="#" target="_blank"><span>🗺</span> OpenStreetMap</a>
    <a class="lnk" id="lnk-gm" href="#" target="_blank"><span>📌</span> Google Haritalar</a>
  </div>
</div>
</div><div id="bbar">
  <div class="bi"><div class="bl">YUKSEKLIK</div><div class="bv" id="b-alt">--</div></div>
  <div class="bi"><div class="bl">EGIM</div><div class="bv" id="b-pit" style="color:var(--gld)">--</div></div>
  <div class="bi"><div class="bl">YON</div><div class="bv" id="b-bear" style="color:var(--grn)">--</div></div>
  <div class="bi"><div class="bl">ALAN</div><div class="bv" id="b-area">--</div></div>
  <div class="bi"><div class="bl">KOORDINAT</div><div class="bv" id="b-crd" style="font-size:9px">--</div></div>
  <div class="bi"><div class="bl">ZOOM</div><div class="bv" id="b-zoom">--</div></div>
  
  <div style="display:flex; align-items:center; border-left:1px solid var(--border); padding-left:8px; margin-left:auto; margin-right:5px;">
    <button class="mode-toggle-btn act" id="bb-fast" onclick="setAppMode('fast')">⚡ FAST</button>
    <button class="mode-toggle-btn pro" id="bb-pro" onclick="setAppMode('pro')">🚀 PRO</button>
  </div>
</div>
</div><div id="help-panel">
<div class="help-box">
  <div class="help-title">❓ KULLANIM KILAVUZU</div>
  <div class="help-sec">
    <div class="help-sec-t">BASLANGIC</div>
    <div class="help-item"><span class="help-item-ic">1️⃣</span><div><b>Il / Ilce / Mahalle</b> secin — TKGM'den gercek liste gelir</div></div>
    <div class="help-item"><span class="help-item-ic">2️⃣</span><div><b>Ada ve Parsel numarasini</b> girin</div></div>
    <div class="help-item"><span class="help-item-ic">3️⃣</span><div><b>DRONE BASLAT</b> — TKGM'den gercek koordinat, m2 ve parsel poligonu gelir</div></div>
  </div>
  <div class="help-sec">
    <div class="help-sec-t">UCUS KONTROLLERI</div>
    <div class="help-item"><span class="help-item-ic">🎬</span><div><b>Sinematik:</b> Yavas, profesyonel cekimler</div></div>
    <div class="help-item"><span class="help-item-ic">⚡</span><div><b>Hizli Kesif:</b> Tum fazlari hizla gec</div></div>
    <div class="help-item"><span class="help-item-ic">⏸</span><div><b>Durdur:</b> Drone beklemede, haritayi serbest gez</div></div>
  </div>
  <div class="help-sec">
    <div class="help-sec-t">KATMANLAR</div>
    <div class="help-item"><span class="help-item-ic">📐</span><div><b>Parsel Siniri:</b> TKGM WMS — gercek kadastral sinirlar</div></div>
    <div class="help-item"><span class="help-item-ic">◯</span><div><b>Mesafe Halkalari:</b> 50/100/200/500m — tikla/gizle</div></div>
    <div class="help-item"><span class="help-item-ic">📍</span><div><b>POI Pinleri:</b> Yakin yerler kamera acisina gore gosterilir</div></div>
  </div>
  <div class="help-sec">
    <div class="help-sec-t">MEDYA</div>
    <div class="help-item"><span class="help-item-ic">📷</span><div><b>Ekran Ciktisi:</b> Turyap Queen damgali PNG indirir</div></div>
    <div class="help-item"><span class="help-item-ic">🎥</span><div><b>Video Kayit:</b> HUD + bilgiler dahil 60sn WebM/MP4</div></div>
  </div>
  <div class="help-sec">
    <div class="help-sec-t">INDIR / PAYLAS</div>
    <div class="help-item"><span class="help-item-ic">💾</span><div><b>HTML Indir:</b> Tek dosya, offline calisir, tum ozellikler</div></div>
    <div class="help-item"><span class="help-item-ic">🔗</span><div><b>Paylas:</b> Mobil paylas menusunu acar (iOS/Android)</div></div>
    <div class="help-item"><span class="help-item-ic">📲</span><div><b>Ekrana Ekle:</b> Ana ekranda uygulama gibi calisir</div></div>
  </div>
  <div class="help-sec">
    <div class="help-sec-t">IPUCLARI</div>
    <div class="help-item"><span class="help-item-ic">💡</span><div>Halka etiketlerine tikla — acilip kapanir</div></div>
    <div class="help-item"><span class="help-item-ic">💡</span><div>Finansal Analiz ilk acildiginda POI sorgusu da yapar</div></div>
    <div class="help-item"><span class="help-item-ic">💡</span><div>Sol alt kosede USD/EUR kuru canli gosterilir</div></div>
    <div class="help-item"><span class="help-item-ic">💡</span><div>Google Earth linki parceli 3D gosterir</div></div>
  </div>
  <button class="help-close" onclick="document.getElementById('help-panel').classList.remove('show')">KAPAT</button>
</div>
</div>

<script>
'use strict';
// ═══════════════════════════════
// CONFIG
// ═══════════════════════════════
var WORKER = 'https://tkgm-proxy.miyicioglu.workers.dev';
var GITHUB_URL = 'https://zamby5.github.io/Sanaldrone/';
var TKGM_WMS = 'https://cbsapi.tkgm.gov.tr/megsisapi/ows?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=parsel&CRS=EPSG:3857&STYLES=&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}';
var LYRS = {
  sat:{t:['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],a:'ESRI'},
  osm:{t:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],a:'OSM'},
  osm_dark:{t:['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],a:'Carto Dark'} // EKLENEN: Gece Modu Vektoru
};
var PHASES = [
  {n:'YAKLASIM',zoom:14,pitch:0,dur:9000},{n:'360 ORBIT',zoom:17.5,pitch:38,dur:15000},
  {n:'ALCAK GECIS',zoom:18.5,pitch:32,dur:9000},{n:'HOVER',zoom:16.5,pitch:28,dur:7000}
];

// ═══════════════════════════════
// STATE
// ═══════════════════════════════
var isDark = false; // EKLENEN: Gece/Gunduz Durumu
var G = {
  map:null,center:null,fd:{},pDims:null,tkgmGeom:null,lastPOIs:[],
  droneT:null,orbitRAF:null,orbitOn:false,phase:0,bearing:0,altitude:120,pitchVal:35,
  mode:'cinematic',lyrKey:'sat',measOn:false,measPts:[],measMks:[],measLineOn:false,
  tkgmOn:true,ringsOn:true,poiPinsOn:true,panelOn:true,
  ringMks:[],ringLabelVis:{},poiMks:[],smartPins:[],
  hudIv:null,smartPinT:null,kurT:null,
  recorder:null,recChunks:[],recT:null,recSec:0,isRec:false,
  appMode:'fast' // EKLENEN: Fast/Pro Takibi
};

// ═══════════════════════════════
// UTILS
// ═══════════════════════════════
function gel(id){return document.getElementById(id);}
function mLat(m){return m/111320;}
function mLng(m,lat){return m/(111320*Math.cos(lat*Math.PI/180));}
function hvs(a,b,c,d){var R=6371000,dL=(d-b)*Math.PI/180,dl=(c-a)*Math.PI/180,x=Math.sin(dL/2)*Math.sin(dL/2)+Math.cos(b*Math.PI/180)*Math.cos(d*Math.PI/180)*Math.sin(dl/2)*Math.sin(dl/2);return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
function cirGJ(cx,cy,r){var p=[];for(var i=0;i<=72;i++){var a=i/72*2*Math.PI;p.push([cx+mLng(r*Math.cos(a),cy),cy+mLat(r*Math.sin(a))]);}return{type:'Feature',geometry:{type:'Polygon',coordinates:[p]},properties:{}};}
function sd(n){return((n*1337+42)%1000)/1000;}
function normTR(s){return s.toLowerCase().replace(/\u011f/g,'g').replace(/\u00fc/g,'u').replace(/\u015f/g,'s').replace(/\u0131/g,'i').replace(/\u00f6/g,'o').replace(/\u00e7/g,'c').trim();}
function setMsg(t,c){var e=gel('f-msg');e.innerHTML=t;e.className='fmsg'+(c?' '+c:'');}
function polyCenter(coords){var lngS=0,latS=0;coords.forEach(function(c){lngS+=c[0];latS+=c[1];});return{lng:lngS/coords.length,lat:latS/coords.length};}

// EKLENEN: Fast / Pro Mod Gecisi Fonsiyonu
function setAppMode(m) {
  G.appMode = m;
  if(gel('bb-fast')) gel('bb-fast').className = 'mode-toggle-btn' + (m === 'fast' ? ' act' : '');
  if(gel('bb-pro')) gel('bb-pro').className = 'mode-toggle-btn pro' + (m === 'pro' ? ' act' : '');
  if (m === 'fast') {
    gel('rpanel').classList.add('hidden');
    G.panelOn = false;
  } else {
    gel('rpanel').classList.remove('hidden');
    G.panelOn = true;
    runAnalysis(); // Pro moda gecildiginde otomatik degerlemeyi baslatir
  }
}

// EKLENEN: Gece / Gunduz Tema Tetikleyici
function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('dark-mode', isDark);
  var btn = gel('btn-theme');
  if(btn) btn.textContent = isDark ? '☀️ GUNDUZ' : '🌙 GECE';
  setLyr(G.lyrKey); // Haritayi guncelle
}

// ═══════════════════════════════
// WORKER FETCH
// ═══════════════════════════════
function wFetch(path){
  return fetch(WORKER+'/'+path)
    .then(function(r){if(r.ok)return r.json();throw new Error('HTTP '+r.status);})
    .catch(function(e){console.warn('Worker:',e.message);return null;});
}

// ═══════════════════════════════
// FORM DROPDOWN CHAIN
// ═══════════════════════════════
function initForm(){
  setMsg('TKGM il listesi yukleniyor...');
  wFetch('il').then(function(data){
    if(!data||!data.features){setMsg('Worker baglanti hatasi. Demo kullanilabilir.','err');return;}
    var sel=gel('f-il');sel.innerHTML='<option value="">Il secin...</option>';
    data.features.forEach(function(f){var o=document.createElement('option');o.value=f.properties.id;o.text=f.properties.text;sel.appendChild(o);});
    setMsg('Il secin','ok');
  });
}
gel('f-il').addEventListener('change',function(){
  var id=this.value;
  gel('f-ilce').innerHTML='<option value="">Yukleniyor...</option>';gel('f-ilce').disabled=true;
  gel('f-mah').innerHTML='<option value="">Once ilce secin</option>';gel('f-mah').disabled=true;
  gel('btn-start').disabled=true;
  if(!id)return;setMsg('Ilceler yukleniyor...');
  wFetch('ilce/'+id).then(function(data){
    if(!data||!data.features){setMsg('Ilce listesi alinamadi.','err');return;}
    var sel=gel('f-ilce');sel.innerHTML='<option value="">Ilce secin...</option>';
    data.features.forEach(function(f){var o=document.createElement('option');o.value=f.properties.id;o.text=f.properties.text;sel.appendChild(o);});
    sel.disabled=false;setMsg('Ilce secin');
  });
});
gel('f-ilce').addEventListener('change',function(){
  var id=this.value;
  gel('f-mah').innerHTML='<option value="">Yukleniyor...</option>';gel('f-mah').disabled=true;gel('btn-start').disabled=true;
  if(!id)return;setMsg('Mahalleler yukleniyor...');
  wFetch('mahalle/'+id).then(function(data){
    if(!data||!data.features){setMsg('Mahalle listesi alinamadi.','err');return;}
    var sel=gel('f-mah');sel.innerHTML='<option value="">Mahalle secin...</option>';
    data.features.forEach(function(f){var o=document.createElement('option');o.value=f.properties.id;o.text=f.properties.text;sel.appendChild(o);});
    sel.disabled=false;setMsg('Mahalle secin');
  });
});
gel('f-mah').addEventListener('change',function(){gel('btn-start').disabled=!this.value;if(this.value)setMsg('Ada ve parsel girin, Drone Baslat.','ok');});

// ═══════════════════════════════
// DOWNLOAD / SHARE (MOBILE)
// ═══════════════════════════════
function openDlSheet(){gel('dl-sheet').classList.add('show');}
function closeDlSheet(){gel('dl-sheet').classList.remove('show');}
function doDirectDownload(){
  closeDlSheet();
  var b=new Blob([document.documentElement.outerHTML],{type:'text/html;charset=utf-8'});
  var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='drone-parsel-v4.html';a.click();URL.revokeObjectURL(a.href);
}
function doShareAPI(){
  closeDlSheet();
  if(navigator.share){
    navigator.share({title:'Drone Parsel Sim v4 - Turyap Queen',url:GITHUB_URL})
      .catch(function(){});
  } else {
    doCopyLink();
  }
}
function doCopyLink(){
  closeDlSheet();
  if(navigator.clipboard){
    navigator.clipboard.writeText(GITHUB_URL).then(function(){alert('Link kopyalandi: '+GITHUB_URL);});
  } else {
    var ta=document.createElement('textarea');ta.value=GITHUB_URL;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
    alert('Link kopyalandi!');
  }
}
function dlHTML(){openDlSheet();}

// PWA
(function(){var el=gel('pwa-manifest');if(el)el.href=URL.createObjectURL(new Blob([JSON.stringify({name:'Drone Parsel Sim v4',short_name:'Parsel v4',start_url:'./',display:'standalone',orientation:'landscape',background_color:'#f4f7fc',theme_color:'#1a4fa0'})],{type:'application/json'}));})();
var _dp=null;window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();_dp=e;});
function doPWA(){if(_dp){_dp.prompt();_dp.userChoice.then(function(){_dp=null;});}else{alert('iPhone: Safari > Paylas > Ana Ekrana Ekle\nAndroid: Chrome > Ana ekrana ekle');}}

// ═══════════════════════════════
// CURRENCY (Frankfurter API)
// ═══════════════════════════════
function fetchKur(){
  fetch('https://api.frankfurter.app/latest?from=TRY&to=USD,EUR')
    .then(function(r){return r.json();})
    .then(function(d){
      if(!d.rates)return;
      var usd=(1/d.rates.USD).toFixed(2),eur=(1/d.rates.EUR).toFixed(2);
      gel('kur-usd').textContent='1$ = '+usd+' TL';
      gel('kur-eur').textContent='1€ = '+eur+' TL';
    }).catch(function(){
      fetch('https://api.frankfurter.app/latest?from=USD&to=TRY')
        .then(function(r){return r.json();})
        .then(function(d){if(d.rates&&d.rates.TRY){gel('kur-usd').textContent='1$ = '+d.rates.TRY.toFixed(2)+' TL';}})
        .catch(function(){});
    });
}
function startKur(){fetchKur();G.kurT=setInterval(fetchKur,300000);}

// ═══════════════════════════════
// START / LAUNCH
// ═══════════════════════════════
function startSim(demo){
  if(demo){
    G.fd={il:'Antalya',ilce:'Konyaalti',mah:'Arapsuyu',mahId:null,ada:'826',parsel:'4'};
    launchSim(36.8750,30.6550,null,null);return;
  }
  var mahId=gel('f-mah').value,ada=gel('f-ada').value.trim(),parsel=gel('f-parsel').value.trim();
  if(!mahId){setMsg('Mahalle secin!','err');return;}
  if(!ada||!parsel){setMsg('Ada ve parsel numarasi girin!','err');return;}
  var is=gel('f-il'),ics=gel('f-ilce'),ms=gel('f-mah');
  G.fd={il:is.options[is.selectedIndex].text,ilce:ics.options[ics.selectedIndex].text,mah:ms.options[ms.selectedIndex].text,mahId:mahId,ada:ada,parsel:parsel};
  gel('btn-start').disabled=true;setMsg('TKGM parsel sorgulaniyor...');
  wFetch('parsel/'+mahId+'/'+ada+'/'+parsel).then(function(data){
    if(!data||!data.geometry){setMsg('Parsel bulunamadi. Ada/parsel numarasini kontrol edin.','err');gel('btn-start').disabled=false;return;}
    var ctr=polyCenter(data.geometry.coordinates[0]);
    launchSim(ctr.lat,ctr.lng,data.geometry.coordinates[0],data.properties);
  }).catch(function(){setMsg('TKGM baglanti hatasi.','err');gel('btn-start').disabled=false;});
}

function launchSim(lat,lng,coords,props){
  G.center=[lng,lat];G.tkgmGeom=coords;
  if(coords&&coords.length>2){
    var lngs=coords.map(function(c){return c[0];}),lats=coords.map(function(c){return c[1];});
    var w=Math.max(5,Math.round(hvs(Math.min.apply(null,lngs),lat,Math.max.apply(null,lngs),lat)));
    var d=Math.max(5,Math.round(hvs(lng,Math.min.apply(null,lats),lng,Math.max.apply(null,lats))));
    G.pDims={w:w,d:d};
  } else {
    var adaN=parseInt(G.fd.ada)||100,pN=parseInt(G.fd.parsel)||5;
    G.pDims={w:22+Math.round(sd(adaN*7)*40),d:16+Math.round(sd(pN*13)*36)};
  }
  var area=0;
  if(props){
    var candidates=['alan','ALAN','parselAlani','yuzolcum','YUZOLCUM','area','m2','Alan'];
    for(var ci=0;ci<candidates.length;ci++){
      if(props[candidates[ci]]!=null&&Number(props[candidates[ci]])>0){area=Number(props[candidates[ci]]);break;}
    }
  }
  if(!area)area=G.pDims.w*G.pDims.d;
  var nitelik=(props&&(props.nitelik||props.nitelikAdi||props.NITELIK))||null;
  var mevkii=(props&&(props.mevkii||props.mevkiiAdi||props.MEVKII))||null;
  var isReal=!!(props&&area>0&&props.alan!=null);

  gel('fscreen').style.display='none';gel('sscreen').style.display='flex';
  gel('tb-title').textContent=G.fd.ada+' ADA / '+G.fd.parsel+' PARSEL -- '+G.fd.mah+', '+G.fd.ilce;
  gel('b-area').textContent=area.toLocaleString('tr-TR')+' m2';
  gel('b-crd').textContent=lat.toFixed(4)+'K '+lng.toFixed(4)+'D';
  gel('tb-crd').textContent=lat.toFixed(5)+'K '+lng.toFixed(5)+'D';
  gel('lnk-sv').href='https://www.google.com/maps/@?api=1&map_action=pano&viewpoint='+lat+','+lng;
  gel('lnk-ge').href='https://earth.google.com/web/@'+lat+','+lng+',0a,200d,35y,0h,45t,0r';
  gel('lnk-tkgm').href='https://parselsorgu.tkgm.gov.tr/#'+lat.toFixed(6)+'/'+lng.toFixed(6)+'/18';
  gel('lnk-osm').href='https://www.openstreetmap.org/?mlat='+lat+'&mlon='+lng+'&zoom=18';
  gel('lnk-gm').href='https://maps.google.com/?q='+lat+','+lng+'&z=18';

  renderImar(lat,lng,area,nitelik,mevkii,isReal);
  
  setAppMode('fast'); // EKLENEN: Baslangicta Fast Mod'da acilir, sadelik saglar.
  
  initMap(lat,lng,coords);
  fetchWeather(lat,lng);
  startKur();
  setTimeout(loadPOI,2500);
}

function exitSim(){
  stopDrone();stopRec();
  if(G.hudIv){clearInterval(G.hudIv);G.hudIv=null;}
  if(G.smartPinT){clearTimeout(G.smartPinT);G.smartPinT=null;}
  if(G.kurT){clearInterval(G.kurT);G.kurT=null;}
  if(G.map){G.map.remove();G.map=null;}
  G.ringMks.forEach(function(m){m.remove();});G.ringMks=[];
  G.poiMks.forEach(function(m){try{m.remove();}catch(e){}});G.poiMks=[];
  G.measMks.forEach(function(m){m.remove();});G.measMks=[];
  G.lastPOIs=[];G.measPts=[];G.measLineOn=false;G.measOn=false;G.tkgmGeom=null;G.ringLabelVis={};
  gel('sscreen').style.display='none';gel('fscreen').style.display='flex';
  gel('btn-start').disabled=false;
  gel('rp-poi').textContent='Yukleniyor...';gel('rp-fin').textContent='Sol panelden Finansal Analiz butonuna basin.';
  setMsg('Ada ve parsel girin, Drone Baslat.','ok');
}

// ═══════════════════════════════
// IMAR PANEL
// ═══════════════════════════════
function renderImar(lat,lng,area,nitelik,mevkii,isReal){
  var adaN=parseInt(G.fd.ada)||100,pN=parseInt(G.fd.parsel)||5,s=sd(adaN+pN);
  var taks=(0.28+s*0.24).toFixed(2),kaks=(1.40+s*1.10).toFixed(2),kat=Math.max(2,Math.round(parseFloat(kaks)/0.32));
  var birim=8500+Math.round(s*18000),deger=Math.round(area*birim*parseFloat(kaks));
  var bolgeler=['Konut (A-2)','Konut (B-1)','MIA','Ticari','IBT','Turizm'];
  var kaynakRenk=isReal?'var(--grn)':'var(--gld)';
  var rows=[
    ['IL/ILCE',G.fd.il+'/'+G.fd.ilce],['MAHALLE',G.fd.mah],['ADA/PARSEL',G.fd.ada+'/'+G.fd.parsel],
    ['KOORDINAT',lat.toFixed(5)],
    ['PARSEL ALANI',area.toLocaleString('tr-TR')+' m2'+(isReal?' (TKGM)':' (tahmini)')],
    ['NITELIK',nitelik||bolgeler[Math.floor(s*bolgeler.length)]],
    ['MEVKII',mevkii||(G.fd.mah+', '+G.fd.ilce)],
    ['CEPHE',G.pDims.w+' m'],['DERINLIK',G.pDims.d+' m'],
    ['TAKS',taks],['KAKS',kaks],['MAK. KAT',kat+' kat'],
    ['INSAAT HAKKI',Math.round(area*parseFloat(kaks)).toLocaleString('tr-TR')+' m2']
  ];
  var h='<div style="font-size:8px;font-weight:700;letter-spacing:2px;margin-bottom:6px;color:'+kaynakRenk+'">'+(isReal?'TKGM CANLI VERI':'TAHMINI VERI')+'</div>';
  rows.forEach(function(r){h+='<div class="rrow"><span class="rk">'+r[0]+'</span><span class="rv"'+(r[0]==='PARSEL ALANI'?' style="color:'+(isReal?'var(--grn)':'var(--gld)')+'"':'')+'>'+r[1]+'</span></div>';});
  h+='<div style="padding:8px;background:linear-gradient(135deg,#e6f4ec,#f0faf4);border:1px solid rgba(20,110,50,.16);border-radius:7px;margin-top:7px">';
  h+='<div style="color:var(--grn);font-size:8px;letter-spacing:2px;margin-bottom:4px;font-weight:700">TAHMINI PAZAR DEGERI</div>';
  h+='<div class="rv big">TL '+deger.toLocaleString('tr-TR')+'</div>';
  h+='<div style="color:#3a7a5a;font-size:9px;margin-top:2px">Birim TL '+birim.toLocaleString('tr-TR')+'/m2</div></div>';
  gel('rp-imar').innerHTML=h;
}

// ═══════════════════════════════
// WEATHER
// ═══════════════════════════════
function fetchWeather(lat,lng){
  fetch('https://api.open-meteo.com/v1/forecast?latitude='+lat.toFixed(4)+'&longitude='+lng.toFixed(4)+'&current=temperature_2m,wind_speed_10m,wind_direction_10m,weather_code&wind_speed_unit=kmh')
    .then(function(r){return r.json();})
    .then(function(d){
      var c=d.current,ics={0:'S',1:'S',2:'C',3:'C',45:'F',51:'R',61:'R',80:'R',95:'T'};
      gel('wx-ic').textContent=ics[c.weather_code]||'?';gel('wx-t').textContent=Math.round(c.temperature_2m)+'C';
      var dirs=['K','KD','D','GD','G','GB','B','KB'];gel('wx-w').textContent=Math.round(c.wind_speed_10m)+' '+dirs[Math.round(c.wind_direction_10m/45)%8];
    }).catch(function(){});
}

// ═══════════════════════════════
// MAP + LAYERS (EKLENEN GECE MODU KONTROLU ILE)
// ═══════════════════════════════
function buildStyle(lyr){
  var curLyr = lyr;
  if(isDark && lyr === 'osm') curLyr = 'osm_dark'; // Eger Gece modundaysa ve OSM seciliyse koyu renkli OSM'yi kullan
  return{version:8,glyphs:'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',sources:{base:{type:'raster',tiles:LYRS[curLyr].t,tileSize:256,attribution:LYRS[curLyr].a},tkgm:{type:'raster',tiles:[TKGM_WMS],tileSize:256,attribution:'TKGM'}},layers:[{id:'base-l',type:'raster',source:'base'},{id:'tkgm-l',type:'raster',source:'tkgm',paint:{'raster-opacity':1.0}}]};
}

function initMap(lat,lng,coords){
  G.map=new maplibregl.Map({container:'map',preserveDrawingBuffer:true,style:buildStyle(G.lyrKey),center:[lng,lat],zoom:13,pitch:0,bearing:0,maxPitch:60,attributionControl:false});
  G.map.addControl(new maplibregl.AttributionControl({compact:true}),'bottom-right');
  G.map.addControl(new maplibregl.NavigationControl({visualizePitch:true}),'top-right');
  requestAnimationFrame(function(){setTimeout(function(){if(G.map)G.map.resize();},100);setTimeout(function(){if(G.map)G.map.resize();},500);});
  window.addEventListener('resize',function(){if(G.map)G.map.resize();});
  G.map.on('load',function(){
    G.map.resize();addParcel(lat,lng,coords);addRings(lat,lng);startDrone();startHUD();
    G.map.on('move',function(){updateHUD();updatePoiPinVisibility();});
    G.map.on('zoom',function(){updatePoiPinVisibility();}); // EKLENEN: Zoom duyarliligi icin explicit dinleyici
  });
  G.map.on('click',onMapClick);
}

function safeS(id,spec){try{if(!G.map.getSource(id))G.map.addSource(id,spec);}catch(e){}}
function safeL(spec){try{if(!G.map.getLayer(spec.id))G.map.addLayer(spec);}catch(e){}}

// --- EKLENEN: ANIMASYONLU LAZER PARSEL CIZIMI (ORIJINAL FONKSIYON GUNCELLEMESI) ---
function addParcel(lat,lng,coords){
  var poly;
  if(coords&&coords.length>2){poly=coords;}
  else{var hw=mLng(G.pDims.w/2,lat),hd=mLat(G.pDims.d/2);poly=[[lng-hw,lat-hd],[lng+hw,lat-hd],[lng+hw,lat+hd],[lng-hw,lat+hd],[lng-hw,lat-hd]];}
  
  // Baslangicta tek nokta vererek animasyona hazirla
  safeS('parcel',{type:'geojson',data:{type:'Feature',geometry:{type:'LineString',coordinates:[poly[0], poly[0]]},properties:{}}});
  safeL({id:'p-fill',type:'fill',source:'parcel',paint:{'fill-color':'#cc2000','fill-opacity':0}});
  safeL({id:'p-line',type:'line',source:'parcel',paint:{'line-color':'#ee3300','line-width':3.5,'line-opacity':0.9}});
  
  var step = 0;
  var drawInt = setInterval(function(){
    step++;
    var path = poly.slice(0, step + 1);
    if(path.length > 1) {
      try{G.map.getSource('parcel').setData({type:'Feature',geometry:{type:'LineString',coordinates:path}});}catch(e){}
    }
    // Cizim bittiginde icini doldur ve pini animasyonla dusur
    if(step >= poly.length - 1){
      clearInterval(drawInt);
      try{
        G.map.getSource('parcel').setData({type:'Feature',geometry:{type:'Polygon',coordinates:[poly]}});
        G.map.setPaintProperty('p-fill', 'fill-opacity', 0.18);
      }catch(e){}
      
      var ctr=polyCenter(poly);
      safeS('pdot',{type:'geojson',data:cirGJ(ctr.lng,ctr.lat,4)});
      safeL({id:'pd-f',type:'fill',source:'pdot',paint:{'fill-color':'#ee3300','fill-opacity':0.85}});
      var pr=4,up=true;
      if(!G._pinAnimInt){
        G._pinAnimInt = setInterval(function(){if(!G.map)return;up?(pr+=0.3,pr>9&&(up=false)):(pr-=0.3,pr<4&&(up=true));try{G.map.getSource('pdot').setData(cirGJ(ctr.lng,ctr.lat,pr));}catch(e){}},100);
      }
      
      var el=document.createElement('div');
      el.style.cssText='background:rgba(180,30,0,.9);border:1.5px solid #ff6644;border-radius:6px;padding:3px 9px;color:#fff;font-size:10px;font-weight:700;font-family:Share Tech Mono,monospace;pointer-events:none;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.3); animation:dropPin 0.6s cubic-bezier(0.25,1,0.5,1);';
      el.textContent='Ada:'+G.fd.ada+' / Parsel:'+G.fd.parsel;
      new maplibregl.Marker({element:el,anchor:'center'}).setLngLat([ctr.lng,ctr.lat]).addTo(G.map);
    }
  }, 40);
}

function addRings(lat,lng){
  var cfg=[{r:50,c:'#c08000',op:0.8},{r:100,c:'#1460b0',op:0.65},{r:200,c:'#146030',op:0.45},{r:500,c:'#5040b0',op:0.3}];
  var ANG=42*Math.PI/180;
  cfg.forEach(function(it){
    safeS('ring'+it.r,{type:'geojson',data:cirGJ(lng,lat,it.r)});
    safeL({id:'ring-l'+it.r,type:'line',source:'ring'+it.r,paint:{'line-color':it.c,'line-width':1.5,'line-opacity':it.op,'line-dasharray':[6,4]}});
    G.ringLabelVis[it.r]=true;
    var lngPos=lng+mLng(it.r*Math.cos(ANG),lat),latPos=lat+mLat(it.r*Math.sin(ANG));
    var el=document.createElement('div');
    el.className='ring-label';
    el.style.cssText='border:1.5px solid '+it.c+';color:'+it.c+';background:rgba(255,255,255,.95);border-radius:7px;padding:4px 9px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.1);cursor:pointer;font-size:10px;font-weight:700;font-family:Share Tech Mono,monospace;transition:all .2s';
    el.textContent=it.r+'m cevresinde';
    el.dataset.r=it.r;
    el.addEventListener('click',function(){
      var r=parseInt(this.dataset.r);
      G.ringLabelVis[r]=!G.ringLabelVis[r];
      this.style.opacity=G.ringLabelVis[r]?'1':'0.3';
      try{G.map.setLayoutProperty('ring-l'+r,'visibility',G.ringLabelVis[r]?'visible':'none');}catch(e){}
    });
    G.ringMks.push(new maplibregl.Marker({element:el,anchor:'center'}).setLngLat([lngPos,latPos]).addTo(G.map));
  });
}

function togRings(){
  G.ringsOn=!G.ringsOn;
  [50,100,200,500].forEach(function(r){try{G.map.setLayoutProperty('ring-l'+r,'visibility',G.ringsOn?'visible':'none');}catch(e){}});
  G.ringMks.forEach(function(m){m.getElement().style.display=G.ringsOn?'':'none';});
  gel('btn-rings').className=G.ringsOn?'cb on':'cb';
}

// ═══════════════════════════════
// DRONE
// ═══════════════════════════════
function startDrone(){G.phase=0;runPhase();}
function stopDrone(){clearTimeout(G.droneT);cancelAnimationFrame(G.orbitRAF);G.orbitOn=false;}
function runPhase(){
  if(!G.map||G.mode==='paused')return;
  var ph=PHASES[G.phase],spd=G.mode==='fast'?0.38:1,dur=ph.dur*spd;
  gel('phasind').textContent=ph.n;gel('ph-badge').textContent=ph.n;
  if(G.phase===0){G.map.flyTo({center:G.center,zoom:13.5,pitch:0,bearing:0,duration:2800,essential:true});setTimeout(function(){if(G.map)G.map.flyTo({zoom:16.5,pitch:25,bearing:55,duration:3500,essential:true});},3100);}
  else if(G.phase===1){G.map.flyTo({center:G.center,zoom:ph.zoom,pitch:ph.pitch,bearing:G.bearing,duration:2500,essential:true});setTimeout(function(){G.orbitOn=true;doOrbit(Date.now(),dur-2700);},2800);return;}
  else if(G.phase===2){G.bearing=(G.bearing+90)%360;G.map.flyTo({center:G.center,zoom:18.2,pitch:30,bearing:G.bearing,duration:2500,essential:true});setTimeout(function(){if(G.map)G.map.flyTo({zoom:18.6,pitch:32,bearing:(G.bearing+45)%360,duration:2500,essential:true});},3300);setTimeout(function(){if(G.map)G.map.flyTo({bearing:(G.bearing+90)%360,duration:1800,essential:true});},6400);}
  else{G.bearing=(G.bearing+175)%360;G.map.flyTo({center:G.center,zoom:16.5,pitch:25,bearing:G.bearing,duration:3000,essential:true});}
  G.droneT=setTimeout(function(){G.orbitOn=false;G.phase=(G.phase+1)%4;runPhase();},dur);
}
function doOrbit(t0,tot){if(!G.orbitOn||!G.map)return;if(Date.now()-t0>=tot){G.orbitOn=false;G.phase=(G.phase+1)%4;runPhase();return;}G.bearing=(G.bearing+0.28*(G.mode==='fast'?2.5:1))%360;G.map.setBearing(G.bearing);G.orbitRAF=requestAnimationFrame(function(){doOrbit(t0,tot);});}

// ═══════════════════════════════
// HUD + COMPASS
// ═══════════════════════════════
function startHUD(){if(G.hudIv)clearInterval(G.hudIv);G.hudIv=setInterval(updateHUD,G.mode==='paused'?2000:150);}
function updateHUD(){
  if(!G.map)return;
  var z=G.map.getZoom(),p=G.map.getPitch(),b=G.map.getBearing(),c=G.map.getCenter();
  var alt=Math.max(10,Math.round(G.altitude*(1+Math.max(0,18-z)*10)));
  var spd=Math.round(3+Math.abs(Math.sin(b*0.05))*14),hdg=Math.round((b+360)%360);
  gel('h-alt').textContent=alt+' m';gel('h-spd').textContent=spd+' kn';gel('h-hdg').textContent=hdg;gel('h-zoom').textContent=z.toFixed(1);
  gel('b-alt').textContent=alt+' m';gel('b-pit').textContent=Math.round(p);gel('b-bear').textContent=hdg;
  gel('b-crd').textContent=c.lat.toFixed(4)+'K '+c.lng.toFixed(4)+'D';gel('b-zoom').textContent=z.toFixed(2);
  drawCompass(hdg);
}
function drawCompass(hdg){
  var cv=gel('compassov');if(!cv)return;var ctx=cv.getContext('2d'),cx=33,cy=33,r=26;
  ctx.clearRect(0,0,66,66);ctx.beginPath();ctx.arc(cx,cy,r+1,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.92)';ctx.fill();ctx.strokeStyle='rgba(20,70,160,.2)';ctx.lineWidth=1.3;ctx.stroke();
  for(var i=0;i<36;i++){var a=(i*10-90)*Math.PI/180,inn=i%9===0?r-7:r-4;ctx.beginPath();ctx.moveTo(cx+inn*Math.cos(a),cy+inn*Math.sin(a));ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));ctx.strokeStyle=i%9===0?'rgba(20,70,160,.5)':'rgba(20,70,160,.15)';ctx.lineWidth=i%9===0?1.3:.75;ctx.stroke();}
  [['K',-90,'#c82800'],['D',0,'rgba(20,70,160,.5)'],['G',90,'rgba(20,70,160,.5)'],['B',180,'rgba(20,70,160,.5)']].forEach(function(it){var la=(it[1]-90)*Math.PI/180;ctx.fillStyle=it[2];ctx.font='700 '+(it[0]==='K'?9:7)+'px Share Tech Mono';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(it[0],cx+(r-11)*Math.cos(la),cy+(r-11)*Math.sin(la));});
  var na=-hdg*Math.PI/180;ctx.save();ctx.translate(cx,cy);ctx.rotate(na);ctx.beginPath();ctx.moveTo(0,-r+5);ctx.lineTo(-4,4);ctx.lineTo(4,4);ctx.fillStyle='#c82800';ctx.fill();ctx.beginPath();ctx.moveTo(0,r-5);ctx.lineTo(-4,-4);ctx.lineTo(4,-4);ctx.fillStyle='rgba(20,70,160,.4)';ctx.fill();ctx.restore();ctx.beginPath();ctx.arc(cx,cy,2.5,0,Math.PI*2);ctx.fillStyle='#334';ctx.fill();
}

// ═══════════════════════════════
// SCREENSHOT (Turyap Queen branded)
// ═══════════════════════════════
function takeScreenshot(){
  if(!G.map)return;
  var mc=G.map.getCanvas(),W=mc.width,H=mc.height;
  var out=document.createElement('canvas');out.width=W;out.height=H;
  var ctx=out.getContext('2d');ctx.drawImage(mc,0,0);
  var topH=Math.round(H*0.07);
  var g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'#0e2d6e');g.addColorStop(.6,'#1a4fa0');g.addColorStop(1,'#0e2d6e');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,topH);
  ctx.fillStyle='#fff';ctx.font='bold '+Math.round(topH*.5)+'px sans-serif';ctx.textAlign='left';ctx.textBaseline='middle';
  ctx.fillText('TURYAP QUEEN - DRONE PARSEL SIM v4',topH*.18,topH*.5);
  ctx.font=Math.round(topH*.32)+'px monospace';ctx.textAlign='right';ctx.fillStyle='rgba(255,255,255,.78)';
  ctx.fillText(new Date().toLocaleString('tr-TR'),W-topH*.3,topH*.5);
  ctx.fillStyle='rgba(255,200,0,.5)';ctx.fillRect(0,topH-2,W,2);
  var botH=Math.round(H*0.085),botY=H-botH;
  ctx.fillStyle='rgba(8,22,55,.88)';ctx.fillRect(0,botY,W,botH);ctx.fillStyle='rgba(100,160,255,.3)';ctx.fillRect(0,botY,W,1.5);
  var fSz=Math.round(botH*.28);
  ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillStyle='rgba(255,255,255,.4)';ctx.font=Math.round(fSz*.75)+'px monospace';ctx.fillText('ADA/PARSEL',botH*.25,botY+botH*.25);
  ctx.fillStyle='#fff';ctx.font='bold '+fSz+'px monospace';ctx.fillText(G.fd.ada+'/'+G.fd.parsel,botH*.25,botY+botH*.68);
  var mx=W*.26;ctx.fillStyle='rgba(255,255,255,.4)';ctx.font=Math.round(fSz*.75)+'px monospace';ctx.fillText('MAHALLE/ILCE',mx,botY+botH*.25);
  ctx.fillStyle='#a8d0ff';ctx.font='bold '+fSz+'px monospace';ctx.fillText(G.fd.mah+' - '+G.fd.ilce,mx,botY+botH*.68);
  var ax=W*.55;if(G.pDims){var area=G.pDims.w*G.pDims.d;ctx.fillStyle='rgba(255,255,255,.4)';ctx.font=Math.round(fSz*.75)+'px monospace';ctx.fillText('ALAN',ax,botY+botH*.25);ctx.fillStyle='#aaffcc';ctx.font='bold '+fSz+'px monospace';ctx.fillText(area.toLocaleString('tr-TR')+' m2',ax,botY+botH*.68);}
  if(G.center){ctx.textAlign='right';ctx.fillStyle='rgba(255,255,255,.4)';ctx.font=Math.round(fSz*.75)+'px monospace';ctx.fillText('KOORDINAT',W-botH*.25,botY+botH*.25);ctx.fillStyle='#88ffcc';ctx.font=fSz+'px monospace';ctx.fillText(G.center[1].toFixed(4)+'K '+G.center[0].toFixed(4)+'D',W-botH*.25,botY+botH*.68);}
  var a=document.createElement('a');a.download='TQ_'+G.fd.ada+'-'+G.fd.parsel+'_'+Date.now()+'.png';a.href=out.toDataURL('image/png',.95);a.click();
  var fl=document.createElement('div');fl.style.cssText='position:fixed;inset:0;background:#fff;opacity:.65;z-index:9999;pointer-events:none;transition:opacity .3s';document.body.appendChild(fl);setTimeout(function(){fl.style.opacity='0';setTimeout(function(){fl.remove();},310);},80);
}

// ═══════════════════════════════
// VIDEO RECORDING
// ═══════════════════════════════
function toggleRecord(){if(G.isRec)stopRec();else startRec();}
function startRec(){
  if(!G.map)return;
  var mc=G.map.getCanvas(),W=mc.width,H=mc.height;
  var cc=document.createElement('canvas');cc.width=W;cc.height=H;var cctx=cc.getContext('2d');
  function drawOverlay(){
    cctx.drawImage(mc,0,0);
    var tH=Math.round(H*.055);
    var g=cctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'rgba(14,45,110,.9)');g.addColorStop(.6,'rgba(26,79,160,.9)');g.addColorStop(1,'rgba(14,45,110,.9)');
    cctx.fillStyle=g;cctx.fillRect(0,0,W,tH);
    cctx.fillStyle='#fff';cctx.font='bold '+Math.round(tH*.5)+'px monospace';cctx.textAlign='left';cctx.textBaseline='middle';
    cctx.fillText('TURYAP QUEEN  Ada:'+G.fd.ada+'/Parsel:'+G.fd.parsel+'  '+G.fd.mah+', '+G.fd.ilce,tH*.2,tH*.5);
    if(G.center){cctx.fillStyle='rgba(255,255,255,.65)';cctx.textAlign='right';cctx.font=Math.round(tH*.38)+'px monospace';cctx.fillText(G.center[1].toFixed(4)+'K '+G.center[0].toFixed(4)+'D  '+new Date().toLocaleTimeString('tr-TR'),W-tH*.2,tH*.5);}
    cctx.fillStyle='rgba(255,200,0,.4)';cctx.fillRect(0,tH-1.5,W,1.5);
    var bH=Math.round(H*.055),bY=H-bH;
    cctx.fillStyle='rgba(8,22,55,.82)';cctx.fillRect(0,bY,W,bH);cctx.fillStyle='rgba(100,160,255,.25)';cctx.fillRect(0,bY,W,1.2);
    if(G.map){var z=G.map.getZoom(),b2=G.map.getBearing(),hdg=Math.round((b2+360)%360);var alt=Math.max(10,Math.round(G.altitude*(1+Math.max(0,18-z)*10)));
      cctx.fillStyle='#7ab8ff';cctx.font='bold '+Math.round(bH*.44)+'px monospace';cctx.textAlign='left';cctx.textBaseline='middle';
      cctx.fillText('ALT:'+alt+'m  YON:'+hdg+'  ZOOM:'+z.toFixed(1)+'  FAZ:'+PHASES[G.phase].n,bH*.25,bY+bH*.52);}
    cctx.fillStyle='rgba(200,40,0,.9)';cctx.beginPath();cctx.arc(W-bH*.5,bY+bH*.52,bH*.22,0,Math.PI*2);cctx.fill();
    cctx.fillStyle='#fff';cctx.font='bold '+Math.round(bH*.38)+'px monospace';cctx.textAlign='right';cctx.fillText('REC '+gel('rec-t').textContent,W-bH*.8,bY+bH*.52);
    if(G.isRec)requestAnimationFrame(drawOverlay);
  }
  drawOverlay();
  var stream;
  try{stream=cc.captureStream(25);}catch(e){alert('Video kaydi desteklenmiyor.');return;}
  var mimes=['video/webm;codecs=vp9,opus','video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'];
  var mime=mimes.filter(function(m){return MediaRecorder.isTypeSupported(m);})[0];
  if(!mime){alert('MediaRecorder desteklenmiyor.');return;}
  var opts={mimeType:mime,videoBitsPerSecond:4000000};
  try{G.recorder=new MediaRecorder(stream,opts);}catch(e){G.recorder=new MediaRecorder(stream);}
  G.recChunks=[];
  G.recorder.ondataavailable=function(e){if(e.data&&e.data.size>0)G.recChunks.push(e.data);};
  G.recorder.onstop=function(){
    var blob=new Blob(G.recChunks,{type:mime});
    var ext=mime.indexOf('mp4')>-1?'mp4':'webm';
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='TQ_'+G.fd.ada+'-'+G.fd.parsel+'_'+Date.now()+'.'+ext;a.click();URL.revokeObjectURL(a.href);
    G.isRec=false;G.recSec=0;gel('btn-rec').textContent='VIDEO KAYDET';gel('btn-rec').className='cb redbtn';gel('recbadge').style.display='none';if(G.recT){clearInterval(G.recT);G.recT=null;}
  };
  G.recorder.start(250);G.isRec=true;G.recSec=0;
  gel('btn-rec').textContent='DURDUR (60s)';gel('btn-rec').className='cb redbtn act';gel('recbadge').style.display='block';
  G.recT=setInterval(function(){G.recSec++;gel('rec-t').textContent=String(Math.floor(G.recSec/60)).padStart(2,'0')+':'+String(G.recSec%60).padStart(2,'0');gel('btn-rec').textContent='DURDUR ('+(60-G.recSec)+'s)';if(G.recSec>=60)stopRec();},1000);
}
function stopRec(){if(!G.isRec||!G.recorder)return;try{G.recorder.stop();}catch(e){}if(G.recT){clearInterval(G.recT);G.recT=null;}}

// ═══════════════════════════════
// POI + OVERPASS
// ═══════════════════════════════
var POI_IC = {hospital:'H',clinic:'H',pharmacy:'P',doctor:'D',school:'E',university:'U',kindergarten:'K',library:'L',post_office:'M',bank:'B',atm:'A',police:'J',fire_station:'F',mosque:'C',church:'X',fuel:'G',supermarket:'S',marketplace:'Z',bus_station:'T',park:'Y',playground:'O',bakery:'R',grocery:'I',airport:'AP',bus_station:'BS'};

function fetchOverpass(q){
  var mirrors=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter'];
  function try_(idx){if(idx>=mirrors.length)return Promise.resolve(null);var c=new AbortController();setTimeout(function(){c.abort();},9000);return fetch(mirrors[idx],{method:'POST',body:q,signal:c.signal}).then(function(r){if(r.ok)return r.json();throw new Error();}).catch(function(){return try_(idx+1);});}
  return try_(0);
}

function loadPOI(){
  if(!G.center)return;
  var btn=gel('btn-poi');btn.textContent='YUKLUYOR...';btn.disabled=true;
  gel('rp-poi').innerHTML='<span style="color:var(--sub)">Sorgulanıyor...</span>';
  var lng=G.center[0],lat=G.center[1];
  var q='[out:json][timeout:25];('
    +'node["amenity"~"hospital|clinic|pharmacy|school|university|kindergarten|bank|atm|police|fire_station|mosque|church|fuel|supermarket|marketplace|bus_station|post_office"](around:700,'+lat+','+lng+');'
    +'node["aeroway"="aerodrome"](around:50000,'+lat+','+lng+');'
    +'node["amenity"="bus_station"](around:10000,'+lat+','+lng+');'
    +'node["shop"~"supermarket|bakery|grocery"](around:700,'+lat+','+lng+');'
    +'node["leisure"~"park|playground"](around:700,'+lat+','+lng+');'
    +');out center 30;';

  fetchOverpass(q).then(function(data){
    if(!data){gel('rp-poi').innerHTML='<span style="color:var(--sub);font-size:10px">Yuklenemiyor.</span>';btn.textContent='POI GUNCELLE';btn.disabled=false;btn.className='cb';return;}
    G.poiMks.forEach(function(m){try{m.remove();}catch(e){}});G.poiMks=[];
    var items=data.elements.map(function(el){
      var eLat=el.lat||(el.center&&el.center.lat),eLng=el.lon||(el.center&&el.center.lon);
      if(!eLat)return null;
      var am=(el.tags&&(el.tags.amenity||el.tags.aeroway||el.tags.leisure||el.tags.shop))||'place';
      var nm=(el.tags&&el.tags.name)||(am.charAt(0).toUpperCase()+am.slice(1));
      var dist=Math.round(hvs(lng,lat,eLng,eLat));
      return{am:am,nm:nm,icon:POI_IC[am]||'*',eLat:eLat,eLng:eLng,dist:dist};
    }).filter(Boolean).sort(function(a,b){return a.dist-b.dist;});
    G.lastPOIs=items;
    var h='';
    var airport=items.filter(function(i){return i.am==='aerodrome';})[0];
    var busterm=items.filter(function(i){return i.am==='bus_station'&&i.dist>1000;})[0];
    if(airport){h+='<div class="poii"><span style="font-size:13px">AP</span><span class="poiv">'+airport.nm+' (Havaalanı)</span><span class="poid">'+(airport.dist<1000?airport.dist+' m':(airport.dist/1000).toFixed(1)+' km')+'</span></div>';}
    if(busterm){h+='<div class="poii"><span style="font-size:13px">BS</span><span class="poiv">'+busterm.nm+' (Otogar/Durak)</span><span class="poid">'+(busterm.dist<1000?busterm.dist+' m':(busterm.dist/1000).toFixed(1)+' km')+'</span></div>';}
    items.filter(function(i){return i.am!=='aerodrome';}).slice(0,16).forEach(function(it){
      var ds=it.dist<1000?it.dist+' m':(it.dist/1000).toFixed(1)+' km';
      h+='<div class="poii"><span style="font-size:12px">'+it.icon+'</span><span class="poiv"><b>'+it.nm+'</b></span><span class="poid">'+ds+'</span></div>';
      if(G.map&&G.poiPinsOn){
        var el2=document.createElement('div');
        el2.style.cssText='display:flex;flex-direction:column;align-items:center;cursor:pointer';
        el2.innerHTML='<div style="background:rgba(255,255,255,.94);border:1.5px solid rgba(20,70,160,.3);border-radius:16px;padding:3px 9px 3px 6px;display:flex;align-items:center;gap:4px;box-shadow:0 2px 8px rgba(0,0,0,.12);white-space:nowrap;font-family:Share Tech Mono,monospace"><span style="font-size:12px">'+it.icon+'</span><span style="font-size:10px;font-weight:700;color:#1a3a80">'+it.nm+'</span><span style="font-size:8px;color:#7a8aaa;margin-left:3px">'+ds+'</span></div><div style="width:4px;height:6px;background:rgba(20,70,160,.4)"></div><div style="width:5px;height:5px;border-radius:50%;background:rgba(20,70,160,.5)"></div>';
        var pop=new maplibregl.Popup({closeButton:false,offset:8}).setHTML('<b>'+it.nm+'</b><br><span style="color:var(--grn);font-size:9px">'+ds+'</span>');
        var mk=new maplibregl.Marker({element:el2,anchor:'bottom'}).setLngLat([it.eLng,it.eLat]).setPopup(pop).addTo(G.map);
        mk._poiDist=it.dist;mk._poiLat=it.eLat;mk._poiLng=it.eLng;
        G.poiMks.push(mk);
      }
    });
    gel('rp-poi').innerHTML=h||'<span style="color:var(--sub)">700m POI bulunamadi.</span>';
    btn.textContent='POI GUNCELLE';btn.disabled=false;btn.className='cb on-g';
    updatePoiPinVisibility();
  });
}

// --- EKLENEN: ZOOM ILE GOZUKME ANIMASYONU (GUNCELLEME) ---
function updatePoiPinVisibility(){
  if(!G.map||!G.poiPinsOn)return;
  var z=G.map.getZoom(),bounds=G.map.getBounds();
  G.poiMks.forEach(function(mk){
    if(!mk._poiLat)return;
    var inView=bounds.contains([mk._poiLng,mk._poiLat]);
    var showAtZoom=mk._poiDist<100?14:(mk._poiDist<300?12:10);
    var el=mk.getElement();
    // Smooth transform effects added
    if(inView&&z>=showAtZoom&&G.poiPinsOn){
      el.style.opacity='1';
      el.style.transform='scale(1) translateY(0)';
    }else{
      el.style.opacity='0';
      el.style.transform='scale(0.8) translateY(10px)';
    }
    el.style.transition='opacity 0.4s ease, transform 0.4s ease';
  });
}

function togPoiPins(){
  G.poiPinsOn=!G.poiPinsOn;
  G.poiMks.forEach(function(mk){var el=mk.getElement();el.style.opacity=G.poiPinsOn?'1':'0';});
  gel('btn-poi-pins').className=G.poiPinsOn?'cb on':'cb';
}

// ═══════════════════════════════
// FINANCIAL ANALYSIS
// ═══════════════════════════════
function runAnalysis(){
  if(!G.center||!G.pDims)return;
  if(!G.panelOn){G.panelOn=true;gel('rpanel').classList.remove('hidden');}
  gel('rp-fin').innerHTML='<span style="color:var(--sub)">Hesaplanıyor...</span>';
  if(G.lastPOIs.length===0)loadPOI();
  setTimeout(function(){
    var adaN=parseInt(G.fd.ada)||100,pN=parseInt(G.fd.parsel)||5,area=G.pDims.w*G.pDims.d;
    var s=sd(adaN+pN),birim=8500+Math.round(s*18000),deger=area*birim;
    var ilceN=normTR(G.fd.ilce),band,em3,em5;
    if(['muratpasa','konyaalti','kepez'].indexOf(ilceN)>-1){band=[6.8,9.2];em3=0.95;em5=2.10;}
    else if(['kadikoy','besiktas','sisli','beyoglu'].indexOf(ilceN)>-1){band=[4.5,6.8];em3=1.05;em5=2.45;}
    else if(['cankaya','kecioren','mamak'].indexOf(ilceN)>-1){band=[5.5,7.5];em3=0.75;em5=1.60;}
    else{band=[5.0,8.0];em3=0.65;em5=1.40;}
    var kira=band[0]+s*(band[1]-band[0]),ayK=Math.round(deger*(kira/100)/12),amor=Math.round(deger/(deger*(kira/100)));
    var d3=Math.round(deger*(1+em3)),d5=Math.round(deger*(1+em5));
    var r3=((d3-deger)/deger*100).toFixed(1),r5=((d5-deger)/deger*100).toFixed(1);
    var irr=((Math.pow(d5/deger,1/5)-1)*100).toFixed(1);
    var score=Math.min(100,Math.round((kira/10*30)+(parseFloat(r5)/200*40)+(area>500?20:10)+(parseFloat(irr)/40*10)));
    var verdict=score>=70?'GUCLU AL':score>=50?'AL / IZLE':'INCELE';
    var vclass=score>=70?'buy':score>=50?'hold':'pass';
    var vcol=score>=70?'var(--grn)':score>=50?'var(--gld)':'var(--red)';
    var sfill=score>=70?'linear-gradient(90deg,#1a8a3a,#2aba5a)':score>=50?'linear-gradient(90deg,#b07800,#daa000)':'linear-gradient(90deg,#c82800,#e84820)';
    function cl(types){var f=G.lastPOIs.filter(function(p){return types.indexOf(p.am)>-1;});return f.length?f.sort(function(a,b){return a.dist-b.dist;})[0]:null;}
    var sag=cl(['hospital','clinic','pharmacy']),okl=cl(['school','university']),mkt=cl(['supermarket','marketplace']);
    var airport=G.lastPOIs.filter(function(p){return p.am==='aerodrome';})[0];
    var h='<table class="roi-t">';
    h+='<tr><td class="roi-k">Alan</td><td class="roi-v">'+area.toLocaleString('tr-TR')+' m2</td></tr>';
    h+='<tr><td class="roi-k">Tahmini Deger</td><td class="roi-v b">TL '+Math.round(deger).toLocaleString('tr-TR')+'</td></tr>';
    h+='<tr><td class="roi-k">Birim</td><td class="roi-v">TL '+birim.toLocaleString('tr-TR')+'/m2</td></tr>';
    h+='<tr><td class="roi-k">Aylik Kira</td><td class="roi-v g">TL '+ayK.toLocaleString('tr-TR')+'</td></tr>';
    h+='<tr><td class="roi-k">Brut Getiri</td><td class="roi-v g">% '+kira.toFixed(1)+'</td></tr>';
    h+='<tr><td class="roi-k">Amortisman</td><td class="roi-v">'+amor+' yil</td></tr>';
    h+='<tr><td class="roi-k">3 Yil Proj.</td><td class="roi-v g">TL '+d3.toLocaleString('tr-TR')+' (+%'+r3+')</td></tr>';
    h+='<tr><td class="roi-k">5 Yil Proj.</td><td class="roi-v g">TL '+d5.toLocaleString('tr-TR')+' (+%'+r5+')</td></tr>';
    h+='<tr><td class="roi-k">5 Yil IRR</td><td class="roi-v r">% '+irr+'</td></tr>';
    h+='</table>';
    if(sag||okl||mkt||airport){
      h+='<div style="margin-top:8px;padding-top:6px;border-top:1px solid var(--border);font-size:9px;color:var(--sub);line-height:1.8">';
      if(airport){var ad=airport.dist<1000?airport.dist+' m':(airport.dist/1000).toFixed(1)+' km';h+='AP <b>'+airport.nm+'</b> (Havaalani) '+ad+'<br>';}
      if(sag){h+='H <b>'+sag.nm+'</b> '+sag.dist+' m  ';}if(okl){h+='E <b>'+okl.nm+'</b> '+okl.dist+' m  ';}if(mkt){h+='S <b>'+mkt.nm+'</b> '+mkt.dist+' m';}
      h+='</div>';
    }
    h+='<div style="margin-top:10px"><div style="display:flex;justify-content:space-between;font-size:9px;color:var(--sub);margin-bottom:3px"><span>YATIRIM SKORU</span><span style="font-weight:700;color:'+vcol+'">'+score+'/100</span></div>';
    h+='<div class="sbar"><div class="sfill" id="sfill" style="width:0%;background:'+sfill+'"></div></div></div>';
    h+='<div class="verdict '+vclass+'" style="margin-top:10px"><div style="font-size:8px;color:var(--sub);letter-spacing:2px;margin-bottom:3px">TURYAP QUEEN KARARI</div>';
    h+='<div style="font-size:16px;font-weight:800;letter-spacing:3px;color:'+vcol+'">'+verdict+'</div>';
    h+='<div style="font-size:9px;color:var(--sub);margin-top:3px">'+(score>=70?'Fizibilite baslatilabilir.':score>=50?'Fiyat muzakeresi ile degerlendirilebilir.':'Saha tespiti onerilir.')+'</div></div>';
    h+='<div style="font-size:8px;color:var(--sub);margin-top:6px;font-style:italic;text-align:center">* Piyasa egilimine dayali tahmini projeksiyon.</div>';
    gel('rp-fin').innerHTML=h;
    setTimeout(function(){var f=gel('sfill');if(f)f.style.width=score+'%';},100);
  },600);
}

// ═══════════════════════════════
// MEASURE
// ═══════════════════════════════
function togMeasure(){
  G.measOn=!G.measOn;gel('btn-meas').className=G.measOn?'cb on-g':'cb';gel('mbar').style.display=G.measOn?'block':'none';
  if(G.map)G.map.getCanvas().style.cursor=G.measOn?'crosshair':'';
  if(!G.measOn){G.measPts=[];G.measMks.forEach(function(m){m.remove();});G.measMks=[];if(G.measLineOn){try{G.map.removeLayer('ml');G.map.removeSource('ms');}catch(e){}}G.measLineOn=false;gel('m-res').textContent='';gel('m-st').textContent='Ilk noktayi secin';}
}
function onMapClick(e){
  if(!G.measOn)return;var pt=[e.lngLat.lng,e.lngLat.lat];G.measPts.push(pt);
  var dot=document.createElement('div');dot.style.cssText='width:10px;height:10px;border-radius:50%;background:var(--grn);border:2px solid #fff;box-shadow:0 0 6px var(--grn)';
  G.measMks.push(new maplibregl.Marker({element:dot}).setLngLat(pt).addTo(G.map));
  if(G.measPts.length===2){
    var dist=hvs(G.measPts[0][0],G.measPts[0][1],G.measPts[1][0],G.measPts[1][1]);
    var ds=dist<1000?Math.round(dist)+' m':(dist/1000).toFixed(2)+' km';
    gel('m-st').textContent='Mesafe:';gel('m-res').textContent=' '+ds;
    var gj={type:'Feature',geometry:{type:'LineString',coordinates:G.measPts}};
    if(G.measLineOn){try{G.map.getSource('ms').setData(gj);}catch(e){}}
    else{try{G.map.addSource('ms',{type:'geojson',data:gj});G.map.addLayer({id:'ml',type:'line',source:'ms',paint:{'line-color':'#1a7a40','line-width':2.5,'line-dasharray':[5,3]}});G.measLineOn=true;}catch(e){}}
    setTimeout(function(){G.measPts=[];G.measMks.forEach(function(m){m.remove();});G.measMks=[];gel('m-st').textContent='Ilk noktayi secin';gel('m-res').textContent='';},7000);
  } else {gel('m-st').textContent='Ikinci noktayi secin';}
}

// ═══════════════════════════════
// CONTROLS
// ═══════════════════════════════
function setMode(m){
  G.mode=m;var mp={cinematic:'cin',fast:'fast',paused:'stp'};
  ['cin','fast','stp'].forEach(function(id){gel('btn-'+id).className=id===mp[m]?'cb on':'cb';});
  stopDrone();if(m!=='paused'){G.phase=0;runPhase();}startHUD();
}
function buildStyle2(lyr){return buildStyle(lyr);}
function setLyr(l){
  G.lyrKey=l;['sat','osm'].forEach(function(id){gel('btn-'+id).className=id===l?'cb on':'cb';});
  if(!G.map)return;G.map.setStyle(buildStyle(l));
  G.map.once('styledata',function(){if(G.center&&G.tkgmGeom)addParcel(G.center[1],G.center[0],G.tkgmGeom);});
}
function togTKGM(){G.tkgmOn=!G.tkgmOn;try{G.map.setPaintProperty('tkgm-l','raster-opacity',G.tkgmOn?1.0:0);}catch(e){setLyr(G.lyrKey);}gel('btn-tkgm').className=G.tkgmOn?'cb on-g':'cb';gel('tkgmbadge').style.display=G.tkgmOn?'':'none';}
function setAlt(v){G.altitude=parseInt(v);gel('alt-d').textContent=G.altitude+' m';}
function setPitch(v){G.pitchVal=parseInt(v);gel('pitch-d').textContent=G.pitchVal;if(G.map&&G.mode==='paused')G.map.setPitch(Math.min(G.pitchVal,60));}
function togPanel(){G.panelOn=!G.panelOn;gel('rpanel').classList.toggle('hidden',!G.panelOn);}
function openTKGM(){if(G.center)window.open('https://parselsorgu.tkgm.gov.tr/#'+G.center[1].toFixed(6)+'/'+G.center[0].toFixed(6)+'/18','_blank');}
function openGE(){if(G.center)window.open('https://earth.google.com/web/@'+G.center[1]+','+G.center[0]+',0a,200d,35y,0h,45t,0r','_blank');}
function openSV(){if(G.center)window.open('https://www.google.com/maps/@?api=1&map_action=pano&viewpoint='+G.center[1]+','+G.center[0],'_blank');}
function toggleLP(){gel('lpanel').classList.toggle('open');gel('lpov').classList.toggle('show');}
function closeLP(){gel('lpanel').classList.remove('open');gel('lpov').classList.remove('show');}

// ═══════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════
window.addEventListener('DOMContentLoaded',function(){
  initForm();
  gel('btn-start').onclick=function(){startSim(false);};
  gel('btn-demo').onclick=function(){startSim(true);};
  gel('btn-dl').onclick=openDlSheet;
  gel('btn-share').onclick=doShareAPI;
  gel('pwa-btn').onclick=doPWA;
  gel('btn-exit').onclick=exitSim;
  gel('btn-ham').onclick=toggleLP;
  gel('lpov').onclick=closeLP;
  gel('btn-rclose').onclick=togPanel;
  gel('btn-cin').onclick=function(){setMode('cinematic');};
  gel('btn-fast').onclick=function(){setMode('fast');};
  gel('btn-stp').onclick=function(){setMode('paused');};
  gel('btn-sat').onclick=function(){setLyr('sat');};
  gel('btn-osm').onclick=function(){setLyr('osm');};
  gel('btn-tkgm').onclick=togTKGM;
  gel('btn-rings').onclick=togRings;
  gel('btn-poi-pins').onclick=togPoiPins;
  gel('btn-ss').onclick=takeScreenshot;
  gel('btn-rec').onclick=toggleRecord;
  gel('btn-meas').onclick=togMeasure;
  gel('btn-poi').onclick=loadPOI;
  gel('btn-fin').onclick=runAnalysis;
  gel('btn-panel').onclick=togPanel;
  gel('btn-sv').onclick=openSV;
  gel('btn-ge').onclick=openGE;
  gel('btn-tkgml').onclick=openTKGM;
  gel('btn-help').onclick=function(){gel('help-panel').classList.add('show');};
  gel('btn-dlsim').onclick=openDlSheet;
  gel('alt-sl').oninput=function(){setAlt(this.value);};
  gel('pitch-sl').oninput=function(){setPitch(this.value);};
  gel('dl-sheet').addEventListener('click',function(e){if(e.target===this)closeDlSheet();});
});
</script>
</body>
</html>
