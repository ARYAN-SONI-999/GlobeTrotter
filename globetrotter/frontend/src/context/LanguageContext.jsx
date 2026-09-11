import React, { createContext, useContext, useState } from 'react';

const TRANSLATIONS = {
  en: {
    brand: 'GlobeTrotter',
    dashboard: 'Dashboard',
    aiPlanner: '⚡ AI Planner',
    placesToVisit: '📍 Places to Visit',
    myTrips: 'My Trips',
    activities: 'Activities',
    community: 'Community',
    welcome: 'Welcome back',
    travelHq: 'Your Travel HQ',
    heroSubtitle: 'Ready to plan your next journey? Track your itineraries, discover destinations, and stay on budget effortlessly.',
    aiAutoPlannerBtn: '⚡ AI Auto-Planner',
    travelVibeQuizBtn: '🎯 Travel Vibe Quiz',
    placesBtn: '📍 Places to Visit',
    manualTripBtn: '+ Manual Trip',
    recentItineraries: 'Recent Itineraries',
    recentSub: 'Your planned and ongoing journeys',
    trendingDestinations: 'Trending Destinations & Sights',
    trendingSub: 'Top-rated holiday spots with curated attractions',
    viewAllTrips: 'View all trips',
    exploreAllSights: 'Explore all sights',
    totalTrips: 'Total Trips Created',
    upcomingAdventures: 'Upcoming Adventures',
    sharedPublicTrips: 'Public Shared Trips',
    featuredCities: 'Featured Cities',

    plannerTitle: 'Smart AI Trip Planner',
    plannerSub: 'Generate custom day-by-day travel itineraries in seconds.',
    destinationLabel: '📍 Destination Location',
    startDateLabel: '📅 Start Date',
    endDateLabel: '📅 End Date',
    travelPace: '⏱️ Travel Pace',
    budgetTier: '💰 Budget Tier',
    travelerGroup: '👥 Traveler Group',
    generateSchedule: '⚡ Generate AI Schedule',
    refinePlan: '🔄 Refine Plan',
    smartPacking: '🧳 Smart Packing Checklist',
    shareTrip: '📲 Share Trip & QR',
    saveTrip: '💾 Save to My Trips & Edit',

    searchPlaces: 'Search places, cities or categories...',
    budgetINR: 'Budget in ₹ INR',
    emergencyHelplines: 'Emergency Helplines',
    exportPDF: 'Export PDF Guide',
    addToCalendar: 'Add to Calendar',
  },
  hi: {
    brand: 'ग्लोबट्रॉटर',
    dashboard: 'डैशबोर्ड',
    aiPlanner: '⚡ एआई प्लानर',
    placesToVisit: '📍 घूमने की जगहें',
    myTrips: 'मेरी यात्राएं',
    activities: 'गतिविधियां',
    community: 'कम्युनिटी',
    welcome: 'आपका स्वागत है',
    travelHq: 'आपका ट्रैवल मुख्यालय',
    heroSubtitle: 'अपनी अगली यात्रा की योजना बनाने के लिए तैयार हैं? अपने यात्रा मार्गों को ट्रैक करें और नए स्थानों की खोज करें।',
    aiAutoPlannerBtn: '⚡ एआई ऑटो-प्लानर',
    travelVibeQuizBtn: '🎯 ट्रैवल क्विज़',
    placesBtn: '📍 घूमने की जगहें',
    manualTripBtn: '+ नई यात्रा',
    recentItineraries: 'हाल की यात्राएं',
    recentSub: 'आपकी नियोजित और जारी यात्राएं',
    trendingDestinations: 'प्रसिद्ध स्थान और दर्शनीय स्थल',
    trendingSub: 'शीर्ष श्रेणी के छुट्टी स्थल',
    viewAllTrips: 'सभी यात्राएं देखें',
    exploreAllSights: 'सभी स्थान खोजें',
    totalTrips: 'कुल बनाई गई यात्राएं',
    upcomingAdventures: 'आगामी यात्राएं',
    sharedPublicTrips: 'सार्वजनिक शेयर की गई यात्राएं',
    featuredCities: 'प्रमुख शहर',

    plannerTitle: 'स्मार्ट एआई ट्रिप प्लानर',
    plannerSub: 'सेकंडों में दिन-प्रतिदिन यात्रा कार्यक्रम बनाएं।',
    destinationLabel: '📍 गंतव्य स्थान',
    startDateLabel: '📅 प्रारंभ तिथि',
    endDateLabel: '📅 अंतिम तिथि',
    travelPace: '⏱️ यात्रा की गति',
    budgetTier: '💰 बजट श्रेणी',
    travelerGroup: '👥 यात्री समूह',
    generateSchedule: '⚡ एआई शेड्यूल बनाएं',
    refinePlan: '🔄 प्लान में बदलाव करें',
    smartPacking: '🧳 स्मार्ट पैकिंग लिस्ट',
    shareTrip: '📲 शेयर ट्रिप और क्यूआर',
    saveTrip: '💾 मेरी यात्राओं में सहेजें',

    searchPlaces: 'स्थान, शहर या श्रेणियां खोजें...',
    budgetINR: 'बजट भारतीय रुपये (₹) में',
    emergencyHelplines: 'आपातकालीन हेल्पलाइन',
    exportPDF: 'पीडीएफ गाइड डाउनलोड करें',
    addToCalendar: 'कैलेंडर में जोड़ें',
  },
  gu: {
    brand: 'ગ્લોબટ્રોટર',
    dashboard: 'ડેશબોર્ડ',
    aiPlanner: '⚡ એઆઈ પ્લાનર',
    placesToVisit: '📍 મુલાકાત લેવાના સ્થળો',
    myTrips: 'મારી મુસાફરી',
    activities: 'પ્રવૃત્તિઓ',
    community: 'કમ્યુનિટી',
    welcome: 'આપનું સ્વાગત છે',
    travelHq: 'તમારું ટ્રાવેલ મુખ્યમથક',
    heroSubtitle: 'તમારી આગામી યાત્રાનું આયોજન કરવા માટે તૈયાર છો? તમારા પ્રવાસ માર્ગો ટ્રૅક કરો અને નવા સ્થળો શોધો.',
    aiAutoPlannerBtn: '⚡ એઆઈ ઓટો-પ્લાનર',
    travelVibeQuizBtn: '🎯 ટ્રાવેલ ક્વિઝ',
    placesBtn: '📍 મુલાકાત લેવાના સ્થળો',
    manualTripBtn: '+ નવી યાત્રા',
    recentItineraries: 'તાજેતરની મુસાફરી',
    recentSub: 'તમારી આયોજિત અને ચાલુ યાત્રાઓ',
    trendingDestinations: 'લોકપ્રિય સ્થળો અને દૃશ્યો',
    trendingSub: 'ટોચના રજાના સ્થળો',
    viewAllTrips: 'બધી મુસાફરી જુઓ',
    exploreAllSights: 'બધા સ્થળો શોધો',
    totalTrips: 'કુલ બનાવેલી યાત્રાઓ',
    upcomingAdventures: 'આગામી સાહસો',
    sharedPublicTrips: 'જાહેર શેર કરેલી યાત્રાઓ',
    featuredCities: 'મુખ્ય શહેરો',

    plannerTitle: 'સ્માર્ટ એઆઈ ટ્રીપ પ્લાનર',
    plannerSub: 'સેકંડોમાં દિવસ-દર-દિવસ પ્રવાસ માર્ગદર્શિકા બનાવો.',
    destinationLabel: '📍 ગંતવ્ય સ્થળ',
    startDateLabel: '📅 શરૂઆતની તારીખ',
    endDateLabel: '📅 અંતિમ તારીખ',
    travelPace: '⏱️ મુસાફરીની ઝડપ',
    budgetTier: '💰 બજેટ શ્રેણી',
    travelerGroup: '👥 મુસાફરોનું જૂથ',
    generateSchedule: '⚡ એઆઈ શેડ્યૂલ બનાવો',
    refinePlan: '🔄 પ્લાનમાં સુધારો કરો',
    smartPacking: '🧳 સ્માર્ટ પેકિંગ લિસ્ટ',
    shareTrip: '📲 ટ્રીપ શેર અને ક્યુઆર',
    saveTrip: '💾 મારી મુસાફરીમાં સેવ કરો',

    searchPlaces: 'સ્થળો, શહેરો અથવા શ્રેણીઓ શોધો...',
    budgetINR: 'બજેટ ભારતીય રૂપિયા (₹) માં',
    emergencyHelplines: 'ઇમરજન્સી હેલ્પલાઇન',
    exportPDF: 'પીડીએફ ગાઇડ ડાઉનલોડ કરો',
    addToCalendar: 'કેલેન્ડરમાં ઉમેરો',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('gt_lang') || 'en';
  });

  const setLang = (newLang) => {
    localStorage.setItem('gt_lang', newLang);
    setLangState(newLang);
  };

  const t = (key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
