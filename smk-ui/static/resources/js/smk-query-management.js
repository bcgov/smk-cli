function createQuery()
{
	if(!app.editingLayer.queries) app.editingLayer.queries = [];

	var query =
	{
		id: uuid(),
		title: 'New Query',
		description: '',
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
		type: 'query',
		enabled: true,
		icon: 'search',
		instance: app.editingLayer.id + '--' + query.id,
		position: 'toolbar'
	});

	// get the tab instance and swap back
	var instance = M.Tabs.getInstance(document.getElementById('layerTabs'));
	instance.select('queries');

	$('select').formSelect();
	M.AutoInit(); 
	M.updateTextFields();
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
				operator: 'equals',
				arguments: 
				[
					{
						operand: 'attribute',
						name: ''
					},
					{
						operand: 'parameter',
						id: ''
					}
				]
			};

			query.predicate.arguments.push(argument);

			$('select').formSelect();
			M.AutoInit(); 
			M.updateTextFields();
		}
	});
}

function deleteArgument(queryId, index)
{
	app.editingLayer.queries.forEach(function(query)
	{
		if(query.id === queryId)
		{
			query.predicate.arguments.splice(index, 1);
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
				title: "New Parameter " + (query.parameters.length + 1),
				value: ""
			};

			query.parameters.push(parameter);

			$('select').formSelect();
			M.AutoInit(); 
			M.updateTextFields();
		}
	});
}

function deleteParameter(queryId, parameterId)
{
	app.editingLayer.queries.forEach(function(query)
	{
		if(query.id === queryId)
		{
			for(var i = 0; i < query.parameters.length; i++)
			{
				var param = query.parameters[i];
				
				if (i !== -1 && param.id === parameterId)
				{
					query.parameters.splice(i, 1);
					break;
				}
			}
		}
	});
}

function addSelectOption(queryId, parameterId)
{
	app.editingLayer.queries.forEach(function(query)
	{
		if(query.id === queryId)
		{
			for(var i = 0; i < query.parameters.length; i++)
			{
				var param = query.parameters[i];
				
				if (param.id === parameterId)
				{
					if(!param.hasOwnProperty('choices')) param.choices = [];

					param.choices.push(
					{
						value: '',
						title: ''
					});
					
					break;
				}
			}
		}
	});
}

function deleteSelectOption(queryId, parameterId, index)
{
	app.editingLayer.queries.forEach(function(query)
	{
		if(query.id === queryId)
		{
			for(var i = 0; i < query.parameters.length; i++)
			{
				var param = query.parameters[i];
				
				if (param.id === parameterId)
				{
					param.choices.splice(parseInt(index), 1);
					break;
				}
			}
		}
	});
}