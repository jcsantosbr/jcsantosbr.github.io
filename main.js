(function() {
  'user strict';
  var all_restaurants = ["32", "40", "Odonto", "Bingo", "Silva", "Palatus"];

  var datastore = new Firebase('https://vivid-inferno-8778.firebaseio.com/');
  
  var selectedRestaurant = null;

  var selectOne = function() {
    var index = Math.floor((Math.random() * all_restaurants.length));
    return all_restaurants[index];
  }

  var displaySelected = function(selected) {
      $('#todays_chosen_one').text(selected);
      $('#chosen_message').show();
  }

  var today = function() {
    return new Date().toISOString().slice(0, 10);
  }


  $(function() {
    var restaurantList = all_restaurants.reduce(function(acc, e) { return acc + "<li>" + e + "</li>"},"");
    $('#all_restaurants').html(restaurantList);

    var chooseHandler = function() {
      selectedRestaurant = selectOne();
      displaySelected(selectedRestaurant);
      $(this).hide();
      
    }

   
    $('#choose_restaurant').on('click', chooseHandler);
    $('#try_again').on('click', chooseHandler);
    $('#confirm_choice').on('click', function() {
      datastore.push({ day: today(), choice: selectedRestaurant});
      $(this).hide();
      $('#try_again').hide();
    });


    datastore.on('child_added', function(snapshot) {
      var event = snapshot.val();
      
      console.log('analysing ' + event.day + ' against '+ today());
      if ( event.day === today() ) {
        console.log('already selected today');
        displaySelected( event.choice ); 
        $('#choose_restaurant').hide();
        $('#confirm_choice').hide();
        $('#try_again').hide();
      }
      
    });
    

  });
  
})();




