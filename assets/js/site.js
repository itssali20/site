/* ═══════════════════════════════════════════════════════════════
   AVEDA WELLNESS — site script
   Header, nav, mobile menu, active-link marking. Loaded on every page.
   Page animations live in the second IIFE below (home page only for
   now — later pages can reuse it as-is).
   ═══════════════════════════════════════════════════════════════ */
(function(){
  var hd = document.querySelector('.hd');
  var burger = document.querySelector('.hd-burger');
  var mnav = document.querySelector('.mnav');

  /* sticky header state */
  if(hd){
    var onScroll = function(){ hd.classList.toggle('is-stuck', window.scrollY > 16); };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* mobile menu */
  if(burger && mnav){
    burger.addEventListener('click', function(){
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mnav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        document.body.classList.remove('menu-open');
        burger.setAttribute('aria-expanded','false');
        document.body.style.overflow = '';
      });
    });
  }
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
      if(burger) burger.setAttribute('aria-expanded','false');
      document.querySelectorAll('.nav-dd[data-open="true"]').forEach(function(d){ d.dataset.open='false'; });
    }
  });

  /* desktop dropdown — hover on pointer devices, click everywhere */
  document.querySelectorAll('.nav-dd').forEach(function(dd){
    var btn = dd.querySelector('button');
    btn.addEventListener('click', function(e){
      e.stopPropagation();
      dd.dataset.open = dd.dataset.open === 'true' ? 'false' : 'true';
      btn.setAttribute('aria-expanded', dd.dataset.open);
    });
    if(window.matchMedia('(hover: hover)').matches){
      dd.addEventListener('mouseenter', function(){ dd.dataset.open='true'; btn.setAttribute('aria-expanded','true'); });
      dd.addEventListener('mouseleave', function(){ dd.dataset.open='false'; btn.setAttribute('aria-expanded','false'); });
    }
  });
  document.addEventListener('click', function(){
    document.querySelectorAll('.nav-dd[data-open="true"]').forEach(function(d){
      d.dataset.open='false';
      d.querySelector('button').setAttribute('aria-expanded','false');
    });
  });

  /* mark the current page in the nav */
  var here = location.pathname.replace(/index\.html$/,'').replace(/\/$/,'') || '/';
  document.querySelectorAll('.nav a, .mnav a, .dd a').forEach(function(a){
    var href = (a.getAttribute('href')||'').replace(/\/$/,'') || '/';
    if(href === here && href !== '/book') a.setAttribute('aria-current','page');
  });
})();

/* ═══════════════════════════════════════════════════════════════
   PAGE ANIMATION
   Every selector is guarded — a page that doesn't contain a given
   element simply skips that animation instead of warning.
   ═══════════════════════════════════════════════════════════════ */
