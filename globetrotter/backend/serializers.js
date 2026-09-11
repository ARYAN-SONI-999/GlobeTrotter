// Maps raw SQLite rows (snake_case columns) to the camelCase JSON shape the
// frontend expects.

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    language: row.language,
    photoUrl: row.photo_url || null,
    isAdmin: !!row.is_admin,
    createdAt: row.created_at
  };
}

function mapCity(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    region: row.region || 'Other',
    costIndex: row.cost_index,
    popularity: row.popularity,
    description: row.description || ''
  };
}

function mapTrip(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
    coverPhoto: row.cover_photo,
    budget: row.budget || null,
    isPublic: !!row.is_public,
    shareId: row.share_id,
    createdAt: row.created_at
  };
}

function mapStop(row) {
  if (!row) return null;
  return {
    id: row.id,
    tripId: row.trip_id,
    cityId: row.city_id,
    startDate: row.start_date,
    endDate: row.end_date,
    order: row.stop_order
  };
}

function mapActivity(row) {
  if (!row) return null;
  return {
    id: row.id,
    stopId: row.stop_id,
    cityId: row.city_id,
    cityName: row.cityName || row.city_name || '',
    cityCountry: row.cityCountry || row.city_country || '',
    name: row.name,
    type: row.type,
    cost: row.cost,
    duration: row.duration,
    description: row.description,
    imageUrl: row.image_url || '',
    activityDate: row.activity_date || null,
    startTime: row.start_time || null,
    activityOrder: row.activity_order || 0,
    isTemplate: !!row.is_template
  };
}

function mapPlace(row) {
  if (!row) return null;
  return {
    id: row.id,
    cityId: row.city_id,
    name: row.name,
    category: row.category || 'Landmark',
    rating: row.rating ? Number(row.rating) : 4.5,
    reviewsCount: row.reviews_count ? Number(row.reviews_count) : 100,
    cost: row.cost ? Number(row.cost) : 0,
    duration: row.duration ? Number(row.duration) : 2,
    bestTime: row.best_time || 'Morning',
    description: row.description || '',
    imageUrl: row.image_url || '',
    address: row.address || '',
    insiderTip: row.insider_tip || '',
    tags: row.tags ? (typeof row.tags === 'string' ? row.tags.split(',') : row.tags) : []
  };
}

function mapSavedDestination(row, city) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    cityId: row.city_id,
    savedAt: row.saved_at,
    city: city || null
  };
}

module.exports = { mapUser, mapCity, mapTrip, mapStop, mapActivity, mapSavedDestination, mapPlace };

