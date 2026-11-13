(function(){
'use strict';
/* ===== CONFIG (IDs vazios: preencher quando o escritório criar as contas) ===== */
const CONFIG={whatsapp:'5586988332026',pixelId:'',ga4Id:'',stampAutoMs:1600,foldAutoMs:3500};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ic=n=>'<svg class="ic" aria-hidden="true"><use href="#i-'+n+'"/></svg>';
try{history.scrollRestoration='manual'}catch(e){}
scrollTo(0,0);

/* ===== medição ===== */
window.dataLayer=window.dataLayer||[];
if(CONFIG.ga4Id){const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+CONFIG.ga4Id;document.head.appendChild(s);window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',CONFIG.ga4Id)}
if(CONFIG.pixelId){!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',CONFIG.pixelId);fbq('track','PageView')}
function track(ev,p){p=p||{};try{dataLayer.push(Object.assign({event:ev},p));if(window.gtag)gtag('event',ev,p);if(window.fbq)fbq('trackCustom',ev,p)}catch(e){}}
const UTM=(()=>{try{const q=new URLSearchParams(location.search),o=[];['utm_source','utm_medium','utm_campaign'].forEach(k=>{if(q.get(k))o.push(k+'='+q.get(k).slice(0,40))});return o.join('&')}catch(e){return''}})();
const waLink=t=>'https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent(t+(UTM?'\n(origem: '+UTM+')':''));

/* ===== reveal, live sections, menu, scroll-linked ===== */
const io=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -4% 0px'}):null;
$$('.rv,.rl,.rr,.rz,.rp,.rs,[data-split]').forEach(el=>io?io.observe(el):el.classList.add('in'));
const liveIO=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('live',e.isIntersecting)),{rootMargin:'200px 0px'}):null;
$$('.sec').forEach(s=>liveIO?liveIO.observe(s):s.classList.add('live'));
const secs=$$('.sec'),menu=$('#menu'),links=$$('#menu a'),pg=$('#pg');
let curSec='triagem',tick=false;
function onScroll(){
  if(tick)return;tick=true;requestAnimationFrame(()=>{tick=false;
    const vh=innerHeight,mid=vh*.45;
    const max=document.documentElement.scrollHeight-vh;pg.style.transform='scaleX('+(max>0?clamp(scrollY/max,0,1):0)+')';
    let cur=curSec;secs.forEach(s=>{const r=s.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid)cur=s.id});
    if(cur!==curSec){curSec=cur;mascotSay()}
    const key=cur==='links'||cur==='triagem'?'triagem':cur==='publicos'?'equipe':cur==='onde'?'contato':cur;
    links.forEach(a=>a.classList.toggle('on',a.dataset.s===key));
    railUpdate();parallax();
  });
}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);

