(function(){
  /* ---------- Carrousel de la gamme ---------- */
  var S=[
    {k:'fell',fr:'Fell N°2',ar:'فل',info:'Pâtes courtes · 500 g',c1:'#1F8B33',c2:'#06240F',acc:'#F3DFA8',f:'tube'},
    {k:'plume',fr:'Plume',ar:'بيني',info:'Pâtes courtes · 500 g',c1:'#14606E',c2:'#03161B',acc:'#9FE3EE',f:'penne'},
    {k:'radiatore',fr:'Radiatore',ar:'راديا توري',info:'Al dente en 10 min · 400 g',c1:'#5A4718',c2:'#0D0A03',acc:'#E9C46A',f:'radia'},
    {k:'gnocchetti',fr:'Gnocchetti',ar:'نيوشيتي',info:'Pâtes en bronze · 13 min · 500 g',c1:'#A7823C',c2:'#2A1C07',acc:'#FFE7B0',f:'gnoc'},
    {k:'tlitli',fr:'Tlitli',ar:'تليتلي',info:'Pâtes traditionnelles · 500 g',c1:'#D9771D',c2:'#3A1503',acc:'#FFE1B8',f:'tlitli'},
    {k:'trida',fr:'Trida',ar:'تريدة',info:'Pâtes traditionnelles · 500 g',c1:'#1C7A44',c2:'#0B1F10',acc:'#F2D27A',f:'carre'},
    {k:'plomb',fr:'Plomb',ar:'محمصة',info:'Pâtes traditionnelles · 500 g',c1:'#3AA047',c2:'#0A2B10',acc:'#E9F5C9',f:'bille'},
    {k:'cannelloni',fr:'Cannelloni',ar:'كانلوني',info:'25 min au four · 250 g',c1:'#1D5560',c2:'#040F12',acc:'#F2C96B',f:'cann'},
    {k:'couscous-moyen',fr:'Couscous moyen',ar:'كسكسي متوسط',info:'Couscous · 1 kg',c1:'#C08A2A',c2:'#3A2206',acc:'#FFF0C2',f:'grain',r:2},
    {k:'couscous-fin',fr:'Couscous fin',ar:'كسكسي رقيق',info:'Couscous · 1 kg',c1:'#B3203A',c2:'#2B050D',acc:'#FFD6DC',f:'grain',r:1.3}
  ];
  var scene=document.getElementById('scene'),stage=document.getElementById('stage'),fond=document.getElementById('fond'),vague=document.getElementById('vague');
  var tAr=document.getElementById('tAr'),tNom=document.getElementById('tNom'),tInfo=document.getElementById('tInfo'),txt=document.querySelector('.sc-texte');
  var piste=document.getElementById('piste'),pts=document.getElementById('pts'),num=document.getElementById('num'),ast=document.getElementById('astuce');
  var ciel=document.getElementById('ciel'),cc=ciel.getContext('2d'),cv=document.getElementById('pluie'),ctx=cv.getContext('2d');
  var reduit=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr=Math.min(window.devicePixelRatio||1,2),W=0,H=0,i0=0,occupe=false,auto=null,pause=false;
  S.forEach(function(s){var im=new Image();im.src='../assets/img/p/'+s.k+'.webp'});
  function grad(s){return 'radial-gradient(120% 80% at 60% 45%,'+s.c1+' 0%,'+s.c2+' 75%)'}
  function taille(){W=scene.clientWidth;H=scene.clientHeight;[ciel,cv].forEach(function(c){c.width=W*dpr;c.height=H*dpr});cc.setTransform(dpr,0,0,dpr,0,0);ctx.setTransform(dpr,0,0,dpr,0,0);pile=new Array(Math.ceil(W/COL)+1).fill(0)}
  /* formes */
  var DORE=['#F2C862','#EBB94C','#F6D47A','#E3AA3C'];
  function rr(c,x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h)}
  function forme(c,p){
    var f=p.f;c.fillStyle=p.c;c.strokeStyle='rgba(110,65,0,.4)';c.lineWidth=1;
    if(f==='grain'||f==='bille'){c.beginPath();c.arc(p.x,p.y,p.r,0,6.29);c.fill();if(f==='bille'){c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.arc(p.x-p.r*.35,p.y-p.r*.35,p.r*.35,0,6.29);c.fill()}return}
    c.save();c.translate(p.x,p.y);c.rotate(p.a);var s=p.s||1;c.scale(s,s);
    if(f==='tube'){rr(c,-8,-6.5,16,13,3);c.fill();c.stroke();c.fillStyle='#FBE7A6';c.beginPath();c.ellipse(8,0,3.2,6.5,0,0,6.29);c.fill();c.fillStyle='#8A5A12';c.beginPath();c.ellipse(8,0,1.6,3,0,0,6.29);c.fill()}
    else if(f==='penne'){c.beginPath();c.moveTo(-10,-5);c.lineTo(14,-5);c.lineTo(10,5);c.lineTo(-14,5);c.closePath();c.fill();c.stroke();c.strokeStyle='rgba(140,85,0,.35)';c.beginPath();for(var x=-9;x<12;x+=4){c.moveTo(x,-4);c.lineTo(x-3,4)}c.stroke()}
    else if(f==='radia'){rr(c,-11,-4,22,8,3);c.fill();c.strokeStyle='rgba(140,85,0,.55)';c.lineWidth=2.2;c.beginPath();for(var x2=-9;x2<=9;x2+=3.6){c.moveTo(x2,-4);c.lineTo(x2,-9)}c.stroke();c.lineWidth=1;c.strokeStyle='rgba(110,65,0,.4)';rr(c,-11,-4,22,8,3);c.stroke()}
    else if(f==='gnoc'){c.beginPath();c.ellipse(0,0,13,7,0,0,6.29);c.fill();c.stroke();c.strokeStyle='rgba(140,85,0,.4)';c.beginPath();for(var x3=-9;x3<=9;x3+=3){c.moveTo(x3,-6);c.quadraticCurveTo(x3+2,0,x3,6)}c.stroke()}
    else if(f==='tlitli'){c.beginPath();c.ellipse(0,0,6,2.6,0,0,6.29);c.fill()}
    else if(f==='carre'){c.beginPath();var z=6;for(var t=0;t<4;t++){c.lineTo(-z+t*z/1.5,-z-(t%2));}c.closePath();rr(c,-z,-z,z*2,z*2,1.5);c.fill();c.strokeStyle='rgba(140,85,0,.45)';c.setLineDash([1.5,1.5]);c.strokeRect(-z,-z,z*2,z*2);c.setLineDash([])}
    else if(f==='cann'){rr(c,-22,-9,44,18,6);c.fill();c.stroke();c.fillStyle='#FBE7A6';c.beginPath();c.ellipse(22,0,4,9,0,0,6.29);c.fill();c.fillStyle='#B07A20';c.beginPath();c.ellipse(22,0,2.4,6.5,0,0,6.29);c.fill()}
    c.restore();
  }
  function couleur(f){return f==='grain'?['#F1CF5E','#E8BE45','#F7DC80','#DDB03C'][(Math.random()*4)|0]:DORE[(Math.random()*4)|0]}
  /* fond flottant */
  var F=[];
  function semeFond(){
    var s=S[i0];F=[];var n=s.f==='grain'?120:s.f==='cann'?10:s.f==='tlitli'?70:34;
    for(var k=0;k<n;k++)F.push({f:s.f,x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:-.15-Math.random()*.35,a:Math.random()*6.28,va:(Math.random()-.5)*.01,s:.9+Math.random()*1.6,r:(s.r||3)*(1+Math.random()),c:couleur(s.f),o:.12+Math.random()*.25});
  }
  /* versement */
  var P=[],pile=[],COL=5,flux=0;
  var PAR={tube:{n:4,h:4.6},penne:{n:4,h:4.2},radia:{n:3,h:5},gnoc:{n:3,h:5.2},tlitli:{n:10,h:1.2},carre:{n:5,h:3},bille:{n:8,h:2.8},cann:{n:1,h:9},grain:{n:14,h:1.2}};
  function verse(){
    var s=S[i0],q=PAR[s.f],r=stage.getBoundingClientRect(),o=scene.getBoundingClientRect();
    for(var k=0;k<q.n;k++){
      P.push({f:s.f,x:r.left-o.left+r.width*(.35+Math.random()*.3),y:r.top-o.top+r.height*.12,vx:(Math.random()-.5)*6,vy:-4-Math.random()*4,a:Math.random()*6.28,va:(Math.random()-.5)*.3,r:(s.r||3.4)*(.8+Math.random()*.5),c:couleur(s.f),h:q.h,s:1,repos:false});
    }
    if(P.length>1400)P.splice(0,P.length-1400);
  }
  function boucle(){
    cc.clearRect(0,0,W,H);
    for(var k=0;k<F.length;k++){var p=F[k];p.x+=p.vx;p.y+=p.vy;p.a+=p.va;if(p.y<-30){p.y=H+30;p.x=Math.random()*W}cc.globalAlpha=p.o;forme(cc,p)}
    cc.globalAlpha=1;
    ctx.clearRect(0,0,W,H);
    if(flux>0){verse();flux--}
    var sol=H-(W<900?112:40);
    for(var m=0;m<P.length;m++){
      var q=P[m];
      if(!q.repos){
        q.vy+=.34;q.x+=q.vx;q.y+=q.vy;q.a+=q.va;q.vx*=.99;
        if(q.x<6){q.x=6;q.vx*=-.5}if(q.x>W-6){q.x=W-6;q.vx*=-.5}
        var col=Math.max(0,Math.min(pile.length-1,(q.x/COL)|0)),fl=sol-pile[col];
        if(q.y>=fl&&q.vy>0){
          if(q.vy>3){q.y=fl;q.vy*=-.3;q.vx+=(Math.random()-.5)*2}
          else{var g=pile[col-1],d=pile[col+1];
            if(g!==undefined&&g<pile[col]-5){q.x-=COL}else if(d!==undefined&&d<pile[col]-5){q.x+=COL}
            else{q.y=fl;q.repos=true;if(q.f==='cann'){for(var t=-3;t<=3;t++)if(pile[col+t]!==undefined)pile[col+t]+=q.h/2}else pile[col]+=q.h}}
        }
      }
      forme(ctx,q);
    }
    requestAnimationFrame(boucle);
  }
  /* changement de produit */
  pts.innerHTML=S.map(function(s,k){return '<button type="button" aria-label="'+s.fr+'"></button>'}).join('');
  var B=pts.querySelectorAll('button');
  function remplis(s){
    tAr.textContent=s.ar;tNom.textContent=s.fr;tInfo.textContent=s.info;
    var t='';for(var k=0;k<4;k++)t+='<span>'+s.ar+'</span><span>'+s.fr+'</span>';piste.innerHTML=t+t;
    scene.style.setProperty('--acc',s.acc);
    B.forEach(function(b,k){b.setAttribute('aria-current',k===i0)});
    num.textContent=String(i0+1).padStart(2,'0')+' / '+String(S.length).padStart(2,'0');
  }
  function paquet(s,cls){
    var b=document.createElement('button');b.className='sc-paq '+(cls||'');b.setAttribute('aria-label','Verser le paquet '+s.fr);
    b.innerHTML='<img src="../assets/img/p/'+s.k+'.webp" alt="Paquet El Baraka '+s.fr+'">';
    b.addEventListener('click',function(){b.classList.remove('verse');void b.offsetWidth;b.classList.add('verse');flux+=reduit?2:28;ast.style.opacity=0;arrete()});
    return b;
  }
  function va(n,sens){
    if(occupe||n===i0)return;occupe=true;
    var s=S[(n+S.length)%S.length];n=(n+S.length)%S.length;sens=sens||(n>i0?1:-1);
    var vieux=stage.querySelector('.sc-paq');
    if(vieux){vieux.classList.remove('entre','entreG');vieux.classList.add(sens>0?'sortG':'sortD')}
    txt.classList.add('sort');
    vague.style.background=grad(s);vague.classList.remove('go');void vague.offsetWidth;vague.classList.add('go');
    setTimeout(function(){
      i0=n;P=[];pile.fill(0);flux=0;
      if(vieux)vieux.remove();stage.appendChild(paquet(s,sens>0?'entre':'entreG'));
      remplis(s);semeFond();txt.classList.remove('sort');
    },380);
    setTimeout(function(){fond.style.background=grad(s);vague.classList.remove('go');occupe=false},950);
  }
  function lance(){if(reduit)return;arrete();auto=setInterval(function(){if(!pause&&!document.hidden)va(i0+1,1)},5200)}
  function arrete(){if(auto){clearInterval(auto);auto=null}}
  document.getElementById('next').addEventListener('click',function(){va(i0+1,1);lance()});
  document.getElementById('prev').addEventListener('click',function(){va(i0-1,-1);lance()});
  B.forEach(function(b,k){b.addEventListener('click',function(){va(k);lance()})});
  var x0=null;
  scene.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  scene.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50){va(i0+(dx<0?1:-1),dx<0?1:-1);lance()}x0=null});
  document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){va(i0+1,1)}if(e.key==='ArrowLeft'){va(i0-1,-1)}});
  new IntersectionObserver(function(en){pause=!en[0].isIntersecting}).observe(scene);
  taille();window.addEventListener('resize',taille);
  fond.style.background=grad(S[0]);remplis(S[0]);stage.appendChild(paquet(S[0],'entre'));semeFond();
  requestAnimationFrame(boucle);lance();

  /* ---------- La table ---------- */
  var tab=document.getElementById('tableau'),out=document.getElementById('conv'),qte=document.getElementById('qte');
  var MAX=14,n=6,plat='couscous',as=[];
  for(var i=0;i<MAX;i++){var e=document.createElement('div');e.className='assiette';tab.appendChild(e);as.push(e)}
  var R={couscous:{g:125,pk:1000,nom:'couscous moyen 1 kg'},pates:{g:100,pk:500,nom:'pâtes 500 g'},soupe:{g:30,pk:500,nom:'Fell N°2 500 g'}};
  function place(){
    as.forEach(function(e,i){
      if(i<n){var a=-Math.PI/2+i*2*Math.PI/n;e.style.left=(50+40*Math.cos(a))+'%';e.style.top=(50+40*Math.sin(a))+'%';e.classList.add('on')}
      else e.classList.remove('on');
    });
    var r=R[plat],g=n*r.g,k=Math.ceil(g/r.pk);
    out.textContent=n;
    qte.innerHTML=(g>=1000?(g/1000).toLocaleString('fr-FR')+' kg':g+' g')+'<small>'+k+' paquet'+(k>1?'s':'')+' de '+r.nom+'</small>';
  }
  document.getElementById('moins').addEventListener('click',function(){n=Math.max(1,n-1);place()});
  document.getElementById('plus').addEventListener('click',function(){n=Math.min(MAX,n+1);place()});
  document.querySelectorAll('[data-p]').forEach(function(b){b.addEventListener('click',function(){
    plat=b.getAttribute('data-p');document.querySelectorAll('[data-p]').forEach(function(x){x.setAttribute('aria-pressed',x===b)});place();
  })});
  place();
})();
