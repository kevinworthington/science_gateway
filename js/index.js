$(document).ready(function(){
    // do jQuery
    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

    //Add API call on map move
    map.on('moveend', function(e) {
        var b = map.getBounds();
    
    var url = 'https://api.purpleair.com/v1/sensors?fields=sensor_index,name,latitude,longitude&,pm2.5_alt,last_modified&location_type=0&'
    url+='nwlng='+b._southWest.lng+'&nwlat='+b._northEast.lat+'&selng='+b._northEast.lng+'&selat='+b._southWest.lat
    url+='&api_key=7A5BD8CD-E1C5-11EC-8561-42010A800005'
    make_map_change_request(url)
    
    });
 })
 
 var api_request=null
 var make_map_change_request =function (url){
    if (api_request){ clearTimeout(api_request); }
    api_request =setTimeout(() => {
        $.ajax({
            url: url, dataType: "json",
            success: function (response) {
                    
                    create_list(response.data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
      }, 2000)
 }

 var create_list=function(items){
     $("#sensors").empty()

     for (d in items){
        var s = items[d]
        console.log(s)
        $("#sensors").append('<a href="#" class="list-group-item list-group-item-action active">'+s[1]+'</a>')
     }

 }