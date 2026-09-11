import React, { useMemo } from "react";

// ─── Static Hotel Price Data (₹ INR per night) ────────────────────────────────
const HOTEL_PRICES = {
  matheran:      { budget: [800,  1500],  mid: [2500,  5000],  luxury: [8000,  15000] },
  lonavala:      { budget: [1000, 2000],  mid: [3000,  6000],  luxury: [8000,  20000] },
  mahabaleshwar: { budget: [1200, 2500],  mid: [3500,  7000],  luxury: [10000, 22000] },
  mumbai:        { budget: [1500, 3000],  mid: [5000,  10000], luxury: [15000, 40000] },
  jaipur:        { budget: [800,  1800],  mid: [3000,  7000],  luxury: [12000, 35000] },
  udaipur:       { budget: [1000, 2200],  mid: [4000,  9000],  luxury: [15000, 45000] },
  jodhpur:       { budget: [700,  1500],  mid: [2500,  6000],  luxury: [10000, 28000] },
  jaisalmer:     { budget: [800,  1800],  mid: [2800,  6500],  luxury: [8000,  20000] },
  manali:        { budget: [700,  1500],  mid: [2200,  5500],  luxury: [8000,  20000] },
  shimla:        { budget: [800,  1800],  mid: [2500,  6000],  luxury: [9000,  22000] },
  dharamshala:   { budget: [600,  1400],  mid: [2000,  5000],  luxury: [7000,  18000] },
  rishikesh:     { budget: [500,  1200],  mid: [2000,  5000],  luxury: [8000,  22000] },
  goa:           { budget: [1000, 2500],  mid: [3500,  8000],  luxury: [12000, 40000] },
  kerala:        { budget: [900,  2000],  mid: [3000,  7000],  luxury: [10000, 30000] },
  coorg:         { budget: [800,  1800],  mid: [2800,  6500],  luxury: [9000,  25000] },
  hampi:         { budget: [500,  1200],  mid: [1800,  4500],  luxury: [6000,  15000] },
  ooty:          { budget: [700,  1600],  mid: [2500,  5500],  luxury: [8000,  20000] },
  varanasi:      { budget: [600,  1400],  mid: [2200,  5000],  luxury: [8000,  20000] },
  agra:          { budget: [700,  1600],  mid: [2500,  6000],  luxury: [10000, 28000] },
  ladakh:        { budget: [1000, 2200],  mid: [3000,  7000],  luxury: [10000, 28000] },
  darjeeling:    { budget: [800,  1800],  mid: [2500,  5500],  luxury: [8000,  20000] },
  default:       { budget: [800,  1800],  mid: [2500,  6000],  luxury: [8000,  22000] },
};

function getSeasonInfo(destinationKey) {
  const month = new Date().getMonth() + 1; // 1-12
  const peakMonths = {
    matheran:[10,11,12,1,2,3,4], lonavala:[6,7,8,9], mahabaleshwar:[10,11,12,1,2,3],
    jaipur:[10,11,12,1,2,3], udaipur:[10,11,12,1,2,3], jodhpur:[10,11,12,1,2,3],
    jaisalmer:[11,12,1,2], manali:[5,6,7,8,12,1,2], shimla:[12,1,2,5,6,7,8],
    goa:[11,12,1,2,3], kerala:[9,10,11,12,1,2], ladakh:[5,6,7,8,9],
    default:[10,11,12,1,2,3]
  };
  const peaks = peakMonths[destinationKey] || peakMonths.default;
  const isPeak = peaks.includes(month);
  return { isPeak, multiplier: isPeak ? 1.2 : 0.85 };
}

function getAvailability() {
  const day = new Date().getDay(); // 0=Sun,6=Sat
  const isWeekend = day === 0 || day === 5 || day === 6;
  return isWeekend
    ? { badge: '🔴 High Demand — Book Early', color: '#dc2626', bg: '#fef2f2' }
    : { badge: '🟢 Good Availability', color: '#16a34a', bg: '#f0fdf4' };
}

