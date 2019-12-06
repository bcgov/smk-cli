function configureLayerSelector()
{
	catalogTreeSource = [];
	$("#catalog-tree").fancytree(
	{
		extensions: ["filter"],
		quicksearch: true,
		filter: {
			autoApply: true,
	        autoExpand: true,
	        counter: true,
	        fuzzy: false,
	        hideExpandedCounter: true,
	        hideExpanders: false,
	        highlight: true,
	        leavesOnly: false,
	        nodata: true,
	        mode: "hide"
	      },
	    checkbox: true,
	    selectMode: 3,
	    source: [],
	    activate: function(event, data)
	    {
	    },
	    select: function(event, data)
	    {
	    }
	});

	$("#btnResetDbcTreeSearch").click(function(e)
	{
		$("#searchDbcTree").val("");
		$("#dbcTreeMatches").text("");
		$("#catalog-tree").fancytree("getTree").clearFilter();
		$("#btnResetDbcTreeSearch").attr("disabled", true);
	}).attr("disabled", true);

	catalogLayers.forEach(function(catalogItem)
	{
		catalogTreeSource.push(createTreeItem(catalogItem));

		var tree = $('#catalog-tree').fancytree('getTree');
		if(tree) tree.reload(catalogTreeSource);
	});
}

function createTreeItem(catalogItem)
{
	var item = {
					title: catalogItem.label,
					folder: catalogItem.hasOwnProperty('layers') || catalogItem.hasOwnProperty('folders'),
					expanded: false,
					data: catalogItem,
					children: []
				};

	for (var subItem in catalogItem.folders)
	{
		item.children.push(createTreeItem(catalogItem.folders[subItem]));
	}

	for (var subItem in catalogItem.layers)
	{
		item.children.push(createTreeItem(catalogItem.layers[subItem]));
	}

	return item
}

function catalogTreeFilter()
{
	var tree = $("#catalog-tree").fancytree('getTree');
	var match = $("#searchDbcTree").val();
	var opts =
	{
	    autoApply: true,
        autoExpand: true,
        counter: true,
        fuzzy: false,
        hideExpandedCounter: true,
        hideExpanders: false,
        highlight: true,
        leavesOnly: false,
        nodata: true,
        mode: "hide"
	};
	
	var n;

	if(match.length > 2)
	{
		n = tree.filterBranches.call(tree, match, opts);
		$("#btnResetDbcTreeSearch").attr("disabled", false);
		$("#dbcTreeMatches").text("(" + n + " matches)");
	}
	else
	{
		$("#catalog-tree").fancytree("getTree").clearFilter();
		$("#dbcTreeMatches").text("");
	}
}

function removeLayer(layerId)
{
	app.config.layers.forEach(function(layer)
	{
		if(layer.id === layerId)
		{
			// remove this layer
			var index = app.config.layers.indexOf(layer);
			if (index !== -1)
			{
				app.config.layers.splice(index, 1);
			}

			// delete from layers tool display
			for(var tool in app.config.tools)
			{
				tool = app.config.tools[tool];
				if(tool.type == "layers")
				{
					removeLayerFromDisplay(layerId, tool.display);
				}
			}
		}
	});
}

function removeLayerFromDisplay(layerId, layers)
{
	for(var displayLayer in layers)
	{
		if(displayLayer.type === 'folder')
		{
			removeLayerFromDisplay(layerId, displayLayer.items);
		}
		else
		{
			if(displayLayer.id === layerId)
			{
				var index = layers.indexOf(displayLayer);
				if (index !== -1)
				{
					layers.splice(index, 1);
					break;
				}
			}
		}
	}
}

function addLayerToConfig(layer)
{
	if(!app.config.layers) app.config.layers = [];
	app.config.layers.push(layer);

	// create layer display object
	for(var tool in app.config.tools)
	{
		tool = app.config.tools[tool];
		if(tool.type == "layers")
		{
			if(!tool.display) tool.display = [];
			
			tool.display.push(
			{
				id: layer.id,
				type: "layer",
				title: layer.title,
				isVisible: true
			});
		}
	}
}

function addSelectedCatalogLayer()
{
	var nodes = $("#catalog-tree").fancytree('getTree').getSelectedNodes();

	nodes.forEach(function(node)
   	{
		if(node.folder == false && node.data.mpcmId != 0)
		{
			$.ajax
			({
				url: serviceUrl + 'LayerLibrary/' + node.data.mpcmId,
				type: 'get',
				dataType: 'json',
				contentType:'application/json',
				success: function (catalogItem)
				{
					if(catalogItem.mpcmWorkspace == "MPCM_ALL_PUB")
					{
						catalogItem.isVisible = true;
						catalogItem.isQueryable = true;
						
						addLayerToConfig(catalogItem);
					}
					else
					{
						M.toast({ html: 'Error loading MPCM Layer. This layer may be secure.'});
					}
				},
				error: function (status)
				{
					M.toast({ html: 'Error loading MPCM Layer. This layer may be secure.'});
				}
			});
		}

		node.setSelected(false);
   	});
}

