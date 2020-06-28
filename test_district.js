var fips_to_state = {
   "01": "Alabama",
   "02": "Alaska",
   "04": "Arizona",
   "05": "Arkansas",
   "06": "California",
   "08": "Colorado",
   "09": "Connecticut",
   "10": "Delaware",
   "11": "District of Columbia",
   "12": "Florida",
   "13": "Geogia",
   "15": "Hawaii",
   "16": "Idaho",
   "17": "Illinois",
   "18": "Indiana",
   "19": "Iowa",
   "20": "Kansas",
   "21": "Kentucky",
   "22": "Louisiana",
   "23": "Maine",
   "24": "Maryland",
   "25": "Massachusetts",
   "26": "Michigan",
   "27": "Minnesota",
   "28": "Mississippi",
   "29": "Missouri",
   "30": "Montana",
   "31": "Nebraska",
   "32": "Nevada",
   "33": "New Hampshire",
   "34": "New Jersey",
   "35": "New Mexico",
   "36": "New York",
   "37": "North Carolina",
   "38": "North Dakota",
   "39": "Ohio",
   "40": "Oklahoma",
   "41": "Oregon",
   "42": "Pennsylvania",
   "44": "Rhode Island",
   "45": "South Carolina",
   "46": "South Dakota",
   "47": "Tennessee",
   "48": "Texas",
   "49": "Utah",
   "50": "Vermont",
   "51": "Virginia",
   "53": "Washington",
   "54": "West Virginia",
   "55": "Wisconsin",
   "56": "Wyoming"
}

var commit_queue = [];


Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}


var tk = "M2M1MGYxMDlkN2NmNDE4ZjBjM2E5NTExZWZkM2Y0MjQwMmIwZTJhNA=="


var octo = new Octokat({token:atob(tk)})
var repo = octo.repos('zschutzman', 'districts-lol-data')



var curfile = "";
var nbr_lyrs = [];
var nbr_files = []
var adj = false;

var seen = [];

var style = 'none';

var rep_color = d3.scaleLinear()
.domain([0.0, 0.5, 1])
.range(["#0000FF", "#999999", "#FF0000"]);

var dem_color = d3.scaleLinear()
.domain([0.0, 0.5, 1])
.range(["#FF0000", "#999999", "#0000FF"]);



var bounds = new L.LatLngBounds()

var map = L.map('district',{
  zoomControl: false,
    attributionControl: false,
})
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();


var group = new L.FeatureGroup()

group.on("layerremove", function(){counter++})

group.addTo(map)

var layer;

var curfile = 'none';


L.tileLayer('https://api.mapbox.com/styles/v1/zschutzman/ckby1otrt1tnf1io6i7xvk3he/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoienNjaHV0em1hbiIsImEiOiJja2J2YXdhOW8wNDhsMndvZmJvdjFjajZrIn0.Y4TGDlQxvLgDBelAK8awtA', {
  //attribution: 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  tileSize: 512,
  zoomOffset: -1,
  //accessToken: 'pk.eyJ1IjoienNjaHV0em1hbiIsImEiOiJja2J2YXdhOW8wNDhsMndvZmJvdjFjajZrIn0.Y4TGDlQxvLgDBelAK8awtA'
}).addTo(map);


