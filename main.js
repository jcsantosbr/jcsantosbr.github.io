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

  var formatDate = function(d) {
    return d.toISOString().slice(0, 10);
  }

  var today = function() {
    return formatDate(new Date());
  }

  var todayMinus = function(numberOfDays) {
    var targetDate = new Date();
    targetDate.setDate( targetDate.getDate() - numberOfDays);
    return formatDate( targetDate);
  }

  var findChosen = function(day)  {
    var chosen = previousChoices.filter( function(e) { return e.day == day} )[0];
    return chosen ? chosen.choice : "";
  }

  var generateWeightsPerDay = function() {
    return [1,2,3,4,5].map(function(e,i) { 
      var dateReference = todayMinus(6 - e);
      return { 
        day: dateReference, 
        weight: Math.pow(5,i), 
        chosen: findChosen( dateReference)
      };  
    });
  }

  var calculateSumForRestaurant = function(restaurant) {
    return generateWeightsPerDay().reduce( function(acc, e) { 
        return acc + (e.chosen == restaurant ? 0 : e.weight)  
      }, 0);
  }

  var generateRatingsForAllOptions = function() {
    return all_restaurants.map(function(restaurant) { 
      return { restaurant: restaurant, value: calculateSumForRestaurant(restaurant) };  
    });
  } 

  var fillPositions = function(arr, value, qty) {
    for(var i = 0; i < qty; i++) {
      arr.push(value);
    }
    return arr;
  }

  var selectOne = function() {
    var allOptions = [];
    generateRatingsForAllOptions().forEach(function(e) {
      fillPositions(allOptions, e.restaurant, e.value );
    });
    var index = Math.floor((Math.random() * allOptions.length));
    return allOptions[index];
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
      
      if ( event.day === today() ) {
        todaysSelected = event.choice;
      }

      updatePage();
      
    });

    updatePage();

  });
  
})();




