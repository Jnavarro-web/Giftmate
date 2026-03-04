const { useState, useEffect, useRef } = React;
const API = "/api/chat", MODEL = "claude-sonnet-4-20250514";
const SUPABASE_URL = "https://xpvvutfojaqtrybwlnph.supabase.co";
const SUPABASE_KEY = "sb_publishable_S1FnE9dxWOZCZ77Bm93SSg_ObsDrMVc";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const P = {bg:"#0A0A18",card:"#12122A",border:"#ffffff18",text:"#F0F0FF",muted:"#9090B0",faint:"#50507080",gold:"#F4A438",goldL:"#FFD580",goldD:"#D4841A",teal:"#14B8A6",indigo:"#FF914D",green:"#22C55E",red:"#EF4444"};
const INTERESTS=["Gaming","Music","Travel","Cooking","Fitness","Photography","Art","Reading","Tech","Sports","Fashion","Film","Hiking","Coffee","Wine","Yoga","Dance","DIY"];
const EMOJIS=["🎁","😊","🌟","🎯","🦋","🌈","🎨","🎵","🌺","🦁","🐺","🦊","🐬","🌙","⭐","🔥","💫","🎭"];
const OCCASIONS=["Birthday","Anniversary","Christmas","Valentine's Day","Mother's Day","Father's Day","Graduation","Wedding","Baby Shower","Housewarming","Retirement","Easter","Other"];
const daysUntil=d=>{if(!d)return 999;const t=new Date();t.setHours(0,0,0,0);const dd=new Date(d);const n=new Date(t.getFullYear(),dd.getMonth(),dd.getDate());if(n<t)n.setFullYear(n.getFullYear()+1);return Math.ceil((n-t)/86400000);};
const fmtDate=d=>{if(!d)return"";try{return new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"long"});}catch(e){return d;}};

function Toast({msg,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2500);return()=>clearTimeout(t);},[]);
  return <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:P.card,border:`1px solid ${P.gold}55`,color:P.text,borderRadius:12,padding:"12px 22px",fontSize:14,fontWeight:600,zIndex:9999,boxShadow:"0 4px 24px #00000088",whiteSpace:"nowrap"}}>{msg}</div>;
}
function Spin(){return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:P.bg,color:P.gold,fontSize:18}}>🎁 Loading Giftmate…</div>;}
function Avatar({emoji,size=40,style={}}){return <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45,flexShrink:0,...style}}>{emoji||"🎁"}</div>;}
function Inp({value,onChange,placeholder,type="text",style={}}){return <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type} style={{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:10,padding:"12px 14px",color:P.text,fontSize:14,boxSizing:"border-box",outline:"none",...style}}/>;}

function AuthScreen({onAuth}){
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");const [pw,setPw]=useState("");
  const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const submit=async()=>{
    if(!email||!pw){setErr("Please fill in all fields");return;}
    setLoading(true);setErr("");
    try{
      const fn=mode==="signup"?sb.auth.signUp.bind(sb.auth):sb.auth.signInWithPassword.bind(sb.auth);
      const{data,error}=await fn({email,password:pw});
      if(error)throw error;
      onAuth(data.session,mode==="signup");
    }catch(e){setErr(e.message||"Something went wrong");}
    setLoading(false);
  };
  return(
    <div style={{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 16px"}}>🎁</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:34,fontWeight:900,color:P.text}}>gift<span style={{color:P.gold}}>mate</span></div>
          <div style={{color:P.muted,fontSize:14,marginTop:4}}>The social gifting app ✨</div>
        </div>
        <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:28}}>
          <div style={{display:"flex",marginBottom:22,background:P.bg,borderRadius:10,padding:3}}>
            {["login","signup"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"9px 0",borderRadius:8,border:"none",background:mode===m?`linear-gradient(135deg,${P.goldD},${P.gold})`:"transparent",color:mode===m?"#000":P.muted,fontWeight:700,fontSize:14,cursor:"pointer"}}>
                {m==="login"?"Log In":"Sign Up"}
              </button>
            ))}
          </div>
          <Inp value={email} onChange={setEmail} placeholder="Email address" type="email" style={{marginBottom:12}}/>
          <Inp value={pw} onChange={setPw} placeholder="Password" type="password" style={{marginBottom:16}}/>
          {err&&<div style={{color:P.red,fontSize:13,marginBottom:12,textAlign:"center"}}>{err}</div>}
          <button onClick={submit} disabled={loading} style={{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",border:"none",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:800,cursor:"pointer"}}>
            {loading?"…":mode==="login"?"Log In":"Create Account"}
          </button>
        </div>
        <div style={{textAlign:"center",color:P.muted,fontSize:12,marginTop:20}}>Google & Apple login coming soon ✨</div>
      </div>
    </div>
  );
}

