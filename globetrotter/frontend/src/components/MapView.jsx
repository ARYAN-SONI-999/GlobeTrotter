import { useEffect, useRef, useState } from 'react';

// Color palette for day-wise route polylines
const DAY_COLORS = [
  '#2563eb', // Day 1 - blue
  '#16a34a', // Day 2 - green
  '#dc2626', // Day 3 - red
  '#d97706', // Day 4 - amber
  '#7c3aed', // Day 5 - purple
  '#0891b2', // Day 6 - cyan
  '#be185d', // Day 7 - pink
];

// City center fallback coordinates
const DESTINATION_COORDS = {
  matheran: [18.9865, 73.2657],
  lonavala: [18.7546, 73.4064],
  mahabaleshwar: [17.9307, 73.6477],
  mumbai: [19.0760, 72.8777],
  jaipur: [26.9124, 75.7873],
  udaipur: [24.5854, 73.7125],
  jodhpur: [26.2389, 73.0243],
  jaisalmer: [26.9157, 70.9083],
  manali: [32.2432, 77.1892],
  shimla: [31.1048, 77.1734],
  dharamshala: [32.2190, 76.3234],
  mcleodganj: [32.2426, 76.3213],
  rishikesh: [30.0869, 78.2676],
  goa: [15.2993, 74.1240],
  kerala: [9.9312, 76.2673],
  alleppey: [9.4981, 76.3388],
  munnar: [10.0889, 77.0595],
  coorg: [12.4244, 75.7382],
  hampi: [15.3350, 76.4600],
  ooty: [11.4102, 76.6950],
  varanasi: [25.3176, 82.9739],
  agra: [27.1767, 78.0081],
  ladakh: [34.1526, 77.5771],
  leh: [34.1526, 77.5771],
  darjeeling: [27.0410, 88.2663],
  gujarat: [23.0225, 72.5714],
  ahmedabad: [23.0225, 72.5714],
  pondicherry: [11.9416, 79.8083],
  amritsar: [31.6340, 74.8723],
  delhi: [28.6139, 77.2090],
  paris: [48.8566, 2.3522],
  tokyo: [35.6762, 139.6503],
  bali: [-8.3405, 115.0920],
  rome: [41.9028, 12.4964],
  'new york': [40.7128, -74.0060],
  dubai: [25.2048, 55.2708],
  barcelona: [41.3851, 2.1734],
  amsterdam: [52.3676, 4.9041],
  london: [51.5074, -0.1278],
  singapore: [1.3521, 103.8198],
  sydney: [-33.8688, 151.2093]
};

