const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const db = require('./db');

const cities = [
  // Domestic Destinations (India)
  {
    name: 'Matheran', country: 'India', region: 'India (Domestic)',
    costIndex: 24, popularity: 94,
    description: 'Automobile-free tranquil hill station in Maharashtra featuring Charlotte Lake, Panorama sunrise point, and heritage toy train.'
  },
  {
    name: 'Lonavala', country: 'India', region: 'India (Domestic)',
    costIndex: 26, popularity: 95,
    description: 'Scenic Sahyadri getaway in Maharashtra famous for Tiger’s Leap, Karla Buddhist caves, Bhushi Dam, and chikki.'
  },
  {
    name: 'Mahabaleshwar', country: 'India', region: 'India (Domestic)',
    costIndex: 28, popularity: 96,
    description: 'Queen of Maharashtra hill stations renowned for Arthur’s Seat, Venna Lake boating, and fresh Mapro strawberry estates.'
  },
  {
    name: 'Rishikesh', country: 'India', region: 'India (Domestic)',
    costIndex: 22, popularity: 96,
    description: 'Yoga capital of the world on the sacred Ganges featuring Ganga Aarti, white water rafting, and suspension bridges.'
  },
  {
    name: 'Shimla', country: 'India', region: 'India (Domestic)',
    costIndex: 26, popularity: 95,
    description: 'Queen of Hills in Himachal Pradesh featuring the Ridge, neo-Gothic Christ Church, and pine mountain trails.'
  },
  {
    name: 'Ooty', country: 'India', region: 'India (Domestic)',
    costIndex: 25, popularity: 94,
    description: 'Nilgiri blue mountain jewel in Tamil Nadu famed for the UNESCO toy train, botanical gardens, and tea plantations.'
  },
  {
    name: 'Coorg', country: 'India', region: 'India (Domestic)',
    costIndex: 27, popularity: 94,
    description: 'Scotland of India in Karnataka known for misty coffee plantations, Abbey Falls, and Tibetan monastery.'
  },
  {
    name: 'Darjeeling', country: 'India', region: 'India (Domestic)',
    costIndex: 26, popularity: 95,
    description: 'West Bengal Himalayan haven famous for Mt. Kanchenjunga sunrise views, Batasia Loop toy train, and organic tea estates.'
  },
  {
    name: 'Jaipur', country: 'India', region: 'India (Domestic)',
    costIndex: 28, popularity: 95,
    description: 'The Pink City of Rajasthan, famous for royal Amber Fort, Hawa Mahal, vibrant bazaars, and rich Rajput heritage.'
  },
  {
    name: 'Goa', country: 'India', region: 'India (Domestic)',
    costIndex: 35, popularity: 97,
    description: 'Sun-drenched tropical beaches, Portuguese colonial cathedrals, thrilling watersports, and lively coastal shacks.'
  },
  {
    name: 'Varanasi', country: 'India', region: 'India (Domestic)',
    costIndex: 22, popularity: 93,
    description: 'One of the world’s oldest living cities on the sacred Ganges, famous for spiritual Ghats and mesmerizing evening Ganga Aarti.'
  },
  {
    name: 'Manali', country: 'India', region: 'India (Domestic)',
    costIndex: 26, popularity: 92,
    description: 'Scenic Himalayan mountain valley surrounded by pine forests, snow peaks, Solang adventure sports, and river rafting.'
  },
  {
    name: 'Kerala (Alleppey)', country: 'India', region: 'India (Domestic)',
    costIndex: 30, popularity: 94,
    description: 'God’s Own Country, famed for tranquil emerald backwater houseboat cruises, spice plantations, and Ayurvedic retreats.'
  },
  {
    name: 'Agra', country: 'India', region: 'India (Domestic)',
    costIndex: 25, popularity: 96,
    description: 'Home of the timeless white-marble Taj Mahal, grand Agra Fort, and masterpieces of Mughal art and architecture.'
  },
  {
    name: 'Udaipur', country: 'India', region: 'India (Domestic)',
    costIndex: 32, popularity: 93,
    description: 'The City of Lakes and Venice of the East, boasting floating marble palaces, tranquil Pichola boat rides, and sunsets.'
  },
  {
    name: 'Ladakh (Leh)', country: 'India', region: 'India (Domestic)',
    costIndex: 38, popularity: 91,
    description: 'High-altitude desert wonderland featuring azure Pangong Lake, double-humped camel dunes, and cliffside monasteries.'
  },
  {
    name: 'Mumbai', country: 'India', region: 'India (Domestic)',
    costIndex: 45, popularity: 96,
    description: 'India’s bustling City of Dreams, Gateway of India, Marine Drive promenade, Bollywood, and legendary street cuisine.'
  },
  {
    name: 'Delhi', country: 'India', region: 'India (Domestic)',
    costIndex: 32, popularity: 95,
    description: 'India’s vibrant capital spanning Mughal imperial monuments, vibrant Chandni Chowk street food, and modern energy.'
  },
  {
    name: 'Gujarat (Kevadia & Kutch)', country: 'India', region: 'India (Domestic)',
    costIndex: 25, popularity: 97,
    description: 'Land of Statue of Unity (world’s tallest statue), Great White Rann of Kutch salt desert, and Gir Asiatic Lion Safari.'
  },
  {
    name: 'Ahmedabad', country: 'India', region: 'India (Domestic)',
    costIndex: 24, popularity: 96,
    description: 'India’s first UNESCO World Heritage city famous for Sabarmati Ashram, Adalaj Stepwell, and Manek Chowk street food.'
  },
  {
    name: 'Munnar', country: 'India', region: 'India (Domestic)',
    costIndex: 26, popularity: 96,
    description: 'Misty tea plantation hill station in Kerala featuring Eravikulam mountain goats, Lockhart tea estate, and waterfalls.'
  },
  {
    name: 'Pondicherry', country: 'India', region: 'India (Domestic)',
    costIndex: 28, popularity: 95,
    description: 'French Riviera of the East, famous for yellow French colonial architecture, Auroville golden Matrimandir, and Rock Beach.'
  },
  {
    name: 'Amritsar', country: 'India', region: 'India (Domestic)',
    costIndex: 22, popularity: 97,
    description: 'Spiritual capital of Punjab home to the golden Harmandir Sahib, Wagah border parade, and Amritsari kulchas.'
  },
  {
    name: 'Jodhpur', country: 'India', region: 'India (Domestic)',
    costIndex: 26, popularity: 95,
    description: 'The Blue City of Rajasthan dominated by massive Mehrangarh Fort, Jaswant Thada cenotaphs, and blue heritage lanes.'
  },
  {
    name: 'London', country: 'United Kingdom', region: 'Europe',
    costIndex: 90, popularity: 98,
    description: 'Historic capital featuring Big Ben, Tower Bridge, London Eye, West End theatres, and Royal Palaces.'
  },
  {
    name: 'Singapore', country: 'Singapore', region: 'Asia',
    costIndex: 85, popularity: 97,
    description: 'Garden city featuring Gardens by the Bay Supertrees, Marina Bay Sands, Sentosa Island, and Michelin street food.'
  },

  // International Destinations
  {
    name: 'Paris', country: 'France', region: 'Europe',
    costIndex: 85, popularity: 98,
    description: 'The City of Light, famous for the Eiffel Tower, world-class cuisine, and art museums.'
  },
  {
    name: 'Tokyo', country: 'Japan', region: 'Asia',
    costIndex: 80, popularity: 95,
    description: 'A dazzling blend of ultra-modern and traditional, with incredible food and culture.'
  },
  {
    name: 'Bali', country: 'Indonesia', region: 'Asia',
    costIndex: 35, popularity: 90,
    description: 'Tropical paradise known for terraced rice fields, temples, beaches, and surf.'
  },
  {
    name: 'New York', country: 'USA', region: 'Americas',
    costIndex: 95, popularity: 97,
    description: 'The city that never sleeps — world-class culture, food, and iconic skyline.'
  },
  {
    name: 'Rome', country: 'Italy', region: 'Europe',
    costIndex: 70, popularity: 93,
    description: 'The Eternal City, home to the Colosseum, Vatican, and extraordinary cuisine.'
  },
  {
    name: 'Bangkok', country: 'Thailand', region: 'Asia',
    costIndex: 30, popularity: 88,
    description: 'Vibrant street life, ornate temples, and amazing street food at every corner.'
  },
  {
    name: 'Barcelona', country: 'Spain', region: 'Europe',
    costIndex: 65, popularity: 91,
    description: 'Gaudí architecture, beautiful beaches, incredible food, and lively nightlife.'
  },
  {
    name: 'Dubai', country: 'UAE', region: 'Middle East',
    costIndex: 90, popularity: 89,
    description: 'Futuristic skyline, luxury shopping, desert adventures, and world records.'
  },
  {
    name: 'Amsterdam', country: 'Netherlands', region: 'Europe',
    costIndex: 75, popularity: 87,
    description: 'Famous canals, cycling culture, world-class museums, and vibrant nightlife.'
  },
  {
    name: 'Cape Town', country: 'South Africa', region: 'Africa',
    costIndex: 45, popularity: 82,
    description: 'Stunning Table Mountain backdrop, beautiful beaches, and diverse culture.'
  },
  {
    name: 'Sydney', country: 'Australia', region: 'Oceania',
    costIndex: 88, popularity: 86,
    description: 'Iconic Opera House, beautiful harbour, beaches, and cosmopolitan lifestyle.'
  },
  {
    name: 'Lisbon', country: 'Portugal', region: 'Europe',
    costIndex: 55, popularity: 84,
    description: 'Charming tiled facades, Fado music, seven hills, and pastel de nata.'
  },
  {
    name: 'Kyoto', country: 'Japan', region: 'Asia',
    costIndex: 72, popularity: 90,
    description: 'Ancient temples, geisha districts, bamboo groves, and traditional tea ceremony.'
  },
  {
    name: 'Prague', country: 'Czech Republic', region: 'Europe',
    costIndex: 50, popularity: 83,
    description: 'Fairy-tale Old Town, stunning castle, gothic architecture, and craft beer.'
  },
  {
    name: 'Marrakech', country: 'Morocco', region: 'Africa',
    costIndex: 32, popularity: 79,
    description: 'Vibrant souks, ornate palaces, spice markets, and Sahara gateway adventures.'
  }
];