function formatINR(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function computeNights(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const s = new Date(startDate);
  const e = new Date(endDate);
  if (isNaN(s) || isNaN(e) || e <= s) return null;
  return Math.round((e - s) / (1000 * 60 * 60 * 24));
}

function TierCard({ icon, label, sublabel, range, nights, accentColor, bgColor, borderColor, valuePick }) {
  const [lo, hi] = range;
  const isValuePick = label.toLowerCase() === (valuePick || 'mid');
  return (
    <div style={{ position: 'relative', flex:"1 1 160px", background:bgColor, border:`1.5px solid ${borderColor}`, borderRadius:"10px", padding:"14px 12px", textAlign:"center", minWidth:0 }}>
      {isValuePick && (
        <div style={{ position:'absolute', top:'-8px', right:'-8px', background:'#f59e0b', color:'white', fontSize:'10px', fontWeight:800, padding:'2px 6px', borderRadius:'10px' }}>
          ⭐ Best Value
        </div>
      )}
      <div style={{ fontSize:"28px", marginBottom:"6px" }}>{icon}</div>
      <div style={{ fontWeight:700, fontSize:"14px", color:accentColor, marginBottom:"2px" }}>{label}</div>
      <div style={{ fontSize:"11px", color:"#6b7280", marginBottom:"8px" }}>{sublabel}</div>
      <div style={{ fontWeight:700, fontSize:"13px", color:"#1f2937", background:"#fff", borderRadius:"6px", padding:"4px 6px", display:"inline-block", marginBottom: nights ? "8px" : 0, wordBreak:"break-word" }}>
        {formatINR(lo)} – {formatINR(hi)} / night
      </div>
      {nights && (
        <div style={{ fontSize:"11px", color:"#374151", background:`${accentColor}18`, borderRadius:"6px", padding:"4px 8px", marginTop:"2px" }}>
          {nights} night{nights !== 1 ? "s" : ""}: {formatINR(lo * nights)} – {formatINR(hi * nights)}
        </div>
      )}
    </div>
  );
}

function HotelPriceWidget({ destinationName = "Destination", destinationKey = "", startDate, endDate, valuePick }) {
  const key = useMemo(() => {
    const raw = (destinationKey || destinationName || "").toLowerCase().replace(/[\s-]+/g, "");
    return HOTEL_PRICES[raw] ? raw : "default";
  }, [destinationKey, destinationName]);

  const prices = HOTEL_PRICES[key];
  const season = getSeasonInfo(key);
  const adjustedPrices = {
    budget: prices.budget.map(p => Math.round(p * season.multiplier)),
    mid: prices.mid.map(p => Math.round(p * season.multiplier)),
    luxury: prices.luxury.map(p => Math.round(p * season.multiplier))
  };

  const nights = useMemo(() => computeNights(startDate, endDate), [startDate, endDate]);
  const availability = getAvailability();

  const mmt = `https://www.makemytrip.com/hotels/${destinationName.toLowerCase().replace(/\s+/g, "-")}/`;
  const booking = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destinationName)}&dest_type=city`;

  const linkBase = { flex:"1 1 140px", display:"inline-block", padding:"9px 12px", borderRadius:"8px", fontWeight:600, fontSize:"13px", textDecoration:"none", textAlign:"center", cursor:"pointer" };

  return (
    <div style={{ background:"#fff", borderRadius:"12px", boxShadow:"0 2px 12px rgba(0,0,0,0.08)", padding:"16px", fontFamily:"'Segoe UI',sans-serif", fontSize:"14px", marginBottom:"16px" }} aria-label={`Hotel prices for ${destinationName}`}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px", flexWrap:"wrap", gap:"6px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
          <h3 style={{ fontWeight:700, fontSize:"16px", color:"#111827", margin:0 }}>🏨 Stay &amp; Accommodation Prices</h3>
          {season.isPeak ? (
            <span style={{ color: "#c2410c", fontWeight: 600, fontSize: "11px" }}>🔺 Peak Season — Higher Rates</span>
          ) : (
            <span style={{ color: "#15803d", fontWeight: 600, fontSize: "11px" }}>✅ Off-Season — Best Deals</span>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap" }}>
          <span style={{ background: availability.bg, color: availability.color, padding:"3px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:600 }}>
            {availability.badge}
          </span>
          {nights !== null
            ? <span style={{ background:"#eff6ff", border:"1px solid #bfdbfe", color:"#1d4ed8", padding:"3px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:600 }}>📅 {nights} night{nights !== 1 ? "s" : ""}</span>
            : <span style={{ background:"#f3f4f6", border:"1px solid #d1d5db", color:"#6b7280", padding:"3px 10px", borderRadius:"20px", fontSize:"12px", fontWeight:600 }}>Per night</span>
          }
        </div>
      </div>

      {/* Tier Cards */}
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"14px" }}>
        <TierCard icon="🏕️" label="Budget"    sublabel="Hostels / Guesthouses"   range={adjustedPrices.budget} nights={nights} accentColor="#16a34a" bgColor="#f0fdf4" borderColor="#86efac" valuePick={valuePick} />
        <TierCard icon="🏩" label="Mid-Range" sublabel="3-Star / Heritage Hotels" range={adjustedPrices.mid}    nights={nights} accentColor="#2563eb" bgColor="#eff6ff" borderColor="#93c5fd" valuePick={valuePick} />
        <TierCard icon="🏰" label="Premium"   sublabel="5-Star / Luxury Resorts"  range={adjustedPrices.luxury} nights={nights} accentColor="#b45309" bgColor="#fffbeb" borderColor="#fcd34d" valuePick={valuePick} />
      </div>

      {/* Total estimate */}
      {nights !== null && (
        <div style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:"8px", padding:"10px 14px", fontSize:"13px", color:"#374151", marginBottom:"14px" }}>
          <span style={{ fontWeight:600 }}>💡 Estimated total for {nights} night{nights !== 1 ? "s" : ""}:</span>{"  "}
          <span style={{ color:"#16a34a", fontWeight:700 }}>Budget: {formatINR(adjustedPrices.budget[0]*nights)} – {formatINR(adjustedPrices.budget[1]*nights)}</span>
          {" · "}
          <span style={{ color:"#2563eb", fontWeight:700 }}>Mid: {formatINR(adjustedPrices.mid[0]*nights)} – {formatINR(adjustedPrices.mid[1]*nights)}</span>
          {" · "}
          <span style={{ color:"#b45309", fontWeight:700 }}>Luxury: {formatINR(adjustedPrices.luxury[0]*nights)} – {formatINR(adjustedPrices.luxury[1]*nights)}</span>
        </div>
      )}

      <hr style={{ border:"none", borderTop:"1px solid #e5e7eb", margin:"14px 0" }} />

      {/* Booking links */}
      <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
        <a href={mmt}     target="_blank" rel="noopener noreferrer" style={{ ...linkBase, background:"#e8543a", color:"#fff" }}>🔴 Check on MakeMyTrip</a>
        <a href={booking} target="_blank" rel="noopener noreferrer" style={{ ...linkBase, background:"#003580", color:"#fff" }}>🔵 Check on Booking.com</a>
        <a href={`https://www.airbnb.co.in/s/${encodeURIComponent(destinationName)}`} target="_blank" rel="noopener noreferrer" style={{ ...linkBase, background: '#ff5a5f', color: '#fff' }}>🏠 Browse on Airbnb</a>
      </div>

      <p style={{ fontSize:"11px", color:"#9ca3af", textAlign:"center", marginTop:"10px" }}>
        * Prices are indicative estimates. Actual rates may vary by season, availability &amp; deals.
      </p>
    </div>
  );
}

export default HotelPriceWidget;