// Precise landmark GPS coordinate database
const PLACE_COORDS = {
  // Matheran
  'charlotte lake & louisa point': [18.9865, 73.2680],
  'panorama point 360° sunrise lookout': [19.0020, 73.2750],
  'neral-matheran heritage toy train & market walk': [18.9880, 73.2650],
  'echo point & honeymoon hill vistas': [18.9800, 73.2630],
  'porcupine point (sunset point)': [18.9840, 73.2590],
  'rambagh point & alexander point trail': [18.9750, 73.2710],
  // Lonavala
  "tiger's leap & lion's point sunset": [18.7380, 73.4350],
  'karla & bhaja ancient buddhist caves': [18.7820, 73.4720],
  'bhushi dam & water cascades': [18.7300, 73.4210],
  "duke's nose clifftop trek": [18.7450, 73.3980],
  // Mahabaleshwar
  "arthur's seat queen of points": [17.9620, 73.6150],
  'venna lake boating & horse riding': [17.9250, 73.6550],
  'mapro garden & strawberry estate': [17.9150, 73.7020],
  'panchgani table land plateau': [17.9230, 73.8010],
  // Jaipur
  'amber fort & sheesh mahal': [26.9855, 75.8513],
  'hawa mahal (palace of winds)': [26.9239, 75.8267],
  'city palace & jantar mantar': [26.9258, 75.8237],
  'nahargarh fort sunset viewpoint': [26.9373, 75.8155],
  'albert hall museum': [26.9116, 75.8195],
  'jal mahal (water palace)': [26.9534, 75.8462],
  // Udaipur
  'city palace of udaipur & museum': [24.5764, 73.6835],
  'lake pichola sunset boat cruise & jag mandir': [24.5714, 73.6780],
  'bagore ki haveli folk dance & puppet show': [24.5795, 73.6820],
  'saheliyon ki bari royal gardens': [24.6006, 73.6872],
  'monsoon palace (sajjangarh)': [24.5937, 73.6389],
  // Jodhpur
  'mehrangarh fort & museum': [26.2978, 73.0185],
  'jaswant thada royal cenotaphs': [26.3044, 73.0232],
  'blue city heritage alley walk & clock tower': [26.2952, 73.0228],
  'umaid bhawan palace': [26.2810, 73.0477],
  // Jaisalmer
  'jaisalmer golden fort (sonar qila)': [26.9124, 70.9126],
  'patwon ki haveli': [26.9176, 70.9142],
  'sam sand dunes desert safari': [26.8310, 70.5284],
  'gadisar lake & tia archway': [26.9067, 70.9235],
  // Manali
  'solang valley adventure & paragliding': [32.3160, 77.1580],
  'hadimba temple & yash forest': [32.2480, 77.1810],
  'jogini waterfall trek & vashisht hot springs': [32.2620, 77.1890],
  'old manali cafe lane & mall road': [32.2450, 77.1870],
  // Shimla
  'the ridge & mall road heritage walk': [31.1048, 77.1734],
  'jakhoo temple & giant hanuman statue': [31.1010, 77.1850],
  'kufri snow & adventure park': [31.0978, 77.2678],
  // Rishikesh
  'triveni ghat evening maha ganga aarti': [30.1030, 78.2980],
  'white water river rafting in ganga': [30.1340, 78.3260],
  'lakshman & ram jhula suspension bridges': [30.1235, 78.3280],
  'the beatles ashram (chaurasi kutia)': [30.1160, 78.3140],
  // Goa
  'baga & calangute beach watersports': [15.5553, 73.7517],
  'aguada fort & lighthouse': [15.4924, 73.7737],
  'basilica of bom jesus & old goa': [15.5009, 73.9116],
  'dudhsagar waterfalls trek': [15.3144, 74.3143],
  // Kerala & Munnar
  'alleppey backwater houseboat cruise': [9.4981, 76.3388],
  'eravikulam national park & rajamalai': [10.1500, 77.0600],
  'tata tea museum & lockhart estate': [10.0889, 77.0605],
  'mattupetty dam & echo point lake': [10.1064, 77.1239],
  // Coorg
  'abbey falls & hanging bridge': [12.4518, 75.7196],
  "raja's seat sunset & musical fountain": [12.4208, 75.7369],
  'namdroling golden temple tibetan monastery': [12.4560, 75.9642],
  // Hampi
  'virupaksha temple & hampi bazaar': [15.3350, 76.4600],
  'vijaya vittala temple & stone chariot': [15.3377, 76.4770],
  'matanga hill sunrise viewpoint': [15.3320, 76.4650],
  // Ooty
  'nilgiri mountain unesco toy train': [11.4102, 76.6950],
  'ooty lake & boating pier': [11.4080, 76.6890],
  'government botanical gardens & doddabetta': [11.4168, 76.7118],
  // Varanasi
  'dashashwamedh ghat evening ganga aarti': [25.3069, 83.0104],
  'kashi vishwanath temple & corridor': [25.3109, 83.0107],
  'sarnath deer park & stupa': [25.3811, 83.0214],
  // Agra
  'taj mahal sunrise & mughal gardens': [27.1751, 78.0421],
  'agra red fort & diwan-i-khas': [27.1795, 78.0211],
  'mehtab bagh sunset taj view': [27.1800, 78.0421],
  // Ladakh
  'pangong tso lake & merak village': [33.7595, 78.6674],
  'nubra valley hunder sand dunes & camel safari': [34.5447, 77.4265],
  'shanti stupa & leh palace': [34.1683, 77.5778],
  // Darjeeling
  'tiger hill mt. kanchenjunga sunrise': [26.9950, 88.2858],
  'darjeeling himalayan toy train & batasia loop': [27.0167, 88.2467],
  'happy valley tea estate heritage tour': [27.0543, 88.2678],
  // Gujarat & Ahmedabad
  'statue of unity & sardar sarovar dam (kevadia)': [21.8380, 73.7191],
  'sabarmati ashram & riverfront promenade (ahmedabad)': [23.0601, 72.5806],
  'great rann of kutch white salt desert (dhordo)': [23.8208, 69.5160],
  'gir national park lion safari (sasangir)': [21.1243, 70.8242],
  'adalaj stepwell (adalaj ni vav)': [23.1667, 72.5801],
  'manek chowk heritage night market': [23.0244, 72.5898],
  // Pondicherry & Amritsar
  'white town french quarter heritage walk': [11.9333, 79.8333],
  'auroville & matrimandir meditation dome': [12.0069, 79.8106],
  'rock beach promenade & french war memorial': [11.9328, 79.8358],
  'golden temple (sri harmandir sahib)': [31.6200, 74.8765],
  'wagah border beating retreat ceremony': [31.6042, 74.5776],
  'jallianwala bagh memorial park': [31.6206, 74.8801],
  // International
  'eiffel tower': [48.8584, 2.2945],
  'louvre museum': [48.8606, 2.3376],
  'colosseum': [41.8902, 12.4922],
  'tokyo tower': [35.6586, 139.7454],
  'shibuya crossing & hachiko statue': [35.6595, 139.7005],
  'burj khalifa': [25.1972, 55.2744],
  'gardens by the bay & supertree grove': [1.2816, 103.8636],
  'marina bay sands skypark observation deck': [1.2834, 103.8607],
  'sentosa island & universal studios': [1.2494, 103.8303]
};

