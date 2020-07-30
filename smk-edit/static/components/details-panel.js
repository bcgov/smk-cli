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
