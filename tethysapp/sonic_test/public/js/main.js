var map;
var wmsLayer;

let $loading = $('#view-file-loading');
var m_downloaded_historical_streamflow = false;

function init_map() {
    var base_layer = new ol.layer.Tile({
        source: new ol.source.BingMaps({
            key: 'eLVu8tDRPeQqmBlKAjcw~82nOqZJe2EpKmqd-kQrSmg~AocUZ43djJ-hMBHQdYDyMbT-Enfsk0mtUIGws1WeDuOvjY4EXCH-9OK3edNLDgkc',
            imagerySet: 'Road'
        })
    })

    var streams = new ol.layer.Image({
		source: new ol.source.ImageWMS({
			url: 'https://geoserver.hydroshare.org/geoserver/HS-9b6a7f2197ec403895bacebdca4d0074/wms',
			params: { 'LAYERS': 'south_america-peru-geoglows-drainage_line' },
			serverType: 'geoserver',
			crossOrigin: 'Anonymous'
		}),
		opacity: 0.5
	});

	wmsLayer = streams;

    map = new ol.Map({
        target: 'map',
        layers: [base_layer,streams],
        view: new ol.View({
            center: ol.proj.fromLonLat([-77.02824,-10.07318]),
            zoom: 6
        })
    });
}

function get_hydrographs (watershed, subbasin, region, comid) {
	$('#hydrographs-loading').removeClass('hidden');
	m_downloaded_historical_streamflow = true;
    $.ajax({
        url: 'get-hydrographs',
        type: 'GET',
        data: {
            'watershed': watershed,
            'subbasin': subbasin,
            'region': region,
            'comid': comid,
        },
        contentType: "application/json",
        error: function(e) {
            $('#hydrographs-loading').addClass('hidden');
            console.log(e);
            $('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the data</strong></p>');
            $('#info').removeClass('hidden');

            setTimeout(function () {
                $('#info').addClass('hidden')
            }, 5000);
        },
        success: function (data) {
            if (!data.error) {
                console.log("get_hydrographs in");
                $('#hydrographs-loading').addClass('hidden');
                $('#dates').removeClass('hidden');
                $loading.addClass('hidden');
                $('#hydrographs-chart').removeClass('hidden');
                $('#hydrographs-chart').html(data);

                //resize main graph
                Plotly.Plots.resize($("#hydrographs-chart .js-plotly-plot")[0]);
                Plotly.relayout($("#hydrographs-chart .js-plotly-plot")[0], {
                	'xaxis.autorange': true,
                	'yaxis.autorange': true
                });

                var params_sim = {
                    watershed: watershed,
                	subbasin: subbasin,
                	region: region,
                	comid: comid,
                };

                $('#submit-download-simulated-discharge').attr({
                    target: '_blank',
                    href: 'get-simulated-discharge-csv?' + jQuery.param(params_sim)
                });

                $('#download_simulated_discharge').removeClass('hidden');

           		 } else if (data.error) {
                 $('#hydrographs-loading').addClass('hidden');
                 console.log(data.error);
           		 	$('#info').html('<p class="alert alert-danger" style="text-align: center"><strong>An unknown error occurred while retrieving the Data</strong></p>');
           		 	$('#info').removeClass('hidden');

           		 	setTimeout(function() {
           		 		$('#info').addClass('hidden')
           		 	}, 5000);
           		 } else {
           		 	$('#info').html('<p><strong>An unexplainable error occurred.</strong></p>').removeClass('hidden');
           		 }
               console.log("get_hydrographs out");

       		}
    });
};

function map_events() {

    map.on('pointermove', function(evt) {
		if (evt.dragging) {
			return;
		}
		var pixel = map.getEventPixel(evt.originalEvent);
		var hit = map.forEachLayerAtPixel(pixel, function(layer) {
			if (layer == wmsLayer) {
				current_layer = layer;
				return true;
			}
			});
		map.getTargetElement().style.cursor = hit ? 'pointer' : '';
	});

	map.on("singleclick", function(evt) {

	    if (map.getTargetElement().style.cursor == "pointer") {

	        var view = map.getView();
			var viewResolution = view.getResolution();
			var wms_url = current_layer.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, view.getProjection(), { 'INFO_FORMAT': 'application/json' });

			if (wms_url) {
			    $("#obsgraph").modal('show');
			    $('#hydrographs-chart').addClass('hidden');
			    $('#hydrographs-loading').removeClass('hidden');
			    $("#stream-info").empty()

			    $.ajax({
					type: "GET",
					url: wms_url,
					dataType: 'json',
					success: function (result) {
					    watershed = result["features"][0]["properties"]["watershed"];
		         		subbasin = result["features"][0]["properties"]["subbasin"];
		         		region = result["features"][0]["properties"]["region"];
		         		comid = result["features"][0]["properties"]["COMID"];
		         		$("#stream-info").append('<h3 id="Watershed-Tab">Watershed: '+ watershed
                        			+ '</h3><h5 id="Subbasin-Tab">Subbassin: '
                        			+ subbasin + '</h3><h5 id="Region-Tab">Region: '
                        			+ region+ '</h5><h5>COMID: '+ comid + '</h5>');
                        get_hydrographs (watershed, subbasin, region, comid);
					},
					error: function(e){
                      console.log(e);
                    }
				});

			}

	    }

	});

}

$(function() {
    init_map();
    map_events();
});