function Onboarding({userId,onComplete}){
  const [step,setStep]=useState(0);
  const [username,setUsername]=useState("");const [name,setName]=useState("");
  const [emoji,setEmoji]=useState("🎁");const [birthday,setBirthday]=useState("");
  const [interests,setInterests]=useState([]);
  const [loading,setLoading]=useState(false);const [err,setErr]=useState("");
  const toggleI=i=>setInterests(p=>p.includes(i)?p.filter(x=>x!==i):p.length<8?[...p,i]:p);
  const finish=async()=>{
    if(!username.trim()){setErr("Username is required");return;}
    setLoading(true);
    const{error}=await sb.from("profiles").insert({id:userId,username:username.toLowerCase().replace(/[^a-z0-9_]/g,""),display_name:name||username,emoji,birthday,interests,stars:55});
    if(error){setErr(error.message);setLoading(false);return;}
    onComplete();
  };
  const steps=[
    <div key="0">
      <div style={{fontSize:26,textAlign:"center",marginBottom:6}}>👋 Welcome!</div>
      <div style={{color:P.muted,textAlign:"center",marginBottom:22,fontSize:14}}>Let's set up your profile</div>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,color:P.muted,marginBottom:5,fontWeight:700}}>USERNAME</div>
        <Inp value={username} onChange={v=>setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g,""))} placeholder="e.g. jimena_gifts"/>
        <div style={{fontSize:11,color:P.muted,marginTop:4}}>Letters, numbers and _ only</div>
      </div>
      <div style={{marginTop:12}}>
        <div style={{fontSize:11,color:P.muted,marginBottom:5,fontWeight:700}}>DISPLAY NAME</div>
        <Inp value={name} onChange={setName} placeholder="Your name"/>
      </div>
    </div>,
    <div key="1">
      <div style={{fontSize:26,textAlign:"center",marginBottom:6}}>Pick your emoji</div>
      <div style={{color:P.muted,textAlign:"center",marginBottom:18,fontSize:14}}>This will be your avatar</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:14}}>
        {EMOJIS.map(e=><button key={e} onClick={()=>setEmoji(e)} style={{fontSize:26,padding:"10px 0",borderRadius:12,border:`2px solid ${emoji===e?P.gold:"transparent"}`,background:emoji===e?P.gold+"22":P.bg,cursor:"pointer"}}>{e}</button>)}
      </div>
      <div style={{textAlign:"center",fontSize:52}}>{emoji}</div>
    </div>,
    <div key="2">
      <div style={{fontSize:26,textAlign:"center",marginBottom:6}}>🎂 Your birthday</div>
      <div style={{color:P.muted,textAlign:"center",marginBottom:20,fontSize:14}}>Friends will get gift ideas for you!</div>
      <Inp value={birthday} onChange={setBirthday} placeholder="" type="date" style={{textAlign:"center",fontSize:16}}/>
      <div style={{color:P.muted,fontSize:12,textAlign:"center",marginTop:10}}>You can skip this and add it later</div>
    </div>,
    <div key="3">
      <div style={{fontSize:26,textAlign:"center",marginBottom:6}}>What do you love? 💛</div>
      <div style={{color:P.muted,textAlign:"center",marginBottom:18,fontSize:14}}>Pick up to 8 interests</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {INTERESTS.map(i=><button key={i} onClick={()=>toggleI(i)} style={{padding:"8px 14px",borderRadius:99,border:`1px solid ${interests.includes(i)?P.gold:P.border}`,background:interests.includes(i)?P.gold+"22":P.bg,color:interests.includes(i)?P.goldL:P.muted,fontSize:13,fontWeight:600,cursor:"pointer"}}>{i}</button>)}
      </div>
    </div>
  ];
  return(
    <div style={{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:900,color:P.text}}>gift<span style={{color:P.gold}}>mate</span></div>
          <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:12}}>
            {steps.map((_,i)=><div key={i} style={{width:i===step?24:8,height:8,borderRadius:99,background:i<=step?P.gold:P.border,transition:"all 0.3s"}}/>)}
          </div>
        </div>
        <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:28}}>
          {steps[step]}
          {err&&<div style={{color:P.red,fontSize:13,marginTop:10,textAlign:"center"}}>{err}</div>}
          <div style={{display:"flex",gap:10,marginTop:22}}>
            {step>0&&<button onClick={()=>setStep(s=>s-1)} style={{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:12,padding:"12px 0",fontWeight:700,cursor:"pointer"}}>Back</button>}
            <button onClick={step<steps.length-1?()=>setStep(s=>s+1):finish} disabled={loading} style={{flex:2,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",border:"none",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:800,cursor:"pointer"}}>
              {loading?"…":step<steps.length-1?"Continue →":"Start Gifting! 🎁"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FriendProfile({friend,myProfile,setMyProfile,following,onToggleFollow,onBack}){
  const [occasions,setOccasions]=useState([]);
  const [wishlist,setWishlist]=useState([]);
  const [giftsReceived,setGiftsReceived]=useState([]);
  const [section,setSection]=useState("occasions");
  const [giftIdeas,setGiftIdeas]=useState([]);
  const [giftLoading,setGiftLoading]=useState(false);
  const [toast,setToast]=useState(null);
  useEffect(()=>{
    Promise.all([
      sb.from("occasions").select("*").eq("user_id",friend.id).eq("is_public",true),
      sb.from("wishlist_items").select("*").eq("user_id",friend.id).eq("is_public",true),
      sb.from("gifts_received").select("*").eq("user_id",friend.id).eq("is_public",true)
    ]).then(([o,w,g])=>{setOccasions(o.data||[]);setWishlist(w.data||[]);setGiftsReceived(g.data||[]);});
  },[friend.id]);
  const getGiftIdeas=async(occ)=>{
    setGiftIdeas([]);setGiftLoading(true);
    try{
      const res=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:MODEL,max_tokens:600,messages:[{role:"user",content:`Generate 3 personalised gift ideas for ${friend.display_name} for their ${occ.type}. Interests: ${(friend.interests||[]).join(", ")||"unknown"}. Past gifts they loved: ${giftsReceived.map(g=>g.gift_name).join(", ")||"none"}. Wishlist: ${wishlist.map(w=>w.name).join(", ")||"empty"}. Return ONLY a JSON array: [{name,description,price,emoji}]`}]})});
      const data=await res.json();
      const text=(data.content?.[0]?.text||"[]").replace(/\`\`\`json|\`\`\`/g,"").trim();
      setGiftIdeas(JSON.parse(text));
    }catch(e){setToast("Couldn't load ideas — try again");}
    setGiftLoading(false);
  };
  const isF=following.includes(friend.id);
  const SECS=[["occasions","🗓️ Occasions"],["wishlist","🎁 Wishlist"],["gifts","🎀 Received"]];
  return(
    <div>
      <button onClick={onBack} style={{background:"none",border:"none",color:P.muted,fontSize:14,cursor:"pointer",marginBottom:14,padding:0}}>← Back</button>
      <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:20,marginBottom:14,textAlign:"center"}}>
        <Avatar emoji={friend.emoji} size={72} style={{margin:"0 auto 12px"}}/>
        <div style={{fontWeight:800,fontSize:20,color:P.text}}>{friend.display_name}</div>
        <div style={{color:P.muted,fontSize:14,marginBottom:6}}>@{friend.username}</div>
        {friend.birthday&&<div style={{fontSize:13,color:P.gold,marginBottom:10}}>🎂 {fmtDate(friend.birthday)} · in {daysUntil(friend.birthday)} days</div>}
        {(friend.interests||[]).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginBottom:14}}>{friend.interests.map(i=><span key={i} style={{background:`${P.gold}22`,border:`1px solid ${P.gold}33`,borderRadius:99,padding:"3px 10px",fontSize:11,color:P.goldL,fontWeight:600}}>{i}</span>)}</div>}
        <button onClick={()=>onToggleFollow(friend.id)} style={{background:isF?P.border:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:isF?P.muted:"#000",borderRadius:10,padding:"10px 28px",fontWeight:700,fontSize:14,cursor:"pointer"}}>{isF?"✓ Following":"+ Follow"}</button>
      </div>
      {occasions.length>0&&(
        <div style={{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:16,padding:16,marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:10}}>✨ Get AI Gift Ideas</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {occasions.slice(0,3).map(o=><button key={o.id} onClick={()=>getGiftIdeas(o)} style={{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>🎁 For {o.type}</button>)}
          </div>
          {giftLoading&&<div style={{color:P.muted,fontSize:13,marginTop:10}}>✨ Finding perfect gifts…</div>}
          {giftIdeas.map((g,i)=>(
            <div key={i} style={{background:P.bg,borderRadius:10,padding:"10px 12px",marginTop:10,display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:24}}>{g.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:P.text}}>{g.name}</div>
                <div style={{fontSize:12,color:P.muted,marginTop:2}}>{g.description}</div>
                <div style={{color:P.gold,fontWeight:700,fontSize:13,marginTop:4}}>~€{g.price}</div>
              </div>
              <button onClick={()=>window.open(`https://www.amazon.com/s?k=${encodeURIComponent(g.name)}&tag=giftmate0d-20`,"_blank")} style={{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>Buy →</button>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",background:P.card,borderRadius:10,padding:3,marginBottom:12,gap:2}}>
        {SECS.map(([id,label])=><button key={id} onClick={()=>setSection(id)} style={{flex:1,padding:"8px 0",borderRadius:8,border:"none",background:section===id?`linear-gradient(135deg,${P.goldD},${P.gold})`:"transparent",color:section===id?"#000":P.muted,fontWeight:700,fontSize:11,cursor:"pointer"}}>{label}</button>)}
      </div>
      {section==="occasions"&&occasions.map(o=><div key={o.id} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:600,color:P.text}}>{o.type}</div><div style={{fontSize:13,color:P.muted}}>{fmtDate(o.date)}</div></div><div style={{color:daysUntil(o.date)<=30?P.gold:P.muted,fontWeight:700,fontSize:13}}>{daysUntil(o.date)}d</div></div>)}
      {section==="occasions"&&occasions.length===0&&<div style={{color:P.muted,textAlign:"center",padding:20,fontSize:14}}>No occasions added yet</div>}
      {section==="wishlist"&&wishlist.map(w=><div key={w.id} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:600,color:P.text}}>{w.name}</div>{w.description&&<div style={{fontSize:13,color:P.muted}}>{w.description}</div>}</div>{w.price&&<div style={{color:P.gold,fontWeight:700}}>€{w.price}</div>}</div>)}
      {section==="wishlist"&&wishlist.length===0&&<div style={{color:P.muted,textAlign:"center",padding:20,fontSize:14}}>Wishlist is empty</div>}
      {section==="gifts"&&giftsReceived.map(g=><div key={g.id} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:600,color:P.text}}>{g.gift_name}</div>{g.from_whom&&<div style={{fontSize:13,color:P.muted}}>From {g.from_whom}{g.occasion?` · ${g.occasion}`:""}</div>}</div><span style={{fontSize:20}}>{g.reaction||"😊"}</span></div>)}
      {section==="gifts"&&giftsReceived.length===0&&<div style={{color:P.muted,textAlign:"center",padding:20,fontSize:14}}>No gifts recorded yet</div>}
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    </div>
  );
}

