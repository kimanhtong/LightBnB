$(() => {
  getAllListings().then(function(json) {
    propertyListings.addProperties(json.properties);
    views_manager.show('listings');
    /*$('.reserve-button').on('click', function() {
      const idData = $(this).attr('id').substring(17);
      views_manager.show('newReservation', idData);
    })*/
  });
  /*if (isReservation) {
    $('.update-button').on('click', function() {
      const idData = $(this).attr('id').substring(16);
      console.log(`update ${idData}`);    
      getIndividualReservation(idData).then(data => {
        views_manager.show("updateReservation", data);       
      });      
    });
    $('.delete-button').on('click', function() {
      const idData = $(this).attr('id').substring(16);
      console.log(`delete ${idData}`);          
    })
  }*/

  $(document).on('click','.reserve-button', function() {
      const idData = $(this).attr('id').substring(17);
      views_manager.show('newReservation', idData);
    });
  
  $(document).on('click','.update-button', function() {
      const idData = $(this).attr('id').substring(16);
      console.log(`update ${idData}`);    
      getIndividualReservation(idData).then(data => {
        views_manager.show("updateReservation", data);       
      });
    });

  $(document).on('click','.delete-button', function() {
      const idData = $(this).attr('id').substring(16);
      console.log(`delete ${idData}`); 
    });

});