/* ===== abertura PROTOCOLAR ===== */
const body=document.body,openEl=$('#open'),stamp=$('#stamp'),doc=$('#doc'),hint=$('#ohint'),skip=$('#skip');
let opened=false,stamped=false,touched=false,openTimers=[];
function sparks(x,y){for(let i=0;i<16;i++){const s=document.createElement('i');s.className='spark';const a=Math.random()*6.28,d=50+Math.random()*90;s.style.cssText='left:'+x+'px;top:'+y+'px;--dx:'+Math.cos(a)*d+'px;--dy:'+Math.sin(a)*d+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),900)}}
function doStamp(){
  if(stamped||opened)return;stamped=true;
  const dr=doc.getBoundingClientRect(),sr=stamp.getBoundingClientRect();
  const tx=dr.left+dr.width/2-(sr.left+sr.width/2),ty=dr.top+dr.height*.42-(sr.top+sr.height/2);
  stamp.classList.remove('drag');stamp.style.transition='transform .35s cubic-bezier(.5,0,.8,.4)';stamp.style.transform='translate('+tx+'px,'+ty+'px) scale(1.25)';
  openTimers.push(setTimeout(()=>{stamp.style.transition='transform .15s';stamp.style.transform='translate('+tx+'px,'+ty+'px) scale(.9)';
    sparks(dr.left+dr.width/2,dr.top+dr.height*.42);doc.classList.add('done');try{navigator.vibrate&&navigator.vibrate(30)}catch(e){}
    stamp.classList.add('used');hint.textContent='Protocolado. Toque para continuar.';track('abertura_carimbo');
    openTimers.push(setTimeout(closeOpen,Math.max(1300,CONFIG.foldAutoMs-CONFIG.stampAutoMs)));},360));
}
function closeOpen(go){
  if(opened)return;opened=true;openTimers.forEach(clearTimeout);
  openEl.classList.add('fold');skip.style.display='none';
  setTimeout(()=>{openEl.remove();body.classList.remove('lock');menu.classList.add('show');mascotStart();if(go)$(go).scrollIntoView({behavior:reduce?'auto':'smooth'});onScroll()},reduce?10:800);
}
(function(){
  let drag=false,sx=0,sy=0,mv=0;
  stamp.addEventListener('pointerdown',e=>{if(stamped)return;touched=true;drag=true;mv=0;sx=e.clientX;sy=e.clientY;stamp.setPointerCapture(e.pointerId);stamp.classList.add('drag');stamp.style.transition='none';e.preventDefault()});
  stamp.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-sx,dy=e.clientY-sy;mv=Math.max(mv,Math.abs(dx)+Math.abs(dy));stamp.style.transform='translate('+dx+'px,'+dy+'px) scale(1.15)';
    const dr=doc.getBoundingClientRect(),sr=stamp.getBoundingClientRect(),cx=sr.left+sr.width/2,cy=sr.top+sr.height/2;doc.style.boxShadow=(cx>dr.left&&cx<dr.right&&cy>dr.top&&cy<dr.bottom)?'0 0 0 4px var(--gold),0 30px 60px -20px rgba(0,0,0,.7)':''});
  const up=e=>{if(!drag)return;drag=false;const dr=doc.getBoundingClientRect(),sr=stamp.getBoundingClientRect(),cx=sr.left+sr.width/2,cy=sr.top+sr.height/2;doc.style.boxShadow='';
    if(mv<8||(cx>dr.left&&cx<dr.right&&cy>dr.top-20&&cy<dr.bottom+20))doStamp();else{stamp.classList.remove('drag');stamp.style.transition='transform .5s cubic-bezier(.2,1.5,.4,1)';stamp.style.transform=''}};
  stamp.addEventListener('pointerup',up);stamp.addEventListener('pointercancel',up);
  stamp.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();touched=true;doStamp()}});
  stamp.addEventListener('click',()=>{if(!stamped&&!touched){touched=true;doStamp()}});
  openEl.addEventListener('click',e=>{if(stamped&&!e.target.closest('#skip'))closeOpen()});
  skip.addEventListener('click',e=>{e.preventDefault();track('abertura_pulada');closeOpen('#links')});
  openTimers.push(setTimeout(()=>{if(!touched)doStamp()},CONFIG.stampAutoMs));
  if(reduce){openTimers.forEach(clearTimeout);setTimeout(()=>closeOpen(),700)}
})();

/* ===== botões: ripple ===== */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.chip,.t-next');if(!b)return;const r=b.getBoundingClientRect(),i=document.createElement('i'),d=Math.max(r.width,r.height);i.className='rip';i.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';b.appendChild(i);setTimeout(()=>i.remove(),650)});
$$('[data-wa]').forEach(a=>{const m={direto:'Olá! Vim pelo site e gostaria de falar com o escritório.',links:'Olá! Vim pelo site e gostaria de falar com um advogado.',contato:'Olá! Vim pelo site e gostaria de conversar sobre o meu caso.'};
  if(m[a.dataset.wa])a.href=waLink(m[a.dataset.wa]);
  a.addEventListener('click',()=>track('clique_whatsapp',{area:a.dataset.wa}))});
$$('[data-ev="mapa"]').forEach(a=>a.addEventListener('click',()=>track('clique_mapa')));
/* wa dos painéis ja tem texto: so adiciona origem */
$$('a[href*="wa.me"][data-wa="empresa"],a[href*="wa.me"][data-wa="profissional"]').forEach(a=>{if(UTM)a.href+=encodeURIComponent('\n(origem: '+UTM+')')});