function loadWmsLayers()
{
	$("#wmsPanelLoading").show();
	$("#wmsRefreshButton").hide();
	$("#wmsPanel").hide();

	$("#wms-catalog-tree").fancytree({
		extensions: ["filter"],
		quicksearch: true,
		filter: {
			autoApply: true,
	        autoExpand: true,
	        counter: true,
	        fuzzy: false,
	        hideExpandedCounter: true,
	        hideExpanders: false,
	        highlight: true,
	        leavesOnly: false,
	        nodata: true,
	        mode: "hide"
	    },
	    checkbox: true,
	    selectMode: 3,
	    source: [],
	    activate: function(event, data)
	    {
	    },
	    select: function(event, data)
	    {
	    }
	});

	$("#btnResetWmsTreeSearch").click(function(e)
	{
	    $("#searchWmsTree").val("");
	    $("#wmsTreeMatches").text("");
	    $("#wms-catalog-tree").fancytree("getTree").clearFilter();
	    $("#btnResetWmsTreeSearch").attr("disabled", true);
	}).attr("disabled", true);
	
	var wmsUrl = $("#wmsUrlField").val();

	$.ajax
	({
		url: serviceUrl + "LayerLibrary/wms/" + encodeURIComponent(wmsUrl + '?service=WMS&request=GetCapabilities'),
        type: 'get',
        dataType: 'json',
        contentType:'application/json',
        success: function (data)
        {
			var catalogTreeSource = [];

        	data.forEach(function(catalogItem)
        	{
        		catalogTreeSource.push(createWmsTreeItem(catalogItem));

        		var tree = $('#wms-catalog-tree').fancytree('getTree');
        		tree.reload(catalogTreeSource);
        	});

        	$("#wmsPanelLoading").hide();
        	$("#wmsRefreshButton").show();
        	$("#wmsPanel").show();
        },
        error: function (status)
        {
            // error handler
            M.toast({ html: 'Error loading GetCapabilities from ' + wmsUrl + '. Please try again later. Error: ' + status.responseText});
            console.log('Error loading GetCapabilities from ' + wmsUrl + '. Error: ' + status.responseText);
            $("#wmsPanelLoading").hide();
            $("#wmsRefreshButton").show();
        	$("#wmsPanel").show();
        }
	});
}

function createWmsTreeItem(wmsItem)
{
	var item = {
			title: wmsItem.title,
			folder: false,
			expanded: false,
			data: wmsItem,
			children: []
		};

	for (var subItem in wmsItem.styles)
	{
		var styleData = wmsItem.styles[subItem];

		var styleItem = {
				title: styleData.title,
				folder: false,
				expanded: false,
				data: { wms: wmsItem, style: styleData }
			};

		item.children.push(styleItem);
	}

	return item
}

function wmsTreeFilter()
{
	var tree = $("#wms-catalog-tree").fancytree('getTree');
	var match = $("#searchWmsTree").val();
	var opts = 
	{
	    autoApply: true,
        autoExpand: true,
        counter: true,
        fuzzy: false,
        hideExpandedCounter: true,
        hideExpanders: false,
        highlight: true,
        leavesOnly: false,
        nodata: true,
        mode: "hide"
    };
	var n;

	if(match.length > 2)
	{
		n = tree.filterBranches.call(tree, match, opts);
		$("#btnResetWmsTreeSearch").attr("disabled", false);
		$("#wmsTreeMatches").text("(" + n + " matches)");
	}
	else
	{
		$("#wms-catalog-tree").fancytree("getTree").clearFilter();
		$("#wmsTreeMatches").text("");
	}
}

function addSelectedWmsLayer()
{
	var nodes = $("#wms-catalog-tree").fancytree('getTree').getSelectedNodes();

	nodes.forEach(function(node)
   	{
		if(node.folder == false)
		{
			// add to layers
			addLayerToConfig(node.data);
		}
	});
}

