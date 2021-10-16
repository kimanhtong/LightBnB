function getMyDetails() {
  console.log("getMyDetails");
  return $.ajax({
    url: "/users/me",
  });
}

function logOut() {
  return $.ajax({
    method: "POST",
    url: "/users/logout",
  })
}

function logIn(data) {
  return $.ajax({
    method: "POST",
    url: "/users/login",
    data
  });
}

function signUp(data) {
  return $.ajax({
    method: "POST",
    url: "/users",
    data
  });
}

function getAllListings(params) {
  console.log("getAllListings");
  let url = "/api/properties";
  if (params) {
    url += "?" + params;
  }
  return $.ajax({
    url,
  });
}

function getFulfilledReservations() {
  console.log("getFulfilledReservations");
  let url = "/api/reservations";
  return $.ajax({
    url,
  });
}

function getUpcomingReservations() {
  console.log("getUpcomingReservations");
  let url = "/api/reservations/upcoming";
  return $.ajax({
    url,
  });
}

function getIndividualReservation(reservationId) {
  console.log("getIndividualReservation");
  let url = `/api/reservations/${reservationId}`
  return $.ajax({
    url,
  })
}

const submitProperty = function(data) {
  console.log("submitProperty");
  return $.ajax({
    method: "POST",
    url: "/api/properties",
    data,
  });
}

const submitReservation = function(data) {
  console.log("submitReservation");
  return $.ajax({
    method: "POST",
    url: "/api/reservations",
    data,
  })
}

const updateReservation = function (data) {
  console.log("updateReservation");
  return $.ajax({
    method: "POST",
    url: `/api/reservations/${data.reservation_id}`,
    data,
  })
};
