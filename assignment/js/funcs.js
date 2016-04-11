/** Find all points within the box constructed */
function stormsNearby() {
  var sql = "SELECT * FROM lsr_24hour ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint("+myLocation.lng+","+myLocation.lat+"), 4326) LIMIT 8";

  $.ajax('https://eneedham.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    addRecords(results);
  });
}


/**
 * function for adding one record
 *
 * The pattern of writing the function which solves for 1 case and then using that function
 *  in the definition of the function which solves for N cases is a common way to keep code
 *  readable, clean, and think-aboutable.
 */
function addOneRecord(rec) {
  var title = $('<p></p>')
    .text('City: ' + rec.city);

  var location = $('<p></p>')
    .text('Storm Info: ' + rec.remark);

  var type = $('<p></p>')
    .text(rec.typetext);

  var recordElement = $('<li></li>')
    .addClass('list-group-item')
    .append(title)
    .append(location)
    .append(type);

  $('#project-list').append(recordElement);
}

/** Given a cartoDB resultset of records, add them to our list */
function addRecords(cartodbResults) {
  $('#project-list').empty();
  _.each(cartodbResults.rows, addOneRecord);
}

//**********************************************************************************************

//Default Zoom
var defaultViewFunc = function(){
    map.setView([39.50, -98.35], 4);
};


//Function to zoom in
var eachFeature = function(feature, layer) {
  layer.on('click', function (e) {
    var bounds = this.getBounds();
    map.fitBounds(bounds);
  });
};
