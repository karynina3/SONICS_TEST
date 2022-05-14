var map;
var wmsLayer;

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

$(function() {
    init_map();
});
