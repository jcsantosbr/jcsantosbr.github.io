(function() {
  'user strict';
  var all_restaurants = ["32", "40", "Odonto", "Bingo", "Silva", "Palatus"];

  var datastore = new Firebase('https://vivid-inferno-8778.firebaseio.com/');
  
  var selectedRestaurant = null;

  var todaysSelected = null;


  var previousChoices = [];

  var buildLiFromArray = function(a) {
    return a.reduce(function(acc, e) { return acc + "<li>" + e + "</li>"},"");
  }

  var formatEvent = function(e) {
    return "At " + e.day + " in " + e.choice;
  }

  var updatePage = function(){
    $('#choose_restaurant').hide();
    $('#retry_actions').hide();

    if (!selectedRestaurant && !todaysSelected) {
      $('#choose_restaurant').show();
    } else if (selectedRestaurant && !todaysSelected) {
      $('#todays_chosen_one').text(selectedRestaurant);
      $('#chosen_message').show();
      $('#retry_actions').show();
    } else if (todaysSelected) {
      $('#todays_chosen_one').text(todaysSelected);
      $('#chosen_message').show();
    }
    
    $('#previous_choices').html( buildLiFromArray(previousChoices.map(formatEvent)) );

  }

  var selectOne = function() {
    var index = Math.floor((Math.random() * all_restaurants.length));
    return all_restaurants[index];
  }

  var today = function() {
    return new Date().toISOString().slice(0, 10);
  }


  $(function() {
    
    $('#all_restaurants').html(buildLiFromArray(all_restaurants));

    var chooseHandler = function() {
      selectedRestaurant = selectOne();
      updatePage();
    }

   
    $('#choose_restaurant').on('click', chooseHandler);
    $('#try_again').on('click', chooseHandler);
    $('#confirm_choice').on('click', function() {
      datastore.push({ day: today(), choice: selectedRestaurant});
      updatePage();
    });


    datastore.on('child_added', function(snapshot) {
      var event = snapshot.val();

      previousChoices.push(event);
      
      console.log('analysing ' + event.day + ' against '+ today());
      if ( event.day === today() ) {
        todaysSelected = event.choice;
      }

      updatePage();
      
    });

    updatePage();
    

  });
  
})();




