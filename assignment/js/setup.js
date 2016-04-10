// Leaflet map setup
var map = L.map('map', {
  center: [39.50, -98.35],
  zoom: 5
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


// Leaflet draw setup
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);


// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  },
  draw: {
    polyline: false,
    polygon: false,
    circle: false
  }
});

// var drawControl = new L.Control.Draw({
//   draw: {
//     polyline: true,
//     polygon: true,
//     circle: true,
//     marker: true,
//     rectangle: true,
//   }
// });
//
// map.addControl(drawControl);



// Handling the creation of Leaflet.Draw layers
// Note here, the use of drawnLayerID - this is undoubdtedly the way you should approach
//  remembering and removing layers
var drawnLayerID;
map.addControl(drawControl);
map.on('draw:created', function (e) {
  var type = e.layerType;
  var layer = e.layer;
  //console.log('draw created:', e);

  if (type === 'marker') {
    // Change the 5 here to alter the number of closest records returned!
    nClosest(layer._latlng, 5);
  } else if (type === 'rectangle') {
    pointsWithin(layer._latlngs);
  }

  if (drawnLayerID) { map.removeLayer(map._layers[drawnLayerID]); }
  map.addLayer(layer);
  drawnLayerID = layer._leaflet_id;
});


// The viz.json output by publishing on cartodb
var layerUrl = 'https://eneedham.cartodb.com/api/v2/viz/7e1d4930-fb3a-11e5-9894-0e787de82d45/viz.json';

// Use of CartoDB.js
cartodb.createLayer(map, layerUrl)
  .addTo(map)
  .on('done', function(layer) {
    // layer is a cartodb.js Layer object - can call getSubLayer on it!
    // console.log(layer);
    layer.on('featureClick', function(e, latlng, pos, data) {
      // nClosest(latlng[0], latlng[1], 10);
      // console.log(e, latlng, pos, data);
    });
  }).on('error', function(err) {
    // console.log(err):
  });


      function closestFarm(){
        // Set SQL Query that will return the closest points - however many are set
        var sqlQueryClosest = "SELECT * FROM lsr_24hours ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint("+myLocation.lng+","+myLocation.lat+"), 4326) LIMIT 5";

        // remove existing layers if on map

        // remove locationMarker if on map
        // if(map.hasLayer(locationMarker)){
        //   map.removeLayer(locationMarker);
        // }

        // Get GeoJSON of the closest points to the user
        $.ajax("https://eneedham.cartodb.com/api/v2/sql?format=GeoJSON&q="+sqlQueryClosest).done(function(data) {
          stormMarker = L.circleMarker(data.latlng, {fillColor: '#7B2027', stroke: 0, fillOpacity: 0.9, radius: 10}).bindPopup("You A Here");
          map.addLayer(stormMarker);
        });
      }


  function locateUser(){
    map.locate({setView: true, maxZoom: 5});
  }

  // Map Event Listener listening for when the user location is found
  map.on('locationfound', locationFound);

  // Map Event Listener listening for when the user location is not found
  map.on('locationerror', locationNotFound);


  // Function that will run when the location of the user is found
  function locationFound(e){
      myLocation = e.latlng;
      closestFarm();
      locationMarker = L.circleMarker(e.latlng, {fillColor: '#7B2027', stroke: 0, fillOpacity: 0.9, radius: 10}).bindPopup("You A Here");
      map.addLayer(locationMarker);
  }

  // Function that will run if the location of the user is not found
  function locationNotFound(e){
      alert(e.message);
  }


  // $.ajax('https://eneedham.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
  //   //console.log('pointsWithin:', results);
  //   addRecords(results);
  // });


  $("#close").click(function(){
    // if(map.hasLayer(locationMarker)){
    //     map.removeLayer(locationMarker);
    // }
    locateUser();
  });