function configureLayersView()
{
	var sourceData = [];
	
	// copy the display order from the layer tool display
	// should we also merge in any layers from the main layer selections?
	for(var tool in app.config.tools)
	{
		tool = app.config.tools[tool];
		if(tool.type == "layers")
		{
			for(var displayLayer in tool.display)
			{
				displayLayer = tool.display[displayLayer];
				var item = processDisplayLayer(displayLayer);
				sourceData.push(item);
			}
		}
	}

	$("#layer-display-tree").fancytree({
		extensions: ["childcounter", "edit", "dnd5"],
	    checkbox: false,
	    selectMode: 1,
	    source: sourceData,
	    activate: function(event, data)
	    {
	    },
	    select: function(event, data)
	    {
	    },
	    childcounter: 
	    {
	        deep: true,
	        hideZeros: true,
	        hideExpanded: true
	    },
	    dnd5: 
	    {
	        autoExpandMS: 400,
	        // preventForeignNodes: true,
	        // preventNonNodes: true,
	        preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
	        preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
	        scroll: true,
	        scrollSpeed: 7,
	        scrollSensitivity: 10,
	        dragStart: function(node, data)
	        {
	          return true;
	        },
	        dragDrag: function(node, data) 
	        {
	          data.dataTransfer.dropEffect = "move";
	        },
	        dragEnd: function(node, data) 
	        {
	        },
	        dragEnter: function(node, data) 
	        {
	          // node.debug("dragEnter", data);
	          data.dataTransfer.dropEffect = "move";
	          data.dataTransfer.effectAllowed = "copy";
	          return true;
	        },
	        
	        dragOver: function(node, data) 
	        {
	          data.dataTransfer.dropEffect = "move";
	          data.dataTransfer.effectAllowed = "copy";
	        },
	        dragLeave: function(node, data) 
	        {
	        },
	        dragDrop: function(node, data) 
	        {
	          node.debug("drop", data);

	          if( data.otherNode ) 
	          {
	        	if(node.data.type != "layer" || data.hitMode == "after" || data.hitMode == "before")
            	{
	        	    data.otherNode.moveTo(node, data.hitMode);
            	}
	        	else if(node.data.type == "layer")
        		{
	        		data.otherNode.moveTo(node, "after");
        		}
	          }
	          
			  node.setExpanded();
			  
			  // update the app.config.tool.display
			  syncLayerDisplay();
	        }
	      },
	    edit: 
	    {
	        triggerStart: ["clickActive", "dblclick", "f2", "mac+enter", "shift+click"],
	        beforeEdit: function(event, nodeData)
	        {
	          // Return false to prevent edit mode
	        },
	        edit: function(event, nodeData)
	        {
	          // Editor was opened (available as data.input)
	        },
	        beforeClose: function(event, nodeData)
	        {
	          // Return false to prevent cancel/save (data.input is available)
	        },
	        save: function(event, nodeData)
	        {
	          return true;
	        },
	        close: function(event, nodeData)
	        {
	          // Editor was removed
	          if( nodeData.save ) 
	          {
	        	  // update the node data
	        	  nodeData.node.data.title = nodeData.node.title;
	        	  
	        	  // update the source layer, if this is a layer node, so we stay consistent
	        	  // note that theoretically you don't have to keep these in sync, detail view
	        	  // overrides layer name.
	        	  if(nodeData.node.data.type == "layer")
	        	  {
	        		  var tree = $('#layer-tree').fancytree('getTree');
    			      var layerSource = $("#layer-tree").fancytree("getRootNode").children;
    			      
	        		  for(var layerNode in layerSource)
	        		  {
    			    	  layerNode = layerSource[layerNode];
    			    	  if(layerNode.data.id== nodeData.node.data.id)
			    		  {
    			    		  layerNode.data.title = nodeData.node.title;
    			    		  layerNode.title = nodeData.node.title;
    			    		  
    			    		  // update the layer tree
    			    		  tree.reload(layerSource);
    			    		  
    			    		  break;
    			    	  }
	        		  }
	        	  }
	        	  
	              // Since we started an async request, mark the node as preliminary
				  $(nodeData.node.span).addClass("pending");
				  
				  // update the config
				  syncLayerDisplay();
	          }
	        }
	    },
	    activate: function(event, nodeData) 
	    {
			$('#toggleNodeVisbility').prop('checked', nodeData.node.data.isVisible);
	    }    
	});
}

function processDisplayLayer(displayLayer)
{
	var item = 
	{
		title: displayLayer.title,
		folder: displayLayer.type == "folder" || displayLayer.type == "group",
		expanded: false,
		data: displayLayer,
		children: []
	};
	
	if(item.folder)
	{
		for(var subLayer in displayLayer.items)
		{
			subLayer = displayLayer.items[subLayer];
			item.children.push(processDisplayLayer(subLayer));
		}
	}
	
	return item;
}

