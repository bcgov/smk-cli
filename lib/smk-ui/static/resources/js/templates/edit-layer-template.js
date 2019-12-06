Vue.component('edit-layer',
{
    props: ['editingLayer'],
    template:   
        `<div class="row">
            <h5 v-if="editingLayer.type ==='esri-dynamic'">DataBC Catalog Layer: {{editingLayer.title}}</h5>
            <h5 v-if="editingLayer.type ==='wms'">WMS Layer: {{editingLayer.title}}</h5>
            <h5 v-if="editingLayer.type ==='vector'">Vector Layer: {{editingLayer.title}}</h5>
            <div class="row">
                <div class="col s12" style="padding-bottom: 14px; padding-top: 14px;">
                    <ul id="layerTabs" class="tabs">
                        <li class="tab col s3"><a class="active" href="#details">Details</a></li>
                        <li class="tab col s3"><a href="#attributes">Attributes</a></li>
                        <li class="tab col s3"><a href="#popup">Popup Template</a></li>
                        <li class="tab col s3"><a href="#queries">Queries</a></li>
                    </ul>
                </div>
                <div id="details" class="col s12">
                    <details-panel v-bind:layer="editingLayer"
                                  v-bind:key="editingLayer.id">
                    </details-panel>
                </div>
                <div id="attributes" class="col s12">
                    <attribute-panel v-for="attribute in editingLayer.attributes"
                                     v-bind:attribute="attribute"
                                     v-bind:layer="editingLayer"
                                     v-bind:key="attribute.id">
                    </attribute-panel>
                </div>
                <div id="popup" class="col s12">
                    <div class="row">
                        <p>Add any HTML elements you need to customize your layers popup. SMK uses vue natively so you can use <a href="https://vuejs.org/" target="_blank">Vue</a> syntax to develop advanced popup templates.</p>
                    </div>
                    <div id="layer-popup-content">
                    </div>
                </div>
                <div id="queries" class="col s12">
                    <a class="waves-effect waves-light btn-small blue-grey darken-2" onclick="createQuery()" style="width: 130px;">Create Query</a>
                    <ul class="collapsible">
                        <query-panel v-for="query in editingLayer.queries"
                                    v-bind:query="query"
                                    v-bind:layer="editingLayer"
                                    v-bind:key="query.id">
                        </query-panel>
                    </ul>
                </div>
            </div>
        </div>`
});

