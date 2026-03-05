const { useState, useEffect, useRef } = React;
const html = htm.bind(React.createElement);

const SUPABASE_URL = "https://xpvvutfojaqtrybwlnph.supabase.co";
const SUPABASE_KEY = "sb_publishable_S1FnE9dxWOZCZ77Bm93SSg_ObsDrMVc";
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const API = "/api/chat", MODEL = "claude-sonnet-4-20250514";

const P = {bg:"#0A0A18",card:"#12122A",border:"#ffffff18",text:"#F0F0FF",muted:"#9090B0",faint:"#50507080",gold:"#F4A438",goldL:"#FFD580",goldD:"#D4841A",teal:"#14B8A6",indigo:"#FF914D",indigoL:"#FFB080",green:"#22C55E",red:"#EF4444"};

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
    follow: "+ Follow", following: "✓ Following", viewProfile: "View",
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
    follow: "+ Seguir", following: "✓ Siguiendo", viewProfile: "Ver",
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
    follow: "+ Suivre", following: "✓ Abonné", viewProfile: "Voir",
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
    follow: "+ Folgen", following: "✓ Gefolgt", viewProfile: "Ansehen",
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
    follow: "+ Segui", following: "✓ Seguito", viewProfile: "Vedi",
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
    follow: "+ Seguir", following: "✓ Seguindo", viewProfile: "Ver",
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

const TIER_ICONS = ["🌱","💌","✨","🎊","👑","🏆"];
const TIER_COLORS = ["#6EE7B7","#93C5FD","#F4A438","#C084FC","#F87171","#FFD700"];
const TIER_RANGES = [{min:0,max:99},{min:100,max:299},{min:300,max:699},{min:700,max:1499},{min:1500,max:2999},{min:3000,max:Infinity}];
const getTier = stars => {
  const i = TIER_RANGES.findIndex((r,idx) => stars >= r.min && stars <= r.max);
  const idx = i >= 0 ? i : 0;
  const names = t("tierNames") || ["Gift Curious","Thoughtful Soul","Gift Whisperer","Joy Spreader","Legendary Giver","Giftmate Icon"];
  const descs = t("tierDescs") || ["Just getting started!","You really care","Gifts are your love language","You light up people's lives","A true gifting legend","The ultimate gifting master"];
  return {min:TIER_RANGES[idx].min, max:TIER_RANGES[idx].max, icon:TIER_ICONS[idx], color:TIER_COLORS[idx], name:names[idx], desc:descs[idx]};
};
const TIERS = TIER_RANGES.map((r,i) => ({...r, icon:TIER_ICONS[i], color:TIER_COLORS[i], name:"", desc:""}));

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
  return html`<div style=${{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:P.bg,color:P.gold,fontSize:18}}>🎁 Loading Giftmate…</div>`;
}

