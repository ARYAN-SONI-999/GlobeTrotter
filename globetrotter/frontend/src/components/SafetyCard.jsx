import React, { useState } from "react";

// ─── Static Safety Data ───────────────────────────────────────────────────────
const SAFETY_DATA = {
  matheran: {
    hospital: "Holy Spirit Hospital Karjat",
    safety: "Safe",
    bestTime: "October – June",
    avoidMonths: "July – September (heavy leeches & slippery trails)",
    etiquette: [
      "No vehicles allowed – walk or hire horseback",
      "Carry cash – limited ATMs",
      "Respect eco-zone rules – no plastics",
      "Leech socks recommended in monsoon",
    ],
  },
  lonavala: {
    hospital: "Lonavala Municipal Hospital",
    safety: "Safe",
    bestTime: "October – February",
    avoidMonths: "Peak monsoon (Jul–Aug) – dangerous cliff edges",
    etiquette: [
      "Avoid cliff edges at Tiger's Leap especially in rain",
      "Don't litter at waterfalls",
      "Be cautious driving in monsoon fog",
    ],
  },
  jaipur: {
    hospital: "SMS Medical College Hospital",
    safety: "Safe",
    bestTime: "November – February",
    avoidMonths: "May – June (extreme heat, 45 °C+)",
    etiquette: [
      "Dress modestly at temples and palaces",
      "Bargain respectfully at markets",
      "Avoid photography inside palaces without permission",
      "Accept chai offers graciously but check sealed bottles",
    ],
  },
  udaipur: {
    hospital: "RNT Medical College Hospital",
    safety: "Safe",
    bestTime: "September – March",
    avoidMonths: "April – June (scorching heat)",
    etiquette: [
      "Dress conservatively near temples",
      "Ask permission before photographing locals",
      "Boat rides – ensure life jackets are available",
    ],
  },
  rishikesh: {
    hospital: "AIIMS Rishikesh",
    safety: "Safe",
    bestTime: "September – June",
    avoidMonths: "July – August (river floods, rafting suspended)",
    etiquette: [
      "Vegetarian and alcohol-free zone in many areas",
      "Remove footwear at all ashrams and temples",
      "River rafting – always wear safety gear",
      "Respect sadhus and prayer times",
    ],
  },
  goa: {
    hospital: "Goa Medical College Panaji",
    safety: "Moderate",
    bestTime: "November – March",
    avoidMonths: "June – September (monsoon, most shacks closed)",
    etiquette: [
      "Wearing bikinis is only allowed on beaches – cover up in towns",
      "Avoid isolated beaches at night",
      "Use sunscreen – UV is intense",
      "Lock rooms and beware of tourist scams",
    ],
  },
  varanasi: {
    hospital: "BHU Sir Sundarlal Hospital",
    safety: "Moderate",
    bestTime: "October – March",
    avoidMonths: "May – June (extreme heat & humidity)",
    etiquette: [
      "Dress modestly near ghats and temples",
      "Shoes must be removed before temples",
      "Respect cremation rituals – don't photograph without permission",
      "Avoid street food from visibly unhygienic stalls",
    ],
  },
  ladakh: {
    hospital: "SNM District Hospital Leh",
    safety: "Safe",
    bestTime: "June – September",
    avoidMonths: "December – March (roads closed, extreme cold −20 °C)",
    etiquette: [
      "Acclimatize for 2 days before strenuous activity",
      "Carry altitude sickness pills (Diamox)",
      "Dress in warm layers even in summer",
      "Inner Line Permits required for Pangong and Nubra",
    ],
  },
  manali: {
    hospital: "Zonal Hospital Kullu",
    safety: "Safe",
    bestTime: "March – June & Sep – Nov",
    avoidMonths: "January – February (road closures, heavy snow)",
    etiquette: [
      "Carry snow boots in winter",
      "Inform hotel of Rohtang / Khardung La trips",
      "Respect Hadimba temple dress code",
    ],
  },
  kerala: {
    hospital: "Medical College Hospital Kochi",
    safety: "Safe",
    bestTime: "September – March",
    avoidMonths: "June – August (monsoon, backwater floods)",
    etiquette: [
      "Remove shoes before entering mosques and temples",
      "Respect conservative dress in rural areas",
      "Don't disturb elephant mahouts",
    ],
  },
};

