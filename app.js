const { useState, useEffect, useRef } = React;
const html = htm.bind(React.createElement);

const SUPABASE_URL = "https://xpvvutfojaqtrybwlnph.supabase.co";
const SUPABASE_KEY = "sb_publishable_S1FnE9dxWOZCZ77Bm93SSg_ObsDrMVc";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const API = "https://giftmate-sigma.vercel.app/api/chat", MODEL = "claude-sonnet-4-20250514";
const SUPPORT_EMAIL = "support@giftm8.app";

const THEMES = {
  midnight: { name:"Midnight", svgIcon:"moon", bg:"#0A0A18", card:"#12122A", border:"#F4A43828", text:"#F0F0FF", muted:"#9090B0", faint:"#50507080", gold:"#F4A438", goldL:"#FFD580", goldD:"#D4841A", teal:"#14B8A6", green:"#22C55E", red:"#EF4444" },
  rose:     { name:"Rose",     svgIcon:"flower", bg:"#130810", card:"#1E0E18", border:"#FF6B9D28", text:"#FFE8F4", muted:"#B06888", faint:"#70405080", gold:"#FF6B9D", goldL:"#FFAECF", goldD:"#C4316A", teal:"#FFB347", green:"#4ADE80", red:"#FF4D6D" },
  lavender: { name:"Lavender", svgIcon:"heart", bg:"#0C0818", card:"#180F28", border:"#C084FC28", text:"#F2EAFF", muted:"#9878C0", faint:"#60488080", gold:"#C084FC", goldL:"#DDB6FF", goldD:"#8B22E8", teal:"#F4A438", green:"#4ADE80", red:"#EF4444" },
  blush:    { name:"Blush",    svgIcon:"bow", bg:"#160B10", card:"#241220", border:"#F0A09028", text:"#FFEDF5", muted:"#B08090", faint:"#7850608f", gold:"#F0A090", goldL:"#F8C8BC", goldD:"#CC6050", teal:"#FF6B9D", green:"#4ADE80", red:"#EF4444" },
  ocean:    { name:"Ocean",    svgIcon:"wave", bg:"#060F1C", card:"#0D1C30", border:"#F4A43828", text:"#E0F4FF", muted:"#5888A8", faint:"#38587080", gold:"#F4A438", goldL:"#FFD580", goldD:"#D4841A", teal:"#38BDF8", green:"#4ADE80", red:"#F87171" },
  sage:     { name:"Sage",     svgIcon:"leaf", bg:"#06100A", card:"#0E1E12", border:"#F4A43828", text:"#EAFAF0", muted:"#60986A", faint:"#40604880", gold:"#F4A438", goldL:"#FFD580", goldD:"#D4841A", teal:"#4ADE80", green:"#4ADE80", red:"#EF4444" },
};
let _theme = "midnight";
const setThemeKey = key => { if(THEMES[key]) { _theme=key; Object.assign(P, THEMES[key]); document.body.style.background=THEMES[key].bg; const m=document.querySelector("meta[name=theme-color]"); if(m) m.content=THEMES[key].gold; try{localStorage.setItem("giftmate_theme",key);}catch(e){} } };

