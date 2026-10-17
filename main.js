(function(){
  var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
  // параллакс-картинки
  var pxs=$$('[data-px]'),vis=new Set();
  var canPar=window.matchMedia&&matchMedia('(min-width:901px) and (hover:hover)').matches;
  if(canPar&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)vis.add(e.target);else vis.delete(e.target);});},{rootMargin:'100px'});pxs.forEach(function(im){io.observe(im);});}
  var ticking=false;
  function par(){ticking=false;if(!canPar)return;vis.forEach(function(im){var b=im.parentNode.getBoundingClientRect(),c=(b.top+b.height/2-innerHeight/2)/innerHeight;im.style.transform='translate3d(0,'+(c*-6).toFixed(2)+'%,0)';});}
  function reqPar(){if(!ticking){ticking=true;requestAnimationFrame(par);}}
  // первый экран с кадрами (только на главной)
  var hero=$('#hero');
  if(hero){
    var N=90,set=(matchMedia('(max-aspect-ratio: 1/1)').matches?'p':'l'),cv=$('#cv'),ctx=cv.getContext('2d'),frames=new Array(N+1),cur=-1;
    var pg=$('#pg'),sn=$('#sn'),st=$('#st'),ht=$('#ht');
    var STAGES=['Проект','Фундамент','Каркас','Фасад и стекло','Объект сдан'];
    var src=function(i){return 'f/'+set+'/f_'+('00'+i).slice(-3)+'.webp';};
    var find=function(i){var im=frames[i];if(im&&im.naturalWidth)return im;for(var d=1;d<N;d++){var a=frames[i-d],b=frames[i+d];if(a&&a.naturalWidth)return a;if(b&&b.naturalWidth)return b;}return null;};
    var draw=function(i){var im=find(i);if(!im)return;var cw=cv.width,ch=cv.height,iw=im.naturalWidth,ih=im.naturalHeight,s=Math.max(cw/iw,ch/ih),w=iw*s,h=ih*s;ctx.drawImage(im,(cw-w)/2,(ch-h)/2,w,h);};
    var load=function(i){if(i<1||i>N||frames[i])return;var im=new Image();im.onload=function(){if(cur<1||Math.abs(i-cur)<3)draw(cur<1?1:cur);};im.src=src(i);frames[i]=im;};
    var resize=function(){var d=Math.min(devicePixelRatio||1,1.5);cv.width=innerWidth*d;cv.height=innerHeight*d;draw(cur<1?1:cur);};
    load(1);load(N);var order=[];[8,4,2,1].forEach(function(s){for(var i=1;i<=N;i+=s)order.push(i);});
    var k=0;(function pump(){var n=0;while(k<order.length&&n<5){load(order[k++]);n++;}if(k<order.length)setTimeout(pump,25);})();
    var ease=function(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2};
    var upd=function(){
      var r=hero.getBoundingClientRect(),tot=hero.offsetHeight-innerHeight,p=Math.min(1,Math.max(0,-r.top/tot));
      var i=Math.min(N,Math.max(1,1+Math.round(p*(N-1))));if(i!==cur){cur=i;draw(i);}
      pg.style.width=(p*100)+'%';var si=Math.min(4,Math.floor(p*5*.999));sn.textContent='0'+(si+1);st.textContent=STAGES[si];
      ht.style.opacity=Math.max(0,1-p/0.2);ht.style.pointerEvents=p>0.2?'none':'auto';
      par();
    };
    addEventListener('scroll',function(){requestAnimationFrame(upd);},{passive:true});addEventListener('resize',function(){resize();upd();});resize();upd();
  }else{addEventListener('scroll',reqPar,{passive:true});par();}
  // фильтр объектов
  var chips=$$('#flt button'),objs=$$('.card[data-c]');
  chips.forEach(function(x){x.addEventListener('click',function(){chips.forEach(function(y){y.classList.toggle('on',y===x);});var f=x.getAttribute('data-f');objs.forEach(function(c){c.classList.toggle('show-no',!(f==='all'||c.getAttribute('data-c')===f));});});});
})();

