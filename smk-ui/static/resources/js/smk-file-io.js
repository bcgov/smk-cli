
var fileContents;

function readFile(e)
{
	fileContents = null;

	var file = e.target.files[0];

	if (!file)
	{
	    return;
	}

	fileContents = file;

	if(!file.type.startsWith("image/"))
	{
		$("#vectorName").val(file.name.replace('.', '-'));
	}

	M.updateTextFields();
}

function readMarkerFile(e)
{
	readFile(e);

	var reader = new FileReader();

	reader.onload = function(re)
	{

		app.editingLayer.style.markerUrl = '@' + app.editingLayer.id + '-marker';

		// push to service, save in attachments? or root?

		$.ajax
		({
			url: serviceUrl + 'SaveImage/' + app.editingLayer.id + '-marker',
			type: 'post',
			data: re.target.result,
			cache: false,
			contentType: false,
			processData: false,
			success: function ()
			{
				M.toast({ html: filename + ' uploaded'});
			},
			error: function (status)
			{
				// error handler
				M.toast({ html: 'Error saving file. Error: ' + status.responseText});
				console.log('Error saving file. Error: ' + status.responseText);
			}
		});
		// get the image dimensions and set size/offset accordingly
		var img = new Image();
	    img.addEventListener("load", function()
	    {
			$("#vectorMarkerSizeX").val(parseInt(this.naturalWidth));
			$("#vectorMarkerSizeY").val(parseInt(this.naturalHeight));
			$("#vectorMarkerOffsetX").val(parseInt(this.naturalWidth / 2));
			$("#vectorMarkerOffsetY").val(parseInt(this.naturalHeight / 2));

			M.updateTextFields();
	    });

	    img.src = re.target.result;
	};

	reader.readAsDataURL(fileContents);
}

function saveGeoJsonFile(filename, json)
{
	console.log('Saving geojson vector...');
	$.ajax
	({
		url: serviceUrl + "SaveAttachment/" + filename,
		type: "post",
		data: JSON.stringify(json),
		cache: false,
		contentType: false,
		processData: false,
		success: function (convertedKml)
		{
			M.toast({ html: filename + ' uploaded'});
			$('#importSpinner').toggle();
			$('#importButton').toggle();
		},
		error: function (status)
		{
			// error handler
			M.toast({ html: 'Error saving file. Error: ' + status.responseText});
			console.log('Error saving file: ' + status.responseText);
		}
	});
}

function loadConfig()
{
	// trigger the ajax load for edit copy configs
	$.ajax
	({
		url: serviceUrl + 'config',
        type: 'get',
        dataType: 'json',
        contentType:'application/json',
        success: function (resultData)
        {
            console.log(resultData);
            app.config = resultData;
        },
        error: function (status)
        {
            // error handler
			M.toast({ html: 'Error loading application. Error: ' + status.responseText});
            console.log('Error loading application. Error: ' + status.responseText);
        }
	});
}

function loadDataBCCatalogLayers()
{
    $.ajax
	({
		url: serviceUrl + 'LayerLibrary',
        type: 'get',
        dataType: 'json',
        contentType:'application/json',
        crossDomain: true,
        withCredentials: true,
        success: function (data)
        {
			catalogLayers = data;
			configureLayerSelector();
			$('#panelLoading').toggle();
        },
        error: function (status)
        {
			// error handler
			$('#panelLoading').toggle();
            M.toast({ html: 'Error loading DataBC Layer catalog. Please try again later. Error: ' + status.responseText});
            console.log('Error loading DataBC Layer catalog. Error: ' + status.responseText);
        }
	});
}

function saveConfig(config)
{

	// set revisions
	// config.lmfRevision += 1;
	// config.modifiedDate = new Date();
	// config.surround.title = config.name;

	$.ajax
	({
		url: serviceUrl + 'config',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(config),
        contentType:'application/json',
        crossDomain: true,
        withCredentials: true,
        success: function (result)
        {
			M.toast({html: 'Successfully saved config to ' + result.filename });
        },
        error: function (status)
        {
            M.toast({html: 'Error saving application. Error: ' + status.responseText});
        }
	});
}

// function testConfig(config)
// {

// 	// set revisions
// 	config.lmfRevision += 1;
// 	config.modifiedDate = new Date();
// 	config.surround.title = config.name;

// 	$.ajax
// 	({
// 		url: serviceUrl + 'TestConfig',
//         type: 'post',
//         dataType: 'json',
//         data: JSON.stringify(config),
//         contentType:'application/json',
//         crossDomain: true,
//         withCredentials: true,
//         success: function (result)
//         {
// 			M.toast({html: 'Successfully launched config'});
//         },
//         error: function (status)
//         {
//             M.toast({html: 'Error testing application. Error: ' + status.responseText});
//         }
// 	});
// }

// function buildConfig(config)
// {

// 	// set revisions
// 	config.lmfRevision += 1;
// 	config.modifiedDate = new Date();
// 	config.surround.title = config.name;

// 	$.ajax
// 	({
// 		url: serviceUrl + 'BuildConfig/true',
//         type: 'post',
//         success: function (result)
//         {
// 			M.toast({html: 'Build process executed'});
//         },
//         error: function (status)
//         {
//             M.toast({html: 'Error building application. Error: ' + status.responseText});
//         }
// 	});
// }