/* ===== triagem ===== */
const PERFIS=[{id:'trab',t:'Sou trabalhador(a)',i:'briefcase'},{id:'emp',t:'Tenho uma empresa',i:'buildings'},{id:'pac',t:'Sou paciente ou familiar',i:'heartbeat'},{id:'prof',t:'Sou médico(a) ou dentista',i:'stethoscope'},{id:'out',t:'Outra situação',i:'chat-circle-dots'}];
const ASSUNTOS={
 trab:[['Fui demitido(a)','Trabalhista'],['Verbas ou pagamentos em atraso','Trabalhista'],['Assédio no trabalho','Trabalhista'],['Jornada, horas extras ou adicionais','Trabalhista'],['Benefício do INSS','Previdenciário'],['Outro assunto de trabalho','Trabalhista']],
 emp:[['Quero prevenir problemas','Trabalhista'],['Recebi notificação ou processo','Trabalhista'],['Dúvida sobre demissão ou contrato','Trabalhista'],['Outro assunto','Trabalhista']],
 pac:[['O plano de saúde negou','Saúde'],['Medicamento ou tratamento de alto custo','Saúde'],['Outro assunto de saúde','Saúde']],
 prof:[['Publicidade médica ou odontológica','Saúde'],['Defesa ética','Saúde'],['Outro assunto','Saúde']],
 out:[['Consumidor ou voo cancelado','Cível'],['Contrato ou cobrança','Cível'],['Benefício do INSS','Previdenciário'],['Ainda não sei','Geral']]};
