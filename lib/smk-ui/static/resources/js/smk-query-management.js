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