function randomdistrict(){
document.getElementById("color_btn").style.background = "#ffffff"
document.getElementById("nbr_btn").style.background = "#ffffff"

  style = 'none'

  adj = false
  if (curfile != 'none'){
    hide_adj()
    apply_party_colors()
    group.removeLayer(layer)
  }

  curfile = filenames[~~(filenames.diff(seen).length * Math.random())];
  if (seen.length == filenames.length){seen = [];}
  while (seen.includes(curfile)){
    curfile = filenames[~~(filenames.diff(seen).length * Math.random())];
  }
  seen.push(curfile);

  layer = new L.GeoJSON.AJAX("geojsons/" + curfile + ".geojson");

  layer.on('data:loaded', function() {
    group.addLayer(layer);
    map.fitBounds(layer.getBounds())
    layer.setStyle({fill:false, color:"#000000", fillOpacity:.7 })
  })


  if (curfile == 'G11098'){
    document.getElementById("district_name").innerHTML = "<p>  This is Washington, D.C., which does not have representation in Congress!  </p>";
    document.getElementById("bio").innerHTML = ""
    return;
  }

  if (curfile == 'G72098'){
    document.getElementById("district_name").innerHTML = "This is Puerto Rico, which does not have representation in Congress!";
    document.getElementById("bio").innerHTML = ""
    return;
  }




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





  sn = fips_to_state[curfile.slice(1,3)]
  dn = parseInt(curfile.slice(4,7))
  vstr = (maxprop == 1 ? " who ran unopposed in 2018." :" who won in 2018 with approximately " + ~~(100*maxprop) + " percent of the vote.")



  _s0 = "This district is " +   (dn == 0 ? sn + " At-Large" : "the "+ sn + " " + ordinal_suffix_of(dn))      +        ", represented by " +  maxname +  ", a " + maxparty.charAt(0).toUpperCase() + maxparty.slice(1) + "," + vstr



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
    _s1 = "The median income in the district is $" + f1 + "."
  }
  else{
    _s1 = ~~((100 * parseFloat(f1) / parseFloat(d1))) + " percent of the district " + demo_string_lookup[demo_field_list[ind1]] + "."
  }

  if ([demo_field_list[ind2]] == "medianinc"){
    _s2 = "The median income in the district is $" + f2 + "."
  }
  else{
    _s2 = ~~((100 * parseFloat(f2) / parseFloat(d1))) + " percent of the district " + demo_string_lookup[demo_field_list[ind2]] + "."
  }

  if ([demo_field_list[ind3]] == "medianinc"){
    _s3 = "The median income in the district is $" + f3 + "."
  }
  else{
    _s3 = ~~((100 * parseFloat(f3) / parseFloat(d1))) + " percent of the district " + demo_string_lookup[demo_field_list[ind3]] + "."
  }


  if (vote_data[curfile] == undefined){
    _s4 = "Nobody has rated this district yet!"
    document.getElementById("hotnot_bar").setAttribute("opacity","0%")
    document.getElementById("popularity_bar").setAttribute("height","0")
    // document.getElementById("hot_meter").setAttribute("width","0px")
    // document.getElementById("not_meter").setAttribute("width","0px")
  }
  else{
    d = vote_data[curfile]
    _s4 = "So far " + d[0] +  (d[0]==1 ? " person thinks" :  " people think")    + " this district is HOT and " + d[1] + (d[1] == 1 ? " thinks": " think")   +  " it's NOT!"

    pct = ~~(100*d[0]/(d[0]+d[1]))
    document.getElementById("hotnot_bar").setAttribute("opacity","75%")
    document.getElementById("popularity_bar").setAttribute("height","50px")
    document.getElementById("hot_bar").setAttribute("offset",pct+"%")
    document.getElementById("not_bar").setAttribute("offset",pct+"%")

  }

  document.getElementById("district_name").innerHTML =  _s0;

  document.getElementById("bio").innerHTML = "<ul style='padding-left:10px'>"  + "<li>" + _s1 + "</li>" + "<li>" +_s2 + "</li>" + "<li>" +_s3 + "</li>"  + "</ul>";

  document.getElementById("pop_text").innerHTML = _s4

}

function toggle_adj(){
  if (adj == false){
    show_adj();
    document.getElementById("nbr_btn").style.background = "#33ffbb"
    adj = true;
    check_layers_loaded()

  }
  else if (adj == true){
    hide_adj()
    adj = false
    document.getElementById("nbr_btn").style.background = "#ffffff"
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

  if (style == 'party'){
    style='none'
    document.getElementById("color_btn").style.background = "#ffffff"
    //document.getElementById("color_btn").style.color = "#ffffff !important"
  }
  else {
    style = 'party'
    document.getElementById("color_btn").style.background = "#9966ff"
}
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

    if (maxparty == 'democrat' || maxparty == 'Democratic-Farmer-Labor'){
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

        if (maxparty == 'democrat' || maxparty == 'Democratic-Farmer-Labor'){
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

  commit_queue.push(btoa(curfile + ", 'hot'\n"))
  randomdistrict()

}

function not(){
  commit_queue.push(btoa(curfile + ", 'not'\n"))
  randomdistrict()
}




function make_commits()
    {
        if (commit_queue.length > 0)
        {
            //get the next message on the queue
            var msg = commit_queue.shift();

            hsh = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            var commit_info = {
              message: "vote " + curfile + " " + hsh,
              content: msg
            }
            repo.contents("_data/hot-or-not/raw/dat_" + hsh + ".txt").add(commit_info).then().catch(function(e) {  commit_queue.push(msg)    })
        }
       setTimeout(make_commits);

    }
make_commits()
