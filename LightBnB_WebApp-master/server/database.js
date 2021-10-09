
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
const getAllReservations = function(guest_id, limit = 10) {
  let values = [guest_id, limit];
  let reservations = pool
    .query(`SELECT * FROM reservations WHERE guest_id = $1 LIMIT $2`, values)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
  return Promise.resolve(reservations);
}
exports.getAllReservations = getAllReservations;

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
  SELECT properties.*, avg(property_reviews.rating) as average_rating
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

  console.log(queryString, queryParams);
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
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
