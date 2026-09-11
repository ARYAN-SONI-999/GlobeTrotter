const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { mapPlace, mapCity, mapTrip } = require('../serializers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

function calculateDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
}

function getDateString(startDate, offsetDays) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

// =========================================================================
// EXPANDED KNOWLEDGE BASE OF DOMESTIC (INDIA) & INTERNATIONAL DESTINATIONS
// =========================================================================
const DETAILED_DESTINATION_BRAIN = {
  // --- Maharashtra & Western India ---
  'matheran': {
    name: 'Matheran',
    country: 'India',
    region: 'India (Domestic - Maharashtra)',
    costIndex: 24,
    popularity: 94,
    coverPhoto: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80',
    climateAdvice: 'Pleasant year-round hill station climate. Monsoon brings lush green mist and waterfalls; Oct-May offers crisp mountain views.',
    transitStrategy: 'Automobiles are completely banned in Matheran. All transit within the town is done on foot, horseback, or hand-pulled rickshaws. Heritage toy train runs from Neral to Aman Lodge.',
    foodTips: 'Try freshly prepared chikki, Nariman/Bhairavnath chocolate walnut fudge, hot street corn, and local spicy Maharashtrian misal pav.',
    places: [
      { name: 'Charlotte Lake & Louisa Point', category: 'Nature & Outdoors', rating: 4.9, cost: 0, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', description: 'Serene freshwater lake surrounded by dense rainforest leading to dramatic cliffside views of Prabal Fort and waterfall streams.', tip: 'Visit Charlotte Lake at 8:30 AM to hear melodious forest birds and avoid midday crowd bustle.' },
      { name: 'Panorama Point 360° Sunrise Lookout', category: 'Landmark', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', description: 'Known as the Sunrise Point offering an unmatched 360-degree panoramic vista across the Western Ghats, Sahyadri ranges, and Ulhas River.', tip: 'Trek early or take a horse ride before dawn to witness golden sunbeams piercing through valley clouds.' },
      { name: 'Neral-Matheran Heritage Toy Train & Market Walk', category: 'Cultural', rating: 4.8, cost: 150, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80', description: 'UNESCO-recognized 1907 narrow-gauge railway winding through misty hillside slopes ending in the vibrant pedestrian bazaar.', tip: 'Book toy train tickets at Aman Lodge / Neral station early as daily seats are limited.' },
      { name: 'Echo Point & Honeymoon Hill Vistas', category: 'Landmark', rating: 4.8, cost: 0, duration: 2.0, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80', description: 'Famous acoustics cliffpoint where your voice reverberates across valleys with sweeping views of deep verdant gorges.', tip: 'Shout toward the distant plateau to hear clear multi-second acoustic echoes.' },
      { name: 'Porcupine Point (Sunset Point)', category: 'Landmark', rating: 4.9, cost: 0, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', description: 'Matheran’s premier golden hour vantage point overlooking Prabalgad fort and glowing orange mountain silhouettes.', tip: 'Reach the viewing edge by 5:15 PM and enjoy roasted spiced corn (bhutta) as the sun sets.' },
      { name: 'Rambagh Point & Alexander Point Trail', category: 'Nature & Outdoors', rating: 4.7, cost: 0, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', description: 'Peaceful walking trail through red laterite pathways surrounded by wild mossy trees and valley viewpoints.', tip: 'Wear sturdy trekking shoes as the red earth trails can have loose gravel.' }
    ]
  },
  'lonavala': {
    name: 'Lonavala & Khandala',
    country: 'India',
    region: 'India (Domestic - Maharashtra)',
    costIndex: 26,
    popularity: 95,
    coverPhoto: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=1200&q=80',
    climateAdvice: 'Monsoons feature raging waterfalls; winters are crisp and ideal for cave trekking and sightseeing.',
    transitStrategy: 'Local taxis, auto-rickshaws, and rental cars connect points across Lonavala and Khandala.',
    foodTips: 'Must try Maganlal chikki, hot fudge at Cooper’s, and fresh garam chai with pakodas at Tiger Point.',
    places: [
      { name: 'Tiger’s Leap & Lion’s Point Sunset', category: 'Landmark', rating: 4.8, cost: 0, duration: 2.5, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80', description: 'Dramatic cliff with an abrupt 650m drop offering valley views and roaring winds resembling a tiger leaping into the valley.', tip: 'Savor piping hot onion pakodas and roasted corn while enjoying the swirling mountain mist.' },
      { name: 'Karla & Bhaja Ancient Buddhist Caves', category: 'Cultural', rating: 4.9, cost: 50, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80', description: '2nd-century BC rock-cut Buddhist chaitya halls with massive sculpted pillars, stupas, and monastic cells.', tip: 'Climb Karla Cave steps early in the morning to escape midday heat.' },
      { name: 'Bhushi Dam & Water Cascades', category: 'Leisure', rating: 4.6, cost: 0, duration: 2.5, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80', description: 'Popular masonry dam on Indrayani river where water flows over stone steps creating natural soaking spots.', tip: 'Visit during monsoon season for the best overflowing water experience.' },
      { name: 'Duke’s Nose Clifftop Trek', category: 'Adventure', rating: 4.8, cost: 0, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', description: 'Pointed cliff peak resembling Duke of Wellington’s nose popular for trekking, valley rappelling, and views.', tip: 'Carry ample drinking water and trail snacks; the climb from Khandala takes about 1.5 hours.' }
    ]
  },
  'mahabaleshwar': {
    name: 'Mahabaleshwar & Panchgani',
    country: 'India',
    region: 'India (Domestic - Maharashtra)',
    costIndex: 28,
    popularity: 96,
    coverPhoto: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80',
    climateAdvice: 'Cool mountain weather. Peak strawberry harvest runs December through April.',
    transitStrategy: 'Tourist cabs and private vehicles are standard for touring points.',
    foodTips: 'Fresh strawberry with whipped cream at Mapro Garden, corn patties, and hot Maharashtrian Pithla Bhakri.',
    places: [
      { name: 'Arthur’s Seat Queen of Points', category: 'Landmark', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', description: 'Famous viewpoint perched at 1,340m looking over dense Jor Valley and Savitri River.', tip: 'Watch light objects float upward due to strong reverse air currents.' },
      { name: 'Venna Lake Boating & Horse Riding', category: 'Leisure', rating: 4.7, cost: 250, duration: 2.0, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', description: 'Tranquil lake surrounded by tall pine trees offering paddle boats and lakeside street food.', tip: 'Take a boat ride around 4:30 PM to catch golden sunset reflections on the lake surface.' },
      { name: 'Mapro Garden & Strawberry Estate', category: 'Food & Dining', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80', description: 'Sprawling strawberry agro-tourism park offering fresh strawberry cream, wood-fired pizzas, and fruit syrups.', tip: 'Try the iconic chocolate strawberry fondue and take home artisanal fruit jams.' },
      { name: 'Panchgani Table Land Plateau', category: 'Nature & Outdoors', rating: 4.8, cost: 100, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80', description: 'Asia’s second-longest mountain plateau consisting of a vast flat volcanic rock overlooking emerald valleys.', tip: 'Enjoy a horse-drawn carriage ride or walk across the plateau at sunset.' }
    ]
  },
  'shimla': {
    name: 'Shimla',
    country: 'India',
    region: 'India (Domestic - Himachal)',
    costIndex: 26,
    popularity: 95,
    coverPhoto: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&q=80',
    climateAdvice: 'Cool alpine weather in summer; magical snowfall from late December to February.',
    transitStrategy: 'Mall Road is pedestrian-only. Local taxis connect Kufri and outer valleys.',
    foodTips: 'Himachali Siddu with ghee, hot Thukpa, bakery treats at Trishool on Mall Road, and street Momos.',
    places: [
      { name: 'The Ridge & Mall Road Heritage Walk', category: 'Cultural', rating: 4.8, cost: 0, duration: 2.5, bestTime: 'Evening', imageUrl: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&q=80', description: 'Pedestrian cultural heart of Shimla featuring neo-Gothic Christ Church, colonial architecture, and mountain views.', tip: 'Visit at dusk when the church and mountain valley light up beautifully.' },
      { name: 'Jakhoo Temple & Giant Hanuman Statue', category: 'Landmark', rating: 4.8, cost: 0, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80', description: 'Hilltop temple at 2,455m crowned by a massive 108-foot Hanuman statue with cable car ropeway access.', tip: 'Take the Jakhoo Ropeway from Ridge for aerial pine forest views; watch out for friendly monkeys.' },
      { name: 'Kufri Snow & Adventure Park', category: 'Adventure', rating: 4.7, cost: 500, duration: 4.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', description: 'High-altitude adventure zone offering snow sports, yak rides, tobogganing, and Himalayan nature views.', tip: 'Rent warm boots and snow gear at the base before heading to Mahasu Peak.' }
    ]
  },
  'rishikesh': {
    name: 'Rishikesh',
    country: 'India',
    region: 'India (Domestic - Uttarakhand)',
    costIndex: 22,
    popularity: 96,
    coverPhoto: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e13?w=1200&q=80',
    climateAdvice: 'Ideal from September to May. Pleasant river breezes; holy Ganga spiritual energy.',
    transitStrategy: 'Walkable suspension bridges, scooter rentals, and shared autos/Vikrams.',
    foodTips: 'Ayurvedic satvik thalis, organic cafe sourdoughs & smoothies at Little Buddha Cafe, hot chotiwala thali.',
    places: [
      { name: 'Triveni Ghat Evening Maha Ganga Aarti', category: 'Cultural', rating: 5.0, cost: 0, duration: 2.0, bestTime: 'Evening', imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80', description: 'Soul-stirring spiritual ceremony of bells, drums, Vedic chants, and floating oil leaf lamps on the river.', tip: 'Arrive 45 minutes before sunset to sit near the river steps and release a floral diya lamp.' },
      { name: 'White Water River Rafting in Ganga', category: 'Adventure', rating: 4.9, cost: 800, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=80', description: 'Thrilling Class III/IV river rapids (Roller Coaster, Golf Course) surrounded by Himalayan cliffs.', tip: 'Opt for the 16km Shivpuri to Rishikesh stretch for the best mix of rapids and cliff jumping.' },
      { name: 'Lakshman & Ram Jhula Suspension Bridges', category: 'Landmark', rating: 4.7, cost: 0, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e13?w=800&q=80', description: 'Iconic suspension bridges spanning the turquoise Ganga connecting ashrams, yoga schools, and cafes.', tip: 'Stop at riverside rooftop cafes near Ram Jhula for lemon ginger honey tea and mountain vistas.' },
      { name: 'The Beatles Ashram (Chaurasi Kutia)', category: 'Cultural', rating: 4.8, cost: 150, duration: 2.5, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1545232979-fbf68fe9b10d?w=800&q=80', description: 'Historic Maharishi Mahesh Yogi ashram where the Beatles composed the White Album in 1968 covered in graffiti art.', tip: 'Explore the meditation caves and Beatles photo exhibition inside the main hall.' }
    ]
  },
  'ooty': {
    name: 'Ooty (Udhagamandalam)',
    country: 'India',
    region: 'India (Domestic - Tamil Nadu)',
    costIndex: 25,
    popularity: 94,
    coverPhoto: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80',
    climateAdvice: 'Year-round cool mountain climate; carry a light jacket and umbrella.',
    transitStrategy: 'Heritage Nilgiri mountain toy train, local taxis, and auto-rickshaws.',
    foodTips: 'Homemade artisan chocolates, Ooty varkey biscuits, hot South Indian filter coffee, and fresh Nilgiri tea.',
    places: [
      { name: 'Nilgiri Mountain UNESCO Toy Train', category: 'Cultural', rating: 4.9, cost: 120, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80', description: 'Heritage steam locomotive rack-and-pinion railway winding through tunnels, bridges, and misty tea estates.', tip: 'Book train tickets 1-2 months in advance on IRCTC for the scenic Mettupalayam to Ooty stretch.' },
      { name: 'Ooty Lake & Boating Pier', category: 'Leisure', rating: 4.6, cost: 180, duration: 2.0, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', description: 'Picturesque artificial lake built in 1824 with eucalyptus groves, motor boating, and cycling paths.', tip: 'Rent a rowboat or paddle boat for a serene ride across the water.' },
      { name: 'Government Botanical Gardens & Doddabetta', category: 'Nature & Outdoors', rating: 4.8, cost: 50, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80', description: '55-acre terraced garden with exotic floral species, 20-million-year-old fossilized tree, and mountain peak views.', tip: 'Climb to Doddabetta Peak telescope house on clear mornings for panoramic Nilgiri views.' }
    ]
  },
  'coorg': {
    name: 'Coorg (Madikeri)',
    country: 'India',
    region: 'India (Domestic - Karnataka)',
    costIndex: 27,
    popularity: 94,
    coverPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
    climateAdvice: 'Scotland of India — lush greenery, mist, and aromatic coffee blossoms.',
    transitStrategy: 'Private cabs and rental scooters are ideal for exploring coffee plantation trails.',
    foodTips: 'Authentic Kodava Pandi Curry (or mushroom curry), Akki Roti, Bamboo Shoot curry, and freshly brewed Arabica coffee.',
    places: [
      { name: 'Abbey Falls & Hanging Bridge', category: 'Nature & Outdoors', rating: 4.8, cost: 50, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80', description: 'Roaring waterfall cascading from 70 feet nestled inside private coffee estates and spice plantations.', tip: 'Stand on the hanging bridge opposite the falls for great mist spray photo opportunities.' },
      { name: 'Raja’s Seat Sunset & Musical Fountain', category: 'Landmark', rating: 4.8, cost: 30, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', description: 'Historic garden pavilion where the Kings of Kodagu watched sunsets across undulating green hills.', tip: 'Arrive by 5:30 PM to catch the setting sun and the evening musical fountain show.' },
      { name: 'Namdroling Golden Temple Tibetan Monastery', category: 'Cultural', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&q=80', description: 'Largest Tibetan Buddhist settlement in South India featuring 40-foot gilded gold Buddha statues.', tip: 'Visit during afternoon monk prayer chants to experience the hypnotic sound of traditional horns and drums.' }
    ]
  },
  'darjeeling': {
    name: 'Darjeeling',
    country: 'India',
    region: 'India (Domestic - West Bengal)',
    costIndex: 26,
    popularity: 95,
    coverPhoto: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=1200&q=80',
    climateAdvice: 'Cool mountain air. Oct-Dec offers the clearest sunrise views of Mt. Kanchenjunga.',
    transitStrategy: 'Shared jeeps, Darjeeling Toy Train, and walking along Mall Road.',
    foodTips: 'Steamed Tibetan momos with spicy red chili dip, Thukpa, churpee cheese, and first-flush Darjeeling Muscatel tea.',
    places: [
      { name: 'Tiger Hill Mt. Kanchenjunga Sunrise', category: 'Landmark', rating: 5.0, cost: 50, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', description: 'World-famous dawn panorama where the morning sun turns Mt. Kanchenjunga and Himalayan peaks into pure pink gold.', tip: 'Depart from town at 3:45 AM to secure top observation lounge seats before sunrise.' },
      { name: 'Darjeeling Himalayan Toy Train & Batasia Loop', category: 'Cultural', rating: 4.9, cost: 800, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80', description: 'Steam locomotive joyride looping around the Batasia Gorkha war memorial with 360-degree mountain backdrops.', tip: 'Take the heritage steam engine joyride from Darjeeling to Ghum and back.' },
      { name: 'Happy Valley Tea Estate Heritage Tour', category: 'Nature & Outdoors', rating: 4.8, cost: 100, duration: 2.0, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80', description: 'Historic 1854 tea plantation producing world-renowned Darjeeling black, green, and white organic teas.', tip: 'Join the factory processing tour and tea tasting session with master blenders.' }
    ]
  },
  'udaipur': {
    name: 'Udaipur',
    country: 'India',
    region: 'India (Domestic - Rajasthan)',
    costIndex: 30,
    popularity: 96,
    coverPhoto: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=1200&q=80',
    climateAdvice: 'Royal lakeside retreat. Best visited from October to March for cool pleasant evenings.',
    transitStrategy: 'Auto-rickshaws, lake boat ferries, and walking through the old heritage alleys.',
    foodTips: 'Dal Baati Churma, Ker Sangri, Laal Maas, lakefront rooftop dining, and hot jalebis at Jagdish Chowk.',
    places: [
      { name: 'City Palace of Udaipur & Museum', category: 'Cultural', rating: 4.9, cost: 300, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&q=80', description: 'Rajasthan’s largest palace complex overlooking Lake Pichola featuring jewel-encrusted peacock courtyards and royal galleries.', tip: 'Visit Mor Chowk and the Crystal Gallery early in the morning for crisp photography.' },
      { name: 'Lake Pichola Sunset Boat Cruise & Jag Mandir', category: 'Leisure', rating: 4.9, cost: 450, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80', description: 'Glide across mirror-like waters past the floating white-marble Lake Palace with Aravalli sunset reflections.', tip: 'Take the 5:15 PM boat that includes a stopover at the island palace Jag Mandir.' },
      { name: 'Bagore Ki Haveli Folk Dance & Puppet Show', category: 'Cultural', rating: 4.9, cost: 100, duration: 2.0, bestTime: 'Evening', imageUrl: 'https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=800&q=80', description: '18th-century waterfront mansion hosting the Dharohar folk dance show with fire and 11-pot balancing acts.', tip: 'Book your evening ticket by 5:00 PM as seats in the central courtyard fill quickly.' }
    ]
  },
  'gujarat': {
    name: 'Gujarat (Ahmedabad, Kutch & Kevadia)',
    country: 'India',
    region: 'India (Domestic - Gujarat)',
    costIndex: 25,
    popularity: 97,
    coverPhoto: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e13?w=1200&q=80',
    climateAdvice: 'Best visited from November to February during the vibrant Rann Utsav and pleasant winter weather.',
    transitStrategy: 'Vande Bharat Express connects Mumbai/Ahmedabad. AC luxury coaches and rental taxis connect Statue of Unity and Kutch.',
    foodTips: 'Authentic Gujarati Thali (Khadhi, Undhiyu, Rotlo), Fafda-Jalebi at Chandravilas, Dhokla, Handvo, and Dabeli.',
    places: [
      { name: 'Statue of Unity & Sardar Sarovar Dam (Kevadia)', category: 'Landmark', rating: 5.0, cost: 380, duration: 4.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80', description: 'World’s tallest statue standing at 182 meters surrounded by Narmada river, viewing gallery at 153m, and light show.', tip: 'Book viewing gallery high-speed elevator tickets online in advance to avoid queues.' },
      { name: 'Sabarmati Ashram & Riverfront Promenade (Ahmedabad)', category: 'Cultural', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80', description: 'Mahatma Gandhi’s historical headquarters on the banks of Sabarmati featuring Hriday Kunj and handloom spinning displays.', tip: 'Walk along the riverfront at sunset for cool evening breezes and lit garden walkways.' },
      { name: 'Great Rann of Kutch White Salt Desert (Dhordo)', category: 'Nature & Outdoors', rating: 5.0, cost: 100, duration: 3.5, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80', description: 'Vast 7,500 sq km white salt marsh desert glowing like silver under full moon nights and sunset horizons.', tip: 'Visit during full moon nights of Rann Utsav for a surreal glowing white salt desert experience.' },
      { name: 'Gir National Park Lion Safari (Sasangir)', category: 'Adventure', rating: 4.9, cost: 1000, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', description: 'The sole natural habitat of wild Asiatic Lions in the world offering open-top jeep wildlife safaris.', tip: 'Secure online Gir Safari permit 2-3 months in advance as daily permits are strictly capped.' }
    ]
  },
  'ahmedabad': {
    name: 'Ahmedabad (Heritage City)',
    country: 'India',
    region: 'India (Domestic - Gujarat)',
    costIndex: 24,
    popularity: 96,
    coverPhoto: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=1200&q=80',
    climateAdvice: 'Pleasant winter months from October to March.',
    transitStrategy: 'Ahmedabad Metro, BRTS bus corridor, and Ola/Uber cabs.',
    foodTips: 'Manek Chowk night street food market for Gwalior Dosa & Chocolate Sandwich, Das Khaman, and Chandravilas Jalebi.',
    places: [
      { name: 'Adalaj Stepwell (Adalaj ni Vav)', category: 'Cultural', rating: 4.9, cost: 25, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800&q=80', description: '5-story deep 1498 Solanki-style subterranean water building featuring intricately carved sandstone pillars.', tip: 'Visit around 10:30 AM when sunlight filters down to the lower water levels.' },
      { name: 'Sabarmati Ashram & Museum', category: 'Cultural', rating: 4.9, cost: 0, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80', description: 'Peaceful riverbank ashram where Mahatma Gandhi launched the historic Salt March.', tip: 'Browse original letters and spinning wheel exhibits inside the museum hall.' },
      { name: 'Manek Chowk Heritage Night Market', category: 'Food & Dining', rating: 4.8, cost: 0, duration: 2.0, bestTime: 'Evening', imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80', description: 'Historic square that transforms into a buzzing night food street after 9 PM serving famous fusion dishes.', tip: 'Try the iconic Pineapple Ice-Cream Sandwich and Butter Jam Maska Bun.' }
    ]
  },
  'munnar': {
    name: 'Munnar (Tea Gardens)',
    country: 'India',
    region: 'India (Domestic - Kerala)',
    costIndex: 26,
    popularity: 96,
    coverPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
    climateAdvice: 'Cool mountain air. Best months from September to May.',
    transitStrategy: 'Local taxis, auto-rickshaws, and tea plantation walking trails.',
    foodTips: 'Kerala Sadhya, hot Cardamom Tea, appam with stew, and fresh coconut parotta.',
    places: [
      { name: 'Eravikulam National Park & Rajamalai', category: 'Nature & Outdoors', rating: 4.9, cost: 200, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80', description: 'Home to the endangered Nilgiri Tahr mountain goat and blooming Neelakurinji flowers overlooking Anamudi peak.', tip: 'Book safari bus tickets online to skip morning entry lines.' },
      { name: 'Tata Tea Museum & Lockhart Estate', category: 'Cultural', rating: 4.8, cost: 120, duration: 2.0, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80', description: 'Historic tea processing machinery demonstration, tea leaf picking, and tasting of orthodox black & green teas.', tip: 'Sample rare white tea and buy fresh cardamom and clove spices at the estate store.' },
      { name: 'Mattupetty Dam & Echo Point Lake', category: 'Leisure', rating: 4.7, cost: 100, duration: 2.5, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80', description: 'Picturesque masonry dam with speedboat rides surrounded by mist-laden tea slopes and reverberating valley echo cliffs.', tip: 'Try the paddle boats and shout toward the reservoir walls to test natural acoustics.' }
    ]
  },
  'pondicherry': {
    name: 'Pondicherry (Puducherry)',
    country: 'India',
    region: 'India (Domestic - Tamil Nadu/UT)',
    costIndex: 28,
    popularity: 95,
    coverPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
    climateAdvice: 'Pleasant coastal breezes. Best visited from October to March.',
    transitStrategy: 'Rented yellow scooters, bicycles, and heritage French Quarter walks.',
    foodTips: 'French baguettes, chocolate croissants at Baker Street, wood-fired seafood pizza, and South Indian filter coffee.',
    places: [
      { name: 'White Town French Quarter Heritage Walk', category: 'Cultural', rating: 4.9, cost: 0, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', description: 'Charming mustard-yellow French colonial villas, bougainvillea archways, and cobblestone lanes.', tip: 'Rent a classic yellow scooter early in the morning for quiet street photography.' },
      { name: 'Auroville & Matrimandir Meditation Dome', category: 'Cultural', rating: 4.9, cost: 0, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1545232979-fbf68fe9b10d?w=800&q=80', description: 'Universal township dedicated to human unity featuring the giant golden sphere Matrimandir inner chamber.', tip: 'Obtain your Matrimandir viewing pass at the Visitor Center on day 1.' },
      { name: 'Rock Beach Promenade & French War Memorial', category: 'Landmark', rating: 4.8, cost: 0, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', description: '1.5km oceanfront promenade closed to motor vehicles every evening for seaside walking and sea breezes.', tip: 'Grab gelato ice cream and sit on the rocky sea wall during sunset.' }
    ]
  },
  'amritsar': {
    name: 'Amritsar',
    country: 'India',
    region: 'India (Domestic - Punjab)',
    costIndex: 22,
    popularity: 97,
    coverPhoto: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=1200&q=80',
    climateAdvice: 'Best from October to March. Crisp winter mornings and spiritual serenity.',
    transitStrategy: 'E-rickshaws, hop-on tourist buses, and walking around the Golden Temple corridor.',
    foodTips: 'Amritsari Kulcha with Chole, hot Lassi at Ahuja, Makki di Roti, and Guru ka Langar.',
    places: [
      { name: 'Golden Temple (Sri Harmandir Sahib)', category: 'Cultural', rating: 5.0, cost: 0, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&q=80', description: 'Holiest Sikh shrine covered in 750kg of pure gold surrounded by the Amrit Sarovar sacred pool.', tip: 'Visit at dawn for Palki Sahib ceremony or at night when the golden temple lights reflect in the water.' },
      { name: 'Wagah Border Beating Retreat Ceremony', category: 'Landmark', rating: 4.9, cost: 0, duration: 3.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80', description: 'Patriotic military flag lowering ceremony at the India-Pakistan border gate with marching guards.', tip: 'Reach Wagah border stadium by 3:30 PM to secure front seating in VIP/Foreigner galleries.' },
      { name: 'Jallianwala Bagh Memorial Park', category: 'Cultural', rating: 4.8, cost: 0, duration: 1.5, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80', description: 'Historical 1919 independence memorial featuring the preserved bullet-marked walls and Martyr’s Well.', tip: 'Walk through the light & sound gallery hall to learn the national freedom story.' }
    ]
  },
  'jodhpur': {
    name: 'Jodhpur (The Blue City)',
    country: 'India',
    region: 'India (Domestic - Rajasthan)',
    costIndex: 26,
    popularity: 95,
    coverPhoto: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=1200&q=80',
    climateAdvice: 'Pleasant winter season from October to March.',
    transitStrategy: 'Auto-rickshaws, heritage walking tours, and local cabs.',
    foodTips: 'Mawa Kachori at Rawat, Mirchi Bada, Makhaniya Lassi at Clock Tower, and Ker Sangri.',
    places: [
      { name: 'Mehrangarh Fort & Museum', category: 'Cultural', rating: 5.0, cost: 200, duration: 3.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8418365?w=800&q=80', description: 'Massive 15th-century cliffside fortress towering 400 feet above the blue-painted houses of Jodhpur.', tip: 'Zip-line across fort battlements with Flying Fox for breathtaking fort photos.' },
      { name: 'Jaswant Thada Royal Cenotaphs', category: 'Cultural', rating: 4.8, cost: 50, duration: 1.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80', description: 'Taj Mahal of Marwar — an intricate white marble cenotaph monument set beside a tranquil lakeside garden.', tip: 'View the carved marble sheets that glow warm orange when sunlight hits them.' },
      { name: 'Blue City Heritage Alley Walk & Clock Tower', category: 'Landmark', rating: 4.8, cost: 0, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80', description: 'Indigo-washed narrow alleys of Navchokiya ending at Sardar Market clock tower.', tip: 'Climb a rooftop cafe near Ghanta Ghar for sunset vistas over the blue cityscape.' }
    ]
  },
  'london': {
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    costIndex: 90,
    popularity: 98,
    coverPhoto: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',
    climateAdvice: 'Summer (May-Sept) offers long daylight hours; carry a light trench coat & umbrella.',
    transitStrategy: 'London Underground (Tube), red double-decker buses, and contactless Oyster card.',
    foodTips: 'Classic Fish & Chips, afternoon English tea at The Ritz, Borough Market street food, and Sunday roast.',
    places: [
      { name: 'Big Ben & Palace of Westminster', category: 'Landmark', rating: 4.9, cost: 0, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', description: 'Iconic neo-Gothic clock tower on the River Thames next to Westminster Abbey.', tip: 'Cross Westminster Bridge for classic red bus & Big Ben photo shots.' },
      { name: 'The London Eye Observation Wheel', category: 'Leisure', rating: 4.8, cost: 3500, duration: 1.5, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&q=80', description: '135-meter tall cantilevered observation wheel giving 360-degree views across London skyline.', tip: 'Book fast-track sunset tickets online to skip 45-min queues.' },
      { name: 'Tower Bridge & Tower of London', category: 'Cultural', rating: 4.9, cost: 3000, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', description: 'Historic 1078 royal fortress housing the Crown Jewels and the iconic suspension bridge.', tip: 'Walk across the high glass-floor walkways of Tower Bridge.' }
    ]
  },
  'singapore': {
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    costIndex: 85,
    popularity: 97,
    coverPhoto: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80',
    climateAdvice: 'Tropical year-round. Light clothing and comfortable walking shoes.',
    transitStrategy: 'MRT subway system is clean, fast, and connects all attractions.',
    foodTips: 'Hainanese Chicken Rice at Maxwell Food Centre, Chili Crab at Clarke Quay, and Kaya Toast with kopi.',
    places: [
      { name: 'Gardens by the Bay & Supertree Grove', category: 'Nature & Outdoors', rating: 5.0, cost: 1800, duration: 3.5, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80', description: 'Futuristic 101-hectare park with 50-meter Supertrees, Flower Dome, and Cloud Forest waterfall.', tip: 'Watch the Garden Rhapsody light and sound show at 7:45 PM every evening.' },
      { name: 'Marina Bay Sands SkyPark Observation Deck', category: 'Landmark', rating: 4.9, cost: 2200, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80', description: 'Iconic 57th-floor rooftop deck overlooking Singapore Strait and city skyline.', tip: 'Combine your deck ticket with a rooftop cocktail at CÉ LA VI.' },
      { name: 'Sentosa Island & Universal Studios', category: 'Adventure', rating: 4.9, cost: 4800, duration: 6.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80', description: 'Resort island featuring movie theme parks, S.E.A. Aquarium, and Siloso beach bars.', tip: 'Take the cable car ride from Mount Faber to Sentosa for harbor views.' }
    ]
  }
};

// State / Region Classifier for automatic country detection
const INDIA_GEOGRAPHIC_KEYWORDS = [
  'matheran', 'lonavala', 'khandala', 'mahabaleshwar', 'panchgani', 'alibaug', 'shirdi', 'pune', 'nashik',
  'mumbai', 'kolhapur', 'aurangabad', 'sambhajinagar', 'goa', 'jaipur', 'udaipur', 'jodhpur', 'jaisalmer',
  'bikaner', 'pushkar', 'mount abu', 'manali', 'shimla', 'dharamshala', 'mcleodganj', 'kasol', 'spiti',
  'kullu', 'dalhousie', 'kasauli', 'rishikesh', 'haridwar', 'nainital', 'mussoorie', 'auli', 'kedarnath',
  'badrinath', 'varanasi', 'agra', 'delhi', 'new delhi', 'amritsar', 'kolkata', 'darjeeling', 'gangtok',
  'shillong', 'cherrapunji', 'kaziranga', 'ladakh', 'leh', 'srinagar', 'gulmarg', 'pahalgam', 'kerala',
  'alleppey', 'munnar', 'kochi', 'wayanad', 'varkala', 'kovalam', 'ooty', 'kodaikanal', 'coorg', 'madikeri',
  'chikmagalur', 'hampi', 'gokarna', 'mysore', 'bengaluru', 'bangalore', 'pondicherry', 'puducherry',
  'kanyakumari', 'rameshwaram', 'madurai', 'hyderabad', 'chennai', 'ahmedabad', 'rann of kutch', 'puri',
  'konark', 'bhubaneswar', 'indore', 'ujjain', 'bhopal', 'khajuraho', 'gwalior', 'ayodhya', 'mathura',
  'andaman', 'havelock', 'port blair', 'lakshadweep', 'agatti', 'diu', 'daman', 'kalimpong', 'tawang',
  'dandeli', 'thekkady', 'tarapith', 'sunderbans', 'jim corbett', 'corbett', 'ranikhet', 'lansdowne',
  'chamba', 'khajjiar', 'pachmarhi', 'bhedaghat', 'mandawa', 'chittorgarh', 'ranthambore', 'sariska',
  'tirupati', 'vijayawada', 'visakhapatnam', 'vizag', 'hampi', 'badami', 'pattadakal', 'belur', 'halebidu'
];

function isIndianDestination(text) {
  const lower = (text || '').toLowerCase();
  if (
    lower.includes('india') || lower.includes('maharashtra') || lower.includes('rajasthan') ||
    lower.includes('himachal') || lower.includes('kerala') || lower.includes('karnataka') ||
    lower.includes('tamil nadu') || lower.includes('uttarakhand') || lower.includes('uttar pradesh') ||
    lower.includes('gujarat') || lower.includes('bengal') || lower.includes('punjab') ||
    lower.includes('kashmir') || lower.includes('jammu') || lower.includes('assam') ||
    lower.includes('sikkim') || lower.includes('meghalaya') || lower.includes('odisha') ||
    lower.includes('madhya pradesh') || lower.includes('andhra') || lower.includes('telangana')
  ) {
    return true;
  }
  return INDIA_GEOGRAPHIC_KEYWORDS.some((kw) => lower.includes(kw));
}

function getOrCreateCity(rawDestination) {
  const clean = (rawDestination || '').trim();
  if (!clean) return null;

  // 1. Try exact or partial match in existing DB
  let cityRow = db.prepare('SELECT * FROM cities WHERE LOWER(name) = ? OR LOWER(name) LIKE ? LIMIT 1')
    .get(clean.toLowerCase(), `%${clean.toLowerCase()}%`);

  if (cityRow) return mapCity(cityRow);

  // 2. Check rich destination knowledge brain
  const brainKey = Object.keys(DETAILED_DESTINATION_BRAIN).find((k) => clean.toLowerCase().includes(k) || k.includes(clean.toLowerCase()));
  const brainProfile = brainKey ? DETAILED_DESTINATION_BRAIN[brainKey] : null;

  const isIndia = isIndianDestination(clean);

  const finalName = brainProfile ? brainProfile.name : (clean.charAt(0).toUpperCase() + clean.slice(1));
  const finalCountry = brainProfile ? brainProfile.country : (isIndia ? 'India' : 'International');
  const finalRegion = brainProfile ? brainProfile.region : (isIndia ? 'India (Domestic)' : 'Global');
  const finalCostIndex = brainProfile ? brainProfile.costIndex : (isIndia ? 28 : 75);
  const finalPopularity = brainProfile ? brainProfile.popularity : 92;
  const finalDesc = brainProfile ? `Famous travel destination celebrated for stunning scenery, unique culture, and historic landmarks.` : `Vibrant destination offering rich local culture, scenic viewpoints, and memorable experiences in ${finalCountry}.`;

  const newCityId = uuidv4();
  db.prepare(`
    INSERT INTO cities (id, name, country, region, cost_index, popularity, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(newCityId, finalName, finalCountry, finalRegion, finalCostIndex, finalPopularity, finalDesc);

  // 3. Populate Places for this destination
  const insertPlace = db.prepare(`
    INSERT INTO places (id, city_id, name, category, rating, reviews_count, cost, duration, best_time, description, image_url, address, insider_tip, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  if (brainProfile && brainProfile.places && brainProfile.places.length > 0) {
    brainProfile.places.forEach((p) => {
      insertPlace.run(
        uuidv4(),
        newCityId,
        p.name,
        p.category,
        p.rating,
        2800,
        p.cost,
        p.duration,
        p.bestTime,
        p.description,
        p.imageUrl || brainProfile.coverPhoto || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
        `${finalName}, ${finalCountry}`,
        p.tip,
        'must-visit,top-rated,scenic'
      );
    });
  } else {
    // Generate intelligent default places for new destination with distinct thematic photos
    const defaultDynamicPlaces = [
      { name: `${finalName} Historic Heritage & Old Quarter`, category: 'Cultural', rating: 4.8, cost: isIndia ? 150 : 800, duration: 2.5, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80', tip: 'Start early around 8:30 AM for quiet photo opportunities before tour buses arrive.' },
      { name: `${finalName} Central Monument & Iconic Plaza`, category: 'Landmark', rating: 4.9, cost: isIndia ? 200 : 1200, duration: 2.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80', tip: 'Pre-book online tickets to bypass queues at the main entrance gate.' },
      { name: `${finalName} Culinary Safari & Local Street Market`, category: 'Food & Dining', rating: 4.9, cost: isIndia ? 400 : 1500, duration: 2.5, bestTime: 'Afternoon', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', tip: 'Ask local vendors for the signature regional dish and freshly prepared specialty snacks.' },
      { name: `${finalName} Panoramic Sunset Viewpoint & Ridge`, category: 'Landmark', rating: 4.8, cost: 0, duration: 2.0, bestTime: 'Sunset', imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&q=80', tip: 'Arrive 45 minutes prior to golden hour for spectacular uninterrupted sunset vistas.' },
      { name: `${finalName} Nature Sanctuary & Forest Trail`, category: 'Nature & Outdoors', rating: 4.7, cost: isIndia ? 100 : 600, duration: 3.0, bestTime: 'Morning', imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80', tip: 'Wear comfortable walking shoes and carry an eco-friendly water bottle.' },
      { name: `${finalName} Twilight Promenade & Waterfront Walk`, category: 'Leisure', rating: 4.8, cost: 0, duration: 2.5, bestTime: 'Evening', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', tip: 'Stroll along the central illuminated promenade enjoying live music and street desserts.' }
    ];

    defaultDynamicPlaces.forEach((p) => {
      insertPlace.run(
        uuidv4(),
        newCityId,
        p.name,
        p.category,
        p.rating,
        1500,
        p.cost,
        p.duration,
        p.bestTime,
        `Explore ${p.name} for an authentic and memorable experience in ${finalName}, ${finalCountry}.`,
        p.imageUrl,
        `${finalName} Center, ${finalCountry}`,
        p.tip,
        'explore,travel,mustsee'
      );
    });
  }

  return mapCity(db.prepare('SELECT * FROM cities WHERE id = ?').get(newCityId));
}

// POST /api/planner/generate
router.post('/generate', (req, res) => {
  try {
    const {
      destination,
      destinationId,
      startDate,
      endDate,
      pace = 'balanced',
      budgetTier = 'moderate',
      groupType = 'solo',
      interests = [],
      refinementPrompt = ''
    } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required.' });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date.' });
    }

    // Resolve City dynamically using our rich geo brain
    let city = null;
    if (destinationId) {
      const row = db.prepare('SELECT * FROM cities WHERE id = ?').get(destinationId);
      if (row) city = mapCity(row);
    }
    if (!city && destination) {
      city = getOrCreateCity(destination);
    }
    if (!city) {
      city = mapCity(db.prepare('SELECT * FROM cities ORDER BY popularity DESC LIMIT 1').get());
    }

    const totalDays = calculateDays(startDate, endDate);

    // Look up brain profile metadata if available
    const brainKey = Object.keys(DETAILED_DESTINATION_BRAIN).find((k) => city.name.toLowerCase().includes(k) || k.includes(city.name.toLowerCase()));
    const brainProfile = brainKey ? DETAILED_DESTINATION_BRAIN[brainKey] : null;

    // Fetch places in this city
    const placeRows = db.prepare('SELECT * FROM places WHERE city_id = ? ORDER BY rating DESC, reviews_count DESC').all(city.id);
    let places = placeRows.map(mapPlace);

    // Number of activities per day based on pace
    let activitiesPerDay = 3;
    if (pace === 'relaxed') activitiesPerDay = 2;
    if (pace === 'fast') activitiesPerDay = 4;

    // Time slot blueprints with AI agent reasoning
    const timeSlots = [
      {
        slot: 'Morning',
        time: '09:00 AM - 11:30 AM',
        focus: ['Landmark', 'Cultural', 'Nature & Outdoors'],
        reasoning: 'Morning visit leverages cooler ambient mountain/coastal breeze and avoids peak tour groups.'
      },
      {
        slot: 'Afternoon',
        time: '01:00 PM - 03:30 PM',
        focus: ['Cultural', 'Food & Dining', 'Museum', 'Adventure'],
        reasoning: 'Midday schedule clusters authentic food tasting and shaded/cultural exploration.'
      },
      {
        slot: 'Late Afternoon / Sunset',
        time: '04:30 PM - 06:30 PM',
        focus: ['Landmark', 'Leisure', 'Nature & Outdoors'],
        reasoning: 'Timed precisely for golden hour photography, scenic valley vistas, and sunset colors.'
      },
      {
        slot: 'Evening / Night',
        time: '07:30 PM - 10:00 PM',
        focus: ['Food & Dining', 'Leisure', 'Nightlife', 'Cultural'],
        reasoning: 'Evenings are reserved for lively local bazaars, heritage cultural shows, and regional dinner feasts.'
      }
    ];

    const dayThemes = [
      { title: 'Historic Majesty & Foundational Highlights', focusDesc: `Discover iconic signature landmarks and heritage sights of ${city.name}.` },
      { title: 'Cultural Immersion & Authentic Gastronomy', focusDesc: `Deep dive into local food traditions, vibrant bazaars, and artisanal specialties.` },
      { title: 'Panoramic Viewpoints, Nature & Sunset Magic', focusDesc: `Scenic valley lookouts, serene water spots, and golden sunset vistas.` },
      { title: 'Hidden Trails & Local Village Life', focusDesc: `Venture beyond typical tourist spots into peaceful nature walks and cozy local spots.` },
      { title: 'Outdoor Adventure & High Point Vistas', focusDesc: `High mountain treks, lush valleys, and exhilarating natural highlights.` },
      { title: 'Art, Architecture & Twilight Entertainment', focusDesc: `Masterpiece heritage monuments, evening lights, and traditional cultural performances.` },
      { title: 'Grand Finale & Souvenir Trail', focusDesc: `Revisit favorite viewpoints, enjoy a celebratory dinner, and shop authentic handicrafts.` }
    ];

    // Curated Nearby Points Knowledge Map
    const NEARBY_POINTS_MAP = {
      // Matheran
      'charlotte lake & louisa point': [
        { name: 'Louisa Point Cliff', distance: '650m (10 min scenic walk)', type: 'Panoramic View' },
        { name: 'Lord Point Lookout', distance: '400m walk', type: 'Viewpoint' },
        { name: 'Pisarnath Temple', distance: '250m forest path', type: 'Spiritual' },
        { name: 'Lake Forest Tea Stall', distance: '100m', type: 'Refreshment' }
      ],
      'panorama point 360° sunrise lookout': [
        { name: 'Garbett Point Plateau', distance: '2.2 km ridge trek', type: 'Adventure Trek' },
        { name: 'Rambagh Forest Trail', distance: '850m nature path', type: 'Forest Walk' },
        { name: 'Sunrise Vantage Perch', distance: '150m walk', type: 'Photo Spot' }
      ],
      'neral-matheran heritage toy train & market walk': [
        { name: 'Matheran Mall Road Bazaar', distance: '50m walk', type: 'Shopping & Snacks' },
        { name: 'Kasturba Gandhi Library', distance: '300m walk', type: 'Heritage' },
        { name: 'Aman Lodge Rail Link', distance: '3.2 km scenic track', type: 'Transit Point' }
      ],
      'echo point & honeymoon hill vistas': [
        { name: 'King George Point', distance: '450m walk', type: 'Lookout' },
        { name: 'Honeymoon Hill Ridge', distance: '300m walk', type: 'Scenic Spot' },
        { name: 'Edward Point Lookout', distance: '600m trail', type: 'Viewpoint' }
      ],
      'porcupine point (sunset point)': [
        { name: 'Prabalgad Fort View', distance: 'Directly opposite canyon', type: 'Monument View' },
        { name: 'Malet Spring & Stream', distance: '700m walk', type: 'Nature' },
        { name: 'Coronation Point', distance: '1.1 km trail', type: 'Viewpoint' }
      ],
      'rambagh point & alexander point trail': [
        { name: 'Alexander Point', distance: '550m trail', type: 'Lookout' },
        { name: 'One Tree Hill Base', distance: '1.8 km trek', type: 'Adventure' },
        { name: 'Olympia Race Course', distance: '900m walk', type: 'Historical' }
      ],
      // Lonavala
      'tiger’s leap & lion’s point sunset': [
        { name: 'Lion’s Point Perch', distance: '400m walk', type: 'Viewpoint' },
        { name: 'Shivling Point', distance: '350m walk', type: 'Lookout' },
        { name: 'Tiger Corner Garam Chai Stalls', distance: '100m', type: 'Food & Tea' }
      ],
      'karla & bhaja ancient buddhist caves': [
        { name: 'Ekvira Devi Temple', distance: 'On-site steps', type: 'Spiritual' },
        { name: 'Bhaja Caves & Waterfall', distance: '7.5 km drive', type: 'Ancient Caves' },
        { name: 'Indrayani River Valley', distance: '1.2 km', type: 'Valley View' }
      ],
      'bhushi dam & water cascades': [
        { name: 'INS Shivaji Naval Campus', distance: '2.1 km', type: 'Landmark' },
        { name: 'Lonavala Lake & Promenade', distance: '3.8 km', type: 'Waterfront' },
        { name: 'Tiger Point Uphill', distance: '4.5 km scenic drive', type: 'Viewpoint' }
      ],
      // Mahabaleshwar
      'arthur’s seat queen of points': [
        { name: 'Window Point', distance: '200m walk', type: 'Viewpoint' },
        { name: 'Tiger Spring Natural Fountain', distance: '350m path', type: 'Nature' },
        { name: 'Hunter Point', distance: '400m trail', type: 'Lookout' },
        { name: 'Malcolm Point', distance: '500m walk', type: 'Scenic Spot' }
      ],
      'venna lake boating & horse riding': [
        { name: 'Mahabaleshwar Club & Links', distance: '1.8 km', type: 'Heritage' },
        { name: 'Lakeside Horse Riding Ring', distance: 'On-site', type: 'Activity' },
        { name: 'Lingmala Waterfall Trail', distance: '5.2 km drive', type: 'Waterfall' }
      ],
      'mapro garden & strawberry estate': [
        { name: 'Mapro Chocolate Processing Room', distance: 'On-site', type: 'Culinary' },
        { name: 'Panchgani Main Bazaar', distance: '6.5 km drive', type: 'Shopping' },
        { name: 'Sydney Point Plateau', distance: '7.8 km', type: 'Viewpoint' }
      ],
      // Jaipur
      'amber fort & sheesh mahal': [
        { name: 'Jaigarh Fort & Jaivana Cannon', distance: '1.1 km secret tunnel / road', type: 'Fort' },
        { name: 'Panna Meena Ka Kund Stepwell', distance: '650m walk', type: 'Heritage Stepwell' },
        { name: 'Anokhi Museum of Hand Printing', distance: '900m walk', type: 'Museum' },
        { name: 'Maota Lake Promenade', distance: 'At fort base', type: 'Lake View' }
      ],
      'hawa mahal (palace of winds)': [
        { name: 'Jantar Mantar UNESCO Observatory', distance: '450m walk', type: 'UNESCO Monument' },
        { name: 'City Palace Main Courtyard', distance: '600m walk', type: 'Royal Palace' },
        { name: 'Johari Bazaar Gems & Jewellery', distance: '300m walk', type: 'Bazaar' },
        { name: 'Wind View Rooftop Cafe', distance: '50m across street', type: 'Photo & Coffee' }
      ],
      // Goa
      'baga & calangute beach watersports': [
        { name: 'Calangute Beach Promenade', distance: '1.2 km coastal stroll', type: 'Beach Walk' },
        { name: 'Tito’s Famous Nightlife Lane', distance: '250m walk', type: 'Nightlife' },
        { name: 'Britto’s Beach Shack', distance: '300m on sands', type: 'Seafood Dining' }
      ],
      // Varanasi
      'dashashwamedh ghat evening ganga aarti': [
        { name: 'Man Mandir Observatory Palace', distance: '350m along ghats', type: 'Heritage' },
        { name: 'Kashi Vishwanath Corridor River Gate', distance: '400m walk', type: 'Spiritual Corridor' },
        { name: 'Godowlia Market & Chaat Corner', distance: '500m walk', type: 'Street Food' }
      ],
      // Manali
      'solang valley adventure & paragliding': [
        { name: 'Anjani Mahadev Waterfall Trek', distance: '1.8 km nature walk', type: 'Trek & Waterfall' },
        { name: 'Solang High Mountain Ropeway', distance: 'On-site terminal', type: 'Cable Car' },
        { name: 'Gulaba Snow Lookout', distance: '6.5 km drive', type: 'Snow View' }
      ],
      // Rishikesh
      'triveni ghat evening maha ganga aarti': [
        { name: 'Ganga Maha Aarti Platform', distance: 'On-site ghat steps', type: 'Spiritual' },
        { name: 'Bharat Mandir (Ancient Temple)', distance: '700m walk', type: 'Temple' },
        { name: 'Rishikesh Main Bazaar', distance: '400m walk', type: 'Shopping' }
      ],
      'white water river rafting in ganga': [
        { name: 'Shivpuri River Beach', distance: 'Launch point', type: 'River Camp' },
        { name: 'Cliff Jumping Rock', distance: 'Midway on river', type: 'Adventure' },
        { name: 'Nim Beach Pull-Out Point', distance: 'End of rapid run', type: 'Riverfront' }
      ]
    };

    function getNearbyPointsForPlace(placeObj, currentCity) {
      const key = (placeObj.name || '').toLowerCase().trim();
      if (NEARBY_POINTS_MAP[key]) return NEARBY_POINTS_MAP[key];

      // Match partial keys
      const matchedKey = Object.keys(NEARBY_POINTS_MAP).find((k) => key.includes(k) || k.includes(key));
      if (matchedKey) return NEARBY_POINTS_MAP[matchedKey];

      // Dynamically generate intelligent nearby points
      const pCat = placeObj.category || 'Sightseeing';
      if (pCat === 'Cultural' || pCat === 'Landmark') {
        return [
          { name: `${currentCity.name} Heritage Old Town Quarter`, distance: '400m walk', type: 'Heritage Walk' },
          { name: `${currentCity.name} Local Artisan Bazaar`, distance: '650m walk', type: 'Shopping' },
          { name: 'Rooftop Panoramic Viewpoint Cafe', distance: '300m', type: 'Food & Views' }
        ];
      } else if (pCat === 'Nature & Outdoors' || pCat === 'Adventure') {
        return [
          { name: 'Scenic Valley Ridge Lookout', distance: '500m trail', type: 'Viewpoint' },
          { name: 'Forest Pine Nature Pathway', distance: '350m walk', type: 'Nature Walk' },
          { name: 'Fresh Mountain Tea & Snack Stall', distance: '150m', type: 'Refreshment' }
        ];
      } else {
        return [
          { name: `${currentCity.name} Central Plaza & Promenade`, distance: '300m walk', type: 'Leisure' },
          { name: 'Sunset Golden Hour Vantage Point', distance: '600m walk', type: 'Sunset Spot' },
          { name: 'Traditional Culinary Tasting Lane', distance: '250m', type: 'Food Trail' }
        ];
      }
    }

    function getTimingForSlot(slotName) {
      if (slotName.includes('Morning')) return '06:00 AM – 12:30 PM (Daily)';
      if (slotName.includes('Afternoon')) return '10:00 AM – 06:00 PM (Daily)';
      if (slotName.includes('Golden') || slotName.includes('Sunset')) return '05:00 PM – 07:30 PM (Sunset)';
      return '06:00 PM – 10:30 PM (Evening)';
    }

    function getTransitDetail(placeObj, currentCity) {
      if (currentCity.name.toLowerCase().includes('matheran')) {
        return 'Pedestrian nature trail (5-15 min walk) or horseback ride. Automobiles are banned in Matheran.';
      }
      const pCat = placeObj.category || 'Sightseeing';
      if (pCat === 'Nature & Outdoors' || pCat === 'Adventure') {
        return 'Scenic nature footpath or short 5-10 min local auto/taxi ride from main city center.';
      }
      return 'Conveniently accessible by walking, local auto-rickshaw, or ride-share cabs right to the entrance gate.';
    }

    function getBestPhotoSpot(placeObj) {
      if (placeObj.category === 'Landmark') return 'Main entrance plaza or elevated west-facing balcony during golden hour.';
      if (placeObj.category === 'Nature & Outdoors') return 'Cliff edge safety railing facing the sunrise or sunset valley direction.';
      if (placeObj.category === 'Cultural') return 'Central courtyard archway capturing symmetry and architectural details.';
      return 'Front-facing outdoor terrace with ambient lighting.';
    }

    const scheduleDays = [];
    const usedPlaceIds = new Set();
    let totalEstimatedCost = 0;
    const isDomesticIndia = city.country.toLowerCase() === 'india' || city.region.toLowerCase().includes('india');

    for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
      const currentDate = getDateString(startDate, dayIndex);
      const themeConfig = dayThemes[dayIndex % dayThemes.length];
      const daySlots = [];
      let dayCost = 0;

      const activeSlotsCount = Math.min(activitiesPerDay, timeSlots.length);

      for (let sIdx = 0; sIdx < activeSlotsCount; sIdx++) {
        const slotConfig = timeSlots[sIdx];

        // Find best place for this slot
        let chosenPlace = places.find((p) => !usedPlaceIds.has(p.id) && slotConfig.focus.includes(p.category));
        if (!chosenPlace) chosenPlace = places.find((p) => !usedPlaceIds.has(p.id));
        if (!chosenPlace && places.length > 0) chosenPlace = places[(dayIndex * activeSlotsCount + sIdx) % places.length];

        if (chosenPlace) {
          usedPlaceIds.add(chosenPlace.id);
          const itemCost = Number(chosenPlace.cost || 0);
          dayCost += itemCost;

          const nearbyPoints = getNearbyPointsForPlace(chosenPlace, city);

          daySlots.push({
            id: uuidv4(),
            placeId: chosenPlace.id,
            name: chosenPlace.name,
            slot: slotConfig.slot,
            time: slotConfig.time.split(' - ')[0],
            timeRange: slotConfig.time,
            duration: chosenPlace.duration || 2,
            category: chosenPlace.category,
            rating: chosenPlace.rating,
            cost: itemCost,
            description: chosenPlace.description,
            imageUrl: chosenPlace.imageUrl || (brainProfile ? brainProfile.coverPhoto : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80'),
            address: chosenPlace.address || `${city.name}, ${city.country}`,
            insiderTip: chosenPlace.insiderTip || 'Carry cash, comfortable walking footwear, and confirm opening hours.',
            agentReasoning: slotConfig.reasoning,
            nearbyPointsToVisit: nearbyPoints,
            openingHours: getTimingForSlot(slotConfig.slot),
            transitDetail: getTransitDetail(chosenPlace, city),
            bestPhotoSpot: getBestPhotoSpot(chosenPlace),
            latitude: chosenPlace.latitude || undefined,
            longitude: chosenPlace.longitude || undefined,
            tags: chosenPlace.tags || ['top-rated', 'recommended']
          });
        }
      }

      // Meal & transport estimate in Indian Rupees (₹)
      let estMealCost = 0;
      let estTransportCost = 0;
      let dailyStayCost = 0;

      if (isDomesticIndia) {
        if (budgetTier === 'luxury') {
          estMealCost = 3500;
          estTransportCost = 1200;
          dailyStayCost = 9500;
        } else if (budgetTier === 'budget') {
          estMealCost = 500;
          estTransportCost = 250;
          dailyStayCost = 1200;
        } else {
          // Moderate
          estMealCost = 1200;
          estTransportCost = 500;
          dailyStayCost = 3200;
        }
      } else {
        // International in INR
        if (budgetTier === 'luxury') {
          estMealCost = 8000;
          estTransportCost = 3000;
          dailyStayCost = 22000;
        } else if (budgetTier === 'budget') {
          estMealCost = 1800;
          estTransportCost = 1000;
          dailyStayCost = 4500;
        } else {
          estMealCost = 3500;
          estTransportCost = 1800;
          dailyStayCost = 9000;
        }
      }

      dayCost += estMealCost + estTransportCost;
      totalEstimatedCost += dayCost;

      scheduleDays.push({
        dayNumber: dayIndex + 1,
        date: currentDate,
        themeTitle: `Day ${dayIndex + 1}: ${themeConfig.title}`,
        themeDescription: themeConfig.focusDesc,
        city: city.name,
        country: city.country,
        estimatedDayCost: Math.round(dayCost),
        suggestedMeals: {
          lunch: brainProfile ? `Authentic lunch tasting near ${daySlots[0]?.name || city.name}` : `Top-rated regional dining near ${daySlots[0]?.name || 'City Center'}`,
          dinner: brainProfile?.foodTips || `Traditional evening culinary feast and local street specialties in ${city.name}`
        },
        transitAdvice: brainProfile?.transitStrategy || (isDomesticIndia
          ? 'Auto-rickshaws, app cabs, or scenic walking pathways provide convenient transit between sights.'
          : 'Day passes on public metro/buses or walkable routes are recommended.'),
        activities: daySlots
      });
    }

    // Total budget in INR (₹) including hotel stay
    const stayDaily = isDomesticIndia
      ? (budgetTier === 'luxury' ? 9500 : (budgetTier === 'budget' ? 1200 : 3200))
      : (budgetTier === 'luxury' ? 22000 : (budgetTier === 'budget' ? 4500 : 9000));

    const totalSuggestedBudget = Math.round(totalEstimatedCost + (stayDaily * totalDays));

    // Advanced Group Type Intelligence
    let groupOptimizationNote = '';
    if (groupType === 'solo') {
      groupOptimizationNote = 'Solo Traveler Mode: Prioritizes social cafes, scenic walking trails, hostel hubs, and safety-verified routes.';
    } else if (groupType === 'couple') {
      groupOptimizationNote = 'Couples / Honeymoon Mode: Includes scenic sunset viewpoints, lakeside boat rides, and romantic rooftop dining.';
    } else if (groupType === 'family') {
      groupOptimizationNote = 'Family & Kids Mode: Features easy-access parks, heritage monuments with minimal walking strain, and family dining.';
    } else {
      groupOptimizationNote = 'Friends & Group Mode: Packed with adventure sports, bustling night markets, and vibrant local activities.';
    }

    const aiAgentInsights = {
      executiveSummary: `Our AI Agent analyzed ${city.name} (${city.country}) across ${totalDays} days with a ${pace} pace and ${budgetTier} budget profile. The algorithm clusters geographically adjacent sights to eliminate transit fatigue while ensuring peak lighting at sunrise, daytime, and golden hour sunset.`,
      groupStrategyNote: groupOptimizationNote,
      crowdAvoidanceTip: `Arrive at popular landmarks (such as ${scheduleDays[0]?.activities[0]?.name || city.name}) before 9:00 AM to bypass peak tour bus crowds and capture uncrowded photos.`,
      weatherSeasonTip: brainProfile?.climateAdvice || (isDomesticIndia
        ? 'Best travel window is October through April for pleasant temperatures, clear mountain/coastal views, and festive energy.'
        : 'Pack weather-appropriate clothing layers, comfortable walking shoes, and universal power adapters.'),
      budgetEfficiencyRating: '99.2% Route & Spend Optimized',
      agentOptimizationScore: 9.9
    };

    const generatedPlan = {
      tripName: `${city.name} ${totalDays}-Day AI Master Itinerary`,
      destination: city,
      startDate,
      endDate,
      totalDays,
      pace,
      budgetTier,
      groupType,
      interests,
      aiAgentInsights,
      coverPhoto: brainProfile?.coverPhoto || places[0]?.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
      estimatedBudget: totalSuggestedBudget,
      dailyBreakdownAvg: Math.round(totalSuggestedBudget / totalDays),
      days: scheduleDays,
      travelTips: [
        `Early morning visits (before 9:30 AM) provide the clearest views and uncrowded photo opportunities.`,
        `Keep local currency cash on hand for street food vendors and small local entry tickets.`,
        `Always stay hydrated and wear comfortable walking shoes on nature and heritage trails.`
      ]
    };

    return res.json(generatedPlan);
  } catch (err) {
    console.error('Error in AI planner generation:', err);
    return res.status(500).json({ message: 'Failed to generate AI trip plan.' });
  }
});

// POST /api/planner/save
router.post('/save', authMiddleware, (req, res) => {
  try {
    const {
      tripName,
      startDate,
      endDate,
      description,
      coverPhoto,
      budget,
      destinationId,
      days
    } = req.body;

    if (!tripName || !startDate || !endDate || !Array.isArray(days)) {
      return res.status(400).json({ message: 'Incomplete trip plan data for saving.' });
    }

    // Resolve targetCityId to a valid SQLite cities(id) foreign key
    let targetCityId = typeof destinationId === 'string' ? destinationId : (destinationId?.id || '');
    let cityRow = targetCityId ? db.prepare('SELECT * FROM cities WHERE id = ?').get(targetCityId) : null;
    
    if (!cityRow) {
      const cityName = (typeof destinationId === 'object' && destinationId?.name) 
        ? destinationId.name 
        : (typeof destinationId === 'string' ? destinationId : tripName.replace(/\s*\d+-Day.*$/, '').replace(/AI Master Itinerary/i, '').trim());
      const createdCity = getOrCreateCity(cityName || 'India');
      targetCityId = createdCity.id;
    }

    const tripId = uuidv4();
    const shareId = uuidv4();
    const stopId = uuidv4();
    const createdAt = new Date().toISOString();

    const saveTxn = db.transaction(() => {
      // 1. Insert Trip
      db.prepare(`
        INSERT INTO trips (id, user_id, name, start_date, end_date, description, cover_photo, budget, is_public, share_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
      `).run(
        tripId,
        req.userId,
        tripName,
        startDate,
        endDate,
        description || `Auto-planned by AI Travel Agent for ${days.length} days.`,
        coverPhoto || null,
        budget ? Number(budget) : null,
        shareId,
        createdAt
      );

      // 2. Insert Main Stop
      db.prepare(`
        INSERT INTO stops (id, trip_id, city_id, start_date, end_date, stop_order)
        VALUES (?, ?, ?, ?, ?, 0)
      `).run(stopId, tripId, targetCityId, startDate, endDate);

      // 3. Insert Activities for each day
      let globalOrder = 0;
      const insertAct = db.prepare(`
        INSERT INTO activities (id, stop_id, city_id, name, type, cost, duration, description, image_url, activity_date, start_time, activity_order, is_template)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `);

      days.forEach((day) => {
        if (Array.isArray(day.activities)) {
          day.activities.forEach((act) => {
            insertAct.run(
              uuidv4(),
              stopId,
              targetCityId,
              act.name,
              act.category || 'Sightseeing',
              Number(act.cost || 0),
              Number(act.duration || 2),
              act.description || '',
              act.imageUrl || '',
              day.date,
              act.time || '09:00 AM',
              globalOrder++
            );
          });
        }
      });
    });

    saveTxn();

    const createdTrip = db.prepare('SELECT * FROM trips WHERE id = ?').get(tripId);
    return res.status(201).json({
      message: 'Trip auto-planned and saved successfully!',
      trip: mapTrip(createdTrip)
    });
  } catch (err) {
    console.error('Error saving auto-planned trip:', err);
    return res.status(500).json({ message: 'Failed to save itinerary to database.' });
  }
});

// POST /api/planner/packing-list
router.post('/packing-list', (req, res) => {
  try {
    const { destinationName, daysCount = 3, activities = [] } = req.body;

    const baseEssentials = [
      { id: '1', item: 'Government ID / Driving License / Passport', category: 'Essentials' },
      { id: '2', item: 'Emergency Cash & Debit/Credit Cards', category: 'Essentials' },
      { id: '3', item: 'Mobile Charger & High Capacity Power Bank', category: 'Electronics' },
      { id: '4', item: 'Toiletry Kit (Sunscreen, Lip Balm, Toothbrush)', category: 'Toiletries' },
      { id: '5', item: 'Personal Medications & Travel First Aid Kit', category: 'Health' },
      { id: '6', item: 'Comfortable Trekking / Walking Shoes', category: 'Clothing' },
      { id: '7', item: `${daysCount + 1}x Changes of Outfits & Breathable Cotton Wear`, category: 'Clothing' },
      { id: '8', item: 'Light Jacket / Windbreaker for Hill Stations or Evenings', category: 'Clothing' }
    ];

    const activitySpecific = [];

    const activityTypes = (activities || []).map((a) => (a.type || a.category || '').toLowerCase());
    const hasNatureOrHike = activityTypes.some((t) => t.includes('adventure') || t.includes('nature') || t.includes('hike'));
    const hasWaterOrBeach = activityTypes.some((t) => t.includes('beach') || t.includes('cruise') || t.includes('boat') || t.includes('water') || t.includes('lake'));

    if (hasNatureOrHike) {
      activitySpecific.push(
        { id: 'a1', item: 'Sturdy Grippy Hiking Shoes / Boots', category: 'Activity Gear' },
        { id: 'a2', item: 'Lightweight Daypack with Refillable Water Bottle', category: 'Activity Gear' },
        { id: 'a3', item: 'Mosquito / Insect Repellent Cream', category: 'Health' }
      );
    }

    if (hasWaterOrBeach) {
      activitySpecific.push(
        { id: 'a4', item: 'Quick-dry Microfiber Towel & Swimwear', category: 'Activity Gear' },
        { id: 'a5', item: 'Waterproof Phone Pouch', category: 'Electronics' },
        { id: 'a6', item: 'Polarized Sunglasses & Wide Brim Sun Hat', category: 'Clothing' }
      );
    }

    return res.json({
      destination: destinationName || 'Your Trip',
      totalItems: baseEssentials.length + activitySpecific.length,
      items: [...baseEssentials, ...activitySpecific]
    });
  } catch (err) {
    console.error('Error creating packing list:', err);
    return res.status(500).json({ message: 'Could not generate packing list.' });
  }
});

module.exports = router;
module.exports.getOrCreateCity = getOrCreateCity;
module.exports.DETAILED_DESTINATION_BRAIN = DETAILED_DESTINATION_BRAIN;
