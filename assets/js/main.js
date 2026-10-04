(function(){
  // Menu mobile
  var b=document.querySelector('.burger'),m=document.querySelector('.mnav');
  if(b&&m){b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)})}

  // Formulaires factices
  document.querySelectorAll('form[data-demo]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=f.querySelector('.ok');ok.classList.add('show');
      f.querySelectorAll('input,textarea').forEach(function(i){i.value=''});
      setTimeout(function(){ok.classList.remove('show')},6000);
    });
  });

  // Wilayas
  var W=['Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar','Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger','Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma','Constantine','Médéa','Mostaganem',"M'Sila",'Mascara','Ouargla','Oran','El Bayadh','Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued','Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent','Ghardaïa','Relizane','Timimoun','Bordj Badji Mokhtar','Ouled Djellal','Béni Abbès','In Salah','In Guezzam','Touggourt','Djanet',"El M'Ghair",'El Meniaa'];
  document.querySelectorAll('select[data-wilayas]').forEach(function(s){
    W.forEach(function(w,i){var o=document.createElement('option');o.textContent=String(i+1).padStart(2,'0')+' · '+w;s.appendChild(o)});
  });

  // Gamme
  var P=[
    {fr:'Fell N°2',ar:'فل',fam:'pates',lib:'Pâtes courtes',poids:'500 g',img:'fell-n2.webp',href:'produit.html'},
    {fr:'Spaghetti 7',ar:'سباقيتي',fam:'pates',lib:'Pâtes longues',poids:'500 g',pk:'pk--long'},
    {fr:'Rotelle',ar:'روتيلي',fam:'pates',lib:'Pâtes courtes'},
    {fr:'Penne',fam:'pates',lib:'Pâtes courtes',poids:'500 g'},
    {fr:'Lasagne',ar:'لازانيا',fam:'pates',lib:'Pâtes à gratiner',pk:'pk--plat'},
    {fr:'Plomb',fam:'pates',lib:'Pâtes traditionnelles',poids:'500 g'},
    {fr:'Couscous fin',ar:'كسكسي رقيق',fam:'couscous',lib:'Couscous',poids:'1 kg',pk:'pk--semoule pk--rouge'},
    {fr:'Couscous moyen',ar:'كسكسي متوسط',fam:'couscous',lib:'Couscous',poids:'1 kg',pk:'pk--semoule'},
    {fr:'Farine de blé tendre',ar:'فرينة',fam:'farine',lib:'Farine',poids:'1 kg',pk:'pk--farine'}
  ];
  var base=document.body.getAttribute('data-base')||'';
  function card(p){
    var vis=p.img?'<img class="cut" src="'+base+'assets/img/'+p.img+'" alt="Paquet El Baraka '+p.fr+'" loading="lazy">'
      :'<div class="pk '+(p.pk||'')+'" aria-hidden="true"><div class="pk-logo"><img src="'+base+'assets/img/logo-blanc.svg" alt=""></div><div class="pk-band">'+(p.ar?'<span class="ar">'+p.ar+'</span>':'')+'<span>'+p.fr+'</span></div></div>';
    var t=p.href?'a':'div',h=p.href?' href="'+base+p.href+'"':'';
    return '<'+t+' class="pk-card" data-fam="'+p.fam+'"'+h+'><div class="pk-stage">'+vis+'</div><div><h3>'+p.fr+'</h3><p>'+p.lib+(p.poids?' · '+p.poids:'')+'</p>'+(p.href?'<span class="tag">Voir la fiche</span>':'')+'</div></'+t+'>';
  }
  document.querySelectorAll('[data-gamme]').forEach(function(g){
    var n=parseInt(g.getAttribute('data-gamme'),10)||P.length;
    var list=n<P.length?[P[0],P[1],P[7],P[8]]:P;
    g.innerHTML=list.map(card).join('');
  });
  var filt=document.querySelector('[data-filtres]');
  if(filt){filt.addEventListener('click',function(e){
    var t=e.target.closest('button');if(!t)return;
    filt.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===t)});
    var f=t.getAttribute('data-f');
    document.querySelectorAll('.pk-card').forEach(function(c){c.style.display=(f==='tout'||c.getAttribute('data-fam')===f)?'':'none'});
  })}

  // Calculateur
  document.querySelectorAll('[data-calc]').forEach(function(c){
    var plats={pates:{g:100,pack:500,nom:'paquets de 500 g'},couscous:{g:125,pack:1000,nom:'paquets de 1 kg'},soupe:{g:30,pack:500,nom:'paquets de 500 g'}};
    var plat='pates',n=4;
    var out=c.querySelector('output'),res=c.querySelector('[data-res]'),pk=c.querySelector('[data-pk]');
    function maj(){
      var p=plats[plat],g=n*p.g;
      out.textContent=n;
      res.textContent=g>=1000?(g/1000).toLocaleString('fr-FR')+' kg':g+' g';
      var k=Math.ceil(g/p.pack);pk.textContent=k+' '+(k>1?p.nom:p.nom.replace('paquets','paquet'));
    }
    c.querySelectorAll('[data-plat]').forEach(function(bt){bt.addEventListener('click',function(){
      plat=bt.getAttribute('data-plat');c.querySelectorAll('[data-plat]').forEach(function(x){x.setAttribute('aria-pressed',x===bt)});maj();
    })});
    c.querySelector('[data-moins]').addEventListener('click',function(){n=Math.max(1,n-1);maj()});
    c.querySelector('[data-plus]').addEventListener('click',function(){n=Math.min(60,n+1);maj()});
    maj();
  });
})();