function MyProfile({profile,setProfile}){
  const [occasions,setOccasions]=useState([]);
  const [wishlist,setWishlist]=useState([]);
  const [giftsReceived,setGiftsReceived]=useState([]);
  const [section,setSection]=useState("occasions");
  const [addingOcc,setAddingOcc]=useState(false);
  const [addingWish,setAddingWish]=useState(false);
  const [addingGift,setAddingGift]=useState(false);
  const [newOcc,setNewOcc]=useState({type:"Birthday",date:""});
  const [newWish,setNewWish]=useState({name:"",description:"",price:""});
  const [newGift,setNewGift]=useState({gift_name:"",from_whom:"",occasion:"",reaction:"😊"});
  const [toast,setToast]=useState(null);
  useEffect(()=>{
    Promise.all([
      sb.from("occasions").select("*").eq("user_id",profile.id).order("date"),
      sb.from("wishlist_items").select("*").eq("user_id",profile.id),
      sb.from("gifts_received").select("*").eq("user_id",profile.id)
    ]).then(([o,w,g])=>{setOccasions(o.data||[]);setWishlist(w.data||[]);setGiftsReceived(g.data||[]);});
  },[]);
  const addOcc=async()=>{
    if(!newOcc.date){setToast("Please pick a date");return;}
    const{data}=await sb.from("occasions").insert({user_id:profile.id,...newOcc,is_public:true}).select();
    setOccasions(o=>[...o,...(data||[])]);setAddingOcc(false);setNewOcc({type:"Birthday",date:""});
    setToast("Occasion added! 🗓️");
    const ns=(profile.stars||0)+10;
    sb.from("profiles").update({stars:ns}).eq("id",profile.id);
    setProfile(p=>({...p,stars:ns}));
  };
  const addWish=async()=>{
    if(!newWish.name){setToast("Please enter a name");return;}
    const{data}=await sb.from("wishlist_items").insert({user_id:profile.id,...newWish,price:newWish.price?parseInt(newWish.price):null,is_public:true}).select();
    setWishlist(w=>[...w,...(data||[])]);setAddingWish(false);setNewWish({name:"",description:"",price:""});
    setToast("Added to wishlist! 🎁");
  };
  const addGift=async()=>{
    if(!newGift.gift_name){setToast("Please enter a gift name");return;}
    const{data}=await sb.from("gifts_received").insert({user_id:profile.id,...newGift,is_public:true}).select();
    setGiftsReceived(g=>[...g,...(data||[])]);setAddingGift(false);setNewGift({gift_name:"",from_whom:"",occasion:"",reaction:"😊"});
    setToast("Gift recorded! 🎀");
  };
  const delOcc=async id=>{await sb.from("occasions").delete().eq("id",id);setOccasions(o=>o.filter(x=>x.id!==id));};
  const delWish=async id=>{await sb.from("wishlist_items").delete().eq("id",id);setWishlist(w=>w.filter(x=>x.id!==id));};
  const SECS=[["occasions","🗓️ Occasions"],["wishlist","🎁 Wishlist"],["gifts","🎀 Received"]];
  return(
    <div>
      <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:20,marginBottom:14,textAlign:"center"}}>
        <Avatar emoji={profile.emoji} size={72} style={{margin:"0 auto 12px"}}/>
        <div style={{fontWeight:800,fontSize:20,color:P.text}}>{profile.display_name}</div>
        <div style={{color:P.muted,fontSize:14,marginBottom:6}}>@{profile.username}</div>
        {profile.birthday&&<div style={{fontSize:13,color:P.gold,marginBottom:8}}>🎂 {fmtDate(profile.birthday)}</div>}
        {(profile.interests||[]).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:8}}>{profile.interests.map(i=><span key={i} style={{background:`${P.gold}22`,border:`1px solid ${P.gold}33`,borderRadius:99,padding:"3px 10px",fontSize:11,color:P.goldL,fontWeight:600}}>{i}</span>)}</div>}
        <button onClick={()=>sb.auth.signOut()} style={{marginTop:14,background:"none",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"7px 16px",fontSize:12,cursor:"pointer"}}>Log out</button>
      </div>
      <div style={{display:"flex",background:P.card,borderRadius:10,padding:3,marginBottom:12,gap:2}}>
        {SECS.map(([id,label])=><button key={id} onClick={()=>setSection(id)} style={{flex:1,padding:"8px 0",borderRadius:8,border:"none",background:section===id?`linear-gradient(135deg,${P.goldD},${P.gold})`:"transparent",color:section===id?"#000":P.muted,fontWeight:700,fontSize:11,cursor:"pointer"}}>{label}</button>)}
      </div>
      {section==="occasions"&&(
        <div>
          {occasions.map(o=>(
            <div key={o.id} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:600,color:P.text}}>{o.type}</div><div style={{fontSize:13,color:P.muted}}>{fmtDate(o.date)}</div></div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{color:daysUntil(o.date)<=30?P.gold:P.muted,fontWeight:700,fontSize:13}}>{daysUntil(o.date)}d</div>
                <button onClick={()=>delOcc(o.id)} style={{background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:16}}>✕</button>
              </div>
            </div>
          ))}
          {addingOcc?(
            <div style={{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:14,padding:16,marginBottom:10}}>
              <select value={newOcc.type} onChange={e=>setNewOcc(o=>({...o,type:e.target.value}))} style={{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:8,padding:"10px",color:P.text,fontSize:14,marginBottom:10,boxSizing:"border-box"}}>
                {OCCASIONS.map(o=><option key={o}>{o}</option>)}
              </select>
              <input type="date" value={newOcc.date} onChange={e=>setNewOcc(o=>({...o,date:e.target.value}))} style={{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:8,padding:"10px",color:P.text,fontSize:14,marginBottom:10,boxSizing:"border-box"}}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setAddingOcc(false)} style={{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"9px 0",cursor:"pointer"}}>Cancel</button>
                <button onClick={addOcc} style={{flex:2,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:8,padding:"9px 0",fontWeight:700,cursor:"pointer"}}>Add +10⭐</button>
              </div>
            </div>
          ):<button onClick={()=>setAddingOcc(true)} style={{width:"100%",background:`${P.gold}11`,border:`1px dashed ${P.gold}44`,borderRadius:12,padding:"12px 0",color:P.gold,fontWeight:700,cursor:"pointer",fontSize:14}}>+ Add Occasion</button>}
        </div>
      )}
      {section==="wishlist"&&(
        <div>
          {wishlist.map(w=>(
            <div key={w.id} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:600,color:P.text}}>{w.name}</div>{w.description&&<div style={{fontSize:13,color:P.muted}}>{w.description}</div>}</div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>{w.price&&<div style={{color:P.gold,fontWeight:700}}>€{w.price}</div>}<button onClick={()=>delWish(w.id)} style={{background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:16}}>✕</button></div>
            </div>
          ))}
          {addingWish?(
            <div style={{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:14,padding:16,marginBottom:10}}>
              <Inp value={newWish.name} onChange={v=>setNewWish(w=>({...w,name:v}))} placeholder="Gift name" style={{marginBottom:8}}/>
              <Inp value={newWish.description} onChange={v=>setNewWish(w=>({...w,description:v}))} placeholder="Description (optional)" style={{marginBottom:8}}/>
              <Inp value={newWish.price} onChange={v=>setNewWish(w=>({...w,price:v}))} placeholder="Price in € (optional)" type="number" style={{marginBottom:10}}/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setAddingWish(false)} style={{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"9px 0",cursor:"pointer"}}>Cancel</button>
                <button onClick={addWish} style={{flex:2,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:8,padding:"9px 0",fontWeight:700,cursor:"pointer"}}>Add</button>
              </div>
            </div>
          ):<button onClick={()=>setAddingWish(true)} style={{width:"100%",background:`${P.gold}11`,border:`1px dashed ${P.gold}44`,borderRadius:12,padding:"12px 0",color:P.gold,fontWeight:700,cursor:"pointer",fontSize:14}}>+ Add to Wishlist</button>}
        </div>
      )}
      {section==="gifts"&&(
        <div>
          {giftsReceived.map(g=>(
            <div key={g.id} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontWeight:600,color:P.text}}>{g.gift_name}</div>{g.from_whom&&<div style={{fontSize:13,color:P.muted}}>From {g.from_whom}{g.occasion?` · ${g.occasion}`:""}</div>}</div>
              <span style={{fontSize:20}}>{g.reaction||"😊"}</span>
            </div>
          ))}
          {addingGift?(
            <div style={{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:14,padding:16,marginBottom:10}}>
              <Inp value={newGift.gift_name} onChange={v=>setNewGift(g=>({...g,gift_name:v}))} placeholder="Gift name" style={{marginBottom:8}}/>
              <Inp value={newGift.from_whom} onChange={v=>setNewGift(g=>({...g,from_whom:v}))} placeholder="From whom" style={{marginBottom:8}}/>
              <Inp value={newGift.occasion} onChange={v=>setNewGift(g=>({...g,occasion:v}))} placeholder="Occasion (Birthday, etc.)" style={{marginBottom:10}}/>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:12,color:P.muted,marginBottom:6}}>Reaction</div>
                <div style={{display:"flex",gap:8}}>{["😊","❤️","🤩","😄","🙏"].map(r=><button key={r} onClick={()=>setNewGift(g=>({...g,reaction:r}))} style={{fontSize:22,background:newGift.reaction===r?`${P.gold}33`:"none",border:`1px solid ${newGift.reaction===r?P.gold:"transparent"}`,borderRadius:8,padding:"6px 10px",cursor:"pointer"}}>{r}</button>)}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setAddingGift(false)} style={{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"9px 0",cursor:"pointer"}}>Cancel</button>
                <button onClick={addGift} style={{flex:2,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:8,padding:"9px 0",fontWeight:700,cursor:"pointer"}}>Add</button>
              </div>
            </div>
          ):<button onClick={()=>setAddingGift(true)} style={{width:"100%",background:`${P.gold}11`,border:`1px dashed ${P.gold}44`,borderRadius:12,padding:"12px 0",color:P.gold,fontWeight:700,cursor:"pointer",fontSize:14}}>+ Add Gift Received</button>}
        </div>
      )}
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    </div>
  );
}

