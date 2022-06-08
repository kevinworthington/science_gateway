var api_request=null
var markers =[]
var marker_group = null
var colors=['#00ff00','#ffff00','#ff7e00','#ff0000','#8f3f97','#7d0122']
const API_KEY = "7A5BD8CD-E1C5-11EC-8561-42010A800005"// best to request your own contact@purpleair.com

$(document).ready(function(){
    // do jQuery
    var map = L.map('map').setView([40.5826635,-105.1032215], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
    }).addTo(map);

    marker_group = L.layerGroup();

    marker_group.addTo(map)

    L.control.GradientControl({
        position: 'bottomleft'
      }).addTo(map);

    

    //Add API call on map move
    map.on('moveend', function(e) {
        var b = map.getBounds();
        var url = 'https://api.purpleair.com/v1/sensors?fields=sensor_index,name,latitude,longitude,pm2.5_alt,last_modified&location_type=0&'
        url+='nwlng='+b._southWest.lng+'&nwlat='+b._northEast.lat+'&selng='+b._northEast.lng+'&selat='+b._southWest.lat
        url+='&api_key='+API_KEY
        make_map_change_request(url,create_list)
    
    });

    map.fire('moveend');
 })
 
 var api_request=null
 var markers =[]
 var marker_group = L.layerGroup()
 var make_map_change_request =function (url,call_back){
    if (api_request){ clearTimeout(api_request); }
    api_request =setTimeout(() => {
        $.ajax({
            url: url,
            success: function (response) {
                    if (response?.data){
                        call_back(response.data);
                    }else{
                        call_back(response);
                    }
                        
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
      }, 2000)
 }

 var create_list=function(items){
     $("#sensors").empty();
     marker_group.clearLayers();
     marker=[];
     for (d in items){
        var s = items[d];
        console.log(s,s[4])
        $("#sensors").append('<a href="#" class="list-group-item list-group-item-action active">'+s[1]+'</a>')
        var marker = new L.Marker(new L.LatLng(s[2],s[3]), {
            icon:	new L.NumberedDivIcon({number: s[4]})
        });
        marker.id = s[0]
        // add marker click
        marker.on("click", function(e) {
            // marker.id will not work
            get_chart_data(e.target.id);

         });


        markers.push(marker);
        marker.addTo(marker_group);
     }
     
 }

 L.NumberedDivIcon = L.Icon.extend({
	options: {
    // EDIT THIS TO POINT TO THE FILE AT http://www.charliecroom.com/marker_hole.png (or your own marker)
    // iconUrl: '<%= image_path("leaflet/marker_hole.png") %>',
    number: '',
    shadowUrl: null,
    iconSize: new L.Point(25, 0),
		iconAnchor: new L.Point(13, 00),
		popupAnchor: new L.Point(0, 0),
		className: 'leaflet-div-icon'
	},

	createIcon: function () {
		var div = document.createElement('div');
		// var img = this._createImg(this.options['iconUrl']);
        var dot = document.createElement('div');
		var numdiv = document.createElement('div');
		numdiv.setAttribute ( "class", "number" );
		numdiv.innerHTML = this.options['number'] || '';
		// div.appendChild ( img );
        div.appendChild ( dot );
        dot.setAttribute ( "class", "dot" );
        dot.style["background-color"] = get_color(this.options['number']);
		div.appendChild ( numdiv );
		this._setIconStyles(div, 'icon');
		return div;
	},

	//you could change this to add a shadow like in the normal marker if you really wanted
	createShadow: function () {
		return null;
	}
});

function get_color(num){
    var context = $("#gradient_bg")[0].getContext('2d')
    var length=200
    var max = 250
    var percent=num/max
    console.log(length,percent,Math.round(length*percent))
    var color = context.getImageData(Math.round(length*percent), 0, 1, 1)
    var d = color.data 
    return "rgb("+d[0]+", "+d[1]+", "+d[2]+")"
}

function get_chart_data(id){
    var now=new Date()
    var start_time=new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
   
    var url = 'https://june2022.api.purpleair.com/v1/sensors/'+id+'/history/csv?start_timestamp='+start_time.getTime()/1000+'&end_timestamp='+now.getTime()/1000+'&fields=pm2.5_atm_a,pm2.5_atm_b&average=60'
    url+='&api_key='+API_KEY
    chart(url)
    
}