(function(){
  var root = document.getElementById('aw');
  if(!root) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── FAQ accordion (works with or without GSAP) ── */
  root.querySelectorAll('.aw-fq').forEach(function(item){
    var btn = item.querySelector('.aw-fq-q');
    var panel = item.querySelector('.aw-fq-a');
    if(!btn || !panel) return;
    btn.setAttribute('aria-expanded','false');
    btn.addEventListener('click', function(){
      var open = item.classList.contains('aw-open');
      root.querySelectorAll('.aw-fq.aw-open').forEach(function(o){
        if(o === item) return;
        o.classList.remove('aw-open');
        var q = o.querySelector('.aw-fq-q'); if(q) q.setAttribute('aria-expanded','false');
        var p = o.querySelector('.aw-fq-a');
        if(window.gsap && !reduced){ gsap.to(p,{height:0,duration:.34,ease:'power2.inOut'}); }
        else { p.style.height='0px'; }
      });
      item.classList.toggle('aw-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
      if(window.gsap && !reduced){
        gsap.to(panel,{height: open ? 0 : 'auto', duration:.4, ease:'power2.inOut'});
      } else {
        panel.style.height = open ? '0px' : 'auto';
      }
    });
  });

  /* ── smooth anchors ── */
  root.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var t = document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block:'start'}); }
    });
  });

  if(!window.gsap || !window.ScrollTrigger || reduced) return;
  gsap.registerPlugin(ScrollTrigger);

  /* ── guarded helpers: no element, no animation, no warning ── */
  function all(sel){ var n = root.querySelectorAll(sel); return n.length ? n : null; }
  function one(sel){ return root.querySelector(sel); }
  function from(sel, vars){ var t = all(sel); if(t) gsap.from(t, vars); return t; }
  function to(sel, vars){ var t = all(sel); if(t) gsap.to(t, vars); return t; }

  /* ── scroll progress ── */
  if(one('.aw-prog')){
    to('.aw-prog',{scaleX:1,ease:'none',
      scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:.3}});
  }

  /* ── frost particles (home hero only) ── */
  var frost = one('.aw-frost');
  if(frost){
    for(var i=0;i<26;i++){
      var d=document.createElement('i');
      d.style.left=(Math.random()*100)+'%';
      d.style.top=(Math.random()*100)+'%';
      var s=(Math.random()*2.2+1.2);
      d.style.width=d.style.height=s+'px';
      d.style.opacity=(Math.random()*.5+.18);
      frost.appendChild(d);
      gsap.to(d,{y:(Math.random()*90+50)*(Math.random()<.5?-1:1),
        x:(Math.random()*60-30),duration:Math.random()*9+8,repeat:-1,yoyo:true,
        ease:'sine.inOut',delay:Math.random()*5});
    }
  }

  /* ── hero headline split ── */
  var h1 = one('h1[data-split]');
  if(h1){
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(h1.childNodes).forEach(function(node){
      if(node.nodeType === 3){
        node.textContent.split(/(\s+)/).forEach(function(part){
          if(!part.trim()){ frag.appendChild(document.createTextNode(part)); return; }
          var s2 = document.createElement('span'); s2.className='w'; s2.textContent=part;
          frag.appendChild(s2);
        });
      } else {
        var c = node.cloneNode(true); c.classList.add('w'); frag.appendChild(c);
      }
    });
    h1.innerHTML=''; h1.appendChild(frag);
  }

  /* ── home hero load sequence ── */
  if(one('.aw-hero')){
    var tl = gsap.timeline({defaults:{ease:'power3.out'}});
    function at(sel, vars, pos){ var t = all(sel); if(t) tl.from(t, vars, pos); }
    at('.aw-hero-img img',{scale:1.1,opacity:0,duration:1.6,ease:'power2.out'},0);
    at('.aw-aurora',{opacity:0,scale:.8,duration:1.6},0);
    at('.aw-hero .aw-eye',{opacity:0,y:14,duration:.6},.3);
    at('.aw-hero h1 .w',{opacity:0,y:'0.55em',duration:.9,stagger:.06},.4);
    at('.aw-sub',{opacity:0,y:18,duration:.7},.82);
    at('.aw-hero .aw-cta .aw-btn',{opacity:0,y:14,duration:.55,stagger:.09},.98);
    at('.aw-meta span',{opacity:0,y:10,duration:.5,stagger:.07},1.12);
    at('.aw-cue',{opacity:0,duration:.6},1.3);
    to('.aw-cue i',{scaleY:.3,transformOrigin:'top',duration:1.5,repeat:-1,yoyo:true,ease:'sine.inOut'});
  }

  /* ── inner page hero ── */
  if(one('.pg-in')){
    var ptl = gsap.timeline({defaults:{ease:'power3.out'}});
    function pat(sel, vars, pos){ var t = all(sel); if(t) ptl.from(t, vars, pos); }
    pat('.pg-in > *',{opacity:0,y:20,duration:.8,stagger:.09}, 0);
    pat('.pg-m img',{scale:1.08,opacity:0,duration:1.5,ease:'power2.out'}, 0);
  }

  /* ── parallax ── */
  root.querySelectorAll('[data-par]').forEach(function(el){
    gsap.to(el,{yPercent:(parseFloat(el.dataset.par)||.1)*100,ease:'none',
      scrollTrigger:{trigger:el.closest('.aw-hero')||el,start:'top bottom',end:'bottom top',scrub:true}});
  });
  root.querySelectorAll('[data-par2]').forEach(function(el){
    gsap.fromTo(el,{yPercent:-6},{yPercent:6,ease:'none',
      scrollTrigger:{trigger:el.closest('.aw-band, .aw-loc-p')||el,start:'top bottom',end:'bottom top',scrub:true}});
  });

  /* ── studio band ── */
  if(one('.aw-band')){
    from('.aw-band-c > *',{opacity:0,y:26,duration:.8,stagger:.1,ease:'power3.out',
      scrollTrigger:{trigger:'.aw-band',start:'top 74%'}});
  }

  /* ── marquee ── */
  var tr = one('.aw-mq-t');
  if(tr){
    var half = tr.scrollWidth/2;
    var loop = gsap.to(tr,{x:-half,duration:34,ease:'none',repeat:-1,
      modifiers:{x:function(x){ return (parseFloat(x)%half)+'px'; }}});
    ScrollTrigger.create({trigger:root,start:'top top',end:'bottom bottom',
      onUpdate:function(s){ loop.timeScale(s.direction===1?1:-1); }});
  }

  /* ── section heads ── */
  root.querySelectorAll('.aw-head').forEach(function(hd){
    var kids=[].filter.call(hd.children,function(c){ return c.tagName!=='H2'; });
    if(kids.length){
      gsap.from(kids,{opacity:0,y:22,duration:.7,stagger:.09,ease:'power2.out',
        scrollTrigger:{trigger:hd,start:'top 86%'}});
    }
  });
  root.querySelectorAll('.aw-head h2, .split-c h2').forEach(function(el){
    gsap.from(el,{clipPath:'inset(0 0 102% 0)',y:14,duration:.95,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 88%'}});
  });

  /* ── counters ── */
  root.querySelectorAll('.aw-n').forEach(function(el){
    var target = parseFloat(el.dataset.n);
    ScrollTrigger.create({trigger:el,start:'top 94%',once:true,onEnter:function(){
      var o={v:0};
      gsap.to(o,{v:target,duration:1.5,ease:'power2.out',onUpdate:function(){
        el.textContent = Math.round(o.v).toLocaleString();
      }});
    }});
  });

  /* ── temperature scale ── */
  var bar = one('.aw-scale-bar');
  if(bar){
    gsap.from(bar,{scaleX:0,transformOrigin:'left',duration:1.1,ease:'power2.inOut',
      scrollTrigger:{trigger:bar,start:'top 88%'}});
    from('.aw-scale-pt',{scale:0,opacity:0,duration:.5,stagger:.1,ease:'back.out(2)',
      scrollTrigger:{trigger:bar,start:'top 88%'},delay:.5});
  }

  /* ── thermal panel ── */
  var th = one('.aw-th-v');
  if(th){
    gsap.fromTo('.aw-th-scan',{top:'4%'},{top:'96%',duration:3.4,repeat:-1,yoyo:true,ease:'sine.inOut'});
    gsap.from(th,{opacity:0,scale:.95,duration:.9,ease:'power2.out',
      scrollTrigger:{trigger:th,start:'top 85%'}});
    from('.aw-th-in',{opacity:0,scale:.8,y:18,duration:.7,stagger:.14,ease:'back.out(1.6)',
      scrollTrigger:{trigger:th,start:'top 80%'}});
  }

  /* ── gallery ── */
  root.querySelectorAll('[data-gp]').forEach(function(img){
    gsap.fromTo(img,{yPercent:-5,scale:1.11},{yPercent:5,ease:'none',
      scrollTrigger:{trigger:img.closest('figure'),start:'top bottom',end:'bottom top',scrub:true}});
  });
  root.querySelectorAll('.aw-gal figure').forEach(function(f,i){
    gsap.from(f,{opacity:0,y:40,duration:.85,ease:'power3.out',delay:(i%2)*.08,
      scrollTrigger:{trigger:f,start:'top 88%'}});
  });

  /* ── service card image drift ── */
  root.querySelectorAll('.aw-svc-m img, .path-m img').forEach(function(img){
    gsap.fromTo(img,{yPercent:-4},{yPercent:4,ease:'none',
      scrollTrigger:{trigger:img.closest('.aw-svc, .path'),start:'top bottom',end:'bottom top',scrub:true}});
  });

  /* ── device strip ── */
  var dev = one('.aw-dev');
  if(dev){
    from('.aw-dev-i img',{opacity:0,y:26,scale:.92,duration:.85,stagger:.08,ease:'power3.out',
      scrollTrigger:{trigger:dev,start:'top 86%'}});
  }

  /* ── clip wipes ── */
  root.querySelectorAll('.aw-card-img').forEach(function(el){
    gsap.from(el,{clipPath:'inset(0 0 100% 0)',duration:1,ease:'power3.out',
      scrollTrigger:{trigger:el,start:'top 88%'}});
  });

  /* ── Roll Shaper warm pulse on the home card ── */
  var rs = one('.aw-svc[href*="roll-shaper"] .aw-temp');
  if(rs){ gsap.to(rs,{boxShadow:'0 0 22px rgba(255,122,61,.55)',duration:2,repeat:-1,yoyo:true,ease:'sine.inOut'}); }

  /* ── generic grid stagger ── */
  function stag(grid, child, y){
    try{
      root.querySelectorAll(grid).forEach(function(g){
        var els = g.querySelectorAll(child);
        if(!els.length) return;
        gsap.from(els,{opacity:0,y:y||28,duration:.75,stagger:.1,ease:'power2.out',
          scrollTrigger:{trigger:g,start:'top 87%'}});
      });
    }catch(e){ /* a bad selector must never stop the rest of the page */ }
  }
  stag('.aw-spec-g',':scope > div',20);
  stag('.aw-diff-g','.aw-card',30);
  stag('.aw-svc-g','.aw-svc',36);
  stag('.aw-sci-g','.aw-sci',24);
  stag('.aw-why-g','.aw-why',20);
  stag('.aw-vst',':scope > div',22);
  stag('.aw-pr-g','.aw-pr',26);
  stag('.aw-faq','.aw-fq',14);
  stag('.aw-tst-g','.aw-tst',24);
  stag('.aw-loc','.aw-loc-p, .aw-loc-i',24);
  stag('.aw-steps-v','.aw-stp',18);
  stag('.aw-dev',':scope > div',30);
  stag('.mech','article',26);
  stag('.outs',':scope > div',22);
  stag('.uses','.use',30);
  stag('.paths','.path',34);
  stag('.mods','.mod',28);
  stag('.sol','article',26);
  stag('.apps',':scope > div',22);
  stag('.flow',':scope > div',26);
  stag('.cells','.cell-p',30);
  stag('.flags','li',14);
  stag('.chips','span',14);
  stag('.tl',':scope > div',20);
  stag('.cmp-wrap','tbody tr',12);
  stag('.ticks','li',16);
  stag('.pill','span',14);

  /* ── closing CTA ── */
  if(one('.aw-end')){
    from('.aw-end .aw-eye, .aw-end h2, .aw-end > .aw-wrap > p, .aw-end .aw-btn',
      {opacity:0,y:24,duration:.75,stagger:.1,ease:'power2.out',
       scrollTrigger:{trigger:'.aw-end',start:'top 80%'}});
    to('.aw-end-gl',{scale:1.16,opacity:.75,duration:3.4,repeat:-1,yoyo:true,ease:'sine.inOut'});
  }

  /* ── service card tilt (pointer devices only) ── */
  if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
    root.querySelectorAll('.aw-svc').forEach(function(c){
      c.addEventListener('mousemove',function(e){
        var r=c.getBoundingClientRect();
        gsap.to(c,{rotateY:((e.clientX-r.left)/r.width-.5)*4,
                   rotateX:(.5-(e.clientY-r.top)/r.height)*4,
                   transformPerspective:900,duration:.5,ease:'power2.out'});
      });
      c.addEventListener('mouseleave',function(){
        gsap.to(c,{rotateY:0,rotateX:0,duration:.7,ease:'power2.out'});
      });
    });
  }

  ScrollTrigger.refresh();
})();
