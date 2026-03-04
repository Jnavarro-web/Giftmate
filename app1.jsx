const { useState, useEffect, useRef } = React;
const API = "/api/chat", MODEL = "claude-sonnet-4-20250514";
const P = { indigo:"#FF914D", indigoL:"#FFB080", indigoD:"#E06830", teal:"#F4A438", tealL:"#FFD580", tealD:"#D4841A", gold:"#F4A438", goldL:"#FFD580", goldD:"#C47A10", bg:"#0A0A18", card:"#12122A", cardH:"#191932", border:"#242448", text:"#F0EEE8", muted:"#9A96B0", faint:"#5A5875", green:"#2ECC71", red:"#EF4444" };
const STAR_ACTIONS = { ADD_PERSON:{label:"Added a person",stars:15,icon:"👤"}, ADD_OCCASION:{label:"Added an occasion",stars:10,icon:"🗓️"}, ENABLE_NOTIF:{label:"Enabled notifications",stars:5,icon:"🔔"}, REFERRAL:{label:"Referred a friend",stars:80,icon:"🤝"}, SHARE_APP:{label:"Shared the app",stars:10,icon:"📲"} };
const STAR_TIERS = [ {name:"Thoughtful",min:0,max:299,icon:"🌱",color:"#10B981",perks:["Early access to new features"]}, {name:"Caring",min:300,max:699,icon:"💫",color:"#818CF8",perks:["5% off partners","Priority support"]}, {name:"Generous",min:700,max:1499,icon:"⭐",color:"#F59E0B",perks:["10% off retailers","Free gift wrapping","1 free premium month"]}, {name:"Legendary",min:1500,max:Infinity,icon:"👑",color:"#EC4899",perks:["15% off all purchases","Handwritten notes","VIP concierge"]} ];
const STAR_REWARDS = [ {id:1,title:"5% Off Amazon",cost:200,icon:"📦",partner:"Amazon",desc:"One-time code"}, {id:2,title:"Free Gift Wrapping",cost:150,icon:"🎀",partner:"Giftmate",desc:"Next purchase"}, {id:3,title:"10% Off Etsy",cost:300,icon:"🎨",partner:"Etsy",desc:"Valid 30 days"}, {id:4,title:"1 Month Premium",cost:500,icon:"✨",partner:"Giftmate",desc:"Full access"}, {id:5,title:"Donate a Gift",cost:400,icon:"❤️",partner:"Charity",desc:"In someone's name"}, {id:6,title:"15% Off Experiences",cost:600,icon:"🎟️",partner:"Viator",desc:"Any booking"} ];
const getTier = s => STAR_TIERS.find(t => s >= t.min && s <= t.max) || STAR_TIERS[0];
const getNextTier = s => { const i = STAR_TIERS.findIndex(t => s >= t.min && s <= t.max); return i < STAR_TIERS.length-1 ? STAR_TIERS[i+1] : null; };
function daysUntil(d) { const t=new Date(); t.setHours(0,0,0,0); const x=new Date(d); x.setHours(0,0,0,0); return Math.ceil((x-t)/86400000); }
function enrich(list) { return list.map(o => ({...o, daysUntil:daysUntil(o.date), urgent:daysUntil(o.date)<=14})); }
const RAW = [{id:1,personId:2,type:"Anniversary",date:"2026-05-10"},{id:2,personId:1,type:"Birthday",date:"2026-06-15"},{id:3,personId:3,type:"Birthday",date:"2026-07-08"},{id:4,personId:4,type:"Work Anniversary",date:"2026-08-14"}];
const INIT_PEOPLE = [{id:1,name:"Mom",emoji:"👩",relation:"Family",interests:["gardening","cooking","yoga"],personality:"nurturing",budget:80},{id:2,name:"Alex",emoji:"👫",relation:"Partner",interests:["photography","hiking","coffee"],personality:"adventurous",budget:150},{id:3,name:"Jake",emoji:"🧑",relation:"Friend",interests:["gaming","music","tech"],personality:"creative",budget:60},{id:4,name:"Sarah",emoji:"👩‍💼",relation:"Colleague",interests:["books","wellness","travel"],personality:"intellectual",budget:40}];
const PAST = [{personId:1,year:2025,gift:"Cookbook",reaction:"😍"},{personId:2,year:2025,gift:"Camera Bag",reaction:"😊"},{personId:3,year:2025,gift:"Gaming Headset",reaction:"🤩"}];

