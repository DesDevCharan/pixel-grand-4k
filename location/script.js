'use strict';

$('.tree-toggle').click(function () {
  $(this).parent().children('ul.tree').toggle(200);
});

$(function () {
  $('.tree-toggle').parent().children('ul.tree').toggle(200);
});

var map, places, iw;
var markers = [];
var autocomplete;
var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
var imags = 'http://www.maddog.in/reia/ozone_location/ozoneicon.png';
var distance;
var myLatlng = new google.maps.LatLng(22.452669, 88.394917);
var destination = new google.maps.LatLng(22.452015, 88.393193);
var menuItems = ['Hospitals', 'Schools', 'Restaurants', 'Banks', 'Store'];
loadMenu();

function ZoomControl(controlDiv, map) {

  // Creating divs & styles for custom zoom control
  controlDiv.style.padding = '100px';

  // Set CSS for the control wrapper
  var controlWrapper = document.createElement('div');
  controlWrapper.style.backgroundColor = 'white';
  controlWrapper.style.borderStyle = 'solid';
  controlWrapper.style.borderColor = 'gray';
  controlWrapper.style.borderWidth = '1px';
  controlWrapper.style.cursor = 'pointer';
  controlWrapper.style.textAlign = 'center';
  controlWrapper.style.width = '80px';
  controlWrapper.style.height = '74px';
  controlDiv.appendChild(controlWrapper);

  // Set CSS for the zoomIn
  var zoomInButton = document.createElement('div');
  zoomInButton.style.width = '110px';
  zoomInButton.style.height = '90px';
  /* Change this to be the .png image you want to use */
  zoomInButton.style.backgroundImage = 'url("http://placehold.it/70/191818")';
  controlWrapper.appendChild(zoomInButton);

  // Set CSS for the zoomOut
  var zoomOutButton = document.createElement('div');
  zoomOutButton.style.width = '110px';
  zoomOutButton.style.height = '90px';
  /* Change this to be the .png image you want to use */
  zoomOutButton.style.backgroundImage = 'url("http://placehold.it/70/fffcfc")';
  controlWrapper.appendChild(zoomOutButton);

  // Setup the click event listener - zoomIn
  google.maps.event.addDomListener(zoomInButton, 'click', function () {
    map.setZoom(map.getZoom() + 1);
  });

  // Setup the click event listener - zoomOut
  google.maps.event.addDomListener(zoomOutButton, 'click', function () {
    map.setZoom(map.getZoom() - 1);
  });
}

function initialize() {
  //var myLatlng = new google.maps.LatLng(22.452669, 88.394917);
  //var destination = new google.maps.LatLng(223.452669, 883.394917);
  // gestureHandling: 'none'
  // zoomControl: false


  var myOptions = {
    zoom: 16.3,
    disableDefaultUI: false,
    center: myLatlng,
    scrollwheel: false,
    zoomControl: false,
    minZoom: 5,
    maxZoom: 22,
    zoomControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.BOTTOM
    },
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    gestureHandling: 'cooperative',
    scaleControl: false,
    styles: [{
      "featureType": "poi",
      "stylers": [{
        "visibility": "off"
      }]
    }],
    mapTypeId: google.maps.MapTypeId.ROADMAP

    /*googleMap.addMarker(new MarkerOptions()
    .position(myLatlng)
    .title("OZONE")
    .showInfoWindow();
    
    
    /*var images = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';*/

    //scaleControl: true

  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  // var zoomControlDiv = document.createElement('div');
  // var zoomControl = new ZoomControl(zoomControlDiv, map);

  // center reposition control
  var centerControlDiv = document.createElement('div');
  var centerControl = new CenterControl(centerControlDiv, map);
  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

  // zoom slider control
  var zoomControlDiv = document.createElement('div');
  zoomControlDiv.setAttribute("class", "gm-custom-controls");
  zoomControlDiv.index = 1;

  // Add custom zoom controls
  var centerControl = new ZoomSliderControl(zoomControlDiv, map, map.minZoom, map.maxZoom, map.zoom);

  // map custom controls to map
  map.controls[google.maps.ControlPosition.BOTTOM].push(zoomControlDiv);

  // zoomControlDiv.index = 1;
  // map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(zoomControlDiv);
  places = new google.maps.places.PlacesService(map);
  google.maps.event.addListener(map, 'tilesloaded', tilesLoaded);
  autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    showSelectedPlace();
  });
}