const FASES=[['Ainda não aconteceu, quero me prevenir',1,'Bom momento para se organizar com calma.'],['Já tentei resolver sozinho(a)',2,'Reúna o que já foi tentado e converse com um advogado.'],['Aconteceu agora',3,'Quanto antes conversar, mais opções costumam existir.'],['Já recebi notificação ou existe processo',4,'Leve a notificação ou os documentos do processo para o advogado analisar prazos.']];
const DOCS={Trabalhista:['Carteira de trabalho ou contrato','Contracheques','Termo de rescisão','Conversas e e-mails sobre o caso','Comprovantes de horário ou jornada'],Previdenciário:['Carta ou resposta do INSS','Comprovantes de contribuição','Documentos que acompanharam o pedido','Relatórios do seu médico'],'Saúde':['Negativa por escrito','Relatório do médico','Receita ou pedido do tratamento','Protocolos e conversas com o plano','Contrato ou regras do plano'],'Cível':['Comprovantes de gastos','Conversas e protocolos','Contrato ou bilhete','Fotos ou prints'],Geral:['Qualquer documento ou conversa sobre o caso']};
const DOCS_EMP=['Contratos e regulamentos internos','Notificação ou citação recebida','Controles de jornada','Conversas e e-mails sobre o caso'];
const PREFS=['Mensagem no WhatsApp','Ligação','Consulta online','Consulta presencial em Teresina'];
const STEPS=['perfil','assunto','fase','docs','local','contato'];
const S={step:0,perfil:null,assunto:null,area:null,fase:null,docs:[],cidade:'',pref:null,nome:'',tel:''};
const tbox=$('#tbox');
let started=false;
const stored=(()=>{try{return JSON.parse(localStorage.getItem('om_triagem')||'null')}catch(e){return null}})();
if(stored){S.nome=stored.nome||'';S.tel=stored.tel||'';S.cidade=stored.cidade||'';$('#clearAll').style.display='inline-block'}
function docsFor(){return S.perfil==='emp'?DOCS_EMP:(DOCS[S.area]||DOCS.Geral)}
function prog(){return '<div class="t-prog" aria-hidden="true">'+STEPS.map((_,i)=>'<i class="'+(i<S.step?'d':'')+'"></i>').join('')+'</div>'}
function nav(canNext,label,last){return '<div class="t-nav">'+(S.step>0?'<button class="t-back" data-act="back">'+ic('arrow-left')+'Voltar</button>':'')+(canNext!==null?'<button class="t-next" data-act="next" '+(canNext?'':'disabled')+'>'+esc(label||'Continuar')+ic('arrow-right')+'</button>':'')+'</div>'}
function mask(v){v=v.replace(/\D/g,'').slice(0,11);if(v.length>10)return v.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3');if(v.length>6)return v.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3');if(v.length>2)return v.replace(/(\d{2})(\d*)/,'($1) $2');return v}
function render(){
  const st=STEPS[S.step];let h='<div class="t-step" data-st="'+st+'">'+prog();
  if(st==='perfil'){h+='<div class="t-q">Quem está falando?</div><div class="t-opts">'+PERFIS.map(p=>'<button class="chip '+(S.perfil===p.id?'on':'')+'" data-p="'+p.id+'">'+ic(p.i)+esc(p.t)+'</button>').join('')+'</div>'}
  if(st==='assunto'){h+='<div class="t-q">Sobre o que é?</div><div class="t-opts">'+ASSUNTOS[S.perfil].map((a,i)=>'<button class="chip '+(S.assunto===a[0]?'on':'')+'" data-a="'+i+'">'+esc(a[0])+'</button>').join('')+'</div>'+nav(null)}
  if(st==='fase'){const lvl=S.fase!==null?FASES[S.fase][1]:0;h+='<div class="t-q">Em que momento está?</div><div class="thermo" aria-hidden="true">'+[1,2,3,4].map(n=>'<i class="'+(n<=lvl?'on':'')+'" style="--h:'+(n*25)+'%"></i>').join('')+'</div><p class="t-note" style="min-height:2.8em">'+(S.fase!==null?esc(FASES[S.fase][2]):'Escolha uma opção.')+'</p><div class="t-opts" style="margin-top:8px">'+FASES.map((f,i)=>'<button class="chip '+(S.fase===i?'on':'')+'" data-f="'+i+'">'+esc(f[0])+'</button>').join('')+'</div>'+nav(null)}
  if(st==='docs'){const l=docsFor();h+='<div class="t-q">O que você já tem em mãos?</div><p class="t-note" style="margin-bottom:10px">Marque o que tiver. Não precisa enviar agora.</p><div class="docs">'+l.map((d,i)=>'<button class="chip '+(S.docs.includes(d)?'on':'')+'" data-d="'+i+'">'+esc(d)+'</button>').join('')+'</div>'+nav(true,'Continuar')}
  if(st==='local'){h+='<div class="t-q">Onde você está e como prefere falar?</div><div class="field"><label for="cid">Cidade e estado</label><input id="cid" autocomplete="address-level2" maxlength="60" placeholder="Ex.: Teresina, PI" value="'+esc(S.cidade)+'"><span class="err" id="cerr"></span></div><div class="t-opts">'+PREFS.map((p,i)=>'<button class="chip '+(S.pref===p?'on':'')+'" data-pf="'+i+'">'+esc(p)+'</button>').join('')+'</div>'+nav(!!(S.cidade.trim().length>=2&&S.pref))}
  if(st==='contato'){h+='<div class="t-q">Como te chamamos?</div><div class="field"><label for="nm">Seu nome</label><input id="nm" autocomplete="name" maxlength="60" placeholder="Nome e sobrenome" value="'+esc(S.nome)+'"><span class="err" id="nerr"></span></div><div class="field"><label for="tl">Seu WhatsApp com DDD</label><input id="tl" inputmode="tel" autocomplete="tel-national" maxlength="15" placeholder="(86) 90000-0000" value="'+esc(mask(S.tel))+'"><span class="err" id="terr"></span></div><p class="t-note">Não peça nem digite diagnóstico, números de documentos ou outros dados sensíveis aqui.</p>'+nav(true,'Gerar meu protocolo')}
  h+='</div>';tbox.innerHTML=h;
}
function summary(){const f=FASES[S.fase][0];return ['Olá! Fiz a triagem no site do Oscar Monteiro Advocacia.','Nome: '+S.nome,'Perfil: '+PERFIS.find(p=>p.id===S.perfil).t,'Assunto: '+S.assunto+' ('+S.area+')','Momento: '+f,'Documentos que tenho: '+(S.docs.length?S.docs.join(', ')+' ('+S.docs.length+' de '+docsFor().length+')':'ainda não separei'),'Cidade/UF: '+S.cidade.trim(),'Prefiro: '+S.pref,'Gostaria de conversar com um advogado.'].join('\n')}
function result(){
  const pc=PERFIS.find(p=>p.id===S.perfil).t;
  return '<div class="card-proto"><span class="carimbo">PROTOCOLADO</span><h3>Protocolo do seu caso</h3><dl><dt>Nome</dt><dd>'+esc(S.nome)+'</dd><dt>Perfil</dt><dd>'+esc(pc)+'</dd><dt>Assunto</dt><dd>'+esc(S.assunto)+'</dd><dt>Área</dt><dd>'+esc(S.area)+'</dd><dt>Momento</dt><dd>'+esc(FASES[S.fase][0])+'</dd><dt>Documentos</dt><dd>'+(S.docs.length?S.docs.length+' de '+docsFor().length+' separados':'ainda não separados')+'</dd><dt>Local</dt><dd>'+esc(S.cidade.trim())+'</dd><dt>Contato</dt><dd>'+esc(S.pref)+'</dd></dl></div>'+
  '<div class="t-actions"><a class="t-next" id="sendwa" href="'+waLink(summary())+'" target="_blank" rel="noopener" style="text-decoration:none">'+ic('whatsapp-logo')+'Enviar para o escritório</a><button class="t-copy" data-act="copy">'+ic('copy')+'Copiar resumo</button><button class="t-back" data-act="back" style="justify-content:center">'+ic('arrow-left')+'Voltar e ajustar</button></div><button class="t-clear" data-act="clear">Limpar meus dados deste aparelho</button><p class="eth">Este resumo serve só para adiantar a conversa. A análise do seu caso é feita por um advogado. Conteúdo informativo.</p>'
}
function go(n){S.step=n;render();track('passo_'+(n+1))}
function render0(){tbox.innerHTML='<div class="t-step"><div class="t-prog" aria-hidden="true">'+STEPS.map(()=>'<i class="d"></i>').join('')+'</div>'+result()+'</div>';track('triagem_concluida',{area:S.area})}
function begin(){if(!started){started=true;track('iniciar_triagem')}}
tbox.addEventListener('click',e=>{
  const b=e.target.closest('button,a');if(!b)return;begin();
  const act=b.dataset.act;
  if(b.dataset.p){S.perfil=b.dataset.p;if(!ASSUNTOS[S.perfil].some(a=>a[0]===S.assunto)){S.assunto=null;S.area=null;S.docs=[]}render();setTimeout(()=>go(1),260)}
  else if(b.dataset.a!==undefined){const a=ASSUNTOS[S.perfil][+b.dataset.a];if(S.area!==a[1])S.docs=[];S.assunto=a[0];S.area=a[1];track('area_escolhida',{area:S.area});render();setTimeout(()=>go(2),260)}
  else if(b.dataset.f!==undefined){S.fase=+b.dataset.f;render();setTimeout(()=>go(3),520)}
  else if(b.dataset.d!==undefined){const d=docsFor()[+b.dataset.d],i=S.docs.indexOf(d);i>-1?S.docs.splice(i,1):S.docs.push(d);b.classList.toggle('on')}
  else if(b.dataset.pf!==undefined){S.pref=PREFS[+b.dataset.pf];$$('[data-pf]',tbox).forEach(x=>x.classList.toggle('on',x===b));const n=$('[data-act=next]',tbox);if(n)n.disabled=!(S.cidade.trim().length>=2&&S.pref)}
  else if(act==='back'){if(S.step>=STEPS.length){S.step=STEPS.length-1;render()}else go(Math.max(0,S.step-1))}
  else if(act==='next'){
    const st=STEPS[S.step];
    if(st==='docs')return go(4);
    if(st==='local'){if(S.cidade.trim().length<2){$('#cerr').textContent='Informe sua cidade.';return}return go(5)}
    if(st==='contato'){const nm=($('#nm').value||'').trim(),tl=($('#tl').value||'').replace(/\D/g,'');let ok=true;
      if(nm.length<2||!/[A-Za-zÀ-ÿ]/.test(nm)){$('#nerr').textContent='Informe seu nome.';ok=false}else $('#nerr').textContent='';
      if(tl.length<10||tl.length>11){$('#terr').textContent='Use DDD e número, com 10 ou 11 dígitos.';ok=false}else $('#terr').textContent='';
      if(!ok)return;S.nome=nm.slice(0,60);S.tel=tl;
      try{localStorage.setItem('om_triagem',JSON.stringify({nome:S.nome,tel:S.tel,cidade:S.cidade}));$('#clearAll').style.display='inline-block'}catch(e){}
      S.step=STEPS.length;render0()}
  }
  else if(act==='copy'){const t=summary();(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{b.innerHTML=ic('check')+'Copiado'}).catch(()=>{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');b.innerHTML=ic('check')+'Copiado'}catch(x){}ta.remove()})}
  else if(act==='clear')clearAll();
  else if(b.id==='sendwa')track('clique_whatsapp',{area:S.area});
});
tbox.addEventListener('input',e=>{
  if(e.target.id==='cid'){S.cidade=e.target.value;const n=$('[data-act=next]',tbox);if(n)n.disabled=!(S.cidade.trim().length>=2&&S.pref)}
  if(e.target.id==='tl'){e.target.value=mask(e.target.value);S.tel=e.target.value}
  if(e.target.id==='nm')S.nome=e.target.value;
});
function clearAll(){try{localStorage.removeItem('om_triagem')}catch(e){}Object.assign(S,{step:0,perfil:null,assunto:null,area:null,fase:null,docs:[],cidade:'',pref:null,nome:'',tel:''});$('#clearAll').style.display='none';render()}
$('#clearAll').addEventListener('click',clearAll);
render();

/* ===== Trabalhista: linha do tempo arrastavel ===== */
(function(){
  const stops=[['clock','Dia da demissão','Guarde conversas, contrato e contracheques.'],['briefcase','Saldo de salário e aviso prévio','Confira se entraram no acerto.'],['sun','Férias e 13º proporcionais','Valores proporcionais ao tempo trabalhado.'],['shield-check','FGTS','Veja se os depósitos estão em dia.'],['file-text','Pagamento das verbas','O pagamento tem prazo previsto em lei.'],['hourglass-medium','Atrasou?','Pode haver multa do art. 477 da CLT. Procure um advogado.']];
  const wrap=$('#tlstops'),track_=$('#tltrack'),dot=$('#tldot'),fill=$('#tlfill');
  wrap.innerHTML=stops.map(s=>'<div class="tl-stop">'+ic(s[0])+'<p><b>'+s[1]+'</b><span>'+s[2]+'</span></p></div>').join('');
  const items=$$('.tl-stop',wrap);let v=0,touched=false,drag=false;
  function set(n){v=clamp(n,0,1);dot.style.left=(v*100)+'%';fill.style.transform='scaleX('+v+')';const k=Math.round(v*5);dot.setAttribute('aria-valuenow',k);items.forEach((it,i)=>it.classList.toggle('on',i<=k&&(i===0||v>=(i-.35)/5)))}
  function fromEvent(e){const r=track_.getBoundingClientRect();set((e.clientX-r.left)/r.width)}
  track_.addEventListener('pointerdown',e=>{touched=true;drag=true;track_.setPointerCapture(e.pointerId);fromEvent(e)});
  track_.addEventListener('pointermove',e=>{if(drag)fromEvent(e)});
  ['pointerup','pointercancel'].forEach(t=>track_.addEventListener(t,()=>drag=false));
  dot.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){touched=true;set(v+.2)}if(e.key==='ArrowLeft'){touched=true;set(v-.2)}});
  set(0);
  const demo=new IntersectionObserver(es=>{if(es[0].isIntersecting){demo.disconnect();if(reduce)return;let t0=performance.now();(function f(n){if(touched)return;const p=(n-t0)/2600;if(p>=1){set(0);return}set(Math.sin(p*Math.PI)*.45);requestAnimationFrame(f)})(t0)}},{threshold:.6});demo.observe(track_);
})();

