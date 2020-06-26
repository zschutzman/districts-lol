
var curfile = "";
nbr_lyrs = [];
adj = false;


var bounds = new L.LatLngBounds()

var map = L.map('district',{
  zoomControl: false
})
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();


var group = new L.FeatureGroup()
group.on('layeradd', function() {
  console.log("fitting add")
  console.log(group.getBounds())
    map.fitBounds(group.getBounds())
})

group.on('layerremove', function() {
    if (group.getLayers().length > 0 ) {console.log("fitting");map.fitBounds(group.getBounds())}
})

group.addTo(map)








curfile = filenames[~~(filenames.length * Math.random())];
layer = new L.GeoJSON.AJAX("geojsons/" + curfile + ".geojson");


layer.on('data:loaded', function() {
    group.addLayer(layer)
})







L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoienNjaHV0em1hbiIsImEiOiJja2J2YXdhOW8wNDhsMndvZmJvdjFjajZrIn0.Y4TGDlQxvLgDBelAK8awtA'
}).addTo(map);





function randomdistrict(){
  adj = false
  hide_adj()

  group.removeLayer(layer)

  curfile = filenames[~~(filenames.length * Math.random())];
  layer = new L.GeoJSON.AJAX("geojsons/" + curfile + ".geojson");

  layer.on('data:loaded', function() {
      group.addLayer(layer);

  })



}




function toggle_adj(){
  if (adj == false){
    show_adj();
    adj = true;
    return
   }
   if (adj == true){
     hide_adj()
     adj = false
     return
   }
}

function show_adj(){

for (var i=0;i<(adjacencies[curfile].length);i++){

    _l = new L.GeoJSON.AJAX("geojsons/" + adjacencies[curfile][i] + ".geojson")

    _l.on('data:loaded', function() {
      console.log(_l.getBounds())
        group.addLayer(_l)

    })
    nbr_lyrs.push(_l)
}
}


function hide_adj(){

  for (var i=0; i< nbr_lyrs.length;i++){
    group.removeLayer(nbr_lyrs[i]);

  }
  nbr_lyrs = [];
}
