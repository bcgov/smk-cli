function createQuery()
{
	if(!app.editingLayer.queries) app.editingLayer.queries = [];

	var query =
	{
		id: uuid(),
		title: "New Query",
		description: "",
		predicate:
		{
			operator: 'and',
			arguments: []
		},
		parameters: []
	};

	app.editingLayer.queries.push(query);

	app.config.tools.push(
	{
		type: "query",
		enabled: true,
		icon: "search",
		instance: app.editingLayer.id + '--' + query.id,
		position: "toolbar"
	});

	app.componentKey += 1;

	// get the tab instance and swap back
	var instance = M.Tabs.getInstance(document.getElementById('layerTabs'));
	instance.select('queries');
}

function deleteQuery(queryId)
{
	app.editingLayer.queries.forEach(function(query)
	{
		if(query.id === queryId)
		{
			var index = app.editingLayer.queries.indexOf(query);
			if (index !== -1)
			{
				app.editingLayer.queries.splice(index, 1);
			}

			// also remove the tool
			for(var tool in app.config.tools)
			{
				tool = app.config.tools[tool];
				if(tool.type === "query" && tool.instance === app.editingLayer.id + '--' + queryId)
				{
					index = app.config.tools.indexOf(tool);
					if (index !== -1)
					{
						app.config.tools.splice(index, 1);
					}
				}
			}
		}
	});
}

function addArgument(queryId)
{
	app.editingLayer.queries.forEach(function(query)
	{
		if(query.id === queryId)
		{
			var argument = 
			{
				operator: "contains",
				arguments: 
				[
					{
						operand: "attribute",
						name: ""
					},
					{
						operand: "parameter",
						id: ""
					}
				]
			};

			query.predicate.arguments.push(argument);

			M.AutoInit(); 
			M.updateTextFields();
		}
	});
}

function deleteArgument(queryId, argument)
{
	app.editingLayer.queries.forEach(function(query)
	{
		if(query.id === queryId)
		{
			var index = query.predicate.arguments.indexOf(argument);
			if (index !== -1)
			{
				query.predicate.arguments.splice(index, 1);
			}
		}
	});
}

function addParameter(queryId)
{
	app.editingLayer.queries.forEach(function(query)
	{
		if(query.id === queryId)
		{
			var parameter = 
			{
				id: uuid(),
				type: "input",
				title: "New Parameter",
				value: ""
			};

			query.parameters.push(parameter);

			M.AutoInit(); 
			M.updateTextFields();
		}
	});
}

function deleteParameter(queryId, parameter)
{
	app.editingLayer.queries.forEach(function(query)
	{
		if(query.id === queryId)
		{
			var index = query.parameters.indexOf(parameter);
			if (index !== -1)
			{
				query.parameters.splice(index, 1);
			}
		}
	});
}