// ── SVG ICONS (reliable on iOS WebView; emojis often render as ?) ──
const Icon = (name, size=20, color="currentColor") => {
  const s = size;
  const icons = {
    home: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    search: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    groups: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    chat: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    profile: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    star: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill=${color} stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    camera: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    lock: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    gift: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
    moon: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    flower: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>`,
    heart: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    bow: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M4 9h16"/><path d="M8 21l4-6 4 6"/><path d="M4 9c0 4 4 6 8 6s8-2 8-6"/></svg>`,
    wave: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>`,
    leaf: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
    sprout: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>`,
    package: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    crown: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>`,
    trophy: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    sparkle: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    pencil: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
    share: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    calendar: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    map: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>`,
    globe: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    check: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    thumbsUp: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z"/><path d="M11 10h6a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-6"/><path d="M11 10V5a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v5"/></svg>`,
    thumbsDown: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 13V5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"/><path d="M13 14H7a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h6"/><path d="M13 14v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-5"/></svg>`,
    box: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
    close: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    copy: html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke=${color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
  };
  return icons[name] ? html`<span style=${{display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>${icons[name]}</span>` : null;
};
const stripEmoji = s => (s||"").replace(/^[^\w\s]+/g,"").replace(/\s+[^\w\s]+$/g,"").replace(/\s+/g," ").trim();
const AVATAR_OPTIONS = [{e:"🎁",i:"gift"},{e:"😊",i:"heart"},{e:"🌟",i:"star"},{e:"🎯",i:"trophy"},{e:"🦋",i:"flower"},{e:"🌈",i:"wave"},{e:"🎨",i:"package"},{e:"🎵",i:"share"},{e:"🌺",i:"flower"},{e:"🦁",i:"crown"},{e:"🐺",i:"heart"},{e:"🦊",i:"heart"},{e:"🐬",i:"wave"},{e:"🌙",i:"moon"},{e:"⭐",i:"star"},{e:"🔥",i:"sparkle"},{e:"💫",i:"sparkle"},{e:"🎭",i:"heart"}];
const emojiToIcon = emoji => (AVATAR_OPTIONS.find(o=>o.e===emoji)||{i:"gift"}).i;
const GROUP_EMOJI_OPTIONS = [{e:"🎁",i:"gift"},{e:"🎂",i:"calendar"},{e:"💍",i:"heart"},{e:"🎓",i:"gift"},{e:"🏠",i:"gift"},{e:"❤️",i:"heart"},{e:"🎉",i:"sparkle"},{e:"🌟",i:"star"},{e:"🍾",i:"sparkle"},{e:"✈️",i:"globe"},{e:"🎸",i:"sparkle"},{e:"⚽",i:"sparkle"},{e:"🐶",i:"heart"},{e:"🌸",i:"flower"},{e:"🎨",i:"sparkle"},{e:"🎭",i:"heart"},{e:"🍕",i:"sparkle"},{e:"☕",i:"sparkle"},{e:"🏖️",i:"wave"},{e:"🎪",i:"sparkle"}];
const emojiToIconGroup = emoji => (GROUP_EMOJI_OPTIONS.find(o=>o.e===emoji)||{i:"gift"}).i;
const LIST_EMOJI_OPTIONS = [{e:"🎁",i:"gift"},{e:"🎂",i:"calendar"},{e:"💍",i:"heart"},{e:"🎓",i:"gift"},{e:"🏠",i:"gift"},{e:"❤️",i:"heart"},{e:"🎄",i:"gift"},{e:"🌸",i:"flower"},{e:"✈️",i:"globe"},{e:"🎉",i:"sparkle"},{e:"🌟",i:"star"},{e:"💼",i:"package"}];
const emojiToIconList = emoji => (LIST_EMOJI_OPTIONS.find(o=>o.e===emoji)||{i:"gift"}).i;
let P = {...THEMES.midnight};
// Apply saved theme instantly
try { const saved=localStorage.getItem("giftmate_theme"); if(saved&&THEMES[saved]) setThemeKey(saved); } catch(e) {}

// ── I18N ──────────────────────────────────────────────────────
const LANGUAGES = {
  en: { name:"English", flag:"🇬🇧" },
  es: { name:"Español", flag:"🇪🇸" },
  fr: { name:"Français", flag:"🇫🇷" },
  de: { name:"Deutsch", flag:"🇩🇪" },
  it: { name:"Italiano", flag:"🇮🇹" },
  pt: { name:"Português", flag:"🇵🇹" },
};

const TRANSLATIONS = {
  en: {
    appTagline: "The social gifting app ✨",
    logIn: "Log In", signUp: "Sign Up", createAccount: "Create Account",
    forgotPassword: "Forgot password?", resetSent: "✓ Reset link sent! Check your email.",
    loading: "Loading…", logOut: "Log out", save: "Save Changes ✓", cancel: "Cancel",
    editProfile: "✏️ Edit Profile", displayName: "DISPLAY NAME", username: "USERNAME",
    emojiAvatar: "EMOJI AVATAR", interests: "INTERESTS (up to 8)", removePhoto: "Remove photo",
    home: "Home", search: "Search", groups: "Groups", concierge: "GiftMind", profile: "Profile", stars: "Stars",
    searchPlaceholder: "Search by username…", noResults: "No users found",
    follow: "+ Follow", following: "✓ Following", viewProfile: "View", followers: "Followers", followingCount: "Following", noFollowers: "No followers yet", noFollowing: "Not following anyone yet",
    addOccasion: "+ Add Occasion", addOccasionBtn: "Add +10⭐",
    makePublic: "Make this occasion public (friends can see it)",
    customOccasion: "e.g. Work Anniversary, Pet's Birthday…",
    addWishlist: "+ Add to Wishlist", addGiftReceived: "+ Record a Gift",
    wishlistName: "Gift name", wishlistDesc: "Description (optional)", wishlistPrice: "Price (optional)",
    newList: "+ New List", listName: "LIST NAME", listEmoji: "ICON", createList: "Create List", deleteList: "Delete list",
    allLists: "All", noListItems: "Nothing on this list yet", addToList: "Add to list",
    conciergeOpening: "Hi {name}! 🎁 I'm your personal gift concierge. Who are we finding a gift for today, and what's the occasion?",
    conciergeError: "Hmm, something went wrong. Try again! 🎁",
    conciergeInput: "Ask me anything… (Enter to send)",
    quickChip1: "Gift for mum's birthday 🎂", quickChip2: "Anniversary under €100 💕", quickChip3: "Tech gift for a friend 💻", quickChip4: "Surprise experience ✈️",
    sayThankyou: "Say Thank You ❤️", thanked: "❤️ Thanked!", pending: "⏳ Pending",
    received: "📬 Received", sent: "📤 Sent", noMessages: "No gift messages yet",
    addToCalendar: "📅 Add birthday to my calendar", addedToCalendar: "🎂 birthday added to your calendar!",
    exportToPhone: "📅 Add to Phone", yours: "Yours", friends: "Friends",
    calDays: ["Su","Mo","Tu","We","Th","Fr","Sa"],
    publicLabel: "🌍 Public", privateLabel: "🔒 Private",
    editProfileBtn: "✏️ Edit Profile",
    todayLabel: "🎉 Today!", tomorrowLabel: "Tomorrow!", daysLabel: "d",
    findFriends: "Find your friends!",
    birthdayLabel: "🎂 Birthday",
    inDays: "in", daysWord: "days",
    tierNames: ["Gift Curious","Thoughtful Soul","Gift Whisperer","Joy Spreader","Legendary Giver","Giftmate Icon"],
    tierDescs: ["Just getting started!","You really care","Gifts are your love language","You light up people's lives","A true gifting legend","The ultimate gifting master"],
    aiConcierge: "AI Concierge 💬", yourCompanion: "Your personal gifting companion",
    typeMessage: "Message…",
    giftGroups: "Gift Groups 🎁", planSplit: "Plan & split gifts with friends",
    newGroup: "+ New Group", createGroup: "Create Group 🎉", createFirstGroup: "Create First Group 🎉",
    noGroups: "No groups yet!", noGroupsDesc: "Create a group to plan a mutual gift with friends and split the cost.",
    groupName: "GROUP NAME", occasion: "OCCASION", giftFor: "GIFT IS FOR (optional)",
    totalBudget: "TOTAL BUDGET", addFriends: "ADD FRIENDS",
    proposeGift: "+ Propose", proposeGiftTitle: "Propose a Gift 💡", sendProposal: "Propose Gift 🎁",
    splitCost: "Split the Cost 💸", splitEvenly: "Split evenly", confirmSplit: "Confirm Split 💸",
    splitSaved: "✅ Split saved!", total: "Total", member: "MEMBER", amount: "AMOUNT",
    starsEarned: "Stars earned", howToEarn: "How to earn ⭐", redeemStars: "Redeem Stars 🎁",
    earnFollow: "Follow a friend", earnOccasion: "Add an occasion", earnShare: "Share Giftmate", earnRefer: "Refer a friend",
    redeemLabel: "⭐ Redeem", needMore: "more needed", maxTier: "🏆 Maximum tier achieved!",
    reward1Title: "5% Off Amazon", reward1Desc: "One-time code",
    reward2Title: "Featured on Feed", reward2Desc: "Shown to all users",
    reward3Title: "10% Off Viator", reward3Desc: "Any experience",
    reward4Title: "1 Month Premium", reward4Desc: "Full access",
    shareWhatsapp: "💬 WhatsApp", copyLink: "📋 Copy Link",
    bookBtn: "Book →", buyBtn: "Buy →", nightlifeBtn: "🎉 Book", hotelBtn: "🏨 Book",
    giftIdeasFor: "For", findingGifts: "✨ Finding perfect gifts…",
    getAIIdeas: "✨ Get AI Gift Ideas",
    upcomingOccasions: "Upcoming Occasions 🎁",
    searchFriendsHint: "Search for friends to see their upcoming occasions and get AI gift ideas.",
    friendsGiftHint: "Friends will get gift ideas for you!",
    secOccasions: "🗓️ Occasions", secWishlist: "🎁 Wishlist", secReceived: "🎀 Received", secInbox: "🎁 Inbox",
    noOccasions: "No occasions added yet", wishlistEmpty: "Wishlist is empty",
    noGiftsRecorded: "No gifts recorded yet", noSentMessages: "You haven't sent any gift messages yet!",
    fromWhom: "From", iGiftedThem: "🎁 I gifted them!",
    sendGiftTitle: "Tell {name} you gifted them!", sendGiftMsg: "Send Gift Message 🎁", sending: "Sending…",
    colour: "COLOUR",
    welcomeMsg: "👋 Welcome!", setupProfile: "Let's set up your profile",
    yourName: "YOUR NAME", namePlaceholder: "e.g. María García",
    usernamePlaceholder: "e.g. maria_gifts", usernameHint: "Letters, numbers and _ only",
    pickEmoji: "Pick your vibe 🎭", yourBirthday: "YOUR BIRTHDAY (optional)",
    yourInterests: "WHAT DO YOU LOVE? (pick up to 8)",
    finishSetup: "Let's Go! 🎁", next: "Next →",
    city: "CITY", country: "COUNTRY", language: "LANGUAGE",
  },
  es: {
    appTagline: "La app social de regalos ✨",
    logIn: "Iniciar Sesión", signUp: "Registrarse", createAccount: "Crear Cuenta",
    forgotPassword: "¿Olvidaste tu contraseña?", resetSent: "✓ ¡Enlace enviado! Revisa tu correo.",
    loading: "Cargando…", logOut: "Cerrar sesión", save: "Guardar Cambios ✓", cancel: "Cancelar",
    editProfile: "✏️ Editar Perfil", displayName: "NOMBRE", username: "USUARIO",
    emojiAvatar: "EMOJI", interests: "INTERESES (máx. 8)", removePhoto: "Eliminar foto",
    home: "Inicio", search: "Buscar", groups: "Grupos", concierge: "GiftMind", profile: "Perfil", stars: "Estrellas",
    searchPlaceholder: "Buscar por usuario…", noResults: "Sin resultados",
    follow: "+ Seguir", following: "✓ Siguiendo", viewProfile: "Ver", followers: "Seguidores", followingCount: "Siguiendo", noFollowers: "Aún sin seguidores", noFollowing: "No sigues a nadie aún",
    addOccasion: "+ Añadir Ocasión", addOccasionBtn: "Añadir +10⭐",
    makePublic: "Hacer pública esta ocasión (los amigos pueden verla)",
    customOccasion: "p.ej. Aniversario laboral, Cumple de mascota…",
    addWishlist: "+ Añadir a Lista", addGiftReceived: "+ Registrar Regalo",
    wishlistName: "Nombre del regalo", wishlistDesc: "Descripción (opcional)", wishlistPrice: "Precio (opcional)",
    newList: "+ Nueva Lista", listName: "NOMBRE DE LISTA", listEmoji: "ICONO", createList: "Crear Lista", deleteList: "Eliminar lista",
    allLists: "Todas", noListItems: "Nada en esta lista aún", addToList: "Añadir a lista",
    conciergeOpening: "¡Hola {name}! 🎁 Soy tu concierge de regalos. ¿Para quién buscamos un regalo hoy y cuál es la ocasión?",
    conciergeError: "Vaya, algo salió mal. ¡Inténtalo de nuevo! 🎁",
    conciergeInput: "Pregúntame lo que quieras… (Enter para enviar)",
    quickChip1: "Regalo para el cumple de mamá 🎂", quickChip2: "Aniversario con menos de €100 💕", quickChip3: "Regalo tecnológico para un amigo 💻", quickChip4: "Experiencia sorpresa ✈️",
    sayThankyou: "Dar las gracias ❤️", thanked: "❤️ ¡Gracias dado!", pending: "⏳ Pendiente",
    received: "📬 Recibidos", sent: "📤 Enviados", noMessages: "Sin mensajes de regalo",
    addToCalendar: "📅 Añadir cumple a mi calendario", addedToCalendar: "🎂 cumpleaños añadido a tu calendario!",
    exportToPhone: "📅 Añadir al móvil", yours: "Tuyos", friends: "Amigos",
    calDays: ["Do","Lu","Ma","Mi","Ju","Vi","Sa"],
    publicLabel: "🌍 Público", privateLabel: "🔒 Privado",
    editProfileBtn: "✏️ Editar Perfil",
    todayLabel: "🎉 ¡Hoy!", tomorrowLabel: "¡Mañana!", daysLabel: "d",
    findFriends: "¡Encuentra tus amigos!",
    birthdayLabel: "🎂 Cumpleaños",
    inDays: "en", daysWord: "días",
    tierNames: ["Curioso de Regalos","Alma Considerada","Susurrador de Regalos","Difusor de Alegría","Donante Legendario","Icono Giftmate"],
    tierDescs: ["¡Empezando!","Te importa de verdad","Regalar es tu lenguaje del amor","Iluminas la vida de las personas","Una leyenda del regalo","El maestro supremo del regalo"],
    yours: "Tuyos", friends: "Amigos",
    aiConcierge: "Concierge IA 💬", yourCompanion: "Tu asistente personal de regalos",
    typeMessage: "Mensaje…",
    giftGroups: "Grupos de Regalo 🎁", planSplit: "Planifica y divide regalos con amigos",
    newGroup: "+ Nuevo Grupo", createGroup: "Crear Grupo 🎉", createFirstGroup: "Crear Primer Grupo 🎉",
    noGroups: "¡Sin grupos aún!", noGroupsDesc: "Crea un grupo para planificar un regalo conjunto y dividir el coste.",
    groupName: "NOMBRE DEL GRUPO", occasion: "OCASIÓN", giftFor: "REGALO PARA (opcional)",
    totalBudget: "PRESUPUESTO TOTAL", addFriends: "AÑADIR AMIGOS",
    proposeGift: "+ Proponer", proposeGiftTitle: "Proponer un Regalo 💡", sendProposal: "Proponer Regalo 🎁",
    splitCost: "Dividir el Coste 💸", splitEvenly: "Dividir a partes iguales", confirmSplit: "Confirmar División 💸",
    splitSaved: "✅ ¡División guardada!", total: "Total", member: "MIEMBRO", amount: "IMPORTE",
    starsEarned: "Estrellas ganadas", howToEarn: "Cómo ganar ⭐", redeemStars: "Canjear Estrellas 🎁",
    earnFollow: "Seguir a un amigo", earnOccasion: "Añadir una ocasión", earnShare: "Compartir Giftmate", earnRefer: "Referir a un amigo",
    redeemLabel: "⭐ Canjear", needMore: "faltan", maxTier: "🏆 ¡Nivel máximo alcanzado!",
    reward1Title: "5% Off Amazon", reward1Desc: "Código único",
    reward2Title: "Destacado en el feed", reward2Desc: "Visible para todos",
    reward3Title: "10% Off Viator", reward3Desc: "Cualquier experiencia",
    reward4Title: "1 Mes Premium", reward4Desc: "Acceso completo",
    shareWhatsapp: "💬 WhatsApp", copyLink: "📋 Copiar Enlace",
    bookBtn: "Reservar →", buyBtn: "Comprar →", nightlifeBtn: "🎉 Reservar", hotelBtn: "🏨 Reservar",
    giftIdeasFor: "Para", findingGifts: "✨ Buscando regalos perfectos…",
    getAIIdeas: "✨ Ideas de Regalo con IA",
    upcomingOccasions: "Próximas Ocasiones 🎁",
    searchFriendsHint: "Busca amigos para ver sus próximas ocasiones y obtener ideas de regalo con IA.",
    friendsGiftHint: "¡Los amigos podrán obtener ideas de regalo para ti!",
    secOccasions: "🗓️ Ocasiones", secWishlist: "🎁 Lista", secReceived: "🎀 Recibidos", secInbox: "🎁 Buzón",
    noOccasions: "Sin ocasiones añadidas", wishlistEmpty: "Lista vacía",
    noGiftsRecorded: "Sin regalos registrados", noSentMessages: "¡Aún no has enviado ningún mensaje de regalo!",
    fromWhom: "De", iGiftedThem: "🎁 ¡Les hice un regalo!",
    sendGiftTitle: "¡Cuéntale a {name} que le regalaste algo!", sendGiftMsg: "Enviar mensaje de regalo 🎁", sending: "Enviando…",
    colour: "COLOR",
    welcomeMsg: "👋 ¡Bienvenido!", setupProfile: "Vamos a configurar tu perfil",
    yourName: "TU NOMBRE", namePlaceholder: "p.ej. María García",
    usernamePlaceholder: "p.ej. maria_regalos", usernameHint: "Solo letras, números y _",
    pickEmoji: "Elige tu vibe 🎭", yourBirthday: "TU CUMPLEAÑOS (opcional)",
    yourInterests: "¿QUÉ TE APASIONA? (elige hasta 8)",
    finishSetup: "¡Vamos! 🎁", next: "Siguiente →",
    city: "CIUDAD", country: "PAÍS", language: "IDIOMA",
  },
  fr: {
    appTagline: "L'app sociale de cadeaux ✨",
    logIn: "Connexion", signUp: "S'inscrire", createAccount: "Créer un compte",
    forgotPassword: "Mot de passe oublié ?", resetSent: "✓ Lien envoyé ! Vérifiez votre email.",
    loading: "Chargement…", logOut: "Déconnexion", save: "Enregistrer ✓", cancel: "Annuler",
    editProfile: "✏️ Modifier le profil", displayName: "NOM AFFICHÉ", username: "PSEUDO",
    emojiAvatar: "EMOJI", interests: "CENTRES D'INTÉRÊT (max 8)", removePhoto: "Supprimer la photo",
    home: "Accueil", search: "Chercher", groups: "Groupes", concierge: "GiftMind", profile: "Profil", stars: "Étoiles",
    searchPlaceholder: "Rechercher par pseudo…", noResults: "Aucun résultat",
    follow: "+ Suivre", following: "✓ Abonné", viewProfile: "Voir", followers: "Abonnés", followingCount: "Abonnements", noFollowers: "Pas encore d'abonnés", noFollowing: "Vous ne suivez personne",
    addOccasion: "+ Ajouter occasion", addOccasionBtn: "Ajouter +10⭐",
    makePublic: "Rendre cette occasion publique (les amis peuvent la voir)",
    customOccasion: "ex. Anniversaire de travail, Fête de l'animal…",
    addWishlist: "+ Ajouter à la liste", addGiftReceived: "+ Enregistrer un cadeau",
    wishlistName: "Nom du cadeau", wishlistDesc: "Description (facultatif)", wishlistPrice: "Prix (facultatif)",
    newList: "+ Nouvelle liste", listName: "NOM DE LISTE", listEmoji: "ICÔNE", createList: "Créer la liste", deleteList: "Supprimer la liste",
    allLists: "Toutes", noListItems: "Rien sur cette liste encore", addToList: "Ajouter à la liste",
    conciergeOpening: "Bonjour {name} ! 🎁 Je suis votre concierge cadeaux. Pour qui cherche-t-on un cadeau aujourd'hui et quelle est l'occasion ?",
    conciergeError: "Hmm, une erreur s'est produite. Réessayez ! 🎁",
    conciergeInput: "Posez-moi n'importe quelle question… (Entrée pour envoyer)",
    quickChip1: "Cadeau pour l'anniversaire de maman 🎂", quickChip2: "Anniversaire de couple sous €100 💕", quickChip3: "Cadeau tech pour un ami 💻", quickChip4: "Expérience surprise ✈️",
    sayThankyou: "Dire merci ❤️", thanked: "❤️ Remercié !", pending: "⏳ En attente",
    received: "📬 Reçus", sent: "📤 Envoyés", noMessages: "Aucun message cadeau",
    addToCalendar: "📅 Ajouter l'anniv à mon calendrier", addedToCalendar: "🎂 anniversaire ajouté à votre calendrier !",
    exportToPhone: "📅 Ajouter au téléphone", yours: "Les vôtres", friends: "Amis",
    calDays: ["Di","Lu","Ma","Me","Je","Ve","Sa"],
    publicLabel: "🌍 Public", privateLabel: "🔒 Privé",
    editProfileBtn: "✏️ Modifier le profil",
    todayLabel: "🎉 Aujourd'hui !", tomorrowLabel: "Demain !", daysLabel: "j",
    findFriends: "Trouvez vos amis !",
    birthdayLabel: "🎂 Anniversaire",
    inDays: "dans", daysWord: "jours",
    tierNames: ["Curieux Cadeaux","Âme Attentionnée","Chuchoteur de Cadeaux","Semeur de Joie","Donateur Légendaire","Icône Giftmate"],
    tierDescs: ["Tout juste commencé !","Vous tenez vraiment à eux","Les cadeaux sont votre langage d'amour","Vous illuminez la vie des gens","Une vraie légende des cadeaux","Le maître ultime des cadeaux"],
    yours: "Les vôtres", friends: "Amis",
    aiConcierge: "Concierge IA 💬", yourCompanion: "Votre assistant cadeaux personnel",
    typeMessage: "Message…",
    giftGroups: "Groupes Cadeaux 🎁", planSplit: "Planifiez et partagez des cadeaux",
    newGroup: "+ Nouveau groupe", createGroup: "Créer le groupe 🎉", createFirstGroup: "Créer mon premier groupe 🎉",
    noGroups: "Pas encore de groupes !", noGroupsDesc: "Créez un groupe pour planifier un cadeau commun et partager les frais.",
    groupName: "NOM DU GROUPE", occasion: "OCCASION", giftFor: "CADEAU POUR (facultatif)",
    totalBudget: "BUDGET TOTAL", addFriends: "AJOUTER DES AMIS",
    proposeGift: "+ Proposer", proposeGiftTitle: "Proposer un cadeau 💡", sendProposal: "Proposer 🎁",
    splitCost: "Partager les frais 💸", splitEvenly: "Partager équitablement", confirmSplit: "Confirmer le partage 💸",
    splitSaved: "✅ Partage enregistré !", total: "Total", member: "MEMBRE", amount: "MONTANT",
    starsEarned: "Étoiles gagnées", howToEarn: "Comment gagner ⭐", redeemStars: "Échanger des étoiles 🎁",
    earnFollow: "Suivre un ami", earnOccasion: "Ajouter une occasion", earnShare: "Partager Giftmate", earnRefer: "Parrainer un ami",
    redeemLabel: "⭐ Échanger", needMore: "manquantes", maxTier: "🏆 Niveau maximum atteint !",
    reward1Title: "5% Off Amazon", reward1Desc: "Code unique",
    reward2Title: "Mis en avant", reward2Desc: "Visible par tous",
    reward3Title: "10% Off Viator", reward3Desc: "Toute expérience",
    reward4Title: "1 Mois Premium", reward4Desc: "Accès complet",
    shareWhatsapp: "💬 WhatsApp", copyLink: "📋 Copier le lien",
    bookBtn: "Réserver →", buyBtn: "Acheter →", nightlifeBtn: "🎉 Réserver", hotelBtn: "🏨 Réserver",
    giftIdeasFor: "Pour", findingGifts: "✨ Recherche des cadeaux parfaits…",
    getAIIdeas: "✨ Idées cadeaux par IA",
    upcomingOccasions: "Occasions à venir 🎁",
    searchFriendsHint: "Recherchez des amis pour voir leurs prochaines occasions et obtenir des idées cadeaux.",
    friendsGiftHint: "Vos amis pourront trouver des idées cadeaux pour vous !",
    secOccasions: "🗓️ Occasions", secWishlist: "🎁 Liste", secReceived: "🎀 Reçus", secInbox: "🎁 Boîte",
    noOccasions: "Aucune occasion ajoutée", wishlistEmpty: "Liste vide",
    noGiftsRecorded: "Aucun cadeau enregistré", noSentMessages: "Vous n'avez encore envoyé aucun message cadeau !",
    fromWhom: "De", iGiftedThem: "🎁 Je leur ai offert !",
    sendGiftTitle: "Dites à {name} que vous lui avez offert !", sendGiftMsg: "Envoyer un message cadeau 🎁", sending: "Envoi…",
    colour: "COULEUR",
    welcomeMsg: "👋 Bienvenue !", setupProfile: "Configurons votre profil",
    yourName: "VOTRE NOM", namePlaceholder: "ex. Marie Dupont",
    usernamePlaceholder: "ex. marie_cadeaux", usernameHint: "Lettres, chiffres et _ uniquement",
    pickEmoji: "Choisissez votre vibe 🎭", yourBirthday: "VOTRE ANNIVERSAIRE (facultatif)",
    yourInterests: "QU'EST-CE QUE VOUS AIMEZ ? (choisissez jusqu'à 8)",
    finishSetup: "C'est parti ! 🎁", next: "Suivant →",
    city: "VILLE", country: "PAYS", language: "LANGUE",
  },
  de: {
    appTagline: "Die soziale Geschenk-App ✨",
    logIn: "Anmelden", signUp: "Registrieren", createAccount: "Konto erstellen",
    forgotPassword: "Passwort vergessen?", resetSent: "✓ Link gesendet! Prüfe deine E-Mail.",
    loading: "Laden…", logOut: "Abmelden", save: "Änderungen speichern ✓", cancel: "Abbrechen",
    editProfile: "✏️ Profil bearbeiten", displayName: "ANZEIGENAME", username: "BENUTZERNAME",
    emojiAvatar: "EMOJI", interests: "INTERESSEN (max. 8)", removePhoto: "Foto entfernen",
    home: "Start", search: "Suche", groups: "Gruppen", concierge: "GiftMind", profile: "Profil", stars: "Sterne",
    searchPlaceholder: "Nach Benutzername suchen…", noResults: "Keine Ergebnisse",
    follow: "+ Folgen", following: "✓ Gefolgt", viewProfile: "Ansehen", followers: "Follower", followingCount: "Folge ich", noFollowers: "Noch keine Follower", noFollowing: "Folgst noch niemandem",
    addOccasion: "+ Anlass hinzufügen", addOccasionBtn: "Hinzufügen +10⭐",
    makePublic: "Diesen Anlass öffentlich machen (Freunde können ihn sehen)",
    customOccasion: "z.B. Arbeitsjubiläum, Haustier-Geburtstag…",
    addWishlist: "+ Zur Wunschliste", addGiftReceived: "+ Geschenk erfassen",
    wishlistName: "Geschenkname", wishlistDesc: "Beschreibung (optional)", wishlistPrice: "Preis (optional)",
    newList: "+ Neue Liste", listName: "LISTENNAME", listEmoji: "ICON", createList: "Liste erstellen", deleteList: "Liste löschen",
    allLists: "Alle", noListItems: "Noch nichts auf dieser Liste", addToList: "Zur Liste hinzufügen",
    conciergeOpening: "Hallo {name}! 🎁 Ich bin dein persönlicher Geschenk-Concierge. Für wen suchen wir heute ein Geschenk und was ist der Anlass?",
    conciergeError: "Hmm, etwas ist schief gelaufen. Versuch es nochmal! 🎁",
    conciergeInput: "Frag mich alles… (Enter zum Senden)",
    quickChip1: "Geschenk für Mamas Geburtstag 🎂", quickChip2: "Jubiläum unter €100 💕", quickChip3: "Tech-Geschenk für einen Freund 💻", quickChip4: "Überraschungserlebnis ✈️",
    sayThankyou: "Danke sagen ❤️", thanked: "❤️ Gedankt!", pending: "⏳ Ausstehend",
    received: "📬 Empfangen", sent: "📤 Gesendet", noMessages: "Noch keine Geschenknachrichten",
    addToCalendar: "📅 Geburtstag zu meinem Kalender", addedToCalendar: "🎂 Geburtstag zu deinem Kalender hinzugefügt!",
    exportToPhone: "📅 Zum Handy exportieren", yours: "Deine", friends: "Freunde",
    calDays: ["So","Mo","Di","Mi","Do","Fr","Sa"],
    publicLabel: "🌍 Öffentlich", privateLabel: "🔒 Privat",
    editProfileBtn: "✏️ Profil bearbeiten",
    todayLabel: "🎉 Heute!", tomorrowLabel: "Morgen!", daysLabel: "T",
    findFriends: "Finde deine Freunde!",
    birthdayLabel: "🎂 Geburtstag",
    inDays: "in", daysWord: "Tagen",
    tierNames: ["Geschenk-Neuling","Fürsorgliche Seele","Geschenk-Flüsterer","Freudenspender","Legendärer Geber","Giftmate-Ikone"],
    tierDescs: ["Gerade erst angefangen!","Du kümmerst dich wirklich","Schenken ist deine Liebessprache","Du erhellst das Leben anderer","Eine wahre Schenklegende","Der ultimative Schenkmeister"],
    aiConcierge: "KI-Concierge 💬", yourCompanion: "Dein persönlicher Geschenk-Assistent",
    typeMessage: "Nachricht…",
    giftGroups: "Geschenkgruppen 🎁", planSplit: "Gemeinsame Geschenke planen & teilen",
    newGroup: "+ Neue Gruppe", createGroup: "Gruppe erstellen 🎉", createFirstGroup: "Erste Gruppe erstellen 🎉",
    noGroups: "Noch keine Gruppen!", noGroupsDesc: "Erstelle eine Gruppe um gemeinsame Geschenke zu planen und Kosten zu teilen.",
    groupName: "GRUPPENNAME", occasion: "ANLASS", giftFor: "GESCHENK FÜR (optional)",
    totalBudget: "GESAMTBUDGET", addFriends: "FREUNDE HINZUFÜGEN",
    proposeGift: "+ Vorschlagen", proposeGiftTitle: "Geschenk vorschlagen 💡", sendProposal: "Vorschlagen 🎁",
    splitCost: "Kosten teilen 💸", splitEvenly: "Gleichmäßig aufteilen", confirmSplit: "Aufteilung bestätigen 💸",
    splitSaved: "✅ Aufteilung gespeichert!", total: "Gesamt", member: "MITGLIED", amount: "BETRAG",
    starsEarned: "Verdiente Sterne", howToEarn: "Wie Sterne verdienen ⭐", redeemStars: "Sterne einlösen 🎁",
    earnFollow: "Einem Freund folgen", earnOccasion: "Anlass hinzufügen", earnShare: "Giftmate teilen", earnRefer: "Freund werben",
    redeemLabel: "⭐ Einlösen", needMore: "fehlen noch", maxTier: "🏆 Maximales Level erreicht!",
    reward1Title: "5% Rabatt Amazon", reward1Desc: "Einmalcode",
    reward2Title: "Im Feed hervorgehoben", reward2Desc: "Allen sichtbar",
    reward3Title: "10% Rabatt Viator", reward3Desc: "Jedes Erlebnis",
    reward4Title: "1 Monat Premium", reward4Desc: "Voller Zugang",
    shareWhatsapp: "💬 WhatsApp", copyLink: "📋 Link kopieren",
    bookBtn: "Buchen →", buyBtn: "Kaufen →", nightlifeBtn: "🎉 Buchen", hotelBtn: "🏨 Buchen",
    giftIdeasFor: "Für", findingGifts: "✨ Perfekte Geschenke werden gesucht…",
    getAIIdeas: "✨ KI-Geschenkideen",
    upcomingOccasions: "Bevorstehende Anlässe 🎁",
    searchFriendsHint: "Suche nach Freunden, um ihre bevorstehenden Anlässe zu sehen und KI-Geschenkideen zu erhalten.",
    friendsGiftHint: "Freunde können Geschenkideen für dich bekommen!",
    secOccasions: "🗓️ Anlässe", secWishlist: "🎁 Wunschliste", secReceived: "🎀 Erhalten", secInbox: "🎁 Posteingang",
    noOccasions: "Noch keine Anlässe", wishlistEmpty: "Wunschliste leer",
    noGiftsRecorded: "Noch keine Geschenke", noSentMessages: "Du hast noch keine Geschenknachrichten gesendet!",
    fromWhom: "Von", iGiftedThem: "🎁 Ich hab ihnen was geschenkt!",
    sendGiftTitle: "Sag {name}, dass du ihnen etwas geschenkt hast!", sendGiftMsg: "Geschenknachricht senden 🎁", sending: "Senden…",
    colour: "FARBE",
    welcomeMsg: "👋 Willkommen!", setupProfile: "Lass uns dein Profil einrichten",
    yourName: "DEIN NAME", namePlaceholder: "z.B. Anna Müller",
    usernamePlaceholder: "z.B. anna_geschenke", usernameHint: "Nur Buchstaben, Zahlen und _",
    pickEmoji: "Wähl deinen Vibe 🎭", yourBirthday: "DEIN GEBURTSTAG (optional)",
    yourInterests: "WAS LIEBST DU? (bis zu 8 wählen)",
    finishSetup: "Los geht's! 🎁", next: "Weiter →",
    city: "STADT", country: "LAND", language: "SPRACHE",
  },
  it: {
    appTagline: "L'app sociale dei regali ✨",
    logIn: "Accedi", signUp: "Registrati", createAccount: "Crea account",
    forgotPassword: "Password dimenticata?", resetSent: "✓ Link inviato! Controlla la tua email.",
    loading: "Caricamento…", logOut: "Esci", save: "Salva modifiche ✓", cancel: "Annulla",
    editProfile: "✏️ Modifica profilo", displayName: "NOME VISUALIZZATO", username: "NOME UTENTE",
    emojiAvatar: "EMOJI", interests: "INTERESSI (max 8)", removePhoto: "Rimuovi foto",
    home: "Home", search: "Cerca", groups: "Gruppi", concierge: "GiftMind", profile: "Profilo", stars: "Stelle",
    searchPlaceholder: "Cerca per username…", noResults: "Nessun risultato",
    follow: "+ Segui", following: "✓ Seguito", viewProfile: "Vedi", followers: "Follower", followingCount: "Seguiti", noFollowers: "Ancora nessun follower", noFollowing: "Non segui ancora nessuno",
    addOccasion: "+ Aggiungi occasione", addOccasionBtn: "Aggiungi +10⭐",
    makePublic: "Rendi pubblica questa occasione (gli amici possono vederla)",
    customOccasion: "es. Anniversario di lavoro, Compleanno dell'animale…",
    addWishlist: "+ Aggiungi alla lista", addGiftReceived: "+ Registra regalo",
    wishlistName: "Nome regalo", wishlistDesc: "Descrizione (opzionale)", wishlistPrice: "Prezzo (opzionale)",
    newList: "+ Nuova lista", listName: "NOME LISTA", listEmoji: "ICONA", createList: "Crea lista", deleteList: "Elimina lista",
    allLists: "Tutte", noListItems: "Niente in questa lista ancora", addToList: "Aggiungi alla lista",
    conciergeOpening: "Ciao {name}! 🎁 Sono il tuo concierge regalo personale. Per chi stiamo cercando un regalo oggi e qual è l'occasione?",
    conciergeError: "Hmm, qualcosa è andato storto. Riprova! 🎁",
    conciergeInput: "Chiedimi qualsiasi cosa… (Invio per inviare)",
    quickChip1: "Regalo per il compleanno della mamma 🎂", quickChip2: "Anniversario sotto €100 💕", quickChip3: "Regalo tech per un amico 💻", quickChip4: "Esperienza a sorpresa ✈️",
    sayThankyou: "Ringrazia ❤️", thanked: "❤️ Ringraziato!", pending: "⏳ In attesa",
    received: "📬 Ricevuti", sent: "📤 Inviati", noMessages: "Nessun messaggio regalo",
    addToCalendar: "📅 Aggiungi compleanno al calendario", addedToCalendar: "🎂 compleanno aggiunto al tuo calendario!",
    exportToPhone: "📅 Aggiungi al telefono", yours: "Tuoi", friends: "Amici",
    calDays: ["Do","Lu","Ma","Me","Gi","Ve","Sa"],
    publicLabel: "🌍 Pubblico", privateLabel: "🔒 Privato",
    editProfileBtn: "✏️ Modifica profilo",
    todayLabel: "🎉 Oggi!", tomorrowLabel: "Domani!", daysLabel: "g",
    findFriends: "Trova i tuoi amici!",
    birthdayLabel: "🎂 Compleanno",
    inDays: "tra", daysWord: "giorni",
    tierNames: ["Curioso dei Regali","Anima Premurosa","Sussurratore di Regali","Diffusore di Gioia","Donatore Leggendario","Icona Giftmate"],
    tierDescs: ["Hai appena iniziato!","Ci tieni davvero","I regali sono il tuo linguaggio d'amore","Illumini la vita delle persone","Una vera leggenda del regalo","Il maestro supremo del regalo"],
    yours: "Tuoi", friends: "Amici",
    aiConcierge: "Concierge IA 💬", yourCompanion: "Il tuo assistente personale per regali",
    typeMessage: "Messaggio…",
    giftGroups: "Gruppi Regalo 🎁", planSplit: "Pianifica e dividi regali con gli amici",
    newGroup: "+ Nuovo gruppo", createGroup: "Crea gruppo 🎉", createFirstGroup: "Crea il primo gruppo 🎉",
    noGroups: "Nessun gruppo ancora!", noGroupsDesc: "Crea un gruppo per pianificare un regalo comune e dividere i costi.",
    groupName: "NOME GRUPPO", occasion: "OCCASIONE", giftFor: "REGALO PER (opzionale)",
    totalBudget: "BUDGET TOTALE", addFriends: "AGGIUNGI AMICI",
    proposeGift: "+ Proponi", proposeGiftTitle: "Proponi un regalo 💡", sendProposal: "Proponi regalo 🎁",
    splitCost: "Dividi il costo 💸", splitEvenly: "Dividi equamente", confirmSplit: "Conferma divisione 💸",
    splitSaved: "✅ Divisione salvata!", total: "Totale", member: "MEMBRO", amount: "IMPORTO",
    starsEarned: "Stelle guadagnate", howToEarn: "Come guadagnare ⭐", redeemStars: "Riscatta stelle 🎁",
    earnFollow: "Segui un amico", earnOccasion: "Aggiungi un'occasione", earnShare: "Condividi Giftmate", earnRefer: "Invita un amico",
    redeemLabel: "⭐ Riscatta", needMore: "mancanti", maxTier: "🏆 Livello massimo raggiunto!",
    reward1Title: "5% Off Amazon", reward1Desc: "Codice monouso",
    reward2Title: "In evidenza nel feed", reward2Desc: "Visibile a tutti",
    reward3Title: "10% Off Viator", reward3Desc: "Qualsiasi esperienza",
    reward4Title: "1 Mese Premium", reward4Desc: "Accesso completo",
    shareWhatsapp: "💬 WhatsApp", copyLink: "📋 Copia link",
    bookBtn: "Prenota →", buyBtn: "Acquista →", nightlifeBtn: "🎉 Prenota", hotelBtn: "🏨 Prenota",
    giftIdeasFor: "Per", findingGifts: "✨ Ricerca regali perfetti…",
    getAIIdeas: "✨ Idee regalo con IA",
    upcomingOccasions: "Occasioni in arrivo 🎁",
    searchFriendsHint: "Cerca amici per vedere le loro prossime occasioni e ottenere idee regalo con IA.",
    friendsGiftHint: "Gli amici potranno trovare idee regalo per te!",
    secOccasions: "🗓️ Occasioni", secWishlist: "🎁 Lista", secReceived: "🎀 Ricevuti", secInbox: "🎁 Posta",
    noOccasions: "Nessuna occasione aggiunta", wishlistEmpty: "Lista desideri vuota",
    noGiftsRecorded: "Nessun regalo registrato", noSentMessages: "Non hai ancora inviato messaggi regalo!",
    fromWhom: "Da", iGiftedThem: "🎁 Ho fatto loro un regalo!",
    sendGiftTitle: "Dì a {name} che hai fatto loro un regalo!", sendGiftMsg: "Invia messaggio regalo 🎁", sending: "Invio…",
    colour: "COLORE",
    welcomeMsg: "👋 Benvenuto!", setupProfile: "Configuriamo il tuo profilo",
    yourName: "IL TUO NOME", namePlaceholder: "es. Maria Rossi",
    usernamePlaceholder: "es. maria_regali", usernameHint: "Solo lettere, numeri e _",
    pickEmoji: "Scegli il tuo vibe 🎭", yourBirthday: "IL TUO COMPLEANNO (opzionale)",
    yourInterests: "COSA AMI? (scegli fino a 8)",
    finishSetup: "Iniziamo! 🎁", next: "Avanti →",
    city: "CITTÀ", country: "PAESE", language: "LINGUA",
  },
  pt: {
    appTagline: "O app social de presentes ✨",
    logIn: "Entrar", signUp: "Cadastrar", createAccount: "Criar conta",
    forgotPassword: "Esqueceu a senha?", resetSent: "✓ Link enviado! Verifique seu email.",
    loading: "Carregando…", logOut: "Sair", save: "Salvar alterações ✓", cancel: "Cancelar",
    editProfile: "✏️ Editar perfil", displayName: "NOME EXIBIDO", username: "NOME DE USUÁRIO",
    emojiAvatar: "EMOJI", interests: "INTERESSES (máx. 8)", removePhoto: "Remover foto",
    home: "Início", search: "Buscar", groups: "Grupos", concierge: "GiftMind", profile: "Perfil", stars: "Estrelas",
    searchPlaceholder: "Buscar por usuário…", noResults: "Sem resultados",
    follow: "+ Seguir", following: "✓ Seguindo", viewProfile: "Ver", followers: "Seguidores", followingCount: "Seguindo", noFollowers: "Sem seguidores ainda", noFollowing: "Não segue ninguém ainda",
    addOccasion: "+ Adicionar ocasião", addOccasionBtn: "Adicionar +10⭐",
    makePublic: "Tornar esta ocasião pública (amigos podem ver)",
    customOccasion: "ex. Aniversário de trabalho, Aniversário do pet…",
    addWishlist: "+ Adicionar à lista", addGiftReceived: "+ Registrar presente",
    wishlistName: "Nome do presente", wishlistDesc: "Descrição (opcional)", wishlistPrice: "Preço (opcional)",
    newList: "+ Nova Lista", listName: "NOME DA LISTA", listEmoji: "ÍCONE", createList: "Criar Lista", deleteList: "Excluir lista",
    allLists: "Todas", noListItems: "Nada nesta lista ainda", addToList: "Adicionar à lista",
    conciergeOpening: "Olá {name}! 🎁 Sou seu concierge de presentes pessoal. Para quem estamos procurando um presente hoje e qual é a ocasião?",
    conciergeError: "Hmm, algo deu errado. Tente novamente! 🎁",
    conciergeInput: "Pergunte-me qualquer coisa… (Enter para enviar)",
    quickChip1: "Presente para o aniversário da mãe 🎂", quickChip2: "Aniversário abaixo de €100 💕", quickChip3: "Presente tech para um amigo 💻", quickChip4: "Experiência surpresa ✈️",
    sayThankyou: "Agradecer ❤️", thanked: "❤️ Agradecido!", pending: "⏳ Pendente",
    received: "📬 Recebidos", sent: "📤 Enviados", noMessages: "Sem mensagens de presente",
    addToCalendar: "📅 Adicionar aniversário ao calendário", addedToCalendar: "🎂 aniversário adicionado ao seu calendário!",
    exportToPhone: "📅 Exportar para o telefone", yours: "Seus", friends: "Amigos",
    calDays: ["Do","Se","Te","Qu","Qu","Se","Sa"],
    publicLabel: "🌍 Público", privateLabel: "🔒 Privado",
    editProfileBtn: "✏️ Editar perfil",
    todayLabel: "🎉 Hoje!", tomorrowLabel: "Amanhã!", daysLabel: "d",
    findFriends: "Encontre seus amigos!",
    birthdayLabel: "🎂 Aniversário",
    inDays: "em", daysWord: "dias",
    tierNames: ["Curioso de Presentes","Alma Atenciosa","Sussurrador de Presentes","Espalhador de Alegria","Doador Lendário","Ícone Giftmate"],
    tierDescs: ["Apenas começando!","Você realmente se importa","Presentear é sua linguagem do amor","Você ilumina a vida das pessoas","Uma verdadeira lenda dos presentes","O mestre supremo dos presentes"],
    aiConcierge: "Concierge IA 💬", yourCompanion: "Seu assistente pessoal de presentes",
    typeMessage: "Mensagem…",
    giftGroups: "Grupos de Presentes 🎁", planSplit: "Planeje e divida presentes com amigos",
    newGroup: "+ Novo grupo", createGroup: "Criar grupo 🎉", createFirstGroup: "Criar primeiro grupo 🎉",
    noGroups: "Sem grupos ainda!", noGroupsDesc: "Crie um grupo para planejar um presente conjunto e dividir os custos.",
    groupName: "NOME DO GRUPO", occasion: "OCASIÃO", giftFor: "PRESENTE PARA (opcional)",
    totalBudget: "ORÇAMENTO TOTAL", addFriends: "ADICIONAR AMIGOS",
    proposeGift: "+ Propor", proposeGiftTitle: "Propor um presente 💡", sendProposal: "Propor presente 🎁",
    splitCost: "Dividir o custo 💸", splitEvenly: "Dividir igualmente", confirmSplit: "Confirmar divisão 💸",
    splitSaved: "✅ Divisão salva!", total: "Total", member: "MEMBRO", amount: "VALOR",
    starsEarned: "Estrelas ganhas", howToEarn: "Como ganhar ⭐", redeemStars: "Resgatar estrelas 🎁",
    earnFollow: "Seguir um amigo", earnOccasion: "Adicionar uma ocasião", earnShare: "Compartilhar Giftmate", earnRefer: "Indicar um amigo",
    redeemLabel: "⭐ Resgatar", needMore: "faltam", maxTier: "🏆 Nível máximo alcançado!",
    reward1Title: "5% Off Amazon", reward1Desc: "Código único",
    reward2Title: "Destaque no feed", reward2Desc: "Visível para todos",
    reward3Title: "10% Off Viator", reward3Desc: "Qualquer experiência",
    reward4Title: "1 Mês Premium", reward4Desc: "Acesso completo",
    shareWhatsapp: "💬 WhatsApp", copyLink: "📋 Copiar link",
    bookBtn: "Reservar →", buyBtn: "Comprar →", nightlifeBtn: "🎉 Reservar", hotelBtn: "🏨 Reservar",
    giftIdeasFor: "Para", findingGifts: "✨ Encontrando presentes perfeitos…",
    getAIIdeas: "✨ Ideias de presente com IA",
    upcomingOccasions: "Próximas Ocasiões 🎁",
    searchFriendsHint: "Busque amigos para ver suas próximas ocasiões e obter ideias de presente com IA.",
    friendsGiftHint: "Amigos poderão encontrar ideias de presente para você!",
    secOccasions: "🗓️ Ocasiões", secWishlist: "🎁 Lista", secReceived: "🎀 Recebidos", secInbox: "🎁 Caixa",
    noOccasions: "Nenhuma ocasião adicionada", wishlistEmpty: "Lista de desejos vazia",
    noGiftsRecorded: "Nenhum presente registrado", noSentMessages: "Você ainda não enviou nenhuma mensagem de presente!",
    fromWhom: "De", iGiftedThem: "🎁 Eu dei um presente!",
    sendGiftTitle: "Diga a {name} que você deu um presente!", sendGiftMsg: "Enviar mensagem de presente 🎁", sending: "Enviando…",
    colour: "COR",
    welcomeMsg: "👋 Bem-vindo!", setupProfile: "Vamos configurar seu perfil",
    yourName: "SEU NOME", namePlaceholder: "ex. Maria Silva",
    usernamePlaceholder: "ex. maria_presentes", usernameHint: "Apenas letras, números e _",
    pickEmoji: "Escolha seu vibe 🎭", yourBirthday: "SEU ANIVERSÁRIO (opcional)",
    yourInterests: "O QUE VOCÊ AMA? (escolha até 8)",
    finishSetup: "Vamos lá! 🎁", next: "Próximo →",
    city: "CIDADE", country: "PAÍS", language: "IDIOMA",
  },
};

// Active language — reads from profile, falls back to browser, then English
let _lang = "en";
const t = key => (TRANSLATIONS[_lang]?.[key]) || TRANSLATIONS.en[key] || key;
const setLang = lang => { if(TRANSLATIONS[lang]) _lang = lang; };

// ── ANALYTICS ──
const SESSION_ID = Math.random().toString(36).slice(2);
let _currentUserId = null;
const track = (eventType, properties={}) => {
  if(!_currentUserId) return;
  sb.from("events").insert({
    user_id: _currentUserId,
    event_type: eventType,
    properties,
    session_id: SESSION_ID,
    platform: "web"
  }).then(() => {});  // fire-and-forget, never blocks UI
};
const trackTabView = (() => {
  let _tabStart = Date.now(), _lastTab = null;
  return tab => {
    if(_lastTab) track("tab_view", {tab_name:_lastTab, duration_ms: Date.now()-_tabStart});
    _lastTab = tab; _tabStart = Date.now();
  };
})();
const captureError = (source, error, context={}) => {
  console.error(`[${source}]`, error, context);
  const message = typeof error === "string" ? error : (error?.message || "Unknown error");
  track("client_error", {source, message: String(message).slice(0, 500), context});
};
const openLegalPage = path => {
  const url = new URL(path, window.location.origin).toString();
  window.open(url, "_blank", "noopener,noreferrer");
};
const requestAccountDeletion = email => {
  const subject = encodeURIComponent("Giftmate account deletion request");
  const body = encodeURIComponent(`Please delete my Giftmate account.\n\nEmail: ${email || ""}\nUsername: \nReason (optional): `);
  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
};
const getAuthUrlParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  const hashParams = new URLSearchParams(hash);
  const merged = new URLSearchParams(searchParams.toString());
  for(const [key, value] of hashParams.entries()) merged.set(key, value);
  return merged;
};
const isRecoveryFlow = () => {
  const params = getAuthUrlParams();
  return (
    params.get("type") === "recovery" ||
    Boolean(params.get("code")) ||
    Boolean(params.get("token_hash")) ||
    Boolean(params.get("access_token"))
  );
};
const hasRecoveryError = () => {
  const params = getAuthUrlParams();
  return Boolean(
    params.get("error_code") ||
    params.get("error_description")
  );
};
const hasRecoveryTokens = () => {
  const params = getAuthUrlParams();
  return Boolean(
    (params.get("access_token") && params.get("refresh_token")) ||
    params.get("code") ||
    params.get("token_hash")
  );
};
const getRecoveryErrorMessage = () => {
  const params = getAuthUrlParams();
  return params.get("error_description") || params.get("error_code") || "";
};
const initializeRecoverySession = async () => {
  const params = getAuthUrlParams();

  if(hasRecoveryError()) {
    return {session:null, error:new Error(getRecoveryErrorMessage() || "Reset link expired")};
  }

  if(params.get("code")) {
    const {data, error} = await sb.auth.exchangeCodeForSession(params.get("code"));
    return {session:data?.session || null, error:error || null};
  }

  if(params.get("token_hash") && params.get("type")==="recovery") {
    const {data, error} = await sb.auth.verifyOtp({
      token_hash: params.get("token_hash"),
      type: "recovery"
    });
    return {session:data?.session || null, error:error || null};
  }

  const {data:{session}} = await sb.auth.getSession();
  return {session, error:null};
};
const clearAuthHash = () => {
  const cleanUrl = `${window.location.pathname}`;
  if(window.location.hash || window.location.search) {
    window.history.replaceState({}, document.title, cleanUrl);
  }
};
const callChatApi = async payload => {
  const {data:{session}} = await sb.auth.getSession();
  if(!session?.access_token) throw new Error("Please log in again to use Giftmate AI.");
  const res = await fetch(API, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${session.access_token}`
    },
    body:JSON.stringify(payload)
  });
  const data = await res.json();
  if(!res.ok) throw new Error(data?.error || "Giftmate AI is unavailable right now.");
  return data;
};
const INTEREST_KEYS=["Gaming","Music","Travel","Cooking","Fitness","Photography","Art","Reading","Tech","Sports","Fashion","Film","Hiking","Coffee","Wine","Yoga","Dance","DIY"];
const INTEREST_TRANSLATIONS={
  en: ["Gaming","Music","Travel","Cooking","Fitness","Photography","Art","Reading","Tech","Sports","Fashion","Film","Hiking","Coffee","Wine","Yoga","Dance","DIY"],
  es: ["Videojuegos","Música","Viajes","Cocina","Fitness","Fotografía","Arte","Lectura","Tecnología","Deportes","Moda","Cine","Senderismo","Café","Vino","Yoga","Baile","Manualidades"],
  fr: ["Jeux vidéo","Musique","Voyages","Cuisine","Fitness","Photographie","Art","Lecture","Tech","Sport","Mode","Cinéma","Randonnée","Café","Vin","Yoga","Danse","DIY"],
  de: ["Gaming","Musik","Reisen","Kochen","Fitness","Fotografie","Kunst","Lesen","Technik","Sport","Mode","Film","Wandern","Kaffee","Wein","Yoga","Tanzen","Heimwerken"],
  it: ["Gaming","Musica","Viaggi","Cucina","Fitness","Fotografia","Arte","Lettura","Tech","Sport","Moda","Cinema","Escursionismo","Caffè","Vino","Yoga","Danza","Fai da te"],
  pt: ["Games","Música","Viagens","Culinária","Fitness","Fotografia","Arte","Leitura","Tech","Esportes","Moda","Cinema","Trilhas","Café","Vinho","Yoga","Dança","DIY"],
};
const getInterests = () => INTEREST_TRANSLATIONS[_lang] || INTEREST_TRANSLATIONS.en;
const translateInterest = key => { const i = INTEREST_KEYS.indexOf(key); return i>=0 ? (getInterests()[i]||key) : key; };
const INTERESTS = INTEREST_KEYS;
const EMOJIS=["🎁","😊","🌟","🎯","🦋","🌈","🎨","🎵","🌺","🦁","🐺","🦊","🐬","🌙","⭐","🔥","💫","🎭"];
const OCCASION_KEYS=["Birthday","Anniversary","Christmas","Valentine's Day","Mother's Day","Father's Day","Graduation","Wedding","Baby Shower","Housewarming","Retirement","Other"];
const OCCASION_TRANSLATIONS = {
  en: ["Birthday","Anniversary","Christmas","Valentine's Day","Mother's Day","Father's Day","Graduation","Wedding","Baby Shower","Housewarming","Retirement","Other"],
  es: ["Cumpleaños","Aniversario","Navidad","San Valentín","Día de la Madre","Día del Padre","Graduación","Boda","Baby Shower","Inauguración","Jubilación","Otro"],
  fr: ["Anniversaire","Anniversaire de couple","Noël","Saint-Valentin","Fête des Mères","Fête des Pères","Remise de diplôme","Mariage","Baby Shower","Pendaison de crémaillère","Retraite","Autre"],
  de: ["Geburtstag","Jahrestag","Weihnachten","Valentinstag","Muttertag","Vatertag","Abschluss","Hochzeit","Babyparty","Einzugsfeier","Ruhestand","Sonstiges"],
  it: ["Compleanno","Anniversario","Natale","San Valentino","Festa della Mamma","Festa del Papà","Laurea","Matrimonio","Baby Shower","Inaugurazione casa","Pensionamento","Altro"],
  pt: ["Aniversário","Aniversário de casal","Natal","Dia dos Namorados","Dia das Mães","Dia dos Pais","Formatura","Casamento","Chá de Bebê","Inauguração","Aposentadoria","Outro"],
};
const getOccasions = () => OCCASION_TRANSLATIONS[_lang] || OCCASION_TRANSLATIONS.en;
const translateOccasion = key => { const i = OCCASIONS.indexOf(key); return i>=0 ? (getOccasions()[i]||key) : key; };
const OCCASIONS = OCCASION_KEYS; // keep for DB storage (always English keys)

const TIER_SVG_ICONS = ["sprout","heart","sparkle","gift","crown","trophy"];
const TIER_COLORS = ["#6EE7B7","#93C5FD","#F4A438","#C084FC","#F87171","#FFD700"];
const TIER_RANGES = [{min:0,max:99},{min:100,max:299},{min:300,max:699},{min:700,max:1499},{min:1500,max:2999},{min:3000,max:Infinity}];
const getTier = stars => {
  const i = TIER_RANGES.findIndex((r,idx) => stars >= r.min && stars <= r.max);
  const idx = i >= 0 ? i : 0;
  const names = t("tierNames") || ["Gift Curious","Thoughtful Soul","Gift Whisperer","Joy Spreader","Legendary Giver","Giftmate Icon"];
  const descs = t("tierDescs") || ["Just getting started!","You really care","Gifts are your love language","You light up people's lives","A true gifting legend","The ultimate gifting master"];
  return {min:TIER_RANGES[idx].min, max:TIER_RANGES[idx].max, svgIcon:TIER_SVG_ICONS[idx], color:TIER_COLORS[idx], name:names[idx], desc:descs[idx]};
};
const TIERS = TIER_RANGES.map((r,i) => ({...r, svgIcon:TIER_SVG_ICONS[i], color:TIER_COLORS[i], name:"", desc:""}));

const daysUntil = d => {
  if(!d) return 999;
  const t = new Date(); t.setHours(0,0,0,0);
  const dd = new Date(d);
  const n = new Date(t.getFullYear(), dd.getMonth(), dd.getDate());
  if(n < t) n.setFullYear(n.getFullYear()+1);
  return Math.ceil((n-t)/86400000);
};
const fmtDate = d => {
  if(!d) return "";
  try { return new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"long"}); } catch(e) { return d; }
};

// ── HELPERS ──
function Toast({msg, onDone}) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, []);
  return html`<div style=${{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:P.card,border:`1px solid ${P.gold}55`,color:P.text,borderRadius:12,padding:"12px 22px",fontSize:14,fontWeight:600,zIndex:9999,boxShadow:"0 4px 24px #00000088",whiteSpace:"nowrap"}}>${msg}</div>`;
}

function Spin() {
  return html`<div style=${{display:"flex",alignItems:"center",justifyContent:"center",gap:8,height:"100vh",background:P.bg,color:P.gold,fontSize:18}}>${Icon("gift",24,P.gold)} Loading Giftmate…</div>`;
}

function Avatar({emoji, avatarUrl, size=40, style={}}) {
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [avatarUrl]);
  const showImg = avatarUrl && !imgError;
  if(showImg) return html`<div style=${{width:size,height:size,borderRadius:"50%",overflow:"hidden",flexShrink:0,...style}}><img src=${avatarUrl} onError=${()=>setImgError(true)} style=${{width:"100%",height:"100%",objectFit:"cover"}}/></div>`;
  return html`<div style=${{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#1a1a2e",...style}}>${Icon(emojiToIcon(emoji||"🎁"),Math.round(size*0.5),"#1a1a2e")}</div>`;
}

// ── PHOTO PICKER HELPER ──
function pickPhoto(onResult) {
  const inp = document.createElement("input");
  inp.type = "file"; inp.accept = "image/*";
  inp.onchange = e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      // Resize to max 400px via canvas
      const img = new window.Image();
      img.onload = () => {
        const max = 400;
        const scale = Math.min(1, max/img.width, max/img.height);
        const canvas = document.createElement("canvas");
        canvas.width = img.width*scale; canvas.height = img.height*scale;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        onResult(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  inp.click();
}

function getBirthdaySyncNote(profileId) {
  return `birthday:${profileId}`;
}

function getNextBirthdayDate(birthday) {
  if(!birthday) return null;
  const [,mm,dd] = birthday.split("-").map(Number);
  if(!mm || !dd) return null;
  const today = new Date();
  today.setHours(0,0,0,0);
  let year = today.getFullYear();
  const nextBirthday = new Date(year, mm - 1, dd);
  if(nextBirthday < today) year += 1;
  return `${year}-${String(mm).padStart(2,"0")}-${String(dd).padStart(2,"0")}`;
}

// ── EDIT PROFILE MODAL ──
function EditProfileModal({profile, onSave, onClose, onLangChange, onThemeChange}) {
  const [name, setName] = useState(profile.display_name||"");
  const [username, setUsername] = useState(profile.username||"");
  const [emoji, setEmoji] = useState(profile.emoji||"🎁");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url||"");
  const [interests, setInterests] = useState(profile.interests||[]);
  const [birthday, setBirthday] = useState(profile.birthday||"");
  const [city, setCity] = useState(profile.city||"");
  const [country, setCountry] = useState(profile.country||"");
  const [language, setLanguage] = useState(profile.language||_lang||"en");
  const [selectedTheme, setSelectedTheme] = useState(profile.theme||_theme||"midnight");
  const [isPrivate, setIsPrivate] = useState(profile.is_private||false);
  const [loading, setLoading] = useState(false);
  const toggleI = i => setInterests(p => p.includes(i)?p.filter(x=>x!==i):[...p,i]);

  const save = async () => {
    if(!name.trim()) return;
    setLoading(true);
    try {
      const updates = {display_name:name, username:username.toLowerCase().replace(/[^a-z0-9_]/g,""), emoji, interests, birthday:birthday||null, avatar_url:avatarUrl||null, city:city||null, country:country||null, language, is_private:isPrivate};
      // Save theme separately in case migration_theme.sql hasn't been run yet
      const {error} = await sb.from("profiles").update(updates).eq("id", profile.id);
      if(error) { console.error("Save error:", error); setLoading(false); return; }
      await sb.from("profiles").update({theme:selectedTheme}).eq("id", profile.id).then(()=>{}).catch(()=>{});
      if(profile.display_name !== name || (profile.birthday||null) !== (birthday||null)) {
        const {error: syncError} = await sb.rpc("sync_followers_birthday_occasions", {
          p_profile_id: profile.id,
          p_old_display_name: profile.display_name,
          p_new_display_name: name,
          p_new_birthday: birthday || null
        });
        if(syncError) console.error("Birthday sync failed:", syncError);
      }
      setLang(language);
      if(onLangChange) onLangChange(language);
      const fullUpdates = {...updates, theme:selectedTheme};
      if(onThemeChange && selectedTheme !== (profile.theme||"midnight")) onThemeChange(selectedTheme);
      onSave({...profile, ...fullUpdates});
      onClose();
    } catch(e) { console.error("Save failed:", e); }
    setLoading(false);
  };

  return html`
    <div style=${{position:"fixed",inset:0,background:"#000b",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick=${onClose}>
      <div style=${{background:P.card,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}} onClick=${e=>e.stopPropagation()}>
        <div style=${{fontWeight:800,fontSize:18,color:P.text,marginBottom:20,textAlign:"center"}}>${t("editProfile")}</div>
        
        <div style=${{textAlign:"center",marginBottom:20}}>
          <div style=${{position:"relative",display:"inline-block"}}>
            <${Avatar} emoji=${emoji} avatarUrl=${avatarUrl} size=${80}/>
            <button onClick=${()=>pickPhoto(setAvatarUrl)} style=${{position:"absolute",bottom:0,right:0,width:28,height:28,borderRadius:"50%",background:P.gold,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#0A0A18"}}>${Icon("camera",14,"#0A0A18")}</button>
          </div>
          ${avatarUrl && html`<div><button onClick=${()=>setAvatarUrl("")} style=${{background:"none",border:"none",color:P.muted,fontSize:12,cursor:"pointer",marginTop:6}}>${t("removePhoto")}</button></div>`}
        </div>

        <div style=${{marginBottom:10}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>${t("displayName")}</div>
          <${Inp} value=${name} onChange=${setName} placeholder="Your name"/>
        </div>
        <div style=${{marginBottom:14}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>${t("username")}</div>
          <${Inp} value=${username} onChange=${v=>setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g,""))} placeholder="username"/>
        </div>

        <div style=${{marginBottom:14}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>${t("yourBirthday")}</div>
          <${Inp} value=${birthday} onChange=${setBirthday} type="date"/>
        </div>

        <div style=${{display:"flex",gap:10,marginBottom:14}}>
          <div style=${{flex:1}}>
            <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>${t("city")}</div>
            <${Inp} value=${city} onChange=${setCity} placeholder="e.g. Madrid"/>
          </div>
          <div style=${{flex:1}}>
            <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>${t("country")}</div>
            <${Inp} value=${country} onChange=${setCountry} placeholder="e.g. Spain"/>
          </div>
        </div>

        <div style=${{marginBottom:14}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:8}}>${t("language")}</div>
          <div style=${{display:"flex",flexWrap:"wrap",gap:8}}>
            ${Object.entries(LANGUAGES).map(([code,lang]) => html`
              <button key=${code} onClick=${()=>setLanguage(code)} style=${{background:language===code?`${P.gold}33`:"transparent",border:`1px solid ${language===code?P.gold:P.border}`,borderRadius:99,padding:"6px 12px",fontSize:13,cursor:"pointer",color:language===code?P.goldL:P.muted,fontWeight:language===code?700:400,display:"inline-flex",alignItems:"center",gap:6}}>
                <span style=${{fontSize:16,lineHeight:1}}>${lang.flag}</span> ${lang.name}
              </button>`)}
          </div>
        </div>

        <div style=${{marginBottom:14}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:8}}>🎨 ${t("appTheme")||"APP THEME"}</div>
          <div style=${{display:"flex",flexWrap:"wrap",gap:8}}>
            ${Object.entries(THEMES).map(([key,th]) => html`
              <button key=${key} onClick=${()=>{ setSelectedTheme(key); setThemeKey(key); }} style=${{
                background:selectedTheme===key?`${th.gold}33`:"transparent",
                border:`2px solid ${selectedTheme===key?th.gold:P.border}`,
                borderRadius:12, padding:"8px 12px", cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                transition:"all 0.2s"
              }}>
                <div style=${{display:"flex",gap:3,marginBottom:2}}>
                  <div style=${{width:10,height:10,borderRadius:"50%",background:th.bg,border:"1px solid #fff3"}}/>
                  <div style=${{width:10,height:10,borderRadius:"50%",background:th.gold}}/>
                  <div style=${{width:10,height:10,borderRadius:"50%",background:th.teal}}/>
                </div>
                ${Icon(th.svgIcon, 14, th.gold)}
                <span style=${{fontSize:10,color:selectedTheme===key?th.goldL:P.muted,fontWeight:selectedTheme===key?700:400}}>${th.name}</span>
              </button>`)}
          </div>
        </div>

        <div style=${{marginBottom:14}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:8}}>${t("emojiAvatar")}</div>
          <div style=${{display:"flex",flexWrap:"wrap",gap:8}}>
            ${EMOJIS.map(e => html`<button key=${e} onClick=${()=>setEmoji(e)} style=${{background:emoji===e?`${P.gold}33`:"none",border:`1px solid ${emoji===e?P.gold:"transparent"}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>${Icon(emojiToIcon(e),20,P.text)}</button>`)}
          </div>
        </div>

        <div style=${{marginBottom:20}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:8}}>${t("interests")}</div>
          <div style=${{display:"flex",flexWrap:"wrap",gap:6}}>
            ${INTERESTS.map(i => html`<button key=${i} onClick=${()=>toggleI(i)} style=${{background:interests.includes(i)?`${P.gold}33`:"transparent",border:`1px solid ${interests.includes(i)?P.gold:P.border}`,borderRadius:99,padding:"5px 12px",fontSize:12,color:interests.includes(i)?P.goldL:P.muted,cursor:"pointer",fontWeight:interests.includes(i)?700:400}}>${translateInterest(i)}</button>`)}
          </div>
        </div>

        <div style=${{marginBottom:16,background:P.bg,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style=${{fontWeight:700,color:P.text,fontSize:14,display:"flex",alignItems:"center",gap:6}}>${Icon("lock",14,P.text)} Private profile</div>
            <div style=${{color:P.muted,fontSize:12,marginTop:2}}>People must request to follow you</div>
          </div>
          <div onClick=${()=>setIsPrivate(v=>!v)} style=${{width:44,height:24,borderRadius:99,background:isPrivate?P.gold:P.border,cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
            <div style=${{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:isPrivate?22:2,transition:"left 0.2s",boxShadow:"0 1px 3px #0004"}}></div>
          </div>
        </div>

        <button onClick=${save} disabled=${loading} style=${{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:10}}>
          ${loading?t("loading"):t("save")}
        </button>
        <div style=${{display:"flex",justifyContent:"space-between",gap:8,marginBottom:8}}>
          <button onClick=${()=>openLegalPage("/privacy")} style=${{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:10,padding:"10px 12px",cursor:"pointer",fontSize:12}}>Privacy Policy</button>
          <button onClick=${()=>openLegalPage("/terms")} style=${{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:10,padding:"10px 12px",cursor:"pointer",fontSize:12}}>Terms</button>
        </div>
        <button onClick=${()=>requestAccountDeletion(profile.email || "")} style=${{width:"100%",background:"transparent",border:`1px solid ${P.red}55`,color:P.red,borderRadius:10,padding:"10px 12px",cursor:"pointer",fontSize:12,marginBottom:8}}>Request account deletion</button>
        <button onClick=${onClose} style=${{width:"100%",background:"transparent",border:"none",color:P.muted,padding:"8px 0",cursor:"pointer"}}>${t("cancel")}</button>
      </div>
    </div>`;
}

function Inp({value, onChange, placeholder, type="text", style={}}) {
  return html`<input value=${value} onChange=${e=>onChange(e.target.value)} placeholder=${placeholder} type=${type} style=${{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:10,padding:"12px 14px",color:P.text,fontSize:14,boxSizing:"border-box",outline:"none",...style}}/>`;
}

// ── AUTH ──
function PasswordRecoveryScreen({onDone, onCancel}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  const savePassword = async () => {
    if(password.length < 8) { setErr("Use at least 8 characters."); return; }
    if(password !== confirmPassword) { setErr("Passwords do not match."); return; }
    setLoading(true); setErr("");
    try {
      const {error} = await sb.auth.updateUser({password});
      if(error) throw error;
      clearAuthHash();
      setSuccess(true);
      setTimeout(onDone, 900);
    } catch(e) {
      captureError("password_recovery", e);
      setErr(e.message || "Couldn't update your password.");
    }
    setLoading(false);
  };

  const cancel = async () => {
    clearAuthHash();
    try { await sb.auth.signOut(); } catch(e) {}
    onCancel();
  };

  return html`
    <div style=${{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style=${{width:"100%",maxWidth:380}}>
        <div style=${{textAlign:"center",marginBottom:24}}>
          <div style=${{width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 16px"}}>🔐</div>
          <div style=${{fontFamily:"Georgia,serif",fontSize:30,fontWeight:900,color:P.text}}>Reset your password</div>
          <div style=${{color:P.muted,fontSize:14,marginTop:6}}>Choose a new password to get back into Giftmate.</div>
        </div>
        <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:28}}>
          <${Inp} value=${password} onChange=${setPassword} placeholder="New password" type="password" style=${{marginBottom:12}}/>
          <${Inp} value=${confirmPassword} onChange=${setConfirmPassword} placeholder="Confirm new password" type="password" style=${{marginBottom:12}}/>
          ${success && html`<div style=${{color:P.green,fontSize:13,marginBottom:12,textAlign:"center",background:`${P.green}11`,borderRadius:8,padding:"10px"}}>✓ Password updated. Redirecting you back into the app.</div>`}
          ${err && html`<div style=${{color:P.red,fontSize:13,marginBottom:12,textAlign:"center"}}>${err}</div>`}
          <button onClick=${savePassword} disabled=${loading} style=${{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",border:"none",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:10}}>
            ${loading ? "…" : "Update password"}
          </button>
          <button onClick=${cancel} style=${{width:"100%",background:"transparent",border:"none",color:P.muted,padding:"8px 0",cursor:"pointer"}}>Cancel</button>
        </div>
      </div>
    </div>`;
}

function RecoveryLinkErrorScreen({onBack}) {
  return html`
    <div style=${{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style=${{width:"100%",maxWidth:380}}>
        <div style=${{textAlign:"center",marginBottom:24}}>
          <div style=${{width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${P.red},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 16px"}}>⚠️</div>
          <div style=${{fontFamily:"Georgia,serif",fontSize:30,fontWeight:900,color:P.text}}>Reset link expired</div>
          <div style=${{color:P.muted,fontSize:14,marginTop:6}}>Please request a new password reset email and try again.</div>
        </div>
        <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:28}}>
          <button onClick=${onBack} style=${{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",border:"none",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:10}}>
            Back to login
          </button>
          <button onClick=${()=>openLegalPage("/privacy")} style=${{width:"100%",background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:10,padding:"10px 12px",cursor:"pointer",fontSize:12}}>Privacy Policy</button>
        </div>
      </div>
    </div>`;
}

function AuthScreen({onAuth}) {
  const [mode,setMode] = useState("login");
  const [email,setEmail] = useState(""), [pw,setPw] = useState("");
  const [loading,setLoading] = useState(false), [err,setErr] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const submit = async () => {
    if(!email||!pw) { setErr("Please fill in all fields"); return; }
    setLoading(true); setErr("");
    try {
      const fn = mode==="signup" ? sb.auth.signUp.bind(sb.auth) : sb.auth.signInWithPassword.bind(sb.auth);
      const {data,error} = await fn({email, password:pw});
      if(error) throw error;
      onAuth(data.session, mode==="signup");
    } catch(e) { setErr(e.message||"Something went wrong"); }
    setLoading(false);
  };

  const resetPassword = async () => {
    if(!email) { setErr("Enter your email above first"); return; }
    setLoading(true); setErr("");
    const {error} = await sb.auth.resetPasswordForEmail(email, {redirectTo: `${window.location.origin}/reset-password.html`});
    setLoading(false);
    if(error) { setErr(error.message); return; }
    setResetSent(true);
  };

  return html`
    <div style=${{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style=${{width:"100%",maxWidth:380}}>
        <div style=${{textAlign:"center",marginBottom:36}}>
          <div style=${{width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 16px"}}>🎁</div>
          <div style=${{fontFamily:"Georgia,serif",fontSize:34,fontWeight:900,color:P.text}}>gift<span style=${{color:P.gold}}>mate</span></div>
          <div style=${{color:P.muted,fontSize:14,marginTop:4}}>${t("appTagline")}</div>
        </div>
        <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:28}}>
          <div style=${{display:"flex",marginBottom:22,background:P.bg,borderRadius:10,padding:3}}>
            ${["login","signup"].map(m => html`
              <button key=${m} onClick=${()=>{setMode(m);setErr("");setResetSent(false);}} style=${{flex:1,padding:"9px 0",borderRadius:8,border:"none",background:mode===m?`linear-gradient(135deg,${P.goldD},${P.gold})`:"transparent",color:mode===m?"#000":P.muted,fontWeight:700,fontSize:14,cursor:"pointer"}}>
                ${m==="login"?"Log In":"Sign Up"}
              </button>`)}
          </div>
          <${Inp} value=${email} onChange=${setEmail} placeholder="Email address" type="email" style=${{marginBottom:12}}/>
          <${Inp} value=${pw} onChange=${setPw} placeholder="Password" type="password" style=${{marginBottom:mode==="login"?8:16}}/>
          ${mode==="login" && html`<div style=${{textAlign:"right",marginBottom:14}}>
            <button onClick=${resetPassword} style=${{background:"none",border:"none",color:P.gold,fontSize:12,cursor:"pointer",padding:0}}>Forgot password?</button>
          </div>`}
          ${resetSent && html`<div style=${{color:P.green,fontSize:13,marginBottom:12,textAlign:"center",background:`${P.green}11`,borderRadius:8,padding:"10px"}}>✓ Reset link sent! Check your email.</div>`}
          ${err && html`<div style=${{color:P.red,fontSize:13,marginBottom:12,textAlign:"center"}}>${err}</div>`}
          <button onClick=${submit} disabled=${loading} style=${{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",border:"none",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:800,cursor:"pointer"}}>
            ${loading?"…":mode==="login"?"Log In":"Create Account"}
          </button>
          <div style=${{textAlign:"center",color:P.muted,fontSize:12,marginTop:14,lineHeight:1.6}}>
            By continuing, you agree to our
            <button onClick=${()=>openLegalPage("/terms")} style=${{background:"none",border:"none",color:P.gold,cursor:"pointer",padding:"0 4px"}}>Terms</button>
            and
            <button onClick=${()=>openLegalPage("/privacy")} style=${{background:"none",border:"none",color:P.gold,cursor:"pointer",padding:"0 4px"}}>Privacy Policy</button>.
          </div>
        </div>
        <div style=${{textAlign:"center",color:P.muted,fontSize:12,marginTop:20}}>Google & Apple login coming soon ✨</div>
      </div>
    </div>`;
}

// ── ONBOARDING ──
function Onboarding({userId, onComplete}) {
  const [step,setStep] = useState(0);
  const [username,setUsername] = useState(""), [name,setName] = useState("");
  const [emoji,setEmoji] = useState("🎁"), [birthday,setBirthday] = useState("");
  const [interests,setInterests] = useState([]);
  const [loading,setLoading] = useState(false), [err,setErr] = useState("");

  const toggleI = i => setInterests(p => p.includes(i) ? p.filter(x=>x!==i) : [...p,i]);

  const finish = async () => {
    if(!username.trim()) { setErr("Username is required"); return; }
    setLoading(true);
    const {error} = await sb.from("profiles").insert({
      id:userId, username:username.toLowerCase().replace(/[^a-z0-9_]/g,""),
      display_name:name||username, emoji, birthday, interests, stars:55
    });
    if(error) { setErr(error.message); setLoading(false); return; }
    onComplete();
  };

  const steps = [
    html`<div key="s0">
      <div style=${{fontSize:26,textAlign:"center",marginBottom:6,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>${Icon("heart",28,P.gold)} Welcome!</div>
      <div style=${{color:P.muted,textAlign:"center",marginBottom:22,fontSize:14}}>Let's set up your profile</div>
      <div style=${{marginBottom:12}}>
        <div style=${{fontSize:11,color:P.muted,marginBottom:5,fontWeight:700}}>USERNAME</div>
        <${Inp} value=${username} onChange=${v=>setUsername(v.toLowerCase().replace(/[^a-z0-9_]/g,""))} placeholder="e.g. jimena_gifts"/>
        <div style=${{fontSize:11,color:P.muted,marginTop:4}}>Letters, numbers and _ only</div>
      </div>
      <div style=${{marginTop:12}}>
        <div style=${{fontSize:11,color:P.muted,marginBottom:5,fontWeight:700}}>DISPLAY NAME</div>
        <${Inp} value=${name} onChange=${setName} placeholder="Your name"/>
      </div>
    </div>`,
    html`<div key="s1">
      <div style=${{fontSize:26,textAlign:"center",marginBottom:6}}>Pick your emoji</div>
      <div style=${{color:P.muted,textAlign:"center",marginBottom:18,fontSize:14}}>This will be your avatar</div>
      <div style=${{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:14}}>
        ${EMOJIS.map(e => html`<button key=${e} onClick=${()=>setEmoji(e)} style=${{padding:"10px 0",borderRadius:12,border:`2px solid ${emoji===e?P.gold:"transparent"}`,background:emoji===e?P.gold+"22":P.bg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>${Icon(emojiToIcon(e),24,P.text)}</button>`)}
      </div>
      <div style=${{textAlign:"center",display:"flex",justifyContent:"center",alignItems:"center"}}>${Icon(emojiToIcon(emoji),48,P.gold)}</div>
    </div>`,
    html`<div key="s2">
      <div style=${{fontSize:26,textAlign:"center",marginBottom:6,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>${Icon("calendar",28,P.gold)} Your birthday</div>
      <div style=${{color:P.muted,textAlign:"center",marginBottom:20,fontSize:14}}>${t("friendsGiftHint")}</div>
      <${Inp} value=${birthday} onChange=${setBirthday} type="date" style=${{textAlign:"center",fontSize:16}}/>
      <div style=${{color:P.muted,fontSize:12,textAlign:"center",marginTop:10}}>You can skip this and add it later</div>
    </div>`,
    html`<div key="s3">
      <div style=${{fontSize:26,textAlign:"center",marginBottom:6}}>What do you love? 💛</div>
      <div style=${{color:P.muted,textAlign:"center",marginBottom:18,fontSize:14}}>Pick your interests</div>
      <div style=${{display:"flex",flexWrap:"wrap",gap:8}}>
        ${INTERESTS.map(i => html`<button key=${i} onClick=${()=>toggleI(i)} style=${{padding:"8px 14px",borderRadius:99,border:`1px solid ${interests.includes(i)?P.gold:P.border}`,background:interests.includes(i)?P.gold+"22":P.bg,color:interests.includes(i)?P.goldL:P.muted,fontSize:13,fontWeight:600,cursor:"pointer"}}>${translateInterest(i)}</button>`)}
      </div>
    </div>`,
    html`<div key="s4">
      <div style=${{fontSize:26,textAlign:"center",marginBottom:6}}>Stay in the loop 🔔</div>
      <div style=${{color:P.muted,textAlign:"center",marginBottom:22,fontSize:13,lineHeight:1.5}}>Allow Giftmate to send you notifications for gift messages, upcoming birthdays and group activity.</div>
      <div style=${{background:P.bg,borderRadius:14,padding:16,marginBottom:12}}>
        <div style=${{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <span style=${{display:"flex",alignItems:"center"}}>${Icon("gift",24,P.gold)}</span>
          <div><div style=${{fontWeight:700,color:P.text,fontSize:14}}>Gift messages</div><div style=${{color:P.muted,fontSize:12}}>Know when someone sends you a gift</div></div>
        </div>
        <div style=${{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <span style=${{display:"flex",alignItems:"center"}}>${Icon("calendar",24,P.gold)}</span>
          <div><div style=${{fontWeight:700,color:P.text,fontSize:14}}>Birthday reminders</div><div style=${{color:P.muted,fontSize:12}}>Never miss a friend's birthday</div></div>
        </div>
        <div style=${{display:"flex",alignItems:"center",gap:12}}>
          <span style=${{display:"flex",alignItems:"center"}}>${Icon("groups",24,P.gold)}</span>
          <div><div style=${{fontWeight:700,color:P.text,fontSize:14}}>Group activity</div><div style=${{color:P.muted,fontSize:12}}>Messages and gift proposals</div></div>
        </div>
      </div>
      <button onClick=${async()=>{ if("Notification" in window) await Notification.requestPermission(); }} style=${{width:"100%",background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:12,padding:"12px 0",fontWeight:700,fontSize:14,cursor:"pointer",marginBottom:8}}>🔔 Enable Notifications</button>
      <div style=${{color:P.muted,fontSize:11,textAlign:"center"}}>You can change this anytime in your phone settings</div>
    </div>`
  ];

  return html`
    <div style=${{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style=${{width:"100%",maxWidth:400}}>
        <div style=${{textAlign:"center",marginBottom:24}}>
          <div style=${{fontFamily:"Georgia,serif",fontSize:24,fontWeight:900,color:P.text}}>gift<span style=${{color:P.gold}}>mate</span></div>
          <div style=${{display:"flex",justifyContent:"center",gap:6,marginTop:12}}>
            ${steps.map((_,i) => html`<div key=${i} style=${{width:i===step?24:8,height:8,borderRadius:99,background:i<=step?P.gold:P.border,transition:"all 0.3s"}}/>`)}
          </div>
        </div>
        <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:28}}>
          ${steps[step]}
          ${err && html`<div style=${{color:P.red,fontSize:13,marginTop:10,textAlign:"center"}}>${err}</div>`}
          <div style=${{display:"flex",gap:10,marginTop:22}}>
            ${step>0 && html`<button onClick=${()=>setStep(s=>s-1)} style=${{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:12,padding:"12px 0",fontWeight:700,cursor:"pointer"}}>Back</button>`}
            <button onClick=${step<steps.length-1?()=>setStep(s=>s+1):finish} disabled=${loading} style=${{flex:2,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",border:"none",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:800,cursor:"pointer"}}>
              ${loading?"…":step<steps.length-1?"Continue →":"Start Gifting! 🎁"}
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

// ── FRIEND PROFILE ──
// ── SHARED SMART BUY BUTTON ──
function SmartBuyButton({name, city="Madrid"}) {
  const VENUES = {
    "kapital":"https://www.grupo-kapital.com","fabrik":"https://www.fabricaclub.es","fabrika":"https://www.fabricaclub.es",
    "sala el sol":"https://www.salaelsol.com","el sol":"https://www.salaelsol.com","teatro colon":"https://www.teatrocolonmadrid.com",
    "joy eslava":"https://www.joy-eslava.com","joy":"https://www.joy-eslava.com","charada":"https://www.charadamadrid.com",
    "opium":"https://www.opium.es","bash":"https://www.bashclub.es","salmon guru":"https://www.salmonguru.es",
    "1862 dry bar":"https://www.1862drybar.com","1862":"https://www.1862drybar.com","museo chicote":"https://www.museochicote.com",
    "chicote":"https://www.museochicote.com","the hat":"https://www.thehatmadrid.com",
  };
  const lower = (name||"").toLowerCase();
  // Known landmarks, monuments, trains, day trips — always an experience
  const LANDMARKS = /\b(palace|palacio|castillo|castle|cathedral|catedral|monastery|monasterio|museum|museo|alhambra|sagrada familia|prado|reina sofia|thyssen|retiro|escorial|aranjuez|toledo|segovia|cordoba|granada|seville|sevilla|bilbao|guggenheim|gaudi|park guell|camino|flamenco|bullfight|corrida|strawberry train|tren de la fresa|teleférico|teleferico|cable car|funicular|aquarium|acuario|zoo|planetarium|botanical garden|jardin botanico|royal palace|palacio real|eiffel|louvre|versailles|colosseum|coliseo|pantheon|panthéon|rijksmuseum|neuschwanstein|oktoberfest|sagrada|montjuic|tibidabo|montserrat|ramblas)\b/i;

  const isDayTrip = /\b(day trip|day out|visit to|trip to|excursion|guided tour|walking tour|train to|train ride|steam train|vintage train|route|itinerary|excursión|visita|ruta|tour guiado|viaje a|visite|randonnée|journée|ausflug|tagesausflug|führung|gita|visita guidata|passeio|roteiro)\b/i.test(name);

  // Physical products — these go to Amazon even if name sounds adventurous
  const isPhysical = !LANDMARKS.test(name) && /\b(kit|set|book|libro|libro|journal|bag|bolsa|box|caja|bottle|botella|device|gadget|tool|equipment|card|basket|cesta|hamper|map|mapa|print|poster|canvas|frame|photo|album|personaliz|customiz|engraved|grabado|personalizado|bracelet|pulsera|necklace|collar|watch|reloj|wallet|cartera|perfume|scent|candle|vela|seeds?|semillas|livre|sac|bougie|personnalisé|gravé|buch|tasche|kerze|personalisiert|graviert|libro|borsa|candela|personalizzato|livro|bolsa|vela|personalizado)\b/i.test(name);

  const isExpFirst = LANDMARKS.test(name) || isDayTrip || /\b(hot springs|thermal bath|spa day|wellness|masterclass|cooking class|wine tasting|cocktail class|tour|tasting|escape room|safari|paragliding|skydiving|bungee|rafting|kayaking|kayak|surfing|skiing|snowboarding|hot air balloon|zip line|snorkeling|scuba|diving|sailing|cruise|boat trip|horse riding|archery|paintball|quad|buggy|segway|jet ski|wakeboard|kitesurfing|windsurfing|paddle|paddleboard|canyoning|via ferrata|abseiling|climbing|bouldering|hiking|trekking|cycling|biking|mountain bike|e-bike|sunset|sunrise|picnic|yoga|meditation|pottery|ceramics|salsa|tango|aerial|trapeze|axe throwing|falconry|foraging|truffle|olive oil|cheese tasting|beer tasting|brewery|distillery|gin tasting|whisky|rum tasting|chocolate|pastry class|sushi class|paella class|cocktail|mixology|floral|photography|art class|paint|drawing|drama|improv|comedy|laser tag|bowling|karting|go-kart|mini golf|trampoline|climbing wall|virtual reality|ghost tour|street art|food tour|dinner with a view|rooftop dinner|sunset dinner|romantic dinner|tasting menu|chef table|wine dinner|degustation|bike tour|helicopter|balloon flight|skydive|tandem|gliding|paraglide|microlight|adventure day|activity day|activity|adventure|flight|voucher|show|concert|ticket|session|ride|exhibit|workshop|lesson|class|demonstration|discovery|retreat|immersion|cena con vistas|cena especial|cena romántica|cena en|comida con vistas|restaurante especial|maridaje|menú degustación|menú gastronómico|experiencia gastronómica|cata|globo aerostático|vuelo en globo|piragüismo|senderismo|escalada|parapente|ala delta|submarinismo|buceo|surf|windsurf|kitesurf|vela|navegación|barranquismo|tirolina|paseo a caballo|equitación|arquería|tiro con arco|meditación|cerámica|alfarería|clase de cocina|cata de vinos|cata de aceite|cata de cerveza|taller|experiencia|excursión|ruta|aventura|degustación|maridaje|baile|danza|fotografía|pintura|dibujo|teatro|espeleología|cicloturismo|bicicleta|dîner romantique|dîner avec vue|déjeuner gastronomique|repas gastronomique|montgolfière|parachute|canoë|escalade|randonnée|vélo|plongée|voile|croisière|balade|promenade|atelier|cours de cuisine|cours de pâtisserie|pâtisserie|boulangerie|dégustation|oenologie|expérience|vol|spectacle|billet|séance|activité|découverte|romantisches dinner|dinner mit aussicht|gastronomisches erlebnis|heißluftballon|ballonfahrt|kanufahren|kajak|wandern|mountainbike|segeln|tauchen|paragliding|fallschirmspringen|gleitschirmfliegen|pferdereiten|bogenschießen|weinprobe|kochkurs|töpfern|malen|zeichnen|konzert|führung|erlebnis|abenteuer|eintrittskarte|cena romantica|cena con vista|degustazione menù|esperienza gastronomica|mongolfiera|volo in mongolfiera|canoa|arrampicata|escursione|immersione|parapendio|paracadutismo|tiro con l'arco|degustazione|corso di cucina|ceramica|pittura|concerto|biglietto|esperienza|avventura|laboratorio|jantar romântico|jantar com vista|menu degustação|experiência gastronômica|balão|voo de balão|caiaque|escalada|caminhada|mergulho|paraquedas|arco|degustação|aula de culinária|cerâmica|ingresso|experiência|oficina)\b/i.test(name);

  const isHotel = !isExpFirst && (
    /\b(hotel|stay|getaway|retreat|weekend away|weekend in|city weekend|city break|glamping|glampeo|glamping|resort|villa|cabin|cottage|airbnb|overnight|bed and breakfast|b&b|escapada|fin de semana|alojamiento|hospedaje|estancia|posada|parador|apartamento|casita|noche en|nuits?|séjour|hébergement|gîte|chambre d'hôtes|maison d'hôtes|château|auberge|wochenende|unterkunft|ferienwohnung|ferienhaus|hotel|übernachtung|pension|soggiorno|agriturismo|b&b|albergo|fuga romantica|fine settimana|estadia|pousada|apartamento|fim de semana)\b/i.test(name) ||
    /\bweekend\b/i.test(name) && !/\b(class|masterclass|workshop|lesson|tasting|course|night out|bar|club|clase|taller|cata|curso)\b/i.test(name)
  );

  const isNight = !isPhysical && !isHotel && !isExpFirst && /\b(club|nightclub|bar entry|bar crawl|party|hen|stag|vip table|vip entry|disco|rave|gig|live music|karaoke|night out|bottomless brunch|fabrik|kapital|joy eslava|noche de|salir de fiesta|discoteca|boliche|after|noche vip|soirée|boîte de nuit|fête|sortie|clubbing|nachtclub|ausgehen|party|disco|notte in|serata|festa|balada|noite de|festa)\b/i.test(name) && !/\b(class|masterclass|workshop|lesson|tasting|course|clase|taller|cata|curso|cours|atelier|kurs|corso|lezione|aula)\b/i.test(name);

  const isExp = !isPhysical && !isHotel && (isExpFirst || /\b(class|workshop|lesson|experience|ride|cruise|show|concert|ticket|session|hiking|climbing|sailing|diving|flight|voucher|adventure|walk|trekking|picnic|sunrise|sunset)\b/i.test(name));

  // ── Smart query extractors ──
  const bookingQuery = n => {
    return n
      .replace(/\b(golden|luxury|romantic|perfect|amazing|ultimate|special|exclusive|beautiful|stunning|charming|romántico|perfecto|increíble|especial|exclusivo|lujoso|romantique|parfait|incroyable|spécial|exclusif|romantisch|perfekt|wunderbar|besonders|exklusiv|romantico|perfetto|incredibile|speciale|lussuoso|romântico|perfeito|incrível|especial|exclusivo)\b/gi, "")
      .replace(/\b(weekend getaway|city weekend|city break|weekend in|weekend away|stay in|stay at|getaway to|escapada de fin de semana|fin de semana en|estancia en|séjour à|week-end à|wochenende in|kurzurlaub|soggiorno a|fuga a|fim de semana em|estadia em)\b/gi, "")
      .replace(/\b(a |the |an |un |una |el |la |los |las |le |la |les |un |une |der |die |das |ein |eine |il |lo |la |i |gli |le |un |uma |o |a )\b/gi, "")
      .replace(/\s+/g, " ").trim();
  };

  const gygQuery = n => {
    const cleaned = n
      .replace(/\b(entry|access|ticket|voucher|gift|experience|session|day|entrada|acceso|bono|regalo|experiencia|sesión|día|día de|entrée|accès|billet|cadeau|expérience|séance|journée|eintritt|zugang|gutschein|geschenk|erlebnis|sitzung|tag|biglietto|accesso|buono|regalo|esperienza|sessione|ingresso|bilhete|acesso|voucher|presente|experiência|sessão)\b/gi, "")
      .replace(/\b(golden|luxury|romantic|perfect|amazing|ultimate|special|exclusive|romántico|perfecto|lujoso|romantique|parfait|romantisch|romantico|romântico)\b/gi, "")
      .replace(/\b(a |the |an |un |una |el |la |le |les |der |die |das |ein |il |lo |o |a )\b/gi, "")
      .replace(/\s+/g, " ").trim();
    return cleaned.toLowerCase().includes(city.toLowerCase()) ? cleaned : cleaned + " " + city;
  };

  let url, label;
  if(isNight) {
    let found = null;
    for(const [k,v] of Object.entries(VENUES)) { if(lower.includes(k)) { found=v; break; } }
    url = found || `https://www.google.com/search?q=${encodeURIComponent(name+" "+city)}`;
    label = t("nightlifeBtn");
  } else if(isHotel) {
    url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(bookingQuery(name))}&aid=7891172&sb_travel_purpose=leisure`;
    label = t("hotelBtn");
  } else if(isExp) {
    url = `https://www.getyourguide.com/s/?q=${encodeURIComponent(gygQuery(name))}&partner_id=YHVA20C`;
    label = t("bookBtn");
  } else {
    url = `https://www.amazon.com/s?k=${encodeURIComponent(name)}&tag=giftmate0e-21`;
    label = t("buyBtn");
  }
  const category = isNight?"nightlife":isHotel?"hotel":isExp?"experience":"product";
  const handleClick = () => {
    track("gift_click", {gift_name: name, category, platform: isNight?"google":isHotel?"booking":isExp?"getyourguide":"amazon", city});
    window.open(url, "_blank");
  };
  return html`<button onClick=${handleClick} style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>${label}</button>`;
}

// ── CALENDAR VIEW ──
function CalendarView({occasions, friendsOccasions, onExport}) {
  const [month, setMonth] = useState(new Date());
  const year = month.getFullYear(), mon = month.getMonth();
  const firstDay = new Date(year, mon, 1).getDay();
  const daysInMonth = new Date(year, mon+1, 0).getDate();
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const allOcc = [
    ...(occasions||[]).map(o=>({...o,mine:true})),
    ...(friendsOccasions||[]).map(o=>({...o,mine:false}))
  ];
  const getOccForDay = d => {
    const dateStr = `${year}-${String(mon+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return allOcc.filter(o => { try { const od=new Date(o.date); return od.getMonth()===mon && od.getFullYear()===year && od.getDate()===d; } catch(e){return false;} });
  };
  const exportICS = () => {
    const lines = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Giftmate//EN"];
    allOcc.forEach(o => {
      if(!o.date) return;
      const d = o.date.replace(/-/g,"");
      lines.push("BEGIN:VEVENT",`DTSTART;VALUE=DATE:${d}`,`SUMMARY:🎁 ${o.type}${o.display_name?" - "+o.display_name:""}`,`DESCRIPTION:${o.mine?"Your occasion":"Friend's occasion"}`,`UID:${o.id}@giftmate`,"END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")],{type:"text/calendar"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="giftmate-occasions.ics"; a.click();
  };
  const today = new Date(); today.setHours(0,0,0,0);
  return html`<div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:16,marginBottom:14}}>
    <div style=${{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
      <button onClick=${()=>setMonth(new Date(year,mon-1,1))} style=${{background:"none",border:"none",color:P.gold,fontSize:20,cursor:"pointer",padding:"0 8px"}}>‹</button>
      <div style=${{fontWeight:700,fontSize:15,color:P.text}}>${MONTHS[mon]} ${year}</div>
      <button onClick=${()=>setMonth(new Date(year,mon+1,1))} style=${{background:"none",border:"none",color:P.gold,fontSize:20,cursor:"pointer",padding:"0 8px"}}>›</button>
    </div>
    <div style=${{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:6}}>
      ${(t("calDays")||["Su","Mo","Tu","We","Th","Fr","Sa"]).map(d => html`<div key=${d} style=${{textAlign:"center",fontSize:10,color:P.muted,fontWeight:700,padding:"4px 0"}}>${d}</div>`)}
    </div>
    <div style=${{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
      ${Array.from({length:firstDay===0?6:firstDay-1}).map((_,i) => html`<div key=${"e"+i}/>`)}
      ${Array.from({length:daysInMonth},(_,i)=>i+1).map(d => {
        const occs = getOccForDay(d);
        const isToday = today.getDate()===d && today.getMonth()===mon && today.getFullYear()===year;
        const hasMine = occs.some(o=>o.mine);
        const hasFriends = occs.some(o=>!o.mine);
        const firstColor = occs[0]?.color || (hasMine?P.gold:P.teal);
        const cellBg = isToday?`${P.gold}33`:occs.length>0?`${firstColor}22`:"transparent";
        const cellBorder = isToday?`1px solid ${P.gold}`:occs.length>0?`1px solid ${firstColor}55`:"1px solid transparent";
        return html`<div key=${d} style=${{minHeight:44,borderRadius:8,background:cellBg,border:cellBorder,padding:"3px 2px",display:"flex",flexDirection:"column",alignItems:"center",cursor:occs.length>0?"pointer":"default"}}>
          <span style=${{fontSize:11,color:isToday?P.gold:P.text,fontWeight:isToday?700:400}}>${d}</span>
          ${occs.slice(0,2).map(o => html`<div key=${o.id} style=${{width:"100%",marginTop:1,borderRadius:3,background:o.color||(o.mine?P.gold:P.teal),padding:"1px 2px",overflow:"hidden"}}>
            <div style=${{fontSize:7,fontWeight:700,color:"#000",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",lineHeight:"10px"}}>${translateOccasion(o.type)}</div>
          </div>`)}
        </div>`;
      })}
    </div>
    <div style=${{display:"flex",gap:10,marginTop:12,fontSize:11,color:P.muted,justifyContent:"space-between",alignItems:"center"}}>
      <div style=${{display:"flex",gap:10}}>
        <span><span style=${{color:P.gold}}>●</span> ${t("yours")}</span>
        <span><span style=${{color:P.teal}}>●</span> ${t("friends")}</span>
      </div>
      <button onClick=${exportICS} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>${t("exportToPhone")}</button>
    </div>
  </div>`;
}

// ── SEND GIFT MESSAGE ──
function SendGiftModal({friend, myProfile, onClose, toast}) {
  const [giftName, setGiftName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if(!giftName.trim()) { toast("Please enter a gift name!"); return; }
    setLoading(true);
    const {error} = await sb.from("gift_messages").insert({
      sender_id: myProfile.id,
      receiver_id: friend.id,
      gift_name: giftName,
      occasion: occasion || null,
      note: note || null,
      status: "pending"
    });
    if(error) { toast("Something went wrong 😞"); setLoading(false); return; }
    toast(`🎁 Gift message sent to ${friend.display_name}!`);
    onClose();
  };

  return html`
    <div style=${{position:"fixed",inset:0,background:"#000a",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick=${onClose}>
      <div style=${{background:P.card,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:480}} onClick=${e=>e.stopPropagation()}>
        <div style=${{textAlign:"center",marginBottom:20}}>
          <div style=${{display:"flex",justifyContent:"center",marginBottom:8}}>${Icon("gift",36,P.gold)}</div>
          <div style=${{fontWeight:800,fontSize:18,color:P.text}}>${t("sendGiftTitle").replace("{name}", friend.display_name)}</div>
          <div style=${{color:P.muted,fontSize:13,marginTop:4}}>They'll get a notification and can say thank you</div>
        </div>
        <div style=${{marginBottom:10}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>WHAT DID YOU GIFT?</div>
          <${Inp} value=${giftName} onChange=${setGiftName} placeholder="e.g. Flamenco Dance Class"/>
        </div>
        <div style=${{marginBottom:10}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>OCCASION</div>
          <${Inp} value=${occasion} onChange=${setOccasion} placeholder="e.g. Birthday, Christmas…"/>
        </div>
        <div style=${{marginBottom:18}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>PERSONAL NOTE (OPTIONAL)</div>
          <textarea value=${note} onInput=${e=>setNote(e.target.value)} placeholder="Add a sweet message…" rows="2" style=${{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:10,padding:"12px 14px",color:P.text,fontSize:14,resize:"none",outline:"none",boxSizing:"border-box"}}/>
        </div>
        <button onClick=${send} disabled=${loading} style=${{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:10}}>
          ${loading?t("sending"):t("sendGiftMsg")}
        </button>
        <button onClick=${onClose} style=${{width:"100%",background:"transparent",border:"none",color:P.muted,padding:"8px 0",cursor:"pointer"}}>Cancel</button>
      </div>
    </div>`;
}

// ── GIFT INBOX ──
function GiftInbox({profile, toast}) {
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("received");

  useEffect(() => {
    const load = async () => {
      const [recv, snt] = await Promise.all([
        sb.from("gift_messages").select("*, sender:sender_id(display_name,emoji,username)").eq("receiver_id",profile.id).order("created_at",{ascending:false}),
        sb.from("gift_messages").select("*, receiver:receiver_id(display_name,emoji,username)").eq("sender_id",profile.id).order("created_at",{ascending:false})
      ]);
      setInbox(recv.data||[]); setSent(snt.data||[]); setLoading(false);
    };
    load();
  }, []);

  const thankYou = async msg => {
    await sb.from("gift_messages").update({status:"thanked"}).eq("id",msg.id);
    await sb.from("gifts_received").insert({user_id:profile.id,gift_name:msg.gift_name,from_whom:msg.sender?.display_name,occasion:msg.occasion||"",reaction:"❤️",is_public:true});
    setInbox(p => p.map(m => m.id===msg.id?{...m,status:"thanked"}:m));
    toast("❤️ Thank you sent! Gift saved to your profile!");
  };

  if(loading) return html`<div style=${{color:P.muted,textAlign:"center",padding:20}}>Loading…</div>`;
  const pendingCount = inbox.filter(m=>m.status==="pending").length;

  const MsgCard = ({m, isSent}) => html`
    <div style=${{background:P.card,border:`1px solid ${m.status==="thanked"?(isSent?P.green:P.border):P.gold+"66"}`,borderRadius:14,padding:16,marginBottom:10}}>
      <div style=${{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
        <div style=${{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center"}}>${Icon("gift",16,"#0A0A18")}</div>
        <div style=${{flex:1}}>
          <div style=${{fontWeight:700,color:P.text,fontSize:14}}>${isSent?`You gifted ${m.receiver?.display_name}!`:`${m.sender?.display_name} gifted you!`}</div>
          <div style=${{color:P.muted,fontSize:12}}>${new Date(m.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</div>
        </div>
        ${m.status==="pending" && html`<div style=${{color:isSent?P.muted:P.gold,fontSize:isSent?11:8,fontWeight:700}}>${isSent?t("pending"):html`<div style=${{width:8,height:8,borderRadius:"50%",background:P.gold}}/>`}</div>`}
        ${m.status==="thanked" && html`<div style=${{color:isSent?P.green:P.green,fontSize:12,fontWeight:700}}>${isSent?t("thanked"):t("thanked")}</div>`}
      </div>
      <div style=${{background:P.bg,borderRadius:10,padding:"10px 12px",marginBottom:isSent||m.status==="thanked"?0:10}}>
        <div style=${{fontWeight:700,color:P.text,fontSize:14,display:"flex",alignItems:"center",gap:6}}>${Icon("gift",16,P.gold)} ${m.gift_name}</div>
        ${m.occasion&&html`<div style=${{color:P.muted,fontSize:12,marginTop:2}}>For: ${m.occasion}</div>`}
        ${m.note&&html`<div style=${{color:P.goldL,fontSize:13,marginTop:6,fontStyle:"italic"}}>"${m.note}"</div>`}
      </div>
      ${!isSent && m.status==="pending" && html`<button onClick=${()=>thankYou(m)} style=${{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:10,padding:"10px 0",fontSize:13,fontWeight:700,cursor:"pointer",marginTop:10}}>${t("sayThankyou")}</button>`}
    </div>`;

  return html`<div>
    <div style=${{display:"flex",background:P.bg,borderRadius:10,padding:3,marginBottom:14,gap:2}}>
      <button onClick=${()=>setTab("received")} style=${{flex:1,padding:"8px 4px",borderRadius:8,border:"none",background:tab==="received"?`linear-gradient(135deg,${P.goldD},${P.gold})`:"transparent",color:tab==="received"?"#000":P.muted,fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
        ${Icon("gift",12,tab==="received"?"#000":P.muted)} ${stripEmoji(t("received"))} ${pendingCount>0?html`<span style=${{background:P.red,color:"#fff",borderRadius:99,padding:"1px 5px",fontSize:10,marginLeft:3}}>${pendingCount}</span>`:""}
      </button>
      <button onClick=${()=>setTab("sent")} style=${{flex:1,padding:"8px 4px",borderRadius:8,border:"none",background:tab==="sent"?`linear-gradient(135deg,${P.goldD},${P.gold})`:"transparent",color:tab==="sent"?"#000":P.muted,fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>${Icon("share",12,tab==="sent"?"#000":P.muted)} ${stripEmoji(t("sent"))}</button>
    </div>
    ${tab==="received" && html`<div>
      ${inbox.length===0&&html`<div style=${{color:P.muted,textAlign:"center",padding:24,fontSize:14}}>${t("noMessages")}</div>`}
      ${inbox.map(m=>html`<${MsgCard} key=${m.id} m=${m} isSent=${false}/>`)}
    </div>`}
    ${tab==="sent" && html`<div>
      ${sent.length===0&&html`<div style=${{color:P.muted,textAlign:"center",padding:24,fontSize:14}}>${t("noSentMessages")}</div>`}
      ${sent.map(m=>html`<${MsgCard} key=${m.id} m=${m} isSent=${true}/>`)}
    </div>`}
  </div>`;
}

// ── FOLLOW LIST MODAL ──
function FollowListModal({userId, mode, onClose, onViewProfile, myProfile, following, onToggleFollow}) {
  // mode: "followers" | "following"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOwnList = userId === myProfile.id;

  useEffect(() => {
    (async () => {
      setLoading(true);
      let ids = [];
      if(mode === "followers") {
        const {data} = await sb.from("follows").select("follower_id").eq("following_id", userId);
        ids = (data||[]).map(r => r.follower_id);
      } else {
        const {data} = await sb.from("follows").select("following_id").eq("follower_id", userId);
        ids = (data||[]).map(r => r.following_id);
      }
      if(!ids.length) { setUsers([]); setLoading(false); return; }
      const {data} = await sb.from("profiles").select("id,display_name,username,emoji,avatar_url,stars").in("id", ids);
      setUsers(data||[]);
      setLoading(false);
    })();
  }, [userId, mode]);

  const getBtn = u => {
    if(isOwnList && mode === "followers") {
      // My followers list — can remove them as a follower
      return html`<button onClick=${()=>{ sb.from("follows").delete().eq("follower_id",u.id).eq("following_id",myProfile.id).then(()=>setUsers(p=>p.filter(x=>x.id!==u.id))); }} style=${{background:P.red+"22",border:`1px solid ${P.red}44`,color:P.red,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>Remove</button>`;
    }
    if(isOwnList && mode === "following") {
      // My following list — can unfollow
      return html`<button onClick=${()=>{ onToggleFollow(u.id); setUsers(p=>p.filter(x=>x.id!==u.id)); }} style=${{background:P.border,border:"none",color:P.muted,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>${t("unfollow")||"Unfollow"}</button>`;
    }
    // Someone else's list — show follow/following
    return html`<button onClick=${()=>onToggleFollow(u.id)} style=${{background:following.includes(u.id)?P.border:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:following.includes(u.id)?P.muted:"#000",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>${following.includes(u.id)?t("following"):pendingRequests.includes(u.id)?"Requested ⏳":t("follow")}</button>`;
  };

  return html`
    <div onClick=${onClose} style=${{position:"fixed",inset:0,background:"#000b",zIndex:3000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick=${e=>e.stopPropagation()} style=${{background:P.card,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:480,maxHeight:"70vh",display:"flex",flexDirection:"column"}}>
        <div style=${{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style=${{fontWeight:800,fontSize:17,color:P.text}}>${mode==="followers"?t("followers"):t("followingCount")}</div>
          <button onClick=${onClose} style=${{background:"none",border:"none",color:P.muted,cursor:"pointer",display:"flex",alignItems:"center"}}>${Icon("close",20,P.muted)}</button>
        </div>
        <div style=${{overflowY:"auto",flex:1}}>
          ${loading ? html`<div style=${{textAlign:"center",padding:30,color:P.muted}}>...</div>` :
            users.length === 0 ? html`<div style=${{textAlign:"center",padding:30,color:P.muted,fontSize:14}}>${mode==="followers"?t("noFollowers"):t("noFollowing")}</div>` :
            users.map(u => html`
              <div key=${u.id} style=${{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${P.border}`}}>
                <${Avatar} emoji=${u.emoji} avatarUrl=${u.avatar_url} size=${44}/>
                <div style=${{flex:1}}>
                  <div style=${{fontWeight:700,color:P.text,fontSize:14}}>${u.display_name}</div>
                  <div style=${{color:P.muted,fontSize:12}}>@${u.username}</div>
                </div>
                ${u.id !== myProfile.id && html`<div style=${{display:"flex",gap:6}}>
                  <button onClick=${()=>{ onClose(); onViewProfile(u); }} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>${t("viewProfile")}</button>
                  ${getBtn(u)}
                </div>`}
              </div>`)}
        </div>
      </div>
    </div>`;
}

function FriendProfile({friend, myProfile, following, pendingRequests=[], onToggleFollow, onBack}) {
  const [occasions,setOccasions] = useState([]);
  const [wishlist,setWishlist] = useState([]);
  const [giftsReceived,setGiftsReceived] = useState([]);
  const [section,setSection] = useState("occasions");
  const [giftIdeas,setGiftIdeas] = useState([]);
  const [giftLoading,setGiftLoading] = useState(false);
  const [toast,setToast] = useState(null);

  useEffect(() => {
    Promise.all([
      sb.from("occasions").select("*").eq("user_id",friend.id).eq("is_public",true).order("date"),
      sb.from("wishlist_items").select("*").eq("user_id",friend.id).order("created_at",{ascending:false}),
      sb.from("gifts_received").select("*").eq("user_id",friend.id).eq("is_public",true)
    ]).then(([o,w,g]) => { setOccasions(o.data||[]); setWishlist(w.data||[]); setGiftsReceived(g.data||[]); });
  }, [friend.id]);

  const getGiftIdeas = async occ => {
    setGiftIdeas([]); setGiftLoading(true);
    const city = myProfile?.city||"Madrid";
    try {
      const data = await callChatApi({model:MODEL,max_tokens:700,messages:[{role:"user",content:`Generate 5 personalised gift ideas for ${friend.display_name} for their ${occ.type} in ${city}. Interests: ${(friend.interests||[]).join(", ")||"unknown"}. Past gifts: ${giftsReceived.map(g=>g.gift_name).join(", ")||"none"}. Wishlist: ${wishlist.map(w=>w.name).join(", ")||"empty"}. Mix physical products AND experiences (tours, classes, workshops in ${city}). Use REALISTIC market prices: physical gifts €15-60 (like Amazon pricing), experiences €25-80 (like GetYourGuide/Viator pricing). Return ONLY a valid JSON array, nothing else: [{"name":"...","description":"under 10 words","price":30,"emoji":"🎁"}]`}]});
      const text = (data.content?.[0]?.text||"[]").replace(/```json|```/g,"").trim();
      setGiftIdeas(JSON.parse(text));
    } catch(e) { captureError("friend_gift_ideas", e, {friendId: friend.id, occasion: occ.type}); setToast("Couldn't load ideas — try again"); }
    setGiftLoading(false);
  };

  const [showSendGift, setShowSendGift] = useState(false);
  const [localToast, setLocalToast] = useState(null);
  const [followCounts, setFollowCounts] = useState({followers:0, following:0});
  const [followModal, setFollowModal] = useState(null); // "followers"|"following"

  useEffect(() => {
    Promise.all([
      sb.from("follows").select("*",{count:"exact",head:true}).eq("following_id",friend.id),
      sb.from("follows").select("*",{count:"exact",head:true}).eq("follower_id",friend.id)
    ]).then(([f1,f2]) => setFollowCounts({followers:f1.count||0, following:f2.count||0}));
  }, [friend.id]);
  const isF = following.includes(friend.id);
  const tier = getTier(friend.stars||0);
  const SECS = [["occasions",html`${Icon("calendar",12,section==="occasions"?P.gold:P.muted)} ${stripEmoji(t("secOccasions"))}`],["wishlist",html`${Icon("gift",12,section==="wishlist"?P.gold:P.muted)} ${stripEmoji(t("secWishlist"))}`],["gifts",html`${Icon("gift",12,section==="gifts"?P.gold:P.muted)} ${stripEmoji(t("secReceived"))}`]];

  const addBirthdayToCalendar = async () => {
    if(!friend.birthday) return;
    const dateStr = getNextBirthdayDate(friend.birthday);
    const {error} = await sb.from("occasions").insert({
      user_id: myProfile.id,
      type: `${friend.display_name}'s Birthday`,
      date: dateStr,
      color: "#EC4899",
      note: getBirthdaySyncNote(friend.id),
      is_public: false
    });
    if(!error) { setLocalToast(`🎂 ${friend.display_name}'s birthday added!`); setTimeout(()=>setLocalToast(null),3000); }
  };

  return html`<div>
    ${followModal && html`<${FollowListModal} userId=${friend.id} mode=${followModal} onClose=${()=>setFollowModal(null)} onViewProfile=${u=>{onBack();setTimeout(()=>onToggleFollow&&null,0);}} myProfile=${myProfile} following=${following} onToggleFollow=${onToggleFollow}/>`}
    <button onClick=${onBack} style=${{background:"none",border:"none",color:P.muted,fontSize:14,cursor:"pointer",marginBottom:14,padding:0}}>← Back</button>
    <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:20,marginBottom:14,textAlign:"center"}}>
      <${Avatar} emoji=${friend.emoji} avatarUrl=${friend.avatar_url} size=${72} style=${{margin:"0 auto 12px"}}/>
      <div style=${{fontWeight:800,fontSize:20,color:P.text}}>${friend.display_name} ${friend.is_private?Icon("lock",14,P.text):""}</div>
      <div style=${{color:P.muted,fontSize:14,marginBottom:4}}>@${friend.username}</div>
      <div style=${{display:"inline-flex",alignItems:"center",gap:6,background:tier.color+"22",border:`1px solid ${tier.color}44`,borderRadius:99,padding:"4px 12px",marginBottom:10}}>
        ${Icon(tier.svgIcon, 14, tier.color)}
        <span style=${{color:tier.color,fontWeight:700,fontSize:12}}>${tier.name}</span>
        <span style=${{color:P.faint,fontSize:11,display:"inline-flex",alignItems:"center",gap:2}}>· ${friend.stars||0} ${Icon("star",10,P.faint)}</span>
      </div>
      ${friend.birthday && html`<div style=${{fontSize:13,color:P.gold,marginBottom:6,display:"flex",alignItems:"center",gap:6}}>${Icon("calendar",14,P.gold)} ${fmtDate(friend.birthday)} · ${t("inDays")} ${daysUntil(friend.birthday)} ${t("daysWord")}</div>`}
      ${friend.birthday && html`<button onClick=${addBirthdayToCalendar} style=${{background:`${P.gold}11`,border:`1px solid ${P.gold}33`,color:P.goldL,borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",marginBottom:10,display:"inline-flex",alignItems:"center",gap:6}}>${Icon("calendar",12,P.gold)} ${stripEmoji(t("addToCalendar"))}</button>`}
      <div style=${{display:"flex",gap:20,justifyContent:"center",marginBottom:12}}>
        <button onClick=${()=>setFollowModal("followers")} style=${{background:"none",border:"none",cursor:"pointer",textAlign:"center",padding:0}}>
          <div style=${{fontWeight:800,fontSize:18,color:P.text}}>${followCounts.followers}</div>
          <div style=${{fontSize:11,color:P.muted}}>${t("followers")}</div>
        </button>
        <div style=${{width:1,background:P.border}}/>
        <button onClick=${()=>setFollowModal("following")} style=${{background:"none",border:"none",cursor:"pointer",textAlign:"center",padding:0}}>
          <div style=${{fontWeight:800,fontSize:18,color:P.text}}>${followCounts.following}</div>
          <div style=${{fontSize:11,color:P.muted}}>${t("followingCount")}</div>
        </button>
      </div>
      ${(friend.interests||[]).length>0 && html`<div style=${{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginBottom:14}}>
        ${friend.interests.map(i => html`<span key=${i} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}33`,borderRadius:99,padding:"3px 10px",fontSize:11,color:P.goldL,fontWeight:600}}>${translateInterest(i)}</span>`)}
      </div>`}
      <div style=${{display:"flex",gap:8,justifyContent:"center"}}>
        <button onClick=${()=>onToggleFollow(friend.id,friend)} style=${{background:isF?P.border:pendingRequests.includes(friend.id)?`${P.gold}22`:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:pendingRequests.includes(friend.id)?`1px solid ${P.gold}88`:"none",color:isF?P.muted:pendingRequests.includes(friend.id)?P.goldL:"#000",borderRadius:10,padding:"10px 20px",fontWeight:700,fontSize:14,cursor:"pointer"}}>
          ${isF ? t("following") : pendingRequests.includes(friend.id) ? "Requested ⏳" : friend.is_private ? "Request 🔒" : t("follow")}
        </button>
        <button onClick=${()=>setShowSendGift(true)} style=${{background:"#C084FC22",border:"1px solid #C084FC66",color:"#C084FC",borderRadius:10,padding:"10px 20px",fontWeight:700,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>${Icon("gift",16,"#C084FC")} ${stripEmoji(t("iGiftedThem"))}</button>
      </div>
    </div>
    ${showSendGift && html`<${SendGiftModal} friend=${friend} myProfile=${myProfile} onClose=${()=>setShowSendGift(false)} toast=${msg=>{setLocalToast(msg);setTimeout(()=>setLocalToast(null),3000);}}/>`}
    ${occasions.length>0 && html`<div style=${{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:16,padding:16,marginBottom:14}}>
      <div style=${{fontWeight:700,fontSize:15,marginBottom:10}}>${t("getAIIdeas")}</div>
      <div style=${{display:"flex",flexWrap:"wrap",gap:8}}>
        ${occasions.slice(0,3).map(o => html`<button key=${o.id} onClick=${()=>getGiftIdeas(o)} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>${Icon("gift",14,P.gold)} ${t("giftIdeasFor")} ${translateOccasion(o.type)}</button>`)}
      </div>
      ${giftLoading && html`<div style=${{color:P.muted,fontSize:13,marginTop:10}}>${t("findingGifts")}</div>`}
      ${giftIdeas.map((g,i) => html`
        <div key=${i} style=${{background:P.bg,borderRadius:10,padding:"10px 12px",marginTop:10,display:"flex",gap:10,alignItems:"flex-start"}}>
          <div style=${{width:36,height:36,borderRadius:8,background:`${P.gold}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>${Icon("gift",20,P.gold)}</div>
          <div style=${{flex:1}}>
            <div style=${{fontWeight:700,fontSize:13,color:P.text}}>${g.name}</div>
            <div style=${{fontSize:12,color:P.muted,marginTop:2}}>${g.description}</div>
            <div style=${{color:P.gold,fontWeight:700,fontSize:13,marginTop:4}}>~€${g.price}</div>
          </div>
          <${SmartBuyButton} name=${g.name} city=${myProfile?.city||"Madrid"}/>
        </div>`)}
    </div>`}
    <div style=${{display:"flex",background:P.card,borderRadius:10,padding:3,marginBottom:12,gap:2}}>
      ${SECS.map(([id,label]) => html`<button key=${id} onClick=${()=>setSection(id)} style=${{flex:1,padding:"8px 0",borderRadius:8,border:"none",background:section===id?`linear-gradient(135deg,${P.goldD},${P.gold})`:"transparent",color:section===id?"#000":P.muted,fontWeight:700,fontSize:11,cursor:"pointer"}}>${label}</button>`)}
    </div>
    ${section==="occasions" && occasions.map(o => html`<div key=${o.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style=${{fontWeight:600,color:P.text}}>${translateOccasion(o.type)}</div><div style=${{fontSize:13,color:P.muted}}>${fmtDate(o.date)}</div></div><div style=${{color:daysUntil(o.date)<=30?P.gold:P.muted,fontWeight:700,fontSize:13}}>${daysUntil(o.date)}d</div></div>`)}
    ${section==="occasions" && occasions.length===0 && html`<div style=${{color:P.muted,textAlign:"center",padding:20,fontSize:14}}>${t("noOccasions")}</div>`}
    ${section==="wishlist" && html`<div>
      ${(()=>{
        const lists = [...new Set(wishlist.filter(w=>w.list_name).map(w=>w.list_name))];
        const unlisted = wishlist.filter(w=>!w.list_name);
        return html`
          ${lists.map(ln => html`
            <div key=${ln} style=${{marginBottom:12}}>
              <div style=${{fontWeight:700,fontSize:13,color:P.goldL,marginBottom:6}}>${ln}</div>
              ${wishlist.filter(w=>w.list_name===ln).map(w => html`<div key=${w.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style=${{fontWeight:600,color:P.text}}>${w.name}</div>${w.description&&html`<div style=${{fontSize:13,color:P.muted}}>${w.description}</div>`}</div>${w.price&&html`<div style=${{color:P.gold,fontWeight:700}}>€${w.price}</div>`}</div>`)}
            </div>`)}
          ${unlisted.map(w => html`<div key=${w.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style=${{fontWeight:600,color:P.text}}>${w.name}</div>${w.description&&html`<div style=${{fontSize:13,color:P.muted}}>${w.description}</div>`}</div>${w.price&&html`<div style=${{color:P.gold,fontWeight:700}}>€${w.price}</div>`}</div>`)}
          ${wishlist.length===0 && html`<div style=${{color:P.muted,textAlign:"center",padding:20,fontSize:14}}>${t("wishlistEmpty")}</div>`}
        `;
      })()}
    </div>`}
    ${section==="gifts" && giftsReceived.map(g => html`<div key=${g.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style=${{fontWeight:600,color:P.text}}>${g.gift_name}</div>${g.from_whom&&html`<div style=${{fontSize:13,color:P.muted}}>${t("fromWhom")} ${g.from_whom}${g.occasion?` · ${g.occasion}`:""}</div>`}</div><span style=${{display:"flex",alignItems:"center"}}>${Icon("heart",18,P.gold)}</span></div>`)}
    ${section==="gifts" && giftsReceived.length===0 && html`<div style=${{color:P.muted,textAlign:"center",padding:20,fontSize:14}}>${t("noGiftsRecorded")}</div>`}
    ${(toast||localToast) && html`<${Toast} msg=${toast||localToast} onDone=${()=>{setToast(null);setLocalToast(null);}}/>`}
  </div>`;
}

// ── MY PROFILE ──
function MyProfile({profile, setProfile, friendsOccasions=[], onLangChange, onThemeChange, following=[], onToggleFollow}) {
  const [occasions,setOccasions] = useState([]);
  const [wishlist,setWishlist] = useState([]);
  const [giftsReceived,setGiftsReceived] = useState([]);
  const [section,setSection] = useState("occasions");
  const [addingOcc,setAddingOcc] = useState(false);
  const [addingWish,setAddingWish] = useState(false);
  const [addingGift,setAddingGift] = useState(false);
  const [newOcc,setNewOcc] = useState({type:"Birthday",date:"",color:"#F4A438"});
  const [editingOcc,setEditingOcc] = useState(null); // holds {id, type, date, color, is_public}
  const [newWish,setNewWish] = useState({name:"",description:"",price:"",list_name:""});
  const [newGift,setNewGift] = useState({gift_name:"",from_whom:"",occasion:"",reaction:"😊"});
  const [toast,setToast] = useState(null);
  const [followCounts, setFollowCounts] = useState({followers:0, following:0});
  const [followModal, setFollowModal] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  // Wishlist lists
  const [activeList,setActiveList] = useState("all");
  const [showCreateList,setShowCreateList] = useState(false);
  const [newListName,setNewListName] = useState("");
  const [newListEmoji,setNewListEmoji] = useState("🎁");
  const [customLists, setCustomLists] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`gm_lists_${profile.id}`)||"[]"); } catch(e) { return []; }
  });
  const saveCustomLists = ls => {
    setCustomLists(ls);
    try { localStorage.setItem(`gm_lists_${profile.id}`, JSON.stringify(ls)); } catch(e) {}
  };
  const LIST_EMOJIS = ["🎁","🎂","💍","🎓","🏠","❤️","🎄","🌸","✈️","🎉","🌟","💼"];
  const lists = [...new Set([...customLists, ...wishlist.filter(w=>w.list_name).map(w=>w.list_name)])];
  const filteredWish = activeList==="all" ? wishlist : wishlist.filter(w=>w.list_name===activeList);

  useEffect(() => {
    Promise.all([
      sb.from("occasions").select("*").eq("user_id",profile.id).order("date"),
      sb.from("wishlist_items").select("*").eq("user_id",profile.id),
      sb.from("gifts_received").select("*").eq("user_id",profile.id),
      sb.from("follows").select("*",{count:"exact",head:true}).eq("following_id",profile.id),
      sb.from("follows").select("*",{count:"exact",head:true}).eq("follower_id",profile.id)
    ]).then(([o,w,g,f1,f2]) => {
      setOccasions(o.data||[]); setGiftsReceived(g.data||[]);
      setWishlist(w.data||[]);
      // Sync any list names from DB items back into localStorage
      const dbLists = [...new Set((w.data||[]).filter(x=>x.list_name).map(x=>x.list_name))];
      if(dbLists.length) {
        setCustomLists(prev => {
          const merged = [...new Set([...prev, ...dbLists])];
          try { localStorage.setItem(`gm_lists_${profile.id}`, JSON.stringify(merged)); } catch(e) {}
          return merged;
        });
      }
      setFollowCounts({followers:f1.count||0, following:f2.count||0});
    });
  }, []);

  const addOcc = async () => {
    if(!newOcc.date) { setToast("Please pick a date"); return; }
    const {data} = await sb.from("occasions").insert({user_id:profile.id,...newOcc,is_public:newOcc.is_public!==false}).select();
    setOccasions(o => [...o,...(data||[])]);
    setAddingOcc(false); setNewOcc({type:"Birthday",date:"",color:"#F4A438"});
    setToast("Occasion added! 🗓️ +10⭐");
    track("occasion_add", {type: newOcc.type, is_public: newOcc.is_public!==false});
    const ns = (profile.stars||0)+10;
    await sb.from("profiles").update({stars:ns}).eq("id",profile.id);
    setProfile(p => ({...p, stars:ns}));
  };

  const saveOcc = async () => {
    if(!editingOcc.date) { setToast("Please pick a date"); return; }
    await sb.from("occasions").update({type:editingOcc.type, date:editingOcc.date, color:editingOcc.color, is_public:editingOcc.is_public}).eq("id",editingOcc.id);
    setOccasions(prev => prev.map(o => o.id===editingOcc.id ? {...o,...editingOcc} : o));
    setEditingOcc(null);
    setToast("Occasion updated! 🗓️");
  };

  const addWish = async () => {
    if(!newWish.name) { setToast("Please enter a name"); return; }
    const listToSave = newWish.list_name || (activeList!=="all" ? activeList : "");
    const {data} = await sb.from("wishlist_items").insert({user_id:profile.id,...newWish,list_name:listToSave||null,price:newWish.price?parseInt(newWish.price):null,is_public:true}).select();
    setWishlist(w => [...w,...(data||[])]);
    setAddingWish(false); setNewWish({name:"",description:"",price:"",list_name:""});
    setToast("Added to wishlist! 🎁");
    track("wishlist_add", {item_name: newWish.name, list: listToSave, price: newWish.price||null});
  };

  const addGift = async () => {
    if(!newGift.gift_name) { setToast("Please enter a gift name"); return; }
    const {data} = await sb.from("gifts_received").insert({user_id:profile.id,...newGift,is_public:true}).select();
    setGiftsReceived(g => [...g,...(data||[])]);
    setAddingGift(false); setNewGift({gift_name:"",from_whom:"",occasion:"",reaction:"😊"});
    setToast("Gift recorded! 🎀");
  };

  const delOcc = async id => { await sb.from("occasions").delete().eq("id",id); setOccasions(o=>o.filter(x=>x.id!==id)); };
  const delWish = async id => { await sb.from("wishlist_items").delete().eq("id",id); setWishlist(w=>w.filter(x=>x.id!==id)); };

  const [showEdit, setShowEdit] = useState(false);
  const [localProfile, setLocalProfile] = useState(profile);
  const [followRequests, setFollowRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [requestsTab, setRequestsTab] = useState("received");
  const tier = getTier(localProfile.stars||0);

  useEffect(()=>{
    sb.from("follow_requests").select("*, requester:requester_id(id,display_name,username,emoji,avatar_url)")
      .eq("target_id",profile.id).eq("status","pending")
      .then(({data})=>setFollowRequests(data||[]));
    sb.from("follow_requests").select("*, target:target_id(id,display_name,username,emoji,avatar_url)")
      .eq("requester_id",profile.id).in("status",["pending","accepted","rejected"])
      .order("created_at",{ascending:false})
      .then(({data})=>setSentRequests(data||[]));
  },[]);

  const reloadFollowCounts = () => {
    Promise.all([
      sb.from("follows").select("*",{count:"exact",head:true}).eq("following_id",profile.id),
      sb.from("follows").select("*",{count:"exact",head:true}).eq("follower_id",profile.id)
    ]).then(([f1,f2]) => setFollowCounts({followers:f1.count||0, following:f2.count||0}));
  };

  const acceptReq = async req => {
    const {error: updateErr} = await sb.from("follow_requests").update({status:"accepted"}).eq("id",req.id);
    if(updateErr) { console.error("Accept update error:", updateErr); return; }
    const {error: followErr} = await sb.from("follows").insert({follower_id:req.requester_id, following_id:profile.id});
    if(followErr) { console.error("Follow insert error:", followErr); }
    setFollowRequests(p=>p.filter(r=>r.id!==req.id));
    reloadFollowCounts();
  };
  const rejectReq = async req => {
    await sb.from("follow_requests").update({status:"rejected"}).eq("id",req.id);
    setFollowRequests(p=>p.filter(r=>r.id!==req.id));
  };

  const reqCount = followRequests.length;
  const secColor = id => section===id ? "#000" : P.muted;
  const SECS = [["occasions",html`${Icon("calendar",12,secColor("occasions"))} ${stripEmoji(t("secOccasions"))}`],["wishlist",html`${Icon("gift",12,secColor("wishlist"))} ${stripEmoji(t("secWishlist"))}`],["gifts",html`${Icon("gift",12,secColor("gifts"))} ${stripEmoji(t("secReceived"))}`],["inbox",html`${Icon("gift",12,secColor("inbox"))} ${stripEmoji(t("secInbox"))}`],["requests",html`${Icon("profile",12,secColor("requests"))} Requests${reqCount>0?` (${reqCount})`:""}`]];

  return html`<div>
    ${followModal && html`<${FollowListModal} userId=${profile.id} mode=${followModal} onClose=${()=>setFollowModal(null)} onViewProfile=${u=>{ setFollowModal(null); setViewingUser(u); }} myProfile=${profile} following=${following} onToggleFollow=${onToggleFollow}/>`}
    ${viewingUser && html`<${FriendProfile} friend=${viewingUser} myProfile=${profile} following=${[]} onToggleFollow=${()=>{}} onBack=${()=>setViewingUser(null)}/>`}
    ${!viewingUser && html`<div>
    ${showEdit && html`<${EditProfileModal} profile=${localProfile} onSave=${p=>{setProfile(p);setLocalProfile(p);}} onLangChange=${onLangChange} onThemeChange=${onThemeChange} onClose=${()=>setShowEdit(false)}/>`}
    <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:20,marginBottom:14,textAlign:"center"}}>
      <div style=${{position:"relative",display:"inline-block",marginBottom:12}}>
        <${Avatar} emoji=${localProfile.emoji} avatarUrl=${localProfile.avatar_url} size=${80}/>
        <button onClick=${()=>setShowEdit(true)} style=${{position:"absolute",bottom:0,right:-4,width:26,height:26,borderRadius:"50%",background:P.gold,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#0A0A18"}}>${Icon("pencil",12,"#0A0A18")}</button>
      </div>
      <div style=${{fontWeight:800,fontSize:20,color:P.text}}>${localProfile.display_name}</div>
      <div style=${{color:P.muted,fontSize:14,marginBottom:6}}>@${localProfile.username}</div>
      <div style=${{display:"inline-flex",alignItems:"center",gap:6,background:tier.color+"22",border:`1px solid ${tier.color}44`,borderRadius:99,padding:"5px 14px",marginBottom:8}}>
        ${Icon(tier.svgIcon, 16, tier.color)}
        <div>
          <div style=${{color:tier.color,fontWeight:800,fontSize:13}}>${tier.name}</div>
          <div style=${{color:P.faint,fontSize:10}}>${tier.desc}</div>
        </div>
        <span style=${{color:P.muted,fontSize:11,marginLeft:4,display:"inline-flex",alignItems:"center",gap:2}}>${localProfile.stars||0} ${Icon("star",10,P.muted)}</span>
      </div>
      <div style=${{display:"flex",gap:20,justifyContent:"center",margin:"10px 0"}}>
        <button onClick=${()=>setFollowModal("followers")} style=${{background:"none",border:"none",cursor:"pointer",textAlign:"center",padding:0}}>
          <div style=${{fontWeight:800,fontSize:18,color:P.text}}>${followCounts.followers}</div>
          <div style=${{fontSize:11,color:P.muted}}>${t("followers")}</div>
        </button>
        <div style=${{width:1,background:P.border}}/>
        <button onClick=${()=>setFollowModal("following")} style=${{background:"none",border:"none",cursor:"pointer",textAlign:"center",padding:0}}>
          <div style=${{fontWeight:800,fontSize:18,color:P.text}}>${followCounts.following}</div>
          <div style=${{fontSize:11,color:P.muted}}>${t("followingCount")}</div>
        </button>
      </div>
      ${localProfile.birthday && html`<div style=${{fontSize:13,color:P.gold,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>${Icon("calendar",14,P.gold)} ${fmtDate(localProfile.birthday)}</div>`}
      ${(localProfile.interests||[]).length>0 && html`<div style=${{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:8}}>
        ${localProfile.interests.map(i => html`<span key=${i} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}33`,borderRadius:99,padding:"3px 10px",fontSize:11,color:P.goldL,fontWeight:600}}>${translateInterest(i)}</span>`)}
      </div>`}
      <div style=${{display:"flex",gap:8,justifyContent:"center",marginTop:14}}>
        <button onClick=${()=>setShowEdit(true)} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>${t("editProfileBtn")}</button>
        <button onClick=${()=>sb.auth.signOut()} style=${{background:"none",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"7px 16px",fontSize:12,cursor:"pointer"}}>${t("logOut")}</button>
      </div>
    </div>
    <div style=${{display:"flex",background:P.card,borderRadius:10,padding:3,marginBottom:12,gap:2,overflowX:"auto"}}>
      ${SECS.map(([id,label]) => html`<button key=${id} onClick=${()=>setSection(id)} style=${{flex:1,padding:"8px 4px",borderRadius:8,border:"none",background:section===id?`linear-gradient(135deg,${P.goldD},${P.gold})`:"transparent",color:section===id?"#000":P.muted,fontWeight:700,fontSize:10,cursor:"pointer",whiteSpace:"nowrap"}}>${label}</button>`)}
    </div>

    ${section==="occasions" && html`<div>
      ${occasions.map(o => editingOcc?.id===o.id ? html`
        <div key=${o.id} style=${{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:14,padding:16,marginBottom:10}}>
          <select value=${OCCASIONS.includes(editingOcc.type)?editingOcc.type:"custom"} onChange=${e=>{if(e.target.value==="custom"){setEditingOcc(x=>({...x,type:""}))}else{setEditingOcc(x=>({...x,type:e.target.value}))}}} style=${{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:8,padding:"10px",color:P.text,fontSize:14,marginBottom:10,boxSizing:"border-box"}}>
            ${OCCASIONS.map((op,i) => html`<option key=${op} value=${op}>${getOccasions()[i]||op}</option>`)}
            <option value="custom">Custom…</option>
          </select>
          ${!OCCASIONS.includes(editingOcc.type) && html`<input value=${editingOcc.type} onInput=${e=>setEditingOcc(x=>({...x,type:e.target.value}))} placeholder=${t("customOccasion")} style=${{width:"100%",background:P.bg,border:`1px solid ${P.gold}55`,borderRadius:8,padding:"10px",color:P.text,fontSize:14,marginBottom:10,boxSizing:"border-box",outline:"none"}}/>`}
          <div style=${{marginBottom:10}}>
            <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:7}}>${t("colour")||"COLOUR"}</div>
            <div style=${{display:"flex",gap:8,flexWrap:"wrap"}}>
              ${["#F4A438","#EF4444","#EC4899","#A855F7","#3B82F6","#14B8A6","#22C55E","#F59E0B","#6366F1","#FB923C","#FFFFFF","#94A3B8"].map(c => html`
                <div key=${c} onClick=${()=>setEditingOcc(x=>({...x,color:c}))} style=${{width:26,height:26,borderRadius:"50%",background:c,cursor:"pointer",border:editingOcc.color===c?"3px solid #fff":"3px solid transparent",boxShadow:editingOcc.color===c?"0 0 0 2px "+c:"none",transition:"all 0.15s"}}/>
              `)}
            </div>
          </div>
          <input type="date" value=${editingOcc.date} onChange=${e=>setEditingOcc(x=>({...x,date:e.target.value}))} style=${{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:8,padding:"10px",color:P.text,fontSize:14,marginBottom:10,boxSizing:"border-box"}}/>
          <div style=${{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <input type="checkbox" checked=${editingOcc.is_public!==false} onChange=${e=>setEditingOcc(x=>({...x,is_public:e.target.checked}))} style=${{width:16,height:16,cursor:"pointer"}}/>
            <span style=${{color:P.muted,fontSize:13,cursor:"pointer"}}>${t("makePublic")}</span>
          </div>
          <div style=${{display:"flex",gap:8}}>
            <button onClick=${()=>setEditingOcc(null)} style=${{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"9px 0",cursor:"pointer"}}>${t("cancel")}</button>
            <button onClick=${saveOcc} style=${{flex:2,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:8,padding:"9px 0",fontWeight:700,cursor:"pointer"}}>${t("save")}</button>
          </div>
        </div>
      ` : html`
        <div key=${o.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style=${{display:"flex",alignItems:"center",gap:10}}>
            <div style=${{width:28,height:28,borderRadius:8,background:`${(o.color||P.gold)}22`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>${Icon("gift",14,o.color||P.gold)}</div>
            <div><div style=${{fontWeight:600,color:P.text}}>${translateOccasion(o.type)}</div><div style=${{fontSize:13,color:P.muted}}>${fmtDate(o.date)}</div></div>
          </div>
          <div style=${{display:"flex",gap:6,alignItems:"center"}}>
            <button onClick=${async()=>{const np=!o.is_public;await sb.from("occasions").update({is_public:np}).eq("id",o.id);setOccasions(prev=>prev.map(x=>x.id===o.id?{...x,is_public:np}:x));}} style=${{background:"none",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 8px",fontSize:10,color:o.is_public?P.teal:P.muted,cursor:"pointer",fontWeight:700,display:"flex",alignItems:"center",gap:4}}>${o.is_public?Icon("globe",10,o.is_public?P.teal:P.muted):Icon("lock",10,o.is_public?P.teal:P.muted)} ${(o.is_public?t("publicLabel"):t("privateLabel")).split(/\s+/).slice(1).join(" ")||(o.is_public?"Public":"Private")}</button>
            <div style=${{color:daysUntil(o.date)<=30?P.gold:P.muted,fontWeight:700,fontSize:13}}>${daysUntil(o.date)}d</div>
            <button onClick=${()=>setEditingOcc({id:o.id,type:o.type,date:o.date,color:o.color||"#F4A438",is_public:o.is_public!==false})} style=${{background:"none",border:"none",color:P.muted,cursor:"pointer",display:"flex",alignItems:"center"}}>${Icon("pencil",14,P.muted)}</button>
            <button onClick=${()=>delOcc(o.id)} style=${{background:"none",border:"none",color:P.muted,cursor:"pointer",display:"flex",alignItems:"center"}}>${Icon("close",14,P.muted)}</button>
          </div>
        </div>
      `)}
      ${addingOcc ? html`<div style=${{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:14,padding:16,marginBottom:10}}>
        <select value=${OCCASIONS.includes(newOcc.type)?newOcc.type:"custom"} onChange=${e=>{if(e.target.value==="custom"){setNewOcc(o=>({...o,type:""}))}else{setNewOcc(o=>({...o,type:e.target.value}))}}} style=${{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:8,padding:"10px",color:P.text,fontSize:14,marginBottom:10,boxSizing:"border-box"}}>
          ${OCCASIONS.map((o,i) => html`<option key=${o} value=${o}>${getOccasions()[i]||o}</option>`)}
          <option value="custom">Custom…</option>
        </select>
        ${!OCCASIONS.includes(newOcc.type) && html`<input value=${newOcc.type} onInput=${e=>setNewOcc(o=>({...o,type:e.target.value}))} placeholder=${t("customOccasion")} style=${{width:"100%",background:P.bg,border:`1px solid ${P.gold}55`,borderRadius:8,padding:"10px",color:P.text,fontSize:14,marginBottom:10,boxSizing:"border-box",outline:"none"}}/>`}
        <div style=${{marginBottom:10}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:7}}>COLOUR</div>
          <div style=${{display:"flex",gap:8,flexWrap:"wrap"}}>
            ${["#F4A438","#EF4444","#EC4899","#A855F7","#3B82F6","#14B8A6","#22C55E","#F59E0B","#6366F1","#FB923C","#FFFFFF","#94A3B8"].map(c => html`
              <div key=${c} onClick=${()=>setNewOcc(o=>({...o,color:c}))} style=${{width:26,height:26,borderRadius:"50%",background:c,cursor:"pointer",border:newOcc.color===c?"3px solid #fff":"3px solid transparent",boxShadow:newOcc.color===c?"0 0 0 2px "+c:"none",transition:"all 0.15s"}}/>
            `)}
          </div>
        </div>
        <input type="date" value=${newOcc.date} onChange=${e=>setNewOcc(o=>({...o,date:e.target.value}))} style=${{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:8,padding:"10px",color:P.text,fontSize:14,marginBottom:10,boxSizing:"border-box"}}/>
        <div style=${{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <input type="checkbox" id="occ_pub" checked=${newOcc.is_public!==false} onChange=${e=>setNewOcc(o=>({...o,is_public:e.target.checked}))} style=${{width:16,height:16,cursor:"pointer"}}/>
          <label for="occ_pub" style=${{color:P.muted,fontSize:13,cursor:"pointer"}}>${t("makePublic")}</label>
        </div>
        <div style=${{display:"flex",gap:8}}>
          <button onClick=${()=>setAddingOcc(false)} style=${{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"9px 0",cursor:"pointer"}}>Cancel</button>
          <button onClick=${addOcc} style=${{flex:2,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:8,padding:"9px 0",fontWeight:700,cursor:"pointer"}}>Add +10⭐</button>
        </div>
      </div>` : html`<button onClick=${()=>setAddingOcc(true)} style=${{width:"100%",background:`${P.gold}11`,border:`1px dashed ${P.gold}44`,borderRadius:12,padding:"12px 0",color:P.gold,fontWeight:700,cursor:"pointer",fontSize:14}}>${t("addOccasion")}</button>`}
      <div style=${{marginBottom:14}}></div>
      <${CalendarView} occasions=${occasions} friendsOccasions=${friendsOccasions}/>
    </div>`}

    ${section==="wishlist" && html`<div>
      <!-- List tabs -->
      <div style=${{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12,alignItems:"center"}}>
        <button onClick=${()=>setActiveList("all")} style=${{background:activeList==="all"?`linear-gradient(135deg,${P.goldD},${P.gold})`:`${P.card}`,border:`1px solid ${activeList==="all"?P.gold:P.border}`,borderRadius:99,padding:"5px 12px",fontSize:12,fontWeight:700,color:activeList==="all"?"#000":P.muted,cursor:"pointer"}}>${t("allLists")}</button>
        ${lists.map(ln => html`
          <button key=${ln} onClick=${()=>setActiveList(ln)} style=${{background:activeList===ln?`linear-gradient(135deg,${P.goldD},${P.gold})`:P.card,border:`1px solid ${activeList===ln?P.gold:P.border}`,borderRadius:99,padding:"5px 12px",fontSize:12,fontWeight:700,color:activeList===ln?"#000":P.muted,cursor:"pointer"}}>${ln}</button>`)}
        <button onClick=${()=>setShowCreateList(true)} style=${{background:"transparent",border:`1px dashed ${P.gold}66`,borderRadius:99,padding:"5px 10px",fontSize:11,color:P.gold,cursor:"pointer",fontWeight:700}}>${t("newList")}</button>
      </div>

      <!-- Create list form -->
      ${showCreateList && html`<div style=${{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:14,padding:14,marginBottom:12}}>
        <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:6}}>${t("listEmoji")}</div>
        <div style=${{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
          ${LIST_EMOJIS.map(e => html`<button key=${e} onClick=${()=>setNewListEmoji(e)} style=${{background:newListEmoji===e?`${P.gold}33`:"none",border:`1px solid ${newListEmoji===e?P.gold:"transparent"}`,borderRadius:8,padding:"4px 7px",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>${Icon(emojiToIconList(e),18,P.text)}</button>`)}
        </div>
        <${Inp} value=${newListName} onChange=${setNewListName} placeholder="e.g. My Birthday 🎂" style=${{marginBottom:8}}/>
        <div style=${{display:"flex",gap:8}}>
          <button onClick=${()=>{setShowCreateList(false);setNewListName("");setNewListEmoji("🎁");}} style=${{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"8px 0",cursor:"pointer"}}>${t("cancel")}</button>
          <button onClick=${()=>{
            if(!newListName.trim()) return;
            const listLabel = newListEmoji+" "+newListName.trim();
            saveCustomLists(customLists.includes(listLabel) ? customLists : [...customLists, listLabel]);
            setActiveList(listLabel);
            setShowCreateList(false); setNewListName(""); setNewListEmoji("🎁");
          }} style=${{flex:2,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:8,padding:"8px 0",fontWeight:700,cursor:"pointer"}}>${t("createList")}</button>
        </div>
      </div>`}

      <!-- Items -->
      ${filteredWish.map(w => html`<div key=${w.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style=${{flex:1}}>
          <div style=${{fontWeight:600,color:P.text}}>${w.name}</div>
          ${w.description&&html`<div style=${{fontSize:13,color:P.muted}}>${w.description}</div>`}
          ${w.list_name&&activeList==="all"&&html`<div style=${{fontSize:11,color:P.gold,marginTop:3,fontWeight:600}}>${w.list_name}</div>`}
        </div>
        <div style=${{display:"flex",gap:10,alignItems:"center"}}>${w.price&&html`<div style=${{color:P.gold,fontWeight:700}}>€${w.price}</div>`}<button onClick=${()=>delWish(w.id)} style=${{background:"none",border:"none",color:P.muted,cursor:"pointer",display:"flex",alignItems:"center"}}>${Icon("close",14,P.muted)}</button></div>
      </div>`)}

      ${filteredWish.length===0 && !addingWish && html`<div style=${{color:P.muted,textAlign:"center",padding:20,fontSize:14}}>${t("noListItems")}</div>`}

      <!-- Add item form -->
      ${addingWish ? html`<div style=${{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:14,padding:16,marginBottom:10}}>
        <${Inp} value=${newWish.name} onChange=${v=>setNewWish(w=>({...w,name:v}))} placeholder=${t("wishlistName")} style=${{marginBottom:8}}/>
        <${Inp} value=${newWish.description} onChange=${v=>setNewWish(w=>({...w,description:v}))} placeholder=${t("wishlistDesc")} style=${{marginBottom:8}}/>
        <${Inp} value=${newWish.price} onChange=${v=>setNewWish(w=>({...w,price:v}))} placeholder=${t("wishlistPrice")} type="number" style=${{marginBottom:8}}/>
        ${lists.length>0 && html`<div style=${{marginBottom:10}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:6}}>${t("addToList")}</div>
          <div style=${{display:"flex",gap:6,flexWrap:"wrap"}}>
            ${[...lists].map(ln => html`<button key=${ln} onClick=${()=>setNewWish(w=>({...w,list_name:newWish.list_name===ln?"":ln}))} style=${{background:newWish.list_name===ln?`${P.gold}33`:P.bg,border:`1px solid ${newWish.list_name===ln?P.gold:P.border}`,borderRadius:99,padding:"4px 10px",fontSize:11,color:newWish.list_name===ln?P.goldL:P.muted,cursor:"pointer",fontWeight:600}}>${ln}</button>`)}
          </div>
        </div>`}
        <div style=${{display:"flex",gap:8}}>
          <button onClick=${()=>setAddingWish(false)} style=${{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"9px 0",cursor:"pointer"}}>${t("cancel")}</button>
          <button onClick=${addWish} style=${{flex:2,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:8,padding:"9px 0",fontWeight:700,cursor:"pointer"}}>${t("save")}</button>
        </div>
      </div>` : html`<button onClick=${()=>setAddingWish(true)} style=${{width:"100%",background:`${P.gold}11`,border:`1px dashed ${P.gold}44`,borderRadius:12,padding:"12px 0",color:P.gold,fontWeight:700,cursor:"pointer",fontSize:14}}>${t("addWishlist")}</button>`}
    </div>`}

    ${section==="gifts" && html`<div>
      ${giftsReceived.map(g => html`<div key=${g.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style=${{fontWeight:600,color:P.text}}>${g.gift_name}</div>${g.from_whom&&html`<div style=${{fontSize:13,color:P.muted}}>${t("fromWhom")} ${g.from_whom}${g.occasion?` · ${g.occasion}`:""}</div>`}</div>
        <span style=${{display:"flex",alignItems:"center"}}>${Icon("heart",18,P.gold)}</span>
      </div>`)}
      ${addingGift ? html`<div style=${{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:14,padding:16,marginBottom:10}}>
        <${Inp} value=${newGift.gift_name} onChange=${v=>setNewGift(g=>({...g,gift_name:v}))} placeholder="Gift name" style=${{marginBottom:8}}/>
        <${Inp} value=${newGift.from_whom} onChange=${v=>setNewGift(g=>({...g,from_whom:v}))} placeholder="From whom" style=${{marginBottom:8}}/>
        <${Inp} value=${newGift.occasion} onChange=${v=>setNewGift(g=>({...g,occasion:v}))} placeholder="Occasion (Birthday, etc.)" style=${{marginBottom:10}}/>
        <div style=${{marginBottom:12}}>
          <div style=${{fontSize:12,color:P.muted,marginBottom:6}}>Reaction</div>
          <div style=${{display:"flex",gap:8}}>
            ${["😊","❤️","🤩","😄","🙏"].map(r => html`<button key=${r} onClick=${()=>setNewGift(g=>({...g,reaction:r}))} style=${{fontSize:22,background:newGift.reaction===r?`${P.gold}33`:"none",border:`1px solid ${newGift.reaction===r?P.gold:"transparent"}`,borderRadius:8,padding:"6px 10px",cursor:"pointer"}}>${r}</button>`)}
          </div>
        </div>
        <div style=${{display:"flex",gap:8}}>
          <button onClick=${()=>setAddingGift(false)} style=${{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"9px 0",cursor:"pointer"}}>Cancel</button>
          <button onClick=${addGift} style=${{flex:2,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:8,padding:"9px 0",fontWeight:700,cursor:"pointer"}}>Add</button>
        </div>
      </div>` : html`<button onClick=${()=>setAddingGift(true)} style=${{width:"100%",background:`${P.gold}11`,border:`1px dashed ${P.gold}44`,borderRadius:12,padding:"12px 0",color:P.gold,fontWeight:700,cursor:"pointer",fontSize:14}}>+ Add Gift Received</button>`}
    </div>`}

    ${section==="inbox" && html`<${GiftInbox} profile=${profile} toast=${msg=>{setToast(msg);setTimeout(()=>setToast(null),3000);}}/>`}

    ${section==="requests" && html`<div>
      <!-- Received / Sent tabs -->
      <div style=${{display:"flex",gap:8,marginBottom:14}}>
        <button onClick=${()=>setRequestsTab("received")} style=${{flex:1,padding:"9px 0",borderRadius:10,border:`1px solid ${requestsTab==="received"?P.gold:P.border}`,background:requestsTab==="received"?`${P.gold}22`:"transparent",color:requestsTab==="received"?P.goldL:P.muted,fontWeight:700,fontSize:13,cursor:"pointer"}}>
          Received ${followRequests.length>0?`(${followRequests.length})`:""}
        </button>
        <button onClick=${()=>setRequestsTab("sent")} style=${{flex:1,padding:"9px 0",borderRadius:10,border:`1px solid ${requestsTab==="sent"?P.gold:P.border}`,background:requestsTab==="sent"?`${P.gold}22`:"transparent",color:requestsTab==="sent"?P.goldL:P.muted,fontWeight:700,fontSize:13,cursor:"pointer"}}>
          Sent ${sentRequests.filter(r=>r.status==="pending").length>0?`(${sentRequests.filter(r=>r.status==="pending").length})`:""}
        </button>
      </div>

      ${requestsTab==="received" && html`<div>
        ${followRequests.length===0
          ? html`<div style=${{textAlign:"center",padding:40,color:P.muted,fontSize:14}}>No pending follow requests 👍</div>`
          : followRequests.map(req => html`
            <div key=${req.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:14,marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
              <${Avatar} emoji=${req.requester?.emoji} avatarUrl=${req.requester?.avatar_url} size=${44}/>
              <div style=${{flex:1}}>
                <div style=${{fontWeight:700,color:P.text,fontSize:14}}>${req.requester?.display_name}</div>
                <div style=${{fontSize:12,color:P.muted}}>@${req.requester?.username}</div>
              </div>
              <div style=${{display:"flex",gap:6}}>
                <button onClick=${()=>acceptReq(req)} style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:8,padding:"7px 12px",fontWeight:700,fontSize:12,cursor:"pointer"}}>Accept</button>
                <button onClick=${()=>rejectReq(req)} style=${{background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"7px 12px",fontWeight:700,fontSize:12,cursor:"pointer"}}>Decline</button>
              </div>
            </div>`)}
      </div>`}

      ${requestsTab==="sent" && html`<div>
        ${sentRequests.length===0
          ? html`<div style=${{textAlign:"center",padding:40,color:P.muted,fontSize:14}}>No requests sent yet</div>`
          : sentRequests.map(req => html`
            <div key=${req.id} style=${{background:P.card,border:`1px solid ${req.status==="accepted"?P.green:req.status==="rejected"?P.red:P.border}`,borderRadius:14,padding:14,marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
              <${Avatar} emoji=${req.target?.emoji} avatarUrl=${req.target?.avatar_url} size=${44}/>
              <div style=${{flex:1}}>
                <div style=${{fontWeight:700,color:P.text,fontSize:14}}>${req.target?.display_name}</div>
                <div style=${{fontSize:12,color:P.muted}}>@${req.target?.username}</div>
              </div>
              <div style=${{fontSize:12,fontWeight:700,color:req.status==="accepted"?P.green:req.status==="rejected"?P.red:P.gold,padding:"4px 10px",borderRadius:99,background:req.status==="accepted"?`${P.green}22`:req.status==="rejected"?`${P.red}22`:`${P.gold}22`}}>
                ${req.status==="accepted"?"✅ Accepted":req.status==="rejected"?"❌ Declined":"⏳ Pending"}
              </div>
            </div>`)}
      </div>`}
    </div>`}

    ${toast && html`<${Toast} msg=${toast} onDone=${()=>setToast(null)}/>`}
  </div>`}
  </div>`;
}

// ── GROUPS TAB ──
function GroupsTab({profile, following, feed, groupUnread=0, onGroupUnreadChange}) {
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groupCounts, setGroupCounts] = useState({}); // {group_id: unread_count}

  const loadGroups = async () => {
    const {data:memberOf} = await sb.from("group_members").select("group_id").eq("user_id", profile.id);
    const {data:created} = await sb.from("gift_groups").select("*").eq("created_by", profile.id);
    const memberIds = (memberOf||[]).map(m=>m.group_id);
    const {data:memberGroups} = memberIds.length ? await sb.from("gift_groups").select("*").in("id", memberIds) : {data:[]};
    const all = [...(created||[]), ...(memberGroups||[])].filter((g,i,a)=>a.findIndex(x=>x.id===g.id)===i);
    const sorted = all.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    setGroups(sorted);
    // Load unread counts per group using localStorage last-read timestamps
    const counts = {};
    let total = 0;
    for (const g of sorted) {
      const lastRead = localStorage.getItem(`gm_lastread_${g.id}`) || "1970-01-01";
      const {count} = await sb.from("group_messages").select("id",{count:"exact",head:true})
        .eq("group_id",g.id).gt("created_at",lastRead).neq("sender_id",profile.id).neq("message_type","system");
      counts[g.id] = count||0;
      total += count||0;
    }
    setGroupCounts(counts);
    const groupsWithUnread = Object.values(counts).filter(c=>c>0).length;
    if(onGroupUnreadChange) onGroupUnreadChange(groupsWithUnread);
    setLoading(false);
  };

  useEffect(()=>{ loadGroups(); }, []);

  if(activeGroup) return html`<${GroupChat} group=${activeGroup} profile=${profile} feed=${feed} following=${following} onBack=${()=>{setActiveGroup(null);loadGroups();}}/>`;
  if(showCreate) return html`<${CreateGroup} profile=${profile} feed=${feed} following=${following} onCreate=${g=>{setShowCreate(false);setActiveGroup(g);loadGroups();}} onClose=${()=>setShowCreate(false)}/>`;

  const openGroup = g => {
    // Mark as read
    try { localStorage.setItem(`gm_lastread_${g.id}`, new Date().toISOString()); } catch(e) {}
    setGroupCounts(c => ({...c, [g.id]:0}));
    setActiveGroup(g);
  };
  return html`<div>
    <div style=${{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div>
        <div style=${{fontWeight:800,fontSize:18,color:P.text,display:"flex",alignItems:"center",gap:8}}>${Icon("gift",20,P.text)} ${stripEmoji(t("giftGroups"))}</div>
        <div style=${{color:P.muted,fontSize:13}}>${t("planSplit")}</div>
      </div>
      <button onClick=${()=>setShowCreate(true)} style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:10,padding:"9px 16px",fontWeight:700,fontSize:13,cursor:"pointer"}}>${t("newGroup")}</button>
    </div>

    ${loading && html`<div style=${{textAlign:"center",padding:40,color:P.muted}}>Loading…</div>`}
    ${!loading && groups.length===0 && html`<div style=${{textAlign:"center",padding:40}}>
      <div style=${{marginBottom:12,display:"flex",justifyContent:"center"}}>${Icon("gift",48,P.gold)}</div>
      <div style=${{fontWeight:700,fontSize:16,color:P.text,marginBottom:8}}>${t("noGroups")}</div>
      <div style=${{color:P.muted,fontSize:14,marginBottom:20}}>${t("noGroupsDesc")}</div>
      <button onClick=${()=>setShowCreate(true)} style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:12,padding:"12px 24px",fontWeight:700,cursor:"pointer"}}>${t("createFirstGroup")}</button>
    </div>`}

    ${groups.map(g => html`
      <div key=${g.id} onClick=${()=>openGroup(g)} style=${{background:P.card,border:`1px solid ${groupCounts[g.id]>0?P.gold:P.border}`,borderRadius:14,padding:16,marginBottom:10,cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
        <div style=${{position:"relative",flexShrink:0}}>
          <div style=${{width:48,height:48,borderRadius:12,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center"}}>${Icon(emojiToIconGroup(g.emoji||"🎁"),24,"#0A0A18")}</div>
          ${groupCounts[g.id]>0 && html`<span style=${{position:"absolute",top:-4,right:-4,background:P.red,color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px"}}>${groupCounts[g.id]>9?"9+":groupCounts[g.id]}</span>`}
        </div>
        <div style=${{flex:1,minWidth:0}}>
          <div style=${{fontWeight:700,fontSize:15,color:groupCounts[g.id]>0?P.goldL:P.text}}>${g.name}</div>
          <div style=${{fontSize:12,color:P.muted,marginTop:2}}>${g.occasion||"Gift group"}${g.target_name?" · For "+g.target_name:""}</div>
          ${g.budget && html`<div style=${{fontSize:12,color:P.gold,fontWeight:700,marginTop:2}}>Budget: €${g.budget}</div>`}
        </div>
        <div style=${{color:P.muted,fontSize:20}}>›</div>
      </div>`)}
  </div>`;
}

function CreateGroup({profile, feed, following, onCreate, onClose}) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎁");
  const [occasion, setOccasion] = useState("Birthday");
  const [targetName, setTargetName] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const friends = (feed||[]).map(f=>f.profile).filter(Boolean);

  const toggleFriend = id => setSelectedFriends(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const [errMsg, setErrMsg] = useState("");

  const create = async () => {
    if(!name.trim()) return;
    setLoading(true); setErrMsg("");
    const {data:group, error} = await sb.from("gift_groups").insert({
      name, emoji, occasion, target_name:targetName||null,
      budget: budget?parseInt(budget):null, created_by:profile.id
    }).select().single();
    if(error||!group) { 
      setErrMsg(error?.message||"Failed to create group — check Supabase RLS policies");
      setLoading(false); return; 
    }

    // Add creator as admin
    const {error:e2} = await sb.from("group_members").insert({group_id:group.id, user_id:profile.id, role:"admin"});
    if(e2) { setErrMsg("Group created but couldn't add you as member: "+e2.message); setLoading(false); return; }

    // Add selected friends
    if(selectedFriends.length) {
      const {error:e3} = await sb.from("group_members").insert(selectedFriends.map(uid=>({group_id:group.id, user_id:uid, role:"member"})));
      if(e3) console.warn("Couldn't add friends:", e3.message);
    }
    // System message
    await sb.from("group_messages").insert({group_id:group.id, sender_id:profile.id, content:`${profile.display_name} created this group`, message_type:"system"});

    onCreate(group);
  };

  const GROUP_EMOJIS = ["🎁","🎂","💍","🎓","🏠","❤️","🎉","🌟","🍾","✈️","🎸","⚽"];

  return html`<div>
    <button onClick=${onClose} style=${{background:"none",border:"none",color:P.muted,fontSize:14,cursor:"pointer",marginBottom:16,padding:0}}>← Back</button>
    <div style=${{fontWeight:800,fontSize:18,color:P.text,marginBottom:20}}>New Gift Group</div>

    <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:18,marginBottom:14}}>
      <div style=${{marginBottom:14}}>
        <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:6}}>GROUP EMOJI</div>
        <div style=${{display:"flex",gap:8,flexWrap:"wrap"}}>
          ${GROUP_EMOJIS.map(e=>html`<button key=${e} onClick=${()=>setEmoji(e)} style=${{background:emoji===e?`${P.gold}33`:"none",border:`1px solid ${emoji===e?P.gold:"transparent"}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>${Icon(emojiToIconGroup(e),20,P.text)}</button>`)}
        </div>
      </div>
      <div style=${{marginBottom:12}}>
        <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>GROUP NAME</div>
        <${Inp} value=${name} onChange=${setName} placeholder="e.g. Mum's 60th Birthday 🎂"/>
      </div>
      <div style=${{marginBottom:12}}>
        <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>OCCASION</div>
        <select value=${occasion} onChange=${e=>setOccasion(e.target.value)} style=${{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:10,padding:"12px 14px",color:P.text,fontSize:14,boxSizing:"border-box"}}>
          ${OCCASIONS.map((o,i)=>html`<option key=${o} value=${o}>${getOccasions()[i]||o}</option>`)}
        </select>
      </div>
      <div style=${{marginBottom:12}}>
        <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>GIFT IS FOR (optional)</div>
        <${Inp} value=${targetName} onChange=${setTargetName} placeholder="e.g. Mum, Carlos, the team…"/>
      </div>
      <div>
        <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:5}}>TOTAL BUDGET €  (optional)</div>
        <${Inp} value=${budget} onChange=${setBudget} placeholder="e.g. 150" type="number"/>
      </div>
    </div>

    ${friends.length>0 && html`<div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:18,marginBottom:14}}>
      <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:12}}>ADD FRIENDS</div>
      ${friends.map(f=>html`
        <div key=${f.id} onClick=${()=>toggleFriend(f.id)} style=${{display:"flex",alignItems:"center",gap:10,padding:"8px 0",cursor:"pointer",borderBottom:`1px solid ${P.border}`}}>
          <${Avatar} emoji=${f.emoji} avatarUrl=${f.avatar_url} size=${36}/>
          <div style=${{flex:1}}>
            <div style=${{fontWeight:600,color:P.text,fontSize:14}}>${f.display_name}</div>
            <div style=${{fontSize:12,color:P.muted}}>@${f.username}</div>
          </div>
          <div style=${{width:22,height:22,borderRadius:"50%",border:`2px solid ${selectedFriends.includes(f.id)?P.gold:P.border}`,background:selectedFriends.includes(f.id)?P.gold:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>
            ${selectedFriends.includes(f.id)?"✓":""}
          </div>
        </div>`)}
    </div>`}

    <button onClick=${create} disabled=${loading||!name.trim()} style=${{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:800,cursor:"pointer",opacity:name.trim()?1:0.5}}>
      ${loading?t("loading"):t("createGroup")}
    </button>
    ${errMsg && html`<div style=${{color:P.red,fontSize:12,marginTop:8,textAlign:"center",padding:"8px",background:P.red+"11",borderRadius:8}}>${errMsg}</div>`}
  </div>`;
}

function GroupChat({group, profile, feed, following, onBack}) {
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [showSplit, setShowSplit] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [viewingMember, setViewingMember] = useState(null);
  const msgEndRef = {current:null};

  const load = async () => {
    const [msgs, mems, props] = await Promise.all([
      sb.from("group_messages").select("*, sender:sender_id(display_name,emoji,avatar_url)").eq("group_id",group.id).order("created_at"),
      sb.from("group_members").select("*, user:user_id(id,display_name,emoji,avatar_url,username)").eq("group_id",group.id),
      sb.from("gift_proposals").select("*").eq("group_id",group.id).order("created_at")
    ]);
    setMessages(msgs.data||[]); setMembers(mems.data||[]); setProposals(props.data||[]);
    setLoading(false);
  };

  useEffect(()=>{ load(); }, []);

  // Realtime subscription
  useEffect(()=>{
    const sub = sb.channel(`group_${group.id}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"group_messages",filter:`group_id=eq.${group.id}`}, payload=>{
        load();
      }).subscribe();
    return ()=>sb.removeChannel(sub);
  }, []);

  const sendMsg = async () => {
    const txt = input.trim(); if(!txt) return;
    setInput("");
    await sb.from("group_messages").insert({group_id:group.id, sender_id:profile.id, content:txt, message_type:"text"});
    load();
  };

  const vote = async (proposalId, dir) => {
    const prop = proposals.find(p=>p.id===proposalId);
    if(!prop) return;
    const up = prop.votes_up||[], down = prop.votes_down||[];
    const uid = profile.id;
    const newUp = dir==="up" ? (up.includes(uid)?up.filter(x=>x!==uid):[...up,uid]) : up.filter(x=>x!==uid);
    const newDown = dir==="down" ? (down.includes(uid)?down.filter(x=>x!==uid):[...down,uid]) : down.filter(x=>x!==uid);
    await sb.from("gift_proposals").update({votes_up:newUp,votes_down:newDown}).eq("id",proposalId);
    setProposals(p=>p.map(x=>x.id===proposalId?{...x,votes_up:newUp,votes_down:newDown}:x));
  };

  const approveProposal = async prop => {
    await sb.from("gift_proposals").update({status:"approved"}).eq("id",prop.id);
    await sb.from("group_messages").insert({group_id:group.id,sender_id:profile.id,content:`✅ "${prop.gift_name}" was approved as the group gift!`,message_type:"system",proposal_id:prop.id});
    setShowSplit(prop);
    load();
  };

  const isAdmin = group.created_by===profile.id;
  const memberCount = members.length;
  const [editingEmoji, setEditingEmoji] = useState(false);
  const GROUP_EMOJIS = ["🎁","🎂","💍","🎓","🏠","❤️","🎉","🌟","🍾","✈️","🎸","⚽","🐶","🌸","🎨","🎭","🍕","☕","🏖️","🎪"];
  const [currentEmoji, setCurrentEmoji] = useState(group.emoji||"🎁");

  const changeEmoji = async e => {
    setCurrentEmoji(e); setEditingEmoji(false);
    await sb.from("gift_groups").update({emoji:e}).eq("id",group.id);
  };

  return html`<div style=${{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
    <!-- Header -->
    <div style=${{background:P.card,borderRadius:14,padding:"12px 14px",marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
      <button onClick=${onBack} style=${{background:"none",border:"none",color:P.muted,fontSize:18,cursor:"pointer",padding:0}}>←</button>
      <div onClick=${()=>isAdmin&&setEditingEmoji(v=>!v)} style=${{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",cursor:isAdmin?"pointer":"default",position:"relative",flexShrink:0}}>
        ${Icon(emojiToIconGroup(currentEmoji),22,"#1a1a2e")}
        ${isAdmin && html`<span style=${{position:"absolute",bottom:-2,right:-2,background:P.card,borderRadius:99,padding:"1px 2px",display:"flex",alignItems:"center"}}>${Icon("pencil",8,P.gold)}</span>`}
      </div>
      <div style=${{flex:1,minWidth:0}}>
        <div style=${{fontWeight:700,fontSize:15,color:P.text}}>${group.name}</div>
        <div style=${{fontSize:11,color:P.muted}}>${memberCount} member${memberCount!==1?"s":""}${group.budget?` · €${group.budget} budget`:""}</div>
      </div>
      <button onClick=${()=>setShowProposalForm(true)} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Propose</button>
    </div>
    ${editingEmoji && html`<div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:12,marginBottom:10,display:"flex",flexWrap:"wrap",gap:6}}>
      ${GROUP_EMOJIS.map(e=>html`<button key=${e} onClick=${()=>changeEmoji(e)} style=${{background:currentEmoji===e?`${P.gold}33`:"none",border:`1px solid ${currentEmoji===e?P.gold:"transparent"}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>${Icon(emojiToIconGroup(e),20,P.text)}</button>`)}
    </div>`}

    <!-- Proposals bar -->
    ${proposals.length>0 && html`<div style=${{marginBottom:10,overflowX:"auto"}}>
      <div style=${{display:"flex",gap:8,paddingBottom:4}}>
        ${proposals.map(p=>html`
          <div key=${p.id} style=${{background:P.card,border:`2px solid ${p.status==="approved"?P.green:p.votes_up?.length>=(memberCount/2)?P.gold:P.border}`,borderRadius:12,padding:"10px 12px",minWidth:180,flexShrink:0}}>
            <div style=${{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              ${Icon("gift",18,P.gold)}
              <div style=${{fontWeight:700,fontSize:13,color:P.text,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>${p.gift_name}</div>
            </div>
            ${p.description && html`<div style=${{fontSize:11,color:P.muted,marginBottom:4}}>${p.description}</div>`}
            <div style=${{color:P.gold,fontWeight:700,fontSize:13,marginBottom:6}}>€${p.price||"?"}</div>
            ${p.status==="approved"
              ? html`<div style=${{color:P.green,fontWeight:700,fontSize:12,display:"flex",alignItems:"center",gap:4}}>${Icon("check",12,P.green)} Approved!</div>`
              : html`<div style=${{display:"flex",gap:6,alignItems:"center"}}>
                  <button onClick=${()=>vote(p.id,"up")} style=${{background:p.votes_up?.includes(profile.id)?P.gold+"33":"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:12,display:"inline-flex",alignItems:"center",gap:4}}>${Icon("thumbsUp",12,P.text)} ${p.votes_up?.length||0}</button>
                  <button onClick=${()=>vote(p.id,"down")} style=${{background:p.votes_down?.includes(profile.id)?"#ef444433":"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:12,display:"inline-flex",alignItems:"center",gap:4}}>${Icon("thumbsDown",12,P.text)} ${p.votes_down?.length||0}</button>
                  ${isAdmin && html`<button onClick=${()=>approveProposal(p)} style=${{background:P.green+"22",border:`1px solid ${P.green}44`,color:P.green,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,fontWeight:700}}>✓ Pick</button>`}
                  <button onClick=${()=>setShowSplit(p)} style=${{background:`${P.teal}22`,border:`1px solid ${P.teal}44`,color:P.teal,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,fontWeight:700}}>Split</button>
                </div>`}
          </div>`)}
      </div>
    </div>`}

    <!-- Messages -->
    <div style=${{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,paddingBottom:8}}>
      ${loading && html`<div style=${{textAlign:"center",color:P.muted,padding:20}}>Loading…</div>`}
      ${messages.map(m => {
        const isMe = m.sender_id===profile.id;
        const isSystem = m.message_type==="system";
        if(isSystem) return html`<div key=${m.id} style=${{textAlign:"center",color:P.muted,fontSize:12,padding:"4px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>${stripEmoji(m.content)} ${m.content.includes("created this group")?Icon("sparkle",12,P.muted):""}</div>`;
        const senderEmoji = isMe ? profile.emoji : m.sender?.emoji;
        const senderAvatar = isMe ? profile.avatar_url : m.sender?.avatar_url;
        const senderName = isMe ? profile.display_name : m.sender?.display_name;
        return html`<div key=${m.id} style=${{display:"flex",gap:8,alignItems:"flex-end",flexDirection:isMe?"row-reverse":"row"}}>
          <div onClick=${()=>setViewingMember(isMe?profile:{id:m.sender_id,...m.sender})} style=${{cursor:"pointer",flexShrink:0}}>
            <${Avatar} emoji=${senderEmoji} avatarUrl=${senderAvatar} size=${28}/>
          </div>
          <div style=${{maxWidth:"70%"}}>
            <div style=${{fontSize:10,color:P.muted,marginBottom:2,textAlign:isMe?"right":"left",marginLeft:isMe?0:4}}>${senderName}</div>
            <div style=${{background:isMe?`linear-gradient(135deg,${P.goldD},${P.gold})`:P.card,color:isMe?"#000":P.text,borderRadius:isMe?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"9px 13px",fontSize:14,border:isMe?"none":`1px solid ${P.border}`}}>
              ${m.content}
            </div>
            <div style=${{fontSize:9,color:P.muted,marginTop:2,textAlign:isMe?"right":"left",marginLeft:isMe?0:4}}>
              ${new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
            </div>
          </div>
        </div>`;
      })}
    </div>

    ${viewingMember && html`
      <div onClick=${()=>setViewingMember(null)} style=${{position:"fixed",inset:0,background:"#000a",zIndex:3000,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div onClick=${e=>e.stopPropagation()} style=${{background:P.card,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:480,textAlign:"center"}}>
          <${Avatar} emoji=${viewingMember.emoji} avatarUrl=${viewingMember.avatar_url} size=${64} style=${{margin:"0 auto 12px"}}/>
          <div style=${{fontWeight:800,fontSize:18,color:P.text,marginBottom:4}}>${viewingMember.display_name}</div>
          <div style=${{color:P.muted,fontSize:14,marginBottom:16}}>@${viewingMember.username}</div>
          <button onClick=${()=>setViewingMember(null)} style=${{width:"100%",background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:12,padding:"11px 0",fontWeight:700,cursor:"pointer"}}>Close</button>
        </div>
      </div>`}

    <!-- Input -->
    <div style=${{display:"flex",gap:8,paddingTop:8,borderTop:`1px solid ${P.border}`}}>
      <input value=${input} onInput=${e=>setInput(e.target.value)} onKeyDown=${e=>e.key==="Enter"&&sendMsg()} placeholder="${t("typeMessage")}" style=${{flex:1,background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"11px 14px",color:P.text,fontSize:14,outline:"none"}}/>
      <button onClick=${sendMsg} style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:12,padding:"11px 16px",fontWeight:700,cursor:"pointer",fontSize:16}}>→</button>
    </div>

    <!-- Proposal form modal -->
    ${showProposalForm && html`<${ProposalForm} group=${group} profile=${profile} members=${members} onClose=${()=>setShowProposalForm(false)} onDone=${()=>{setShowProposalForm(false);load();}}/>`}

    <!-- Split modal -->
    ${showSplit && html`<${SplitModal} proposal=${showSplit} group=${group} profile=${profile} members=${members} onClose=${()=>setShowSplit(null)} onDone=${()=>{setShowSplit(null);load();}}/>`}
  </div>`;
}

function ProposalForm({group, profile, members, onClose, onDone}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [emoji, setEmoji] = useState("🎁");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if(!name.trim()) return;
    setLoading(true);
    const {data:prop} = await sb.from("gift_proposals").insert({
      group_id:group.id, proposed_by:profile.id,
      gift_name:name, description:desc||null, price:price?parseInt(price):null,
      url:url||null, emoji
    }).select().single();
    await sb.from("group_messages").insert({
      group_id:group.id, sender_id:profile.id,
      content:`${profile.display_name} proposed: ${emoji} ${name}${price?" (€"+price+")":""}`,
      message_type:"proposal", proposal_id:prop?.id
    });
    onDone();
  };

  return html`
    <div style=${{position:"fixed",inset:0,background:"#000b",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick=${onClose}>
      <div style=${{background:P.card,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:480}} onClick=${e=>e.stopPropagation()}>
        <div style=${{fontWeight:800,fontSize:17,marginBottom:16}}>Propose a Gift 💡</div>
        <div style=${{display:"flex",gap:8,marginBottom:10}}>
          ${["🎁","🌸","🍷","📚","👟","💄","🎮","⌚","🌴","🎨","🍫","💐"].map(e=>html`
            <button key=${e} onClick=${()=>setEmoji(e)} style=${{fontSize:20,background:emoji===e?`${P.gold}33`:"none",border:`1px solid ${emoji===e?P.gold:"transparent"}`,borderRadius:8,padding:"5px 7px",cursor:"pointer"}}>${e}</button>`)}
        </div>
        <${Inp} value=${name} onChange=${setName} placeholder="Gift name" style=${{marginBottom:10}}/>
        <${Inp} value=${desc} onChange=${setDesc} placeholder="Description (optional)" style=${{marginBottom:10}}/>
        <${Inp} value=${price} onChange=${setPrice} placeholder="Price in €" type="number" style=${{marginBottom:10}}/>
        <${Inp} value=${url} onChange=${setUrl} placeholder="Link (optional)" style=${{marginBottom:16}}/>
        <button onClick=${submit} disabled=${loading||!name.trim()} style=${{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:12,padding:"13px 0",fontSize:14,fontWeight:800,cursor:"pointer"}}>
          ${loading?"Sending…":t("sendProposal")}
        </button>
      </div>
    </div>`;
}

function SplitModal({proposal, group, profile, members, onClose, onDone}) {
  const total = proposal.price || 0;
  const count = members.length||1;
  const even = Math.round(total/count);
  const [splits, setSplits] = useState(() =>
    Object.fromEntries(members.map(m=>[m.user_id, even]))
  );
  const [saved, setSaved] = useState(false);

  const totalSplit = Object.values(splits).reduce((a,b)=>a+(parseInt(b)||0),0);
  const diff = totalSplit - total;

  const saveSplit = async () => {
    await Promise.all(members.map(m =>
      sb.from("split_contributions").upsert({
        group_id:group.id, proposal_id:proposal.id,
        user_id:m.user_id, amount:parseInt(splits[m.user_id])||0,
        confirmed:m.user_id===profile.id
      }, {onConflict:"proposal_id,user_id"})
    ));
    await sb.from("group_messages").insert({
      group_id:group.id, sender_id:profile.id,
      content:`💸 Split set for "${proposal.gift_name}": ${members.map(m=>`${m.user?.display_name||"?"} pays €${splits[m.user_id]||0}`).join(", ")}`,
      message_type:"split"
    });
    setSaved(true);
    setTimeout(onDone, 1200);
  };

  return html`
    <div style=${{position:"fixed",inset:0,background:"#000b",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick=${onClose}>
      <div style=${{background:P.card,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:480,maxHeight:"80vh",overflowY:"auto"}} onClick=${e=>e.stopPropagation()}>
        <div style=${{fontWeight:800,fontSize:17,marginBottom:4}}>Split the Cost 💸</div>
        <div style=${{color:P.muted,fontSize:13,marginBottom:16,display:"flex",alignItems:"center",gap:6}}>${Icon("gift",14,P.muted)} ${proposal.gift_name} · Total: €${total}</div>

        <div style=${{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:11,color:P.muted,fontWeight:700}}>
          <span>MEMBER</span><span>AMOUNT (€)</span>
        </div>
        ${members.map(m=>html`
          <div key=${m.user_id} style=${{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <${Avatar} emoji=${m.user?.emoji} avatarUrl=${m.user?.avatar_url} size=${32}/>
            <div style=${{flex:1,fontWeight:600,fontSize:14,color:P.text}}>${m.user?.display_name||"?"}${m.user_id===profile.id?" (you)":""}</div>
            <input type="number" value=${splits[m.user_id]||0} onInput=${e=>setSplits(s=>({...s,[m.user_id]:e.target.value}))}
              style=${{width:72,background:P.bg,border:`1px solid ${P.border}`,borderRadius:8,padding:"8px",color:P.text,fontSize:14,textAlign:"right",outline:"none"}}/>
          </div>`)}

        <div style=${{background:diff===0?`${P.green}22`:`${P.red}22`,border:`1px solid ${diff===0?P.green:P.red}44`,borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style=${{color:P.muted,fontSize:13}}>Total split</span>
          <span style=${{fontWeight:700,color:diff===0?P.green:P.red}}>€${totalSplit} ${diff===0?"✓":diff>0?`(+€${diff} over)`:`(-€${Math.abs(diff)} under)`}</span>
        </div>

        <div style=${{background:P.bg,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:12,color:P.muted}}>
          💡 Quick splits:
          <div style=${{display:"flex",gap:8,marginTop:8}}>
            <button onClick=${()=>setSplits(Object.fromEntries(members.map(m=>[m.user_id,even])))} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",fontWeight:700}}>${t("splitEvenly")} (€${even} each)</button>
          </div>
        </div>

        ${saved
          ? html`<div style=${{textAlign:"center",color:P.green,fontWeight:700,fontSize:15}}>✅ Split saved!</div>`
          : html`<button onClick=${saveSplit} style=${{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:12,padding:"13px 0",fontSize:14,fontWeight:800,cursor:"pointer"}}>Confirm Split 💸</button>`}
      </div>
    </div>`;
}

// ── STARS TAB ──
function StarsTab({profile, setProfile}) {
  const stars = profile.stars||0;
  const tier = getTier(stars);
  const nextTierIdx = TIER_RANGES.findIndex(r => r.min > stars);
  const nextTier = nextTierIdx >= 0 ? getTier(TIER_RANGES[nextTierIdx].min) : null;
  const progress = nextTier ? Math.round(((stars - tier.min) / (nextTier.min - tier.min)) * 100) : 100;
  const REWARDS = [
    {id:1,title:t("reward1Title"),cost:200,svgIcon:"box",desc:t("reward1Desc")},
    {id:2,title:t("reward2Title"),cost:300,svgIcon:"star",desc:t("reward2Desc")},
    {id:3,title:t("reward3Title"),cost:400,svgIcon:"map",desc:t("reward3Desc")},
    {id:4,title:t("reward4Title"),cost:500,svgIcon:"sparkle",desc:t("reward4Desc")}
  ];
  const [toast,setToast] = useState(null);

  const redeem = async r => {
    if(stars<r.cost) return;
    const ns = stars-r.cost;
    await sb.from("profiles").update({stars:ns}).eq("id",profile.id);
    setProfile(p => ({...p, stars:ns}));
    setToast(`🎁 "${r.title}" redeemed!`);
  };

  const share = async via => {
    const url = "https://giftmate-sigma.vercel.app";
    const msg = `🎁 Check out Giftmate — the social gifting app! ${url}`;
    if(via==="wa") window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,"_blank");
    else await navigator.clipboard.writeText(url);
    const ns = stars+10;
    await sb.from("profiles").update({stars:ns}).eq("id",profile.id);
    setProfile(p => ({...p, stars:ns}));
    setToast(via==="wa"?"💬 Shared! +10⭐":"📋 Copied! +10⭐");
  };

  return html`<div>
    <div style=${{background:`linear-gradient(135deg,${tier.color}22,${P.goldD}22)`,border:`1px solid ${tier.color}44`,borderRadius:20,padding:24,marginBottom:16,textAlign:"center"}}>
      <div style=${{marginBottom:4}}>${Icon(tier.svgIcon, 42, tier.color)}</div>
      <div style=${{color:tier.color,fontWeight:800,fontSize:16,marginBottom:2}}>${tier.name}</div>
      <div style=${{color:P.muted,fontSize:12,marginBottom:10,fontStyle:"italic"}}>"${tier.desc}"</div>
      <div style=${{fontFamily:"Georgia,serif",fontSize:48,fontWeight:900,color:P.goldL,lineHeight:1}}>${stars.toLocaleString()}</div>
      <div style=${{color:P.muted,fontSize:13,marginBottom:12}}>${t("starsEarned")}</div>
      ${nextTier && html`<div>
        <div style=${{display:"flex",justifyContent:"space-between",fontSize:11,color:P.muted,marginBottom:5}}>
          <span>${tier.name}</span><span>${nextTier.min - stars} to ${nextTier.name} ${Icon("star",12,P.gold)}</span>
        </div>
        <div style=${{background:P.border,borderRadius:99,height:6,overflow:"hidden"}}>
          <div style=${{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${P.goldD},${tier.color})`,width:`${progress}%`,transition:"width 1s ease"}}/>
        </div>
      </div>`}
      ${!nextTier && html`<div style=${{color:P.gold,fontWeight:700,fontSize:13}}>${t("maxTier")}</div>`}
    </div>
    <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:18,marginBottom:14}}>
      <div style=${{fontWeight:700,fontSize:15,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>${Icon("star",14,P.gold)} ${stripEmoji(t("howToEarn"))}</div>
      ${[[Icon("groups",18,P.gold),t("earnFollow"),"+15"],[Icon("calendar",18,P.gold),t("earnOccasion"),"+10"],[Icon("share",18,P.gold),t("earnShare"),"+10"],[Icon("groups",18,P.gold),t("earnRefer"),"+80"]].map(([icon,label,pts]) => html`
        <div key=${label} style=${{display:"flex",alignItems:"center",gap:10,marginBottom:8,background:P.bg,borderRadius:10,padding:"10px 12px"}}>
          ${icon}
          <div style=${{flex:1,fontSize:13,color:P.muted}}>${label}</div>
          <div style=${{color:P.gold,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:4}}>${pts} ${Icon("star",14,P.gold)}</div>
        </div>`)}
      <div style=${{display:"flex",gap:8,marginTop:12}}>
        <button onClick=${()=>share("wa")} style=${{flex:1,background:"#25D366",color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>${Icon("chat",16,"#fff")} ${stripEmoji(t("shareWhatsapp"))}</button>
        <button onClick=${()=>share("copy")} style=${{flex:1,background:P.card,border:`1px solid ${P.border}`,color:P.text,borderRadius:10,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>${Icon("copy",16,P.text)} ${stripEmoji(t("copyLink"))}</button>
      </div>
    </div>
    <div style=${{fontWeight:700,fontSize:15,marginBottom:12,display:"flex",alignItems:"center",gap:6}}>${Icon("gift",14,P.gold)} ${stripEmoji(t("redeemStars"))}</div>
    <div style=${{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      ${REWARDS.map(r => { const can = stars>=r.cost; return html`
        <div key=${r.id} style=${{background:P.card,border:`1px solid ${can?P.gold+"44":P.border}`,borderRadius:14,padding:14}}>
          <div style=${{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}>${Icon(r.svgIcon, 24, P.gold)}</div>
          <div style=${{fontWeight:700,fontSize:13,color:P.text,marginBottom:2}}>${r.title}</div>
          <div style=${{fontSize:11,color:P.muted,marginBottom:10}}>${r.desc}</div>
          <button onClick=${()=>redeem(r)} disabled=${!can} style=${{width:"100%",background:can?`linear-gradient(135deg,${P.goldD},${P.gold})`:P.border,color:can?"#000":P.muted,border:"none",borderRadius:8,padding:"7px 0",fontSize:11,fontWeight:700,cursor:can?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
            ${can?html`${r.cost} ${Icon("star",12,"#000")} ${stripEmoji(t("redeemLabel"))}`:html`${r.cost-stars} ${t("needMore")}`}
          </button>
        </div>`; })}
    </div>
    ${toast && html`<${Toast} msg=${toast} onDone=${()=>setToast(null)}/>`}
  </div>`;
}

// ── CONCIERGE TAB ──
function renderBold(text) {
  // Collapse multiple blank lines into one, trim leading/trailing
  const cleaned = text.replace(/\n{3,}/g, '\n\n').trim();
  return cleaned.split('\n').map((line, li, arr) => {
    const parts = line.split(/\*\*(.+?)\*\*/g);
    const rendered = parts.map((p,i) => i%2===1 ? html`<strong key=${i}>${p}</strong>` : p);
    return html`<span key=${li}>${rendered}${li < arr.length-1 ? html`<br/>` : ''}</span>`;
  });
}

function GiftCards({gifts, city}) {
  const c = city||"Madrid";
  return html`<div style=${{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
    ${gifts.map((g,i) => html`
      <div key=${i} style=${{background:P.bg,border:`1px solid ${P.border}`,borderRadius:14,padding:"12px 14px",display:"flex",gap:12,alignItems:"center"}}>
        <div style=${{position:"relative",width:56,height:56,flexShrink:0}}>
          ${g.image_url ? html`<img src=${g.image_url} alt="" style=${{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",borderRadius:10,zIndex:1}} onError=${e=>{e.target.style.display="none";}}/>` : null}
          <div style=${{position:"absolute",inset:0,background:`${P.gold}22`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}>${Icon("gift",28,P.gold)}</div>
        </div>
        <div style=${{flex:1,minWidth:0}}>
          <div style=${{fontWeight:700,fontSize:13,color:P.text}}>${g.name}</div>
          <div style=${{fontSize:12,color:P.muted,marginTop:2}}>${g.description}</div>
          <div style=${{color:P.gold,fontWeight:700,fontSize:13,marginTop:3}}>~€${g.price}</div>
        </div>
        <${SmartBuyButton} name=${g.name} city=${c}/>
      </div>`)}
  </div>`;
}

function ConciergeTab({profile}) {
  const city = profile.city||"Madrid";
  const name = profile.display_name||profile.username||"there";
  const lang = _lang;
  const langNames = {en:"English",es:"Spanish",fr:"French",de:"German",it:"Italian",pt:"Portuguese"};
  const SYSTEM = `You are Giftmate, the wittiest, most thoughtful AI gift concierge in the world. The user is ${name}, based in ${city}, with interests: ${(profile.interests||[]).join(", ")||"various things"}.

IMPORTANT: You MUST respond entirely in ${langNames[lang]||"English"}. Every word of your response must be in ${langNames[lang]||"English"}.

Your personality: clever, warm, occasionally cheeky, like a best friend who happens to know every cool spot in the city and gives the most thoughtful gifts. You make people feel excited about gifting. Use playful humour, unexpected observations, and the odd perfectly-placed emoji. Never be boring or generic.

CRITICAL RULES:
1. ALWAYS include <gifts> with 5 recommendations when the user has given ANY info. Even a little info = recommend immediately.
2. NEVER ask more than one follow-up question after recommending.
3. Each bullet point on its own line with a line break between them.

FLOW:
- Opening: Be charming. Ask who and what occasion, then on separate lines:

• What's their vibe? (romantic, chaos gremlin, sophisticated, adventurous...)

• Budget ballpark?

• Experience to live, or something to unwrap?

• Any obsessions or things that make them deeply them?

- After ANY reply with info: give 5 gifts + one witty follow-up question.
- After EVERY follow-up: ALWAYS give 5 fresh gifts + another follow-up. Never stop.

Format — one punchy sentence first, then:
<gifts>[{"name":"...","description":"under 10 words","price":25,"emoji":"🎁","reason":"...","image_url":"optional image URL"}]</gifts>

PRICES MUST BE REALISTIC — anchor to actual market prices:
- Physical products: check what they actually cost on Amazon (books €10-20, gadgets €20-80, clothing €30-60)
- Experiences (GetYourGuide/Viator): cooking classes €40-70, flamenco shows €25-45, day tours €30-80, escape rooms €20-30
- Hotels/weekend breaks: budget €60-120/night, mid-range €120-200/night
- If the user gives a budget, spread all 5 gifts within ±20% of that budget
- Never invent inflated prices — if unsure, go lower rather than higher

Mix: experiences, physical gifts, personalised, hotels, nightlife/events. BUT if the user is clearly talking about nightlife/clubs/going out, give ALL 5 as nightlife options — real specific venues, club nights, bar crawls, cocktail spots in ${city} by name. If they're talking about romantic experiences, go all-in on experiences. Match the energy of what they're asking for. No ** asterisks.`;
  const opening = stripEmoji(t("conciergeOpening")).replace("{name}", name);
  const [messages, setMessages] = useState([{role:"assistant", content:opening}]);
  const [rawMessages, setRawMessages] = useState([{role:"assistant", content:opening}]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  const QUICK = [t("quickChip1"), t("quickChip2"), t("quickChip3"), t("quickChip4").replace("✈️", `${city} ✈️`)];

  const parseReply = raw => {
    const match = raw.match(/<gifts>([\s\S]*?)<\/gifts>/);
    let gifts = null;
    let text = raw.replace(/<gifts>[\s\S]*?<\/gifts>/g,"").trim();
    if(match) { try { gifts = JSON.parse(match[1]); } catch(e){} }
    return {text, gifts};
  };

  const send = async text => {
    const msg = text || input.trim();
    if(!msg || loading) return;
    setInput("");
    const newRaw = [...rawMessages, {role:"user", content:msg}];
    setRawMessages(newRaw);
    setMessages(p => [...p, {role:"user", content:msg}]);
    setLoading(true);
    track("concierge_query", {query_text: msg.slice(0,200), session_id: SESSION_ID, message_count: newRaw.length});
    try {
      const data = await callChatApi({
        model:MODEL, max_tokens:700, system:SYSTEM,
        messages: newRaw
      });
      const raw = data.content?.[0]?.text || "";
      const {text:t, gifts} = parseReply(raw);
      setRawMessages(p => [...p, {role:"assistant", content:raw}]);
      setMessages(p => [...p, {role:"assistant", content:t, gifts}]);
      if(gifts?.length) track("concierge_gifts_shown", {gifts: gifts.map(g=>({name:g.name, price:g.price})), session_id: SESSION_ID});
    } catch(e) {
      captureError("concierge_send", e, {messageCount: newRaw.length});
      setMessages(p => [...p, {role:"assistant", content:t("conciergeError")}]);
    }
    setLoading(false);
  };

  return html`<div style=${{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
    <div style=${{marginBottom:10}}>
      <div style=${{fontWeight:800,fontSize:18,color:P.text,marginBottom:2,display:"flex",alignItems:"center",gap:8}}>${Icon("chat",20,P.text)} ${stripEmoji(t("aiConcierge"))}</div>
      <div style=${{color:P.muted,fontSize:13}}>${t("yourCompanion")}</div>
    </div>
    <div style=${{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,paddingBottom:12}}>
      ${messages.map((m,i) => html`
        <div key=${i} style=${{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8,alignItems:"flex-end"}}>
          ${m.role==="assistant" && html`<div style=${{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>${Icon("gift",14,"#0A0A18")}</div>`}
          <div style=${{maxWidth:"82%"}}>
            ${m.role==="assistant" ? html`
              <div style=${{background:P.card,color:P.text,borderRadius:"18px 18px 18px 4px",padding:"11px 15px",fontSize:14,lineHeight:1.6,border:`1px solid ${P.border}`}}>
                ${m.content && renderBold(m.content)}
              </div>
              ${m.gifts && html`<${GiftCards} gifts=${m.gifts} city=${city}/>`}
            ` : html`
              <div style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",borderRadius:"18px 18px 4px 18px",padding:"11px 15px",fontSize:14,lineHeight:1.5,fontWeight:600}}>
                ${m.content}
              </div>`}
          </div>
        </div>`)}
      ${loading && html`<div style=${{display:"flex",gap:8,alignItems:"flex-end"}}>
        <div style=${{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center"}}>${Icon("gift",14,"#0A0A18")}</div>
        <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:"18px 18px 18px 4px",padding:"11px 15px",color:P.muted,fontSize:14}}>${t("findingGifts")}</div>
      </div>`}
      <div ref=${bottomRef}/>
    </div>
    <div style=${{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
      ${QUICK.map(q => html`<button key=${q} onClick=${()=>send(q)} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:99,padding:"6px 12px",fontSize:11,color:P.muted,cursor:"pointer",fontWeight:600,display:"inline-flex",alignItems:"center",gap:4}}>${Icon("gift",12,P.muted)} ${stripEmoji(q)}</button>`)}
    </div>
    <div style=${{display:"flex",gap:8}}>
      <textarea value=${input} onInput=${e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}} onKeyDown=${e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder=${t("conciergeInput")} rows="1" style=${{flex:1,background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"8px 12px",color:P.text,fontSize:14,resize:"none",outline:"none",lineHeight:1.4,maxHeight:"120px",overflowY:"auto"}}/>
      <button onClick=${()=>send()} disabled=${loading} style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",borderRadius:12,padding:"12px 16px",color:"#000",fontWeight:700,fontSize:18,cursor:"pointer",flexShrink:0}}>→</button>
    </div>
  </div>`;
}

// ── MAIN APP ──
function MainApp({session, profile, setProfile, onLangChange, onThemeChange}) {
  const [tab,setTab] = useState("home");
  const [viewingFriend,setViewingFriend] = useState(null);
  const [feed,setFeed] = useState([]);
  const [feedLoading,setFeedLoading] = useState(true);
  const [following,setFollowing] = useState([]);
  const [pendingRequests,setPendingRequests] = useState([]); // ids we've requested to follow
  const [searchQ,setSearchQ] = useState("");
  const [searchResults,setSearchResults] = useState([]);
  const [toast,setToast] = useState(null);
  const [unreadCount,setUnreadCount] = useState(0);
  const [groupUnread,setGroupUnread] = useState(0);

  // Load unread inbox count
  const loadUnread = async () => {
    const {count} = await sb.from("gift_messages").select("id",{count:"exact",head:true}).eq("receiver_id",profile.id).eq("status","sent");
    setUnreadCount(count||0);
  };

  // Load group unread — counts # of GROUPS with new messages (not total messages)
  const loadGroupUnread = async () => {
    const {data:memberOf} = await sb.from("group_members").select("group_id").eq("user_id", profile.id);
    const ids = (memberOf||[]).map(m=>m.group_id);
    if(!ids.length) { setGroupUnread(0); return; }
    let groupsWithUnread = 0;
    for(const gid of ids) {
      const lastRead = (() => { try { return localStorage.getItem(`gm_lastread_${gid}`) || "1970-01-01"; } catch(e) { return "1970-01-01"; } })();
      const {count} = await sb.from("group_messages").select("id",{count:"exact",head:true})
        .eq("group_id",gid).gt("created_at",lastRead).neq("sender_id",profile.id).neq("message_type","system");
      if((count||0) > 0) groupsWithUnread++;
    }
    setGroupUnread(groupsWithUnread);
  };

  // Request push notification permission
  const requestNotifications = async () => {
    if(!("Notification" in window)) return;
    if(Notification.permission==="default") {
      const perm = await Notification.requestPermission();
      if(perm==="granted") setToast("🔔 Notifications enabled!");
    }
  };

  // Set global userId for analytics as soon as MainApp mounts
  useEffect(() => {
    _currentUserId = profile.id;
    track("session_start", {city: profile.city, interests: profile.interests});
    sb.from("profiles").update({last_active: new Date().toISOString()}).eq("id", profile.id).then(()=>{});
    loadUnread();
    loadGroupUnread();
    // Ask for notification permission after a short delay (less intrusive)
    setTimeout(requestNotifications, 3000);
    // Realtime: listen for new gift messages
    const channel = sb.channel("inbox-"+profile.id)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"gift_messages",filter:`receiver_id=eq.${profile.id}`}, payload => {
        setUnreadCount(c => c+1);
        const title = "🎁 You received a gift!";
        const body = payload.new.gift_name || "Someone sent you a gift";
        if("serviceWorker" in navigator) {
          navigator.serviceWorker.ready.then(reg => {
            reg.showNotification(title, {body, icon:"/icon-192.png", badge:"/icon-192.png", vibrate:[100,50,100]});
          }).catch(()=>{});
        } else if(Notification.permission==="granted") {
          new Notification(title, {body, icon:"/icon-192.png"});
        }
      }).subscribe();
    // Realtime: listen for new group messages to update tab badge
    const groupChannel = sb.channel("group-inbox-"+profile.id)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"group_messages"}, payload => {
        if(payload.new.sender_id !== profile.id && payload.new.message_type !== "system") {
          loadGroupUnread();
          if("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then(reg => {
              reg.showNotification("👥 New group message", {body: payload.new.content||"New message in your group", icon:"/icon-192.png", badge:"/icon-192.png", vibrate:[100,50,100]});
            }).catch(()=>{});
          }
        }
      }).subscribe();
    // Realtime: listen for group membership (added to a group)
    const memberChannel = sb.channel("member-"+profile.id)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"group_members",filter:`user_id=eq.${profile.id}`}, payload => {
        loadGroupUnread();
        if("serviceWorker" in navigator) {
          navigator.serviceWorker.ready.then(reg => {
            reg.showNotification("👥 You've been added to a group!", {body:"Open Giftmate to see the group", icon:"/icon-192.png", badge:"/icon-192.png", vibrate:[200,100,200]});
          }).catch(()=>{});
        }
      }).subscribe();
    // Realtime: listen for follow requests (someone wants to follow you)
    const reqChannel = sb.channel("follow-req-"+profile.id)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"follow_requests",filter:`target_id=eq.${profile.id}`}, payload => {
        setUnreadCount(c => c+1); // reuse profile badge for follow requests too
        if("serviceWorker" in navigator) {
          navigator.serviceWorker.ready.then(reg => {
            reg.showNotification("👤 New follow request!", {body:"Someone wants to follow you on Giftmate", icon:"/icon-192.png", badge:"/icon-192.png", vibrate:[100,50,100]});
          }).catch(()=>{});
        }
      }).subscribe();
    // Realtime: listen for follow request status changes (your request was accepted/rejected)
    const reqAcceptChannel = sb.channel("req-accept-"+profile.id)
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"follow_requests",filter:`requester_id=eq.${profile.id}`}, payload => {
        if(payload.new.status==="accepted") {
          setPendingRequests(p=>p.filter(id=>id!==payload.new.target_id));
          setFollowing(f=>[...f, payload.new.target_id]);
          setToast("✅ Follow request accepted!");
          loadFeed();
          loadFollowing(); // refresh full following list from DB
        } else if(payload.new.status==="rejected") {
          setPendingRequests(p=>p.filter(id=>id!==payload.new.target_id));
          setToast("Follow request was declined");
        }
      }).subscribe();
    return () => { track("session_end", {}); sb.removeChannel(channel); sb.removeChannel(groupChannel); sb.removeChannel(memberChannel); sb.removeChannel(reqChannel); sb.removeChannel(reqAcceptChannel); };
  }, []);

  const goTab = t => { trackTabView(t); setTab(t); if(t==="profile") loadUnread(); if(t==="groups") setGroupUnread(0); else loadGroupUnread(); };

  const loadFollowing = async () => {
    const [{data:followData}, {data:reqs}, {data:acceptedReqs}] = await Promise.all([
      sb.from("follows").select("following_id").eq("follower_id",profile.id),
      sb.from("follow_requests").select("target_id").eq("requester_id",profile.id).eq("status","pending"),
      sb.from("follow_requests").select("target_id").eq("requester_id",profile.id).eq("status","accepted")
    ]);
    // Accepted requests mean we're now following — add to following list if not already there
    const followIds = (followData||[]).map(f=>f.following_id);
    const acceptedIds = (acceptedReqs||[]).map(r=>r.target_id).filter(id=>!followIds.includes(id));
    setFollowing([...followIds, ...acceptedIds]);
    setPendingRequests((reqs||[]).map(r=>r.target_id));
  };

  const loadFeed = async () => {
    setFeedLoading(true);
    const {data:fData} = await sb.from("follows").select("following_id").eq("follower_id",profile.id);
    const ids = (fData||[]).map(f=>f.following_id);
    if(!ids.length) { setFeed([]); setFeedLoading(false); return; }
    const [{data:profiles},{data:occasions}] = await Promise.all([
      sb.from("profiles").select("*").in("id",ids),
      sb.from("occasions").select("*").in("user_id",ids).eq("is_public",true)
    ]);
    const items = (profiles||[]).map(p => ({
      profile:p,
      occasions:(occasions||[]).filter(o=>o.user_id===p.id).sort((a,b)=>daysUntil(a.date)-daysUntil(b.date))
    })).sort((a,b) => {
      const aDays = Math.min(
        a.occasions[0]?daysUntil(a.occasions[0].date):999,
        a.profile.birthday?daysUntil(a.profile.birthday):999
      );
      const bDays = Math.min(
        b.occasions[0]?daysUntil(b.occasions[0].date):999,
        b.profile.birthday?daysUntil(b.profile.birthday):999
      );
      return aDays - bDays;
    });
    setFeed(items); setFeedLoading(false);
  };

  useEffect(() => { loadFollowing(); loadFeed(); }, []);

  useEffect(() => {
    if(!searchQ.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      const {data} = await sb.from("profiles").select("*").ilike("username",`%${searchQ}%`).neq("id",profile.id).limit(20);
      setSearchResults(data||[]);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQ]);

  const toggleFollow = async (targetId, targetProfile) => {
    const isF = following.includes(targetId);
    const isPending = pendingRequests.includes(targetId);
    if(isF) {
      await sb.from("follows").delete().eq("follower_id",profile.id).eq("following_id",targetId);
      setFollowing(f => f.filter(id=>id!==targetId));
      setToast("Unfollowed");
      track("unfollow", {target_id: targetId});
    } else if(isPending) {
      await sb.from("follow_requests").delete().eq("requester_id",profile.id).eq("target_id",targetId);
      setPendingRequests(p => p.filter(id=>id!==targetId));
      setToast("Follow request cancelled");
    } else if(targetProfile?.is_private) {
      // Send follow request (delete first to avoid duplicate, then insert)
      await sb.from("follow_requests").delete().eq("requester_id",profile.id).eq("target_id",targetId);
      const {error} = await sb.from("follow_requests").insert({requester_id:profile.id, target_id:targetId, status:"pending"});
      if(error) { setToast("Error: "+error.message); return; }
      setPendingRequests(p => [...p, targetId]);
      setToast("Follow request sent 📨");
    } else {
      const {error} = await sb.from("follows").insert({follower_id:profile.id, following_id:targetId});
      if(error) { setToast("Error: "+error.message); return; }
      setFollowing(f => [...f,targetId]);
      setToast("Following! 🎉 +15⭐");
      const ns = (profile.stars||0)+15;
      await sb.from("profiles").update({stars:ns}).eq("id",profile.id);
      setProfile(p => ({...p, stars:ns}));
      track("follow", {target_id: targetId});
    }
    loadFeed();
  };

  const viewFriend = p => { setViewingFriend(p); setTab("friend"); track("friend_view", {friend_id: p.id, friend_name: p.display_name}); };
  const TABS = [
    {id:"home",svgIcon:"home",label:t("home")},
    {id:"search",svgIcon:"search",label:t("search")},
    {id:"groups",svgIcon:"groups",label:t("groups")},
    {id:"concierge",svgIcon:"chat",label:t("concierge")},
    {id:"profile",svgIcon:"profile",label:t("profile")},
    {id:"stars",svgIcon:"star",label:t("stars")}
  ];

  return html`
    <div style=${{background:P.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:74}}>
      <div style=${{background:P.card,borderBottom:`1px solid ${P.border}`,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style=${{display:"flex",alignItems:"center",gap:8}}>
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#F4A438"/><text x="22" y="20" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="900" font-size="11" fill="#0A0A18" letter-spacing="0.5">gift</text><text x="22" y="32" text-anchor="middle" font-family="Arial Black,Impact,sans-serif" font-weight="900" font-size="13.5" fill="#0A0A18" letter-spacing="0.8">MATE</text></svg>
          <div style=${{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:P.text}}>gift<span style=${{color:P.gold}}>mate</span></div>
        </div>
        <div style=${{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style=${{fontSize:13,color:P.gold,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>${Icon("star",14,P.gold)} ${profile.stars||0}</div>
          <${Avatar} emoji=${profile.emoji} avatarUrl=${profile.avatar_url} size=${32} style=${{flexShrink:0}}/>
        </div>
      </div>

      <div style=${{padding:"16px 16px 0"}}>
        ${tab==="home" && (feedLoading
          ? html`<div style=${{textAlign:"center",padding:40,color:P.muted,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>${Icon("gift",20,P.muted)} Loading feed…</div>`
          : feed.length===0
            ? html`<div style=${{textAlign:"center",padding:40}}>
                <div style=${{marginBottom:12}}>${Icon("groups",52,P.gold)}</div>
                <div style=${{fontWeight:700,fontSize:18,color:P.text,marginBottom:8}}>${t("findFriends")}</div>
                <div style=${{color:P.muted,fontSize:14,lineHeight:1.5,marginBottom:18}}>${t("searchFriendsHint")}</div>
                <button onClick=${()=>goTab("search")} style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",border:"none",borderRadius:12,padding:"12px 28px",fontWeight:700,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>${Icon("search",18,"#000")} ${t("search")}</button>
              </div>`
            : html`<div>
                <div style=${{fontWeight:700,fontSize:18,color:P.text,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>${Icon("gift",20,P.text)} ${stripEmoji(t("upcomingOccasions"))}</div>
                ${feed.map(({profile:fr,occasions:occs}) => html`
                  <div key=${fr.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:16,marginBottom:12}}>
                    <div style=${{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                      <${Avatar} emoji=${fr.emoji} avatarUrl=${fr.avatar_url} size=${44}/>
                      <div style=${{flex:1}}>
                        <div style=${{fontWeight:700,fontSize:15,color:P.text}}>${fr.display_name}</div>
                        <div style=${{fontSize:13,color:P.muted}}>@${fr.username}</div>
                      </div>
                      <button onClick=${()=>viewFriend(fr)} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>${t("viewProfile")} →</button>
                    </div>
                    ${fr.birthday && html`<div style=${{background:P.bg,borderRadius:10,padding:"9px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style=${{display:"flex",alignItems:"center",gap:8}}>
                        <div style=${{width:24,height:24,borderRadius:6,background:`${P.gold}22`,display:"flex",alignItems:"center",justifyContent:"center"}}>${Icon("gift",12,P.gold)}</div>
                        <div><div style=${{fontSize:13,fontWeight:600,color:P.text}}>${stripEmoji(t("birthdayLabel"))}</div><div style=${{fontSize:12,color:P.muted}}>${fmtDate(fr.birthday)}</div></div>
                      </div>
                      <div style=${{fontSize:12,fontWeight:700,color:daysUntil(fr.birthday)<=30?P.gold:P.muted}}>${daysUntil(fr.birthday)}d</div>
                    </div>`}
                    ${occs.slice(0,2).map(o => { const d=daysUntil(o.date); return html`
                      <div key=${o.id} style=${{background:P.bg,borderRadius:10,padding:"9px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div style=${{display:"flex",alignItems:"center",gap:8}}>
                          <div style=${{width:24,height:24,borderRadius:6,background:`${P.gold}22`,display:"flex",alignItems:"center",justifyContent:"center"}}>${Icon("gift",12,P.gold)}</div>
                          <div><div style=${{fontSize:13,fontWeight:600,color:P.text}}>${translateOccasion(o.type)}</div><div style=${{fontSize:12,color:P.muted}}>${fmtDate(o.date)}</div></div>
                        </div>
                        <div style=${{fontSize:12,fontWeight:700,color:d<=7?P.red:d<=30?P.gold:P.muted}}>${d===0?t("todayLabel"):d===1?t("tomorrowLabel"):`${d}${t("daysLabel")}`}</div>
                      </div>`; })}
                  </div>`)}
              </div>`)}

        ${tab==="search" && html`<div>
          <div style=${{fontWeight:700,fontSize:18,color:P.text,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>${Icon("search",20,P.text)} ${t("search")}</div>
          <input value=${searchQ} onInput=${e=>setSearchQ(e.target.value)} placeholder="${t("searchPlaceholder")}" style=${{width:"100%",background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"13px 16px",color:P.text,fontSize:14,marginBottom:14,boxSizing:"border-box",outline:"none"}}/>
          ${searchResults.map(u => html`
            <div key=${u.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
              <${Avatar} emoji=${u.emoji} avatarUrl=${u.avatar_url} size=${46}/>
              <div style=${{flex:1}}>
                <div style=${{fontWeight:700,color:P.text,display:"flex",alignItems:"center",gap:4}}>${u.display_name} ${u.is_private?Icon("lock",12,P.text):""}</div>
                <div style=${{fontSize:13,color:P.muted}}>@${u.username}</div>
                ${u.interests?.length>0 && html`<div style=${{fontSize:11,color:P.muted,marginTop:2}}>${u.interests.slice(0,3).join(" · ")}</div>`}
              </div>
              <div style=${{display:"flex",flexDirection:"column",gap:6}}>
                <button onClick=${()=>viewFriend(u)} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>${t("viewProfile")}</button>
                <button onClick=${()=>toggleFollow(u.id,u)} style=${{
                  background: following.includes(u.id) ? P.border : pendingRequests.includes(u.id) ? `${P.gold}22` : `linear-gradient(135deg,${P.goldD},${P.gold})`,
                  border: pendingRequests.includes(u.id) ? `1px solid ${P.gold}88` : "none",
                  color: following.includes(u.id) ? P.muted : pendingRequests.includes(u.id) ? P.goldL : "#000",
                  borderRadius:8, padding:"5px 10px", fontSize:11, fontWeight:700, cursor:"pointer"
                }}>
                  ${following.includes(u.id) ? t("following") : pendingRequests.includes(u.id) ? "Requested ⏳" : u.is_private ? "Request 🔒" : t("follow")}
                </button>
              </div>
            </div>`)}
          ${searchQ && searchResults.length===0 && html`<div style=${{textAlign:"center",color:P.muted,padding:20}}>${t("noResults")}</div>`}
        </div>`}

        ${tab==="friend" && viewingFriend && html`<${FriendProfile} friend=${viewingFriend} myProfile=${profile} following=${following} pendingRequests=${pendingRequests} onToggleFollow=${toggleFollow} onBack=${()=>setTab("home")}/>`}
        ${tab==="groups" && html`<${GroupsTab} profile=${profile} following=${following} feed=${feed} onGroupUnreadChange=${setGroupUnread}/>`}
        ${tab==="concierge" && html`<${ConciergeTab} profile=${profile}/>`}
        ${tab==="profile" && html`<${MyProfile} profile=${profile} setProfile=${setProfile} friendsOccasions=${feed.flatMap(f=>f.occasions)} onLangChange=${onLangChange} onThemeChange=${onThemeChange} following=${following} onToggleFollow=${toggleFollow}/>`}
        ${tab==="stars" && html`<${StarsTab} profile=${profile} setProfile=${setProfile}/>`}
      </div>

      <div style=${{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:P.card,borderTop:`1px solid ${P.border}`,display:"flex",zIndex:100}}>
        ${TABS.map(tb => html`
          <button key=${tb.id} onClick=${()=>goTab(tb.id)} style=${{flex:1,padding:"8px 0",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1,position:"relative"}}>
            ${Icon(tb.svgIcon, 20, tab===tb.id ? P.gold : P.muted)}
            ${tb.id==="profile" && unreadCount>0 && html`<span style=${{position:"absolute",top:4,right:"18%",background:P.red,color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",lineHeight:1}}>${unreadCount>9?"9+":unreadCount}</span>`}
            ${tb.id==="groups" && groupUnread>0 && html`<span style=${{position:"absolute",top:4,right:"18%",background:P.red,color:"#fff",borderRadius:99,fontSize:9,fontWeight:800,minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",lineHeight:1}}>${groupUnread>9?"9+":groupUnread}</span>`}
            <span style=${{fontSize:9,color:tab===tb.id?P.gold:P.muted,fontWeight:tab===tb.id?700:400}}>${tb.label}</span>
          </button>`)}
      </div>
      ${toast && html`<${Toast} msg=${toast} onDone=${()=>setToast(null)}/>`}
    </div>`;
}

// ── ROOT ──
function Giftmate() {
  const [session,setSession] = useState(null);
  const [profile,setProfile] = useState(null);
  const [loading,setLoading] = useState(true);
  const [recoveryMode,setRecoveryMode] = useState(isRecoveryFlow() || hasRecoveryError());
  const [recoveryInvalid,setRecoveryInvalid] = useState(hasRecoveryError());
  const [lang,setLangState] = useState("en");
  const [theme,setThemeState] = useState("midnight");

  const changeLang = code => { setLang(code); setLangState(code); };
  const changeTheme = key => { setThemeKey(key); setThemeState(key); };

  const loadProfile = async uid => {
    const {data} = await sb.from("profiles").select("*").eq("id",uid).single();
    if(data?.language) changeLang(data.language);
    else { const b = navigator.language?.slice(0,2)||"en"; changeLang(TRANSLATIONS[b]?b:"en"); }
    if(data?.theme && THEMES[data.theme]) changeTheme(data.theme);
    setProfile(data||null);
    setLoading(false);
  };

  useEffect(() => {
    const handleRuntimeError = e => captureError("window_error", e.error || e.message || "Unknown runtime error");
    const handleRejection = e => captureError("unhandled_rejection", e.reason || "Unhandled promise rejection");
    window.addEventListener("error", handleRuntimeError);
    window.addEventListener("unhandledrejection", handleRejection);

    const boot = async () => {
      if(isRecoveryFlow() || hasRecoveryError()) {
        const {session, error} = await initializeRecoverySession();
        setSession(session);
        setRecoveryMode(true);
        setRecoveryInvalid(Boolean(error) || (!session && !hasRecoveryTokens()));
        setLoading(false);
      }
      else {
        const {data:{session}} = await sb.auth.getSession();
        setSession(session);
        if(session) loadProfile(session.user.id);
        else setLoading(false);
      }
    };
    boot();

    const {data:{subscription}} = sb.auth.onAuthStateChange((event,session) => {
      setSession(session);
      if(event==="PASSWORD_RECOVERY" || isRecoveryFlow() || hasRecoveryError()) {
        setRecoveryMode(true);
        setRecoveryInvalid(hasRecoveryError() || (!session && !hasRecoveryTokens()));
        setLoading(false);
      } else if(session) {
        setRecoveryMode(false);
        setRecoveryInvalid(false);
        loadProfile(session.user.id);
      } else {
        setRecoveryMode(false);
        setRecoveryInvalid(false);
        setSession(null);
        setProfile(null);
        setLoading(false);
      }
    });
    return () => {
      window.removeEventListener("error", handleRuntimeError);
      window.removeEventListener("unhandledrejection", handleRejection);
      subscription.unsubscribe();
    };
  }, []);

  const handleAuth = (session, isNew) => {
    setSession(session);
    if(isNew) { setProfile(null); setLoading(false); }
    else if(session) loadProfile(session.user.id);
  };

  if(loading) return html`<${Spin}/>`;
  if(recoveryMode && recoveryInvalid) return html`<${RecoveryLinkErrorScreen} onBack=${()=>{ clearAuthHash(); setRecoveryMode(false); setRecoveryInvalid(false); }}/>`;
  if(recoveryMode && !session) return html`<${Spin}/>`;
  if(recoveryMode) return html`<${PasswordRecoveryScreen} onDone=${()=>{ setRecoveryMode(false); clearAuthHash(); if(session) loadProfile(session.user.id); }} onCancel=${()=>{ setRecoveryMode(false); setSession(null); setProfile(null); }}/>`;
  if(!session) return html`<${AuthScreen} onAuth=${handleAuth}/>`;
  if(!profile) return html`<${Onboarding} userId=${session.user.id} onComplete=${()=>loadProfile(session.user.id)}/>`;
  return html`<${MainApp} key=${lang} session=${session} profile=${profile} setProfile=${setProfile} onLangChange=${changeLang} onThemeChange=${changeTheme}/>`;
}

ReactDOM.createRoot(document.getElementById("root")).render(html`<${Giftmate}/>`);
