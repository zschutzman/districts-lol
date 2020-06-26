
var curfile = "";
var nbr_lyrs = [];
var nbr_files = []
var adj = false;

var style = 'none';

var rep_color = d3.scaleLinear()
.domain([0.4, 1])
.range(["#FFFFFF", "#FF0000"]);

var dem_color = d3.scaleLinear()
.domain([0.4, 1])
.range(["#FFFFFF", "#0000FF"]);



var bounds = new L.LatLngBounds()

var map = L.map('district',{
  zoomControl: false
})
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();


var group = new L.FeatureGroup()

group.on('layerremove', function() {
  if (group.getLayers().length > 0 ) {console.log("fitting");map.fitBounds(group.getBounds())}
})

group.addTo(map)








curfile = filenames[~~(filenames.length * Math.random())];
layer = new L.GeoJSON.AJAX("geojsons/" + curfile + ".geojson");


layer.on('data:loaded', function() {
  group.addLayer(layer)
  map.fitBounds(layer.getBounds())
  layer.setStyle({fill:false, color:"#000000", fillOpacity:0.7 })
})








L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox://styles/zschutzman/cjp4fdxmo0uv62spdtehzites',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoienNjaHV0em1hbiIsImEiOiJja2J2YXdhOW8wNDhsMndvZmJvdjFjajZrIn0.Y4TGDlQxvLgDBelAK8awtA'
}).addTo(map);





function randomdistrict(){
  style = 'none'
  adj = false
  hide_adj()

  group.removeLayer(layer)

  curfile = filenames[~~(filenames.length * Math.random())];
  layer = new L.GeoJSON.AJAX("geojsons/" + curfile + ".geojson");

  layer.on('data:loaded', function() {
    group.addLayer(layer);
    map.fitBounds(layer.getBounds())
    layer.setStyle({fill:false, color:"#000000", fillOpacity:.7 })
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


var counter;
var tot;



function check_layers_loaded(){

  if (counter == tot){
    nbr_lyrs.forEach(function(l){ group.addLayer(l)})
    map.fitBounds(group.getBounds())
  }
  else{
    setTimeout(check_layers_loaded,100)
  }
  apply_party_colors()
}





function show_adj(){
  counter = 0;
  tot = adjacencies[curfile].length
  console.log(curfile)
  for (var i=0;i<tot;i++){
    console.log(adjacencies[curfile][i])
    _l = new L.GeoJSON.AJAX("geojsons/" + adjacencies[curfile][i] + ".geojson")
    nbr_lyrs.push(_l)
    nbr_files.push(adjacencies[curfile][i]);
    _l.on('data:loaded', function() {

      counter++;

    })

  }
  check_layers_loaded()
}


function hide_adj(){

  for (var i=0; i< nbr_lyrs.length;i++){
    group.removeLayer(nbr_lyrs[i]);

  }
  nbr_lyrs = [];
  nbr_files = [];
}



function toggle_party_colors(){

  if (style == 'party'){style='none'}
  else {style = 'party'}
  apply_party_colors()



}


function apply_party_colors(){
  if (style == 'party'){

    e = elections[curfile]
    if (e == undefined){return}


    maxvotes = 0
    maxparty = 'none'
    maxname = 'none'
    maxprop = 1.0
    for (var key in e){
      console.log(e[key])
      if (e[key]['candidatevotes'] > maxvotes){
        maxparty = e[key]['party']
        maxname = key
        maxvotes = e[key]['candidatevotes']
        maxprop = parseFloat( e[key]['candidatevotes'])/ parseFloat( e[key]['totalvotes'])
      }
    }

    console.log(maxprop)
    if (maxparty == 'democrat'){
      layer.setStyle({
        "color":dem_color(maxprop),
        fill:true
      })
    }
    if (maxparty == 'republican'){
      layer.setStyle({
        "color":rep_color(maxprop),
        fill:true
      })
    }

    for (var i=0; i<nbr_lyrs.length;i++){



      e = elections[nbr_files[i]]
      console.log(e)
      if (e != undefined){

        maxvotes = 0
        maxparty = 'none'
        maxname = 'none'
        maxprop = 1.0
        for (var key in e){
          console.log(e[key])
          if (e[key]['candidatevotes'] > maxvotes){
            maxparty = e[key]['party']
            maxname = key
            maxvotes = e[key]['candidatevotes']
            maxprop = parseFloat( e[key]['candidatevotes'])/ parseFloat( e[key]['totalvotes'])
          }
        }

        if (maxparty == 'democrat'){
          nbr_lyrs[i].setStyle({
            "color":dem_color(maxprop),
            fill:true,
            fillOpacity:0.2
          })
        }
        if (maxparty == 'republican'){
          nbr_lyrs[i].setStyle({
            "color":rep_color(maxprop),
            fill:true,
            fillOpacity:0.2
          })
        }


      }


    }




  }
  else {

    layer.setStyle({fill:false, color:"#000000" })

    for (var i=0; i<nbr_lyrs.length;i++){



      nbr_lyrs[i].setStyle({fill:false, color:"#000000" })





    }



  }
}