Vue.component('details-panel',
{
    props: ['layer'],
    template: 
        `<div>
            <div class="row">
                <div class="col s6">
                    <label>
                        <input type="checkbox" class="filled-in" id="visible" v-model="layer.isVisible" />
                        <span>Visible</span>
                    </label>
                </div>
                <div class="col s6">
                    <label>
                        <input type="checkbox" class="filled-in" id="queryable" v-model="layer.isQueryable" />
                        <span>Identifiable</span>
                    </label>
                </div>
            </div>
            <div class="row">
                <div class="col s12 input-field">
                    <input id="dbcName" type="text" v-model="layer.title">
                    <label for="dbcName">Title</label>
                </div>
            </div>
            <div class="row">
                <div class="col s12 input-field">
                    <input id="dbcAttribution" type="text" v-model="layer.attribution">
                    <label for="dbcAttribution">Attribution</label>
                </div>
            </div>
            <div class="row">
                <div class="col s12 input-field">
                    <input id="dbcOpacity" type="text" v-model="layer.opacity">
                    <label for="dbcOpacity">Opacity</label>
                </div>
            </div>
            <div class="row" v-if="layer.type ==='esri-dynamic'">
                <!-- div class="col s12 input-field">
                    <input id="dbcDefinitionExpression" type="text" v-model="??? this needs to edit the dynamicLayers directly. probably needs an onchange function">
                    <label for="dbcDefinitionExpression">Filter Expression</label>
                </div -->
                <div class="col s12 input-field">
                    <input id="dbcDefinitionExpression" type="text" v-model="layer.dynamicLayers">
                    <label for="dbcDefinitionExpression">Dynamic Expression</label>
                </div>
            </div>
            <div v-if="layer.type ==='wms'">
                <div class="row">
                    <div class="col s12 input-field">
                        <input id="vectorEditUrl" type="text" v-model="layer.serviceUrl">
                        <label for="vectorEditUrl">Service URL</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col s6 input-field">
                        <input id="vectorEditUrl" type="text" v-model="layer.layerName">
                        <label for="vectorEditUrl">Layer Name</label>
                    </div>
                    <div class="col s6 input-field">
                        <input id="vectorEditUrl" type="text" v-model="layer.styleName">
                        <label for="vectorEditUrl">Style Name</label>
                    </div>
                </div>
            </div>
            <div v-if="layer.type ==='vector'">
                <div class="row">
                    <div class="col s12 input-field">
                        <input id="vectorEditUrl" type="text" v-model="layer.dataUrl">
                        <label for="vectorEditUrl">External URL</label>
                    </div>
                </div>
                <div class="row" >
                    <div class="col s4">
                        <label>
                            <input type="checkbox" class="filled-in" id="visible" v-model="layer.useClustering" />
                            <span>Display as Cluster</span>
                        </label>
                    </div>
                    <div class="col s4">
                        <label>
                            <input type="checkbox" class="filled-in" id="visible" v-model="layer.useHeatmap" />
                            <span>Display as Heatmap</span>
                        </label>
                    </div>
                </div>
                <div class="row">
                    <div class="col s4 input-field">
                        <input id="vectorStrokeOpacity" type="text" v-model="layer.style.strokeOpacity">
                        <label for="vectorStrokeOpacity">Stroke Opacity</label>
                    </div>
                    <div class="col s4 input-field">
                        <input id="vectorFillOpacity" type="text" v-model="layer.style.fillOpacity">
                        <label for="vectorFillOpacity">Fill Opacity</label>
                    </div>
                </div>
                <div class="row" >
                    <div class="col s4 input-field">
                        <input id="vectorStrokeWidth" type="text" v-model="layer.style.strokeWidth">
                        <label for="vectorStrokeWidth">Stroke Width</label>
                    </div>
                    <div class="col s4 input-field">
                        <input id="vectorStrokeStyle" type="text" v-model="layer.style.strokeStyle">
                        <label for="vectorStrokeStyle">Stroke Style</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col s4">
                        <label for="vectorStrokeColor" class="black-text">Stroke Color</label>
                        <input id="vectorStrokeColor" type="color" v-model="layer.style.strokeColor">
                    </div>
                    <div class="col s4">
                        <label for="vectorFillColor" class="black-text">Fill Color</label>
                        <input id="vectorFillColor" type="color" v-model="layer.style.fillColor">
                    </div>
                </div>
                <div class="row">
                    <div class="col s6 input-field">
                        <input id="vectorMarkerSizeX" type="text" v-model="layer.style.markerSize[0]">
                        <label for="vectorMarkerSizeX">Marker Size X</label>
                    </div>
                    <div class="col s6 input-field">
                        <input id="vectorMarkerSizeY" type="text" v-model="layer.style.markerSize[1]">
                        <label for="vectorMarkerSizeY">Marker Size Y</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col s6 input-field">
                        <input id="vectorMarkerOffsetX" type="text" v-model="layer.style.markerOffset[0]">
                        <label for="vectorMarkerOffsetX">Marker Offset X</label>
                    </div>
                    <div class="col s6 input-field">
                        <input id="vectorMarkerOffsetY" type="text" v-model="layer.style.markerOffset[1]">
                        <label for="vectorMarkerOffsetY">Marker Offset Y</label>
                    </div>
                </div>
                <div class="row">
                    <div class="file-field input-field">
                        <div class="btn blue-grey darken-2">
                            <span>Custom Point Marker</span>
                            <input type="file" id="customMarkerFileUpload">
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" type="text">
                        </div>
                    </div>
                </div>
            </div>
        </div>`
});

Vue.component('attribute-panel',
{
    props: ['attribute', 'layer'],
    template:   
        `<div class="row">
            <div class="col s2 input-field">
                <label>
                    <input type="checkbox" class="filled-in" id="attIsVisible" v-model="attribute.visible" />
                    <span>Visible</span>
                </label>
            </div>
            <div class="col s8 input-field">
                <input id="attName" type="text" v-model="attribute.title">
                <label for="attName">{{attribute.name}}</label>
            </div>
            <div class="col s2 input-field">
                <label>
                    <input name="titleAttGroup" type="radio" v-bind:value="'' + attribute.name + ''" v-model="layer.titleAttribute"/>
                    <span>Set Title Attribute</span>
                </label>
            </div>
        </div>`
});

