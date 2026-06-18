/* Špeezy shared module — runs in both Node (server) and the browser (client). */
(function(global){
'use strict';

/* ================= Math engine (no eval) ================= */
function autoClose(expr){
  let o=0,c=0;
  for(const ch of expr){ if(ch==='(') o++; else if(ch===')') c++; }
  return o>c ? expr + ')'.repeat(o-c) : expr;
}
function tokenize(expr){
  expr = expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/√/g,'sqrt').replace(/\s+/g,'');
  const tokens=[]; let i=0;
  while(i<expr.length){
    const c=expr[i];
    if(/[0-9.]/.test(c)){
      let n=''; while(i<expr.length && /[0-9.]/.test(expr[i])){ n+=expr[i]; i++; }
      if((n.match(/\./g)||[]).length>1) throw new Error('Bad number "'+n+'"');
      tokens.push({type:'num',value:parseFloat(n),raw:n});
    } else if(/[a-zA-Z]/.test(c)){
      let name=''; while(i<expr.length && /[a-zA-Z]/.test(expr[i])){ name+=expr[i]; i++; }
      if(name==='sqrt') tokens.push({type:'func',value:'sqrt'});
      else if(name==='log'||name==='l') tokens.push({type:'func',value:'log'});
      else throw new Error('Unknown word "'+name+'"');
    } else if('+-*/^()!'.includes(c)){
      tokens.push({type:'op',value:c}); i++;
    } else { throw new Error('Unexpected character "'+c+'"'); }
  }
  return tokens;
}
function toRPN(tokens){
  const out=[], stack=[];
  const prec={'u-':4,'^':3,'*':2,'/':2,'+':1,'-':1};
  const rightAssoc={'^':true,'u-':true};
  let prev=null;
  for(const t of tokens){
    if(t.type==='num'){ out.push(t); }
    else if(t.type==='func'){ stack.push(t); }
    else if(t.type==='op'){
      if(t.value==='('){ stack.push(t); }
      else if(t.value===')'){
        while(stack.length && !(stack[stack.length-1].type==='op' && stack[stack.length-1].value==='(')) out.push(stack.pop());
        if(!stack.length) throw new Error('Mismatched parentheses');
        stack.pop();
        if(stack.length && stack[stack.length-1].type==='func') out.push(stack.pop());
      }
      else if(t.value==='!'){ out.push({type:'op',value:'fact'}); }
      else {
        let op=t.value;
        const prevValue = prev && (prev.type==='num' || (prev.type==='op' && (prev.value===')'||prev.value==='!')));
        const unary = (op==='-' && !prevValue);
        if(unary) op='u-';
        while(stack.length){
          const top=stack[stack.length-1];
          if(top.type==='func'){ out.push(stack.pop()); continue; }
          if(top.type==='op' && top.value!=='('){
            const topOp=top.value;
            if(rightAssoc[op] ? prec[op]<prec[topOp] : prec[op]<=prec[topOp]){ out.push(stack.pop()); continue; }
          }
          break;
        }
        stack.push({type:'op',value:op});
      }
    }
    prev=t;
  }
  while(stack.length){
    const top=stack.pop();
    if(top.type==='op' && top.value==='(') throw new Error('Mismatched parentheses');
    out.push(top);
  }
  return out;
}
function evalRPN(rpn){
  const st=[];
  for(const t of rpn){
    if(t.type==='num') st.push(t.value);
    else if(t.type==='func'){
      const a=st.pop(); if(a===undefined) throw new Error('Bad expression');
      if(t.value==='sqrt'){ if(a<0) throw new Error('Square root of a negative number'); st.push(Math.sqrt(a)); }
      else if(t.value==='log'){ if(a<=0) throw new Error('log needs a positive number'); st.push(Math.log10(a)); }
    } else if(t.type==='op'){
      if(t.value==='u-'){ const a=st.pop(); if(a===undefined) throw new Error('Bad expression'); st.push(-a); }
      else if(t.value==='fact'){
        let a=st.pop(); if(a===undefined) throw new Error('Bad expression');
        const ra=Math.round(a); if(Math.abs(a-ra)<1e-9) a=ra;   // tolerate float dust, e.g. sqrt(5)*sqrt(5)=5.0000001
        if(a<0||!Number.isInteger(a)) throw new Error('Factorial needs a whole number ≥ 0');
        if(a>170) throw new Error('Factorial too large');
        let f=1; for(let k=2;k<=a;k++) f*=k; st.push(f);
      }
      else{
        const b=st.pop(), a=st.pop();
        if(a===undefined||b===undefined) throw new Error('Bad expression');
        switch(t.value){
          case '+': st.push(a+b); break;
          case '-': st.push(a-b); break;
          case '*': st.push(a*b); break;
          case '/': if(b===0) throw new Error('Division by zero'); st.push(a/b); break;
          case '^': st.push(Math.pow(a,b)); break;
        }
      }
    }
  }
  if(st.length!==1) throw new Error('Bad expression');
  return st[0];
}
function evaluate(expr){
  expr = autoClose(expr);
  const tokens=tokenize(expr);
  const nums=tokens.filter(t=>t.type==='num');
  return { value:evalRPN(toRPN(tokens)), literals:nums.map(t=>t.value), litStrs:nums.map(t=>t.raw) };
}
function usesNumbers(litStrs, availNums){
  const pieces=availNums.map(String);
  function matchLit(lit,pool){
    const res=[], seen=new Set();
    for(let i=0;i<pool.length;i++){
      const p=pool[i]; if(seen.has(p)) continue; seen.add(p);
      if(lit.startsWith(p)){
        const rest=pool.slice(0,i).concat(pool.slice(i+1));
        if(lit.length===p.length) res.push(rest);
        else matchLit(lit.slice(p.length),rest).forEach(r=>res.push(r));
      }
    }
    return res;
  }
  function rec(lits,pool){
    if(lits.length===0) return pool.length===0;
    for(const np of matchLit(lits[0],pool)){ if(rec(lits.slice(1),np)) return true; }
    return false;
  }
  return rec(litStrs.slice(), pieces);
}
function prettyEq(s){ return s.replace(/l(?![a-zA-Z])/g,'log').replace(/sqrt/g,'√').replace(/\*/g,'×').replace(/\//g,'÷'); }

/* ================= Computer solver ================= */
let _budget=0;
function _perms(arr){
  if(arr.length<=1) return [arr];
  const res=[];
  for(let i=0;i<arr.length;i++){
    const rest=arr.slice(0,i).concat(arr.slice(i+1));
    for(const p of _perms(rest)) res.push([arr[i],...p]);
  }
  return res;
}
function _genLeafSets(dice){
  const partitions=[[[0,1,2]],[[0,1],[2]],[[0,2],[1]],[[1,2],[0]],[[0],[1],[2]]];
  const sets=[];
  for(const part of partitions){
    let opts=[[]];
    for(const block of part){
      const seen=new Set(), uniq=[];
      for(const perm of _perms(block)){
        const str=perm.map(i=>String(dice[i])).join('');
        if(!seen.has(str)){ seen.add(str); uniq.push({value:parseInt(str,10),expr:str}); }
      }
      const next=[];
      for(const partial of opts) for(const bl of uniq) next.push([...partial,bl]);
      opts=next;
    }
    sets.push(...opts);
  }
  const out=[], seen=new Set();
  for(const ls of sets){ const sig=ls.map(l=>l.expr).sort().join(','); if(!seen.has(sig)){seen.add(sig); out.push(ls);} }
  return out;
}
const _BINOPS=['+','-','*','/','^'];
function _applyBin(a,b,op){
  if(_budget--<=0) return null;
  let v;
  switch(op){
    case '+': v=a.value+b.value; break;
    case '-': v=a.value-b.value; break;
    case '*': v=a.value*b.value; break;
    case '/': if(Math.abs(b.value)<1e-9) return null; v=a.value/b.value; break;
    case '^': if(Math.abs(b.value)>12) return null; if(a.value<0&&!Number.isInteger(b.value)) return null; v=Math.pow(a.value,b.value); break;
  }
  if(!isFinite(v)||Math.abs(v)>1e7) return null;
  return {value:v, expr:'('+a.expr+op+b.expr+')'};
}
function _isNum(s){ return /^[0-9]+$/.test(s); }
function _unary(t){
  const out=[t], v=t.value;
  if(v>=0){ const sv=Math.sqrt(v); if(isFinite(sv)&&Math.abs(sv-v)>1e-9) out.push({value:sv,expr:'sqrt('+t.expr+')'}); }
  if(Number.isInteger(v)&&v>=0&&v<=7){ let f=1; for(let k=2;k<=v;k++) f*=k; if(f!==v) out.push({value:f,expr:_isNum(t.expr)?t.expr+'!':'('+t.expr+')!'}); }
  if(v>0){ const lv=Math.log10(v); if(isFinite(lv)&&Math.abs(lv-v)>1e-9) out.push({value:lv,expr:'log('+t.expr+')'}); }
  return out;
}
function _dedupCap(terms){
  const byVal=new Map();
  for(const t of terms){
    if(!isFinite(t.value)||Math.abs(t.value)>1e7) continue;
    const key=Math.round(t.value*1e6)/1e6;
    let arr=byVal.get(key);
    if(!arr){ if(byVal.size>=6000) continue; arr=[]; byVal.set(key,arr); }
    if(arr.length<2 && !arr.includes(t.expr)) arr.push(t.expr);
  }
  const out=[];
  for(const [key,exprs] of byVal) for(const e of exprs) out.push({value:key,expr:e});
  return out;
}
function _bip(leaves){
  const n=leaves.length, res=[];
  for(let mask=1; mask<(1<<n)-1; mask++){
    if(!(mask&1)) continue;
    const L=[],R=[];
    for(let i=0;i<n;i++){ ((mask>>i)&1)?L.push(leaves[i]):R.push(leaves[i]); }
    res.push([L,R]);
  }
  return res;
}
function _solveSet(leaves){
  if(leaves.length===1) return _dedupCap(_unary(leaves[0]));
  let out=[];
  for(const [L,R] of _bip(leaves)){
    const ls=_solveSet(L), rs=_solveSet(R);
    for(const a of ls) for(const b of rs){
      for(const op of _BINOPS){
        const r=_applyBin(a,b,op); if(r) out.push(r);
        if(op==='-'||op==='/'||op==='^'){ const r2=_applyBin(b,a,op); if(r2) out.push(r2); }
      }
    }
  }
  const more=[];
  for(const t of out) for(const u of _unary(t)) if(u!==t) more.push(u);
  return _dedupCap(out.concat(more));
}
function _stripOuter(s){
  if(s[0]==='(' && s[s.length-1]===')'){
    let d=0;
    for(let i=0;i<s.length;i++){ if(s[i]==='(')d++; else if(s[i]===')'){ d--; if(d===0 && i<s.length-1) return s; } }
    return s.slice(1,-1);
  }
  return s;
}
function solveAll(dice){
  _budget=3000000;
  const map={};
  for(const leaves of _genLeafSets(dice)){
    for(const t of _solveSet(leaves)){
      const v=t.value;
      if(Math.abs(v-Math.round(v))>1e-6) continue;
      const k=Math.round(v);
      if(k<1||k>1000) continue;
      if(map[k] && map[k].length>=3) continue;
      const e=_stripOuter(t.expr);
      if(map[k] && map[k].includes(e)) continue;
      try{ const r=evaluate(e); if(Math.abs(r.value-k)>1e-6 || !usesNumbers(r.litStrs,dice)) continue; }catch(err){ continue; }
      (map[k]=map[k]||[]).push(e);
    }
  }
  return map;
}

/* ================= Constants ================= */
const D3=[5,5,10,10,20,20];
const ROUND=120, COOLDOWN=15000, CROSS_AT=30, HINT_AT=15;
const SEAT_GRACE=30000;   // hold a player's color this long after they drop, so a quick reconnect reclaims it
const POOL=[
  [12,6],[64,16],[72,9],[36,4],[28,4],
  [42,21],[50,25],[64,32],[63,21],[32,4],
  [40,8],[70,14],[80,40],[70,10],[42,14],
  [72,12],[60,30],[48,6],[60,12],[49,1],
  [64,8],[35,5],[36,18],[54,18],[54,27],
  [7,1],[40,20],[56,28],[15,3],[54,9],
  [45,5],[16,8],[50,10],[49,7],[80,20],
  [56,7],[81,9],[60,15],[63,3],[48,16],
  [25,5],[20,2],[27,1],[56,14],[90,18],
  [80,10],[72,24],[90,30],[21,3],[30,2],
  [42,6],[81,27],[45,15],[28,2],[90,45],
  [48,24],[70,35]
];
const COLORS=[
  {name:'Sky',   hex:'#38bdf8'},
  {name:'Pink',  hex:'#f472b6'},
  {name:'Lime',  hex:'#4ade80'},
  {name:'Violet',hex:'#a78bfa'},
  {name:'Amber', hex:'#fb923c'},
  {name:'Teal',  hex:'#2dd4bf'}
];

function timeBonus(t){
  if(t>120) return 5;
  if(t>90)  return 10;
  if(t>60)  return 15;
  if(t>30)  return 20;
  return 25;            // (0, 30]  — least time left, most added
}

/* ================= Pure rule helpers ================= */
function isLocked(pair){ return pair.tiles[0].done && pair.tiles[1].done && pair.tiles[0].color===pair.tiles[1].color; }
function isStealTarget(pairs,pi,ti,color){
  const p=pairs[pi], t=p.tiles[ti], o=p.tiles[1-ti];
  return !!(t.done && o.done && t.color!==o.color && o.color===color && t.color!==color);
}
function stealable(pairs,pi,ti,color,now){
  if(!isStealTarget(pairs,pi,ti,color)) return false;
  const t=pairs[pi].tiles[ti];
  return (now-(t.claimAt||0))>=COOLDOWN;
}
function protectedTarget(pairs,pi,ti,color,now){
  if(!isStealTarget(pairs,pi,ti,color)) return false;
  const t=pairs[pi].tiles[ti];
  return (now-(t.claimAt||0))<COOLDOWN;
}
function valueCooldownLeft(claimLog,color,value,now){
  const ts = claimLog[color] && claimLog[color][value];
  return ts ? Math.max(0, COOLDOWN-(now-ts)) : 0;
}
function computeScores(pairs){
  const m={};
  pairs.forEach(p=>{
    p.tiles.forEach(t=>{ if(t.done && t.color){ m[t.color]=(m[t.color]||0)+1; } });
    if(p.tiles[0].done && p.tiles[1].done && p.tiles[0].color===p.tiles[1].color){
      const c=p.tiles[0].color; m[c]=(m[c]||0)+1;
    }
  });
  return m;
}

/* ================= API ================= */
const API={
  autoClose, evaluate, usesNumbers, solveAll, prettyEq,
  isLocked, isStealTarget, stealable, protectedTarget, valueCooldownLeft, computeScores, timeBonus,
  D3, ROUND, COOLDOWN, POOL, COLORS
};

/* ================= Server-only: authoritative Game ================= */
class Game {
  constructor(onChange, onFx){
    this.onChange = onChange ? (()=>onChange(this)) : (()=>{});
    this.onFx = onFx || (()=>{});
    this.seats = {};         // cid -> hex (the color a player holds)
    this.takenBy = {};       // hex -> cid
    this.socketCid = {};     // socketId -> cid
    this.cidSockets = {};    // cid -> { socketId: true }
    this.releaseTimers = {}; // cid -> timeout (grace before a color is freed)
    this.seatGrace = SEAT_GRACE;
    this.initials = {};
    this.history = [];
    this.mutationsPending = { prematureCross:false, lastMinuteHints:false };
    this.mutationsActive  = { prematureCross:false, lastMinuteHints:false };
    this.roundId = 0;
    this.startRound();
    this.loop = setInterval(()=>{ try{ this.tick(); }catch(e){ console.error('tick error', e); } }, 1000);
  }
  startRound(){
    const d1=1+Math.floor(Math.random()*6), d2=1+Math.floor(Math.random()*6), d3=D3[Math.floor(Math.random()*6)];
    this.avail=[d1,d2,d3];
    const picked=[...POOL].sort(()=>Math.random()-0.5).slice(0,12);
    this.pairs=picked.map(([a,b])=>{
      const tiles=[{val:a,done:false},{val:b,done:false}];
      if(Math.random()<0.5) tiles.reverse();
      return {tiles, color:null};
    });
    this.timeLeft=ROUND; this.ended=false; this.cleared=false; this.endReason=null; this._sm=null; this.claimLog={};
    this.mutationsActive = Object.assign({}, this.mutationsPending);
    this.crossComputed = false;
    this.roundId++;
    this.onChange();
  }
  tick(){
    if(this.ended) return;
    this.timeLeft--;
    if(this.mutationsActive.prematureCross && !this.crossComputed && this.timeLeft<=CROSS_AT){ this._computeCrosses(); this.crossComputed=true; }
    if(this.mutationsActive.lastMinuteHints && this.timeLeft===HINT_AT){ this._fireHint(); }
    if(this.timeLeft<=0){ this.timeLeft=0; this.endRound('time'); return; }
    this.onChange();
  }
  _solveMap(){ if(!this._sm) this._sm=solveAll(this.avail); return this._sm; }
  _computeCrosses(){
    const map=this._solveMap();
    this.pairs.forEach(p=>p.tiles.forEach(t=>{ if(!t.done) t.crossed = !(map[t.val]&&map[t.val].length); }));
  }
  _fireHint(){
    const map=this._solveMap();
    const cands=[];
    this.pairs.forEach((p,pi)=>p.tiles.forEach((t,ti)=>{ if(!t.done && map[t.val] && map[t.val].length) cands.push({pi,ti,sol:map[t.val][0]}); }));
    if(!cands.length) return;
    const pick=cands[Math.floor(Math.random()*cands.length)];
    this.onFx({type:'hint', pi:pick.pi, ti:pick.ti, partial:prettyEq(pick.sol).slice(0,3)});
  }
  endRound(reason){
    if(this.ended) return;
    this.ended=true; this.endReason=reason||'time'; this.cleared=(this.endReason!=='time');
    const map=this._solveMap();
    this.pairs.forEach(p=>p.tiles.forEach(t=>{ if(!t.done) t.cheat=(map[t.val]||[]).slice(0,3); }));
    this.onChange();
  }
  boardSettled(){ return this.pairs.every(p=> p.tiles[0].done && p.tiles[1].done && isLocked(p)); }
  // Nothing left worth playing for: every solvable number is already taken, and every
  // pair is either locked or can never be locked (a half the computer can't solve).
  roundDecided(){
    const map=this._solveMap();
    const solvable=v=>!!(map[v] && map[v].length);
    for(const p of this.pairs)
      for(const t of p.tiles)
        if(!t.done && solvable(t.val)) return false;      // a solvable tile is still open
    for(const p of this.pairs){
      if(isLocked(p)) continue;                            // locked — fine
      if(solvable(p.tiles[0].val) && solvable(p.tiles[1].val)) return false; // split & still steal-lockable
    }
    return true;
  }

  claim(color, pi, ti, eq){
    if(this.ended) return {ok:false, message:'Round is over — press New Game for the next one.'};
    if(!color) return {ok:false, message:'Pick a color first (left).'};
    const pair=this.pairs[pi]; if(!pair) return {ok:false, message:'Bad tile.'};
    const t=pair.tiles[ti]; if(!t) return {ok:false, message:'Bad tile.'};
    const now=Date.now();
    if(t.done && !stealable(this.pairs,pi,ti,color,now)) return {ok:false, message:'You can’t take that tile right now.'};
    const vleft=valueCooldownLeft(this.claimLog,color,t.val,now);
    if(vleft>0) return {ok:false, message:'⏳ You claimed a '+t.val+' recently — wait a moment.'};
    let r; try{ r=evaluate(eq||''); }catch(e){ return {ok:false, message:'⚠ '+e.message}; }
    if(!usesNumbers(r.litStrs, this.avail)) return {ok:false, message:'✗ Use all three dice ('+this.avail.join(', ')+'), each once.'};
    if(Math.abs(r.value-t.val)>1e-6) return {ok:false, message:'✗ That equals '+(Number.isInteger(r.value)?r.value:r.value.toFixed(2))+', not '+t.val+'.'};
    const isSteal=t.done;
    const closed=autoClose(eq);
    t.done=true; t.color=color; t.claimAt=now; t.eq=closed; t.crossed=false;
    t.history=t.history||[]; t.history.push({color, eq:closed});
    this.claimLog[color]=this.claimLog[color]||{}; this.claimLog[color][t.val]=now;
    this.timeLeft += timeBonus(this.timeLeft);
    const both=pair.tiles.every(x=>x.done);
    const locked=both && pair.tiles[0].color===pair.tiles[1].color;
    if(locked){ pair.color=pair.tiles[0].color; }
    const msg = isSteal ? '🏴 Stolen! Pair locked for you (worth 3).'
              : locked ? '🔒 Pair locked! (worth 3 pts)'
              : both   ? '✓ Correct! +1  (split pair)'
              : '✓ Correct! +1 — lock it by taking its partner in your color.';
    this.onFx({type:'claim', color, pi, ti, locked, isSteal});
    if(this.boardSettled()) this.endRound('locked');
    else if(this.roundDecided()) this.endRound('settled');
    this.onChange();
    return {ok:true, message:msg};
  }

  join(socketId, cid){
    cid = cid || socketId;
    this.socketCid[socketId]=cid;
    (this.cidSockets[cid]=this.cidSockets[cid]||{})[socketId]=true;
    if(this.releaseTimers[cid]){ clearTimeout(this.releaseTimers[cid]); delete this.releaseTimers[cid]; }
    if(!this.seats[cid]){                       // new player — hand out a free color (null if all 6 are in use)
      let assigned=null;
      for(const c of COLORS){ if(!this.takenBy[c.hex]){ assigned=c.hex; break; } }
      if(assigned){ this.seats[cid]=assigned; this.takenBy[assigned]=cid; }
    }
    this.onChange();
    return this.seats[cid]||null;
  }
  colorFor(cid){ return (cid && this.seats[cid]) || null; }
  pickColor(cid, hex){
    if(!cid) return null;
    if(!COLORS.find(c=>c.hex===hex)) return this.seats[cid]||null;
    if(this.takenBy[hex] && this.takenBy[hex]!==cid) return this.seats[cid]||null;  // taken by someone else
    const old=this.seats[cid]; if(old && old!==hex) delete this.takenBy[old];
    this.seats[cid]=hex; this.takenBy[hex]=cid;
    this.onChange();
    return hex;
  }
  setInitials(hex, text){
    if(!COLORS.find(c=>c.hex===hex)) return;
    this.initials[hex]=String(text||'').replace(/[^a-zA-Z0-9]/g,'').slice(0,2).toUpperCase();
    this.onChange();
  }
  setMutation(key, on){
    if(this.mutationsPending.hasOwnProperty(key)){ this.mutationsPending[key]=!!on; this.onChange(); }
  }
  leaveSocket(socketId){
    const cid=this.socketCid[socketId];
    delete this.socketCid[socketId];
    if(!cid) return;
    if(this.cidSockets[cid]) delete this.cidSockets[cid][socketId];
    const stillConnected = this.cidSockets[cid] && Object.keys(this.cidSockets[cid]).length>0;
    if(!stillConnected){
      delete this.cidSockets[cid];
      if(this.releaseTimers[cid]) clearTimeout(this.releaseTimers[cid]);
      const tm=setTimeout(()=>{                  // grace: keep the color so a quick reconnect reclaims it
        delete this.releaseTimers[cid];
        if(this.cidSockets[cid]) return;           // they came back in time
        const hex=this.seats[cid];
        if(hex && this.takenBy[hex]===cid) delete this.takenBy[hex];
        delete this.seats[cid];
        this.onChange();
      }, this.seatGrace);
      if(tm && tm.unref) tm.unref();
      this.releaseTimers[cid]=tm;
    }
    this.onChange();
  }
  forceNew(){
    // Every New Game press counts the board you're leaving as a round (even an empty one),
    // so the "last 4 rounds" tally can be cleared by pressing New Game a few times.
    this.history.push(computeScores(this.pairs));
    if(this.history.length>4) this.history.shift();
    this.startRound();
  }
  forceEnd(){ if(!this.ended) this.endRound(false); }

  recentFor(hex){ return this.history.reduce((s,snap)=>s+(snap[hex]||0),0); }

  serialize(){
    const now=Date.now();
    return {
      roundId:this.roundId,
      ended:this.ended, cleared:this.cleared, endReason:this.endReason||null,
      timeLeft:Math.max(0,this.timeLeft), avail:this.avail,
      mutations:this.mutationsPending,
      pairs:this.pairs.map(p=>({
        color:p.color||null,
        tiles:p.tiles.map(t=>({
          val:t.val, done:!!t.done, color:t.color||null,
          age: t.done ? (now-(t.claimAt||now)) : null,
          history: t.history||null,
          crossed: !!t.crossed,
          cheat: (this.ended && !t.done) ? (t.cheat||[]) : null
        }))
      })),
      players: COLORS.map(c=>({hex:c.hex,name:c.name,taken:!!this.takenBy[c.hex],initials:this.initials[c.hex]||'',recent:this.recentFor(c.hex)})),
      scores: computeScores(this.pairs)
    };
  }
}

/* ================= Export ================= */
if(typeof module!=='undefined' && module.exports){
  module.exports = Object.assign({}, API, { Game });
} else {
  global.SPEEZY = API;
}
})(typeof window!=='undefined' ? window : (typeof globalThis!=='undefined'?globalThis:this));