function StarsTab({profile,setProfile}){
  const stars=profile.stars||0;
  const REWARDS=[{id:1,title:"5% Off Amazon",cost:200,icon:"📦",desc:"One-time code"},{id:2,title:"Featured on Feed",cost:300,icon:"🌟",desc:"Shown to all users"},{id:3,title:"10% Off Viator",cost:400,icon:"🗺️",desc:"Any experience"},{id:4,title:"1 Month Premium",cost:500,icon:"✨",desc:"Full access"}];
  const [toast,setToast]=useState(null);
  const redeem=async r=>{
    if(stars<r.cost)return;
    const ns=stars-r.cost;
    await sb.from("profiles").update({stars:ns}).eq("id",profile.id);
    setProfile(p=>({...p,stars:ns}));setToast(`🎁 "${r.title}" redeemed!`);
  };
  const share=async via=>{
    const url="https://giftmate-sigma.vercel.app";
    const msg=`🎁 Check out Giftmate — the social gifting app! ${url}`;
    if(via==="wa")window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,"_blank");
    else await navigator.clipboard.writeText(url);
    const ns=stars+10;
    await sb.from("profiles").update({stars:ns}).eq("id",profile.id);
    setProfile(p=>({...p,stars:ns}));
    setToast(via==="wa"?"💬 Shared! +10⭐":"📋 Copied! +10⭐");
  };
  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${P.goldD}33,${P.indigo}33)`,border:`1px solid ${P.gold}33`,borderRadius:20,padding:28,marginBottom:16,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:6}}>⭐</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:52,fontWeight:900,color:P.goldL}}>{stars.toLocaleString()}</div>
        <div style={{color:P.muted,fontSize:14}}>Stars earned</div>
      </div>
      <div style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:18,marginBottom:14}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>How to earn ⭐</div>
        {[["👥","Follow a friend","+15"],["🗓️","Add an occasion","+10"],["📲","Share Giftmate","+10"],["🤝","Refer a friend","+80"]].map(([icon,label,pts])=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,background:P.bg,borderRadius:10,padding:"10px 12px"}}>
            <span style={{fontSize:18}}>{icon}</span><div style={{flex:1,fontSize:13,color:P.muted}}>{label}</div><div style={{color:P.gold,fontWeight:700,fontSize:13}}>{pts} ⭐</div>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button onClick={()=>share("wa")} style={{flex:1,background:"#25D366",color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>💬 WhatsApp</button>
          <button onClick={()=>share("copy")} style={{flex:1,background:P.card,border:`1px solid ${P.border}`,color:P.text,borderRadius:10,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>📋 Copy Link</button>
        </div>
      </div>
      <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>Redeem Stars 🎁</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {REWARDS.map(r=>{const can=stars>=r.cost;return(
          <div key={r.id} style={{background:P.card,border:`1px solid ${can?P.gold+"44":P.border}`,borderRadius:14,padding:14}}>
            <div style={{fontSize:28,marginBottom:6}}>{r.icon}</div>
            <div style={{fontWeight:700,fontSize:13,color:P.text,marginBottom:2}}>{r.title}</div>
            <div style={{fontSize:11,color:P.muted,marginBottom:10}}>{r.desc}</div>
            <button onClick={()=>redeem(r)} disabled={!can} style={{width:"100%",background:can?`linear-gradient(135deg,${P.goldD},${P.gold})`:P.border,color:can?"#000":P.muted,border:"none",borderRadius:8,padding:"7px 0",fontSize:11,fontWeight:700,cursor:can?"pointer":"not-allowed"}}>{can?`${r.cost} ⭐ Redeem`:`Need ${r.cost-stars} more`}</button>
          </div>
        );})}
      </div>
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    </div>
  );
}

function MainApp({session,profile,setProfile}){
  const [tab,setTab]=useState("home");
  const [viewingFriend,setViewingFriend]=useState(null);
  const [feed,setFeed]=useState([]);
  const [feedLoading,setFeedLoading]=useState(true);
  const [following,setFollowing]=useState([]);
  const [searchQ,setSearchQ]=useState("");
  const [searchResults,setSearchResults]=useState([]);
  const [toast,setToast]=useState(null);

  const loadFollowing=async()=>{const{data}=await sb.from("follows").select("following_id").eq("follower_id",profile.id);setFollowing((data||[]).map(f=>f.following_id));};
  const loadFeed=async()=>{
    setFeedLoading(true);
    const{data:fData}=await sb.from("follows").select("following_id").eq("follower_id",profile.id);
    const ids=(fData||[]).map(f=>f.following_id);
    if(!ids.length){setFeed([]);setFeedLoading(false);return;}
    const[{data:profiles},{data:occasions}]=await Promise.all([sb.from("profiles").select("*").in("id",ids),sb.from("occasions").select("*").in("user_id",ids).eq("is_public",true)]);
    const items=(profiles||[]).map(p=>({profile:p,occasions:(occasions||[]).filter(o=>o.user_id===p.id).sort((a,b)=>daysUntil(a.date)-daysUntil(b.date))})).sort((a,b)=>(a.occasions[0]?daysUntil(a.occasions[0].date):999)-(b.occasions[0]?daysUntil(b.occasions[0].date):999));
    setFeed(items);setFeedLoading(false);
  };
  useEffect(()=>{loadFollowing();loadFeed();},[]);
  useEffect(()=>{
    if(!searchQ.trim()){setSearchResults([]);return;}
    const t=setTimeout(async()=>{const{data}=await sb.from("profiles").select("*").ilike("username",`%${searchQ}%`).neq("id",profile.id).limit(20);setSearchResults(data||[]);},300);
    return()=>clearTimeout(t);
  },[searchQ]);

  const toggleFollow=async targetId=>{
    const isF=following.includes(targetId);
    if(isF){await sb.from("follows").delete().eq("follower_id",profile.id).eq("following_id",targetId);setFollowing(f=>f.filter(id=>id!==targetId));setToast("Unfollowed");}
    else{
      await sb.from("follows").insert({follower_id:profile.id,following_id:targetId});
      setFollowing(f=>[...f,targetId]);setToast("Following! 🎉");
      const ns=(profile.stars||0)+15;
      await sb.from("profiles").update({stars:ns}).eq("id",profile.id);
      setProfile(p=>({...p,stars:ns}));
    }
    loadFeed();
  };
  const viewFriend=p=>{setViewingFriend(p);setTab("friend");};
  const TABS=[{id:"home",icon:"🏠",label:"Home"},{id:"search",icon:"🔍",label:"Search"},{id:"profile",icon:"👤",label:"Profile"},{id:"stars",icon:"⭐",label:"Stars"}];

  return(
    <div style={{background:P.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:74}}>
      <div style={{background:P.card,borderBottom:`1px solid ${P.border}`,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:P.text}}>gift<span style={{color:P.gold}}>mate</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:13,color:P.gold,fontWeight:700}}>⭐ {profile.stars||0}</div>
          <Avatar emoji={profile.emoji} size={32}/>
        </div>
      </div>
      <div style={{padding:"16px 16px 0"}}>
        {tab==="home"&&(feedLoading?<div style={{textAlign:"center",padding:40,color:P.muted}}>Loading feed… 🎁</div>:feed.length===0?(
          <div style={{textAlign:"center",padding:40}}>
            <div style={{fontSize:52,marginBottom:12}}>👥</div>
            <div style={{fontWeight:700,fontSize:18,color:P.text,marginBottom:8}}>Find your friends!</div>
            <div style={{color:P.muted,fontSize:14,lineHeight:1.5,marginBottom:18}}>Search for friends to see their upcoming occasions and get AI gift ideas.</div>
            <button onClick={()=>setTab("search")} style={{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",border:"none",borderRadius:12,padding:"12px 28px",fontWeight:700,fontSize:14,cursor:"pointer"}}>Find Friends 🔍</button>
          </div>
        ):(
          <div>
            <div style={{fontWeight:700,fontSize:18,color:P.text,marginBottom:14}}>Upcoming Occasions 🎁</div>
            {feed.map(({profile:fr,occasions:occs})=>(
              <div key={fr.id} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:16,marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                  <Avatar emoji={fr.emoji} size={44}/>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15,color:P.text}}>{fr.display_name}</div><div style={{fontSize:13,color:P.muted}}>@{fr.username}</div></div>
                  <button onClick={()=>viewFriend(fr)} style={{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>View →</button>
                </div>
                {fr.birthday&&<div style={{background:P.bg,borderRadius:10,padding:"9px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:600,color:P.text}}>🎂 Birthday</div><div style={{fontSize:12,color:P.muted}}>{fmtDate(fr.birthday)}</div></div><div style={{fontSize:12,fontWeight:700,color:daysUntil(fr.birthday)<=30?P.gold:P.muted}}>{daysUntil(fr.birthday)}d</div></div>}
                {occs.slice(0,2).map(o=>{const d=daysUntil(o.date);return<div key={o.id} style={{background:P.bg,borderRadius:10,padding:"9px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:600,color:P.text}}>{o.type}</div><div style={{fontSize:12,color:P.muted}}>{fmtDate(o.date)}</div></div><div style={{fontSize:12,fontWeight:700,color:d<=7?P.red:d<=30?P.gold:P.muted}}>{d===0?"🎉 Today!":d===1?"Tomorrow!":`${d}d`}</div></div>;})}
                {occs.length===0&&!fr.birthday&&<div style={{fontSize:13,color:P.muted,textAlign:"center",padding:"6px 0"}}>No upcoming occasions</div>}
              </div>
            ))}
          </div>
        ))}
        {tab==="search"&&(
          <div>
            <div style={{fontWeight:700,fontSize:18,color:P.text,marginBottom:14}}>Find Friends 🔍</div>
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search by username…" style={{width:"100%",background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"13px 16px",color:P.text,fontSize:14,marginBottom:14,boxSizing:"border-box",outline:"none"}}/>
            {searchResults.map(u=>(
              <div key={u.id} style={{background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
                <Avatar emoji={u.emoji} size={46}/>
                <div style={{flex:1}}><div style={{fontWeight:700,color:P.text}}>{u.display_name}</div><div style={{fontSize:13,color:P.muted}}>@{u.username}</div>{u.interests?.length>0&&<div style={{fontSize:11,color:P.muted,marginTop:2}}>{u.interests.slice(0,3).join(" · ")}</div>}</div>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <button onClick={()=>viewFriend(u)} style={{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>View</button>
                  <button onClick={()=>toggleFollow(u.id)} style={{background:following.includes(u.id)?P.border:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:following.includes(u.id)?P.muted:"#000",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>{following.includes(u.id)?"✓ Following":"+ Follow"}</button>
                </div>
              </div>
            ))}
            {searchQ&&searchResults.length===0&&<div style={{textAlign:"center",color:P.muted,padding:20}}>No users found</div>}
          </div>
        )}
        {tab==="friend"&&viewingFriend&&<FriendProfile friend={viewingFriend} myProfile={profile} setMyProfile={setProfile} following={following} onToggleFollow={toggleFollow} onBack={()=>setTab("home")}/>}
        {tab==="profile"&&<MyProfile profile={profile} setProfile={setProfile}/>}
        {tab==="stars"&&<StarsTab profile={profile} setProfile={setProfile}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:P.card,borderTop:`1px solid ${P.border}`,display:"flex",zIndex:100}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 0",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}><span style={{fontSize:20}}>{t.icon}</span><span style={{fontSize:10,color:tab===t.id?P.gold:P.muted,fontWeight:tab===t.id?700:400}}>{t.label}</span></button>)}
      </div>
      {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    </div>
  );
}

function Giftmate(){
  const [session,setSession]=useState(null);
  const [profile,setProfile]=useState(null);
  const [loading,setLoading]=useState(true);
  const loadProfile=async uid=>{const{data}=await sb.from("profiles").select("*").eq("id",uid).single();setProfile(data||null);setLoading(false);};
  useEffect(()=>{
    sb.auth.getSession().then(({data:{session}})=>{setSession(session);if(session)loadProfile(session.user.id);else setLoading(false);});
    const{data:{subscription}}=sb.auth.onAuthStateChange((_e,session)=>{setSession(session);if(session)loadProfile(session.user.id);else{setSession(null);setProfile(null);setLoading(false);}});
    return()=>subscription.unsubscribe();
  },[]);
  const handleAuth=(session,isNew)=>{setSession(session);if(isNew){setProfile(null);setLoading(false);}else if(session)loadProfile(session.user.id);};
  if(loading)return <Spin/>;
  if(!session)return <AuthScreen onAuth={handleAuth}/>;
  if(!profile)return <Onboarding userId={session.user.id} onComplete={()=>loadProfile(session.user.id)}/>;
  return <MainApp session={session} profile={profile} setProfile={setProfile}/>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Giftmate/>);
