$(() => {
  getAllListings().then(function(json) {
    propertyListings.addProperties(json.properties);
    views_manager.show('listings');
  });

  $('main').on('click', '.reserve-button', function() {
    const idData = $(this).attr('id').substring(17);
    views_manager.show('newReservation', idData);
  })
  $('main').on('click', '.review_details', function() {
    const idData = $(this).attr('id').substring(15);
    views_manager.show('showReviews', idData);
  })

});