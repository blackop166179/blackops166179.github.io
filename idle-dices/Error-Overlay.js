(function(){
  if(window.__error_overlay_installed) return;
  window.__error_overlay_installed=true;
  const wrap=(s)=>{ try{ return s.replace(/</g,'&lt;') }catch(e){return s}};
  const el=document.createElement('div');
  Object.assign(el.style,{position:'fixed',right:0,top:0,width:'420px',height:'40vh',overflow:'auto',zIndex:2147483647,background:'#111',color:'#fff',fontSize:'12px',padding:'8px',fontFamily:'monospace',boxShadow:'0 0 12px rgba(0,0,0,.8)'});
  document.body.appendChild(el);
  function show(msg){ const p=document.createElement('pre'); p.style.margin='4px 0'; p.innerHTML=wrap(msg); el.appendChild(p); }
  window.addEventListener('error',e=>{ show('Error: '+e.message+'\\n@ '+(e.filename||'')+':'+(e.lineno||'')+':'+(e.colno||'')); });
  window.addEventListener('unhandledrejection',e=>{ show('UnhandledRejection: '+(e.reason && e.reason.stack? e.reason.stack : String(e.reason))); });
  if(window.fetch){ const _fetch=window.fetch; window.fetch=function(){ return _fetch.apply(this,arguments).then(res=>{ if(!res.ok) res.clone().text().then(t=>show('Fetch '+res.status+' '+res.url+'\\n'+t)).catch(()=>show('Fetch '+res.status+' '+res.url)); return res; }); }; }
  (function(open,send){
    XMLHttpRequest.prototype.open = function(){ this._url = arguments[1]; return open.apply(this,arguments); };
    XMLHttpRequest.prototype.send = function(){
      this.addEventListener('loadend', ()=>{ if(this.status && (this.status <200 || this.status>=400)) try{ show('XHR '+this.status+' '+(this._url||'')+'\\n'+this.responseText.slice(0,2000)); }catch(e){ show('XHR '+this.status+' '+(this._url||'')+' (response read failed)'); }});
      return send.apply(this,arguments);
    };
  })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);
  show('Error overlay installed — listening for window.onerror, unhandledrejection, fetch/XHR errors.');
})();
