function createVectorLayer()
{
	if($("#vectorName").val() == null || $("#vectorName").val() == '') $("#vectorName").val(uuid());
	
	var layer = {
		type: "vector",
		id: $("#vectorName").val().replace(/\s/g , "-").toLowerCase(),
		title: $("#vectorName").val(),
		isVisible: true,
		isQueryable: true,
		opacity: 0.65,
		attribution: "",
		minScale: null,
		maxScale: null,
		titleAttribute: null,
		metadataUrl: null,
		attributes: [ ],
		useRaw: true,
		useClustering: false,
		useHeatmap: false,
		isWfs: $('#vectorType').val() === 'wfs',
		dataUrl: null,
		style:
		{ 
			strokeWidth: "1",
			strokeStyle: "1",
			strokeColor: "#ff0000",
			strokeOpacity: "1",
			fillColor: "#ff0000",
			fillOpacity: "0.65",
			markerSize:[ "12", "12" ],
			markerOffset:[ "12", "12" ],
			markerUrl: null
		},
		queries: []	
	};

	if($("#vectorUrl").val())
	{
		// if we have a vector URL create the layer without any file import
		layer.dataUrl = $("#vectorUrl").val();
		app.config.layers.push(layer);
	}
	else
	{
		switch($('#vectorType').val()) 
		{
			case 'vector':
				var reader = new FileReader();

				reader.onload = function(e)
				{
					app.config.layers.push(layer);
					saveGeoJsonFile(layer.id, e.target.result);
				};
				
				reader.readAsText(fileContents);
			break;
			case 'kml':
				var documentData = new FormData();
				documentData.append('file', fileContents);
				
				$.ajax
				({
					url: serviceUrl + "ProcessKML",
					type: "post",
					data: documentData,
					cache: false,
					contentType: false,
					processData: false,
					success: function (convertedKml)
					{
						app.config.layers.push(layer);
						saveGeoJsonFile(layer.id, convertedKml);
					},
					error: function (status)
					{
						// error handler
						M.toast({ html: 'Error converting KML. Error: ' + status.responseText});
						console.log('Error converting KML. Error: ' + status.responseText);
					}
				});
			break;
			case 'kmz':
				// send to service to unzip, convert and return json
			break;
			case 'shape':
				// send to service to unzip, convert and return json
			break;
			case 'pgdb':
				// send to service to unzip, convert and return json
			break;
			case 'fgdb':
				// send to service to unzip, convert and return json
			break;
			case 'csv':
				var reader = new FileReader();

				reader.onload = function(e)
				{
					var layers = omnivore.csv.parse(e.target.result);

					var keys = Object.keys(layers._layers);
					var json = { type: "FeatureCollection", features: []};
					for(var i = 0; i < keys.length; i++)
					{
						var feature = layers._layers[keys[i]].feature;
						json.features.push(feature);
					}

					app.config.layers.push(layer);
					saveGeoJsonFile(layer.id, json);
				};
				
				reader.readAsText(fileContents);
			break;
		}
	}
}