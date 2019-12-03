var getQueryString = function ( field, url ) 
{
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);

    return string ? string[1] : null;
};

//generate a randomish guid
function uuid() 
{
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) 
	{
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

function configureBasemapViewer()
{
	// configure the basemap tabs map component
	basemapViewer = L.map('basemapViewer', { zoomControl: false });
	// add a base layer (osm for now)
	setBasemap(app.config.viewer.baseMap);
	basemapViewer.invalidateSize();

	if(app.config.viewer.location.center && parseFloat(app.config.viewer.location.center[0]) && parseFloat(app.config.viewer.location.center[1]))
	{
		basemapViewer.setView([app.config.viewer.location.center[1], app.config.viewer.location.center[0]], app.config.viewer.location.zoom);
	}
	else
	{
		var sw = L.latLng(app.config.viewer.location.extent[1], app.config.viewer.location.extent[2]);
		var ne = L.latLng(app.config.viewer.location.extent[3], app.config.viewer.location.extent[0]);
		var bounds = L.latLngBounds(sw, ne);

		basemapViewer.fitBounds(bounds);
	}

	basemapViewer.on('moveend', function()
	{
		var bounds = basemapViewer.getBounds();
		var center = basemapViewer.getBounds().getCenter();

		if(bounds.getWest() != bounds.getEast() && bounds.getNorth() != bounds.getSouth())
		{
			app.config.viewer.location.extent[0] = bounds.getWest();
			app.config.viewer.location.extent[1] = bounds.getNorth();
			app.config.viewer.location.extent[2] = bounds.getEast();
			app.config.viewer.location.extent[3] = bounds.getSouth();
			
			app.config.viewer.location.center[0] = center.lng;
			app.config.viewer.location.center[1] = center.lat;
			app.config.viewer.location.zoom = basemapViewer.getZoom();
		}
	});
}

function setBasemap(id)
{
	basemapViewer.eachLayer(function (layer)
	{
		basemapViewer.removeLayer(layer);
	});

	basemapViewer.addLayer(L.esri.basemapLayer(id));
	basemapViewer.invalidateSize();
}

function configureFileUpload()
{
	document.getElementById('vectorFileUpload').addEventListener('change', readFile, false);
}

function configureUpdatePanel()
{
	// activate the material element
	$('.tabs').tabs();
	$('.collapsible').collapsible();

	// set the marker upload listener
	var div = document.getElementById('customMarkerFileUpload');
	if(div) div.addEventListener('change', readMarkerFile, false);

	// create the html editor panel
	$('#layer-popup-content').trumbowyg(
		{
			resetCss: true,
			semantic: false,
			btns: [
					['viewHTML'],
					['undo', 'redo'], // Only supported in Blink browsers
					['formatting'],
					['strong', 'em', 'del'],
					['superscript', 'subscript'],
					['foreColor', 'backColor'],
					['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
					['unorderedList', 'orderedList'],
					['horizontalRule'],
					['preformatted'],
					['template'],
					['removeformat'],
					['link'],
					['insertImage', 'base64'],
					['noembed'],
					['fullscreen']
				]
		});
		
		$('#layer-popup-content').on('tbwchange', function(delta, oldDelta, source)
		{
			app.editingLayer.popupTemplate = $("#layer-popup-content").trumbowyg('html');
		});
	
		$("#layer-popup-content").empty();
		$("#layer-popup-content").trumbowyg('html', "");
		$('#layer-popup-content').trumbowyg('toggle');
		$("#layer-popup-content").trumbowyg('html', app.editingLayer.popupTemplate);
}

function configureToolEditPanel()
{
	$('select').formSelect();
	M.textareaAutoResize($('#content'));
}

function editTool(tool)
{
	var tools = app.fetchTool(tool);
	var keys = Object.keys(tools);
	app.editingTool = tools[keys[0]];
}