function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.classList.add('recenter-button');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to recenter the map';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Center Map';
  controlUI.appendChild(controlText);

  controlUI.addEventListener('click', function () {
    map.setCenter(myLatlng, 10);
  });
}

function ZoomSliderControl(controlDiv, map, min, max, currentZoom) {

  var parentDiv = document.createElement('div');
  parentDiv.setAttribute("class", "gm-zoom-slider");

  var controlUI = document.createElement('input');
  controlUI.type = 'range';
  controlUI.value = currentZoom;
  controlUI.min = min;
  controlUI.max = max;
  controlUI.style.width = window.innerWidth / 3;

  // Add zoom controls
  var inccontrols = document.createElement('div');
  inccontrols.id = 'gm-zoom-inc';
  inccontrols.classList.add('zoom-button');

  var deccontrols = document.createElement('div');
  deccontrols.id = 'gm-zoom-dec';
  deccontrols.classList.add('zoom-button');

  parentDiv.appendChild(deccontrols);
  parentDiv.appendChild(controlUI);
  parentDiv.appendChild(inccontrols);

  controlDiv.appendChild(parentDiv);

  // Click event listner for side-bar

  google.maps.event.addDomListener(controlUI, 'click', function () {
    map.setZoom(parseFloat(controlUI.value));
  });

  google.maps.event.addDomListener(controlUI, 'touchend', function () {
    map.setZoom(parseFloat(controlUI.value));
  });

  google.maps.event.addDomListener(inccontrols, 'click', function () {
    map.setZoom(map.getZoom() + 1);
  });

  google.maps.event.addDomListener(deccontrols, 'click', function () {
    map.setZoom(map.getZoom() + -1);
  });

  // Set slider value on zoom change 
  google.maps.event.addListener(map, 'zoom_changed', function () {
    controlUI.value = map.getZoom();
  });
}

function maiiw() {
  var beachMarker = new google.maps.Marker({
    position: myLatlng,
    title: "OZONE",
    map: map,
    icon: imags
  });
}

function tileSearch() {
  var id = $('.in').first().attr('id').slice(-1);
  search(id);
}

function tilesLoaded() {
  google.maps.event.clearListeners(map, 'tilesloaded');
  google.maps.event.addListener(map, 'zoom_changed', tileSearch);
  google.maps.event.addListener(map, 'dragend', tileSearch);
  tileSearch();
}

function showSelectedPlace() {
  clearResults();
  clearMarkers();
  var place = autocomplete.getPlace();
  map.panTo(place.geometry.location);
  markers[0] = new google.maps.Marker({
    position: place.geometry.location,
    map: map
  });
  iw = new google.maps.InfoWindow({
    content: getIWContent(place)
  });
  iw.open(map, markers[0]);
}

function transitLayer() {
  var transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);
}

function search(index) {
  maiiw();
  var type = '';
  setTimeout(function () {
    var txt = $('.panel-heading').not('.collapsed').find('a').text().toLowerCase();
    type = txt.slice(-1) === 's' ? txt.slice(0, -1) : txt;
    if (type) {
      autocomplete.setBounds(map.getBounds());
      var search = {
        bounds: map.getBounds()
      };
      if (type != 'establishment') {
        search.types = [type];
      }
      places.search(search, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          clearResults();
          clearMarkers();
          var htmlList = '';
          var parentDiv = $('#collapse' + index);
          parentDiv = parentDiv.first();
          parentDiv.css('max-height', window.innerHeight / 3);
          parentDiv.css('overflow', 'auto');
          for (var i = 0; i < results.length; i++) {
            markers[i] = new google.maps.Marker({
              position: results[i].geometry.location,
              // animation: google.maps.Animation.DROP	,
              icon: 'http://www.maddog.in/reia/ozone_location/locmark.png'
            });
            google.maps.event.addListener(markers[i], 'click', getDetails(results[i], i));
            setTimeout(dropMarker(i), i * 100);
            parentDiv.append(addResult(results[i], i));
          }
        } else if (status === 'ZERO_RESULTS' && results.length === 0) {
          showZeroResult(txt);
          clearMarkers();
        }
      });
    } else {
      showZeroResult(txt);
      clearMarkers();
    }
  }, 10);
}