/* ===== Previdenciario: caminho ===== */
(function(){
  const nodes=[['file-text','Pedido','Reunimos os documentos e organizamos o pedido.'],['hourglass-medium','Resposta','Analisamos a decisão do INSS com calma.'],['x','Negativa?','Entendemos o motivo antes de escolher o caminho.'],['arrows-clockwise','Recurso','Quando cabível, apresentamos o recurso.'],['scroll','Ação judicial','Se for o melhor caminho, levamos o caso à Justiça.']];
  const box=$('#pth'),fill=$('#pthfill');
  box.insertAdjacentHTML('beforeend',nodes.map((n,i)=>'<button class="pn'+(i===0?' on':'')+'" data-i="'+i+'"><span class="no">'+ic(n[0])+'</span><span><b>'+n[1]+'</b><span class="det"><div>'+n[2]+'</div></span></span></button>').join(''));
  const btns=$$('.pn',box);
  function pick(i){btns.forEach((b,j)=>b.classList.toggle('on',j<=i&&(j===i||true)));btns.forEach((b,j)=>{b.querySelector('.det').style.gridTemplateRows=j===i?'1fr':'0fr'});
    setTimeout(()=>{const last=btns[i],top=btns[0].offsetTop+22,end=last.offsetTop+22;fill.style.transform='none';fill.style.height=(end-top)+'px';fill.parentNode.style.top=(top+4)+'px'},50)}
  btns.forEach((b,i)=>b.addEventListener('click',()=>pick(i)));pick(0);
  fill.style.transform='none';fill.style.transition='height .7s cubic-bezier(.3,.8,.2,1)';
})();