function Avatar({emoji, avatarUrl, size=40, style={}}) {
  if(avatarUrl) return html`<div style=${{width:size,height:size,borderRadius:"50%",overflow:"hidden",flexShrink:0,...style}}><img src=${avatarUrl} style=${{width:"100%",height:"100%",objectFit:"cover"}}/></div>`;
  return html`<div style=${{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45,flexShrink:0,...style}}>${emoji||"🎁"}</div>`;
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

// ── EDIT PROFILE MODAL ──
function EditProfileModal({profile, onSave, onClose, onLangChange}) {
  const [name, setName] = useState(profile.display_name||"");
  const [username, setUsername] = useState(profile.username||"");
  const [emoji, setEmoji] = useState(profile.emoji||"🎁");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url||"");
  const [interests, setInterests] = useState(profile.interests||[]);
  const [city, setCity] = useState(profile.city||"");
  const [country, setCountry] = useState(profile.country||"");
  const [language, setLanguage] = useState(profile.language||_lang||"en");
  const [loading, setLoading] = useState(false);
  const toggleI = i => setInterests(p => p.includes(i)?p.filter(x=>x!==i):p.length<8?[...p,i]:p);

  const save = async () => {
    if(!name.trim()) return;
    setLoading(true);
    const updates = {display_name:name, username:username.toLowerCase().replace(/[^a-z0-9_]/g,""), emoji, interests, avatar_url:avatarUrl||null, city:city||null, country:country||null, language};
    await sb.from("profiles").update(updates).eq("id", profile.id);
    setLang(language);
    if(onLangChange) onLangChange(language);
    onSave({...profile, ...updates});
    onClose();
  };

  return html`
    <div style=${{position:"fixed",inset:0,background:"#000b",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick=${onClose}>
      <div style=${{background:P.card,borderRadius:"20px 20px 0 0",padding:24,width:"100%",maxWidth:480,maxHeight:"85vh",overflowY:"auto"}} onClick=${e=>e.stopPropagation()}>
        <div style=${{fontWeight:800,fontSize:18,color:P.text,marginBottom:20,textAlign:"center"}}>${t("editProfile")}</div>
        
        <div style=${{textAlign:"center",marginBottom:20}}>
          <div style=${{position:"relative",display:"inline-block"}}>
            <${Avatar} emoji=${emoji} avatarUrl=${avatarUrl} size=${80}/>
            <button onClick=${()=>pickPhoto(setAvatarUrl)} style=${{position:"absolute",bottom:0,right:0,width:28,height:28,borderRadius:"50%",background:P.gold,border:"none",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>📷</button>
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
              <button key=${code} onClick=${()=>setLanguage(code)} style=${{background:language===code?`${P.gold}33`:"transparent",border:`1px solid ${language===code?P.gold:P.border}`,borderRadius:99,padding:"6px 12px",fontSize:13,cursor:"pointer",color:language===code?P.goldL:P.muted,fontWeight:language===code?700:400}}>
                ${lang.flag} ${lang.name}
              </button>`)}
          </div>
        </div>

        <div style=${{marginBottom:14}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:8}}>${t("emojiAvatar")}</div>
          <div style=${{display:"flex",flexWrap:"wrap",gap:8}}>
            ${EMOJIS.map(e => html`<button key=${e} onClick=${()=>setEmoji(e)} style=${{fontSize:22,background:emoji===e?`${P.gold}33`:"none",border:`1px solid ${emoji===e?P.gold:"transparent"}`,borderRadius:8,padding:"6px 8px",cursor:"pointer"}}>${e}</button>`)}
          </div>
        </div>

        <div style=${{marginBottom:20}}>
          <div style=${{fontSize:11,color:P.muted,fontWeight:700,marginBottom:8}}>${t("interests")}</div>
          <div style=${{display:"flex",flexWrap:"wrap",gap:6}}>
            ${INTERESTS.map(i => html`<button key=${i} onClick=${()=>toggleI(i)} style=${{background:interests.includes(i)?`${P.gold}33`:"transparent",border:`1px solid ${interests.includes(i)?P.gold:P.border}`,borderRadius:99,padding:"5px 12px",fontSize:12,color:interests.includes(i)?P.goldL:P.muted,cursor:"pointer",fontWeight:interests.includes(i)?700:400}}>${translateInterest(i)}</button>`)}
          </div>
        </div>

        <button onClick=${save} disabled=${loading} style=${{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:12,padding:"14px 0",fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:10}}>
          ${loading?t("loading"):t("save")}
        </button>
        <button onClick=${onClose} style=${{width:"100%",background:"transparent",border:"none",color:P.muted,padding:"8px 0",cursor:"pointer"}}>${t("cancel")}</button>
      </div>
    </div>`;
}

function Inp({value, onChange, placeholder, type="text", style={}}) {
  return html`<input value=${value} onChange=${e=>onChange(e.target.value)} placeholder=${placeholder} type=${type} style=${{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:10,padding:"12px 14px",color:P.text,fontSize:14,boxSizing:"border-box",outline:"none",...style}}/>`;
}

// ── AUTH ──
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
    const {error} = await sb.auth.resetPasswordForEmail(email, {redirectTo: window.location.origin});
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

  const toggleI = i => setInterests(p => p.includes(i) ? p.filter(x=>x!==i) : p.length<8 ? [...p,i] : p);

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
      <div style=${{fontSize:26,textAlign:"center",marginBottom:6}}>👋 Welcome!</div>
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
        ${EMOJIS.map(e => html`<button key=${e} onClick=${()=>setEmoji(e)} style=${{fontSize:26,padding:"10px 0",borderRadius:12,border:`2px solid ${emoji===e?P.gold:"transparent"}`,background:emoji===e?P.gold+"22":P.bg,cursor:"pointer"}}>${e}</button>`)}
      </div>
      <div style=${{textAlign:"center",fontSize:52}}>${emoji}</div>
    </div>`,
    html`<div key="s2">
      <div style=${{fontSize:26,textAlign:"center",marginBottom:6}}>🎂 Your birthday</div>
      <div style=${{color:P.muted,textAlign:"center",marginBottom:20,fontSize:14}}>${t("friendsGiftHint")}</div>
      <${Inp} value=${birthday} onChange=${setBirthday} type="date" style=${{textAlign:"center",fontSize:16}}/>
      <div style=${{color:P.muted,fontSize:12,textAlign:"center",marginTop:10}}>You can skip this and add it later</div>
    </div>`,
    html`<div key="s3">
      <div style=${{fontSize:26,textAlign:"center",marginBottom:6}}>What do you love? 💛</div>
      <div style=${{color:P.muted,textAlign:"center",marginBottom:18,fontSize:14}}>Pick up to 8 interests</div>
      <div style=${{display:"flex",flexWrap:"wrap",gap:8}}>
        ${INTERESTS.map(i => html`<button key=${i} onClick=${()=>toggleI(i)} style=${{padding:"8px 14px",borderRadius:99,border:`1px solid ${interests.includes(i)?P.gold:P.border}`,background:interests.includes(i)?P.gold+"22":P.bg,color:interests.includes(i)?P.goldL:P.muted,fontSize:13,fontWeight:600,cursor:"pointer"}}>${translateInterest(i)}</button>`)}
      </div>
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
    url = `https://www.amazon.com/s?k=${encodeURIComponent(name)}&tag=giftmate0d-20`;
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
          <div style=${{fontSize:36}}>🎁</div>
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
        <div style=${{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>${(isSent?m.receiver?.emoji:m.sender?.emoji)||"🎁"}</div>
        <div style=${{flex:1}}>
          <div style=${{fontWeight:700,color:P.text,fontSize:14}}>${isSent?`You gifted ${m.receiver?.display_name}!`:`${m.sender?.display_name} gifted you!`}</div>
          <div style=${{color:P.muted,fontSize:12}}>${new Date(m.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</div>
        </div>
        ${m.status==="pending" && html`<div style=${{color:isSent?P.muted:P.gold,fontSize:isSent?11:8,fontWeight:700}}>${isSent?t("pending"):html`<div style=${{width:8,height:8,borderRadius:"50%",background:P.gold}}/>`}</div>`}
        ${m.status==="thanked" && html`<div style=${{color:isSent?P.green:P.green,fontSize:12,fontWeight:700}}>${isSent?t("thanked"):t("thanked")}</div>`}
      </div>
      <div style=${{background:P.bg,borderRadius:10,padding:"10px 12px",marginBottom:isSent||m.status==="thanked"?0:10}}>
        <div style=${{fontWeight:700,color:P.text,fontSize:14}}>🎁 ${m.gift_name}</div>
        ${m.occasion&&html`<div style=${{color:P.muted,fontSize:12,marginTop:2}}>For: ${m.occasion}</div>`}
        ${m.note&&html`<div style=${{color:P.goldL,fontSize:13,marginTop:6,fontStyle:"italic"}}>"${m.note}"</div>`}
      </div>
      ${!isSent && m.status==="pending" && html`<button onClick=${()=>thankYou(m)} style=${{width:"100%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:10,padding:"10px 0",fontSize:13,fontWeight:700,cursor:"pointer",marginTop:10}}>${t("sayThankyou")}</button>`}
    </div>`;

  return html`<div>
    <div style=${{display:"flex",background:P.bg,borderRadius:10,padding:3,marginBottom:14,gap:2}}>
      <button onClick=${()=>setTab("received")} style=${{flex:1,padding:"8px 4px",borderRadius:8,border:"none",background:tab==="received"?`linear-gradient(135deg,${P.goldD},${P.gold})`:"transparent",color:tab==="received"?"#000":P.muted,fontWeight:700,fontSize:12,cursor:"pointer"}}>
        ${t("received")} ${pendingCount>0?html`<span style=${{background:P.red,color:"#fff",borderRadius:99,padding:"1px 5px",fontSize:10,marginLeft:3}}>${pendingCount}</span>`:""}
      </button>
      <button onClick=${()=>setTab("sent")} style=${{flex:1,padding:"8px 4px",borderRadius:8,border:"none",background:tab==="sent"?`linear-gradient(135deg,${P.goldD},${P.gold})`:"transparent",color:tab==="sent"?"#000":P.muted,fontWeight:700,fontSize:12,cursor:"pointer"}}>${t("sent")}</button>
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

function FriendProfile({friend, myProfile, following, onToggleFollow, onBack}) {
  const [occasions,setOccasions] = useState([]);
  const [wishlist,setWishlist] = useState([]);
  const [giftsReceived,setGiftsReceived] = useState([]);
  const [section,setSection] = useState("occasions");
  const [giftIdeas,setGiftIdeas] = useState([]);
  const [giftLoading,setGiftLoading] = useState(false);
  const [toast,setToast] = useState(null);

  useEffect(() => {
    Promise.all([
      sb.from("occasions").select("*").eq("user_id",friend.id).eq("is_public",true),
      sb.from("wishlist_items").select("*").eq("user_id",friend.id).eq("is_public",true),
      sb.from("gifts_received").select("*").eq("user_id",friend.id).eq("is_public",true)
    ]).then(([o,w,g]) => { setOccasions(o.data||[]); setWishlist(w.data||[]); setGiftsReceived(g.data||[]); });
  }, [friend.id]);

  const getGiftIdeas = async occ => {
    setGiftIdeas([]); setGiftLoading(true);
    const city = myProfile?.city||"Madrid";
    try {
      const res = await fetch(API, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:MODEL,max_tokens:700,messages:[{role:"user",content:`Generate 5 personalised gift ideas for ${friend.display_name} for their ${occ.type} in ${city}. Interests: ${(friend.interests||[]).join(", ")||"unknown"}. Past gifts: ${giftsReceived.map(g=>g.gift_name).join(", ")||"none"}. Wishlist: ${wishlist.map(w=>w.name).join(", ")||"empty"}. Mix physical products AND experiences (tours, classes, workshops in ${city}). Use REALISTIC market prices: physical gifts €15-60 (like Amazon pricing), experiences €25-80 (like GetYourGuide/Viator pricing). Return ONLY a valid JSON array, nothing else: [{"name":"...","description":"under 10 words","price":30,"emoji":"🎁"}]`}]})});
      const data = await res.json();
      const text = (data.content?.[0]?.text||"[]").replace(/```json|```/g,"").trim();
      setGiftIdeas(JSON.parse(text));
    } catch(e) { setToast("Couldn't load ideas — try again"); }
    setGiftLoading(false);
  };

  const [showSendGift, setShowSendGift] = useState(false);
  const [localToast, setLocalToast] = useState(null);
  const isF = following.includes(friend.id);
  const tier = getTier(friend.stars||0);
  const SECS = [["occasions",t("secOccasions")],["wishlist",t("secWishlist")],["gifts",t("secReceived")]];

  const addBirthdayToCalendar = async () => {
    if(!friend.birthday) return;
    const {error} = await sb.from("occasions").insert({
      user_id: myProfile.id,
      type: `${friend.display_name}'s Birthday`,
      date: friend.birthday,
      is_public: false
    });
    if(!error) { setLocalToast(`🎂 ${friend.display_name}'s birthday added to your calendar!`); setTimeout(()=>setLocalToast(null),3000); }
  };

  return html`<div>
    <button onClick=${onBack} style=${{background:"none",border:"none",color:P.muted,fontSize:14,cursor:"pointer",marginBottom:14,padding:0}}>← Back</button>
    <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:20,marginBottom:14,textAlign:"center"}}>
      <${Avatar} emoji=${friend.emoji} avatarUrl=${friend.avatar_url} size=${72} style=${{margin:"0 auto 12px"}}/>
      <div style=${{fontWeight:800,fontSize:20,color:P.text}}>${friend.display_name}</div>
      <div style=${{color:P.muted,fontSize:14,marginBottom:4}}>@${friend.username}</div>
      <div style=${{display:"inline-flex",alignItems:"center",gap:6,background:tier.color+"22",border:`1px solid ${tier.color}44`,borderRadius:99,padding:"4px 12px",marginBottom:10}}>
        <span style=${{fontSize:14}}>${tier.icon}</span>
        <span style=${{color:tier.color,fontWeight:700,fontSize:12}}>${tier.name}</span>
        <span style=${{color:P.faint,fontSize:11}}>· ${friend.stars||0}⭐</span>
      </div>
      ${friend.birthday && html`<div style=${{fontSize:13,color:P.gold,marginBottom:6}}>🎂 ${fmtDate(friend.birthday)} · ${t("inDays")} ${daysUntil(friend.birthday)} ${t("daysWord")}</div>`}
      ${friend.birthday && html`<button onClick=${addBirthdayToCalendar} style=${{background:`${P.gold}11`,border:`1px solid ${P.gold}33`,color:P.goldL,borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",marginBottom:10}}>${t("addToCalendar")}</button>`}
      ${(friend.interests||[]).length>0 && html`<div style=${{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginBottom:14}}>
        ${friend.interests.map(i => html`<span key=${i} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}33`,borderRadius:99,padding:"3px 10px",fontSize:11,color:P.goldL,fontWeight:600}}>${translateInterest(i)}</span>`)}
      </div>`}
      <div style=${{display:"flex",gap:8,justifyContent:"center"}}>
        <button onClick=${()=>onToggleFollow(friend.id)} style=${{background:isF?P.border:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:isF?P.muted:"#000",borderRadius:10,padding:"10px 20px",fontWeight:700,fontSize:14,cursor:"pointer"}}>${isF?t("following"):t("follow")}</button>
        <button onClick=${()=>setShowSendGift(true)} style=${{background:"#C084FC22",border:"1px solid #C084FC66",color:"#C084FC",borderRadius:10,padding:"10px 20px",fontWeight:700,fontSize:14,cursor:"pointer"}}>${t("iGiftedThem")}</button>
      </div>
    </div>
    ${showSendGift && html`<${SendGiftModal} friend=${friend} myProfile=${myProfile} onClose=${()=>setShowSendGift(false)} toast=${msg=>{setLocalToast(msg);setTimeout(()=>setLocalToast(null),3000);}}/>`}
    ${occasions.length>0 && html`<div style=${{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:16,padding:16,marginBottom:14}}>
      <div style=${{fontWeight:700,fontSize:15,marginBottom:10}}>${t("getAIIdeas")}</div>
      <div style=${{display:"flex",flexWrap:"wrap",gap:8}}>
        ${occasions.slice(0,3).map(o => html`<button key=${o.id} onClick=${()=>getGiftIdeas(o)} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>🎁 ${t("giftIdeasFor")} ${translateOccasion(o.type)}</button>`)}
      </div>
      ${giftLoading && html`<div style=${{color:P.muted,fontSize:13,marginTop:10}}>${t("findingGifts")}</div>`}
      ${giftIdeas.map((g,i) => html`
        <div key=${i} style=${{background:P.bg,borderRadius:10,padding:"10px 12px",marginTop:10,display:"flex",gap:10,alignItems:"flex-start"}}>
          <span style=${{fontSize:24}}>${g.emoji}</span>
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
    ${section==="gifts" && giftsReceived.map(g => html`<div key=${g.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style=${{fontWeight:600,color:P.text}}>${g.gift_name}</div>${g.from_whom&&html`<div style=${{fontSize:13,color:P.muted}}>${t("fromWhom")} ${g.from_whom}${g.occasion?` · ${g.occasion}`:""}</div>`}</div><span style=${{fontSize:20}}>${g.reaction||"😊"}</span></div>`)}
    ${section==="gifts" && giftsReceived.length===0 && html`<div style=${{color:P.muted,textAlign:"center",padding:20,fontSize:14}}>${t("noGiftsRecorded")}</div>`}
    ${(toast||localToast) && html`<${Toast} msg=${toast||localToast} onDone=${()=>{setToast(null);setLocalToast(null);}}/>`}
  </div>`;
}

// ── MY PROFILE ──
function MyProfile({profile, setProfile, friendsOccasions=[], onLangChange}) {
  const [occasions,setOccasions] = useState([]);
  const [wishlist,setWishlist] = useState([]);
  const [giftsReceived,setGiftsReceived] = useState([]);
  const [section,setSection] = useState("occasions");
  const [addingOcc,setAddingOcc] = useState(false);
  const [addingWish,setAddingWish] = useState(false);
  const [addingGift,setAddingGift] = useState(false);
  const [newOcc,setNewOcc] = useState({type:"Birthday",date:"",color:"#F4A438"});
  const [newWish,setNewWish] = useState({name:"",description:"",price:"",list_name:""});
  const [newGift,setNewGift] = useState({gift_name:"",from_whom:"",occasion:"",reaction:"😊"});
  const [toast,setToast] = useState(null);
  // Wishlist lists
  const [activeList,setActiveList] = useState("all");
  const [showCreateList,setShowCreateList] = useState(false);
  const [newListName,setNewListName] = useState("");
  const [newListEmoji,setNewListEmoji] = useState("🎁");
  const LIST_EMOJIS = ["🎁","🎂","💍","🎓","🏠","❤️","🎄","🌸","✈️","🎉","🌟","💼"];
  // Derive unique lists from wishlist items
  const lists = [...new Set(wishlist.filter(w=>w.list_name).map(w=>w.list_name))];
  const filteredWish = activeList==="all" ? wishlist : wishlist.filter(w=>w.list_name===activeList);

  useEffect(() => {
    Promise.all([
      sb.from("occasions").select("*").eq("user_id",profile.id).order("date"),
      sb.from("wishlist_items").select("*").eq("user_id",profile.id),
      sb.from("gifts_received").select("*").eq("user_id",profile.id)
    ]).then(([o,w,g]) => { setOccasions(o.data||[]); setWishlist(w.data||[]); setGiftsReceived(g.data||[]); });
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
  const tier = getTier(profile.stars||0);
  const SECS = [["occasions",t("secOccasions")],["wishlist",t("secWishlist")],["gifts",t("secReceived")],["inbox",t("secInbox")]];

  return html`<div>
    ${showEdit && html`<${EditProfileModal} profile=${profile} onSave=${p=>{setProfile(p);}} onLangChange=${onLangChange} onClose=${()=>setShowEdit(false)}/>`}
    <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:20,padding:20,marginBottom:14,textAlign:"center"}}>
      <div style=${{position:"relative",display:"inline-block",marginBottom:12}}>
        <${Avatar} emoji=${profile.emoji} avatarUrl=${profile.avatar_url} size=${80}/>
        <button onClick=${()=>setShowEdit(true)} style=${{position:"absolute",bottom:0,right:-4,width:26,height:26,borderRadius:"50%",background:P.gold,border:"none",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✏️</button>
      </div>
      <div style=${{fontWeight:800,fontSize:20,color:P.text}}>${profile.display_name}</div>
      <div style=${{color:P.muted,fontSize:14,marginBottom:6}}>@${profile.username}</div>
      <div style=${{display:"inline-flex",alignItems:"center",gap:6,background:tier.color+"22",border:`1px solid ${tier.color}44`,borderRadius:99,padding:"5px 14px",marginBottom:8}}>
        <span style=${{fontSize:16}}>${tier.icon}</span>
        <div>
          <div style=${{color:tier.color,fontWeight:800,fontSize:13}}>${tier.name}</div>
          <div style=${{color:P.faint,fontSize:10}}>${tier.desc}</div>
        </div>
        <span style=${{color:P.muted,fontSize:11,marginLeft:4}}>${profile.stars||0}⭐</span>
      </div>
      ${profile.birthday && html`<div style=${{fontSize:13,color:P.gold,marginBottom:8}}>🎂 ${fmtDate(profile.birthday)}</div>`}
      ${(profile.interests||[]).length>0 && html`<div style=${{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:8}}>
        ${profile.interests.map(i => html`<span key=${i} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}33`,borderRadius:99,padding:"3px 10px",fontSize:11,color:P.goldL,fontWeight:600}}>${translateInterest(i)}</span>`)}
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
      ${occasions.map(o => html`<div key=${o.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style=${{display:"flex",alignItems:"center",gap:10}}>
          <div style=${{width:12,height:12,borderRadius:"50%",background:o.color||P.gold,flexShrink:0}}/>
          <div><div style=${{fontWeight:600,color:P.text}}>${translateOccasion(o.type)}</div><div style=${{fontSize:13,color:P.muted}}>${fmtDate(o.date)}</div></div>
        </div>
        <div style=${{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick=${async()=>{const np=!o.is_public;await sb.from("occasions").update({is_public:np}).eq("id",o.id);setOccasions(prev=>prev.map(x=>x.id===o.id?{...x,is_public:np}:x));}} style=${{background:"none",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 8px",fontSize:10,color:o.is_public?P.teal:P.muted,cursor:"pointer",fontWeight:700}}>${o.is_public?t("publicLabel"):t("privateLabel")}</button>
          <div style=${{color:daysUntil(o.date)<=30?P.gold:P.muted,fontWeight:700,fontSize:13}}>${daysUntil(o.date)}d</div>
          <button onClick=${()=>delOcc(o.id)} style=${{background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
      </div>`)}
      ${addingOcc ? html`<div style=${{background:P.card,border:`1px solid ${P.gold}44`,borderRadius:14,padding:16,marginBottom:10}}>
        <select value=${OCCASIONS.includes(newOcc.type)?newOcc.type:"custom"} onChange=${e=>{if(e.target.value==="custom"){setNewOcc(o=>({...o,type:""}))}else{setNewOcc(o=>({...o,type:e.target.value}))}}} style=${{width:"100%",background:P.bg,border:`1px solid ${P.border}`,borderRadius:8,padding:"10px",color:P.text,fontSize:14,marginBottom:10,boxSizing:"border-box"}}>
          ${OCCASIONS.map((o,i) => html`<option key=${o} value=${o}>${getOccasions()[i]||o}</option>`)}
          <option value="custom">✏️ ${t("customOccasion").split("…")[0]}…</option>
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
          ${LIST_EMOJIS.map(e => html`<button key=${e} onClick=${()=>setNewListEmoji(e)} style=${{fontSize:20,background:newListEmoji===e?`${P.gold}33`:"none",border:`1px solid ${newListEmoji===e?P.gold:"transparent"}`,borderRadius:8,padding:"4px 7px",cursor:"pointer"}}>${e}</button>`)}
        </div>
        <${Inp} value=${newListName} onChange=${setNewListName} placeholder="e.g. My Birthday 🎂" style=${{marginBottom:8}}/>
        <div style=${{display:"flex",gap:8}}>
          <button onClick=${()=>{setShowCreateList(false);setNewListName("");setNewListEmoji("🎁");}} style=${{flex:1,background:"transparent",border:`1px solid ${P.border}`,color:P.muted,borderRadius:8,padding:"8px 0",cursor:"pointer"}}>${t("cancel")}</button>
          <button onClick=${()=>{
            if(!newListName.trim()) return;
            const listLabel = newListEmoji+" "+newListName.trim();
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
        <div style=${{display:"flex",gap:10,alignItems:"center"}}>${w.price&&html`<div style=${{color:P.gold,fontWeight:700}}>€${w.price}</div>`}<button onClick=${()=>delWish(w.id)} style=${{background:"none",border:"none",color:P.muted,cursor:"pointer",fontSize:16}}>✕</button></div>
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
        <span style=${{fontSize:20}}>${g.reaction||"😊"}</span>
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

    ${toast && html`<${Toast} msg=${toast} onDone=${()=>setToast(null)}/>`}
  </div>`;
}

// ── GROUPS TAB ──
function GroupsTab({profile, following, feed}) {
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    const {data:memberOf} = await sb.from("group_members").select("group_id").eq("user_id", profile.id);
    const {data:created} = await sb.from("gift_groups").select("*").eq("created_by", profile.id);
    const memberIds = (memberOf||[]).map(m=>m.group_id);
    const {data:memberGroups} = memberIds.length ? await sb.from("gift_groups").select("*").in("id", memberIds) : {data:[]};
    const all = [...(created||[]), ...(memberGroups||[])].filter((g,i,a)=>a.findIndex(x=>x.id===g.id)===i);
    setGroups(all.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)));
    setLoading(false);
  };

  useEffect(()=>{ loadGroups(); }, []);

  if(activeGroup) return html`<${GroupChat} group=${activeGroup} profile=${profile} feed=${feed} following=${following} onBack=${()=>{setActiveGroup(null);loadGroups();}}/>`;
  if(showCreate) return html`<${CreateGroup} profile=${profile} feed=${feed} following=${following} onCreate=${g=>{setShowCreate(false);setActiveGroup(g);loadGroups();}} onClose=${()=>setShowCreate(false)}/>`;

  return html`<div>
    <div style=${{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div>
        <div style=${{fontWeight:800,fontSize:18,color:P.text}}>${t("giftGroups")}</div>
        <div style=${{color:P.muted,fontSize:13}}>${t("planSplit")}</div>
      </div>
      <button onClick=${()=>setShowCreate(true)} style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:10,padding:"9px 16px",fontWeight:700,fontSize:13,cursor:"pointer"}}>${t("newGroup")}</button>
    </div>

    ${loading && html`<div style=${{textAlign:"center",padding:40,color:P.muted}}>Loading…</div>`}
    ${!loading && groups.length===0 && html`<div style=${{textAlign:"center",padding:40}}>
      <div style=${{fontSize:48,marginBottom:12}}>🎁</div>
      <div style=${{fontWeight:700,fontSize:16,color:P.text,marginBottom:8}}>${t("noGroups")}</div>
      <div style=${{color:P.muted,fontSize:14,marginBottom:20}}>${t("noGroupsDesc")}</div>
      <button onClick=${()=>setShowCreate(true)} style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:"#000",borderRadius:12,padding:"12px 24px",fontWeight:700,cursor:"pointer"}}>${t("createFirstGroup")}</button>
    </div>`}

    ${groups.map(g => html`
      <div key=${g.id} onClick=${()=>setActiveGroup(g)} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:16,marginBottom:10,cursor:"pointer",display:"flex",gap:12,alignItems:"center"}}>
        <div style=${{width:48,height:48,borderRadius:12,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>${g.emoji||"🎁"}</div>
        <div style=${{flex:1,minWidth:0}}>
          <div style=${{fontWeight:700,fontSize:15,color:P.text}}>${g.name}</div>
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

  const create = async () => {
    if(!name.trim()) return;
    setLoading(true);
    const {data:group, error} = await sb.from("gift_groups").insert({
      name, emoji, occasion, target_name:targetName||null,
      budget: budget?parseInt(budget):null, created_by:profile.id
    }).select().single();
    if(error||!group) { setLoading(false); return; }

    // Add creator as admin
    await sb.from("group_members").insert({group_id:group.id, user_id:profile.id, role:"admin"});

    // Add selected friends
    if(selectedFriends.length) {
      await sb.from("group_members").insert(selectedFriends.map(uid=>({group_id:group.id, user_id:uid, role:"member"})));
    }
    // System message
    await sb.from("group_messages").insert({group_id:group.id, sender_id:profile.id, content:`${profile.display_name} created this group 🎉`, message_type:"system"});

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
          ${GROUP_EMOJIS.map(e=>html`<button key=${e} onClick=${()=>setEmoji(e)} style=${{fontSize:22,background:emoji===e?`${P.gold}33`:"none",border:`1px solid ${emoji===e?P.gold:"transparent"}`,borderRadius:8,padding:"6px 8px",cursor:"pointer"}}>${e}</button>`)}
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
  </div>`;
}

function GroupChat({group, profile, feed, following, onBack}) {
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [showSplit, setShowSplit] = useState(null); // proposal to split
  const [showAddMember, setShowAddMember] = useState(false);
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

  return html`<div style=${{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
    <!-- Header -->
    <div style=${{background:P.card,borderRadius:14,padding:"12px 14px",marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
      <button onClick=${onBack} style=${{background:"none",border:"none",color:P.muted,fontSize:18,cursor:"pointer",padding:0}}>←</button>
      <div style=${{width:40,height:40,borderRadius:10,background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>${group.emoji||"🎁"}</div>
      <div style=${{flex:1,minWidth:0}}>
        <div style=${{fontWeight:700,fontSize:15,color:P.text}}>${group.name}</div>
        <div style=${{fontSize:11,color:P.muted}}>${memberCount} member${memberCount!==1?"s":""}${group.budget?` · €${group.budget} budget`:""}</div>
      </div>
      <button onClick=${()=>setShowProposalForm(true)} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>+ Propose</button>
    </div>

    <!-- Proposals bar -->
    ${proposals.length>0 && html`<div style=${{marginBottom:10,overflowX:"auto"}}>
      <div style=${{display:"flex",gap:8,paddingBottom:4}}>
        ${proposals.map(p=>html`
          <div key=${p.id} style=${{background:P.card,border:`2px solid ${p.status==="approved"?P.green:p.votes_up?.length>=(memberCount/2)?P.gold:P.border}`,borderRadius:12,padding:"10px 12px",minWidth:180,flexShrink:0}}>
            <div style=${{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <span style=${{fontSize:18}}>${p.emoji||"🎁"}</span>
              <div style=${{fontWeight:700,fontSize:13,color:P.text,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>${p.gift_name}</div>
            </div>
            ${p.description && html`<div style=${{fontSize:11,color:P.muted,marginBottom:4}}>${p.description}</div>`}
            <div style=${{color:P.gold,fontWeight:700,fontSize:13,marginBottom:6}}>€${p.price||"?"}</div>
            ${p.status==="approved"
              ? html`<div style=${{color:P.green,fontWeight:700,fontSize:12}}>✅ Approved!</div>`
              : html`<div style=${{display:"flex",gap:6,alignItems:"center"}}>
                  <button onClick=${()=>vote(p.id,"up")} style=${{background:p.votes_up?.includes(profile.id)?P.gold+"33":"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:12}}>👍 ${p.votes_up?.length||0}</button>
                  <button onClick=${()=>vote(p.id,"down")} style=${{background:p.votes_down?.includes(profile.id)?"#ef444433":"transparent",border:`1px solid ${P.border}`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:12}}>👎 ${p.votes_down?.length||0}</button>
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
        if(isSystem) return html`<div key=${m.id} style=${{textAlign:"center",color:P.muted,fontSize:12,padding:"4px 0"}}>${m.content}</div>`;
        return html`<div key=${m.id} style=${{display:"flex",gap:8,alignItems:"flex-end",flexDirection:isMe?"row-reverse":"row"}}>
          ${!isMe && html`<${Avatar} emoji=${m.sender?.emoji} avatarUrl=${m.sender?.avatar_url} size=${28}/>`}
          <div style=${{maxWidth:"70%"}}>
            ${!isMe && html`<div style=${{fontSize:10,color:P.muted,marginBottom:2,marginLeft:4}}>${m.sender?.display_name}</div>`}
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
        <div style=${{color:P.muted,fontSize:13,marginBottom:16}}>${proposal.emoji||"🎁"} ${proposal.gift_name} · Total: €${total}</div>

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
    {id:1,title:t("reward1Title"),cost:200,icon:"📦",desc:t("reward1Desc")},
    {id:2,title:t("reward2Title"),cost:300,icon:"🌟",desc:t("reward2Desc")},
    {id:3,title:t("reward3Title"),cost:400,icon:"🗺️",desc:t("reward3Desc")},
    {id:4,title:t("reward4Title"),cost:500,icon:"✨",desc:t("reward4Desc")}
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
      <div style=${{fontSize:42,marginBottom:4}}>${tier.icon}</div>
      <div style=${{color:tier.color,fontWeight:800,fontSize:16,marginBottom:2}}>${tier.name}</div>
      <div style=${{color:P.muted,fontSize:12,marginBottom:10,fontStyle:"italic"}}>"${tier.desc}"</div>
      <div style=${{fontFamily:"Georgia,serif",fontSize:48,fontWeight:900,color:P.goldL,lineHeight:1}}>${stars.toLocaleString()}</div>
      <div style=${{color:P.muted,fontSize:13,marginBottom:12}}>${t("starsEarned")}</div>
      ${nextTier && html`<div>
        <div style=${{display:"flex",justifyContent:"space-between",fontSize:11,color:P.muted,marginBottom:5}}>
          <span>${tier.name}</span><span>${nextTier.min - stars} ⭐ to ${nextTier.name} ${nextTier.icon}</span>
        </div>
        <div style=${{background:P.border,borderRadius:99,height:6,overflow:"hidden"}}>
          <div style=${{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${P.goldD},${tier.color})`,width:`${progress}%`,transition:"width 1s ease"}}/>
        </div>
      </div>`}
      ${!nextTier && html`<div style=${{color:P.gold,fontWeight:700,fontSize:13}}>${t("maxTier")}</div>`}
    </div>
    <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:16,padding:18,marginBottom:14}}>
      <div style=${{fontWeight:700,fontSize:15,marginBottom:12}}>${t("howToEarn")}</div>
      ${[["👥",t("earnFollow"),"+15"],["🗓️",t("earnOccasion"),"+10"],["📲",t("earnShare"),"+10"],["🤝",t("earnRefer"),"+80"]].map(([icon,label,pts]) => html`
        <div key=${label} style=${{display:"flex",alignItems:"center",gap:10,marginBottom:8,background:P.bg,borderRadius:10,padding:"10px 12px"}}>
          <span style=${{fontSize:18}}>${icon}</span>
          <div style=${{flex:1,fontSize:13,color:P.muted}}>${label}</div>
          <div style=${{color:P.gold,fontWeight:700,fontSize:13}}>${pts} ⭐</div>
        </div>`)}
      <div style=${{display:"flex",gap:8,marginTop:12}}>
        <button onClick=${()=>share("wa")} style=${{flex:1,background:"#25D366",color:"#fff",border:"none",borderRadius:10,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>${t("shareWhatsapp")}</button>
        <button onClick=${()=>share("copy")} style=${{flex:1,background:P.card,border:`1px solid ${P.border}`,color:P.text,borderRadius:10,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>${t("copyLink")}</button>
      </div>
    </div>
    <div style=${{fontWeight:700,fontSize:15,marginBottom:12}}>${t("redeemStars")}</div>
    <div style=${{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      ${REWARDS.map(r => { const can = stars>=r.cost; return html`
        <div key=${r.id} style=${{background:P.card,border:`1px solid ${can?P.gold+"44":P.border}`,borderRadius:14,padding:14}}>
          <div style=${{fontSize:28,marginBottom:6}}>${r.icon}</div>
          <div style=${{fontWeight:700,fontSize:13,color:P.text,marginBottom:2}}>${r.title}</div>
          <div style=${{fontSize:11,color:P.muted,marginBottom:10}}>${r.desc}</div>
          <button onClick=${()=>redeem(r)} disabled=${!can} style=${{width:"100%",background:can?`linear-gradient(135deg,${P.goldD},${P.gold})`:P.border,color:can?"#000":P.muted,border:"none",borderRadius:8,padding:"7px 0",fontSize:11,fontWeight:700,cursor:can?"pointer":"not-allowed"}}>
            ${can?`${r.cost} ${t("redeemLabel")}`:`${r.cost-stars} ${t("needMore")}`}
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
        <span style=${{fontSize:28,flexShrink:0}}>${g.emoji||"🎁"}</span>
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
<gifts>[{"name":"...","description":"under 10 words","price":25,"emoji":"🎁","reason":"..."},{"name":"...","description":"...","price":35,"emoji":"🎁","reason":"..."},{"name":"...","description":"...","price":50,"emoji":"🎁","reason":"..."},{"name":"...","description":"...","price":65,"emoji":"🎁","reason":"..."},{"name":"...","description":"...","price":80,"emoji":"🎁","reason":"..."}]</gifts>

PRICES MUST BE REALISTIC — anchor to actual market prices:
- Physical products: check what they actually cost on Amazon (books €10-20, gadgets €20-80, clothing €30-60)
- Experiences (GetYourGuide/Viator): cooking classes €40-70, flamenco shows €25-45, day tours €30-80, escape rooms €20-30
- Hotels/weekend breaks: budget €60-120/night, mid-range €120-200/night
- If the user gives a budget, spread all 5 gifts within ±20% of that budget
- Never invent inflated prices — if unsure, go lower rather than higher

Mix: experiences, physical gifts, personalised, hotels, nightlife/events. BUT if the user is clearly talking about nightlife/clubs/going out, give ALL 5 as nightlife options — real specific venues, club nights, bar crawls, cocktail spots in ${city} by name. If they're talking about romantic experiences, go all-in on experiences. Match the energy of what they're asking for. No ** asterisks.`;
  const opening = t("conciergeOpening").replace("{name}", name);
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
      const res = await fetch(API, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({
        model:MODEL, max_tokens:700, system:SYSTEM,
        messages: newRaw
      })});
      const data = await res.json();
      const raw = data.content?.[0]?.text || "";
      const {text:t, gifts} = parseReply(raw);
      setRawMessages(p => [...p, {role:"assistant", content:raw}]);
      setMessages(p => [...p, {role:"assistant", content:t, gifts}]);
      if(gifts?.length) track("concierge_gifts_shown", {gifts: gifts.map(g=>({name:g.name, price:g.price})), session_id: SESSION_ID});
    } catch(e) {
      setMessages(p => [...p, {role:"assistant", content:t("conciergeError")}]);
    }
    setLoading(false);
  };

  return html`<div style=${{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
    <div style=${{marginBottom:10}}>
      <div style=${{fontWeight:800,fontSize:18,color:P.text,marginBottom:2}}>${t("aiConcierge")}</div>
      <div style=${{color:P.muted,fontSize:13}}>${t("yourCompanion")}</div>
    </div>
    <div style=${{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,paddingBottom:12}}>
      ${messages.map((m,i) => html`
        <div key=${i} style=${{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8,alignItems:"flex-end"}}>
          ${m.role==="assistant" && html`<div style=${{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🎁</div>`}
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
        <div style=${{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${P.goldD},${P.gold})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🎁</div>
        <div style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:"18px 18px 18px 4px",padding:"11px 15px",color:P.muted,fontSize:14}}>${t("findingGifts")}</div>
      </div>`}
      <div ref=${bottomRef}/>
    </div>
    <div style=${{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
      ${QUICK.map(q => html`<button key=${q} onClick=${()=>send(q)} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:99,padding:"6px 12px",fontSize:11,color:P.muted,cursor:"pointer",fontWeight:600}}>${q}</button>`)}
    </div>
    <div style=${{display:"flex",gap:8}}>
      <textarea value=${input} onInput=${e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}} onKeyDown=${e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder=${t("conciergeInput")} rows="1" style=${{flex:1,background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"12px 14px",color:P.text,fontSize:14,resize:"none",outline:"none",lineHeight:1.4,maxHeight:"120px",overflowY:"auto"}}/>
      <button onClick=${()=>send()} disabled=${loading} style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",borderRadius:12,padding:"12px 16px",color:"#000",fontWeight:700,fontSize:18,cursor:"pointer",flexShrink:0}}>→</button>
    </div>
  </div>`;
}

// ── MAIN APP ──
function MainApp({session, profile, setProfile, onLangChange}) {
  const [tab,setTab] = useState("home");
  const [viewingFriend,setViewingFriend] = useState(null);
  const [feed,setFeed] = useState([]);
  const [feedLoading,setFeedLoading] = useState(true);
  const [following,setFollowing] = useState([]);
  const [searchQ,setSearchQ] = useState("");
  const [searchResults,setSearchResults] = useState([]);
  const [toast,setToast] = useState(null);

  // Set global userId for analytics as soon as MainApp mounts
  useEffect(() => {
    _currentUserId = profile.id;
    track("session_start", {city: profile.city, interests: profile.interests});
    sb.from("profiles").update({last_active: new Date().toISOString()}).eq("id", profile.id).then(()=>{});
    return () => { track("session_end", {}); };
  }, []);

  const goTab = t => { trackTabView(t); setTab(t); };

  const loadFollowing = async () => {
    const {data} = await sb.from("follows").select("following_id").eq("follower_id",profile.id);
    setFollowing((data||[]).map(f=>f.following_id));
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
    })).sort((a,b) => (a.occasions[0]?daysUntil(a.occasions[0].date):999) - (b.occasions[0]?daysUntil(b.occasions[0].date):999));
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

  const toggleFollow = async targetId => {
    const isF = following.includes(targetId);
    if(isF) {
      await sb.from("follows").delete().eq("follower_id",profile.id).eq("following_id",targetId);
      setFollowing(f => f.filter(id=>id!==targetId));
      setToast("Unfollowed");
      track("unfollow", {target_id: targetId});
    } else {
      await sb.from("follows").insert({follower_id:profile.id, following_id:targetId});
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
    {id:"home",icon:"🏠",label:t("home")},
    {id:"search",icon:"🔍",label:t("search")},
    {id:"groups",icon:"👥",label:t("groups")},
    {id:"concierge",icon:"💬",label:t("concierge")},
    {id:"profile",icon:"👤",label:t("profile")},
    {id:"stars",icon:"⭐",label:t("stars")}
  ];

  return html`
    <div style=${{background:P.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:74}}>
      <div style=${{background:P.card,borderBottom:`1px solid ${P.border}`,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div style=${{display:"flex",alignItems:"center",gap:8}}>
          <svg width="32" height="32" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="22" fill="#F4A438"/><text x="22" y="20" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="900" font-size="11" fill="#0A0A18" letter-spacing="0.5">gift</text><text x="22" y="32" text-anchor="middle" font-family="Arial Black,Impact,sans-serif" font-weight="900" font-size="13.5" fill="#0A0A18" letter-spacing="0.8">MATE</text></svg>
          <div style=${{fontFamily:"Georgia,serif",fontSize:22,fontWeight:900,color:P.text}}>gift<span style=${{color:P.gold}}>mate</span></div>
        </div>
        <div style=${{display:"flex",alignItems:"center",gap:10}}>
          <div style=${{fontSize:13,color:P.gold,fontWeight:700}}>⭐ ${profile.stars||0}</div>
          <${Avatar} emoji=${profile.emoji} avatarUrl=${profile.avatar_url} size=${32}/>
        </div>
      </div>

      <div style=${{padding:"16px 16px 0"}}>
        ${tab==="home" && (feedLoading
          ? html`<div style=${{textAlign:"center",padding:40,color:P.muted}}>Loading feed… 🎁</div>`
          : feed.length===0
            ? html`<div style=${{textAlign:"center",padding:40}}>
                <div style=${{fontSize:52,marginBottom:12}}>👥</div>
                <div style=${{fontWeight:700,fontSize:18,color:P.text,marginBottom:8}}>${t("findFriends")}</div>
                <div style=${{color:P.muted,fontSize:14,lineHeight:1.5,marginBottom:18}}>${t("searchFriendsHint")}</div>
                <button onClick=${()=>goTab("search")} style=${{background:`linear-gradient(135deg,${P.goldD},${P.gold})`,color:"#000",border:"none",borderRadius:12,padding:"12px 28px",fontWeight:700,fontSize:14,cursor:"pointer"}}>${t("search")} 🔍</button>
              </div>`
            : html`<div>
                <div style=${{fontWeight:700,fontSize:18,color:P.text,marginBottom:14}}>${t("upcomingOccasions")}</div>
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
                      <div><div style=${{fontSize:13,fontWeight:600,color:P.text}}>${t("birthdayLabel")}</div><div style=${{fontSize:12,color:P.muted}}>${fmtDate(fr.birthday)}</div></div>
                      <div style=${{fontSize:12,fontWeight:700,color:daysUntil(fr.birthday)<=30?P.gold:P.muted}}>${daysUntil(fr.birthday)}d</div>
                    </div>`}
                    ${occs.slice(0,2).map(o => { const d=daysUntil(o.date); return html`
                      <div key=${o.id} style=${{background:P.bg,borderRadius:10,padding:"9px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div><div style=${{fontSize:13,fontWeight:600,color:P.text}}>${translateOccasion(o.type)}</div><div style=${{fontSize:12,color:P.muted}}>${fmtDate(o.date)}</div></div>
                        <div style=${{fontSize:12,fontWeight:700,color:d<=7?P.red:d<=30?P.gold:P.muted}}>${d===0?t("todayLabel"):d===1?t("tomorrowLabel"):`${d}${t("daysLabel")}`}</div>
                      </div>`; })}
                  </div>`)}
              </div>`)}

        ${tab==="search" && html`<div>
          <div style=${{fontWeight:700,fontSize:18,color:P.text,marginBottom:14}}>${t("search")} 🔍</div>
          <input value=${searchQ} onInput=${e=>setSearchQ(e.target.value)} placeholder="${t("searchPlaceholder")}" style=${{width:"100%",background:P.card,border:`1px solid ${P.border}`,borderRadius:12,padding:"13px 16px",color:P.text,fontSize:14,marginBottom:14,boxSizing:"border-box",outline:"none"}}/>
          ${searchResults.map(u => html`
            <div key=${u.id} style=${{background:P.card,border:`1px solid ${P.border}`,borderRadius:14,padding:"14px 16px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
              <${Avatar} emoji=${u.emoji} avatarUrl=${u.avatar_url} size=${46}/>
              <div style=${{flex:1}}>
                <div style=${{fontWeight:700,color:P.text}}>${u.display_name}</div>
                <div style=${{fontSize:13,color:P.muted}}>@${u.username}</div>
                ${u.interests?.length>0 && html`<div style=${{fontSize:11,color:P.muted,marginTop:2}}>${u.interests.slice(0,3).join(" · ")}</div>`}
              </div>
              <div style=${{display:"flex",flexDirection:"column",gap:6}}>
                <button onClick=${()=>viewFriend(u)} style=${{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,color:P.goldL,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>${t("viewProfile")}</button>
                <button onClick=${()=>toggleFollow(u.id)} style=${{background:following.includes(u.id)?P.border:`linear-gradient(135deg,${P.goldD},${P.gold})`,border:"none",color:following.includes(u.id)?P.muted:"#000",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>${following.includes(u.id)?t("following"):t("follow")}</button>
              </div>
            </div>`)}
          ${searchQ && searchResults.length===0 && html`<div style=${{textAlign:"center",color:P.muted,padding:20}}>${t("noResults")}</div>`}
        </div>`}

        ${tab==="friend" && viewingFriend && html`<${FriendProfile} friend=${viewingFriend} myProfile=${profile} following=${following} onToggleFollow=${toggleFollow} onBack=${()=>setTab("home")}/>`}
        ${tab==="groups" && html`<${GroupsTab} profile=${profile} following=${following} feed=${feed}/>`}
        ${tab==="concierge" && html`<${ConciergeTab} profile=${profile}/>`}
        ${tab==="profile" && html`<${MyProfile} profile=${profile} setProfile=${setProfile} friendsOccasions=${feed.flatMap(f=>f.occasions)} onLangChange=${onLangChange}/>`}
        ${tab==="stars" && html`<${StarsTab} profile=${profile} setProfile=${setProfile}/>`}
      </div>

      <div style=${{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:P.card,borderTop:`1px solid ${P.border}`,display:"flex",zIndex:100}}>
        ${TABS.map(t => html`
          <button key=${t.id} onClick=${()=>goTab(t.id)} style=${{flex:1,padding:"8px 0",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
            <span style=${{fontSize:18}}>${t.icon}</span>
            <span style=${{fontSize:9,color:tab===t.id?P.gold:P.muted,fontWeight:tab===t.id?700:400}}>${t.label}</span>
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
  const [lang,setLangState] = useState("en");

  const changeLang = code => { setLang(code); setLangState(code); };

  const loadProfile = async uid => {
    const {data} = await sb.from("profiles").select("*").eq("id",uid).single();
    if(data?.language) changeLang(data.language);
    else { const b = navigator.language?.slice(0,2)||"en"; changeLang(TRANSLATIONS[b]?b:"en"); }
    setProfile(data||null);
    setLoading(false);
  };

  useEffect(() => {
    sb.auth.getSession().then(({data:{session}}) => {
      setSession(session);
      if(session) loadProfile(session.user.id);
      else setLoading(false);
    });
    const {data:{subscription}} = sb.auth.onAuthStateChange((_e,session) => {
      setSession(session);
      if(session) loadProfile(session.user.id);
      else { setSession(null); setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = (session, isNew) => {
    setSession(session);
    if(isNew) { setProfile(null); setLoading(false); }
    else if(session) loadProfile(session.user.id);
  };

  if(loading) return html`<${Spin}/>`;
  if(!session) return html`<${AuthScreen} onAuth=${handleAuth}/>`;
  if(!profile) return html`<${Onboarding} userId=${session.user.id} onComplete=${()=>loadProfile(session.user.id)}/>`;
  return html`<${MainApp} key=${lang} session=${session} profile=${profile} setProfile=${setProfile} onLangChange=${changeLang}/>`;
}

ReactDOM.createRoot(document.getElementById("root")).render(html`<${Giftmate}/>`);