function getDestCoords(destinationName) {
  if (!destinationName) return [20.5937, 78.9629];
  const key = destinationName.toLowerCase().replace(/\s*\(.*\)/, '').trim();
  for (const [k, coords] of Object.entries(DESTINATION_COORDS)) {
    if (key.includes(k) || k.includes(key)) return coords;
  }
  return [20.5937, 78.9629];
}

function normalizeStr(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/['’‘`]/g, "'")
    .replace(/[^a-z0-9']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate precise lat/lng coordinates for a place
function getPlaceCoords(placeName, destinationName, dayIdx, actIdx) {
  const normPlace = normalizeStr(placeName);

  if (normPlace) {
    // 1. Direct or partial match against PLACE_COORDS
    for (const [k, coords] of Object.entries(PLACE_COORDS)) {
      const normK = normalizeStr(k);
      if (normPlace.includes(normK) || normK.includes(normPlace)) {
        return coords;
      }
    }

    // 2. Keyword match against key attraction words (e.g., 'amber', 'hawa', 'pichola', 'fort')
    for (const [k, coords] of Object.entries(PLACE_COORDS)) {
      const normK = normalizeStr(k);
      const keywords = normK.split(' ').filter((w) => w.length >= 4);
      const matchCount = keywords.filter((kw) => normPlace.includes(kw)).length;
      if (matchCount >= 2 || (keywords.length === 1 && matchCount === 1)) {
        return coords;
      }
    }
  }

  // 3. Precise micro-clustering offset around city center (within ~300m - 800m)
  const base = getDestCoords(destinationName);
  let hash = 0;
  for (let i = 0; i < (placeName || '').length; i++) {
    hash = (hash << 5) - hash + (placeName || '').charCodeAt(i);
    hash |= 0;
  }
  const offsetLat = (((Math.abs(hash) % 100) / 100) - 0.5) * 0.012 + (actIdx * 0.002);
  const offsetLng = (((Math.abs(hash >> 3) % 100) / 100) - 0.5) * 0.012 + (dayIdx * 0.0015);
  return [base[0] + offsetLat, base[1] + offsetLng];
}

// Calculate Haversine distance in kilometers
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function MapView({ generatedPlan }) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const searchMarkerRef = useRef(null);
  const [mapDayFilter, setMapDayFilter] = useState('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [mapLayer, setMapLayer] = useState('streets'); // 'streets' | 'satellite' | 'terrain'
  const [mapSearchText, setMapSearchText] = useState('');
  const [isSearchingMap, setIsSearchingMap] = useState(false);

  useEffect(() => {
    if (leafletMapRef.current) {
      setTimeout(() => leafletMapRef.current.invalidateSize(), 300);
    }
  }, [isFullscreen]);

  // Handle Tile Layer Switching
  useEffect(() => {
    if (!leafletMapRef.current || !window.L) return;
    if (tileLayerRef.current) {
      leafletMapRef.current.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    let maxZoom = 19;

    if (mapLayer === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      maxZoom = 18;
    } else if (mapLayer === 'terrain') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap';
      maxZoom = 17;
    }

    tileLayerRef.current = window.L.tileLayer(url, { attribution, maxZoom }).addTo(leafletMapRef.current);
  }, [mapLayer]);

  const handleSearchGlobalLocation = async (e) => {
    if (e) e.preventDefault();
    if (!mapSearchText.trim() || !leafletMapRef.current || !window.L) return;

    setIsSearchingMap(true);
    try {
      const res = await fetch(`/api/external/geocode?q=${encodeURIComponent(mapSearchText.trim())}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const lat = item.lat;
        const lng = item.lng;

        if (searchMarkerRef.current) {
          leafletMapRef.current.removeLayer(searchMarkerRef.current);
        }

        const customIcon = window.L.divIcon({
          html: `
            <div style="
              background: #7c3aed;
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-weight: 800;
              font-size: 12px;
              border: 2px solid white;
              box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
              display: inline-flex;
              align-items: center;
              gap: 4px;
              white-space: nowrap;
            ">📍 ${item.name}</div>
          `,
          className: '',
          iconAnchor: [30, 20],
        });

        searchMarkerRef.current = window.L.marker([lat, lng], { icon: customIcon })
          .addTo(leafletMapRef.current)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:180px">
              <strong>${item.displayName || item.name}</strong>
              <div style="font-size:11px;color:#64748b;margin:4px 0">GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}</div>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:700;font-size:11px;text-decoration:none">
                🚀 Navigate in Google Maps &rarr;
              </a>
            </div>
          `)
          .openPopup();

        leafletMapRef.current.flyTo([lat, lng], 14, { duration: 1.5 });
      } else {
        alert(`Location "${mapSearchText}" not found. Try another city or landmark.`);
      }
    } catch (err) {
      console.error('Map location search error:', err);
    } finally {
      setIsSearchingMap(false);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        if (leafletMapRef.current && window.L) {
          const userIcon = window.L.divIcon({
            html: `
              <div style="
                background: #ef4444;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.35), 0 4px 10px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
              "></div>
            `,
            className: '',
            iconSize: [18, 18],
            iconAnchor: [9, 9],
            popupAnchor: [0, -10],
          });

          window.L.marker([latitude, longitude], { icon: userIcon })
            .addTo(leafletMapRef.current)
            .bindPopup('📍 <strong>You are here</strong>', { maxWidth: 160 })
            .openPopup();

          leafletMapRef.current.flyTo([latitude, longitude], 14, { duration: 1.2 });
        }
      },
      (err) => {
        setIsLocating(false);
        alert('Could not retrieve your location: ' + (err.message || 'Permission denied'));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    const initMap = () => {
      if (!window.L || !mapRef.current || !generatedPlan) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      const destCoords = getDestCoords(generatedPlan.destination?.name);

      const map = window.L.map(mapRef.current, {
        center: destCoords,
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      leafletMapRef.current = map;

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const allPoints = [];

      generatedPlan.days.forEach((day, dayIdx) => {
        const isDayVisible = mapDayFilter === 'all' || mapDayFilter === day.dayNumber;
        const dayColor = DAY_COLORS[dayIdx % DAY_COLORS.length];
        const dayPoints = [];

        day.activities.forEach((act, actIdx) => {
          const point = act.latitude && act.longitude 
            ? [act.latitude, act.longitude]
            : getPlaceCoords(act.name, generatedPlan.destination?.name, dayIdx, actIdx);
            
          dayPoints.push(point);
          if (isDayVisible) allPoints.push(point);

          const markerHtml = `
            <div style="
              background: ${isDayVisible ? dayColor : '#94a3b8'};
              color: white;
              width: 34px;
              height: 34px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 13px;
              border: 3px solid white;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              cursor: pointer;
            ">D${day.dayNumber}-${actIdx + 1}</div>
          `;

          const icon = window.L.divIcon({
            html: markerHtml,
            className: '',
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -18],
          });

          const getEmoji = (cat) => {
            const c = (cat || '').toLowerCase();
            if(c.includes('food') || c.includes('restaurant')) return '🍽️';
            if(c.includes('adventure') || c.includes('trek')) return '🧗';
            if(c.includes('culture') || c.includes('temple') || c.includes('heritage')) return '🏛️';
            if(c.includes('nature') || c.includes('park') || c.includes('lake')) return '🌳';
            if(c.includes('shop') || c.includes('market')) return '🛍️';
            return '📍';
          };
          const actEmoji = getEmoji(act.category);

          const popupContent = `
<div style="font-family:sans-serif;min-width:180px">
  <div style="font-weight:700;font-size:13px;margin-bottom:4px">${actEmoji} ${act.name}</div>
  <div style="font-size:11px;color:#64748b;margin-bottom:4px">${act.slot || 'Morning'} · ${act.timeRange || ''}</div>
  <div style="display:flex;gap:8px;font-size:11px">
    <span>⭐ ${act.rating || 4.5}</span>
    <span>⏳ ${act.duration || 1}h</span>
    <span>💵 ${act.cost === 0 ? 'Free' : '₹' + (act.cost || 500)}</span>
  </div>
  ${act.insiderTip ? '<div style="font-size:11px;color:#059669;margin-top:4px">💡 ' + act.insiderTip + '</div>' : ''}
</div>
          `;

          if (isDayVisible) {
            window.L.marker(point, { icon })
              .addTo(map)
              .bindPopup(popupContent, { maxWidth: 220 });
          }
        });

        if (dayPoints.length > 1 && isDayVisible) {
          // Fetch real turn-by-turn road driving geometry via OSRM routing API
          fetch('/api/external/directions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ points: dayPoints })
          })
            .then((r) => r.json())
            .then((routeData) => {
              if (routeData && Array.isArray(routeData.geometryCoordinates) && routeData.geometryCoordinates.length > 0) {
                window.L.polyline(routeData.geometryCoordinates, {
                  color: dayColor,
                  weight: 5,
                  opacity: 0.88,
                  lineJoin: 'round',
                  smoothFactor: 1
                }).addTo(map);
              } else {
                window.L.polyline(dayPoints, {
                  color: dayColor,
                  weight: 4,
                  opacity: 0.8,
                  dashArray: '8, 6',
                }).addTo(map);
              }
            })
            .catch(() => {
              window.L.polyline(dayPoints, {
                color: dayColor,
                weight: 4,
                opacity: 0.8,
                dashArray: '8, 6',
              }).addTo(map);
            });
        }
      });

      if (allPoints.length > 1) {
        const bounds = window.L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    };

    const timer = setTimeout(initMap, 200);
    return () => clearTimeout(timer);
  }, [generatedPlan, mapDayFilter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  if (!generatedPlan) return null;

  const totalActivities = generatedPlan.days.reduce((sum, d) => sum + d.activities.length, 0);

  // Compute multi-stop route segments per day
  const dayRouteBreakdowns = generatedPlan.days.map((day, dayIdx) => {
    const pointsWithDetails = day.activities.map((act, actIdx) => {
      const coords = act.latitude && act.longitude 
        ? [act.latitude, act.longitude] 
        : getPlaceCoords(act.name, generatedPlan.destination?.name, dayIdx, actIdx);
      return { ...act, coords };
    });

    const segments = [];
    let dayTotalDistanceKm = 0;

    for (let i = 0; i < pointsWithDetails.length - 1; i++) {
      const p1 = pointsWithDetails[i];
      const p2 = pointsWithDetails[i + 1];
      const dist = calculateDistanceKm(p1.coords[0], p1.coords[1], p2.coords[0], p2.coords[1]);
      const estMins = Math.round(dist * 3 + 5);
      dayTotalDistanceKm += dist;

      segments.push({
        from: p1.name,
        to: p2.name,
        distanceKm: dist,
        estMins,
      });
    }

    // Google Maps multi-stop direction URL
    const coordsStr = pointsWithDetails.map(p => `${p.coords[0]},${p.coords[1]}`);
    const gmapsMultiUrl = coordsStr.length > 1 
      ? `https://www.google.com/maps/dir/?api=1&origin=${coordsStr[0]}&destination=${coordsStr[coordsStr.length - 1]}&waypoints=${coordsStr.slice(1, -1).join('|')}&travelmode=driving`
      : `https://www.google.com/maps/search/${encodeURIComponent(generatedPlan.destination?.name)}`;

    return {
      dayNumber: day.dayNumber,
      color: DAY_COLORS[dayIdx % DAY_COLORS.length],
      activities: pointsWithDetails,
      segments,
      dayTotalDistanceKm: Math.round(dayTotalDistanceKm * 10) / 10,
      gmapsMultiUrl,
    };
  });

  const containerStyle = isFullscreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9998,
        background: '#ffffff',
        padding: '24px',
        overflow: 'auto',
        boxSizing: 'border-box'
      }
    : {
        marginTop: '28px',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(15,23,42,0.06)'
      };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🗺️ Interactive Route Map & GPS Navigation
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
            Sequential route planning across {generatedPlan.destination?.name} ({totalActivities} stops marked)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Map Layer Switcher */}
          <div style={{ display: 'inline-flex', background: '#f1f5f9', padding: '3px', borderRadius: '20px', gap: '2px' }}>
            <button
              type="button"
              onClick={() => setMapLayer('streets')}
              style={{
                background: mapLayer === 'streets' ? '#ffffff' : 'transparent',
                color: mapLayer === 'streets' ? '#0f172a' : '#64748b',
                border: 'none',
                boxShadow: mapLayer === 'streets' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🗺️ Streets
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('satellite')}
              style={{
                background: mapLayer === 'satellite' ? '#ffffff' : 'transparent',
                color: mapLayer === 'satellite' ? '#0f172a' : '#64748b',
                border: 'none',
                boxShadow: mapLayer === 'satellite' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🛰️ Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('terrain')}
              style={{
                background: mapLayer === 'terrain' ? '#ffffff' : 'transparent',
                color: mapLayer === 'terrain' ? '#0f172a' : '#64748b',
                border: 'none',
                boxShadow: mapLayer === 'terrain' ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ⛰️ Terrain
            </button>
          </div>

          {/* Day Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setMapDayFilter('all')}
              style={{
                background: mapDayFilter === 'all' ? '#0f172a' : '#f1f5f9',
                color: mapDayFilter === 'all' ? 'white' : '#475569',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              All Days
            </button>
            {generatedPlan.days.map((day, idx) => (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setMapDayFilter(day.dayNumber)}
                style={{
                  background: mapDayFilter === day.dayNumber ? DAY_COLORS[idx % DAY_COLORS.length] : '#f1f5f9',
                  color: mapDayFilter === day.dayNumber ? 'white' : '#475569',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          {/* Fullscreen button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            style={{
              background: isFullscreen ? '#ef4444' : '#f1f5f9',
              color: isFullscreen ? 'white' : '#334155',
              border: '1px solid #cbd5e1',
              padding: '5px 12px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map to Fullscreen'}
          >
            {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
          </button>
        </div>
      </div>

      {/* Global Location Jumper Search Bar */}
      <div style={{ marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearchGlobalLocation} style={{ display: 'flex', gap: '6px', flex: '1', minWidth: '280px', maxWidth: '460px' }}>
          <input
            type="text"
            placeholder="🔍 Find any place worldwide on map (e.g. Eiffel Tower, Taj Mahal, Tokyo)..."
            value={mapSearchText}
            onChange={(e) => setMapSearchText(e.target.value)}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.8rem',
              outline: 'none',
              background: '#f8fafc'
            }}
          />
          <button
            type="submit"
            disabled={isSearchingMap}
            style={{
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {isSearchingMap ? 'Searching...' : '📍 Jump to Pin'}
          </button>
        </form>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          💡 Tip: You can jump to any global coordinate or landmark directly on this map.
        </span>
      </div>

      {/* Map Display */}
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
        <div ref={mapRef} style={{ height: isFullscreen ? 'calc(100vh - 280px)' : '420px', width: '100%', background: '#f8fafc' }} />
        
        {/* Overlay Badges and My Location Button */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: '#334155',
          fontWeight: 700,
          zIndex: 1000,
          pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          📍 OpenStreetMap Route View • Click pins for details & directions
        </div>

        {/* My Location button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          style={{
            position: 'absolute',
            top: '70px',
            right: '10px',
            zIndex: 1000,
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            padding: '7px 12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#0f172a'
          }}
          title="Find your current location"
        >
          <span>📍</span>
          <span>{isLocating ? 'Locating...' : 'My Location'}</span>
        </button>
      </div>

      {/* Day-by-Day Sequential Route & Distance Timeline Breakdown */}
      <div style={{ marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🚗 Sequential Day Routes & Multi-Stop GPS Directions
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {dayRouteBreakdowns
            .filter((d) => mapDayFilter === 'all' || mapDayFilter === d.dayNumber)
            .map((d) => (
              <div key={d.dayNumber} style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ background: d.color, color: 'white', fontWeight: 800, fontSize: '0.8rem', padding: '3px 10px', borderRadius: '14px' }}>
                      Day {d.dayNumber} Route
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>
                      📏 ~{d.dayTotalDistanceKm} km total
                    </span>
                  </div>

                  {/* Sequential stops list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {d.activities.map((act, aIdx) => (
                      <div key={aIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                          <span style={{ background: d.color, color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, flexShrink: 0 }}>
                            {aIdx + 1}
                          </span>
                          <strong style={{ color: '#0f172a' }}>{act.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>{act.slot}</span>
                        </div>

                        {/* Segment transit line */}
                        {aIdx < d.activities.length - 1 && (
                          <div style={{ marginLeft: '10px', paddingLeft: '14px', borderLeft: `2px dashed ${d.color}`, fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, margin: '2px 0 2px 10px' }}>
                            🚗 ~{d.segments[aIdx]?.distanceKm} km ({d.segments[aIdx]?.estMins} mins travel)
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={d.gmapsMultiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#2563eb',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
                    marginTop: '8px'
                  }}
                >
                  🚀 Open Day {d.dayNumber} Multi-Stop Route on Google Maps
                </a>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
