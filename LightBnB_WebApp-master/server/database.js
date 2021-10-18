
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});



//const properties = require('./json/properties.json');
//const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  let user = pool
    .query(`SELECT * FROM users WHERE email = $1 LIMIT 1;`, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch(() => {
      return null;
    });
  return Promise.resolve(user);
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  let user = pool
    .query(`SELECT * FROM users WHERE id = $1 LIMIT 1;`, [id])
    .then((result) => {
      return result.rows[0];
    })
    .catch(() => {
      return null;
    });
  return Promise.resolve(user);
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const values = [user.name, user.email, user.password];
  pool
  .query(`INSERT INTO users (name, email, password) 
  VALUES ($1, $2, $3) RETURNING *`, values)
  .then (() => {
    console.log(`added user to DB: ${user.name}`)
  })
  .catch((error) => {
    console.log(error);
  })
  return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getFulfilledReservations = function(guest_id, limit = 10) {
  let values = [guest_id, limit];
  let reservations = pool
    .query(`
    SELECT properties.*, reservations.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id 
    WHERE reservations.guest_id = $1
    AND reservations.start_date <= now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;`, values)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
  return Promise.resolve(reservations);
}
exports.getFulfilledReservations = getFulfilledReservations;

const getUpcomingReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.start_date > now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  const params = [guest_id, limit];
  return pool.query(queryString, params)
    .then(res => res.rows);
}

exports.getUpcomingReservations = getUpcomingReservations;

const getIndividualReservation = function(reservationId) {
  const queryString = `SELECT * FROM reservations WHERE reservations.id = $1`;
  return pool.query(queryString, [reservationId])
    .then(res => res.rows[0]);
}

exports.getIndividualReservation = getIndividualReservation;

const addReservation = function(reservation) {
  /*
   * Adds a reservation from a specific user to the database
   */
  console.log(`start date: ${reservation.start_date},
    end date: ${reservation.end_date},
    property id: ${reservation.property_id},
    guest id: ${reservation.guest_id}
  `);
  return pool.query(`
    INSERT INTO reservations (start_date, end_date, property_id, guest_id)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `, [reservation.start_date, reservation.end_date, reservation.property_id, reservation.guest_id])
  .then(res => res.rows[0])
}

exports.addReservation = addReservation;

const updateReservation = function (reservationData) {
  // base string
  let queryString = `UPDATE reservations SET `;
  const queryParams = [];
  if (reservationData.start_date) {
    queryParams.push(reservationData.start_date);
    queryString += `start_date = $1`;
    if (reservationData.end_date) {
      queryParams.push(reservationData.end_date);
      queryString += `, end_date = $2`;
    }
  } else {
    queryParams.push(reservationData.end_date);
    queryString += `end_date = $1`;
  }
  queryString += ` WHERE id = $${queryParams.length + 1} RETURNING *;`
  queryParams.push(reservationData.reservation_id);
  console.log(queryString);
  return pool.query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(err => console.error(err));
}

exports.updateReservation = updateReservation;

//
//  Deletes an existing reservation
//
const deleteReservation = function(reservationId) {
  const queryParams = [reservationId];
  const queryString = `DELETE FROM reservations WHERE id = $1;`;
  console.log(queryString);
  return pool.query(queryString, queryParams)
    .then(() => console.log("Successfully deleted!"))
    .catch((err) => console.error(err));
}

exports.deleteReservation = deleteReservation;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  /* options object might look like this:
  {
    city,
    owner_id,
    minimum_price_per_night,
    maximum_price_per_night,
    minimum_rating;
  }
  */

  /* Prepare query with parameters */
  const queryParams = [];

  /* 1. Add city param */
  if (options.city) {
    queryParams.push(`%${options.city.toLowerCase()}%`);
  } else {
    queryParams.push(`%`);
  }

  /* 2. Add minimum_price_per_night param */
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
  } else {
    queryParams.push(0);
  }

  /* 3. Add maximum_price_per_night param */
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
  } else {
    queryParams.push(100000000); /* 100,000 dollars per night - inexistent price */
  }

  /* Initialize query string */

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating, count(property_reviews.rating) as review_count
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE LOWER(city) LIKE $1
  AND cost_per_night >= $2
  AND cost_per_night <= $3
  `

  /* 4. Add owner_id param */
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id = $4`;
  }
  else {
    queryParams.push(0);
    queryString += `AND owner_id > $4`;
  }

  /* 5. Add minimum_rating param */
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
  } else {
    queryParams.push(0);
  }
  queryString += `
  GROUP BY properties.id
  HAVING AVG(rating) >= $5
  `;
  
  /* 6. Add limit param */
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $6;
  `;

  /* Complete preparing the query */
  /*************************************/

  return pool
    .query(queryString, queryParams)
    .then((res) => {
      if (res.rows) {
        return res.rows;
      } else {
        console.log(`Sorry, no data found!`);
      }
    })
    .catch((err) => {
      console.log(err);
      //return null;
    });
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const values = [
    property.owner_id,
    property.title,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code
  ];
  pool.query(`INSERT INTO properties (
    owner_id,
    title,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms,
    country,
    street,
    city,
    province,
    post_code
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    ) RETURNING *;
  `, values)
  .then (() => {
    console.log(`added property: ${property.title}`);
  })
  .catch((err) => {
    console.log(err.name);
  });
  return Promise.resolve(property);
}
exports.addProperty = addProperty;

/*
 *  get reviews by property
 */
const getReviewsByProperty = function(propertyId) {
  const queryString = `
    SELECT property_reviews.id, property_reviews.rating AS review_rating, property_reviews.message AS review_text, 
    users.name, properties.title AS property_title, reservations.start_date, reservations.end_date
    FROM property_reviews
    JOIN reservations ON reservations.id = property_reviews.reservation_id  
    JOIN properties ON properties.id = property_reviews.property_id
    JOIN users ON users.id = property_reviews.guest_id
    WHERE properties.id = $1
    ORDER BY reservations.start_date ASC;
  `
  const queryParams = [propertyId];
  return pool.query(queryString, queryParams).then(res => res.rows)
}

exports.getReviewsByProperty = getReviewsByProperty;
