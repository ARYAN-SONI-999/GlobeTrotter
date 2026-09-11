import React, { useState } from 'react';

const FALLBACK_TRANSIT_DATA = {
  matheran: {
    nearestRailwayStation: { name: 'Neral Junction', code: 'NRL', distanceKm: 7, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'CSM International Airport (Mumbai)', code: 'BOM', distanceKm: 94, airlines: ['IndiGo', 'Air India', 'Vistara'] },
    roadDistances: [
      { from: 'Mumbai', distanceKm: 90, durationHours: '2.5h', via: 'NH48' },
      { from: 'Pune', distanceKm: 124, durationHours: '3h', via: 'Mumbai-Pune Expy' }
    ],
    localTransit: ['Horse / Pony rides from Dasturi Naka', 'Hand-pulled rickshaws', 'Toy Train (Neral to Matheran)', 'Walking (Car-Free Zone)']
  },
  lonavala: {
    nearestRailwayStation: { name: 'Lonavala Station', code: 'LNL', distanceKm: 2, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Pune Airport', code: 'PNQ', distanceKm: 72, airlines: ['IndiGo', 'Air India'] },
    roadDistances: [
      { from: 'Mumbai', distanceKm: 83, durationHours: '1.5h', via: 'Expressway' },
      { from: 'Pune', distanceKm: 65, durationHours: '1h', via: 'Expressway' }
    ],
    localTransit: ['Auto-rickshaws', 'Shared Taxis to Tiger Leap', 'Scooter rentals']
  },
  jaipur: {
    nearestRailwayStation: { name: 'Jaipur Junction', code: 'JP', distanceKm: 3, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Jaipur International Airport', code: 'JAI', distanceKm: 12, airlines: ['IndiGo', 'Air India', 'SpiceJet'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 281, durationHours: '4.5h', via: 'NH48' },
      { from: 'Agra', distanceKm: 232, durationHours: '4h', via: 'NH21' }
    ],
    localTransit: ['Auto-rickshaws & E-rickshaws', 'Jaipur Metro', 'Rented Scooters', 'Ola/Uber']
  },
  udaipur: {
    nearestRailwayStation: { name: 'Udaipur City Station', code: 'UDZ', distanceKm: 3, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Maharana Pratap Airport', code: 'UDR', distanceKm: 22, airlines: ['IndiGo', 'Air India', 'SpiceJet'] },
    roadDistances: [
      { from: 'Jaipur', distanceKm: 393, durationHours: '6h', via: 'NH48', mapsLink: 'https://maps.google.com/?daddr=Udaipur' },
      { from: 'Ahmedabad', distanceKm: 262, durationHours: '4h', via: 'NH48', mapsLink: 'https://maps.google.com/?daddr=Udaipur' }
    ],
    localTransit: ['Auto-rickshaws', 'Boat rides on Lake Pichola', 'Ola/Uber cabs', 'Cycle rentals'],
    busOperators: [{ name: 'RSRTC Volvo', route: 'Jaipur → Udaipur', fare: 680 }, { name: 'RSRTC AC', route: 'Ahmedabad → Udaipur', fare: 520 }],
    cabFarePerKm: 13
  },
  jodhpur: {
    nearestRailwayStation: { name: 'Jodhpur Junction', code: 'JU', distanceKm: 2, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Jodhpur Airport', code: 'JDH', distanceKm: 5, airlines: ['IndiGo', 'Air India'] },
    roadDistances: [
      { from: 'Jaipur', distanceKm: 335, durationHours: '5h', via: 'NH62', mapsLink: 'https://maps.google.com/?daddr=Jodhpur' },
      { from: 'Udaipur', distanceKm: 258, durationHours: '4h', via: 'NH162', mapsLink: 'https://maps.google.com/?daddr=Jodhpur' }
    ],
    localTransit: ['Auto-rickshaws', 'Tuk-tuks', 'Ola/Uber', 'Horse carts near Mehrangarh'],
    busOperators: [{ name: 'RSRTC Volvo', route: 'Jaipur → Jodhpur', fare: 580 }],
    cabFarePerKm: 12
  },
  jaisalmer: {
    nearestRailwayStation: { name: 'Jaisalmer Station', code: 'JSM', distanceKm: 2, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Jaisalmer Airport', code: 'JSA', distanceKm: 9, airlines: ['IndiGo'] },
    roadDistances: [
      { from: 'Jodhpur', distanceKm: 291, durationHours: '4.5h', via: 'NH125', mapsLink: 'https://maps.google.com/?daddr=Jaisalmer' },
      { from: 'Jaipur', distanceKm: 571, durationHours: '8.5h', via: 'NH11', mapsLink: 'https://maps.google.com/?daddr=Jaisalmer' }
    ],
    localTransit: ['Shared jeeps to Sam Sand Dunes', 'Auto-rickshaws', 'Camel carts'],
    busOperators: [{ name: 'RSRTC Night Bus', route: 'Jodhpur → Jaisalmer', fare: 350 }],
    cabFarePerKm: 14
  },
  manali: {
    nearestRailwayStation: { name: 'Joginder Nagar Station', code: 'JNDR', distanceKm: 158, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Kullu-Manali Airport (Bhuntar)', code: 'KUU', distanceKm: 50, airlines: ['Air India', 'SpiceJet'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 537, durationHours: '11h', via: 'NH3', mapsLink: 'https://maps.google.com/?daddr=Manali' },
      { from: 'Chandigarh', distanceKm: 310, durationHours: '7h', via: 'NH21', mapsLink: 'https://maps.google.com/?daddr=Manali' }
    ],
    localTransit: ['Shared taxis to Rohtang/Solang', 'Local autos', 'Bike rentals'],
    busOperators: [{ name: 'HRTC Volvo', route: 'Delhi → Manali', fare: 1150 }, { name: 'HRTC AC', route: 'Chandigarh → Manali', fare: 650 }],
    cabFarePerKm: 15
  },
  shimla: {
    nearestRailwayStation: { name: 'Shimla Station (Toy Train)', code: 'SML', distanceKm: 1, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Jubbarhatti Airport', code: 'SLV', distanceKm: 22, airlines: ['Air India'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 343, durationHours: '7h', via: 'NH44', mapsLink: 'https://maps.google.com/?daddr=Shimla' },
      { from: 'Chandigarh', distanceKm: 117, durationHours: '2.5h', via: 'NH5', mapsLink: 'https://maps.google.com/?daddr=Shimla' }
    ],
    localTransit: ['Lift (elevator) to The Ridge', 'Local autos', 'Toy Train (Kalka–Shimla)'],
    busOperators: [{ name: 'HRTC Volvo', route: 'Delhi → Shimla', fare: 750 }],
    cabFarePerKm: 13
  },
  dharamshala: {
    nearestRailwayStation: { name: 'Pathankot Station', code: 'PTK', distanceKm: 87, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Gaggal Airport (Kangra)', code: 'DHM', distanceKm: 12, airlines: ['IndiGo', 'Air India'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 476, durationHours: '9h', via: 'NH44', mapsLink: 'https://maps.google.com/?daddr=Dharamshala' },
      { from: 'Chandigarh', distanceKm: 238, durationHours: '5h', via: 'NH154A', mapsLink: 'https://maps.google.com/?daddr=Dharamshala' }
    ],
    localTransit: ['Local autos to McLeod Ganj', 'Shared taxis', 'Walking trails'],
    busOperators: [{ name: 'HRTC Deluxe', route: 'Delhi → Dharamshala', fare: 680 }],
    cabFarePerKm: 13
  },
  rishikesh: {
    nearestRailwayStation: { name: 'Rishikesh Station', code: 'RKSH', distanceKm: 3, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Jolly Grant Airport (Dehradun)', code: 'DED', distanceKm: 19, airlines: ['IndiGo', 'Air India', 'Vistara'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 240, durationHours: '5h', via: 'NH334', mapsLink: 'https://maps.google.com/?daddr=Rishikesh' },
      { from: 'Haridwar', distanceKm: 24, durationHours: '45m', via: 'NH334', mapsLink: 'https://maps.google.com/?daddr=Rishikesh' }
    ],
    localTransit: ['Auto-rickshaws', 'Shared vikrams', 'Bikes/Scooter rentals', 'Rafting shuttles'],
    busOperators: [{ name: 'UPSRTC Volvo', route: 'Delhi → Haridwar (then local)', fare: 520 }],
    cabFarePerKm: 12
  },
  goa: {
    nearestRailwayStation: { name: 'Madgaon (Margao) Station', code: 'MAO', distanceKm: 30, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Goa International Airport (Dabolim)', code: 'GOI', distanceKm: 29, airlines: ['IndiGo', 'Air India', 'SpiceJet', 'Vistara'] },
    roadDistances: [
      { from: 'Mumbai', distanceKm: 589, durationHours: '9h', via: 'NH66', mapsLink: 'https://maps.google.com/?daddr=Goa' },
      { from: 'Pune', distanceKm: 454, durationHours: '7.5h', via: 'NH748', mapsLink: 'https://maps.google.com/?daddr=Goa' }
    ],
    localTransit: ['Scooter/Bike rentals (₹350/day)', 'Taxis (fixed rate cards)', 'KTC buses', 'Ferry boats'],
    busOperators: [{ name: 'Paulo Travels', route: 'Mumbai → Goa (Overnight)', fare: 850 }, { name: 'VRL Travels', route: 'Pune → Goa', fare: 720 }],
    cabFarePerKm: 13
  },
  kerala: {
    nearestRailwayStation: { name: 'Alappuzha (Alleppey) Station', code: 'ALLP', distanceKm: 4, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Cochin International Airport', code: 'COK', distanceKm: 84, airlines: ['IndiGo', 'Air India', 'Vistara', 'Emirates'] },
    roadDistances: [
      { from: 'Kochi', distanceKm: 58, durationHours: '1.5h', via: 'NH66', mapsLink: 'https://maps.google.com/?daddr=Alleppey,Kerala' },
      { from: 'Thiruvananthapuram', distanceKm: 156, durationHours: '3h', via: 'NH66', mapsLink: 'https://maps.google.com/?daddr=Alleppey,Kerala' }
    ],
    localTransit: ['Houseboats (private charter)', 'KSRTC buses', 'Auto-rickshaws', 'Speedboats'],
    busOperators: [{ name: 'KSRTC AC', route: 'Kochi → Alleppey', fare: 120 }],
    cabFarePerKm: 12
  },
  varanasi: {
    nearestRailwayStation: { name: 'Varanasi Junction', code: 'BSB', distanceKm: 2, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Lal Bahadur Shastri International Airport', code: 'VNS', distanceKm: 25, airlines: ['IndiGo', 'Air India', 'SpiceJet'] },
    roadDistances: [
      { from: 'Lucknow', distanceKm: 286, durationHours: '4.5h', via: 'NH19', mapsLink: 'https://maps.google.com/?daddr=Varanasi' },
      { from: 'Agra', distanceKm: 565, durationHours: '8.5h', via: 'NH19', mapsLink: 'https://maps.google.com/?daddr=Varanasi' }
    ],
    localTransit: ['Auto-rickshaws', 'E-rickshaws (eco zones)', 'Rowing boats on Ganges', 'Cycle rickshaws'],
    busOperators: [{ name: 'UPSRTC Volvo', route: 'Lucknow → Varanasi', fare: 450 }],
    cabFarePerKm: 11
  },
  agra: {
    nearestRailwayStation: { name: 'Agra Cantt Station', code: 'AGC', distanceKm: 5, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Agra Airport (Kheria)', code: 'AGR', distanceKm: 7, airlines: ['IndiGo', 'Air India'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 206, durationHours: '3.5h', via: 'Yamuna Expressway', mapsLink: 'https://maps.google.com/?daddr=Agra' },
      { from: 'Jaipur', distanceKm: 232, durationHours: '4h', via: 'NH21', mapsLink: 'https://maps.google.com/?daddr=Agra' }
    ],
    localTransit: ['E-rickshaws near Taj Mahal', 'Auto-rickshaws', 'Tonga (horse carriage)', 'Ola/Uber'],
    busOperators: [{ name: 'UPSRTC Volvo', route: 'Delhi → Agra', fare: 350 }],
    cabFarePerKm: 12
  },
  ladakh: {
    nearestRailwayStation: { name: 'Jammu Tawi Station (nearest)', code: 'JAT', distanceKm: 690, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Kushok Bakula Rimpochee Airport (Leh)', code: 'IXL', distanceKm: 4, airlines: ['IndiGo', 'Air India', 'GoFirst', 'Vistara'] },
    roadDistances: [
      { from: 'Manali', distanceKm: 473, durationHours: '2 days', via: 'Manali-Leh Highway (NH3)', mapsLink: 'https://maps.google.com/?daddr=Leh,Ladakh' },
      { from: 'Srinagar', distanceKm: 422, durationHours: '1 day', via: 'Zojila Pass (NH1)', mapsLink: 'https://maps.google.com/?daddr=Leh,Ladakh' }
    ],
    localTransit: ['Shared jeeps/SUVs', 'Bike rentals (Royal Enfield)', 'Local taxis (union rates)'],
    busOperators: [{ name: 'HPTDC Bus', route: 'Manali → Leh (2 days)', fare: 1200 }],
    cabFarePerKm: 18
  },
  darjeeling: {
    nearestRailwayStation: { name: 'New Jalpaiguri (NJP)', code: 'NJP', distanceKm: 67, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Bagdogra Airport', code: 'IXB', distanceKm: 76, airlines: ['IndiGo', 'Air India', 'Vistara'] },
    roadDistances: [
      { from: 'Siliguri', distanceKm: 74, durationHours: '2.5h', via: 'Hill Cart Road', mapsLink: 'https://maps.google.com/?daddr=Darjeeling' },
      { from: 'Kolkata', distanceKm: 621, durationHours: '11h', via: 'NH12', mapsLink: 'https://maps.google.com/?daddr=Darjeeling' }
    ],
    localTransit: ['Toy Train (Darjeeling Himalayan Railway)', 'Shared jeeps', 'Local taxis'],
    busOperators: [{ name: 'SNT Bus', route: 'Siliguri → Darjeeling', fare: 180 }],
    cabFarePerKm: 15
  },
  mumbai: {
    nearestRailwayStation: { name: 'Chhatrapati Shivaji Terminus (CST)', code: 'CSTM', distanceKm: 0, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'CSIA International Airport (T2)', code: 'BOM', distanceKm: 30, airlines: ['IndiGo', 'Air India', 'Vistara', 'SpiceJet'] },
    roadDistances: [
      { from: 'Pune', distanceKm: 148, durationHours: '2.5h', via: 'Mumbai–Pune Expressway', mapsLink: 'https://maps.google.com/?daddr=Mumbai' },
      { from: 'Nashik', distanceKm: 167, durationHours: '3h', via: 'NH160', mapsLink: 'https://maps.google.com/?daddr=Mumbai' }
    ],
    localTransit: ['Mumbai Local Trains', 'BEST Buses', 'Metro', 'Auto-rickshaws (suburbs)', 'Ola/Uber'],
    busOperators: [{ name: 'Neeta Travels', route: 'Pune → Mumbai', fare: 350 }],
    cabFarePerKm: 14
  },
  delhi: {
    nearestRailwayStation: { name: 'New Delhi Railway Station', code: 'NDLS', distanceKm: 0, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Indira Gandhi International Airport (T3)', code: 'DEL', distanceKm: 22, airlines: ['All Major Airlines'] },
    roadDistances: [
      { from: 'Agra', distanceKm: 206, durationHours: '3.5h', via: 'Yamuna Expressway', mapsLink: 'https://maps.google.com/?daddr=Delhi' },
      { from: 'Jaipur', distanceKm: 281, durationHours: '4.5h', via: 'NH48', mapsLink: 'https://maps.google.com/?daddr=Delhi' }
    ],
    localTransit: ['Delhi Metro', 'DTC Buses', 'Auto-rickshaws', 'Ola/Uber', 'E-rickshaws'],
    busOperators: [{ name: 'DTC Volvo', route: 'Delhi → Jaipur', fare: 520 }],
    cabFarePerKm: 13
  },
  hampi: {
    nearestRailwayStation: { name: 'Hospet Junction', code: 'HPT', distanceKm: 13, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Hubli Airport', code: 'HBX', distanceKm: 143, airlines: ['IndiGo', 'Air India'] },
    roadDistances: [
      { from: 'Bengaluru', distanceKm: 340, durationHours: '6h', via: 'NH67', mapsLink: 'https://maps.google.com/?daddr=Hampi' },
      { from: 'Goa', distanceKm: 277, durationHours: '5h', via: 'NH748', mapsLink: 'https://maps.google.com/?daddr=Hampi' }
    ],
    localTransit: ['Auto-rickshaws', 'Bicycle rentals (₹100/day)', 'Coracle boat across Tungabhadra'],
    busOperators: [{ name: 'KSRTC', route: 'Bengaluru → Hospet', fare: 450 }],
    cabFarePerKm: 12
  },
  ooty: {
    nearestRailwayStation: { name: 'Ooty (Udagamandalam) Toy Train', code: 'UAM', distanceKm: 0, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Coimbatore International Airport', code: 'CJB', distanceKm: 105, airlines: ['IndiGo', 'Air India', 'SpiceJet'] },
    roadDistances: [
      { from: 'Coimbatore', distanceKm: 86, durationHours: '2.5h', via: 'NH181', mapsLink: 'https://maps.google.com/?daddr=Ooty' },
      { from: 'Mysore', distanceKm: 126, durationHours: '3h', via: 'Bandipur Forest', mapsLink: 'https://maps.google.com/?daddr=Ooty' }
    ],
    localTransit: ['Nilgiri Mountain Railway (Toy Train)', 'TNSTC buses', 'Local taxis', 'Mini-train to Botanical Gardens'],
    busOperators: [{ name: 'TNSTC', route: 'Coimbatore → Ooty', fare: 120 }],
    cabFarePerKm: 13
  },
  amritsar: {
    nearestRailwayStation: { name: 'Amritsar Junction', code: 'ASR', distanceKm: 2, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Sri Guru Ram Dass Jee International Airport', code: 'ATQ', distanceKm: 11, airlines: ['IndiGo', 'Air India', 'SpiceJet'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 451, durationHours: '7h', via: 'NH44', mapsLink: 'https://maps.google.com/?daddr=Amritsar' },
      { from: 'Chandigarh', distanceKm: 234, durationHours: '4h', via: 'NH44', mapsLink: 'https://maps.google.com/?daddr=Amritsar' }
    ],
    localTransit: ['Auto-rickshaws', 'E-rickshaws (near Golden Temple)', 'PRTC buses'],
    busOperators: [{ name: 'PRTC Volvo', route: 'Delhi → Amritsar', fare: 750 }],
    cabFarePerKm: 12
  },
  coorg: {
    nearestRailwayStation: { name: 'Mysore Junction', code: 'MYS', distanceKm: 120, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Mangalore International Airport', code: 'IXE', distanceKm: 136, airlines: ['IndiGo', 'Air India'] },
    roadDistances: [
      { from: 'Bengaluru', distanceKm: 252, durationHours: '5h', via: 'NH275', mapsLink: 'https://maps.google.com/?daddr=Coorg' },
      { from: 'Mysore', distanceKm: 120, durationHours: '2.5h', via: 'NH275', mapsLink: 'https://maps.google.com/?daddr=Coorg' }
    ],
    localTransit: ['Private taxis', 'Jeep safaris (coffee estates)', 'Auto-rickshaws (Madikeri town)'],
    busOperators: [{ name: 'KSRTC', route: 'Bengaluru → Madikeri', fare: 380 }],
    cabFarePerKm: 13
  },
  default: {
    nearestRailwayStation: { name: 'Nearest Railway Station', code: 'RAIL', distanceKm: 10, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Nearest Airport', code: 'AIR', distanceKm: 35, airlines: ['IndiGo', 'Air India'] },
    roadDistances: [
      { from: 'Nearest Metro City', distanceKm: 150, durationHours: '3h', via: 'National Highway' }
    ],
    localTransit: ['Local Autos', 'Prepaid Taxis', 'Public Bus Transport']
  }
};

export default function TransitHub({ destinationName = 'Destination', destinationKey = '' }) {
  const [activeTab, setActiveTab] = useState('rail');

  const key = (destinationKey || destinationName || '').toLowerCase().replace(/[\s-]+/g, '');
  const data = FALLBACK_TRANSIT_DATA[key] || FALLBACK_TRANSIT_DATA['default'];

  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.06)', fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🚆 Connectivity &amp; Transit Hub — {destinationName}
        </h3>
        <span style={{ fontSize: '12px', background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '20px', fontWeight: 600 }}>
          🇮🇳 Domestic Travel Guide
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('rail')}
          style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeTab === 'rail' ? '#2563eb' : '#f1f5f9', color: activeTab === 'rail' ? 'white' : '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
        >
          🚂 By Train
        </button>
        <button
          onClick={() => setActiveTab('air')}
          style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeTab === 'air' ? '#2563eb' : '#f1f5f9', color: activeTab === 'air' ? 'white' : '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
        >
          ✈️ By Air
        </button>
        <button
          onClick={() => setActiveTab('road')}
          style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeTab === 'road' ? '#2563eb' : '#f1f5f9', color: activeTab === 'road' ? 'white' : '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
        >
          🚗 By Road
        </button>
        <button
          onClick={() => setActiveTab('bus')}
          style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeTab === 'bus' ? '#2563eb' : '#f1f5f9', color: activeTab === 'bus' ? 'white' : '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
        >
          🚌 By Bus
        </button>
        <button
          onClick={() => setActiveTab('local')}
          style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeTab === 'local' ? '#2563eb' : '#f1f5f9', color: activeTab === 'local' ? 'white' : '#475569', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
        >
          🛺 Local Transport
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', border: '1px solid #f1f5f9' }}>
        {activeTab === 'rail' && (
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
              🚉 Nearest Railway Station: {data.nearestRailwayStation.name} ({data.nearestRailwayStation.code})
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Distance from destination center: <strong>{data.nearestRailwayStation.distanceKm} km</strong>
            </div>
            <div style={{ marginTop: '12px' }}>
              <a
                href={data.nearestRailwayStation.link}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-block', background: '#dc2626', color: 'white', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
              >
                🎫 Book Train Ticket on IRCTC
              </a>
            </div>
            <div style={{ marginTop: '12px', padding: '10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
              🚖 Cab from Station/Airport: Est. ₹{Math.round(data.nearestRailwayStation.distanceKm * (data.cabFarePerKm || 13))} – ₹{Math.round(data.nearestRailwayStation.distanceKm * ((data.cabFarePerKm || 13) + 3))}
            </div>
          </div>
        )}

        {activeTab === 'air' && (
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>
              ✈️ Nearest Airport: {data.nearestAirport.name} ({data.nearestAirport.code})
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Distance: <strong>{data.nearestAirport.distanceKm} km</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>
              Major Airlines: {data.nearestAirport.airlines?.join(', ')}
            </div>
            <div style={{ marginTop: '12px' }}>
              <a
                href={`https://www.makemytrip.com/flights/`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-block', background: '#2563eb', color: 'white', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
              >
                🛫 Search Flights on MakeMyTrip
              </a>
            </div>
            <div style={{ marginTop: '12px', padding: '10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
              🚖 Cab from Station/Airport: Est. ₹{Math.round(data.nearestAirport.distanceKm * (data.cabFarePerKm || 13))} – ₹{Math.round(data.nearestAirport.distanceKm * ((data.cabFarePerKm || 13) + 3))}
            </div>
          </div>
        )}

        {activeTab === 'road' && (
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '8px' }}>
              🛣️ Driving Distances from Major Cities
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
              {data.roadDistances.map((r, i) => (
                <div key={i} style={{ background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>From {r.from}</div>
                  <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>{r.distanceKm} km (~{r.durationHours})</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>via {r.via}</div>
                  {r.mapsLink && (
                    <a
                      href={r.mapsLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginTop: '4px', fontSize: '11px', color: '#2563eb', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}
                    >
                      🗺️ Navigate
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bus' && (
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '8px' }}>
              🚌 Intercity Bus Operators
            </div>
            {data.busOperators && data.busOperators.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {data.busOperators.map((b, i) => (
                  <div key={i} style={{ background: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>{b.name}</div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>{b.route}</div>
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>Est. Fare: ₹{b.fare}</div>
                    <a
                      href={`https://www.redbus.in/bus-tickets/${encodeURIComponent(b.route.split('→')[0].trim().toLowerCase())}-to-${encodeURIComponent(b.route.split('→')[1]?.trim().toLowerCase() || '')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginTop: '4px', fontSize: '11px', color: '#d97706', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}
                    >
                      🎫 Book on RedBus
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: '#64748b' }}>No direct bus operator data available. Please check RedBus.</div>
            )}
            <div style={{ marginTop: '12px' }}>
              <a
                href={`https://www.redbus.in/`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-block', background: '#d97706', color: 'white', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
              >
                🚌 Search All Buses on RedBus
              </a>
            </div>
          </div>
        )}

        {activeTab === 'local' && (
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px', marginBottom: '6px' }}>
              🛺 Getting Around in {destinationName}
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
              {data.localTransit.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
