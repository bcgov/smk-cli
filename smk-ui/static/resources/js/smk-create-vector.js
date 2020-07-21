function createVectorLayer()
{
	$('#importSpinner').toggle();
	$('#importButton').toggle();
	
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
		addLayerToConfig(layer);

		$('#importSpinner').toggle();
		$('#importButton').toggle();
	}
	else
	{
		switch($('#vectorType').val()) 
		{
			case 'vector':
				var reader = new FileReader();

				reader.onload = function(e)
				{
					addLayerToConfig(layer);
					saveGeoJsonFile(layer.id, e.target.result);
				};
				
				reader.readAsText(fileContents);
			break;
			case 'kml':
				submitToService(layer, 'ProcessKML');
			break;
			case 'kmz':
				submitToService(layer, 'ProcessKMZ');
			break;
			case 'shape':
				submitToService(layer, 'ProcessShape');
			break;
			case 'pgdb':
				// send to service to unzip, convert and return json
				// will need to reproject as well
			break;
			case 'fgdb':
				submitToService(layer, 'ProcessFGDB');
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

					addLayerToConfig(layer);
					saveGeoJsonFile(layer.id, json);
				};
				
				reader.readAsText(fileContents);
			break;
		}
	}
}

function submitToService(layer, endpoint)
{
	var documentData = new FormData();
	documentData.append('file', fileContents);
	
	$.ajax
	({
		url: serviceUrl + endpoint,
		type: "post",
		data: documentData,
		cache: false,
		contentType: false,
		processData: false,
		success: function (convertedFile)
		{
			// if we're converting an fgdb, we may have multiple
			// feature classes coming back. These will need to be 
			// individually added as unique layers and saved as
			// separate attachments
			if(endpoint === 'ProcessFGDB')
			{
				var featureClassKeys = Object.keys(convertedFile);
                for(var keyIdx = 0; keyIdx < featureClassKeys.length; keyIdx++)
                {
                    var key = featureClassKeys[keyIdx];
					var featureClass = convertedFile[key];

					// create layer
					var featureLayer = 
					{
						type: 'vector',
						id: key.replace(/\s/g , "-").toLowerCase(),
						title: key,
						isVisible: true,
						isQueryable: true,
						opacity: 0.65,
						attribution: '',
						minScale: null,
						maxScale: null,
						titleAttribute: null,
						metadataUrl: null,
						attributes: [ ],
						useRaw: true,
						useClustering: false,
						useHeatmap: false,
						isWfs: false,
						dataUrl: null,
						style:
						{ 
							strokeWidth: '1',
							strokeStyle: '1',
							strokeColor: '#ff0000',
							strokeOpacity: '1',
							fillColor: '#ff0000',
							fillOpacity: '0.65',
							markerSize:[ '12', '12' ],
							markerOffset:[ '12', '12' ],
							markerUrl: null
						},
						queries: []	
					};
					// add layer
					addLayerToConfig(featureLayer);
					// save file
					saveGeoJsonFile(featureLayer.id, featureClass);
                }
			}
			else
			{
				addLayerToConfig(layer);
				saveGeoJsonFile(layer.id, convertedFile);
			}
		},
		error: function (status)
		{
			// error handler
			M.toast({ html: 'Error converting vector file. Error: ' + status.responseText});
			console.log('Error converting vector file. Error: ' + status.responseText);
		}
	});
}