/* ===== Saude: portas ===== */
$$('.door').forEach(d=>{const t=()=>d.classList.toggle('f');d.addEventListener('click',t);d.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t()}})});

/* ===== Civel: checklist ===== */
(function(){
  const items=['Bilhete ou comprovante da compra','Comprovantes de gastos extras','Prints das conversas com a companhia','Fotos ou protocolos de atendimento'];
  const box=$('#chk'),ring=$('#chkring'),tx=$('#chktx');
  box.innerHTML=items.map((t,i)=>'<button class="chip" data-i="'+i+'">'+ic('check')+esc(t)+'</button>').join('');
  box.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;b.classList.toggle('on');const n=$$('.chip.on',box).length;ring.style.strokeDashoffset=176*(1-n/items.length);tx.textContent=n===0?'Nenhum item marcado ainda.':n<items.length?n+' de '+items.length+' itens. Continue juntando.':'Tudo reunido. Já dá para conversar com um advogado.'});
})();

/* ===== Direitos: cartoes que viram + arraste com mouse ===== */
(function(){
  const hs=$('#hs');let down=false,sx=0,sl=0,moved=false;
  $$('.dc',hs).forEach(c=>{const flip=()=>{if(moved)return;c.classList.toggle('f')};c.addEventListener('click',e=>{if(e.target.closest('a'))return;flip()});c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}})});
  hs.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=hs.scrollLeft;hs.style.scrollSnapType='none'});
  addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;if(Math.abs(dx)>6)moved=true;hs.scrollLeft=sl-dx});
  addEventListener('pointerup',()=>{if(!down)return;down=false;hs.style.scrollSnapType='';setTimeout(()=>moved=false,50)});
})();

