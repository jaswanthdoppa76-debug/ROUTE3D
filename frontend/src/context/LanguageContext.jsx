import React, { createContext, useContext, useState, useEffect } from 'react';

const TRANSLATIONS = {
  en: {
    // Navigation & Common
    appTitle: 'JD Bus Services',
    appSubtitle: 'AP & TELANGANA MOBILITY',
    searchBuses: 'Search Buses',
    myBookings: 'My Bookings',
    adminPortal: 'Admin Command',
    adminBadge: 'ADMIN',
    passengerBadge: 'PASSENGER',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    customerSite: '← Customer Site',
    themeCustomizer: 'Theme & Colors',
    helpSupport: 'AI Help & Live Bus',
    trackBus: 'Where is my Bus?',

    // Home Page
    officialNetworkBadge: 'Official AP & Telangana Inter-State 3D Booking Network',
    heroTitle1: 'Next-Gen 3D Bus Travel Across',
    heroTitle2: 'Andhra Pradesh & Telangana',
    heroDescription: 'Book RTC Super Luxury, Lahari Sleeper, Amaravati Scania, and Garuda Plus with interactive 3D seat views, live bus telemetry, and instant confirmed e-tickets.',
    fromCity: 'From City',
    toCity: 'To City',
    travelDate: 'Travel Date',
    passengers: 'Passengers',
    swapCities: 'Swap Cities',
    findBusesBtn: 'Find Verified Buses',
    quickCorridors: 'Popular Inter-State Corridors',
    verifiedOperatorsTitle: 'Verified State Fleet Operators',
    tgsrtcDesc: 'Serving Hyderabad, Warangal, Nizamabad, Karimnagar & Inter-state expressways.',
    apsrtcDesc: 'Connecting Vijayawada, Visakhapatnam, Tirupati, Guntur, Kurnool & Amaravati.',

    // Search Results Page
    verifiedServices: 'Verified Services Available',
    filters: 'Filters',
    operator: 'Operator',
    allOperators: 'All RTC Fleets',
    busType: 'Bus Category',
    allTypes: 'All Bus Types',
    seater: '2+2 Seater Express',
    sleeper: '2+1 Luxury Sleeper',
    multiAxle: 'Multi-Axle AC Luxury',
    timeSlot: 'Departure Time',
    allDay: 'All Day (24 Hours)',
    morning: 'Morning (06:00 - 12:00)',
    afternoon: 'Afternoon (12:00 - 18:00)',
    evening: 'Evening (18:00 - 23:00)',
    night: 'Night (23:00 - 06:00)',
    maxFare: 'Maximum Fare',
    seatsAvailable: 'Seats Left',
    selectSeats: 'Select Seats',
    trackLive: 'Track Live',
    noBusesFound: 'No buses match your current search filters.',

    // Seat Selection Page
    selectYourSeats: 'Select Your Preferred Seats',
    busWindshield: 'FRONT / DRIVER CABIN',
    available: 'Available',
    selected: 'Selected',
    booked: 'Booked',
    selectedSeatsCount: 'Selected Seats',
    totalAmount: 'Total Fare',
    proceedToDetails: 'Proceed to Passenger Details',
    selectAtLeastOne: 'Please select at least one seat to proceed.',

    // Passenger Details Page
    passengerDetailsTitle: 'Passenger & Boarding Information',
    passengerName: 'Passenger Full Name',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    contactNumber: 'Mobile Phone Number',
    contactEmail: 'Email Address for E-Ticket',
    boardingPoint: 'Boarding Point',
    droppingPoint: 'Dropping Point',
    paymentMethod: 'Choose Payment Method',
    upiPay: 'UPI / QR (PhonePe, GPay)',
    cardPay: 'Debit / Credit Card',
    netBanking: 'Net Banking',
    confirmPayBtn: 'Pay & Confirm Reservation',

    // Confirmation Page
    bookingConfirmed: 'Booking Confirmed Successfully!',
    bookingRef: 'Booking Reference Number',
    downloadTicket: 'Download PDF Ticket',
    printTicket: 'Print E-Ticket',
    scanQR: 'Scan QR at Bus Boarding',
    viewMyBookings: 'View in My Bookings',

    // My Bookings
    myBookingsTitle: 'My Travel Reservations',
    noBookingsYet: 'No active bookings found.',
    cancelBooking: 'Cancel Reservation',
    confirmCancel: 'Are you sure you want to cancel this ticket? Refund will be processed as per RTC guidelines.',
    ticketStatus: 'Status',
    statusConfirmed: 'CONFIRMED',
    statusCancelled: 'CANCELLED',

    // AI Chatbot
    aiTitle: 'JD Bus Sarathi AI',
    aiSubtitle: 'AP & Telangana Mobility Assistant',
    aiWelcome: 'Namaste! I am your JD Bus AI Assistant. How can I help your travel across Andhra Pradesh & Telangana today?',
    chipWhereIsMyBus: '📍 Where is my bus?',
    chipHyderabadVijayawada: '🎫 Hyderabad ⇄ Vijayawada',
    chipCancellation: '💸 Cancellation policy',
    chipContactAdmin: '📞 Contact Administrator',
    askQuestionPlaceholder: 'Ask about buses, live tracking, or routes...',
    sendBtn: 'Send',
    officialAdminEmail: 'Official Administrator: jaswanthdoppa76@gmail.com',

    // Footer
    officialContact: 'Official Administrator Contact',
    rightsReserved: 'JD Bus Services. Andhra Pradesh & Telangana Inter-State Mobility.',
  },

  hi: {
    // Navigation & Common
    appTitle: 'JD Bus Services',
    appSubtitle: 'आंध्र प्रदेश एवं तेलंगाना मोबिलिटी',
    searchBuses: 'बसें खोजें',
    myBookings: 'मेरी बुकिंग्स',
    adminPortal: 'एडमिन पोर्टल',
    adminBadge: 'एडमिन',
    passengerBadge: 'यात्री',
    signIn: 'लॉग इन करें',
    signOut: 'लॉग आउट',
    customerSite: '← यात्री पोर्टल',
    themeCustomizer: 'थीम और रंग',
    helpSupport: 'एआई सहायता एवं लाइव बस',
    trackBus: 'मेरी बस कहाँ है?',

    // Home Page
    officialNetworkBadge: 'आधिकारिक आंध्र एवं तेलंगाना 3D बस आरक्षण नेटवर्क',
    heroTitle1: 'अगली पीढ़ी की 3D बस यात्रा',
    heroTitle2: 'आंध्र प्रदेश और तेलंगाना में',
    heroDescription: 'आरसीटीसी सुपर लग्जरी, लहरी स्लीपर, अमरावती स्कैनिया और गरुड़ प्लस की सीटें 3D व्यू, लाइव ट्रैकिंग और त्वरित ई-टिकट के साथ बुक करें।',
    fromCity: 'प्रस्थान शहर (From)',
    toCity: 'गंतव्य शहर (To)',
    travelDate: 'यात्रा तिथि',
    passengers: 'यात्री संख्या',
    swapCities: 'शहर बदलें',
    findBusesBtn: 'सत्यापित बसें खोजें',
    quickCorridors: 'प्रमुख अंतर-राज्यीय मार्ग',
    verifiedOperatorsTitle: 'सत्यापित राज्य परिवहन संचालक',
    tgsrtcDesc: 'हैदराबाद, वारंगल, निज़ामाबाद, करीमनगर एक्सप्रेसवे सेवा।',
    apsrtcDesc: 'विजयवाड़ा, विशाखापट्टनम, तिरुपति, गुंटूर, कर्नूल एवं अमरावती को जोड़ती है।',

    // Search Results Page
    verifiedServices: 'सत्यापित बस सेवाएं उपलब्ध',
    filters: 'फ़िल्टर',
    operator: 'ऑपरेटर',
    allOperators: 'सभी आरटीसी फ्लीट',
    busType: 'बस श्रेणी',
    allTypes: 'सभी प्रकार की बसें',
    seater: '2+2 सीटर एक्सप्रेस',
    sleeper: '2+1 लग्जरी स्लीपर',
    multiAxle: 'मल्टी-एक्सल एसी लग्जरी',
    timeSlot: 'प्रस्थान समय',
    allDay: 'पूरे 24 घंटे',
    morning: 'सुबह (06:00 - 12:00)',
    afternoon: 'दोपहर (12:00 - 18:00)',
    evening: 'शाम (18:00 - 23:00)',
    night: 'रात (23:00 - 06:00)',
    maxFare: 'अधिकतम किराया',
    seatsAvailable: 'सीटें शेष',
    selectSeats: 'सीटें चुनें',
    trackLive: 'लाइव ट्रैक करें',
    noBusesFound: 'वर्तमान फ़िल्टर के अनुसार कोई बस नहीं मिली।',

    // Seat Selection Page
    selectYourSeats: 'अपनी पसंदीदा सीटें चुनें',
    busWindshield: 'सामने / ड्राइवर केबिन',
    available: 'उपलब्ध',
    selected: 'चुनी गई',
    booked: 'आरक्षित',
    selectedSeatsCount: 'चुनी गई सीटें',
    totalAmount: 'कुल किराया',
    proceedToDetails: 'यात्री विवरण पर आगे बढ़ें',
    selectAtLeastOne: 'कृपया आगे बढ़ने के लिए कम से कम एक सीट चुनें।',

    // Passenger Details Page
    passengerDetailsTitle: 'यात्री एवं बोर्डिंग विवरण',
    passengerName: 'यात्री का पूरा नाम',
    age: 'आयु',
    gender: 'लिंग',
    male: 'पुरुष',
    female: 'महिला',
    contactNumber: 'मोबाइल फ़ोन नंबर',
    contactEmail: 'ई-टिकट हेतु ईमेल',
    boardingPoint: 'बोर्डिंग पॉइंट',
    droppingPoint: 'ड्रॉपिंग पॉइंट',
    paymentMethod: 'भुगतान विधि चुनें',
    upiPay: 'यूपीआई / क्यूआर (PhonePe, GPay)',
    cardPay: 'डेबिट / क्रेडिट कार्ड',
    netBanking: 'नेट बैंकिंग',
    confirmPayBtn: 'भुगतान करें और टिकट सुरक्षित करें',

    // Confirmation Page
    bookingConfirmed: 'बुकिंग सफलतापूर्वक सुनिश्चित हो गई!',
    bookingRef: 'बुकिंग संदर्भ संख्या',
    downloadTicket: 'पीडीएफ टिकट डाउनलोड करें',
    printTicket: 'टिकट प्रिंट करें',
    scanQR: 'बोर्डिंग के समय क्यूआर कोड दिखाएं',
    viewMyBookings: 'मेरी बुकिंग्स में देखें',

    // My Bookings
    myBookingsTitle: 'मेरी यात्रा बुकिंग्स',
    noBookingsYet: 'कोई सक्रिय बुकिंग नहीं मिली।',
    cancelBooking: 'टिकट रद्द करें',
    confirmCancel: 'क्या आप इस टिकट को रद्द करना चाहते हैं? रिफंड आरटीसी नियमानुसार प्राप्त होगा।',
    ticketStatus: 'स्थिति',
    statusConfirmed: 'कन्फर्म्ड',
    statusCancelled: 'रद्द किया गया',

    // AI Chatbot
    aiTitle: 'JD Bus सारथी एआई',
    aiSubtitle: 'आंध्र एवं तेलंगाना यात्रा सहायक',
    aiWelcome: 'नमस्ते! मैं आपका JD Bus एआई सहायक हूँ। आंध्र प्रदेश और तेलंगाना में यात्रा के लिए मैं आपकी क्या सहायता कर सकता हूँ?',
    chipWhereIsMyBus: '📍 मेरी बस कहाँ है?',
    chipHyderabadVijayawada: '🎫 हैदराबाद ⇄ विजयवाड़ा',
    chipCancellation: '💸 कैंसलेशन नियम',
    chipContactAdmin: '📞 एडमिन से संपर्क करें',
    askQuestionPlaceholder: 'बसों, लाइव ट्रैकिंग या रूट के बारे में पूछें...',
    sendBtn: 'भेजें',
    officialAdminEmail: 'आधिकारिक व्यवस्थापक: jaswanthdoppa76@gmail.com',

    // Footer
    officialContact: 'आधिकारिक व्यवस्थापक संपर्क',
    rightsReserved: 'JD Bus Services। आंध्र प्रदेश एवं तेलंगाना अंतर-राज्यीय मोबिलिटी।',
  },

  te: {
    // Navigation & Common
    appTitle: 'JD Bus Services',
    appSubtitle: 'ఏపీ & తెలంగాణ మొబిలిటీ',
    searchBuses: 'బస్సులను వెతకండి',
    myBookings: 'నా బుకింగ్స్',
    adminPortal: 'అడ్మిన్ కమాండ్ పోర్టల్',
    adminBadge: 'అడ్మిన్',
    passengerBadge: 'ప్రయాణికుడు',
    signIn: 'లాగిన్ చేయండి',
    signOut: 'లాగౌట్',
    customerSite: '← ప్రయాణీకుల పోర్టల్',
    themeCustomizer: 'థీమ్ & రంగులు',
    helpSupport: 'AI సహాయం & లైవ్ బస్సు',
    trackBus: 'నా బస్సు ఎక్కడ ఉంది?',

    // Home Page
    officialNetworkBadge: 'అధికారిక ఏపీ & తెలంగాణ అంతర్రాష్ట్ర 3D బస్ బుకింగ్ నెట్వర్క్',
    heroTitle1: 'నూతన తరం 3D బస్సు ప్రయాణం',
    heroTitle2: 'ఆంధ్రప్రదేశ్ & తెలంగాణలో',
    heroDescription: 'ఆర్టీసీ సూపర్ లగ్జరీ, లహరి స్లీపర్, అమరావతి స్కానియా మరియు గరుడ ప్లస్ బస్సులను 3D వ్యూ, లైవ్ బస్ ట్రాకింగ్ మరియు తక్షణ ఈ-టికెట్లతో సులభంగా బుక్ చేసుకోండి.',
    fromCity: 'బయలుదేరే ఊరు (From)',
    toCity: 'చేరుకునే ఊరు (To)',
    travelDate: 'ప్రయాణ తేదీ',
    passengers: 'ప్రయాణికుల సంఖ్య',
    swapCities: 'ఊర్లను మార్చు',
    findBusesBtn: 'ధృవీకరించిన బస్సులను వెతకండి',
    quickCorridors: 'ప్రముఖ అంతర్రాష్ట్ర మార్గాలు',
    verifiedOperatorsTitle: 'అధికారిక రాష్ట్ర రవాణా సంస్థలు',
    tgsrtcDesc: 'హైదరాబాద్, వరంగల్, నిజామాబాద్, కరీంనగర్ ఎక్స్‌ప్రెస్ మార్గాల సేవలు.',
    apsrtcDesc: 'విజయవాడ, విశాఖపట్నం, తిరుపతి, గుంటూరు, కర్నూలు మరియు అమరావతి అనుసంధానం.',

    // Search Results Page
    verifiedServices: 'అందుబాటులో ఉన్న బస్సు సర్వీసులు',
    filters: 'ఫిల్టర్లు',
    operator: 'ఆర్టీసీ ఆపరేటర్',
    allOperators: 'అన్ని ఆర్టీసీ ఫ్లీట్లు',
    busType: 'బస్సు రకం',
    allTypes: 'అన్ని బస్సు రకాలు',
    seater: '2+2 సీటర్ ఎక్స్‌ప్రెస్',
    sleeper: '2+1 లగ్జరీ స్లీపర్',
    multiAxle: 'మల్టీ-యాక్సిల్ ఏసీ లగ్జరీ',
    timeSlot: 'బయలుదేరే సమయం',
    allDay: '24 గంటలు',
    morning: 'ఉదయం (06:00 - 12:00)',
    afternoon: 'మధ్యాహ్నం (12:00 - 18:00)',
    evening: 'సాయంత్రం (18:00 - 23:00)',
    night: 'రాత్రి (23:00 - 06:00)',
    maxFare: 'గరిష్ట ధర',
    seatsAvailable: 'మిగిలిన సీట్లు',
    selectSeats: 'సీట్లను ఎంచుకోండి',
    trackLive: 'లైవ్ ట్రాక్ చేయండి',
    noBusesFound: 'ఎంచుకున్న ఫిల్టర్లకు సరిపోలే బస్సులు లభించలేదు.',

    // Seat Selection Page
    selectYourSeats: 'మీకు నచ్చిన సీట్లను ఎంచుకోండి',
    busWindshield: 'ముందు భాగం / డ్రైవర్ క్యాబిన్',
    available: 'అందుబాటులో ఉన్నాయి',
    selected: 'ఎంచుకున్నవి',
    booked: 'బుక్ అయినవి',
    selectedSeatsCount: 'ఎంచుకున్న సీట్లు',
    totalAmount: 'మొత్తం ఛార్జీ',
    proceedToDetails: 'ప్రయాణికుల వివరాలకు వెళ్ళండి',
    selectAtLeastOne: 'దయచేసి ముందుకు సాగడానికి కనీసం ఒక సీటును ఎంచుకోండి.',

    // Passenger Details Page
    passengerDetailsTitle: 'ప్రయాణికుల & బోర్డింగ్ వివరాలు',
    passengerName: 'ప్రయాణికుడి పూర్తి పేరు',
    age: 'వయస్సు',
    gender: 'లింగం',
    male: 'పురుషుడు',
    female: 'స్త్రీ',
    contactNumber: 'మొబైల్ ఫోన్ నంబర్',
    contactEmail: 'ఈ-టికెట్ కోసం ఈమెయిల్',
    boardingPoint: 'బోర్డింగ్ పాయింట్',
    droppingPoint: 'డ్రాపింగ్ పాయింట్',
    paymentMethod: 'చెల్లింపు విధానం ఎంచుకోండి',
    upiPay: 'యూపీఐ / క్యూఆర్ (PhonePe, GPay)',
    cardPay: 'డెబిట్ / క్రెడిట్ కార్డు',
    netBanking: 'నెట్ బ్యాంకింగ్',
    confirmPayBtn: 'చెల్లించి రిజర్వేషన్ నిర్ధారించండి',

    // Confirmation Page
    bookingConfirmed: 'బుకింగ్ విజయవంతంగా నిర్ధారించబడింది!',
    bookingRef: 'బుకింగ్ రిఫరెన్స్ నంబర్',
    downloadTicket: 'పీడీఎఫ్ టికెట్ డౌన్‌లోడ్',
    printTicket: 'టికెట్ ప్రింట్ చేయండి',
    scanQR: 'బస్సు ఎక్కేటప్పుడు ఈ క్యూఆర్ స్కాన్ చేయించండి',
    viewMyBookings: 'నా బుకింగ్స్‌లో చూడండి',

    // My Bookings
    myBookingsTitle: 'నా ప్రయాణ బుకింగ్స్',
    noBookingsYet: 'ఎలాంటి యాక్టివ్ బుకింగ్స్ లేవు.',
    cancelBooking: 'టికెట్ రద్దు చేయండి',
    confirmCancel: 'ఖచ్చితంగా ఈ టికెట్ రద్దు చేయాలనుకుంటున్నారా? ఆర్టీసీ నిబంధనల ప్రకారం రీఫండ్ ఇవ్వబడుతుంది.',
    ticketStatus: 'స్థితి',
    statusConfirmed: 'ధృవీకరించబడింది',
    statusCancelled: 'రద్దు చేయబడింది',

    // AI Chatbot
    aiTitle: 'JD Bus సారథి AI',
    aiSubtitle: 'ఏపీ & తెలంగాణ ప్రయాణ సహాయకుడు',
    aiWelcome: 'నమస్కారం! నేను మీ JD Bus AI అసిస్టెంట్ సారథిని. ఆంధ్రప్రదేశ్ మరియు తెలంగాణ ప్రయాణంలో మీకు ఏ విధంగా సహాయపడగలను?',
    chipWhereIsMyBus: '📍 నా బస్సు ఎక్కడ ఉంది?',
    chipHyderabadVijayawada: '🎫 హైదరాబాద్ ⇄ విజయవాడ బస్సులు',
    chipCancellation: '💸 క్యాన్సిలేషన్ నియమాలు',
    chipContactAdmin: '📞 అడ్మిన్‌ను సంప్రదించండి',
    askQuestionPlaceholder: 'బస్సులు, లైవ్ ట్రాకింగ్ లేదా రూట్ల గురించి అడగండి...',
    sendBtn: 'పంపు',
    officialAdminEmail: 'అధికారిక అడ్మినిస్ట్రేటర్: jaswanthdoppa76@gmail.com',

    // Footer
    officialContact: 'అధికారిక అడ్మినిస్ట్రేటర్ సంప్రదింపు',
    rightsReserved: 'JD Bus Services. ఆంధ్రప్రదేశ్ & తెలంగాణ అంతర్రాష్ట్ర మొబిలిటీ.',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('route3d_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('route3d_lang', language);
  }, [language]);

  const t = (key) => {
    if (TRANSLATIONS[language] && TRANSLATIONS[language][key]) {
      return TRANSLATIONS[language][key];
    }
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
      return TRANSLATIONS['en'][key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: ['en', 'hi', 'te'] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
