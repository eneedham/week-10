// Leaflet map setup
var map = L.map('map', {
  center: [39.50, -98.35],
  zoom: 4
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


// The viz.json output by publishing on cartodb
var layerUrl = 'https://eneedham.cartodb.com/api/v2/viz/7e1d4930-fb3a-11e5-9894-0e787de82d45/viz.json';

// Use of CartoDB.js
cartodb.createLayer(map, layerUrl)
  .addTo(map)
  .on('done', function(layer) {
    // layer is a cartodb.js Layer object - can call getSubLayer on it!
    layer.on('featureClick', function(e, latlng, pos, data) {
    });
  }).on('error', function(err) {
  });

  //Global Variables
  var cartoDBUserName = "eneedham";
  var myData = {};
  var myLocation = null;
  var locationMarker = null;

  //***************************************************** //LOCATE USER

  function locateUser(){
    map.locate({setView: true, maxZoom: 4});
  }

  // Map Event Listener listening for when the user location is found
  map.on('locationfound', locationFound);

  // Map Event Listener listening for when the user location is not found
  map.on('locationerror', locationNotFound);


  // Function that will run when the location of the user is found
  function locationFound(e){
      myLocation = e.latlng;
      showAll();
      locationMarker = L.circleMarker(e.latlng, {fillColor: '#7B2027', stroke: 0, fillOpacity: 0.9, radius: 10}).bindPopup("You A Here");
      map.addLayer(locationMarker);
  }

  // Function that will run if the location of the user is not found
  function locationNotFound(e){
      alert(e.message);
  }


  //*****************************************************

  //Function to Filter Storms
  var showAll = function(){
    if(map.hasLayer(myData)){
        map.removeLayer(myData);
    }
      // Get CartoDB selection as GeoJSON and Add to Map
      $.getJSON("https://"+cartoDBUserName+".cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM lsr_24hour ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint("+myLocation.lng+","+myLocation.lat+"), 4326) LIMIT 8", function(data) {
          stormsNearby();
          myData = L.geoJson(data, {
            onEachFeature: eachFeature,
            pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {fillColor: '#CE4500', stroke: 2, color: '#7D2A00', fillOpacity: 0.5, radius: 6});
            },
            fillColor: "#614E69",
            color: "#434343",
            fillOpacity: 0.3,
            weight: 3
          }).addTo(map);
      });
  };


  $("#show-all").click(function(){
    if(map.hasLayer(myData)){
        map.removeLayer(myData);
    }
    if(map.hasLayer(locationMarker)){
        map.removeLayer(locationMarker);
    }
    locateUser();
    addOneRecord();
  });

  //Default Zoom button
  $("#reset-zoom").click(function(){
    defaultViewFunc();
  });