function exportICS(occ, person) {
  const pad = n => String(n).padStart(2,"0"), d = new Date(occ.date), fmt = dt => `${dt.getFullYear()}${pad(dt.getMonth()+1)}${pad(dt.getDate())}`, next = new Date(d);
  next.setDate(d.getDate()+1);
  const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Giftmate//EN","BEGIN:VEVENT",`DTSTART;VALUE=DATE:${fmt(d)}`,`DTEND;VALUE=DATE:${fmt(next)}`,`SUMMARY:🎁 ${person.name}'s ${occ.type}`,`UID:gm-${occ.id}@giftmate.app`,"BEGIN:VALARM","TRIGGER:-P10D","ACTION:DISPLAY","DESCRIPTION:10 day reminder!","END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a"); a.href = "data:text/calendar;charset=utf-8," + encodeURIComponent(ics); a.download = `${person.name}.ics`; document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function getRetailers(name="", emoji="", city="") {
  const t = (name+" "+emoji).toLowerCase();
  const isProduct = /\bmap\b|print|poster|\bkit\b|\bbook\b|journal|mug|flask|pan|\bset\b|candle|notebook|frame|engraved|personali|custom|scratch|puzzle|lamp|pillow|blanket|perfume|necklace|bracelet|watch|bag|wallet|olive oil|cheese|hamper|basket/.test(t)
    && !/\btour\b|\bhike\b|hiking|trekking|guided|experience|activity|class|lesson/.test(t);
  let cat = "product";
  if (!isProduct) {
    if (/flight|fly|plane|airline|✈/.test(t+emoji)) cat = "flights";
    else if (/\bhotel\b|\bstay\b|resort/.test(t)) cat = "hotels";
    else if (/\bclass\b|\bworkshop\b|lesson|course|learn to/.test(t)) cat = "experience";
    else if (/concert|ticket|festival|🎟|🎭/.test(t+emoji)) cat = "events";
    else if (/\bspa\b|massage|facial|💆/.test(t+emoji)) cat = "spa";
    else if (/\brestaurant\b|dinner reservation|food tour|chef.s table|🍽/.test(t+emoji)) cat = "dining";
    else if (/balloon|hot air|gondola|zip.?lin|bungee|skydive|kayak rental|canoe|rafting|climbing.*pass|sailing|🏄|🧗|🪂|🎈|⛵/.test(t+emoji)) cat = "adventure";
    else if (/\btour\b|\bhike\b|hiking|trekking|photography.*tour|guided|sunrise.*tour|sunset.*tour|experience|day.*trip|activity/.test(t)) cat = "adventure";
  }
  const q = encodeURIComponent(city ? `${name} ${city}`.trim() : name);
  const qCity = encodeURIComponent(city||name);
  const R = {
    flights: [
      {name:"Skyscanner",emoji:"✈️",color:"#0770E3",bg:"#0770E322",url:`https://www.skyscanner.net/transport/flights/?query=${q}`,badge:"Best prices"},
      {name:"Google Flights",emoji:"🔍",color:"#4285F4",bg:"#4285F422",url:`https://www.google.com/travel/flights?q=${q}`,badge:"Compare all"},
      {name:"Kayak",emoji:"🧳",color:"#FF690F",bg:"#FF690F22",url:`https://www.kayak.com/flights?q=${q}`,badge:"Price alerts"},
    ],
    hotels: [
      {name:"Booking.com",emoji:"🏨",color:"#003580",bg:"#00358022",url:`https://www.booking.com/searchresults.html?ss=${qCity}&aid=7891172`,badge:"Free cancellation"},
      {name:"Hotels.com",emoji:"🛎️",color:"#D4001A",bg:"#D4001A22",url:`https://www.hotels.com/search.do?q-destination=${qCity}`,badge:"Rewards nights"},
      {name:"TripAdvisor",emoji:"🦉",color:"#34E0A1",bg:"#34E0A122",url:`https://www.tripadvisor.com/Search?q=${qCity}+hotels`,badge:"Trusted reviews"},
    ],
    experience: [
      {name:"Viator",emoji:"🗺️",color:"#14B8A6",bg:"#14B8A622",url:`https://www.viator.com/searchResults/all?text=${q}&pid=P00291182&mcid=42383&medium=api`,badge:"Book & go"},
      {name:"GetYourGuide",emoji:"🎯",color:"#FF5000",bg:"#FF500022",url:`https://www.getyourguide.com/s/?q=${q}&partner_id=YHVA20C`,badge:"Instant confirm"},
      {name:"TripAdvisor",emoji:"🦉",color:"#34E0A1",bg:"#34E0A122",url:`https://www.tripadvisor.com/Search?q=${q}`,badge:"Top rated"},
    ],
    events: [
      {name:"Fever",emoji:"🔥",color:"#EF4444",bg:"#EF444422",url:`https://feverup.com/en/search?q=${qCity}`,badge:"Top events"},
      {name:"Ticketmaster",emoji:"🎫",color:"#026CDF",bg:"#026CDF22",url:`https://www.ticketmaster.com/search?q=${q}`,badge:"Official"},
      {name:"Viator",emoji:"🗺️",color:"#14B8A6",bg:"#14B8A622",url:`https://www.viator.com/searchResults/all?text=${q}&pid=P00291182&mcid=42383&medium=api`,badge:"Experiences"},
    ],
    spa: [
      {name:"Treatwell",emoji:"💆",color:"#7C3AED",bg:"#7C3AED22",url:`https://www.treatwell.com/search/?q=${qCity}`,badge:"Instant booking"},
      {name:"Viator",emoji:"🗺️",color:"#14B8A6",bg:"#14B8A622",url:`https://www.viator.com/searchResults/all?text=${q}+spa&pid=P00291182&mcid=42383&medium=api`,badge:"Spa packages"},
      {name:"TripAdvisor",emoji:"🦉",color:"#34E0A1",bg:"#34E0A122",url:`https://www.tripadvisor.com/Search?q=${q}+spa+${qCity}`,badge:"Reviewed"},
    ],
    dining: [
      {name:"OpenTable",emoji:"🍽️",color:"#DA3743",bg:"#DA374322",url:`https://www.opentable.com/s?q=${qCity}`,badge:"Reserve now"},
      {name:"Viator",emoji:"🗺️",color:"#14B8A6",bg:"#14B8A622",url:`https://www.viator.com/searchResults/all?text=${q}&pid=P00291182&mcid=42383&medium=api`,badge:"Food tours"},
      {name:"TripAdvisor",emoji:"🦉",color:"#34E0A1",bg:"#34E0A122",url:`https://www.tripadvisor.com/Restaurants-g${qCity}`,badge:"Top restaurants"},
    ],
    adventure: [
      {name:"GetYourGuide",emoji:"🎯",color:"#FF5000",bg:"#FF500022",url:`https://www.getyourguide.com/s/?q=${q}&partner_id=YHVA20C`,badge:"Adventures"},
      {name:"Viator",emoji:"🗺️",color:"#14B8A6",bg:"#14B8A622",url:`https://www.viator.com/searchResults/all?text=${q}&pid=P00291182&mcid=42383&medium=api`,badge:"Guided"},
      {name:"TripAdvisor",emoji:"🦉",color:"#34E0A1",bg:"#34E0A122",url:`https://www.tripadvisor.com/Attractions-g${qCity}`,badge:"Top rated"},
    ],
    product: [
      {name:"Amazon",emoji:"📦",color:"#FF9900",bg:"#FF990022",url:`https://www.amazon.com/s?k=${q}&tag=giftmate0d-20`,badge:"Fast delivery"},
      {name:"Etsy",emoji:"🎨",color:"#F56400",bg:"#F5640022",url:`https://www.etsy.com/search?q=${q}`,badge:"Handmade"},
      {name:"Not on the High Street",emoji:"✨",color:"#C8A96E",bg:"#C8A96E22",url:`https://www.notonthehighstreet.com/search?search_term=${q}`,badge:"Personalised"},
      {name:"UncommonGoods",emoji:"🦋",color:"#5B8C5A",bg:"#5B8C5A22",url:`https://www.uncommongoods.com/search?q=${q}`,badge:"Unique finds"},
    ],
  };
  const L = { flights:"✈️ Flights", hotels:"🏨 Hotels", experience:"🎟️ Experiences", events:"🎭 Events", spa:"💆 Wellness", dining:"🍽️ Dining", adventure:"🏄 Adventure", product:"🛍️ Products" };
  return { retailers: R[cat]||R.product, label: L[cat]||L.product };
}

