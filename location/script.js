
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
  gestureHandling: 'none'
  zoomControl: false


  var myOptions = {
    zoom: 16.3,
    disableDefaultUI: true,
    center: myLatlng,
    scrollwheel: false,
    zoomControl: true,
    styles: [
      {
        "featureType": "poi",
        "stylers": [
          { "visibility": "off" }
        ]
      }
    ],
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    //icon: imags
  }


  /*googleMap.addMarker(new MarkerOptions()
  .position(myLatlng)
  .title("OZONE")
  .showInfoWindow();
  
   
/*var images = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';*/



  //scaleControl: true

  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var zoomControlDiv = document.createElement('div');
  var zoomControl = new ZoomControl(zoomControlDiv, map);

  zoomControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(zoomControlDiv);
  places = new google.maps.places.PlacesService(map);
  google.maps.event.addListener(map, 'tilesloaded', tilesLoaded);
  autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    showSelectedPlace();
  });
}

function CenterControl() {
  console.log("worked");
  ImageSet.addEventListener('click', function () {
    map.setCenter(myLatlng);
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



function tilesLoaded() {
  google.maps.event.clearListeners(map, 'tilesloaded');
  google.maps.event.addListener(map, 'zoom_changed', search);
  google.maps.event.addListener(map, 'dragend', search);
  search();
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

function search() {
  maiiw();
  var type;
  for (var i = 0; i < document.controls.type.length; i++) {
    if (document.controls.type[i].checked) {
      type = document.controls.type[i].value;
    }
  }

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
      for (var i = 0; i < results.length; i++) {
        markers[i] = new google.maps.Marker({

          position: results[i].geometry.location,
          //animation: google.maps.Animation.DROP	
          icon: 'http://www.maddog.in/reia/ozone_location/locmark.png'

        });
        google.maps.event.addListener(markers[i], 'click', getDetails(results[i], i));
        setTimeout(dropMarker(i), i * 100);
        addResult(results[i], i);

      }
    }
  })
  console.log("any message");




}

function getDistance(p1, p2) {
  var R = 6378137; // Earth’s mean radius in meter

  var dLat = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  distance = R * c;
  console.log(distance);
  return distance;

  //Console.log("%f ",d, "background: blue; color: black; padding-left:10px;");
  // returns the distance in meter
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
  }
}

function addResult(result, i) {
  var results = document.getElementById("results");
  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 == 0 ? '#F0F0F0' : '#FFFFFF');
  tr.onclick = function () {
    google.maps.event.trigger(markers[i], 'click');
  };

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = result.icon;
  icon.setAttribute("class", "placeIcon");
  icon.setAttribute("className", "placeIcon");
  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

function clearResults() {
  var results = document.getElementById("results");
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

function getDetails(result, i) {
  return function () {
    places.getDetails({
      reference: result.reference
    }, showInfoWindow(i));
  }
}
var rad = function (x) {
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
  }
}

function getIWContent(place) {
  var content = "";
  content += '<table><tr><td>';
  content += '<img class="placeIcon" src="' + place.icon + '"/></td>';
  content += '<td><b><a href="' + place.url + '">' + place.name + '</a></b>';
  content += '<td><b>' + ", Distance " + Math.round(distance) + "m" + '</b>';
  content += '</td></tr></table>';
  return content;
}
