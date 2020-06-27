var octo = new Octokat({token:'55c7946315746340b150beb4697eb7327b31086a'})
var repo = octo.repos('zschutzman', 'zach-database')




















var curfile = "";
var nbr_lyrs = [];
var nbr_files = []
var adj = false;

var style = 'none';

var rep_color = d3.scaleLinear()
.domain([0.0, 1])
.range(["#0000FF", "#FF0000"]);

var dem_color = d3.scaleLinear()
.domain([0.0, 1])
.range(["#FF0000", "#0000FF"]);



var bounds = new L.LatLngBounds()

var map = L.map('district',{
  zoomControl: false
})
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();


var group = new L.FeatureGroup()

  group.on("layerremove", function(){counter++})

group.addTo(map)








curfile = filenames[~~(filenames.length * Math.random())];
layer = new L.GeoJSON.AJAX("geojsons/" + curfile + ".geojson");


layer.on('data:loaded', function() {
  group.addLayer(layer)
  map.fitBounds(layer.getBounds())
  layer.setStyle({fill:false, color:"#000000", fillOpacity:0.7 })
})







L.tileLayer('https://api.mapbox.com/styles/v1/zschutzman/cjp4fdxmo0uv62spdtehzites/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoienNjaHV0em1hbiIsImEiOiJja2J2YXdhOW8wNDhsMndvZmJvdjFjajZrIn0.Y4TGDlQxvLgDBelAK8awtA', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  tileSize: 512,
  zoomOffset: -1,
  //accessToken: 'pk.eyJ1IjoienNjaHV0em1hbiIsImEiOiJja2J2YXdhOW8wNDhsMndvZmJvdjFjajZrIn0.Y4TGDlQxvLgDBelAK8awtA'
}).addTo(map);





function randomdistrict(){







  style = 'none'

  adj = false
  hide_adj()
  apply_party_colors()
  group.removeLayer(layer)

  curfile = filenames[~~(filenames.length * Math.random())];
  layer = new L.GeoJSON.AJAX("geojsons/" + curfile + ".geojson");

  layer.on('data:loaded', function() {
    group.addLayer(layer);
    map.fitBounds(layer.getBounds())
    layer.setStyle({fill:false, color:"#000000", fillOpacity:.7 })
  })



  e = elections[curfile]
  if (e == undefined){return}


  maxvotes = 0
  maxparty = 'none'
  maxname = 'none'
  maxprop = 1.0
  for (var key in e){

    if (e[key]['candidatevotes'] > maxvotes){
      maxparty = e[key]['party']
      maxname = key
      maxvotes = e[key]['candidatevotes']
      maxprop = parseFloat( e[key]['candidatevotes'])/ parseFloat( e[key]['totalvotes'])
    }
  }

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

 _s0 = "This district is " + curfile + ", represented by " +  maxname +  ", a " + maxparty.charAt(0).toUpperCase() + maxparty.slice(1) + ", <br /> who won in 2018 with approximately " + ~~(100*maxprop) + " percent of the vote. <br />"















  var ind1 = ~~(demo_field_list.length * Math.random())
  while(ind1 == 0){
    ind1 = ~~(demo_field_list.length * Math.random())
  }
  var ind2 = ~~(demo_field_list.length * Math.random())

  var ind3 = ~~(demo_field_list.length * Math.random())

  while (ind2 == ind1 || ind2 == 0){
    ind2 = ~~(demo_field_list.length * Math.random())

  }

  while (ind3 == ind2 || ind3 == ind1 || ind3 == 0){
    ind3 = ~~(demo_field_list.length * Math.random())
  }



  var f1 = demographics[curfile][demo_field_list[ind1]]
  var f2 = demographics[curfile][demo_field_list[ind2]]
  var f3 = demographics[curfile][demo_field_list[ind3]]
  var d1 = demographics[curfile]["total"]


  if ([demo_field_list[ind1]] == "medianinc"){
    _s1 = "The median income in the district is $" + f1 + ". <br />"
  }
  else{
    _s1 = ~~((100 * parseFloat(f1) / parseFloat(d1))) + " percent of the district " + demo_string_lookup[demo_field_list[ind1]] + ". <br />"
  }

  if ([demo_field_list[ind2]] == "medianinc"){
    _s2 = "The median income in the district is $" + f2 + ". <br />"
  }
  else{
    _s2 = ~~((100 * parseFloat(f2) / parseFloat(d1))) + " percent of the district " + demo_string_lookup[demo_field_list[ind2]] + ". <br />"
  }

  if ([demo_field_list[ind3]] == "medianinc"){
    _s3 = "The median income in the district is $" + f1 + ". <br />"
  }
  else{
    _s3 = ~~((100 * parseFloat(f3) / parseFloat(d1))) + " percent of the district " + demo_string_lookup[demo_field_list[ind3]] + ". <br />"
  }





if (vote_data[curfile] == undefined){
  _s4 = "Nobody has rated this district yet!"
}
else{
  d = vote_data[curfile]
  _s4 = "So far " + d[0] +  (d[0]==1 ? " person thinks" :  " people think")    + " this district is HOT and " + d[1] + (d[1] == 1 ? " thinks": " think")   +  " it's NOT! <br/ >"


}



  document.getElementById("bio").innerHTML = _s0 + _s1 + _s2 + _s3 + _s4;



}




function toggle_adj(){
  if (adj == false){
    show_adj();
    adj = true;
    check_layers_loaded()

  }
  else if (adj == true){
    hide_adj()
    adj = false
    check_layers_unloaded()

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


function check_layers_unloaded(){

  if (counter == tot){
    map.fitBounds(group.getBounds())
  }  else{
      setTimeout(check_layers_loaded,100)
    }
    apply_party_colors()
}


function show_adj(){
  counter = 0;
  tot = adjacencies[curfile].length

  for (var i=0;i<tot;i++){

    _l = new L.GeoJSON.AJAX("geojsons/" + adjacencies[curfile][i] + ".geojson")
    nbr_lyrs.push(_l)
    nbr_files.push(adjacencies[curfile][i]);
    _l.on('data:loaded', function() {

      counter++;

    })

  }

}


function hide_adj(){

  tot = adjacencies[curfile].length
  counter = 0
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

      if (e[key]['candidatevotes'] > maxvotes){
        maxparty = e[key]['party']
        maxname = key
        maxvotes = e[key]['candidatevotes']
        maxprop = parseFloat( e[key]['candidatevotes'])/ parseFloat( e[key]['totalvotes'])
      }
    }

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

      if (e != undefined){

        maxvotes = 0
        maxparty = 'none'
        maxname = 'none'
        maxprop = 1.0
        for (var key in e){

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

function hot(){

hsh = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
var commit_info = {
  message: "vote " + curfile + " " + hsh,
  content: btoa(curfile + ", 'hot'\n")
}
repo.contents("_data/hot-or-not/raw/dat_" + hsh + ".txt").add(commit_info).then(randomdistrict).catch(hot)

}

function not(){

hsh = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
var commit_info = {
  message: "vote " + curfile + " " + hsh,
  content: btoa(curfile + ", 'not'\n")
}
repo.contents("_data/hot-or-not/raw/dat_" + hsh + ".txt").add(commit_info).then(randomdistrict).catch(not)


}
