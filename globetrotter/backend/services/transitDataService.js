const TRANSIT_DATA = {
  matheran: {
    nearestRailwayStation: { name: 'Neral Junction', code: 'NRL', distanceKm: 7, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Chhatrapati Shivaji Maharaj International Airport (Mumbai)', code: 'BOM', distanceKm: 94, airlines: ['IndiGo', 'Air India', 'Vistara', 'Akasa Air'] },
    roadDistances: [
      { from: 'Mumbai', distanceKm: 90, durationHours: '2.5h', via: 'NH48 & State Highway' },
      { from: 'Pune', distanceKm: 124, durationHours: '3h', via: 'Mumbai-Pune Expressway' }
    ],
    localTransit: ['Pony / Horse rides from Dasturi Naka', 'Hand-pulled rickshaws', 'Toy Train (Neral to Matheran)', 'Walking inside auto-free eco zone'],
    taxiApps: ['Uber/Ola till Dasturi Naka only']
  },
  lonavala: {
    nearestRailwayStation: { name: 'Lonavala Railway Station', code: 'LNL', distanceKm: 2, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Pune Airport', code: 'PNQ', distanceKm: 72, airlines: ['IndiGo', 'Air India', 'SpiceJet'] },
    roadDistances: [
      { from: 'Mumbai', distanceKm: 83, durationHours: '1.5h', via: 'Mumbai-Pune Expressway' },
      { from: 'Pune', distanceKm: 65, durationHours: '1h', via: 'Mumbai-Pune Expressway' }
    ],
    localTransit: ['Auto-rickshaws', 'Shared Taxis to Tiger Leap', 'Self-drive rental bikes'],
    taxiApps: ['Ola', 'Uber', 'Local Cabs']
  },
  mahabaleshwar: {
    nearestRailwayStation: { name: 'Wathar Railway Station / Satara', code: 'WTR', distanceKm: 60, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Pune Airport', code: 'PNQ', distanceKm: 120, airlines: ['IndiGo', 'Air India', 'Star Air'] },
    roadDistances: [
      { from: 'Mumbai', distanceKm: 263, durationHours: '5h', via: 'NH48' },
      { from: 'Pune', distanceKm: 120, durationHours: '2.5h', via: 'NH48 & Wai Ghat' }
    ],
    localTransit: ['Local Taxi Union Cabs (Fixed Rates)', 'Auto-rickshaws for market', 'MSRTC Bus Service'],
    taxiApps: ['Local Taxi Association']
  },
  mumbai: {
    nearestRailwayStation: { name: 'Mumbai Central / CSMT', code: 'CSMT', distanceKm: 3, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'CSM International Airport', code: 'BOM', distanceKm: 12, airlines: ['All International & Domestic Airlines'] },
    roadDistances: [
      { from: 'Pune', distanceKm: 148, durationHours: '2.5h', via: 'Mumbai-Pune Expressway' },
      { from: 'Goa', distanceKm: 587, durationHours: '10h', via: 'NH66' }
    ],
    localTransit: ['Mumbai Local Trains', 'BEST Buses', 'Metro Line 1, 2A, 7, 3', 'Black-and-Yellow AC Taxis & Rickshaws'],
    taxiApps: ['Ola', 'Uber', 'Rapido']
  },
  jaipur: {
    nearestRailwayStation: { name: 'Jaipur Junction', code: 'JP', distanceKm: 3, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Jaipur International Airport', code: 'JAI', distanceKm: 12, airlines: ['IndiGo', 'Air India', 'SpiceJet', 'Air Asia'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 281, durationHours: '4.5h', via: 'Delhi-Jaipur Expressway (NH48)' },
      { from: 'Agra', distanceKm: 232, durationHours: '4h', via: 'NH21' }
    ],
    localTransit: ['Auto-rickshaws & E-rickshaws', 'Jaipur Metro Line 1', 'Low-floor City Buses', 'Rented Scooters'],
    taxiApps: ['Ola', 'Uber', 'Rapido']
  },
  udaipur: {
    nearestRailwayStation: { name: 'Udaipur City Railway Station', code: 'UDZ', distanceKm: 4, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Maharana Pratap Airport', code: 'UDR', distanceKm: 24, airlines: ['IndiGo', 'Air India', 'Vistara'] },
    roadDistances: [
      { from: 'Jaipur', distanceKm: 393, durationHours: '6h', via: 'NH48' },
      { from: 'Ahmedabad', distanceKm: 262, durationHours: '4.5h', via: 'NH48' }
    ],
    localTransit: ['Auto-rickshaws for Old City', 'Boats on Lake Pichola', 'Rented Bicycles & Scooters'],
    taxiApps: ['Ola', 'Uber']
  },
  jodhpur: {
    nearestRailwayStation: { name: 'Jodhpur Junction', code: 'JU', distanceKm: 3, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Jodhpur Airport', code: 'JDH', distanceKm: 5, airlines: ['IndiGo', 'Air India'] },
    roadDistances: [
      { from: 'Jaipur', distanceKm: 335, durationHours: '5h', via: 'NH25' },
      { from: 'Udaipur', distanceKm: 250, durationHours: '4.5h', via: 'NH58' }
    ],
    localTransit: ['Auto-rickshaws', 'Cycle Rickshaws in Blue City', 'City Buses'],
    taxiApps: ['Ola', 'Uber']
  },
  jaisalmer: {
    nearestRailwayStation: { name: 'Jaisalmer Railway Station', code: 'JSM', distanceKm: 2, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Jaisalmer Airport', code: 'JSA', distanceKm: 17, airlines: ['IndiGo', 'SpiceJet (Seasonal)'] },
    roadDistances: [
      { from: 'Jodhpur', distanceKm: 285, durationHours: '4.5h', via: 'NH11' },
      { from: 'Jaipur', distanceKm: 550, durationHours: '9h', via: 'NH11' }
    ],
    localTransit: ['Auto-rickshaws', 'Camel & Jeep Safaris in Dunes', 'Walking inside Fort'],
    taxiApps: ['Local Desert Cabs']
  },
  manali: {
    nearestRailwayStation: { name: 'Ambala Cantt / Chandigarh', code: 'UMB', distanceKm: 280, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Kullu Manali Airport Bhuntar', code: 'KUU', distanceKm: 50, airlines: ['Alliance Air'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 530, durationHours: '11h', via: 'NH21 / Chandigarh-Manali Expy' },
      { from: 'Chandigarh', distanceKm: 290, durationHours: '6.5h', via: 'NH21' }
    ],
    localTransit: ['Himachal HRTC Volvo Buses', 'Local Taxi Union Cars', 'Scooter Rentals'],
    taxiApps: ['Local Taxi Union']
  },
  shimla: {
    nearestRailwayStation: { name: 'Kalka Railway Station (Kalka-Shimla Toy Train)', code: 'KLK', distanceKm: 88, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Shimla Jubbarhatti Airport', code: 'SLV', distanceKm: 22, airlines: ['Alliance Air'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 345, durationHours: '7h', via: 'NH44 & NH5' },
      { from: 'Chandigarh', distanceKm: 112, durationHours: '3h', via: 'NH5 Himalayan Expressway' }
    ],
    localTransit: ['HPTDC & HRTC Buses', 'Mall Road Lift', 'Local Auto & Taxis'],
    taxiApps: ['Ola', 'Local Taxi Association']
  },
  dharamshala: {
    nearestRailwayStation: { name: 'Pathankot Cantt', code: 'PTKC', distanceKm: 85, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Gaggal Airport Kangra', code: 'DHM', distanceKm: 13, airlines: ['IndiGo', 'SpiceJet'] },
    roadDistances: [
      { from: 'Chandigarh', distanceKm: 245, durationHours: '5h', via: 'NH205' },
      { from: 'Delhi', distanceKm: 475, durationHours: '9h', via: 'NH44' }
    ],
    localTransit: ['Local Taxis & Shared Vans', 'HRTC Buses to McLeod Ganj', 'Ropeway Skyway to McLeod Ganj'],
    taxiApps: ['Local Cabs']
  },
  rishikesh: {
    nearestRailwayStation: { name: 'Yog Nagari Rishikesh / Haridwar', code: 'YNRK', distanceKm: 3, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Dehradun Jolly Grant Airport', code: 'DED', distanceKm: 21, airlines: ['IndiGo', 'Air India', 'Vistara'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 240, durationHours: '4.5h', via: 'Delhi-Dehradun Expressway / NH334' },
      { from: 'Dehradun', distanceKm: 45, durationHours: '1h', via: 'Rishikesh Rd' }
    ],
    localTransit: ['Shared Auto-rickshaws (Vikram)', 'Scooter & Motorcycle Rentals', 'Walking across Laxman/Ram Jhula bridges'],
    taxiApps: ['Ola', 'Uber']
  },
  goa: {
    nearestRailwayStation: { name: 'Madgaon Junction / Thivim', code: 'MAO', distanceKm: 15, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Manohar International Airport Mopa / Dabolim', code: 'GOX', distanceKm: 25, airlines: ['IndiGo', 'Air India', 'Akasa Air', 'SpiceJet'] },
    roadDistances: [
      { from: 'Mumbai', distanceKm: 587, durationHours: '10h', via: 'NH66' },
      { from: 'Bengaluru', distanceKm: 560, durationHours: '9.5h', via: 'NH48' }
    ],
    localTransit: ['Rented Scooters & Self-drive Cars', 'Goa Miles App Taxis', 'Pilotos (Motorcycle Taxis)', 'Kadamba Buses'],
    taxiApps: ['GoaMiles', 'Local Taxi Counters']
  },
  kerala: {
    nearestRailwayStation: { name: 'Ernakulam Junction (Kochi) / Alleppey', code: 'ERS', distanceKm: 5, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Cochin International Airport', code: 'COK', distanceKm: 35, airlines: ['IndiGo', 'Air India', 'Emirates', 'Air India Express'] },
    roadDistances: [
      { from: 'Bengaluru', distanceKm: 530, durationHours: '9h', via: 'NH544' },
      { from: 'Chennai', distanceKm: 680, durationHours: '11h', via: 'NH44' }
    ],
    localTransit: ['Houseboats & Water Metro in Kochi', 'KSRTC Buses', 'Auto-rickshaws', 'Prepaid Airport Taxis'],
    taxiApps: ['Ola', 'Uber']
  },
  coorg: {
    nearestRailwayStation: { name: 'Mysuru Junction', code: 'MYS', distanceKm: 117, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Kannur International Airport / Mangaluru', code: 'CNN', distanceKm: 90, airlines: ['IndiGo', 'Air India Express'] },
    roadDistances: [
      { from: 'Bengaluru', distanceKm: 265, durationHours: '5h', via: 'Mysore-Bengaluru Expressway' },
      { from: 'Mysuru', distanceKm: 117, durationHours: '2.5h', via: 'NH275' }
    ],
    localTransit: ['Private Tourist Cabs', 'KSRTC Buses', 'Jeeps for Waterfalls & Peaks'],
    taxiApps: ['Local Tour Cabs']
  },
  hampi: {
    nearestRailwayStation: { name: 'Hosapete Junction', code: 'HPT', distanceKm: 13, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Jindal Vijayanagar Airport Bellary / Hubballi', code: 'VDY', distanceKm: 40, airlines: ['Alliance Air'] },
    roadDistances: [
      { from: 'Bengaluru', distanceKm: 340, durationHours: '6h', via: 'NH50' },
      { from: 'Goa', distanceKm: 310, durationHours: '6.5h', via: 'NH63' }
    ],
    localTransit: ['Bicycle & Moped Rentals', 'Auto-rickshaws', 'Coracle Boats across Tungabhadra'],
    taxiApps: ['Local Auto & Taxi Union']
  },
  ooty: {
    nearestRailwayStation: { name: 'Mettupalayam (Nilgiri Mountain Railway Toy Train to Ooty)', code: 'MTP', distanceKm: 46, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Coimbatore International Airport', code: 'CJB', distanceKm: 88, airlines: ['IndiGo', 'Air India'] },
    roadDistances: [
      { from: 'Bengaluru', distanceKm: 270, durationHours: '6h', via: 'NH766 & Bandipur Reserve' },
      { from: 'Mysuru', distanceKm: 125, durationHours: '3h', via: 'NH766' }
    ],
    localTransit: ['Nilgiri Toy Train', 'TNSTC Hill Buses', 'Local Taxis', 'Auto-rickshaws'],
    taxiApps: ['Local Cabs']
  },
  varanasi: {
    nearestRailwayStation: { name: 'Varanasi Junction / Banaras', code: 'BSB', distanceKm: 3, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Lal Bahadur Shastri International Airport', code: 'VNS', distanceKm: 26, airlines: ['IndiGo', 'Air India', 'Vistara', 'SpiceJet'] },
    roadDistances: [
      { from: 'Lucknow', distanceKm: 310, durationHours: '5.5h', via: 'Purvanchal Expressway' },
      { from: 'Prayagraj', distanceKm: 120, durationHours: '2.5h', via: 'NH19' }
    ],
    localTransit: ['Wooden Boats & Motorboats on Ganga', 'E-rickshaws & Cycle Rickshaws', 'Walking along Ghats'],
    taxiApps: ['Ola', 'Uber']
  },
  agra: {
    nearestRailwayStation: { name: 'Agra Cantt', code: 'AGC', distanceKm: 4, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Agra Kheria Airport / Delhi Airport', code: 'AGR', distanceKm: 12, airlines: ['IndiGo (Limited)'] },
    roadDistances: [
      { from: 'Delhi', distanceKm: 210, durationHours: '3h', via: 'Yamuna Expressway' },
      { from: 'Jaipur', distanceKm: 240, durationHours: '4h', via: 'NH21' }
    ],
    localTransit: ['Electric Rickshaws & Golf Cabs inside Taj Zone', 'Auto-rickshaws', 'Prepaid Taxis'],
    taxiApps: ['Ola', 'Uber']
  },
  ladakh: {
    nearestRailwayStation: { name: 'Jammu Tawi / Chandigarh', code: 'JAT', distanceKm: 700, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Kushok Bakula Rimpochee Airport Leh', code: 'IXL', distanceKm: 5, airlines: ['IndiGo', 'Air India', 'SpiceJet'] },
    roadDistances: [
      { from: 'Manali', distanceKm: 470, durationHours: '2 Days', via: 'Leh-Manali Highway (Seasonal)' },
      { from: 'Srinagar', distanceKm: 420, durationHours: '2 Days', via: 'NH1 Zoji La Pass (Seasonal)' }
    ],
    localTransit: ['Ladakh Taxi Union 4x4 Jeeps (Fixed Tariff)', 'Royal Enfield Motorcycle Rentals', 'Local Shared Vans'],
    taxiApps: ['Ladakh Taxi Operators Union']
  },
  darjeeling: {
    nearestRailwayStation: { name: 'New Jalpaiguri (NJP) / Darjeeling Himalayan Railway', code: 'NJP', distanceKm: 70, link: 'https://www.irctc.co.in/nget/train-search' },
    nearestAirport: { name: 'Bagdogra Airport', code: 'IXB', distanceKm: 68, airlines: ['IndiGo', 'Air India', 'SpiceJet', 'Akasa Air'] },
    roadDistances: [
      { from: 'Kolkata', distanceKm: 610, durationHours: '13h', via: 'NH12' },
      { from: 'Siliguri', distanceKm: 65, durationHours: '2.5h', via: 'Hill Cart Road' }
    ],
    localTransit: ['Darjeeling Toy Train', 'Shared Taxis (Sumo/Bolero)', 'Ropeway Cable Car', 'Walking along Chowrasta'],
    taxiApps: ['Local Taxi Syndicate']
  }
};

function getTransitForDestination(destinationKey) {
  if (!destinationKey) return null;
  const key = destinationKey.toLowerCase().replace(/[\s-]+/g, '');
  for (const k in TRANSIT_DATA) {
    if (k === key || key.includes(k) || k.includes(key)) {
      return TRANSIT_DATA[k];
    }
  }
  return null;
}

module.exports = {
  TRANSIT_DATA,
  getTransitForDestination
};
