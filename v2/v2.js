(function(){
  /* ---------- Le paquet qui s'ouvre : toute la gamme ---------- */
  var scene=document.getElementById('scene'),cv=document.getElementById('pluie'),ctx=cv.getContext('2d');
  var pq=document.getElementById('paquet'),nb=document.getElementById('nb'),lib=document.getElementById('lib');
  var rej=document.getElementById('rejouer'),ast=document.getElementById('astuce'),info=document.querySelector('.ouvre-info');
  var reduit=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr=Math.min(window.devicePixelRatio||1,2),W=0,H=0,P=[],pile=[],COL=5,total=0,ouvert=false,raf=null,flux=0;
  var PR={
    fell:{fr:'Fell N°2',ar:'فل',img:'fell-n2.webp',f:'tube',par:4,flux:110,h:4.6,u:'pièces de Fell N°2'}
  };
  var cur='fell';
  function visuel(k){
    var p=PR[k];
    pq.className='paquet'+(p.pk&&p.pk.indexOf('pk--plat')>-1?' paquet--plat':'')+(p.pk&&p.pk.indexOf('pk--long')>-1?' paquet--long':'');
    pq.setAttribute('aria-label','Ouvrir le paquet de '+p.fr);
    pq.innerHTML=p.img?'<img src="../assets/img/'+p.img+'" alt="Paquet El Baraka '+p.fr+'" width="560" height="830">'
      :'<div class="pk '+(p.pk||'')+' pk-hero" aria-hidden="true"><div class="pk-logo"><img src="../assets/img/logo-blanc.svg" alt=""></div><div class="pk-band">'+(p.ar?'<span class="ar">'+p.ar+'</span>':'')+'<span>'+p.fr+'</span></div></div>';
  }
  function taille(){
    W=scene.clientWidth;H=scene.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    pile=new Array(Math.ceil(W/COL)+1).fill(0);P.forEach(function(p){p.repos=false});
  }
  taille();window.addEventListener('resize',taille);
  var DORE=['#F2C862','#EBB94C','#F6D47A','#E3AA3C'],SEM=['#F1CF5E','#E8BE45','#F7DC80','#DDB03C'];
  function source(){
    var r=pq.getBoundingClientRect(),s=scene.getBoundingClientRect();
    return {x:r.left-s.left+r.width*0.30,y:r.top-s.top+r.height*0.80};
  }
  function verse(n){
    var o=source(),p=PR[cur];
    for(var i=0;i<n;i++){
      var q={x:o.x+(Math.random()-.5)*30,y:o.y+(Math.random()-.5)*16,vx:(Math.random()-.6)*2.4,vy:Math.random()*1.5+.5,
        a:Math.random()*6.28,va:(Math.random()-.5)*.3,f:p.f,h:p.h,repos:false,c:DORE[(Math.random()*4)|0]};
      if(p.f==='tube'){q.l=15+Math.random()*5;q.d=12+Math.random()*2}
      if(p.f==='penne'){q.l=26+Math.random()*6;q.d=10}
      if(p.f==='baton'){q.l=70+Math.random()*30;q.d=3.2;q.va*=.4}
      if(p.f==='roue'){q.r=9+Math.random()*2}
      if(p.f==='feuille'){q.l=58;q.d=30;q.va*=.3;q.vx*=.6}
      if(p.f==='bille'){q.r=3.2+Math.random()*1.2}
      if(p.f==='grain'){q.r=p.r*(.8+Math.random()*.5);q.c=SEM[(Math.random()*4)|0];q.vx*=1.4}
      if(p.f==='poudre'){q.r=1+Math.random()*1.6;q.c='rgba(255,255,250,'+(.55+Math.random()*.4)+')';q.vx*=1.8;q.vy*=.5;q.flot=Math.random()<.35;q.vie=1}
      P.push(q);total++;
    }
    if(P.length>1600){P.splice(0,P.length-1600)}
    nb.textContent=total.toLocaleString('fr-FR');
  }
  function rr(x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h)}
  function dessine(p){
    if(p.f==='grain'||p.f==='bille'||p.f==='poudre'){
      ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.29);ctx.fill();
      if(p.f==='bille'){ctx.fillStyle='rgba(255,255,255,.45)';ctx.beginPath();ctx.arc(p.x-p.r*.35,p.y-p.r*.35,p.r*.35,0,6.29);ctx.fill()}
      return;
    }
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);
    ctx.strokeStyle='rgba(120,70,0,.45)';ctx.lineWidth=1;ctx.fillStyle=p.c;
    if(p.f==='tube'){
      var l=p.l,d=p.d;rr(-l/2,-d/2,l,d,3);ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(150,95,10,.35)';ctx.beginPath();ctx.moveTo(-l/2+3,-d/4);ctx.lineTo(l/2-4,-d/4);ctx.moveTo(-l/2+3,d/4);ctx.lineTo(l/2-4,d/4);ctx.stroke();
      ctx.fillStyle='#FBE7A6';ctx.beginPath();ctx.ellipse(l/2,0,3.4,d/2,0,0,6.29);ctx.fill();
      ctx.fillStyle='#8A5A12';ctx.beginPath();ctx.ellipse(l/2,0,1.8,d/4,0,0,6.29);ctx.fill();
    }else if(p.f==='penne'){
      var L=p.l,D=p.d;ctx.beginPath();ctx.moveTo(-L/2+5,-D/2);ctx.lineTo(L/2,-D/2);ctx.lineTo(L/2-5,D/2);ctx.lineTo(-L/2,D/2);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(150,95,10,.4)';ctx.beginPath();for(var s=-L/2+6;s<L/2-4;s+=4){ctx.moveTo(s,-D/2+1);ctx.lineTo(s-3,D/2-1)}ctx.stroke();
    }else if(p.f==='baton'){
      rr(-p.l/2,-p.d/2,p.l,p.d,2);ctx.fill();
      ctx.fillStyle='rgba(255,240,190,.5)';ctx.fillRect(-p.l/2+2,-p.d/2+.5,p.l-4,1);
    }else if(p.f==='roue'){
      var R=p.r;ctx.lineWidth=3.2;ctx.strokeStyle=p.c;ctx.beginPath();ctx.arc(0,0,R,0,6.29);ctx.stroke();
      ctx.lineWidth=2;ctx.beginPath();for(var k=0;k<6;k++){var t=k*Math.PI/3;ctx.moveTo(0,0);ctx.lineTo(Math.cos(t)*R,Math.sin(t)*R)}ctx.stroke();
      ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(0,0,2.6,0,6.29);ctx.fill();
      ctx.lineWidth=1;ctx.strokeStyle='rgba(120,70,0,.4)';ctx.beginPath();ctx.arc(0,0,R+1.6,0,6.29);ctx.stroke();
    }else if(p.f==='feuille'){
      var lw=p.l,ld=p.d;ctx.beginPath();ctx.moveTo(-lw/2,-ld/2);
      for(var x=-lw/2;x<=lw/2;x+=6)ctx.lineTo(x,-ld/2+(Math.round(x/6)%2?2.5:-2.5));
      ctx.lineTo(lw/2,ld/2);for(x=lw/2;x>=-lw/2;x-=6)ctx.lineTo(x,ld/2+(Math.round(x/6)%2?2.5:-2.5));
      ctx.closePath();ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(150,95,10,.25)';ctx.beginPath();ctx.moveTo(-lw/2+4,-ld/6);ctx.lineTo(lw/2-4,-ld/6);ctx.moveTo(-lw/2+4,ld/6);ctx.lineTo(lw/2-4,ld/6);ctx.stroke();
    }
    ctx.restore();
  }
  function pas(){
    ctx.clearRect(0,0,W,H);
    if(flux>0){verse(PR[cur].par);flux--}
    var sol=H-(W<800?112:58),vivant=[];
    for(var i=0;i<P.length;i++){
      var p=P[i];
      if(p.f==='poudre'&&p.flot){ // nuage de farine qui s'envole
        p.vy-=.02;p.vx*=.98;p.x+=p.vx;p.y+=p.vy;p.r+=.06;p.vie-=.008;
        if(p.vie<=0)continue;
        ctx.globalAlpha=Math.max(0,p.vie)*.6;dessine(p);ctx.globalAlpha=1;vivant.push(p);continue;
      }
      if(!p.repos){
        var lourd=p.f==='poudre'?.12:p.f==='feuille'?.2:.32;
        p.vy+=lourd;p.vx*=p.f==='feuille'?.98:.995;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;
        if(p.f==='feuille')p.vx+=Math.sin(p.y/40)*.15;
        if(p.x<6){p.x=6;p.vx*=-.5}if(p.x>W-6){p.x=W-6;p.vx*=-.5}
        var c=Math.max(0,Math.min(pile.length-1,(p.x/COL)|0)),f=sol-pile[c];
        if(p.y>=f){
          if(p.vy>3&&p.f!=='poudre'){p.y=f;p.vy*=-.32;p.vx+=(Math.random()-.5)*2;p.va*=.6}
          else{
            var g=pile[c-1]===undefined?1e9:pile[c-1],d=pile[c+1]===undefined?1e9:pile[c+1],pente=(p.f==='grain'||p.f==='poudre')?3:6;
            if(g<pile[c]-pente){p.x-=COL;p.vy=0}
            else if(d<pile[c]-pente){p.x+=COL;p.vy=0}
            else{
              p.y=f;p.repos=true;
              if(p.f==='baton'||p.f==='feuille'){p.a=(Math.random()-.5)*.35;var w=Math.round((p.l*.6)/COL/2);for(var k=-w;k<=w;k++){if(pile[c+k]!==undefined)pile[c+k]+=p.h}}
              else pile[c]+=p.h;
            }
          }
        }
      }
      dessine(p);vivant.push(p);
    }
    P=vivant;
    raf=requestAnimationFrame(pas);
  }
  function ouvre(){
    if(!ouvert){
      ouvert=true;pq.classList.add('ouvert');ast.style.display='none';
      setTimeout(function(){flux=reduit?0:PR[cur].flux;if(reduit){verse(PR[cur].par*30)}info.classList.add('on')},420);
    }else{
      pq.classList.remove('secoue');void pq.offsetWidth;pq.classList.add('secoue');flux+=Math.round(PR[cur].flux/4);
    }
    if(!raf)pas();
  }
  function ferme(){
    P=[];total=0;nb.textContent=0;pile.fill(0);ouvert=false;flux=0;
    pq.classList.remove('ouvert');info.classList.remove('on');ast.style.display='';
  }
  pq.addEventListener('click',ouvre);
  rej.addEventListener('click',ferme);
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
