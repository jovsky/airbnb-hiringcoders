async function initializeGoogleAPIs(){
    var options = {
        //types: ['(regions)'],

    }
    var autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('location-search'), options);
}

function loadMap(lat_, lng_){

    /*
    var pos = {
        lat: -18.4831, 
        lng: -47.3916
    };*/

    console.log(lat_+' '+ lng_+ ' '+ typeof(lng_)+' '+typeof(lng_));

    var pos = {
        lat: lat_, 
        lng: lng_
    };

    var optionsMap = {
        zoom: 15, 
        center: pos
    }
    //new google.maps.LatLng(LAT, LNG);
    // The map, centered at Position
    var map = new google.maps.Map(document.getElementById('modal-map'), optionsMap);

    var marker = new google.maps.Marker({position: pos, map: map});

}