const activityTemplates = [
  {
    name: 'City Heritage Tour',
    type: 'Sightseeing',
    cost: 15,
    duration: 2.5,
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&q=80'
  },
  {
    name: 'Local Food Tasting Trail',
    type: 'Food',
    cost: 20,
    duration: 3,
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80'
  },
  {
    name: 'Historical Monument Visit',
    type: 'Culture',
    cost: 12,
    duration: 2,
    imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&q=80'
  },
  {
    name: 'Scenic Adventure Activity',
    type: 'Adventure',
    cost: 28,
    duration: 4,
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80'
  },
  {
    name: 'Sunset Cruise & Viewpoint',
    type: 'Leisure',
    cost: 18,
    duration: 2,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80'
  }
];

const placesDataset = {
  // Indian Domestic Places
  'Matheran': [
    { name: 'Charlotte Lake & Louisa Point', category: 'Nature & Outdoors', rating: 4.9, reviewsCount: 3800, cost: 0, duration: 3.0, bestTime: 'Morning', description: 'Serene freshwater lake surrounded by dense rainforest leading to dramatic cliffside views of Prabal Fort and waterfall streams.', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', address: 'Charlotte Lake Rd, Matheran, Maharashtra', insiderTip: 'Visit Charlotte Lake at 8:30 AM to hear melodious forest birds and avoid midday crowd bustle.', tags: 'lake,nature,waterfall,matheran,monsoon' },
    { name: 'Panorama Point 360° Sunrise Lookout', category: 'Landmark', rating: 4.9, reviewsCount: 3100, cost: 0, duration: 2.5, bestTime: 'Morning', description: 'Known as the Sunrise Point offering an unmatched 360-degree panoramic vista across the Western Ghats, Sahyadri ranges, and Ulhas River.', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', address: 'Panorama Point, Matheran, Maharashtra', insiderTip: 'Trek early or take a horse ride before dawn to witness golden sunbeams piercing through valley clouds.', tags: 'sunrise,lookout,mountains,scenic,views' },
    { name: 'Neral-Matheran Heritage Toy Train & Market Walk', category: 'Cultural', rating: 4.8, reviewsCount: 4200, cost: 150, duration: 2.0, bestTime: 'Morning', description: 'UNESCO-recognized 1907 narrow-gauge railway winding through misty hillside slopes ending in the vibrant pedestrian bazaar.', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80', address: 'Matheran Railway Station, Maharashtra', insiderTip: 'Book toy train tickets at Aman Lodge / Neral station early as daily seats are limited.', tags: 'toytrain,heritage,unesco,railway,bazaar' },
    { name: 'Echo Point & Honeymoon Hill Vistas', category: 'Landmark', rating: 4.8, reviewsCount: 2900, cost: 0, duration: 2.0, bestTime: 'Afternoon', description: 'Famous acoustics cliffpoint where your voice reverberates across valleys with sweeping views of deep verdant gorges.', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80', address: 'Echo Point Rd, Matheran, Maharashtra', insiderTip: 'Shout toward the distant plateau to hear clear multi-second acoustic echoes.', tags: 'cliff,valley,echo,views,hills' },
    { name: 'Porcupine Point (Sunset Point)', category: 'Landmark', rating: 4.9, reviewsCount: 3400, cost: 0, duration: 2.0, bestTime: 'Sunset', description: 'Matheran’s premier golden hour vantage point overlooking Prabalgad fort and glowing orange mountain silhouettes.', imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', address: 'Porcupine Point, Matheran, Maharashtra', insiderTip: 'Reach the viewing edge by 5:15 PM and enjoy roasted spiced corn (bhutta) as the sun sets.', tags: 'sunset,goldenhour,fort,scenic' }
  ],
  'Lonavala': [
    { name: 'Tiger’s Leap & Lion’s Point Sunset', category: 'Landmark', rating: 4.8, reviewsCount: 4500, cost: 0, duration: 2.5, bestTime: 'Sunset', description: 'Dramatic cliff with an abrupt 650m drop offering valley views and roaring winds resembling a tiger leaping into the valley.', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80', address: 'Aamby Valley Rd, Lonavala, Maharashtra', insiderTip: 'Savor piping hot onion pakodas and roasted corn while enjoying the swirling mountain mist.', tags: 'cliff,valley,mist,sunset,lonavala' },
    { name: 'Karla & Bhaja Ancient Buddhist Caves', category: 'Cultural', rating: 4.9, reviewsCount: 3900, cost: 50, duration: 3.0, bestTime: 'Morning', description: '2nd-century BC rock-cut Buddhist chaitya halls with massive sculpted pillars, stupas, and monastic cells.', imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80', address: 'Karla Caves Rd, Lonavala, Maharashtra', insiderTip: 'Climb Karla Cave steps early in the morning to escape midday heat.', tags: 'caves,buddhist,ancient,heritage,history' },
    { name: 'Bhushi Dam & Water Cascades', category: 'Leisure', rating: 4.6, reviewsCount: 4200, cost: 0, duration: 2.5, bestTime: 'Afternoon', description: 'Popular masonry dam on Indrayani river where water flows over stone steps creating natural soaking spots.', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80', address: 'Bhushi Dam, Lonavala, Maharashtra', insiderTip: 'Visit during monsoon season for the best overflowing water experience.', tags: 'dam,waterfall,monsoon,swimming' }
  ],
  'Mahabaleshwar': [
    { name: 'Arthur’s Seat Queen of Points', category: 'Landmark', rating: 4.9, reviewsCount: 4100, cost: 0, duration: 2.5, bestTime: 'Morning', description: 'Famous viewpoint perched at 1,340m looking over dense Jor Valley and Savitri River.', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', address: 'Arthur Seat Rd, Mahabaleshwar, Maharashtra', insiderTip: 'Watch light objects float upward due to strong reverse air currents.', tags: 'lookout,valley,canyon,mahabaleshwar' },
    { name: 'Venna Lake Boating & Lakeside Walk', category: 'Leisure', rating: 4.7, reviewsCount: 3800, cost: 250, duration: 2.0, bestTime: 'Afternoon', description: 'Tranquil lake surrounded by tall pine trees offering paddle boats and lakeside street food.', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', address: 'Venna Lake, Mahabaleshwar, Maharashtra', insiderTip: 'Take a boat ride around 4:30 PM to catch golden sunset reflections on the lake surface.', tags: 'lake,boating,pines,peaceful' },
    { name: 'Mapro Garden & Strawberry Estate', category: 'Food & Dining', rating: 4.9, reviewsCount: 5600, cost: 0, duration: 2.5, bestTime: 'Afternoon', description: 'Sprawling strawberry agro-tourism park offering fresh strawberry cream, wood-fired pizzas, and fruit syrups.', imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80', address: 'Panchgani - Mahabaleshwar Rd, Gureghar', insiderTip: 'Try the iconic chocolate strawberry fondue and take home artisanal fruit jams.', tags: 'strawberry,food,dessert,agro-tourism' }
  ],
  'Rishikesh': [
    { name: 'Triveni Ghat Evening Maha Ganga Aarti', category: 'Cultural', rating: 5.0, reviewsCount: 6800, cost: 0, duration: 2.0, bestTime: 'Evening', description: 'Soul-stirring spiritual ceremony of bells, drums, Vedic chants, and floating oil leaf lamps on the river.', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80', address: 'Triveni Ghat, Rishikesh, Uttarakhand', insiderTip: 'Arrive 45 minutes before sunset to sit near the river steps and release a floral diya lamp.', tags: 'ganga,aarti,spiritual,holy,culture' },
    { name: 'White Water River Rafting in Ganga', category: 'Adventure', rating: 4.9, reviewsCount: 5200, cost: 800, duration: 3.5, bestTime: 'Morning', description: 'Thrilling Class III/IV river rapids (Roller Coaster, Golf Course) surrounded by Himalayan cliffs.', imageUrl: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=80', address: 'Shivpuri to Rishikesh, Uttarakhand', insiderTip: 'Opt for the 16km Shivpuri to Rishikesh stretch for the best mix of rapids and cliff jumping.', tags: 'rafting,adventure,ganga,rapids' },
    { name: 'Lakshman & Ram Jhula Suspension Bridges', category: 'Landmark', rating: 4.7, reviewsCount: 4400, cost: 0, duration: 2.0, bestTime: 'Morning', description: 'Iconic suspension bridges spanning the turquoise Ganga connecting ashrams, yoga schools, and cafes.', imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e13?w=800&q=80', address: 'Lakshman Jhula, Rishikesh, Uttarakhand', insiderTip: 'Stop at riverside rooftop cafes near Ram Jhula for lemon ginger honey tea and mountain vistas.', tags: 'bridge,ganga,ashram,yoga' }
  ],
  'Shimla': [
    { name: 'The Ridge & Mall Road Heritage Walk', category: 'Cultural', rating: 4.8, reviewsCount: 4900, cost: 0, duration: 2.5, bestTime: 'Evening', description: 'Pedestrian cultural heart of Shimla featuring neo-Gothic Christ Church, colonial architecture, and mountain views.', imageUrl: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80', address: 'The Ridge, Shimla, Himachal Pradesh', insiderTip: 'Visit at dusk when the church and mountain valley light up beautifully.', tags: 'ridge,church,colonial,heritage,walk' },
    { name: 'Jakhoo Temple & Giant Hanuman Statue', category: 'Landmark', rating: 4.8, reviewsCount: 3700, cost: 0, duration: 2.0, bestTime: 'Morning', description: 'Hilltop temple at 2,455m crowned by a massive 108-foot Hanuman statue with cable car ropeway access.', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80', address: 'Jakhoo Hill, Shimla, Himachal Pradesh', insiderTip: 'Take the Jakhoo Ropeway from Ridge for aerial pine forest views; watch out for friendly monkeys.', tags: 'temple,hanuman,ropeway,viewpoint' }
  ],
  'Ooty': [
    { name: 'Nilgiri Mountain UNESCO Toy Train', category: 'Cultural', rating: 4.9, reviewsCount: 4800, cost: 120, duration: 2.5, bestTime: 'Morning', description: 'Heritage steam locomotive rack-and-pinion railway winding through tunnels, bridges, and misty tea estates.', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80', address: 'Ooty Railway Station, Tamil Nadu', insiderTip: 'Book train tickets 1-2 months in advance on IRCTC for the scenic Mettupalayam to Ooty stretch.', tags: 'toytrain,unesco,nilgiri,scenic,mountains' },
    { name: 'Government Botanical Gardens & Doddabetta', category: 'Nature & Outdoors', rating: 4.8, reviewsCount: 4100, cost: 50, duration: 3.0, bestTime: 'Morning', description: '55-acre terraced garden with exotic floral species, 20-million-year-old fossilized tree, and mountain peak views.', imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80', address: 'Vannarapettai, Ooty, Tamil Nadu', insiderTip: 'Climb to Doddabetta Peak telescope house on clear mornings for panoramic Nilgiri views.', tags: 'botanical,flowers,doddabetta,hills' }
  ],
  'Coorg': [
    { name: 'Abbey Falls & Coffee Estate Trail', category: 'Nature & Outdoors', rating: 4.8, reviewsCount: 3900, cost: 50, duration: 2.0, bestTime: 'Morning', description: 'Roaring waterfall cascading from 70 feet nestled inside private coffee estates and spice plantations.', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80', address: 'Abbey Falls Rd, Madikeri, Karnataka', insiderTip: 'Stand on the hanging bridge opposite the falls for great mist spray photo opportunities.', tags: 'waterfall,coffee,plantation,nature' },
    { name: 'Raja’s Seat Sunset & Musical Fountain', category: 'Landmark', rating: 4.8, reviewsCount: 3400, cost: 30, duration: 2.0, bestTime: 'Sunset', description: 'Historic garden pavilion where the Kings of Kodagu watched sunsets across undulating green hills.', imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', address: 'Raja Seat Rd, Madikeri, Karnataka', insiderTip: 'Arrive by 5:30 PM to catch the setting sun and the evening musical fountain show.', tags: 'sunset,garden,pavilion,views' }
  ],
  'Darjeeling': [
    { name: 'Tiger Hill Mt. Kanchenjunga Sunrise', category: 'Landmark', rating: 5.0, reviewsCount: 5200, cost: 50, duration: 2.5, bestTime: 'Morning', description: 'World-famous dawn panorama where the morning sun turns Mt. Kanchenjunga and Himalayan peaks into pure pink gold.', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', address: 'Tiger Hill, Darjeeling, West Bengal', insiderTip: 'Depart from town at 3:45 AM to secure top observation lounge seats before sunrise.', tags: 'sunrise,kanchenjunga,himalayas,scenic' },
    { name: 'Darjeeling Himalayan Toy Train & Batasia Loop', category: 'Cultural', rating: 4.9, reviewsCount: 4700, cost: 800, duration: 2.0, bestTime: 'Morning', description: 'Steam locomotive joyride looping around the Batasia Gorkha war memorial with 360-degree mountain backdrops.', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80', address: 'Batasia Loop, Darjeeling, West Bengal', insiderTip: 'Take the heritage steam engine joyride from Darjeeling to Ghum and back.', tags: 'toytrain,batasia,loop,steam,unesco' }
  ],
  'Jaipur': [
    { name: 'Amber Fort & Sheesh Mahal', category: 'Cultural', rating: 4.9, reviewsCount: 6200, cost: 8, duration: 3.5, bestTime: 'Morning', description: 'Majestic hilltop Rajput fort with intricate marble mirror palace (Sheesh Mahal) overlooking Maota Lake.', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80', address: 'Amer, Jaipur, Rajasthan 302001', insiderTip: 'Ride the electric jeep up to Suraj Pol gate early in the morning for crisp photo lighting.', tags: 'fort,palace,rajasthan,unesco,history' },
    { name: 'Hawa Mahal (Palace of Winds)', category: 'Landmark', rating: 4.8, reviewsCount: 5400, cost: 3, duration: 1.5, bestTime: 'Morning', description: 'Iconic five-story pink sandstone facade with 953 intricately carved jharokha honeycomb windows.', imageUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&q=80', address: 'Hawa Mahal Rd, Badi Choupad, Jaipur', insiderTip: 'Visit Wind View Cafe or Tattoo Cafe across the street for a spectacular rooftop front-facing view.', tags: 'pinkcity,architecture,photography,iconic' },
    { name: 'City Palace & Jantar Mantar', category: 'Cultural', rating: 4.8, reviewsCount: 4300, cost: 7, duration: 2.5, bestTime: 'Afternoon', description: 'Royal residence blending Rajput and Mughal design, adjacent to the UNESCO 18th-century astronomical observatory.', imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80', address: 'Tulsi Marg, Gangori Bazaar, Jaipur', insiderTip: 'Book access to the Chandra Mahal private royal suites for the world-famous blue peacock courtyard.', tags: 'royal,palace,museum,observatory' },
    { name: 'Nahargarh Fort Sunset Viewpoint', category: 'Landmark', rating: 4.9, reviewsCount: 3900, cost: 2, duration: 2.0, bestTime: 'Sunset', description: 'Perched high on the Aravalli hills, offering the most breathtaking golden sunset view across the entire Pink City.', imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', address: 'Krishna Nagar, Brahampuri, Jaipur', insiderTip: 'Head to the Padao open-air cafe on the fort ramparts for tea and panoramic city lights as darkness falls.', tags: 'sunset,views,aravalli,fort' },
    { name: 'Chokhi Dhani Rajasthani Village & Feast', category: 'Food & Dining', rating: 4.8, reviewsCount: 4800, cost: 14, duration: 3.5, bestTime: 'Evening', description: 'Immersive cultural resort with live Kalbeliya folk dances, fire shows, camel rides, and authentic Dal Baati Churma.', imageUrl: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=600&q=80', address: '12 Miles Tonk Road, Jaipur', insiderTip: 'Arrive by 6:30 PM to catch the welcoming shehnai music and live acrobat performances before dinner.', tags: 'food,rajasthani,culture,dinner,dance' }
  ],
  'Goa': [
    { name: 'Baga & Calangute Beach Watersports', category: 'Adventure', rating: 4.7, reviewsCount: 5800, cost: 18, duration: 3.0, bestTime: 'Morning', description: 'Goa’s liveliest golden sand beach offering parasailing, jet skiing, banana boat rides, and beachfront shacks.', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', address: 'Baga Beach, North Goa 403516', insiderTip: 'Do watersports between 9 AM and 11 AM when the sea is calm and queue times are short.', tags: 'beach,watersports,parasailing,adventure' },
    { name: 'Dudhsagar Waterfalls & Jungle Jeep Safari', category: 'Nature & Outdoors', rating: 4.9, reviewsCount: 4200, cost: 22, duration: 5.0, bestTime: 'Morning', description: 'Spectacular 310-meter four-tiered milky waterfall in Bhagwan Mahaveer Sanctuary reached by 4x4 jungle jeep.', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=600&q=80', address: 'Sonaulim, Goa 403410', insiderTip: 'Wear the mandatory life jackets and take a refreshing dip in the natural pool at the waterfall base.', tags: 'waterfall,jungle,safari,nature' },
    { name: 'Fort Aguada & 17th Century Lighthouse', category: 'Landmark', rating: 4.7, reviewsCount: 3600, cost: 3, duration: 2.0, bestTime: 'Afternoon', description: 'Well-preserved Portuguese fortress offering sweeping 360-degree views where Mandovi River meets Arabian Sea.', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80', address: 'Aguada-Siolim Rd, Candolim, Goa', insiderTip: 'Walk down to the lower fort prison ramparts for incredible crashing wave photography.', tags: 'fort,portuguese,sea,history' },
    { name: 'Anjuna Beach Sunset & Curlies Shack', category: 'Leisure', rating: 4.8, reviewsCount: 3100, cost: 12, duration: 3.0, bestTime: 'Sunset', description: 'Rocky beach famous for bohemian vibes, sunset chill-out music, fresh grilled Kingfish, and flea markets.', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', address: 'Anjuna Beach, North Goa', insiderTip: 'Reserve a front-row wooden deck table at Curlies around 5:15 PM for prime sunset viewing.', tags: 'sunset,music,seafood,shack,nightlife' }
  ],
  'Varanasi': [
    { name: 'Dashashwamedh Ghat Evening Ganga Aarti', category: 'Cultural', rating: 5.0, reviewsCount: 7800, cost: 0, duration: 2.0, bestTime: 'Evening', description: 'Mesmerizing spiritual ritual of multi-tiered brass oil lamps, conch shells, and Vedic chants along the Ganges.', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80', address: 'Dashashwamedh Ghat Rd, Varanasi, UP', insiderTip: 'Hire a wooden rowing boat 40 minutes before sunset to witness the divine Aarti from the river.', tags: 'spiritual,ganga,aarti,holy,culture' },
    { name: 'Sunrise Boat Ride on Sacred Ganges', category: 'Cultural', rating: 4.9, reviewsCount: 5100, cost: 5, duration: 2.0, bestTime: 'Morning', description: 'Peaceful dawn boat journey from Assi Ghat to Manikarnika Ghat witnessing ancient rituals and historic palaces.', imageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=600&q=80', address: 'Assi Ghat, Varanasi, UP', insiderTip: 'Start at 5:30 AM to watch the morning sun turn the centuries-old sandstone ashrams into glowing gold.', tags: 'sunrise,boat,ganges,peaceful' },
    { name: 'Kashi Vishwanath Jyotirlinga Temple', category: 'Cultural', rating: 4.9, reviewsCount: 6500, cost: 0, duration: 2.5, bestTime: 'Morning', description: 'One of the twelve sacred Jyotirlingas of Lord Shiva with the majestic new Kashi Vishwanath Corridor connecting to the river.', imageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80', address: 'Lahori Tola, Varanasi, UP 221001', insiderTip: 'Leave mobile phones and electronic lockers in your hotel room for fastest VIP security queue clearance.', tags: 'temple,shiva,kashi,jyotirlinga' },
    { name: 'Varanasi Street Food & Blue Lassi Safari', category: 'Food & Dining', rating: 4.9, reviewsCount: 3900, cost: 4, duration: 2.0, bestTime: 'Afternoon', description: 'Taste signature Banarasi Tamatar Chaat, crispy Kachori Sabzi, Malaiyyo winter milk foam, and thick clay-pot lassi.', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', address: 'Thatheri Bazaar, Chowk, Varanasi', insiderTip: 'Try the pomegranate and pistachio lassi at the historic Blue Lassi Shop near Manikarnika.', tags: 'streetfood,lassi,chaat,authentic' }
  ],
  'Manali': [
    { name: 'Solang Valley Adventure & Paragliding', category: 'Adventure', rating: 4.9, reviewsCount: 4900, cost: 25, duration: 4.0, bestTime: 'Morning', description: 'High-mountain valley renowned for tandem paragliding, zorbing, snow scooter rides, and alpine meadows.', imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', address: 'Solang Valley, Manali, HP 175131', insiderTip: 'Opt for long-fly paragliding from the higher cable car peak for breathtaking views of the Pir Panjal range.', tags: 'snow,paragliding,adventure,mountains' },
    { name: 'Hadimba Devi Ancient Cedar Forest Temple', category: 'Cultural', rating: 4.8, reviewsCount: 4100, cost: 1, duration: 1.5, bestTime: 'Morning', description: 'Unique four-tiered wooden pagoda temple built in 1553 nestled in the dense giant deodar Dhungri forest.', imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80', address: 'Hadimba Temple Rd, Old Manali, HP', insiderTip: 'Look for the giant Himalayan Angora rabbits and traditional Yak photo spots right outside the forest gate.', tags: 'temple,heritage,forest,cedar' },
    { name: 'Old Manali River Cafes & Apple Orchards', category: 'Food & Dining', rating: 4.8, reviewsCount: 3200, cost: 10, duration: 3.0, bestTime: 'Evening', description: 'Laid-back mountain village with live acoustic music cafes serving fresh river trout, wood-fired pizzas, and masala chai.', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', address: 'Old Manali Village, HP 175131', insiderTip: 'Sit at Cafe 1947 by the gushing Manalsu river for mountain breeze and fresh Himalayan baked apple pie.', tags: 'cafes,music,river,chill,food' }
  ],
  'Kerala (Alleppey)': [
    { name: 'Alleppey Backwaters Houseboat Cruise', category: 'Leisure', rating: 5.0, reviewsCount: 6100, cost: 38, duration: 5.0, bestTime: 'Afternoon', description: 'Private thatched-roof Kettuvallam houseboat navigating palm-shaded emerald canals, paddy fields, and lagoons.', imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', address: 'Finishing Point, Alleppey, Kerala', insiderTip: 'Request the onboard chef to prepare freshly caught Karimeen Pollichathu (pearl spot fish in banana leaf).', tags: 'backwaters,houseboat,kerala,romantic,peace' },
    { name: 'Munnar Misty Tea Gardens & Eravikulam', category: 'Nature & Outdoors', rating: 4.9, reviewsCount: 4700, cost: 8, duration: 4.0, bestTime: 'Morning', description: 'Rolling emerald tea plantations, mountain mist, and habitat of the endangered Nilgiri Tahr mountain goat.', imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80', address: 'Munnar, Idukki District, Kerala', insiderTip: 'Visit the KDHP Tea Museum to taste freshly processed single-origin white and green tea infusions.', tags: 'teagardens,mist,wildlife,hills' }
  ],
  'Agra': [
    { name: 'Taj Mahal Sunrise Wonder of the World', category: 'Landmark', rating: 5.0, reviewsCount: 9200, cost: 14, duration: 3.5, bestTime: 'Morning', description: 'Shah Jahan’s immortal white-marble monument of love, an undisputed architectural wonder of the world.', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', address: 'Dharmapuri, Forest Colony, Agra, UP', insiderTip: 'Enter via the East Gate at 5:45 AM to see the marble transform from soft pink to radiant pearl white.', tags: 'tajmahal,wonder,unesco,monument,romantic' },
    { name: 'Agra Fort Mughal Imperial City', category: 'Cultural', rating: 4.8, reviewsCount: 4600, cost: 7, duration: 2.5, bestTime: 'Morning', description: 'Massive 16th-century red sandstone fortress housing grand marble palaces, Jahangir Mahal, and Diwan-i-Khas.', imageUrl: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=600&q=80', address: 'Agra Fort, Rakabganj, Agra, UP', insiderTip: 'Visit the Musamman Burj balcony where Emperor Shah Jahan spent his final years gazing at the Taj Mahal.', tags: 'fort,mughal,history,unesco' }
  ],
  'Udaipur': [
    { name: 'City Palace of Udaipur & Museum', category: 'Cultural', rating: 4.9, reviewsCount: 5200, cost: 6, duration: 3.5, bestTime: 'Morning', description: 'Rajasthan’s largest palace complex perched over Lake Pichola with mirror mosaics, royal courtyards, and towers.', imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600&q=80', address: 'Old City, Udaipur, Rajasthan 313001', insiderTip: 'Do not miss the Mor Chowk courtyard with its 3D jewel-encrusted glass peacock mosaics.', tags: 'palace,lakes,royal,museum' },
    { name: 'Lake Pichola Sunset Boat Ride & Jag Mandir', category: 'Leisure', rating: 4.9, reviewsCount: 4400, cost: 10, duration: 2.0, bestTime: 'Sunset', description: 'Glide across mirror-like waters past the floating Lake Palace with sunset reflections of the Aravalli hills.', imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80', address: 'Rameshwar Ghat, City Palace, Udaipur', insiderTip: 'Take the 5:30 PM boat that stops at the island garden palace Jag Mandir for sunset mocktails.', tags: 'boat,sunset,lake,romantic' }
  ],
  'Ladakh (Leh)': [
    { name: 'Pangong Tso Crystal High Altitude Lake', category: 'Nature & Outdoors', rating: 5.0, reviewsCount: 4800, cost: 18, duration: 6.0, bestTime: 'Morning', description: 'World’s highest saltwater lake at 4,350 meters changing shades from turquoise to cobalt blue against barren mountains.', imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=600&q=80', address: 'Leh-Ladakh 194201', insiderTip: 'Carry warm thermal layers and sunglasses; the UV reflection off the crystal blue water is stunningly bright.', tags: 'lake,pangong,himalayas,scenic' },
    { name: 'Nubra Valley & Hunder Sand Dunes', category: 'Adventure', rating: 4.9, reviewsCount: 3600, cost: 15, duration: 4.0, bestTime: 'Afternoon', description: 'Surreal cold mountain desert valley featuring white sand dunes and rare double-humped Bactrian camel rides.', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&q=80', address: 'Hunder, Nubra Valley, Ladakh', insiderTip: 'Cross the world’s highest motorable pass Khardung La (17,982 ft) on your drive from Leh into Nubra.', tags: 'desert,camels,valley,highaltitude' }
  ],
  'Delhi': [
    { name: 'Qutub Minar & Iron Pillar of Delhi', category: 'Landmark', rating: 4.8, reviewsCount: 6700, cost: 6, duration: 2.0, bestTime: 'Morning', description: 'UNESCO 73-meter fluted red sandstone minaret built in 1192 surrounded by ancient carved cloistered ruins.', imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', address: 'Seth Sarai, Mehrauli, New Delhi 110030', insiderTip: 'Inspect the mysterious 1,600-year-old rust-resistant Gupta Iron Pillar in the courtyard.', tags: 'qutub,minaret,unesco,delhi,ancient' },
    { name: 'Chandni Chowk Old Delhi Food & Heritage Trail', category: 'Food & Dining', rating: 4.9, reviewsCount: 5900, cost: 8, duration: 3.0, bestTime: 'Afternoon', description: 'Rickshaw ride through 17th-century bazaars tasting legendary stuffed parathas, hot jalebis, and Karim’s kebabs.', imageUrl: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=600&q=80', address: 'Chandni Chowk, Old Delhi 110006', insiderTip: 'Visit Paranthe Wali Gali and wash it down with creamy rabri jalebi at Old Famous Jalebi Wala.', tags: 'food,olddelhi,rickshaw,kebab,bazaar' }
  ],
  'Mumbai': [
    { name: 'Gateway of India & Taj Mahal Palace', category: 'Landmark', rating: 4.8, reviewsCount: 7100, cost: 0, duration: 2.0, bestTime: 'Morning', description: 'Majestic basalt arch facing Mumbai harbour erected in 1911 alongside the legendary Taj heritage hotel.', imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', address: 'Apollo Bandar, Colaba, Mumbai 400001', insiderTip: 'Take a harbour ferry from the Gateway jetty for sea views of the Mumbai skyline.', tags: 'mumbai,gateway,heritage,colaba' },
    { name: 'Marine Drive Queen’s Necklace Sunset', category: 'Leisure', rating: 4.9, reviewsCount: 6400, cost: 0, duration: 2.0, bestTime: 'Sunset', description: '3.6 km sweeping coastal promenade curving around Back Bay, twinkling like a string of pearls at night.', imageUrl: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80', address: 'Netaji Subhash Chandra Bose Rd, Mumbai', insiderTip: 'Grab roasted spiced corn (bhutta) and sit on the promenade tetrapods as the evening sea breeze kicks in.', tags: 'sunset,promenade,queensnecklace,sea' }
  ],

  // International Places
  'Paris': [
    { name: 'Eiffel Tower & Champ de Mars', category: 'Landmark', rating: 4.8, reviewsCount: 3840, cost: 28, duration: 2.5, bestTime: 'Evening', description: 'Iconic iron lattice tower offering breathtaking panoramic views over Paris and glittering light shows after dark.', imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&q=80', address: 'Champ de Mars, 5 Av. Anatole France', insiderTip: 'Book tickets 2 months in advance or visit at sunset to see the evening sparkle show on the hour.', tags: 'romantic,iconic,photography,views' },
    { name: 'Louvre Museum & Glass Pyramid', category: 'Cultural', rating: 4.7, reviewsCount: 4210, cost: 22, duration: 3.5, bestTime: 'Morning', description: 'The world’s largest art museum, home to the Mona Lisa, Venus de Milo, and masterworks spanning centuries.', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80', address: 'Rue de Rivoli, 75001 Paris', insiderTip: 'Enter through the Carrousel du Louvre underground mall entrance to bypass long surface security lines.', tags: 'art,museum,history,unesco' },
    { name: 'Montmartre & Sacré-Cœur Basilica', category: 'Landmark', rating: 4.7, reviewsCount: 2980, cost: 0, duration: 2.5, bestTime: 'Afternoon', description: 'Bohemian hilltop neighborhood with winding cobblestone streets, artist squares (Place du Tertre), and sweeping city vistas.', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', address: '35 Rue du Chevalier de la Barre', insiderTip: 'Walk behind the basilica to find quiet ivy-clad cafes and the hidden vineyard Clos Montmartre.', tags: 'bohemian,views,walking,romantic' },
    { name: 'Seine River Sunset Cruise', category: 'Leisure', rating: 4.6, reviewsCount: 1850, cost: 18, duration: 1.5, bestTime: 'Evening', description: 'Glide past Notre-Dame, Musée d’Orsay, and illuminated historical bridges while sipping French wine.', imageUrl: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=600&q=80', address: 'Port de la Bourdonnais', insiderTip: 'Grab an upper deck seat on the left side (port) for the best angle of the Eiffel Tower glow.', tags: 'cruise,romantic,sunset,sightseeing' },
    { name: 'Le Marais Culinary & Pastry Walk', category: 'Food & Dining', rating: 4.9, reviewsCount: 1540, cost: 35, duration: 2.0, bestTime: 'Afternoon', description: 'Explore historic mansions, trendy fashion boutiques, world-class bakeries, and authentic falafel spots.', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', address: 'Rue des Rosiers, Le Marais', insiderTip: 'Try the warm pistachio escargot pastry at Du Pain et des Idées nearby.', tags: 'food,pastries,shopping,historic' }
  ],
  'Tokyo': [
    { name: 'Sensō-ji Temple & Nakamise Dori', category: 'Cultural', rating: 4.8, reviewsCount: 4500, cost: 0, duration: 2.0, bestTime: 'Morning', description: 'Tokyo’s oldest and most significant Buddhist temple, approached through the vibrant giant red lantern gate (Kaminarimon).', imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80', address: '2-3-1 Asakusa, Taito City', insiderTip: 'Visit before 8:30 AM to beat the tour crowds and hear the serene morning chanting ceremonies.', tags: 'temple,culture,historic,streetfood' },
    { name: 'Shibuya Crossing & Shibuya Sky', category: 'Landmark', rating: 4.9, reviewsCount: 5200, cost: 18, duration: 2.0, bestTime: 'Evening', description: 'The world’s busiest pedestrian intersection paired with a 360-degree open-air rooftop observation deck.', imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80', address: '2-24-12 Shibuya', insiderTip: 'Reserve your Shibuya Sky ticket for 30 minutes before sunset for day-to-neon transition photos.', tags: 'modern,neon,views,iconic' },
    { name: 'teamLab Planets Digital Art Museum', category: 'Cultural', rating: 4.9, reviewsCount: 3800, cost: 28, duration: 2.5, bestTime: 'Afternoon', description: 'Immersive digital art museum where you walk barefoot through water and surreal crystal infinity rooms.', imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&q=80', address: '6-1-16 Toyosu, Koto City', insiderTip: 'Wear shorts or pants that easily roll above the knees since some exhibits involve wading in water.', tags: 'digitalart,instagram,interactive,modern' },
    { name: 'Tsukiji Outer Food Market Tour', category: 'Food & Dining', rating: 4.8, reviewsCount: 2900, cost: 40, duration: 2.5, bestTime: 'Morning', description: 'Lively maze of stalls serving fresh A5 Wagyu skewers, uni (sea urchin), tamagoyaki omelets, and premium sashimi.', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80', address: '4-16-2 Tsukiji, Chuo City', insiderTip: 'Bring cash (JPY yen coins) as many traditional artisanal vendors do not take international credit cards.', tags: 'food,sushi,seafood,authentic' }
  ],
  'Rome': [
    { name: 'Colosseum & Roman Forum', category: 'Cultural', rating: 4.8, reviewsCount: 5100, cost: 24, duration: 3.5, bestTime: 'Morning', description: 'Ancient arena of gladiatorial combat and the heart of the Roman Empire amidst monumental classical ruins.', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', address: 'Piazza del Colosseo, 1', insiderTip: 'Choose the Arena Floor + Underground access ticket to stand right where gladiators once waited.', tags: 'ancient,history,unesco,landmark' },
    { name: 'Vatican Museums & Sistine Chapel', category: 'Cultural', rating: 4.9, reviewsCount: 4900, cost: 26, duration: 4.0, bestTime: 'Morning', description: 'Michelangelo’s ceiling masterpieces, Raphael Rooms, and the grandest basilica in Christendom.', imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=80', address: 'Viale Vaticano, 00165 Roma', insiderTip: 'Shoulders and knees must be covered. Book early morning 8:00 AM skip-the-line tickets.', tags: 'art,spirituality,vatican,renaissance' },
    { name: 'Trevi Fountain & Pantheon Walk', category: 'Landmark', rating: 4.8, reviewsCount: 4100, cost: 5, duration: 2.5, bestTime: 'Evening', description: 'Toss a coin into the baroque Trevi Fountain, marvel at the ancient Pantheon dome, and enjoy gelato at Navona.', imageUrl: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=600&q=80', address: 'Piazza di Trevi, 00187 Roma', insiderTip: 'Visit Trevi after 10 PM when the night lighting illuminates the travertine stone and crowds thin out.', tags: 'baroque,gelato,fountain,romantic' }
  ],
  'Bali': [
    { name: 'Ubud Monkey Forest & Rice Terraces', category: 'Nature & Outdoors', rating: 4.8, reviewsCount: 3400, cost: 12, duration: 3.5, bestTime: 'Morning', description: 'Lush sacred jungle sanctuary with playful macaques and cascading UNESCO emerald rice terraces.', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', address: 'Jl. Monkey Forest, Ubud', insiderTip: 'Keep sunglasses, food, and water bottles tucked securely inside zipped backpacks.', tags: 'nature,monkeys,riceterraces,jungle' },
    { name: 'Uluwatu Clifftop Temple & Fire Dance', category: 'Cultural', rating: 4.9, reviewsCount: 3100, cost: 15, duration: 3.0, bestTime: 'Evening', description: 'Dramatic clifftop temple 70 meters above roaring Indian Ocean waves accompanied by hypnotic fire dance at sunset.', imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80', address: 'Pecatu, South Kuta, Badung', insiderTip: 'Arrive by 4:30 PM to secure the best amphitheater seats facing both the sunset and the dancers.', tags: 'sunset,dance,cliff,culture' }
  ],
  'New York': [
    { name: 'Central Park & Bethesda Terrace', category: 'Nature & Outdoors', rating: 4.9, reviewsCount: 6100, cost: 0, duration: 3.0, bestTime: 'Morning', description: 'Iconic 843-acre urban sanctuary featuring rowboats on the Lake, Bow Bridge, and tree-lined walkways.', imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80', address: 'Bethesda Terrace, New York, NY', insiderTip: 'Rent a rowboat at the Loeb Boathouse for $25/hour for magical views of the San Remo towers.', tags: 'park,nature,walking,iconic' },
    { name: 'Summit One Vanderbilt Sky Observation', category: 'Landmark', rating: 4.8, reviewsCount: 4300, cost: 42, duration: 2.0, bestTime: 'Sunset', description: 'Mirrored infinity sky rooms with jaw-dropping views of Manhattan skyline, Chrysler Building, and Central Park.', imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80', address: '45 E 42nd St, New York, NY', insiderTip: 'Wear sunglasses during sunny afternoon visits as the mirrored rooms create intense ambient light.', tags: 'views,skyline,skyscraper,instagram' }
  ],
  'Dubai': [
    { name: 'Burj Khalifa Sky Deck & Fountain Show', category: 'Landmark', rating: 4.8, reviewsCount: 5100, cost: 48, duration: 3.0, bestTime: 'Sunset', description: 'World’s tallest building at 828 meters featuring open-air sky observatories and dancing synchronized water fountains.', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', address: '1 Sheikh Mohammed bin Rashid Blvd', insiderTip: 'Time your ticket for 5:30 PM to see Dubai by day, golden sunset, and the sparkling neon city lights.', tags: 'luxury,skyscraper,fountain,iconic' },
    { name: 'Red Dunes Desert Safari & BBQ Camp', category: 'Adventure', rating: 4.9, reviewsCount: 3600, cost: 55, duration: 6.0, bestTime: 'Afternoon', description: 'Thrilling 4x4 dune bashing, sandboarding, camel rides, falconry, and open-air BBQ dinner under desert stars.', imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=600&q=80', address: 'Lahbab Desert, Dubai', insiderTip: 'Wear comfortable slip-on sandals and bring sunglasses; sandboarding on red dunes is included in most packages.', tags: 'desert,safari,adventure,bbq' }
  ]
};

async function run() {
  await db.init();

  const insertCity = db.prepare(
    `INSERT INTO cities (id, name, country, region, cost_index, popularity, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const insertActivity = db.prepare(
    `INSERT INTO activities (id, stop_id, city_id, name, type, cost, duration, description, image_url, is_template)
     VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, 1)`
  );
  const insertPlace = db.prepare(
    `INSERT INTO places (id, city_id, name, category, rating, reviews_count, cost, duration, best_time, description, image_url, address, insider_tip, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  // 1. Incremental City Seeding
  const existingCities = db.prepare('SELECT id, name FROM cities').all();
  const existingCityMap = {};
  existingCities.forEach((c) => {
    existingCityMap[c.name.toLowerCase()] = c.id;
  });

  const seedCityTxn = db.transaction(() => {
    let addedCities = 0;
    cities.forEach((c) => {
      if (!existingCityMap[c.name.toLowerCase()]) {
        const cityId = uuidv4();
        insertCity.run(cityId, c.name, c.country, c.region, c.costIndex, c.popularity, c.description);
        existingCityMap[c.name.toLowerCase()] = cityId;
        addedCities += 1;

        activityTemplates.forEach((tpl) => {
          insertActivity.run(
            uuidv4(),
            cityId,
            `${tpl.name} - ${c.name}`,
            tpl.type,
            tpl.cost,
            tpl.duration,
            `${tpl.name} experience in ${c.name}, ${c.country}.`,
            tpl.imageUrl
          );
        });
      }
    });
    if (addedCities > 0) {
      console.log(`Seeded ${addedCities} new cities.`);
    }
  });
  seedCityTxn();

  // 2. Incremental Places Seeding
  const existingPlaces = db.prepare('SELECT name, city_id FROM places').all();
  const existingPlaceKeys = new Set(existingPlaces.map((p) => `${p.name.toLowerCase()}_${p.city_id}`));

  const allCityRows = db.prepare('SELECT id, name, country FROM cities').all();
  const currentCityMap = {};
  allCityRows.forEach((r) => {
    currentCityMap[r.name.toLowerCase()] = r.id;
  });

  const updatePlaceImg = db.prepare('UPDATE places SET image_url = ?, cost = ? WHERE LOWER(name) = ? AND city_id = ?');

  const seedPlacesTxn = db.transaction(() => {
    let addedPlaces = 0;
    Object.entries(placesDataset).forEach(([cityName, placesList]) => {
      const cityId = currentCityMap[cityName.toLowerCase()];
      if (cityId) {
        placesList.forEach((p) => {
          const key = `${p.name.toLowerCase()}_${cityId}`;
          if (!existingPlaceKeys.has(key)) {
            insertPlace.run(
              uuidv4(),
              cityId,
              p.name,
              p.category,
              p.rating,
              p.reviewsCount,
              p.cost,
              p.duration,
              p.bestTime,
              p.description,
              p.imageUrl,
              p.address,
              p.insiderTip,
              p.tags
            );
            existingPlaceKeys.add(key);
            addedPlaces += 1;
          } else {
            updatePlaceImg.run(p.imageUrl, p.cost, p.name.toLowerCase(), cityId);
          }
        });
      }
    });

    // Default places for any cities without dedicated datasets
    allCityRows.forEach((city) => {
      if (!placesDataset[city.name]) {
        const defaultPlaceKey = `${city.name.toLowerCase()} historic central square_${city.id}`;
        if (!existingPlaceKeys.has(defaultPlaceKey)) {
          insertPlace.run(
            uuidv4(),
            city.id,
            `${city.name} Historic Old Town & Central Square`,
            'Cultural',
            4.7,
            1200,
            0,
            2.5,
            'Morning',
            `Explore historical monuments, central plazas, and heritage architecture in ${city.name}.`,
            'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
            `Center, ${city.name}`,
            'Start early in the morning for quiet photo opportunities before tour buses arrive.',
            'historic,walking,sightseeing'
          );
          insertPlace.run(
            uuidv4(),
            city.id,
            `${city.name} Culinary & Food Market Experience`,
            'Food & Dining',
            4.8,
            950,
            18,
            2.0,
            'Afternoon',
            `Taste signature regional specialties, street food, and local drinks in ${city.name}.`,
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
            `Market Hall, ${city.name}`,
            'Ask local vendors for their daily chef special for the freshest ingredients.',
            'food,market,authentic'
          );
          addedPlaces += 2;
        }
      }
    });

    if (addedPlaces > 0) {
      console.log(`Seeded ${addedPlaces} new places to visit.`);
    }
  });
  seedPlacesTxn();

  // 3. Realistic Curated Activities Seeding
  const CURATED_REALISTIC_ACTIVITIES = [
    { city: 'Rishikesh', name: 'Shivpuri to Rishikesh 16km White Water River Rafting', type: 'Adventure', cost: 850, duration: 3.5, description: 'Conquer Class III & IV rapids (Roller Coaster, Golf Course) on the sacred Ganges with certified river guides, cliff jumping, and safety gear.', imageUrl: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=80' },
    { city: 'Rishikesh', name: 'Triveni Ghat Evening Maha Ganga Aarti & Floating Diyas', type: 'Culture', cost: 0, duration: 2.0, description: 'Witness priests perform rhythmic fire aarti to Vedic chants as thousands of devotees release glowing leaf lamps into the evening river.', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80' },
    { city: 'Rishikesh', name: 'Neer Garh Hidden Jungle Waterfall Trek & Cold Plunge', type: 'Adventure', cost: 150, duration: 3.0, description: 'Trek across wooden footbridges through dense sub-tropical forests to pristine natural cascading limestone plunge pools.', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80' },
    { city: 'Goa', name: 'Grand Island Deep Sea Scuba Diving with Dolphin Sighting & BBQ', type: 'Adventure', cost: 2499, duration: 6.0, description: 'PADI-instructor guided dive exploring rich coral reefs and historic shipwrecks, boat cruise, underwater HD video, and fresh beach buffet.', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80' },
    { city: 'Goa', name: 'Mandovi River Sunset Luxury Catamaran Cruise & Goan Folk Music', type: 'Leisure', cost: 650, duration: 2.0, description: 'Sail through tranquil backwaters as the sun sets over the Arabian Sea, enjoying live Dekhni dance performances and chilled refreshments.', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
    { city: 'Goa', name: 'Fontainhas Latin Quarter Heritage Photography & Fado Walk', type: 'Culture', cost: 450, duration: 2.5, description: 'Wander past 18th-century pastel Portuguese villas, tiled Azulejo nameplates, artisanal bakeries, and historic cobblestone lanes.', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80' },
    { city: 'Goa', name: 'Calangute & Baga Parasailing and Jet Ski Speed Run Combo', type: 'Adventure', cost: 1250, duration: 1.5, description: 'High-altitude sea parachute flight with thrilling dip into the waves followed by high-speed waverunner laps along the coast.', imageUrl: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80' },
    { city: 'Manali', name: 'Solang Valley High Tandem Paragliding Flight (Rohtang Vista)', type: 'Adventure', cost: 1850, duration: 2.0, description: 'Soar like an eagle above alpine cedar forests with licensed pilots and uninterrupted panoramic views of snow-capped Pir Panjal peaks.', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80' },
    { city: 'Manali', name: 'Old Manali Trout Fishing, Wood-Fired Cafes & Riverside Walk', type: 'Food', cost: 600, duration: 3.0, description: 'Experience rustic village charm along the Beas River, sampling freshly caught Himalayan rainbow trout and wood-fired artisanal sourdough pizzas.', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80' },
    { city: 'Manali', name: 'Jogini Waterfall Pine Forest Nature Hike', type: 'Adventure', cost: 0, duration: 3.0, description: 'Scenic mountain trail passing through secluded apple orchards and sacred shrines to reach dramatic 150-foot cascading cliffs.', imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80' },
    { city: 'Jaipur', name: 'Amber Fort Heritage Night Safari & Maota Lake Sound & Light Show', type: 'Culture', cost: 450, duration: 2.5, description: 'Marvel at Rajput architectural grandeur illuminated against starry night skies with royal Hindi & English narration.', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80' },
    { city: 'Jaipur', name: 'Old Pink City Royal Heritage Street Food & Bazaars Walk', type: 'Food', cost: 550, duration: 3.0, description: 'Trek through Johari Bazaar for authentic Pyaaz Kachori, spiced Lassi at Lassiwala, Ghewar sweets, and block-print ateliers.', imageUrl: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=800&q=80' },
    { city: 'Jaipur', name: 'Nahargarh Fort Sunset Jeep Drive & Padao Panoramic Rooftop', type: 'Leisure', cost: 300, duration: 2.0, description: 'Ascend the winding Aravalli ridge for a 360-degree vista of Jaipur twinkling city lights as dusk sets in.', imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80' },
    { city: 'Matheran', name: 'Heritage Forest Horseback Trail & Charlotte Lake Nature Trot', type: 'Adventure', cost: 500, duration: 2.5, description: 'Trot along vehicle-free red laterite paths under shady canopies to discover hidden forest lakes and rare birdlife.', imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80' },
    { city: 'Matheran', name: 'Panorama Point 360° Dawn Ridge Trek & Hot Cutting Chai', type: 'Sightseeing', cost: 0, duration: 3.0, description: 'Pre-dawn cliff walk to watch morning mist burn off the Sahyadri mountains with roasted corn and hot cutting chai.', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
    { city: 'Matheran', name: 'Artisanal Chikki & Chocolate Walnut Fudge Tasting at Mall Road', type: 'Food', cost: 250, duration: 1.5, description: 'Sample hand-rolled jaggery chikki varieties, Nariman fudges, and authentic Maharashtrian misal pav.', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80' },
    { city: 'Varanasi', name: 'Subah-e-Banaras Dawn Wooden Boat Row across Ancient Ghats', type: 'Culture', cost: 400, duration: 2.5, description: 'Watch the sun rise over the holy Ganges as priests chant mantras, bathers perform morning surya namaskar, and temple bells ring.', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80' },
    { city: 'Varanasi', name: 'Kashi Vishwanath Corridor & Godowlia Alleyways Chaat Safari', type: 'Food', cost: 350, duration: 2.0, description: 'Taste crispy Tamatar Chaat, Palak Patta Chaat, creamy seasonal Malaiyo foam, and authentic Banarasi Paan.', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80' },
    { city: 'Lonavala', name: 'Karla 2nd-Century Buddhist Rock-Cut Chaitya Caves Exploration', type: 'Culture', cost: 100, duration: 3.0, description: 'Climb stone steps to marvel at 2,000-year-old carved teakwood roof ribs, grand ashokan pillars, and monolithic stupas.', imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80' },
    { city: 'Lonavala', name: 'Tiger’s Leap & Lion’s Point High Ridge Sunset & Pakoda Picnic', type: 'Leisure', cost: 0, duration: 2.0, description: 'Perch atop 650-meter vertical cliff drop enjoying gusting monsoon winds and hot onion bhaji.', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80' },
    { city: 'Mahabaleshwar', name: 'Mapro Strawberry Farm Tour, Berry Picking & Chef Dessert Tasting', type: 'Food', cost: 350, duration: 2.5, description: 'Wander through fragrant berry bushes, sample fresh chocolate strawberry fondue, and enjoy wood-fired thin-crust pizza.', imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80' },
    { city: 'Mahabaleshwar', name: 'Venna Lake Sunset Shikara Paddle Boat & Pine Forest Walk', type: 'Leisure', cost: 450, duration: 2.0, description: 'Glaze across calm hill station waters surrounded by thick deodar and pine trees as twilight settles.', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80' },
    { city: 'Coorg', name: 'Rainforest Coffee Estate Plantation Walk & Cupping Workshop', type: 'Food', cost: 400, duration: 2.5, description: 'Learn harvesting of Arabica & Robusta beans, pepper vines, cardamom pods, followed by freshly roasted espresso tasting.', imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80' },
    { city: 'Coorg', name: 'Abbey Falls Roaring Spray Trek & Hanging Bridge Photo Spot', type: 'Adventure', cost: 80, duration: 2.0, description: 'Descent through dense spice groves to witness cascading river rapids over rocky basalt boulders.', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80' },
    { city: 'Darjeeling', name: 'Tiger Hill Mt. Kanchenjunga Golden Dawn 4x4 Jeep Safari', type: 'Sightseeing', cost: 600, duration: 3.5, description: 'Early 4:00 AM departure to witness the first rays of morning sun turn Himalayan mountain peaks into glistening pink gold.', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80' },
    { city: 'Darjeeling', name: 'Happy Valley Organic Tea Estate Plucking & Factory Tasting', type: 'Culture', cost: 350, duration: 2.5, description: 'Walk terraced misty mountain slopes with estate pluckers and taste rare Muscatel first-flush teas.', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80' },
    { city: 'Ooty', name: 'UNESCO Nilgiri Mountain Steam Toy Train Joyride (Coonoor Run)', type: 'Culture', cost: 250, duration: 3.0, description: 'Ride the century-old rack-and-pinion blue heritage locomotive crossing high viaduct bridges and deep tea ravines.', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80' },
    { city: 'Ooty', name: 'Government Botanical Gardens & Doddabetta Peak Lookout', type: 'Sightseeing', cost: 120, duration: 2.5, description: 'Explore 55 acres of exotic terraced flora and ascend to the highest Nilgiri viewpoint.', imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80' },
    { city: 'Dubai', name: 'Lahbab Red Dunes 4x4 Desert Safari, Sandboarding & Starlight BBQ', type: 'Adventure', cost: 3200, duration: 6.0, description: 'High-octane dune bashing, camel riding, falconry, Tanoura performance, and open-air grilled Arabic dinner feast.', imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&q=80' },
    { city: 'Dubai', name: 'Burj Khalifa 124th Floor Sky Lounge & Dubai Fountain Spectacle', type: 'Sightseeing', cost: 4100, duration: 2.5, description: 'Ascend the world fastest double-decker elevator to enjoy panoramic skyscraper vistas and choreographed water music.', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
    { city: 'Paris', name: 'Seine River Sunset Glass-Canopy Dinner Cruise with Live Jazz', type: 'Leisure', cost: 4900, duration: 2.5, description: '3-course gourmet French dinner gliding past the illuminated Eiffel Tower, Louvre Museum, and Notre-Dame.', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80' },
    { city: 'Paris', name: 'Montmartre Bohemian Artists Square & Sacré-Cœur Walking Tour', type: 'Culture', cost: 1200, duration: 3.0, description: 'Wind through cobblestone alleys where Picasso and Van Gogh painted, ending with panoramic hilltop city views.', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80' },
    { city: 'Tokyo', name: 'Tsukiji Outer Market Culinary Safari & Fresh Nigiri Masterclass', type: 'Food', cost: 3600, duration: 3.0, description: 'Navigate bustling street stalls sampling tamagoyaki, wagyu skewers, fresh sea urchin, and master sushi rolling techniques.', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80' },
    { city: 'Tokyo', name: 'Shinjuku & Shibuya Neon Nightlife & Cyberpunk Izakaya Crawl', type: 'Culture', cost: 2400, duration: 3.5, description: 'Explore atmospheric Omoide Yokocho lantern alleys, Golden Gai miniature bars, and futuristic neon streetscapes.', imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80' },
    { city: 'Udaipur', name: 'Lake Pichola Royal Sunset Boat Cruise & Jag Mandir Island', type: 'Leisure', cost: 750, duration: 2.0, description: 'Golden hour sail past City Palace marble facades and shimmering island palaces.', imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&q=80' },
    { city: 'Jodhpur', name: 'Mehrangarh Fort Flying Fox Aerial Zipline Tour (6 Zips)', type: 'Adventure', cost: 1650, duration: 2.5, description: 'Glide along six wire cables high above defensive battlements and moat lakes with royal fortress views.', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80' },
    { city: 'Jaisalmer', name: 'Sam Golden Sand Dunes Sunset Camel Safari & Folk Dance', type: 'Adventure', cost: 850, duration: 4.0, description: 'Ride gentle camels into golden Thar desert ripple dunes, followed by Kalbeliya folk fire dances and chai.', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80' },
    { city: 'Goa', name: 'Dudhsagar Waterfalls Jungle Jeep Safari & Spice Plantation', type: 'Adventure', cost: 1600, duration: 6.0, description: 'Cross streams in an open 4x4 through Bhagwan Mahavir Wildlife Sanctuary to India’s 5th tallest waterfall.', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80' }
  ];

  // Remove old robotic templates
  db.prepare("DELETE FROM activities WHERE is_template = 1 AND (name LIKE '%City Heritage Tour%' OR name LIKE '%Local Food Tasting Trail%' OR name LIKE '%Historical Monument Visit%' OR name LIKE '%Scenic Adventure Activity%' OR name LIKE '%Sunset Cruise & Viewpoint%')").run();

  const seedCuratedActivitiesTxn = db.transaction(() => {
    let count = 0;
    const existingActs = new Set(db.prepare('SELECT LOWER(name) as name FROM activities WHERE is_template = 1').all().map((r) => r.name));
    
    CURATED_REALISTIC_ACTIVITIES.forEach((act) => {
      if (!existingActs.has(act.name.toLowerCase())) {
        const cityRow = db.prepare('SELECT id FROM cities WHERE LOWER(name) LIKE ?').get(`%${act.city.toLowerCase()}%`);
        insertActivity.run(
          uuidv4(),
          cityRow ? cityRow.id : null,
          act.name,
          act.type,
          act.cost,
          act.duration,
          act.description,
          act.imageUrl
        );
        count++;
      }
    });

    if (count > 0) {
      console.log(`Seeded ${count} realistic curated travel activities.`);
    }
  });
  seedCuratedActivitiesTxn();

  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@globetrotter.com');
  if (!existingAdmin) {
    db.prepare(`INSERT INTO users (id, name, email, password_hash, language, is_admin, created_at)
      VALUES (?, ?, ?, ?, ?, 1, ?)`)
      .run(uuidv4(), 'Admin', 'admin@globetrotter.com', bcrypt.hashSync('admin123', 10), 'English', new Date().toISOString());
    console.log('Seeded admin user: admin@globetrotter.com / admin123');
  } else {
    console.log('Admin user already exists. Skipping.');
  }

  console.log('Database seeding complete.');
}

if (require.main === module) {
  run()
    .then(() => {
      console.log('Seed process exited cleanly.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}

module.exports = { seedDatabase: run };