const DEFAULT_DATA = {
  hospital: "Nearest District Hospital",
  safety: "Safe",
  bestTime: "October – March",
  avoidMonths: "Peak summer months (May – June)",
  etiquette: [
    "Respect local customs",
    "Carry ID proof always",
    "Stay hydrated",
    "Avoid isolated areas at night",
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SAFETY_META = {
  Safe:              { color: "#16a34a", bg: "#f0fdf4", border: "#16a34a", label: "✅ Safe" },
  Moderate:          { color: "#d97706", bg: "#fffbeb", border: "#d97706", label: "⚠️ Moderate" },
  "Exercise Caution":{ color: "#dc2626", bg: "#fef2f2", border: "#dc2626", label: "🚨 Exercise Caution" },
};

const NATIONAL_HELPLINES = [
  { icon: "🚔", label: "Police",           number: "112"  },
  { icon: "🚑", label: "Ambulance",        number: "108"  },
  { icon: "🔥", label: "Fire",             number: "101"  },
  { icon: "👩", label: "Women Helpline",   number: "1091" },
  { icon: "🏔️", label: "Tourist Helpline", number: "1363" },
  { icon: "🩺", label: "National Health",  number: "104"  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px", marginTop: "12px" }}>
      <div
        style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", userSelect:"none", fontWeight:600, fontSize:"14px", color:"#1f2937", marginBottom: open ? "10px" : 0 }}
        onClick={() => setOpen(p => !p)}
      >
        <span>{title}</span>
        <span style={{ fontSize:"12px", color:"#6b7280" }}>{open ? "▲ Hide" : "▼ Show"}</span>
      </div>
      {open && children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function SafetyCard({ destinationName = "Destination", state = "", countryName = "India" }) {
  const [expanded, setExpanded] = useState(true);
  const [countryInfo, setCountryInfo] = useState(null);
  const key = (destinationName || "").toLowerCase().replace(/[\s-]+/g, "");
  const data = SAFETY_DATA[key] || DEFAULT_DATA;
  const meta = SAFETY_META[data.safety] || SAFETY_META["Safe"];

  React.useEffect(() => {
    let isMounted = true;
    const query = countryName || (key.includes('paris') ? 'France' : (key.includes('tokyo') ? 'Japan' : (key.includes('bali') ? 'Indonesia' : 'India')));
    fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=false`)
      .then((r) => r.json())
      .then((arr) => {
        if (isMounted && Array.isArray(arr) && arr.length > 0) {
          const c = arr[0];
          setCountryInfo({
            name: c.name?.common || query,
            flag: c.flag || '🏳️',
            capital: c.capital?.[0] || '',
            currencies: Object.values(c.currencies || {}).map((cur) => `${cur.name} (${cur.symbol})`).join(', '),
            languages: Object.values(c.languages || {}).join(', '),
            callingCode: `${c.idd?.root || ''}${(c.idd?.suffixes || [])[0] || ''}`
          });
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [countryName, key]);

  const womensBadgeColor =
    data.safety === "Safe" ? "#16a34a" : data.safety === "Moderate" ? "#d97706" : "#dc2626";

  return (
    <div style={{ background:"#fff", borderRadius:"12px", boxShadow:"0 2px 12px rgba(0,0,0,0.08)", overflow:"hidden", fontFamily:"'Segoe UI',sans-serif", fontSize:"14px", marginBottom:"16px", borderLeft:`5px solid ${meta.border}` }} aria-label={`Safety info for ${destinationName}`}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", background:meta.bg, flexWrap:"wrap", gap:"8px" }}>
        <div>
          <h3 style={{ fontWeight:700, fontSize:"16px", color:"#111827", margin:0 }}>🚨 Safety, Emergency &amp; Travel Advisory</h3>
          <span style={{ fontSize:"11px", color:"#6b7280" }}>Live traveler protection network</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          {state && <span style={{ fontSize:"12px", color:"#6b7280" }}>{state}</span>}
          <span style={{ background:meta.color, color:"#fff", padding:"3px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:600 }}>{meta.label}</span>
        </div>
      </div>

      <div style={{ padding:"0 16px 16px" }}>
        {/* Live Country Essential Overview from REST Countries API */}
        {countryInfo && (
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px", marginTop: "12px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", fontSize: "12px", color: "#334155" }}>
            <span style={{ fontSize: "20px" }}>{countryInfo.flag}</span>
            <div>
              <strong>{countryInfo.name}</strong> • Calling Code: <strong>{countryInfo.callingCode || '+91'}</strong> • Capital: <strong>{countryInfo.capital}</strong>
              <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                Spoken: {countryInfo.languages} • Currency: {countryInfo.currencies}
              </div>
            </div>
          </div>
        )}

        <button
          style={{ display:"block", width:"100%", padding:"8px", marginTop:"12px", background:"#f3f4f6", border:"1px solid #d1d5db", borderRadius:"8px", cursor:"pointer", fontSize:"13px", color:"#374151", fontWeight:600, textAlign:"center" }}
          onClick={() => setExpanded(p => !p)}
          aria-expanded={expanded}
        >
          {expanded ? "▲ Hide Safety Details" : "▼ View Full Safety Guide & Helplines"}
        </button>

        {expanded && (
          <>
            {/* Section 1 – National Helplines (Clickable Dialers) */}
            <Section title="📞 24/7 National Emergency Helplines (Tap to Call)" defaultOpen={true}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"8px", marginTop:"4px" }}>
                {NATIONAL_HELPLINES.map(({ icon, label, number }) => (
                  <a
                    key={label}
                    href={`tel:${number}`}
                    style={{ background:"#f9fafb", border:`1px solid ${meta.color}33`, borderRadius:"8px", padding:"8px 10px", display:"flex", alignItems:"center", gap:"8px", textDecoration:"none", color:"inherit", cursor:"pointer", transition:"transform 0.1s" }}
                    title={`Call ${label} (${number})`}
                  >
                    <span style={{ fontSize:"18px" }}>{icon}</span>
                    <div>
                      <div style={{ fontSize:"11px", color:"#6b7280" }}>{label}</div>
                      <div style={{ fontWeight:700, color:meta.color, fontSize:"15px" }}>📞 {number}</div>
                    </div>
                  </a>
                ))}
              </div>
            </Section>

            {/* Section 2 – Local Hospital */}
            <Section title="🏥 Nearest Local Hospital" defaultOpen={true}>
              <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"8px", padding:"10px 12px", display:"flex", alignItems:"center", gap:"10px", marginTop:"4px" }}>
                <span style={{ fontSize:"22px" }}>🏥</span>
                <div>
                  <div style={{ fontWeight:600, color:"#166534" }}>{data.hospital}</div>
                  <div style={{ fontSize:"12px", color:"#6b7280" }}>Contact local directory (Just Dial: 88888-88888) for current number</div>
                </div>
              </div>
            </Section>

            {/* Section 3 – Cultural Etiquette */}
            <Section title="🙏 Cultural Etiquette Tips" defaultOpen={true}>
              <ul style={{ margin:"4px 0 0 0", paddingLeft:"18px", color:"#374151", lineHeight:"1.7" }}>
                {data.etiquette.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
            </Section>

            {/* Section 4 – Women's Safety */}
            <Section title="👩‍🦺 Women's Safety Rating" defaultOpen={true}>
              <div style={{ marginTop:"4px" }}>
                <span style={{ display:"inline-block", background:womensBadgeColor, color:"#fff", padding:"4px 14px", borderRadius:"20px", fontWeight:700, fontSize:"13px" }}>
                  {data.safety === "Safe" ? "✅ Safe for Solo Women Travellers" : data.safety === "Moderate" ? "⚠️ Moderate – Travel in Groups Preferred" : "🚨 Exercise Caution – Extra Vigilance Required"}
                </span>
                {data.safety === "Moderate" && <p style={{ margin:"8px 0 0", color:"#92400e", fontSize:"12px" }}>Stick to well-lit areas, use trusted transport, share itinerary with someone.</p>}
                {data.safety === "Exercise Caution" && <p style={{ margin:"8px 0 0", color:"#991b1b", fontSize:"12px" }}>Register your trip with the local tourist police if possible.</p>}
              </div>
            </Section>

            {/* Section 5 – Best Travel Time */}
            <Section title="📅 Best Travel Time" defaultOpen={true}>
              <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:"8px", padding:"10px 12px", marginTop:"4px", lineHeight:"1.6" }}>
                <div><span style={{ color:"#15803d", fontWeight:600 }}>✅ Best months: </span>{data.bestTime}</div>
                <div style={{ marginTop:"4px" }}><span style={{ color:"#b91c1c", fontWeight:600 }}>🚫 Avoid: </span>{data.avoidMonths}</div>
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

export default SafetyCard;