/* ===== Metodo: trilho ligado a rolagem ===== */
const railEl=$('#rail'),stEls=$$('.st');
function railUpdate(){
  if(!railEl)return;const r=railEl.getBoundingClientRect(),vh=innerHeight;
  const p=clamp((vh*.62-r.top)/(r.height),0,1);railEl.style.setProperty('--p',p);
  $('.line b',railEl).style.transform='scaleY('+p+')';
  stEls.forEach(s=>s.classList.toggle('on',s.getBoundingClientRect().top<vh*.66));
}

/* ===== equipe: parallax ===== */
const ph=$('#ph');
function parallax(){if(!ph||reduce)return;const r=ph.getBoundingClientRect(),c=r.top+r.height/2-innerHeight/2;ph.style.setProperty('--py',clamp(c*.07,-24,24)+'px')}

/* ===== nota Google: contador ===== */
(function(){const n=$('#nota');if(!n)return;const o=new IntersectionObserver(es=>{if(!es[0].isIntersecting)return;o.disconnect();if(reduce)return;const t0=performance.now();(function f(t){const p=clamp((t-t0)/1400,0,1);n.textContent=(5*(1-Math.pow(1-p,3))).toFixed(1).replace('.',',');if(p<1)requestAnimationFrame(f)})(t0)},{threshold:.6});o.observe(n)})();

