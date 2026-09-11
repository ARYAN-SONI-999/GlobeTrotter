// Travel Agency Tourism Feed & API Service
// Curating MakeMyTrip, TripAdvisor, Viator, and Incredible India verified destination data

const TOUR_AGENCY_FEED = {
  // --- Maharashtra ---
  'matheran': {
    name: 'Matheran',
    state: 'Maharashtra',
    region: 'Western Ghats',
    agencyRating: 4.8,
    agencyReviews: '14,200+ Verified Travelers',
    certifications: ['MakeMyTrip Top Eco Destination', 'TripAdvisor Traveler’s Choice 2026'],
    bestMonths: 'October to May & Monsoon (June-Sept)',
    idealDuration: '2 - 3 Days',
    avgCostPerDayINR: 2400,
    coverPhoto: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
    description: 'Asia’s only automobile-free hill station perched in Maharashtra’s Sahyadri ranges with scenic viewpoints, red-laterite walking trails, and the 1907 heritage toy train.',
    agencyPackages: [
      { title: 'Matheran Weekend Nature & Viewpoints Trail', duration: '2 Days / 1 Night', priceINR: 4800, badge: 'Popular Weekend' },
      { title: 'Sahyadri Monsoon Waterfalls & Valley Retreat', duration: '3 Days / 2 Nights', priceINR: 7500, badge: 'Best Seller' }
    ],
    places: [
      { name: 'Charlotte Lake & Louisa Point', category: 'Nature & Outdoors', rating: 4.9, cost: 0, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', description: 'Freshwater lake surrounded by dense rainforest leading to dramatic cliffside views of Prabal Fort.', tip: 'Visit at 8:30 AM for peaceful nature walks and birdwatching.' },
      { name: 'Panorama Point 360° Sunrise Lookout', category: 'Landmark', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', description: 'Known as the Sunrise Point offering an unmatched 360-degree panoramic vista across the Western Ghats.', tip: 'Trek early before dawn to witness golden sunbeams piercing through valley clouds.' },
      { name: 'Neral-Matheran Heritage Toy Train & Market Walk', category: 'Cultural', rating: 4.8, cost: 150, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80', description: 'UNESCO-recognized 1907 narrow-gauge railway winding through misty hillside slopes ending in the vibrant pedestrian bazaar.', tip: 'Book toy train tickets at Aman Lodge / Neral station early.' },
      { name: 'Echo Point & Honeymoon Hill Vistas', category: 'Landmark', rating: 4.8, cost: 0, duration: 2.0, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80', description: 'Famous acoustics cliffpoint where your voice reverberates across valleys with sweeping views of deep verdant gorges.', tip: 'Shout toward the distant plateau to hear clear multi-second acoustic echoes.' },
      { name: 'Porcupine Point (Sunset Point)', category: 'Landmark', rating: 4.9, cost: 0, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', description: 'Premier golden hour vantage point overlooking Prabalgad fort and glowing orange mountain silhouettes.', tip: 'Reach by 5:15 PM and enjoy roasted spiced corn (bhutta) as the sun sets.' }
    ]
  },
  'lonavala': {
    name: 'Lonavala & Khandala',
    state: 'Maharashtra',
    region: 'Western Ghats',
    agencyRating: 4.7,
    agencyReviews: '28,000+ Verified Travelers',
    certifications: ['MakeMyTrip Top Monsoon Getaway', 'Viator Highly Recommended'],
    bestMonths: 'July to March',
    idealDuration: '2 - 3 Days',
    avgCostPerDayINR: 2800,
    coverPhoto: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=1200&q=80',
    description: 'Picturesque hill town in Maharashtra celebrated for misty mountain cliffs, 2nd-century BC rock-cut Buddhist caves, and lush green waterfalls.',
    agencyPackages: [
      { title: 'Lonavala Heritage Caves & Valley Tour', duration: '2 Days / 1 Night', priceINR: 5200, badge: 'Heritage Special' }
    ],
    places: [
      { name: 'Tiger’s Leap & Lion’s Point Sunset', category: 'Landmark', rating: 4.8, cost: 0, duration: 2.5, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80', description: 'Dramatic cliff with an abrupt 650m drop offering valley views and roaring winds resembling a tiger leaping into the valley.', tip: 'Savor piping hot onion pakodas and roasted corn while enjoying the swirling mountain mist.' },
      { name: 'Karla & Bhaja Ancient Buddhist Caves', category: 'Cultural', rating: 4.9, cost: 50, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80', description: '2nd-century BC rock-cut Buddhist chaitya halls with massive sculpted pillars, stupas, and monastic cells.', tip: 'Climb Karla Cave steps early in the morning to escape midday heat.' },
      { name: 'Bhushi Dam & Water Cascades', category: 'Leisure', rating: 4.6, cost: 0, duration: 2.5, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80', description: 'Popular masonry dam on Indrayani river where water flows over stone steps creating natural soaking spots.', tip: 'Visit during monsoon season for the best overflowing water experience.' }
    ]
  },
  'mahabaleshwar': {
    name: 'Mahabaleshwar & Panchgani',
    state: 'Maharashtra',
    region: 'Western Ghats',
    agencyRating: 4.8,
    agencyReviews: '22,400+ Verified Travelers',
    certifications: ['TripAdvisor Traveler’s Choice 2026', 'MakeMyTrip Strawberry Capital'],
    bestMonths: 'October to June',
    idealDuration: '3 Days',
    avgCostPerDayINR: 3000,
    coverPhoto: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80',
    description: 'Queen of Maharashtra hill stations renowned for panoramic canyon lookouts, boat rides on Venna Lake, and fresh Mapro strawberry plantations.',
    agencyPackages: [
      { title: 'Mahabaleshwar Scenic Points & Strawberry Farm Tour', duration: '3 Days / 2 Nights', priceINR: 8400, badge: 'Family Favorite' }
    ],
    places: [
      { name: 'Arthur’s Seat Queen of Points', category: 'Landmark', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', description: 'Famous viewpoint perched at 1,340m looking over dense Jor Valley and Savitri River.', tip: 'Watch light objects float upward due to strong reverse air currents.' },
      { name: 'Venna Lake Boating & Lakeside Walk', category: 'Leisure', rating: 4.7, cost: 250, duration: 2.0, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', description: 'Tranquil lake surrounded by tall pine trees offering paddle boats and lakeside street food.', tip: 'Take a boat ride around 4:30 PM to catch golden sunset reflections on the lake surface.' },
      { name: 'Mapro Garden & Strawberry Estate', category: 'Food & Dining', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80', description: 'Sprawling strawberry agro-tourism park offering fresh strawberry cream, wood-fired pizzas, and fruit syrups.', tip: 'Try the iconic chocolate strawberry fondue and take home artisanal fruit jams.' }
    ]
  },
  'mumbai': {
    name: 'Mumbai',
    state: 'Maharashtra',
    region: 'Konkan Coast',
    agencyRating: 4.8,
    agencyReviews: '52,000+ Verified Travelers',
    certifications: ['MakeMyTrip Top City Break', 'Viator Urban Explorer'],
    bestMonths: 'October to March',
    idealDuration: '3 - 4 Days',
    avgCostPerDayINR: 3800,
    coverPhoto: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
    description: 'The bustling City of Dreams, featuring British colonial architecture, Bollywood glamour, vibrant street food, and Arabian Sea promenades.',
    places: [
      { name: 'Gateway of India & Taj Mahal Palace', category: 'Landmark', rating: 4.8, cost: 0, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80', description: 'Majestic basalt arch facing Mumbai harbour erected in 1911 alongside the legendary Taj heritage hotel.', tip: 'Take a harbour ferry from the Gateway jetty for sea views of the Mumbai skyline.' },
      { name: 'Marine Drive Queen’s Necklace Sunset', category: 'Leisure', rating: 4.9, cost: 0, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80', description: '3.6 km sweeping coastal promenade curving around Back Bay, twinkling like a string of pearls at night.', tip: 'Grab roasted spiced corn (bhutta) and sit on the promenade tetrapods as the evening sea breeze kicks in.' }
    ]
  },

  // --- Rajasthan ---
  'jaipur': {
    name: 'Jaipur',
    state: 'Rajasthan',
    region: 'North India',
    agencyRating: 4.9,
    agencyReviews: '64,000+ Verified Travelers',
    certifications: ['TripAdvisor Top World Heritage 2026', 'MakeMyTrip Royal Choice'],
    bestMonths: 'October to March',
    idealDuration: '3 - 4 Days',
    avgCostPerDayINR: 3200,
    coverPhoto: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
    description: 'The Pink City of Rajasthan, acclaimed for majestic hilltop forts, intricately carved royal palaces, and vibrant Rajasthani culture.',
    agencyPackages: [
      { title: 'Jaipur Golden Triangle Forts & Palaces', duration: '3 Days / 2 Nights', priceINR: 8900, badge: 'Top Seller' }
    ],
    places: [
      { name: 'Amber Fort & Sheesh Mahal', category: 'Cultural', rating: 4.9, cost: 300, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80', description: 'Majestic hilltop Rajput fort with intricate marble mirror palace (Sheesh Mahal) overlooking Maota Lake.', tip: 'Ride the electric jeep up to Suraj Pol gate early in the morning for crisp photo lighting.' },
      { name: 'Hawa Mahal (Palace of Winds)', category: 'Landmark', rating: 4.8, cost: 50, duration: 1.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80', description: 'Iconic five-story pink sandstone facade with 953 intricately carved jharokha honeycomb windows.', tip: 'Visit Wind View Cafe or Tattoo Cafe across the street for a spectacular rooftop front-facing view.' },
      { name: 'City Palace & Jantar Mantar', category: 'Cultural', rating: 4.8, cost: 300, duration: 2.5, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80', description: 'Royal residence blending Rajput and Mughal design, adjacent to the UNESCO 18th-century astronomical observatory.', tip: 'Book access to the Chandra Mahal private royal suites for the world-famous blue peacock courtyard.' },
      { name: 'Nahargarh Fort Sunset Viewpoint', category: 'Landmark', rating: 4.9, cost: 50, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80', description: 'Perched high on the Aravalli hills, offering the most breathtaking golden sunset view across the entire Pink City.', tip: 'Head to Padao open-air cafe on the fort ramparts for tea and panoramic city lights as darkness falls.' }
    ]
  },
  'udaipur': {
    name: 'Udaipur',
    state: 'Rajasthan',
    region: 'Aravalli Lakes',
    agencyRating: 4.9,
    agencyReviews: '46,000+ Verified Travelers',
    certifications: ['TripAdvisor Most Romantic City', 'MakeMyTrip Premium Choice'],
    bestMonths: 'September to March',
    idealDuration: '3 Days',
    avgCostPerDayINR: 3600,
    coverPhoto: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=1200&q=80',
    description: 'The City of Lakes and Venice of the East, boasting floating marble palaces, tranquil Pichola boat rides, and romantic sunsets.',
    places: [
      { name: 'City Palace of Udaipur & Museum', category: 'Cultural', rating: 4.9, cost: 300, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&q=80', description: 'Rajasthan’s largest palace complex overlooking Lake Pichola featuring jewel-encrusted peacock courtyards and royal galleries.', tip: 'Visit Mor Chowk and the Crystal Gallery early in the morning for crisp photography.' },
      { name: 'Lake Pichola Sunset Boat Cruise & Jag Mandir', category: 'Leisure', rating: 4.9, cost: 450, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80', description: 'Glide across mirror-like waters past the floating white-marble Lake Palace with Aravalli sunset reflections.', tip: 'Take the 5:15 PM boat that includes a stopover at the island palace Jag Mandir.' }
    ]
  },
  'jodhpur': {
    name: 'Jodhpur',
    state: 'Rajasthan',
    region: 'Thar Desert Gate',
    agencyRating: 4.8,
    agencyReviews: '31,000+ Verified Travelers',
    certifications: ['MakeMyTrip Blue City Heritage', 'Viator Cultural Star'],
    bestMonths: 'October to March',
    idealDuration: '2 - 3 Days',
    avgCostPerDayINR: 2800,
    coverPhoto: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=1200&q=80',
    description: 'The Sun City and Blue City, crowned by the colossal Mehrangarh Fort rising 400 feet above indigo-blue houses.',
    places: [
      { name: 'Mehrangarh Fort & Museum', category: 'Cultural', rating: 4.9, cost: 200, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80', description: 'One of the largest forts in India with grand courtyards (Moti Mahal, Phool Mahal) and zip-lining over fort moats.', tip: 'Try the Flying Fox zip-lining circuit for aerial fort rampart views.' },
      { name: 'Jaswant Thada White Marble Cenotaph', category: 'Landmark', rating: 4.8, cost: 50, duration: 1.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80', description: 'Carved white marble royal cenotaph known as the Taj Mahal of Marwar surrounded by tiered gardens and lakeside birds.', tip: 'The sunlight through translucent marble sheets creates a warm amber glow.' }
    ]
  },
  'jaisalmer': {
    name: 'Jaisalmer',
    state: 'Rajasthan',
    region: 'Thar Desert',
    agencyRating: 4.9,
    agencyReviews: '38,000+ Verified Travelers',
    certifications: ['TripAdvisor Desert Safari Award', 'MakeMyTrip Golden Fort Star'],
    bestMonths: 'October to March',
    idealDuration: '3 Days',
    avgCostPerDayINR: 3200,
    coverPhoto: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80',
    description: 'The Golden City of the Thar Desert, renowned for its living yellow sandstone fort, camel safaris, and desert camping under starlit skies.',
    places: [
      { name: 'Jaisalmer Golden Fort (Sonar Qila)', category: 'Cultural', rating: 4.9, cost: 100, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80', description: 'Living UNESCO fortress housing thousands of residents, Jain temples, and ornate merchant havelis.', tip: 'Explore the narrow stone alleys on foot to meet local puppet artisans.' },
      { name: 'Sam Sand Dunes Camel Safari & Desert Camp', category: 'Adventure', rating: 4.9, cost: 1500, duration: 5.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80', description: 'Thrilling camel rides and 4x4 dune bashing across golden sand dunes followed by Kalbeliya folk dances and campfire dinners.', tip: 'Stay overnight in a luxury desert tent to experience desert stargazing.' }
    ]
  },

  // --- Himachal Pradesh ---
  'manali': {
    name: 'Manali',
    state: 'Himachal Pradesh',
    region: 'Himalayas',
    agencyRating: 4.9,
    agencyReviews: '58,000+ Verified Travelers',
    certifications: ['MakeMyTrip Top Mountain Paradise', 'TripAdvisor Adventure Choice'],
    bestMonths: 'March to June & Dec-Feb for Snow',
    idealDuration: '4 - 5 Days',
    avgCostPerDayINR: 3100,
    coverPhoto: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80',
    description: 'High Himalayan mountain valley flanked by cedar forests, snow-clad peaks, paragliding meadows in Solang, and the Atal Tunnel.',
    places: [
      { name: 'Solang Valley Adventure & Paragliding', category: 'Adventure', rating: 4.9, cost: 800, duration: 4.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', description: 'High-mountain valley renowned for tandem paragliding, zorbing, snow scooter rides, and alpine meadows.', tip: 'Opt for long-fly paragliding from the higher cable car peak for breathtaking views.' },
      { name: 'Hadimba Devi Ancient Cedar Forest Temple', category: 'Cultural', rating: 4.8, cost: 0, duration: 1.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80', description: 'Unique four-tiered wooden pagoda temple built in 1553 nestled in dense giant deodar Dhungri forest.', tip: 'Look for traditional Yak photo spots right outside the forest gate.' },
      { name: 'Old Manali River Cafes & Apple Orchards', category: 'Food & Dining', rating: 4.8, cost: 400, duration: 3.0, bestTime: 'Evening', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', description: 'Laid-back mountain village with live acoustic music cafes serving fresh river trout, wood-fired pizzas, and masala chai.', tip: 'Sit at Cafe 1947 by the gushing Manalsu river.' }
    ]
  },
  'shimla': {
    name: 'Shimla',
    state: 'Himachal Pradesh',
    region: 'Himalayas',
    agencyRating: 4.8,
    agencyReviews: '48,000+ Verified Travelers',
    certifications: ['MakeMyTrip Queen of Hills', 'TripAdvisor Colonial Heritage'],
    bestMonths: 'March to June & Dec-Jan',
    idealDuration: '3 Days',
    avgCostPerDayINR: 2900,
    coverPhoto: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&q=80',
    description: 'Colonial summer capital of British India with neo-Gothic Christ Church, the Ridge promenade, and pine mountain trails.',
    places: [
      { name: 'The Ridge & Mall Road Heritage Walk', category: 'Cultural', rating: 4.8, cost: 0, duration: 2.5, bestTime: 'Evening', imageUrl: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80', description: 'Pedestrian cultural heart of Shimla featuring neo-Gothic Christ Church, colonial architecture, and mountain views.', tip: 'Visit at dusk when the church and mountain valley light up beautifully.' },
      { name: 'Jakhoo Temple & Giant Hanuman Statue', category: 'Landmark', rating: 4.8, cost: 0, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80', description: 'Hilltop temple at 2,455m crowned by a massive 108-foot Hanuman statue with cable car ropeway access.', tip: 'Take the Jakhoo Ropeway from Ridge for aerial pine forest views.' },
      { name: 'Kufri Snow & Adventure Park', category: 'Adventure', rating: 4.7, cost: 500, duration: 4.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', description: 'High-altitude adventure zone offering snow sports, yak rides, tobogganing, and Himalayan nature views.', tip: 'Rent warm boots and snow gear at the base.' }
    ]
  },
  'dharamshala': {
    name: 'Dharamshala & McLeod Ganj',
    state: 'Himachal Pradesh',
    region: 'Dhauladhar Ranges',
    agencyRating: 4.9,
    agencyReviews: '29,000+ Verified Travelers',
    certifications: ['TripAdvisor Spiritual Haven', 'MakeMyTrip Little Lhasa'],
    bestMonths: 'September to June',
    idealDuration: '3 - 4 Days',
    avgCostPerDayINR: 2600,
    coverPhoto: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
    description: 'Residence of His Holiness the Dalai Lama and Tibetan Government-in-Exile, set against dramatic snow-capped Dhauladhar peaks.',
    places: [
      { name: 'Tsuglagkhang Dalai Lama Main Temple', category: 'Cultural', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&q=80', description: 'Peaceful Tibetan temple complex where monks debate, spinning prayer wheels, and sacred butter lamps glow.', tip: 'Visit during morning monk debate sessions in the courtyard.' },
      { name: 'Bhagsu Waterfall & Shiva Cafe', category: 'Nature & Outdoors', rating: 4.8, cost: 0, duration: 2.5, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80', description: 'Cascading mountain waterfall with a rocky trail leading to the bohemian Shiva Cafe overlooking the valley.', tip: 'Wear grippy shoes as the stone trail up to Shiva Cafe can be slippery.' }
    ]
  },

  // --- Uttarakhand ---
  'rishikesh': {
    name: 'Rishikesh',
    state: 'Uttarakhand',
    region: 'Garhwal Himalayas',
    agencyRating: 4.9,
    agencyReviews: '51,000+ Verified Travelers',
    certifications: ['MakeMyTrip Yoga Capital of the World', 'Viator Top Adventure 2026'],
    bestMonths: 'September to May',
    idealDuration: '3 - 4 Days',
    avgCostPerDayINR: 2300,
    coverPhoto: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e13?w=1200&q=80',
    description: 'Spiritual and adventure epicenter on the holy Ganges River, offering world-class river rafting, yoga ashrams, and the Beatles retreat.',
    places: [
      { name: 'Triveni Ghat Evening Maha Ganga Aarti', category: 'Cultural', rating: 5.0, cost: 0, duration: 2.0, bestTime: 'Evening', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80', description: 'Soul-stirring spiritual ceremony of bells, drums, Vedic chants, and floating oil leaf lamps on the river.', tip: 'Arrive 45 minutes before sunset to sit near the river steps.' },
      { name: 'White Water River Rafting in Ganga', category: 'Adventure', rating: 4.9, cost: 800, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=80', description: 'Thrilling Class III/IV river rapids (Roller Coaster, Golf Course) surrounded by Himalayan cliffs.', tip: 'Opt for the 16km Shivpuri stretch for the best mix of rapids and cliff jumping.' },
      { name: 'Lakshman & Ram Jhula Suspension Bridges', category: 'Landmark', rating: 4.7, cost: 0, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e13?w=800&q=80', description: 'Iconic suspension bridges spanning the turquoise Ganga connecting ashrams, yoga schools, and cafes.', tip: 'Stop at riverside rooftop cafes near Ram Jhula.' }
    ]
  },

  // --- Goa ---
  'goa': {
    name: 'Goa',
    state: 'Goa',
    region: 'Konkan Coast',
    agencyRating: 4.9,
    agencyReviews: '82,000+ Verified Travelers',
    certifications: ['MakeMyTrip #1 Beach Destination', 'TripAdvisor World Top 10 Beach'],
    bestMonths: 'November to April & Monsoon (June-Sept)',
    idealDuration: '4 - 6 Days',
    avgCostPerDayINR: 3500,
    coverPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
    description: 'Sun-drenched tropical paradise famous for golden sand beaches, Portuguese colonial churches, scuba diving, and vibrant nightlife.',
    places: [
      { name: 'Baga & Calangute Beach Watersports', category: 'Adventure', rating: 4.7, cost: 1200, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', description: 'Goa’s liveliest golden sand beach offering parasailing, jet skiing, banana boat rides, and beachfront shacks.', tip: 'Do watersports between 9 AM and 11 AM when the sea is calm.' },
      { name: 'Dudhsagar Waterfalls & Jungle Jeep Safari', category: 'Nature & Outdoors', rating: 4.9, cost: 1800, duration: 5.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80', description: 'Spectacular 310-meter four-tiered milky waterfall in Bhagwan Mahaveer Sanctuary reached by 4x4 jungle jeep.', tip: 'Wear the mandatory life jackets and take a refreshing dip at the base.' },
      { name: 'Fort Aguada & 17th Century Lighthouse', category: 'Landmark', rating: 4.7, cost: 50, duration: 2.0, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80', description: 'Well-preserved Portuguese fortress offering sweeping 360-degree views where Mandovi River meets Arabian Sea.', tip: 'Walk down to the lower fort prison ramparts for incredible crashing wave photography.' }
    ]
  },

  // --- Kerala ---
  'kerala': {
    name: 'Kerala (Alleppey & Munnar)',
    state: 'Kerala',
    region: 'South India',
    agencyRating: 5.0,
    agencyReviews: '71,000+ Verified Travelers',
    certifications: ['TripAdvisor National Geographic 50 Places of a Lifetime', 'MakeMyTrip God’s Own Country'],
    bestMonths: 'September to March',
    idealDuration: '5 - 7 Days',
    avgCostPerDayINR: 3400,
    coverPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
    description: 'God’s Own Country, famed for tranquil emerald backwater houseboat cruises, misty rolling tea gardens in Munnar, and Ayurvedic retreats.',
    places: [
      { name: 'Alleppey Backwaters Houseboat Cruise', category: 'Leisure', rating: 5.0, cost: 2500, duration: 5.0, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', description: 'Private thatched-roof Kettuvallam houseboat navigating palm-shaded emerald canals, paddy fields, and lagoons.', tip: 'Request the onboard chef to prepare freshly caught Karimeen Pollichathu in banana leaf.' },
      { name: 'Munnar Misty Tea Gardens & Eravikulam', category: 'Nature & Outdoors', rating: 4.9, cost: 200, duration: 4.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80', description: 'Rolling emerald tea plantations, mountain mist, and habitat of the endangered Nilgiri Tahr mountain goat.', tip: 'Visit the KDHP Tea Museum to taste single-origin white and green tea infusions.' }
    ]
  },

  // --- Karnataka ---
  'coorg': {
    name: 'Coorg (Madikeri)',
    state: 'Karnataka',
    region: 'Western Ghats',
    agencyRating: 4.8,
    agencyReviews: '34,000+ Verified Travelers',
    certifications: ['MakeMyTrip Scotland of India', 'TripAdvisor Coffee Lover’s Pick'],
    bestMonths: 'October to May',
    idealDuration: '3 Days',
    avgCostPerDayINR: 2800,
    coverPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
    description: 'The Scotland of India, blanketed with aromatic coffee estates, roaring waterfalls, misty hills, and rich Kodava heritage.',
    places: [
      { name: 'Abbey Falls & Coffee Estate Trail', category: 'Nature & Outdoors', rating: 4.8, cost: 50, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80', description: 'Roaring waterfall cascading from 70 feet nestled inside private coffee estates and spice plantations.', tip: 'Stand on the hanging bridge opposite the falls for mist spray photos.' },
      { name: 'Raja’s Seat Sunset & Musical Fountain', category: 'Landmark', rating: 4.8, cost: 30, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', description: 'Historic garden pavilion where the Kings of Kodagu watched sunsets across undulating green hills.', tip: 'Arrive by 5:30 PM to catch the setting sun and the evening musical fountain show.' },
      { name: 'Namdroling Golden Temple Tibetan Monastery', category: 'Cultural', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&q=80', description: 'Largest Tibetan Buddhist settlement in South India featuring 40-foot gilded gold Buddha statues.', tip: 'Visit during afternoon monk prayer chants to experience hypnotic traditional horns.' }
    ]
  },
  'hampi': {
    name: 'Hampi',
    state: 'Karnataka',
    region: 'Tungabhadra Basin',
    agencyRating: 5.0,
    agencyReviews: '38,000+ Verified Travelers',
    certifications: ['UNESCO World Heritage Site', 'TripAdvisor Top Historic Wonder'],
    bestMonths: 'October to March',
    idealDuration: '3 Days',
    avgCostPerDayINR: 2200,
    coverPhoto: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
    description: 'The monumental 14th-century Vijayanagara Empire capital set amidst surreal boulder-strewn landscapes and ancient temple complexes.',
    places: [
      { name: 'Vijaya Vittala Temple & Stone Chariot', category: 'Cultural', rating: 5.0, cost: 50, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80', description: 'Architectural masterpiece featuring the iconic monolithic stone chariot and 56 musical pillars that chime when tapped.', tip: 'Visit at 7:30 AM to photograph the stone chariot with soft morning sun shadows.' },
      { name: 'Virupaksha Temple & Hampi Bazaar', category: 'Cultural', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&q=80', description: '7th-century functioning Shiva temple with a towering 160-foot gopuram gateway and sacred temple elephant Lakshmi.', tip: 'Climb nearby Hemakuta Hill for panoramic sunset views over Virupaksha gopuram.' }
    ]
  },

  // --- Tamil Nadu ---
  'ooty': {
    name: 'Ooty (Nilgiris)',
    state: 'Tamil Nadu',
    region: 'Nilgiri Hills',
    agencyRating: 4.8,
    agencyReviews: '42,000+ Verified Travelers',
    certifications: ['MakeMyTrip Nilgiri Queen', 'TripAdvisor Mountain Railways'],
    bestMonths: 'October to June',
    idealDuration: '3 Days',
    avgCostPerDayINR: 2700,
    coverPhoto: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80',
    description: 'The Blue Mountains of South India, home to the UNESCO heritage Nilgiri steam toy train, vast terraced tea gardens, and eucalyptus lakes.',
    places: [
      { name: 'Nilgiri Mountain UNESCO Toy Train', category: 'Cultural', rating: 4.9, cost: 120, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80', description: 'Heritage steam locomotive rack-and-pinion railway winding through tunnels, bridges, and misty tea estates.', tip: 'Book train tickets 1-2 months in advance on IRCTC.' },
      { name: 'Government Botanical Gardens & Doddabetta', category: 'Nature & Outdoors', rating: 4.8, cost: 50, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80', description: '55-acre terraced garden with exotic floral species, 20-million-year-old fossilized tree, and mountain peak views.', tip: 'Climb to Doddabetta Peak telescope house on clear mornings for panoramic views.' }
    ]
  },

  // --- Uttar Pradesh ---
  'varanasi': {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    region: 'Sacred Ganges',
    agencyRating: 5.0,
    agencyReviews: '78,000+ Verified Travelers',
    certifications: ['TripAdvisor World’s Oldest Living City', 'MakeMyTrip Spiritual Capital'],
    bestMonths: 'October to March',
    idealDuration: '3 Days',
    avgCostPerDayINR: 2100,
    coverPhoto: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80',
    description: 'One of the world’s oldest living cities on the sacred Ganges River, celebrated for its mystical Ghats and transcendent evening Ganga Aarti.',
    places: [
      { name: 'Dashashwamedh Ghat Evening Ganga Aarti', category: 'Cultural', rating: 5.0, cost: 0, duration: 2.0, bestTime: 'Evening', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80', description: 'Mesmerizing spiritual ritual of multi-tiered brass oil lamps, conch shells, and Vedic chants along the Ganges.', tip: 'Hire a wooden rowing boat 40 minutes before sunset to witness the divine Aarti from the river.' },
      { name: 'Sunrise Boat Ride on Sacred Ganges', category: 'Cultural', rating: 4.9, cost: 200, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800&q=80', description: 'Peaceful dawn boat journey from Assi Ghat to Manikarnika Ghat witnessing ancient rituals and historic palaces.', tip: 'Start at 5:30 AM to watch the morning sun turn the centuries-old sandstone ashrams into glowing gold.' }
    ]
  },
  'agra': {
    name: 'Agra',
    state: 'Uttar Pradesh',
    region: 'Mughal Heartland',
    agencyRating: 5.0,
    agencyReviews: '95,000+ Verified Travelers',
    certifications: ['UNESCO Wonder of the World', 'TripAdvisor #1 Landmark in India'],
    bestMonths: 'October to March',
    idealDuration: '2 Days',
    avgCostPerDayINR: 2600,
    coverPhoto: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80',
    description: 'Imperial Mughal capital home to the immortal white-marble Taj Mahal, monumental Agra Fort, and grand Persian gardens.',
    places: [
      { name: 'Taj Mahal Sunrise Wonder of the World', category: 'Landmark', rating: 5.0, cost: 50, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80', description: 'Shah Jahan’s immortal white-marble monument of love, an undisputed architectural wonder of the world.', tip: 'Enter via East Gate at 5:45 AM to see the marble transform from soft pink to radiant pearl white.' },
      { name: 'Agra Fort Mughal Imperial City', category: 'Cultural', rating: 4.8, cost: 50, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=800&q=80', description: 'Massive 16th-century red sandstone fortress housing grand marble palaces, Jahangir Mahal, and Diwan-i-Khas.', tip: 'Visit Musamman Burj balcony where Emperor Shah Jahan spent his final years gazing at the Taj Mahal.' }
    ]
  },

  // --- Ladakh & Kashmir ---
  'ladakh': {
    name: 'Ladakh (Leh)',
    state: 'Ladakh',
    region: 'Trans-Himalayas',
    agencyRating: 5.0,
    agencyReviews: '45,000+ Verified Travelers',
    certifications: ['MakeMyTrip Land of High Passes', 'TripAdvisor Top High-Altitude Adventure'],
    bestMonths: 'May to September',
    idealDuration: '6 - 8 Days',
    avgCostPerDayINR: 4200,
    coverPhoto: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&q=80',
    description: 'High-altitude cold desert wonderland featuring cobalt Pangong Lake, double-humped camel dunes in Nubra, and Khardung La Pass (17,982 ft).',
    places: [
      { name: 'Pangong Tso Crystal High Altitude Lake', category: 'Nature & Outdoors', rating: 5.0, cost: 0, duration: 6.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80', description: 'World’s highest saltwater lake at 4,350 meters changing shades from turquoise to cobalt blue against barren mountains.', tip: 'Carry warm thermal layers and sunglasses; the UV reflection is intense.' },
      { name: 'Nubra Valley & Hunder Sand Dunes', category: 'Adventure', rating: 4.9, cost: 500, duration: 4.0, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80', description: 'Surreal cold mountain desert valley featuring white sand dunes and rare double-humped Bactrian camel rides.', tip: 'Cross the world’s highest motorable pass Khardung La on your drive.' }
    ]
  },

  // --- West Bengal & North-East ---
  'darjeeling': {
    name: 'Darjeeling',
    state: 'West Bengal',
    region: 'Eastern Himalayas',
    agencyRating: 4.9,
    agencyReviews: '36,000+ Verified Travelers',
    certifications: ['MakeMyTrip Champagne of Teas', 'TripAdvisor Himalayan Gem'],
    bestMonths: 'October to December & March-May',
    idealDuration: '3 - 4 Days',
    avgCostPerDayINR: 2800,
    coverPhoto: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&q=80',
    description: 'Himalayan hill retreat famed for breathtaking dawn vistas of Mt. Kanchenjunga from Tiger Hill, Batasia Loop toy train, and organic tea estates.',
    places: [
      { name: 'Tiger Hill Mt. Kanchenjunga Sunrise', category: 'Landmark', rating: 5.0, cost: 50, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', description: 'World-famous dawn panorama where the morning sun turns Mt. Kanchenjunga into pure pink gold.', tip: 'Depart from town at 3:45 AM to secure top observation lounge seats before sunrise.' },
      { name: 'Darjeeling Himalayan Toy Train & Batasia Loop', category: 'Cultural', rating: 4.9, cost: 800, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80', description: 'Steam locomotive joyride looping around the Batasia Gorkha war memorial with 360-degree mountain backdrops.', tip: 'Take the heritage steam engine joyride from Darjeeling to Ghum and back.' }
    ]
  }
};

function getAllAgencyDestinations() {
  return Object.entries(TOUR_AGENCY_FEED).map(([key, data]) => ({
    key,
    ...data
  }));
}

function getAgencyDestinationByKey(key) {
  const clean = (key || '').toLowerCase().trim();
  if (TOUR_AGENCY_FEED[clean]) return { key: clean, ...TOUR_AGENCY_FEED[clean] };
  const foundKey = Object.keys(TOUR_AGENCY_FEED).find((k) => clean.includes(k) || k.includes(clean));
  return foundKey ? { key: foundKey, ...TOUR_AGENCY_FEED[foundKey] } : null;
}

module.exports = {
  TOUR_AGENCY_FEED,
  getAllAgencyDestinations,
  getAgencyDestinationByKey
};