function addNewDisplayFolder()
{
	// if a node is selected, drop the new folder on it
	var node = $("#layer-display-tree").fancytree("getActiveNode");

	var folder = 
	{
		title: "New Folder",
		folder: true,
		expanded: false,
		data: 
		{
			id: uuid(),
		    type: "folder",
		    title: "New Folder",
		    isVisible: true,
		    isExpanded: false,
		    items: []
		},
		children: []
	};

	if(!node)
	{
		$("#layer-display-tree").fancytree("getRootNode").addChildren(folder);
	}
	else
	{
		// if the node is a folder, create a new folder within
		// if the node is a layer, create a folder at the root and move the layer into it
		// if the node is a group, cancel event
		if(node.data.type == "folder") node.appendSibling(folder);
		else if(node.data.type == "layer")
		{
			var child = node.parent.addChildren(folder);
			node.moveTo(child, "child");
		}
		if(node.data.type == "group")
		{
			M.toast({ html: 'Cannot create a folder within a group!'});
		}
	}

	syncLayerDisplay();
}

function addNewDisplayGroup()
{
	// set new item id to random guid?
	var node = $("#layer-display-tree").fancytree("getActiveNode");
		
	var item = 
	{
		title: "New Group",
		folder: true,
		expanded: false,
		data: 
		{
			id: uuid(),
			type: "group",
			title: "New Group",
			isVisible: true,
			isExpanded: false,
			items: []
		},
		children: []
	};

	if(!node)
	{
		// put a folder at the root
		$("#layer-display-tree").fancytree("getRootNode").addChildren(item);
	}
	else
	{
		// if the node is a folder, create a new folder within
		// if the node is a layer, create a folder at the root and move the layer into it
		// if the node is a group, cancel event
		if(node.data.type == "folder") node.appendSibling(item);
		else if(node.data.type == "layer")
		{
			var child = node.parent.addChildren(item);
			node.moveTo(child, "child");
		}
		if(node.data.type == "group")
		{
			M.toast({ html: 'Cannot create a Group within a group!'});
		}
	}

	syncLayerDisplay();
}

function removeSelectedDisplayLayer()
{
	var node = $("#layer-display-tree").fancytree("getActiveNode");
	
	if(node && node.data.type != "layer")
	{
		while( node.hasChildren() ) 
		{
			node.getFirstChild().moveTo(node.parent, "child");
		}
			
		node.remove();
	}
	else
	{
		M.toast({ html: 'Cannot remove layers. Toggle visibility instead.'});
	}

	syncLayerDisplay();
}

function resetLayerDisplay()
{
	for(var tool in app.config.tools)
	{
		tool = app.config.tools[tool];
		if(tool.type == "layers")
		{
			tool.display = [];

			for(var layerIdx in app.config.layers)
			{
				var layer = app.config.layers[layerIdx];
				tool.display.push(
				{
					id: layer.id,
					type: "layer",
					title: layer.title,
					isVisible: true
				});
			}
		}
	}

	configureLayersView();
	// force the page to refresh. Not pretty...
	app.componentKey += 1;
	app.tabSwitch('init');
	app.tabSwitch('layers');
}

function syncLayerDisplay()
{
	// get layers tool
	for(var tool in app.config.tools)
	{
		tool = app.config.tools[tool];
		if(tool.type == "layers")
		{
			// turf existing display order
			tool.display = [];
			
			// get nodes
			var nodes = $("#layer-display-tree").fancytree('getTree').rootNode.children;
			
			// for each item, create a new display object
			for(var item in nodes)
			{
				tool.display.push(createDisplayLayersFromNodes(nodes[item]));
			}
		}
	}
}

function toggleLayerNodeVisibility()
{
	var node = $("#layer-display-tree").fancytree("getActiveNode");
	if(node)
	{
		node.data.isVisible = !node.data.isVisible;
		syncLayerDisplay();
	}
}
function createDisplayLayersFromNodes(node)
{
	var item = 
	{ 
		id: node.data.id,
		type: node.data.type,
		title: node.data.title,
		isVisible: node.data.isVisible
	};
	
	if(node.data.type == "folder" || node.data.type == "group")
	{
		if(node.data.type == "folder") 
		{
			item.isExpanded = false;
		}
		
		item.items = [];
		for(var child in node.children)
		{
			child = node.children[child];
			var subItem = createDisplayLayersFromNodes(child);
			
			item.items.push(subItem);
		}
	}
	
	return item;
}

function editLayer(layerId)
{
	app.config.layers.forEach(function(layer)
	{
		if(layer.id === layerId)
		{
			app.editingLayer = layer;
			app.tabSwitch('edit-layer');
		}
	});
}