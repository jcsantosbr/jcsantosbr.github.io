(function() {
  'user strict';
  var all_restaurants = ["32", "40", "Odonto", "Bingo", "Silva", "Palatus"];

  var selectOne = function() {
    var index = Math.floor((Math.random() * all_restaurants.length));
    return all_restaurants[index];
  }

  $(function() {
    var restaurantList = all_restaurants.reduce(function(acc, e) { return acc + "<li>" + e + "</li>"},"");
    $('#all_restaurants').html(restaurantList);

    $('#choose_restaurant').on('click', function() {
      $('#todays_chosen_one').text( selectOne() );
      $('#chosen_message').show();
      $(this).hide();

    });

  });
  
})();