// ── UI Primitives ─────────────────────────────────────────────────────────────
function Tag({ children, color=P.teal }) {
  return (
    <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600,letterSpacing:"0.04em",textTransform:"uppercase"}}>{children}</span>
  );
}
function Spin({ size=20 }) {
  return <div style={{width:size,height:size,borderRadius:"50%",border:`2px solid ${P.teal}30`,borderTop:`2px solid ${P.teal}`,display:"inline-block",animation:"_s .8s linear infinite"}}/>;
}
function RichText({ text }) {
  const bold = s => s.split(/(\*\*[^*]+\*\*)/).map((p,j) => /^\*\*/.test(p) ? <strong key={j} style={{color:P.text,fontWeight:700}}>{p.slice(2,-2)}</strong> : p);
  return (
    <div>
      {(text||"").split("\n").map((line,i) => {
        const t = line.trim(), ib = /^[-•]\s/.test(t), c = ib ? t.slice(2) : t;
        if (!c) return <div key={i} style={{height:6}}/>;
        if (ib) return <div key={i} style={{display:"flex",gap:8,marginBottom:6}}><span style={{color:P.tealL,fontWeight:700}}>›</span><span style={{lineHeight:1.6}}>{bold(c)}</span></div>;
        return <div key={i} style={{marginBottom:4,lineHeight:1.65}}>{bold(c)}</div>;
      })}
    </div>
  );
}
function StarsBadge({ stars, onClick }) {
  const tier = getTier(stars);
  return (
    <button onClick={onClick} style={{background:`${P.teal}18`,border:`1px solid ${P.teal}44`,borderRadius:20,padding:"4px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
      <span style={{fontSize:14}}>{tier.icon}</span>
      <span style={{color:P.tealL,fontWeight:700,fontSize:13}}>{stars.toLocaleString()} ⭐</span>
    </button>
  );
}
function StarEarnToast({ event }) {
  if (!event) return null;
  const a = STAR_ACTIONS[event];
  return (
    <div style={{position:"fixed",top:70,right:20,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",padding:"10px 18px",borderRadius:12,fontWeight:700,fontSize:14,zIndex:5000,animation:"ti .3s ease",display:"flex",alignItems:"center",gap:8,boxShadow:"0 8px 24px #F59E0B44"}}>
      <span style={{fontSize:20}}>{a?.icon}</span>
      <div><div>+{a?.stars} Stars earned!</div><div style={{fontSize:11,fontWeight:400,opacity:0.8}}>{a?.label}</div></div>
    </div>
  );
}

// ── Mascot ────────────────────────────────────────────────────────────────────
function Mascot({ size=48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" fill="#F4A438"/>
      <ellipse cx="40" cy="29" rx="15" ry="16" fill="#FDDCB5"/>
      <ellipse cx="40" cy="15" rx="15" ry="7" fill="#5B21E6"/>
      <ellipse cx="28" cy="21" rx="5" ry="8" fill="#5B21E6"/>
      <ellipse cx="52" cy="21" rx="5" ry="8" fill="#5B21E6"/>
      <ellipse cx="34" cy="29" rx="2.8" ry="3.2" fill="#0D0D1A"/>
      <ellipse cx="46" cy="29" rx="2.8" ry="3.2" fill="#0D0D1A"/>
      <circle cx="35" cy="27.5" r="1" fill="white"/>
      <circle cx="47" cy="27.5" r="1" fill="white"/>
      <path d="M33 36 Q40 42 47 36" stroke="#0D0D1A" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <ellipse cx="30" cy="34" rx="3.5" ry="2" fill="#F9A8D4" opacity="0.7"/>
      <ellipse cx="50" cy="34" rx="3.5" ry="2" fill="#F9A8D4" opacity="0.7"/>
      <path d="M23 58 Q23 47 40 47 Q57 47 57 58 L57 70 Q40 76 23 70Z" fill="#5B21E6"/>
      <path d="M36 53 Q40 50 44 53 Q40 56 36 53Z" fill="#F4A438" opacity="0.9"/>
      <circle cx="40" cy="53" r="1.8" fill="#F4A438"/>
      <ellipse cx="18" cy="57" rx="4.5" ry="9" fill="#5B21E6" transform="rotate(-15 18 57)"/>
      <ellipse cx="62" cy="57" rx="4.5" ry="9" fill="#5B21E6" transform="rotate(15 62 57)"/>
      <circle cx="14" cy="65" r="4.5" fill="#FDDCB5"/>
      <circle cx="66" cy="65" r="4.5" fill="#FDDCB5"/>
      <rect x="30" y="61" width="20" height="14" rx="2" fill="#FDE68A"/>
      <rect x="29" y="58" width="22" height="5" rx="2" fill="#F59E0B"/>
      <line x1="40" y1="58" x2="40" y2="75" stroke="#D97706" strokeWidth="1.4"/>
      <line x1="29" y1="60.5" x2="51" y2="60.5" stroke="#D97706" strokeWidth="1.4"/>
      <path d="M40 58 Q37.5 55 38.5 58" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <path d="M40 58 Q42.5 55 41.5 58" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

// ── Calendar ──────────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
function CalendarView({ occasions, people, onPick, onAdd, notifPerm, onEnableNotif }) {
  const today = new Date();
  const [yr, setYr] = useState(today.getFullYear());
  const [mo, setMo] = useState(today.getMonth());
  const dim = new Date(yr,mo+1,0).getDate(), first = new Date(yr,mo,1).getDay(), byDay = {};
  occasions.forEach(o => { const d=new Date(o.date); if(d.getFullYear()===yr&&d.getMonth()===mo){const day=d.getDate();if(!byDay[day])byDay[day]=[];byDay[day].push(o);} });
  const prev = () => mo===0?(setMo(11),setYr(y=>y-1)):setMo(m=>m-1);
  const next = () => mo===11?(setMo(0),setYr(y=>y+1)):setMo(m=>m+1);
  const cells = [...Array(first).fill(null), ...Array.from({length:dim},(_,i)=>i+1)];
  const isToday = d => d===today.getDate()&&mo===today.getMonth()&&yr===today.getFullYear();
  return (
    <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,overflow:"hidden",marginBottom:24}}>
      <div style={{padding:"16px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={prev} style={{background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:16}}>‹</button>
          <span style={{fontFamily:"'Fraunces',serif",fontSize:17,fontWeight:900,minWidth:175,textAlign:"center"}}>{MONTHS[mo]} {yr}</span>
          <button onClick={next} style={{background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:16}}>›</button>
        </div>
        <div style={{display:"flex",gap:7}}>
          <button onClick={onAdd} style={{background:`linear-gradient(135deg,${P.indigo},${P.teal})`,color:"#fff",border:"none",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ Add</button>
          <button onClick={onEnableNotif} style={{background:notifPerm==="granted"?P.green+"22":"transparent",border:`1px solid ${notifPerm==="granted"?P.green:P.border}`,color:notifPerm==="granted"?P.green:P.muted,borderRadius:8,padding:"5px 10px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{notifPerm==="granted"?"🔔 On":"🔔 Alerts"}</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",padding:"12px 12px 0"}}>
        {WDAYS.map(d => <div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:P.faint,paddingBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,padding:"0 12px 12px"}}>
        {cells.map((day,i) => {
          if (!day) return <div key={`e${i}`}/>;
          const occs = byDay[day]||[], tod = isToday(day);
          return (
            <div key={day} onClick={() => occs.length&&onPick(occs[0])} style={{minHeight:44,borderRadius:8,padding:"4px 3px",background:tod?P.teal+"33":"transparent",border:`1px solid ${tod?P.teal+"66":occs.length?P.teal+"22":"transparent"}`,cursor:occs.length?"pointer":"default"}}
              onMouseEnter={e=>{if(occs.length)e.currentTarget.style.background=P.teal+"20";}}
              onMouseLeave={e=>{e.currentTarget.style.background=tod?P.teal+"33":"transparent";}}>
              <div style={{fontSize:11,fontWeight:tod?800:400,color:tod?P.teal:P.muted,textAlign:"center",marginBottom:2}}>{day}</div>
              {occs.map((o,oi) => { const p=people.find(x=>x.id===o.personId); return <div key={oi} style={{fontSize:9,background:o.urgent?"#F59E0B44":"#EC489933",color:o.urgent?"#F59E0B":"#F9A8D4",borderRadius:3,padding:"1px 3px",marginBottom:1,fontWeight:700,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p?.emoji}{p?.name}</div>; })}
            </div>
          );
        })}
      </div>
      <div style={{borderTop:`1px solid ${P.border}`,padding:"8px 20px",display:"flex",gap:14,fontSize:11,color:P.faint,flexWrap:"wrap"}}>
        <span><span style={{color:"#F59E0B"}}>●</span> Urgent</span>
        <span><span style={{color:"#F9A8D4"}}>●</span> Upcoming</span>
        <span><span style={{color:P.teal}}>●</span> Today</span>
        <span style={{marginLeft:"auto"}}>Click date for gift ideas</span>
      </div>
    </div>
  );
}

// ── Add Occasion Modal ────────────────────────────────────────────────────────
const OCC_TYPES = ["Birthday","Anniversary","Graduation","Christmas","Valentine's Day","Mother's Day","Father's Day","Wedding","Baby Shower","Other"];
function AddModal({ people, onAdd, onClose }) {
  const [form, setForm] = useState({personId:String(people[0]?.id||""),type:"Birthday",date:"",notify:true});
  const inp = {width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:10,padding:"9px 13px",color:P.text,fontSize:14,marginBottom:12,fontFamily:"inherit"};
  const submit = () => { if(!form.date||!form.personId)return; const d=daysUntil(form.date); onAdd({...form,personId:Number(form.personId),daysUntil:d,urgent:d<=14,id:Date.now()}); onClose(); };
  return (
    <div style={{position:"fixed",inset:0,background:"#00000090",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:28,width:"100%",maxWidth:400}}>
        <h2 style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:900,marginBottom:16}}>Add Occasion 🗓️</h2>
        <div style={{background:`${P.gold}18`,border:`1px solid ${P.gold}33`,borderRadius:8,padding:"7px 12px",marginBottom:14,fontSize:12,color:P.goldL,display:"flex",gap:7,alignItems:"center"}}><span>⭐</span><span>Earn <strong>+10 Stars</strong>!</span></div>
        <label style={{fontSize:11,color:P.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Person</label>
        <select value={form.personId} onChange={e=>setForm(f=>({...f,personId:e.target.value}))} style={{...inp,marginTop:5}}>{people.map(p=><option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}</select>
        <label style={{fontSize:11,color:P.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Type</label>
        <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={{...inp,marginTop:5}}>{OCC_TYPES.map(t=><option key={t}>{t}</option>)}</select>
        <label style={{fontSize:11,color:P.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>Date</label>
        <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{...inp,marginTop:5}}/>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,cursor:"pointer"}} onClick={()=>setForm(f=>({...f,notify:!f.notify}))}>
          <div style={{width:18,height:18,borderRadius:5,background:form.notify?P.teal:"transparent",border:`2px solid ${form.notify?P.teal:P.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#000",flexShrink:0}}>{form.notify?"✓":""}</div>
          <span style={{fontSize:13,color:P.muted}}>Remind me 10 days before</span>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={submit} style={{flex:1,background:`linear-gradient(135deg,${P.indigo},${P.teal})`,color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontWeight:700,fontSize:14,cursor:"pointer"}}>Add ✓</button>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:10,padding:"11px 16px",cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Add Person Modal ──────────────────────────────────────────────────────────
const RELATIONS = ["Partner","Family","Friend","Colleague","Other"];
const PERSONALITIES = ["adventurous","nurturing","creative","intellectual","playful","romantic","practical","spiritual"];
const EMOJIS = ["👩","👨","👧","👦","👴","👵","🧑","👫","👭","👬","🧔","👩‍💼","👨‍💼","🧑‍🎤","🧑‍🍳","🧑‍🎨"];
function AddPersonModal({ onAdd, onClose }) {
  const [form, setForm] = useState({name:"",emoji:"👤",relation:"Friend",personality:"adventurous",budget:50});
  const [interests, setInterests] = useState([]);
  const [inp, setInp] = useState("");
  const [step, setStep] = useState(1);
  const fStyle = {width:"100%",background:"#0D0D1A",border:`1px solid ${P.border}`,borderRadius:10,padding:"9px 13px",color:P.text,fontSize:14,fontFamily:"inherit"};
  const addI = () => { const t=inp.trim().toLowerCase(); if(t&&!interests.includes(t)&&interests.length<8){setInterests(a=>[...a,t]);setInp("");} };
  const submit = () => { if(!form.name.trim()||!interests.length)return; onAdd({id:Date.now(),name:form.name.trim(),emoji:form.emoji,relation:form.relation,interests,personality:form.personality,budget:Number(form.budget)}); onClose(); };
  const chipStyle = (active) => ({padding:"6px 14px",borderRadius:20,border:`1px solid ${active?P.teal:P.border}`,background:active?P.teal+"22":"transparent",color:active?P.teal:P.muted,fontSize:13,fontWeight:600,cursor:"pointer"});
  return (
    <div style={{position:"fixed",inset:0,background:"#00000090",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:24,padding:28,width:"100%",maxWidth:440,boxShadow:"0 24px 60px #00000066"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <Mascot size={50}/>
          <div>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:900,marginBottom:3}}>Add Someone Special 💛</h2>
            <p style={{color:P.muted,fontSize:13}}>{step===1?"Tell me who they are":"What are they like?"} <span style={{color:P.teal}}>{step}/2</span></p>
          </div>
        </div>
        <div style={{background:P.border,borderRadius:99,height:4,marginBottom:20}}>
          <div style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${P.indigo},${P.teal})`,width:step===1?"50%":"100%",transition:"width .4s ease"}}/>
        </div>
        {step===1 && (
          <>
            <label style={{fontSize:11,color:P.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>Avatar</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,margin:"8px 0 14px"}}>
              {EMOJIS.map(e => <button key={e} onClick={()=>setForm(f=>({...f,emoji:e}))} style={{width:36,height:36,fontSize:20,borderRadius:9,border:`2px solid ${form.emoji===e?P.teal:P.border}`,background:form.emoji===e?P.teal+"22":"transparent",cursor:"pointer"}}>{e}</button>)}
            </div>
            <label style={{fontSize:11,color:P.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>Name</label>
            <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Sofia" style={{...fStyle,marginTop:5,marginBottom:14}}/>
            <label style={{fontSize:11,color:P.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>Relationship</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,margin:"8px 0 20px"}}>
              {RELATIONS.map(r => <button key={r} onClick={()=>setForm(f=>({...f,relation:r}))} style={chipStyle(form.relation===r)}>{r}</button>)}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>form.name.trim()&&setStep(2)} style={{flex:1,background:form.name.trim()?`linear-gradient(135deg,${P.indigo},${P.teal})`:P.border,color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontWeight:700,fontSize:14,cursor:form.name.trim()?"pointer":"default"}}>Next →</button>
              <button onClick={onClose} style={{background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:10,padding:"11px 16px",cursor:"pointer"}}>Cancel</button>
            </div>
          </>
        )}
        {step===2 && (
          <>
            <label style={{fontSize:11,color:P.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>Personality</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,margin:"8px 0 14px"}}>
              {PERSONALITIES.map(p => <button key={p} onClick={()=>setForm(f=>({...f,personality:p}))} style={{...chipStyle(form.personality===p),textTransform:"capitalize"}}>{p}</button>)}
            </div>
            <label style={{fontSize:11,color:P.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>Interests</label>
            <div style={{display:"flex",gap:8,margin:"8px 0 8px"}}>
              <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addI()} placeholder="e.g. hiking, cooking…" style={{...fStyle,flex:1}}/>
              <button onClick={addI} style={{background:P.teal,color:"#000",border:"none",borderRadius:10,padding:"9px 14px",fontWeight:700,fontSize:13,cursor:"pointer"}}>+ Add</button>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,minHeight:28,marginBottom:14}}>
              {interests.map(i => <span key={i} onClick={()=>setInterests(a=>a.filter(x=>x!==i))} style={{background:P.teal+"22",color:P.teal,border:`1px solid ${P.teal}44`,borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{i} ×</span>)}
              {!interests.length && <span style={{color:P.faint,fontSize:12}}>Add at least one interest</span>}
            </div>
            <label style={{fontSize:11,color:P.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>Gift budget</label>
            <div style={{display:"flex",alignItems:"center",gap:12,margin:"8px 0 14px"}}>
              <input type="range" min="10" max="500" step="10" value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))} style={{flex:1,accentColor:P.teal}}/>
              <span style={{color:P.teal,fontWeight:800,fontSize:16,minWidth:48}}>${form.budget}</span>
            </div>
            <div style={{background:`${P.gold}18`,border:`1px solid ${P.gold}33`,borderRadius:8,padding:"7px 12px",marginBottom:14,fontSize:12,color:P.goldL,display:"flex",gap:7,alignItems:"center"}}><span>⭐</span><span>Earn <strong>+15 Stars</strong>!</span></div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setStep(1)} style={{background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:10,padding:"11px 16px",cursor:"pointer"}}>← Back</button>
              <button onClick={submit} disabled={!interests.length} style={{flex:1,background:interests.length?`linear-gradient(135deg,${P.indigo},${P.teal})`:P.border,color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontWeight:700,fontSize:14,cursor:interests.length?"pointer":"default"}}>Add {form.name||"Person"} 🎉</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Buy Modal ─────────────────────────────────────────────────────────────────
function BuyModal({ modal, onOpen, onMarkBought, onClose }) {
  if (!modal) return null;
  const { gift } = modal, { retailers, label } = getRetailers(gift.name, gift.emoji||"", modal.city||"");
  return (
    <div style={{position:"fixed",inset:0,background:"#00000090",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:28,width:"100%",maxWidth:460,boxShadow:"0 20px 60px #00000066"}}>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:44,marginBottom:8}}>{gift.emoji}</div>
          <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:900,marginBottom:4}}>{gift.name}</div>
          <div style={{color:P.muted,fontSize:13,marginBottom:6}}>{gift.reason}</div>
          <div style={{color:P.green,fontWeight:800,fontSize:18}}>${gift.price}</div>
        </div>
        <div style={{background:P.indigo+"18",border:`1px solid ${P.indigo}33`,borderRadius:10,padding:"9px 13px",marginBottom:12,fontSize:12,color:P.muted,display:"flex",gap:8}}><span>💡</span><span>Browse retailers below — then mark as bought when done.</span></div>
        <div style={{fontSize:11,color:P.faint,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>Where to buy</div>
        <div style={{fontSize:13,color:P.teal,fontWeight:600,marginBottom:10}}>{label}</div>
        {/* Sponsored slot — sell this to brands for €200-500/month */}
        <div style={{background:`linear-gradient(135deg,${P.gold}18,${P.indigo}18)`,border:`1px solid ${P.gold}44`,borderRadius:12,padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}
          onClick={()=>window.open(`mailto:hello@giftmate.app?subject=Featured Partner Enquiry`,"_blank")}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:18}}>⭐</span>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:P.text}}>Featured Partner Slot</div>
              <div style={{fontSize:11,color:P.muted}}>Promote your brand here · Contact us</div>
            </div>
          </div>
          <span style={{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:800}}>SPONSOR</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {retailers.map(r => (
            <button key={r.name} onClick={()=>onOpen(gift,r)} style={{background:r.bg,border:`1px solid ${r.color}44`,borderRadius:12,padding:"11px 15px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=r.color+"99";e.currentTarget.style.transform="translateX(3px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=r.color+"44";e.currentTarget.style.transform="none";}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>{r.emoji}</span>
                <div><div style={{fontWeight:700,fontSize:14,color:P.text,textAlign:"left"}}>{r.name}</div><div style={{fontSize:11,color:P.muted}}>{r.badge}</div></div>
              </div>
              <span style={{color:r.color,fontWeight:700}}>Open ↗</span>
            </button>
          ))}
        </div>
        <button onClick={()=>onMarkBought(gift)} style={{width:"100%",background:`linear-gradient(135deg,${P.green},#059669)`,color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:8}}>✓ Mark as Bought</button>
        <button onClick={onClose} style={{width:"100%",background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:10,padding:"9px 0",fontSize:14,cursor:"pointer"}}>Close</button>
      </div>
    </div>
  );
}

// ── Gift Cards ────────────────────────────────────────────────────────────────
function GiftCard({ gift, onBuy }) {
  const [h,setH] = useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:h?P.cardH:P.card,border:`1px solid ${h?P.teal+"66":P.border}`,borderRadius:16,padding:18,transition:"all .2s",transform:h?"translateY(-2px)":"none"}}>
      <div style={{fontSize:34,marginBottom:8}}>{gift.emoji}</div>
      <div style={{fontWeight:700,fontSize:14,marginBottom:5}}>{gift.name}</div>
      <div style={{color:P.muted,fontSize:12,lineHeight:1.5,marginBottom:12}}>{gift.reason}</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><span style={{color:P.green,fontWeight:700,fontSize:15}}>${gift.price}</span><span style={{color:P.goldL,fontSize:11,marginLeft:6}}>+20⭐</span></div>
        <button onClick={()=>onBuy(gift)} style={{background:`linear-gradient(135deg,${P.indigo},${P.teal})`,color:"#fff",border:"none",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>Buy Now →</button>
      </div>
    </div>
  );
}
function ChatGiftCard({ gift, onBuy, bought }) {
  return (
    <div style={{background:bought?P.green+"18":"#1E1E3A",border:`1px solid ${bought?P.green+"55":P.border}`,borderRadius:11,padding:"9px 12px",marginBottom:7,display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
      <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
        <span style={{fontSize:22,flexShrink:0}}>{gift.emoji}</span>
        <div style={{minWidth:0}}>
          <div style={{fontWeight:700,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{gift.name}</div>
          <div style={{fontSize:11,color:P.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{gift.reason}</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
        <span style={{color:P.green,fontWeight:700,fontSize:13}}>${gift.price}</span>
        {bought
          ? <span style={{color:P.green,fontSize:11,fontWeight:700,background:P.green+"22",border:`1px solid ${P.green}44`,borderRadius:6,padding:"3px 8px"}}>✓ Bought</span>
          : <button onClick={()=>onBuy(gift)} style={{background:`linear-gradient(135deg,${P.indigo},${P.teal})`,color:"#fff",border:"none",borderRadius:7,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Buy →</button>
        }
      </div>
    </div>
  );
}
function ChatMsg({ msg, onBuy, purchased }) {
  const isUser = msg.role==="user";
  return (
    <div style={{display:"flex",justifyContent:isUser?"flex-end":"flex-start",marginBottom:14,gap:8,alignItems:"flex-start"}}>
      {!isUser && (
        <svg width="30" height="30" viewBox="0 0 44 44" fill="none" style={{flexShrink:0}}>
          <circle cx="22" cy="22" r="22" fill="#F4A438"/>
          <text x="22" y="20" textAnchor="middle" fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic" fontWeight="900" fontSize="11" fill="#0A0A18" letterSpacing="0.5">gift</text>
          <text x="22" y="32" textAnchor="middle" fontFamily="Arial Black,Impact,sans-serif" fontWeight="900" fontSize="13.5" fill="#0A0A18" letterSpacing="0.8">MATE</text>
        </svg>
      )}
      <div style={{maxWidth:"78%",minWidth:0,background:isUser?`linear-gradient(135deg,${P.indigo},#3B0FA3)`:P.card,color:P.text,borderRadius:isUser?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"11px 15px",fontSize:14,lineHeight:1.6,border:!isUser?`1px solid ${P.border}`:"none",wordBreak:"break-word",overflowWrap:"break-word"}}>
        {isUser ? <span>{msg.content}</span> : <RichText text={msg.content}/>}
        {!isUser && msg.gifts?.length>0 && (
          <div style={{marginTop:12,borderTop:`1px solid ${P.border}`,paddingTop:10}}>
            <div style={{fontSize:10,fontWeight:700,color:P.faint,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:7}}>🛒 Ready to buy</div>
            {msg.gifts.map((g,i) => <ChatGiftCard key={i} gift={g} onBuy={onBuy} bought={purchased.some(p=>p.name===g.name)}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stars Tab ─────────────────────────────────────────────────────────────────
function StarsTab({ stars, history, onRedeem, onShare }) {
  const tier = getTier(stars), next = getNextTier(stars);
  const progress = next ? Math.round(((stars-tier.min)/(next.min-tier.min))*100) : 100;
  return (
    <div className="fi">
      <div style={{background:`linear-gradient(135deg,${P.goldD}33,${P.indigo}33)`,border:`1px solid ${P.gold}33`,borderRadius:20,padding:28,marginBottom:20,textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,fontSize:120,opacity:0.06}}>⭐</div>
        <div style={{fontSize:52,marginBottom:6}}>{tier.icon}</div>
        <div style={{fontFamily:"'Fraunces',serif",fontSize:14,color:P.gold,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{tier.name} Member</div>
        <div style={{fontFamily:"'Fraunces',serif",fontSize:48,fontWeight:900,color:P.goldL,marginBottom:4}}>{stars.toLocaleString()}</div>
        <div style={{color:P.muted,fontSize:14,marginBottom:16}}>Stars earned</div>
        {next && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:P.muted,marginBottom:6}}><span>{tier.name}</span><span>{next.name} at {next.min.toLocaleString()} ⭐</span></div>
            <div style={{background:P.border,borderRadius:99,height:8,overflow:"hidden"}}><div style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${P.goldD},${P.gold})`,width:`${progress}%`,transition:"width 1s ease"}}/></div>
            <div style={{fontSize:12,color:P.muted,marginTop:6}}>{(next.min-stars).toLocaleString()} more Stars to {next.name}</div>
          </div>
        )}
      </div>
      <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:20,marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>Your {tier.name} Perks</div>
        {tier.perks.map((perk,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:7}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:tier.color+"33",border:`1px solid ${tier.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:tier.color,flexShrink:0}}>✓</div>
            <span style={{fontSize:13,color:P.muted}}>{perk}</span>
          </div>
        ))}
      </div>
      <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:20,marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>How to Earn Stars ⭐</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {Object.values(STAR_ACTIONS).map(a => (
            <div key={a.label} style={{background:P.bg,border:`1px solid ${P.border}`,borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>{a.icon}</span>
              <div><div style={{fontSize:12,fontWeight:600}}>{a.label}</div><div style={{color:P.gold,fontSize:13,fontWeight:700}}>+{a.stars} ⭐</div></div>
            </div>
          ))}
        </div>
        <button onClick={onShare} style={{width:"100%",marginTop:12,background:`linear-gradient(135deg,${P.indigo},${P.teal})`,color:"#fff",border:"none",borderRadius:12,padding:"13px 0",fontSize:14,fontWeight:700,cursor:"pointer"}}>
          📲 Share Giftmate — Earn +10 Stars
        </button>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>Redeem Stars 🎁</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {STAR_REWARDS.map(r => {
            const can = stars >= r.cost;
            return (
              <div key={r.id} style={{background:P.card,border:`1px solid ${can?P.gold+"44":P.border}`,borderRadius:14,padding:16,opacity:can?1:0.6}}>
                <div style={{fontSize:30,marginBottom:6}}>{r.icon}</div>
                <div style={{fontWeight:700,fontSize:13,marginBottom:3}}>{r.title}</div>
                <div style={{fontSize:11,color:P.muted,marginBottom:10}}>{r.desc} · {r.partner}</div>
                <button onClick={()=>can&&onRedeem(r)} disabled={!can} style={{width:"100%",background:can?`linear-gradient(135deg,${P.goldD},${P.gold})`:P.border,color:can?"#000":P.faint,border:"none",borderRadius:8,padding:"7px 0",fontSize:12,fontWeight:700,cursor:can?"pointer":"not-allowed"}}>
                  {can?`Redeem ${r.cost.toLocaleString()} ⭐`:`Need ${(r.cost-stars).toLocaleString()} more ⭐`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {history.length>0 && (
        <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:20}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>Recent Activity</div>
          {history.slice(-8).reverse().map((h,i) => (
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:i<Math.min(history.length,8)-1?`1px solid ${P.border}33`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>{STAR_ACTIONS[h.type]?.icon}</span><span style={{fontSize:13,color:P.muted}}>{STAR_ACTIONS[h.type]?.label}</span></div>
              <span style={{color:P.gold,fontWeight:700,fontSize:13}}>+{h.amount} ⭐</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
function Giftmate() {
  const [tab,setTab] = useState("dashboard");
  const [tabHistory, setTabHistory] = useState([]);
  const goTo = (t) => { setTabHistory(h => [...h, tab]); setTab(t); };
  const goBack = () => { if(tabHistory.length===0) return; const prev=tabHistory[tabHistory.length-1]; setTabHistory(h=>h.slice(0,-1)); setTab(prev); };
  const [userCity, setUserCity] = useState("your city");
  const [userCountry, setUserCountry] = useState("");

  // Detect user location on mount
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => { if(d.city){ setUserCity(d.city); setUserCountry(d.country_name||""); } })
      .catch(() => {
        // Fallback: try browser geolocation → reverse geocode
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
              .then(r=>r.json()).then(d=>{ const city=d.address?.city||d.address?.town||d.address?.village; if(city) setUserCity(city); setUserCountry(d.address?.country||""); }).catch(()=>{});
          });
        }
      });
  }, []);
  const [people,setPeople] = useState(INIT_PEOPLE);
  const [occasions,setOccasions] = useState(()=>enrich(RAW));
  const [selOcc,setSelOcc] = useState(null), [selPerson,setSelPerson] = useState(null);
  const [gifts,setGifts] = useState([]), [loadingGifts,setLoadingGifts] = useState(false);
  const [showCal,setShowCal] = useState(false), [showAdd,setShowAdd] = useState(false), [showAddPerson,setShowAddPerson] = useState(false);
  const [buyModal,setBuyModal] = useState(null);
  const [notifPerm,setNotifPerm] = useState(typeof Notification!=="undefined"?Notification.permission:"default");
  const [chatMsgs,setChatMsgs] = useState([{role:"assistant",content:"Hi! I'm your Giftmate concierge 🎁 Tell me about someone you want to gift and I'll help find the perfect present. Who are you shopping for?"}]);
  const [chatIn,setChatIn] = useState(""), [chatLoading,setChatLoading] = useState(false);
  const [purchased,setPurchased] = useState([]);
  const [toast,setToast] = useState(null);
  const [stars,setStars] = useState(55);
  const [starHistory,setStarHistory] = useState([{type:"ADD_PERSON",amount:15},{type:"ADD_PERSON",amount:15},{type:"ADD_PERSON",amount:15},{type:"ADD_OCCASION",amount:10}]);
  const [starEarnEvent,setStarEarnEvent] = useState(null);
  const chatEnd = useRef(null);
  useEffect(()=>{chatEnd.current?.scrollIntoView({behavior:"smooth"});},[chatMsgs]);
  const showToast = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3200); };
  const earnStars = k => { const a=STAR_ACTIONS[k]; if(!a)return; setStars(s=>s+a.stars); setStarHistory(h=>[...h,{type:k,amount:a.stars}]); setStarEarnEvent(k); setTimeout(()=>setStarEarnEvent(null),3000); };
  const claude = async (sys,user,hist=[]) => { const r=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:MODEL,max_tokens:1000,system:sys,messages:[...hist,{role:"user",content:user}]})}); const d=await r.json(); return d.content?.[0]?.text||""; };
  const pickOccasion = occ => { const p=people.find(x=>x.id===occ.personId); setSelOcc(occ); setSelPerson(p); goTo("recommend"); fetchGifts(occ,p); };
  const fetchGifts = async (occ,person) => {
    setLoadingGifts(true); setGifts([]);
    const past = PAST.find(g=>g.personId===person.id);
    const outdoor = /hiking|outdoors|nature|adventure|travel|camping|surf|climb|cycling|sport/.test(person.interests.join(" ").toLowerCase());
    const locStr = `${userCity}${userCountry?", "+userCountry:""}`;
    const prompt = `Return ONLY a JSON array of exactly 6 gift ideas. Each: {name,emoji,price,reason,category}\n- name: max 5 words. emoji: 1 emoji. price: integer ≤$${person.budget}. reason: 1 sentence. category: product/experience/adventure/spa/dining/events\n- MUST include exactly 3 products AND 3 experiences/activities\n- CRITICAL: All experiences, tours, restaurants, activities MUST be available in or near ${locStr}. Never suggest experiences in other cities.\n${outdoor?"- Outdoor bias: prioritise outdoor experiences and gear near "+locStr:""}\nPerson: ${person.name} (${person.relation}). Occasion: ${occ.type}. Interests: ${person.interests.join(", ")}. Personality: ${person.personality}. Budget: $${person.budget}. Past: ${past?past.gift+" (don't repeat)":"none"}\nUser is located in: ${locStr}`;
    try { const raw=await claude("Return only valid JSON arrays, no markdown.",prompt); const parsed=JSON.parse(raw.replace(/```json|```/g,"").trim()); setGifts(parsed.map((g,i)=>({...g,id:i}))); }
    catch { setGifts([{id:0,name:"Personalised Photo Book",emoji:"📚",price:45,reason:"A beautiful custom memory book.",category:"product"},{id:1,name:"Artisan Gift Hamper",emoji:"🧺",price:65,reason:"Hand-curated premium treats.",category:"product"},{id:2,name:"Experience Voucher",emoji:"🎟️",price:79,reason:"An unforgettable local experience.",category:"experience"}]); }
    setLoadingGifts(false);
  };
  const handleBuy = (gift,fromChat=false) => setBuyModal({gift,person:fromChat?null:selPerson,occasion:fromChat?null:selOcc,city:userCity});
  const openRetailer = (gift,retailer) => { window.open(retailer.url,"_blank"); showToast(`🔗 Opened ${retailer.name}!`); };
  const markBought = gift => { if(!purchased.some(p=>p.name===gift.name)){setPurchased(p=>[...p,{...gift}]); showToast("🎉 Marked as bought!");} setBuyModal(null); };
  const enableNotif = async () => { if(!("Notification"in window)){showToast("Not supported","error");return;} const p=await Notification.requestPermission(); setNotifPerm(p); if(p==="granted"){earnStars("ENABLE_NOTIF");showToast("🔔 Notifications on! +2 Stars!");setTimeout(()=>new Notification("Giftmate 🎁",{body:"Alex's Anniversary in 67 days!"}),1500);}else showToast("Blocked in browser settings","error"); };
  const addOccasion = occ => { setOccasions(prev=>[...prev,occ]); const p=people.find(x=>x.id===occ.personId); earnStars("ADD_OCCASION"); showToast(`🗓️ ${p?.name}'s ${occ.type} added! +10 Stars!`); };
  const addPerson = person => { setPeople(prev=>[...prev,person]); earnStars("ADD_PERSON"); showToast(`🎉 ${person.emoji} ${person.name} added! +15 Stars!`); };
  const shareApp = () => { if(navigator.share){ navigator.share({title:"Giftmate 🎁",text:"AI-powered gift recommendations for everyone you love!",url:"https://giftmate-sigma.vercel.app"}).then(()=>{ earnStars("SHARE_APP"); showToast("📲 Thanks for sharing! +10 Stars!"); }).catch(()=>{}); } else { navigator.clipboard.writeText("https://giftmate-sigma.vercel.app"); earnStars("SHARE_APP"); showToast("📲 Link copied! +10 Stars!"); } };
  const sendChat = async () => {
    if (!chatIn.trim()||chatLoading) return;
    const msg=chatIn.trim(); setChatIn(""); const hist=[...chatMsgs,{role:"user",content:msg}]; setChatMsgs(hist); setChatLoading(true);
    const sys = `You are Giftmate, a warm AI gift concierge. The user is located in ${userCity}${userCountry?", "+userCountry:""}. Always suggest a mix of physical gifts AND local experiences available in ${userCity}. Never suggest experiences in other cities. If outdoor interests mentioned, suggest outdoor experiences local to ${userCity}. Use bullet points (-) and **bold** for gift names. Include price ranges ($50-80). Be specific and warm.`;
    const reply = await claude(sys, msg, chatMsgs.map(m=>({role:m.role,content:m.content})));
    let giftCards = [];
    if (/\$\d+/.test(reply)) { try { const ext=await claude("Return only valid JSON arrays, no markdown.",`Extract gift ideas as JSON [{name,emoji,price,reason}]. Midpoint prices. Return [] if none.\n"${reply}"`); const parsed=JSON.parse(ext.replace(/```json|```/g,"").trim()); giftCards=Array.isArray(parsed)?parsed.slice(0,4):[]; } catch {} }
    setChatMsgs([...hist,{role:"assistant",content:reply,gifts:giftCards}]); setChatLoading(false);
  };
  const nb = t => ({background:tab===t?`${P.teal}22`:"transparent",border:`1px solid ${tab===t?P.teal+"66":"transparent"}`,color:tab===t?P.teal:P.faint,borderRadius:10,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5,transition:"all .2s"});
  return (
    <div style={{background:P.bg,minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:P.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@700;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#FF914D55;border-radius:4px}input,select,textarea{outline:none;color:#F0EEE8;background:transparent;}@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes _s{to{transform:rotate(360deg)}}@keyframes ti{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}.fi{animation:fi .35s ease forwards}`}</style>
      <BuyModal modal={buyModal} onOpen={openRetailer} onMarkBought={markBought} onClose={()=>setBuyModal(null)}/>
      {showAdd && <AddModal people={people} onAdd={addOccasion} onClose={()=>setShowAdd(false)}/>}
      {showAddPerson && <AddPersonModal onAdd={addPerson} onClose={()=>setShowAddPerson(false)}/>}
      {toast && <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:toast.type==="success"?P.green:P.red,color:"#fff",padding:"11px 22px",borderRadius:12,fontWeight:600,fontSize:14,zIndex:4000,animation:"ti .3s ease",whiteSpace:"nowrap"}}>{toast.msg}</div>}
      <StarEarnToast event={starEarnEvent}/>
      {/* Header */}
      <div style={{background:`linear-gradient(180deg,#16163A,${P.bg})`,borderBottom:`1px solid ${P.border}`,padding:"0 20px"}}>
        <div style={{maxWidth:960,margin:"0 auto"}}>
          {/* Top row: back + logo + stars */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:56,gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {tabHistory.length>0 && (
                <button onClick={goBack} style={{background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"5px 11px",cursor:"pointer",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>← Back</button>
              )}
              <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="22" fill="#F4A438"/>
                <text x="22" y="20" textAnchor="middle" fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic" fontWeight="900" fontSize="11" fill="#0A0A18" letterSpacing="0.5">gift</text>
                <text x="22" y="32" textAnchor="middle" fontFamily="Arial Black,Impact,sans-serif" fontWeight="900" fontSize="13.5" fill="#0A0A18" letterSpacing="0.8">MATE</text>
              </svg>
              <div style={{display:"flex",alignItems:"baseline",gap:0}}>
                <span style={{fontFamily:"Georgia,'Times New Roman',serif",fontStyle:"italic",fontWeight:900,fontSize:19,color:P.teal}}>Gift</span>
                <span style={{fontFamily:"'DM Sans',sans-serif",fontWeight:900,fontSize:19,color:P.indigoL,letterSpacing:"-0.02em"}}>mate</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {userCity!=="your city" && <span style={{fontSize:11,color:P.muted,display:"flex",alignItems:"center",gap:4}}>📍{userCity}</span>}
              <StarsBadge stars={stars} onClick={()=>goTo("stars")}/>
            </div>
          </div>
          {/* Bottom row: nav tabs */}
          <div style={{display:"flex",gap:2,paddingBottom:8}}>
            {[["dashboard","🏠","Dashboard"],["recommend","✨","Picks"],["people","👥","People"],["chat","💬","Concierge"],["stars","⭐","Stars"]].map(([t,ic,lb]) => (
              <button key={t} style={nb(t)} onClick={()=>goTo(t)}>
                {ic} {lb}
                {t==="stars" && <span style={{background:P.gold,color:"#000",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:800,marginLeft:2}}>{stars}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:960,margin:"0 auto",padding:"26px 20px"}}>
        {/* DASHBOARD */}
        {tab==="dashboard" && (
          <div className="fi">
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:10,marginBottom:20}}>
              <div><h1 style={{fontFamily:"'Fraunces',serif",fontSize:30,fontWeight:900,marginBottom:5}}>Upcoming Occasions 🗓️</h1><p style={{color:P.muted,fontSize:14}}>Never miss a moment that matters.</p></div>
              <div style={{display:"flex",gap:7,marginTop:4}}>
                <button onClick={()=>setShowCal(v=>!v)} style={{background:showCal?`${P.teal}22`:"transparent",border:`1px solid ${showCal?P.teal:P.border}`,color:showCal?P.teal:P.muted,borderRadius:9,padding:"7px 13px",cursor:"pointer",fontSize:13,fontWeight:600}}>{showCal?"📋 List":"🗓️ Calendar"}</button>
                <button onClick={()=>setShowAdd(true)} style={{background:`linear-gradient(135deg,${P.indigo},${P.teal})`,color:"#fff",border:"none",borderRadius:9,padding:"7px 13px",fontSize:13,fontWeight:700,cursor:"pointer"}}>+ Add Occasion</button>
              </div>
            </div>
            {showCal && <CalendarView occasions={occasions} people={people} onPick={pickOccasion} onAdd={()=>setShowAdd(true)} notifPerm={notifPerm} onEnableNotif={enableNotif}/>}
            {occasions.filter(o=>o.urgent).map(o => { const p=people.find(x=>x.id===o.personId); return (
              <div key={o.id} style={{background:"linear-gradient(135deg,#F59E0B22,#EF444411)",border:"1px solid #F59E0B44",borderRadius:14,padding:18,marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:28}}>⚡</span><div><div style={{fontWeight:700,fontSize:15,color:"#F59E0B"}}>Coming up in {o.daysUntil} days!</div><div style={{fontSize:13}}>{p?.emoji} {p?.name}'s {o.type} — {o.date}</div></div></div>
                <div style={{display:"flex",gap:7}}>
                  <button onClick={()=>exportICS(o,p)} style={{background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>📅 .ics</button>
                  <button onClick={()=>pickOccasion(o)} style={{background:"linear-gradient(135deg,#F59E0B,#EF4444)",color:"#fff",border:"none",borderRadius:9,padding:"9px 16px",fontWeight:700,fontSize:13,cursor:"pointer"}}>Find Gift →</button>
                </div>
              </div>
            ); })}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
              {occasions.map(o => { const p=people.find(x=>x.id===o.personId), past=PAST.find(g=>g.personId===o.personId); return (
                <div key={o.id} onClick={()=>pickOccasion(o)} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:18,cursor:"pointer",transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=P.teal+"66";e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=P.border;e.currentTarget.style.transform="none";}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:28}}>{p?.emoji}</span><div><div style={{fontWeight:700,fontSize:15}}>{p?.name}</div><div style={{color:P.muted,fontSize:12}}>{p?.relation}</div></div></div>
                    <Tag color={o.urgent?"#F59E0B":P.teal}>{o.daysUntil}d</Tag>
                  </div>
                  <div style={{fontSize:12,color:P.faint,marginBottom:4}}>🎉 {o.type} · {o.date}</div>
                  {past && <div style={{fontSize:11,color:P.faint,marginBottom:4}}>Last year: {past.gift} {past.reaction}</div>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                    <span style={{color:P.teal,fontSize:12,fontWeight:600}}>Get AI Recommendations →</span>
                    <button onClick={e=>{e.stopPropagation();exportICS(o,p);}} style={{background:"transparent",border:`1px solid ${P.border}33`,color:P.faint,borderRadius:5,padding:"2px 7px",fontSize:10,cursor:"pointer"}}>📅 .ics</button>
                  </div>
                </div>
              ); })}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13,marginTop:22}}>
              {[[occasions.length,"Occasions","🗓️"],[people.length,"People","👥"],[stars,"Stars","⭐"]].map(([n,l,ic]) => (
                <div key={l} style={{background:P.card,border:`1px solid ${l==="Stars"?P.gold+"44":P.border}`,borderRadius:13,padding:16,textAlign:"center",cursor:l==="Stars"?"pointer":"default"}} onClick={()=>l==="Stars"&&goTo("stars")}>
                  <div style={{fontSize:22}}>{ic}</div>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:900,color:l==="Stars"?P.goldL:P.teal,margin:"4px 0"}}>{n}</div>
                  <div style={{color:P.muted,fontSize:12}}>{l}</div>
                </div>
              ))}
            </div>
            {notifPerm!=="granted" && (
              <div style={{marginTop:16,background:`${P.indigo}18`,border:`1px solid ${P.indigo}33`,borderRadius:13,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
                <div><div style={{fontWeight:700,fontSize:13,marginBottom:3}}>🔔 Enable notifications — earn +2 Stars</div><div style={{color:P.muted,fontSize:12}}>We'll remind you 10 days before every occasion.</div></div>
                <button onClick={enableNotif} style={{background:`linear-gradient(135deg,${P.indigo},${P.teal})`,color:"#fff",border:"none",borderRadius:9,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>Enable →</button>
              </div>
            )}
          </div>
        )}
        {/* RECOMMENDATIONS */}
        {tab==="recommend" && (
          <div className="fi">
            {!selPerson ? (
              <div style={{textAlign:"center",padding:"60px 0"}}>
                <div style={{fontSize:44,marginBottom:14}}>✨</div>
                <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,marginBottom:10}}>Select an Occasion</h2>
                <p style={{color:P.muted,marginBottom:22,fontSize:14}}>Go to Dashboard and click an occasion.</p>
                <button onClick={()=>goTo("dashboard")} style={{background:`linear-gradient(135deg,${P.indigo},${P.teal})`,color:"#fff",border:"none",borderRadius:10,padding:"11px 22px",fontSize:14,fontWeight:700,cursor:"pointer"}}>Go to Dashboard →</button>
              </div>
            ) : (
              <>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22,flexWrap:"wrap"}}>
                  <span style={{fontSize:44}}>{selPerson.emoji}</span>
                  <div>
                    <h1 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:900}}>Gifts for {selPerson.name}</h1>
                    <div style={{color:P.muted,fontSize:13,marginTop:3}}>{selOcc?.type} · Budget: ${selPerson.budget} · {selOcc?.daysUntil} days away</div>
                    <div style={{display:"flex",gap:5,marginTop:6,flexWrap:"wrap"}}>{selPerson.interests.map(i => <Tag key={i}>{i}</Tag>)}</div>
                  </div>
                  <button onClick={()=>fetchGifts(selOcc,selPerson)} style={{marginLeft:"auto",background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:9,padding:"7px 13px",cursor:"pointer",fontSize:12}}>↺ Refresh</button>
                </div>
                {loadingGifts
                  ? <div style={{textAlign:"center",padding:"56px 0"}}><Spin size={34}/><p style={{color:P.muted,marginTop:14,fontSize:14}}>Finding perfect gifts for {selPerson.name}...</p></div>
                  : <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:13}}>{gifts.map(g => <GiftCard key={g.id} gift={g} onBuy={handleBuy}/>)}</div>
                }
                {!loadingGifts && gifts.length>0 && (
                  <div style={{marginTop:18,background:P.card,border:`1px solid ${P.border}`,borderRadius:13,padding:16}}>
                    <div style={{fontWeight:700,marginBottom:5,fontSize:14}}>💡 Not finding the right fit?</div>
                    <div style={{color:P.muted,fontSize:13,marginBottom:10}}>Chat with the AI concierge for more personalised ideas.</div>
                    <button onClick={()=>goTo("chat")} style={{background:`linear-gradient(135deg,${P.indigo},${P.teal})`,color:"#fff",border:"none",borderRadius:8,padding:"7px 16px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Open Concierge 💬</button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {/* PEOPLE */}
        {tab==="people" && (
          <div className="fi">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,flexWrap:"wrap",gap:10}}>
              <div><h1 style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:900}}>My People 👥</h1><p style={{color:P.muted,marginTop:3,fontSize:14}}>Everyone you care about, all in one place.</p></div>
              <button onClick={()=>setShowAddPerson(true)} style={{background:`linear-gradient(135deg,${P.indigo},${P.teal})`,color:"#fff",border:"none",borderRadius:9,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer"}}>+ Add Person</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
              {people.map(p => { const past=PAST.filter(g=>g.personId===p.id), upcoming=occasions.filter(o=>o.personId===p.id); return (
                <div key={p.id} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}><span style={{fontSize:38}}>{p.emoji}</span><div><div style={{fontWeight:700,fontSize:16}}>{p.name}</div><div style={{color:P.muted,fontSize:12,marginBottom:4}}>{p.relation}</div><Tag color={P.green}>Budget: ${p.budget}</Tag></div></div>
                  <div style={{marginBottom:8}}><div style={{fontSize:10,color:P.faint,fontWeight:700,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.08em"}}>Interests</div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{p.interests.map(i => <Tag key={i}>{i}</Tag>)}</div></div>
                  <div style={{marginBottom:8}}><div style={{fontSize:10,color:P.faint,fontWeight:700,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.08em"}}>Personality</div><div style={{fontSize:13}}>✦ {p.personality}</div></div>
                  {past.length>0 && <div style={{marginBottom:8}}><div style={{fontSize:10,color:P.faint,fontWeight:700,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.08em"}}>Past Gifts</div>{past.map((g,i) => <div key={i} style={{fontSize:12,color:P.muted}}>{g.year}: {g.gift} {g.reaction}</div>)}</div>}
                  {upcoming.length>0 && <button onClick={()=>pickOccasion(upcoming[0])} style={{width:"100%",background:`${P.indigo}22`,border:`1px solid ${P.indigo}44`,color:P.teal,borderRadius:8,padding:"7px 0",fontSize:12,fontWeight:700,cursor:"pointer",marginTop:3}}>✨ Gift Ideas ({upcoming[0].daysUntil}d away)</button>}
                </div>
              ); })}
            </div>
          </div>
        )}
        {/* CHAT */}
        {tab==="chat" && (
          <div className="fi" style={{display:"flex",flexDirection:"column",height:"calc(100vh - 150px)"}}>
            <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14}}>
              <svg width="52" height="52" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="22" fill="#F4A438"/>
                <text x="22" y="20" textAnchor="middle" fontFamily="Georgia,'Times New Roman',serif" fontStyle="italic" fontWeight="900" fontSize="11" fill="#0A0A18" letterSpacing="0.5">gift</text>
                <text x="22" y="32" textAnchor="middle" fontFamily="Arial Black,Impact,sans-serif" fontWeight="900" fontSize="13.5" fill="#0A0A18" letterSpacing="0.8">MATE</text>
              </svg>
              <div><h1 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:900}}>AI Concierge 💬</h1><p style={{color:P.muted,marginTop:3,fontSize:14}}>Your personal gifting companion.</p></div>
            </div>
            <div style={{flex:1,overflowY:"auto",background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:18,marginBottom:12}}>
              {chatMsgs.map((m,i) => <ChatMsg key={i} msg={m} onBuy={g=>handleBuy(g,true)} purchased={purchased}/>)}
              {chatLoading && <div style={{display:"flex",gap:9,alignItems:"center",color:P.muted,fontSize:14}}><Spin size={16}/> Giftmate is thinking...</div>}
              <div ref={chatEnd}/>
            </div>
            <div style={{display:"flex",gap:7,marginBottom:9,flexWrap:"wrap"}}>
              {["Gift for my mom's 60th 🎂","Anniversary under $100 💕","Tech gift for a friend 👾","Surprise flight trip ✈️"].map(q => (
                <button key={q} onClick={()=>setChatIn(q)} style={{background:P.card,border:`1px solid ${P.border}`,color:P.muted,borderRadius:18,padding:"5px 11px",fontSize:12,cursor:"pointer"}}>{q}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:9,alignItems:"flex-end"}}>
              <textarea value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}} placeholder="Ask me anything about gifts… (Enter to send, Shift+Enter for new line)" rows={1} style={{flex:1,background:P.card,border:`1px solid ${P.border}`,borderRadius:11,padding:"13px 16px",fontSize:14,transition:"border-color .2s",resize:"none",fontFamily:"inherit",lineHeight:1.5,maxHeight:120,overflowY:"auto"}} onFocus={e=>e.target.style.borderColor=P.teal} onBlur={e=>e.target.style.borderColor=P.border} onInput={e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}}/>
              <button onClick={sendChat} disabled={chatLoading||!chatIn.trim()} style={{background:chatIn.trim()&&!chatLoading?`linear-gradient(135deg,${P.indigo},${P.teal})`:P.border,color:"#fff",border:"none",borderRadius:11,padding:"13px 22px",fontSize:17,cursor:chatIn.trim()?"pointer":"default",flexShrink:0}}>→</button>
            </div>
          </div>
        )}
        {tab==="stars" && <StarsTab stars={stars} history={starHistory} onRedeem={redeemReward} onShare={shareApp}/>}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Giftmate));