function showZeroResult(txt) {
  clearResults();
  var results = $('.in').length === 0 ? $('.collapsing') : $('.in');
  var anchor = document.createElement('a');
  anchor.classList.add("list-group-item");
  anchor.innerHTML = 'No ' + txt + ' nearby';
  results.html(anchor);
}

function getDistance(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter

  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  distance = R * c;
  return distance;
};

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
      markers[i] == null;
    }
  }
}

function dropMarker(i) {
  return function () {
    markers[i].setMap(map);
  };
}

function addResult(result, i) {
  var anchor = document.createElement('a');
  anchor.href = 'javascript:void(0);';
  anchor.addEventListener('click', function () {
    $.each($('.list-group-item'), function (index, item) {
      item.classList.remove('active');
    });
    anchor.classList.add('active');
    google.maps.event.trigger(markers[i], 'click');
  });
  var icon = document.createElement('img');
  icon.src = result.icon;
  anchor.classList.add("list-group-item");
  icon.classList.add("placeIcon");
  var name = document.createElement('span');
  name.innerHTML = result.name;
  name.classList.add('loc-name');
  var lat = result.geometry.location.lat();
  var lng = result.geometry.location.lng();
  destination = new google.maps.LatLng(lat, lng);
  var dist = document.createElement('span');
  dist.classList.add('distance-from-src');
  dist.innerHTML = convertUnits(getDistance(myLatlng, destination));
  anchor.appendChild(icon);
  anchor.appendChild(name);
  anchor.appendChild(dist);
  return anchor;
}

function convertUnits(val) {
  val = Math.round(val);
  if (val > 1000) {
    val = val / 1000;
    val = val.toFixed(1) + 'km';
  } else {
    val += 'm';
  }
  return val;
}

function clearResults() {
  $('.panel-collapse').each(function (i, listPanels) {
    listPanels.innerHTML = '';
  });
}

function getDetails(result, i) {
  return function () {
    places.getDetails({
      reference: result.reference
    }, showInfoWindow(i));
  };
}
var rad = function rad(x) {
  return x * Math.PI / 180;
};

function showInfoWindow(i) {
  return function (place, status) {
    if (iw) {
      iw.close();
      iw = null;
    }

    var lat = markers[i].getPosition().lat();
    var lng = markers[i].getPosition().lng();
    destination = new google.maps.LatLng(lat, lng);
    getDistance(myLatlng, destination);

    if (status == google.maps.places.PlacesServiceStatus.OK) {
      iw = new google.maps.InfoWindow({
        content: getIWContent(place)
      });
      iw.open(map, markers[i]);
    }
  };
}

function getIWContent(place) {
  var content = "";
  content += '<table><tr><td>';
  content += '<img class="placeIcon" src="' + place.icon + '"/></td>';
  content += '<td><b><a href="' + place.url + '">' + place.name + '</a></b>';
  content += '<td><b>' + ", Distance " + convertUnits(distance) + '</b>';
  content += '</td></tr></table>';
  return content;
}

function loadMenu() {
  $('#accordion').html('');
  var panel = '';
  $.each(menuItems, function (index, item) {
    panel += '<div class="panel panel-default">\n                  <div class="panel-heading ' + (index > 0 ? 'collapsed' : '') + '" onclick="search(' + (index + 1) + ')" data-toggle="collapse" data-parent="#accordion" href="#collapse' + (index + 1) + '">\n                      <h4 class="panel-title">\n                        <a>' + item + '</a>\n                      </h4>\n                    </div>\n                    <div id="collapse' + (index + 1) + '" class="panel-collapse ' + (index === 0 ? 'collapse in' : '') + '">\n                      <div class="panel-body">\n                        <div class="list-group result-group">\n                        </div>\n                      </div>\n                    </div>\n                  </div>';
  });
  $('#accordion').html(panel);
}