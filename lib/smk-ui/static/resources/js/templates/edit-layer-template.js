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
                    <ul class="tabs">
                        <li class="tab col s3"><a class="active" href="#details">Details</a></li>
                        <li class="tab col s3"><a href="#attributes">Attributes</a></li>
                        <li class="tab col s3"><a href="#popup">Popup Template</a></li>
                        <li class="tab col s3"><a href="#queries">Queries</a></li>
                    </ul>
                </div>
                <div id="details" class="col s12">
                    <div class="row">
                        <div class="col s6">
                            <label>
                                <input type="checkbox" class="filled-in" id="visible" v-model="editingLayer.isVisible" />
                                <span>Visible</span>
                            </label>
                        </div>
                        <div class="col s6">
                            <label>
                                <input type="checkbox" class="filled-in" id="queryable" v-model="editingLayer.isQueryable" />
                                <span>Identifiable</span>
                            </label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12 input-field">
                            <input id="dbcName" type="text" v-model="editingLayer.title">
                            <label for="dbcName">Title</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12 input-field">
                            <input id="dbcAttribution" type="text" v-model="editingLayer.attribution">
                            <label for="dbcAttribution">Attribution</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12 input-field">
                            <input id="dbcOpacity" type="text" v-model="editingLayer.opacity">
                            <label for="dbcOpacity">Opacity</label>
                        </div>
                    </div>
                    <div class="row" v-if="editingLayer.type ==='esri-dynamic'">
                        <!-- div class="col s12 input-field">
                            <input id="dbcDefinitionExpression" type="text" v-model="??? this needs to edit the dynamicLayers directly. probably needs an onchange function">
                            <label for="dbcDefinitionExpression">Filter Expression</label>
                        </div -->
                    </div>
                    <div v-if="editingLayer.type ==='wms'">
                    </div>
                    <div v-if="editingLayer.type ==='vector'">
                        <div class="row">
                            <div class="col s12 input-field">
                                <input id="vectorEditUrl" type="text" v-model="editingLayer.dataUrl">
                                <label for="vectorEditUrl">External URL</label>
                            </div>
                        </div>
                        <div class="row" >
                            <div class="col s4">
                                <label>
                                    <input type="checkbox" class="filled-in" id="visible" v-model="editingLayer.useClustering" />
                                    <span>Display as Cluster</span>
                                </label>
                            </div>
                            <div class="col s4">
                                <label>
                                    <input type="checkbox" class="filled-in" id="visible" v-model="editingLayer.useHeatmap" />
                                    <span>Display as Heatmap</span>
                                </label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s4 input-field">
                                <input id="vectorStrokeOpacity" type="text" v-model="editingLayer.style.strokeOpacity">
                                <label for="vectorStrokeOpacity">Stroke Opacity</label>
                            </div>
                            <div class="col s4 input-field">
                                <input id="vectorFillOpacity" type="text" v-model="editingLayer.style.fillOpacity">
                                <label for="vectorFillOpacity">Fill Opacity</label>
                            </div>
                        </div>
                        <div class="row" >
                            <div class="col s4 input-field">
                                <input id="vectorStrokeWidth" type="text" v-model="editingLayer.style.strokeWidth">
                                <label for="vectorStrokeWidth">Stroke Width</label>
                            </div>
                            <div class="col s4 input-field">
                                <input id="vectorStrokeStyle" type="text" v-model="editingLayer.style.strokeStyle">
                                <label for="vectorStrokeStyle">Stroke Style</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s4">
                                <label for="vectorStrokeColor" class="black-text">Stroke Color</label>
                                <input id="vectorStrokeColor" type="color" v-model="editingLayer.style.strokeColor">
                            </div>
                            <div class="col s4">
                                <label for="vectorFillColor" class="black-text">Fill Color</label>
                                <input id="vectorFillColor" type="color" v-model="editingLayer.style.fillColor">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s6 input-field">
                                <input id="vectorMarkerSizeX" type="text" v-model="editingLayer.style.markerSize[0]">
                                <label for="vectorMarkerSizeX">Marker Size X</label>
                            </div>
                            <div class="col s6 input-field">
                                <input id="vectorMarkerSizeY" type="text" v-model="editingLayer.style.markerSize[1]">
                                <label for="vectorMarkerSizeY">Marker Size Y</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s6 input-field">
                                <input id="vectorMarkerOffsetX" type="text" v-model="editingLayer.style.markerOffset[0]">
                                <label for="vectorMarkerOffsetX">Marker Offset X</label>
                            </div>
                            <div class="col s6 input-field">
                                <input id="vectorMarkerOffsetY" type="text" v-model="editingLayer.style.markerOffset[1]">
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
                        <p>Add any HTML elements you need to customize your layers popup. SMK uses vue natively so you can use <a href="https://vuejs.org/" target="_blank">Vue</a> syntax to develop highly complicated popup templates!</p>
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
                    <query-arguments v-for="argument in query.predicate.arguments"
                                     v-bind:query="query"
                                     v-bind:argument="argument"
                                     v-bind:attributes="layer.attributes"
                                     v-bind:key="argument.operator + '-' + argument.arguments[0].name">
                    </query-arguments>
                </div>
                <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'deleteQuery(\\'' + query.id + '\\')'" style="width: 130px;">Delete Query</a>
            </div>
        </li>`
});

Vue.component('query-arguments',
{
    props: ['query', 'argument', 'attributes'],
    template:   
        `<div class="row">
            <div class="col s3 input-field">
                <select v-model="argument.arguments[0].name">
                    <option v-for="attribute in attributes" v-bind:value="attribute.name">
                        {{ attribute.title }}
                    </option>
                </select>
                <label>Attribute</label>
            </div>
            <div class="col s3 input-field">
                <select v-model="argument.operator">
                    <option value="equals" selected>Equals</option>
                    <option value="contains">Contains</option>
                    <option value="less-than">Less Than</option>
                    <option value="greater-than">Greater Than</option>
                    <option value="starts-with">Starts With</option>
                    <option value="ends-with">Ends With</option>
                </select>
                <label>Operator</label>
            </div>
        </div>`
});

Vue.component('query-parameters',
{
    props: ['query', 'parameter', 'attributes'],
    template:   
        `<div class="row">
        </div>`
});