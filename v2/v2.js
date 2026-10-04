(function(){
  /* ---------- Le paquet qui s'ouvre ---------- */
  var scene=document.getElementById('scene'),cv=document.getElementById('pluie'),ctx=cv.getContext('2d');
  var pq=document.getElementById('paquet'),cpt=document.getElementById('compteur'),nb=document.getElementById('nb');
  var rej=document.getElementById('rejouer'),ast=document.getElementById('astuce'),info=document.querySelector('.ouvre-info');
  var reduit=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr=Math.min(window.devicePixelRatio||1,2),W=0,H=0,P=[],pile=[],COL=6,total=0,ouvert=false,raf=null,flux=0;
  function taille(){
    W=scene.clientWidth;H=scene.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    pile=new Array(Math.ceil(W/COL)+1).fill(0);P.forEach(function(p){p.repos=false});
  }
  taille();window.addEventListener('resize',taille);
  var teintes=['#F2C862','#EBB94C','#F6D47A','#E3AA3C'];
  function source(){
    var r=pq.getBoundingClientRect(),s=scene.getBoundingClientRect();
    // ouverture du paquet basculé : vers le bas-gauche du visuel
    return {x:r.left-s.left+r.width*0.30,y:r.top-s.top+r.height*0.80};
  }
  function verse(n){
    var o=source();
    for(var i=0;i<n;i++){
      P.push({x:o.x+(Math.random()-.5)*30,y:o.y+(Math.random()-.5)*16,vx:(Math.random()-.6)*2.4,vy:Math.random()*1.5+.5,
        a:Math.random()*6.28,va:(Math.random()-.5)*.3,l:15+Math.random()*5,d:12+Math.random()*2,c:teintes[(Math.random()*4)|0],repos:false});
      total++;
    }
    if(P.length>800){P.splice(0,P.length-800)}
    nb.textContent=total;
  }
  function tube(p){
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);
    var l=p.l,d=p.d;
    ctx.fillStyle=p.c;ctx.strokeStyle='rgba(120,70,0,.45)';ctx.lineWidth=1;
    ctx.beginPath();ctx.roundRect?ctx.roundRect(-l/2,-d/2,l,d,3):ctx.rect(-l/2,-d/2,l,d);ctx.fill();ctx.stroke();
    // stries
    ctx.strokeStyle='rgba(150,95,10,.35)';ctx.beginPath();ctx.moveTo(-l/2+3,-d/4);ctx.lineTo(l/2-4,-d/4);ctx.moveTo(-l/2+3,d/4);ctx.lineTo(l/2-4,d/4);ctx.stroke();
    // trou à l'extrémité
    ctx.fillStyle='#FBE7A6';ctx.beginPath();ctx.ellipse(l/2,0,3.4,d/2,0,0,6.29);ctx.fill();
    ctx.fillStyle='#8A5A12';ctx.beginPath();ctx.ellipse(l/2,0,1.8,d/4,0,0,6.29);ctx.fill();
    ctx.restore();
  }
  function pas(){
    ctx.clearRect(0,0,W,H);
    if(flux>0){verse(4);flux--}
    var sol=H-(W<800?112:58);
    for(var i=0;i<P.length;i++){
      var p=P[i];
      if(!p.repos){
        p.vy+=.32;p.vx*=.995;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;
        if(p.x<6){p.x=6;p.vx*=-.5}if(p.x>W-6){p.x=W-6;p.vx*=-.5}
        var c=Math.max(0,Math.min(pile.length-1,(p.x/COL)|0)),f=sol-pile[c];
        if(p.y>=f){
          if(p.vy>3){p.y=f;p.vy*=-.32;p.vx+=(Math.random()-.5)*2;p.va*=.6}
          else{
            // glisse vers la colonne voisine plus basse
            var g=pile[c-1]===undefined?1e9:pile[c-1],d=pile[c+1]===undefined?1e9:pile[c+1];
            if(g<pile[c]-6){p.x-=COL;p.vy=0;continue}
            if(d<pile[c]-6){p.x+=COL;p.vy=0;continue}
            p.y=f;p.repos=true;pile[c]+=4.6;
          }
        }
      }
      tube(p);
    }
    raf=requestAnimationFrame(pas);
  }
  function ouvre(){
    if(reduit){ouvert=true;pq.classList.add('ouvert');verse(80);P.forEach(function(p){p.vy=0});}
    if(!ouvert){
      ouvert=true;pq.classList.add('ouvert');ast.style.display='none';
      setTimeout(function(){flux=110;info.classList.add('on')},420);
    }else{
      pq.classList.remove('secoue');void pq.offsetWidth;pq.classList.add('secoue');flux+=22;
    }
    if(!raf)pas();
  }
  pq.addEventListener('click',ouvre);
  rej.addEventListener('click',function(){
    P=[];total=0;nb.textContent=0;pile.fill(0);ouvert=false;flux=0;
    pq.classList.remove('ouvert');info.classList.remove('on');ast.style.display='';
  });

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