/* ===== FAQ em conversa ===== */
(function(){
  const ans=$$('#fqplain p').map(p=>p.textContent);const items=$$('.fqi');
  function show(it,i,instant){const a=$('.a',it),tx=$('.tx',a);if(!a.hidden){a.hidden=true;return}
    $$('.a').forEach(x=>x.hidden=true);a.hidden=false;if(instant||reduce){tx.textContent=ans[i];return}
    tx.innerHTML='<span class="dots"><i></i><i></i><i></i></span>';let k=0;const txt=ans[i];
    setTimeout(()=>{tx.textContent='';tx.classList.add('caret');const t=setInterval(()=>{if(a.hidden){clearInterval(t);return}tx.textContent=txt.slice(0,++k);if(k>=txt.length){clearInterval(t);tx.classList.remove('caret')}},16)},650)}
  items.forEach((it,i)=>$('.q',it).addEventListener('click',()=>show(it,i)));
  const o=new IntersectionObserver(es=>{if(es[0].isIntersecting){o.disconnect();show(items[0],0)}},{threshold:.5});o.observe($('#faq'));
})();

/* ===== mascote nas bordas ===== */
const mas=$('#mascot'),bub=$('#bub'),masImg=$('img',mas);
let mOn=false;
const runs=[{top:false,dir:1},{top:true,dir:-1},{top:false,dir:-1},{top:true,dir:1}];
let ri=0,mx=-60,mstate='walk',mtalk=0;
function mascotSay(){const s=$('#'+curSec);bub.textContent=(s&&s.dataset.m)||'Bem-vindo(a)!'}
function mascotStart(){if(reduce||mOn)return;mOn=true;mascotSay();let last=performance.now();
  (function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;const r=runs[ri],W=innerWidth,H=innerHeight,SZ=46,hide=document.hidden;
    const trg=$('#triagem').getBoundingClientRect(),inTri=trg.top<H*.55&&trg.bottom>H*.45&&curSec==='triagem';
    mas.classList.toggle('show',!inTri&&!hide);
    const y=r.top?76:H-SZ-14;
    if(mstate==='walk'){mx+=r.dir*68*dt;const stop=r.dir>0?W-SZ-10:10;if((r.dir>0&&mx>=stop)||(r.dir<0&&mx<=stop)){mx=stop;mstate='talk';mtalk=t;mascotSay()}}
    else if(mstate==='talk'){if(t-mtalk>3600)mstate='exit'}
    else if(mstate==='exit'){mx+=r.dir*68*dt;if(mx>W+70||mx<-70){ri=(ri+1)%4;const n=runs[ri];mx=n.dir>0?-60:W+60;mstate='walk'}}
    mas.className=(mas.classList.contains('show')?'show ':'')+(mstate==='talk'?'talk ':'')+(r.top?'top ':'')+(mx<W/2?'edgeL':'edgeR');
    mas.style.transform='translate3d('+mx+'px,'+y+'px,0)';masImg.style.scale=r.dir;
    requestAnimationFrame(loop)})(last)}

/* ===== limpar dados ===== */
if(!stored)$('#clearAll').style.display='none';
onScroll();
})();