Vue.component('query-panel',
{
    props: ['query', 'layer'],
    template:   
        `<li>
            <div class="collapsible-header"><i class="material-icons">query_builder</i>{{query.title}}</div>
            <div class="collapsible-body">
                <div class="row">
                    <div class="col s6 input-field">
                        <input type="text" v-model="query.id" disabled>
                        <label>ID</label>
                    </div>
                    <div class="col s6 input-field">
                        <input type="text" v-model="query.title">
                        <label>Title</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 input-field">
                        <input type="text" v-model="query.description">
                        <label>Description</label>
                    </div>
                </div>
                <div class="row">
                    <label>
                        <input name="operatorGroup" type="radio" value="and" v-model="query.predicate.operator"/>
                        <span>Query all arguments combined (and)</span>
                    </label>
                    <label>
                        <input name="operatorGroup" type="radio" value="or" v-model="query.predicate.operator"/>
                        <span>Arguments are seperate queries (or)</span>
                    </label>
                </div>
                <div class="row">
                    A query Parameter is the field you see in the query screen. Parameters can be Text boxes or select boxes. If you include a default value, that value will be pre-populated in the query.
                </div>
                <div class="row">
                    <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'addParameter(\\'' + query.id + '\\')'" style="width: 140px;">Add Parameter</a>
                </div>                
                <div class="row">
                    <query-parameters v-for="parameter in query.parameters"
                                        v-bind:query="query"
                                        v-bind:parameter="parameter"
                                        v-bind:key="parameter.id">
                    </query-parameters>
                </div>              
                <div class="row">
                    A query Argument defines which attribute in the layer, and how it will be queried. These must be attached to at least one parameter. Multiple arguments can be assigned to a single parameter as well (works well for a single text box that searches multiple attributes).
                </div>  
                <div class="row">
                    <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'addArgument(\\'' + query.id + '\\')'" style="width: 140px;">Add Argument</a>
                </div>
                <div class="row">
                    <query-arguments v-for="argument in query.predicate.arguments"
                                     v-bind:query="query"
                                     v-bind:argument="argument"
                                     v-bind:attributes="layer.attributes"
                                     v-bind:attribute="argument.arguments[0]"
                                     v-bind:parameter="argument.arguments[1]"
                                     v-bind:key="argument.operator + '-' + argument.arguments[0].name">
                    </query-arguments>
                </div>
                <div class="row">
                    <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'deleteQuery(\\'' + query.id + '\\')'" style="width: 140px;">Delete Query</a>
                </div>
            </div>
        </li>`
});

Vue.component('query-arguments',
{
    props: ['query', 'argument', 'attribute', 'parameter', 'attributes'],
    template:   
        `<div class="row">
            <div class="col s3 input-field">
                <select class="browser-default" v-model="attribute.name">
                    <option v-for="attr in attributes" v-bind:value="attr.name">
                        {{ attr.title }}
                    </option>
                </select>
                <!-- label>Attribute</label -->
            </div>
            <div class="col s3 input-field">
                <select class="browser-default" v-model="argument.operator">
                    <option value="equals" selected>Equals</option>
                    <option value="contains">Contains</option>
                    <option value="less-than">Less Than</option>
                    <option value="greater-than">Greater Than</option>
                    <option value="starts-with">Starts With</option>
                    <option value="ends-with">Ends With</option>
                </select>
                <!-- label>Operator</label -->
            </div>
            <div class="col s3 input-field">
                <select class="browser-default" v-model="parameter.id">
                    <option v-for="param in query.parameters" v-bind:value="param.id">
                        {{ param.title }}
                    </option>
                </select>
                <!-- label>Linked Parameter</label -->
            </div>
            <div class="col s3">
                <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'deleteArgument(\\'' + query.id + '\\', \\'' + argument.operator + '-' + argument.arguments[0].name + '\\')'" style="width: 140px;">Delete</a>
            </div>
        </div>`
});

Vue.component('query-parameters',
{
    props: ['query', 'parameter', 'attributes'],
    template:   
        `<div class="row">
            <div class="col s3 input-field">
                <input type="text" v-model="parameter.title">
                <label>Title</label>
            </div>
            <div class="col s3 input-field">
                <select class="browser-default" v-model="parameter.type">
                    <option value="input" selected>Text Box</option>
                    <option value="select">User Defined Select Box</option>
                    <option value="select-unique">Autofill Select Box</option>
                </select>
                <!-- label>Type</label -->
            </div>
            <div class="col s3 input-field">
                <input type="text" v-model="parameter.value">
                <label>Default Value</label>
            </div>
            <div class="col s3">
                <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'deleteParameter(\\'' + query.id + '\\', \\'' + parameter.id + '\\')'" style="width: 140px;">Delete</a>
            </div>
        </div>`
});