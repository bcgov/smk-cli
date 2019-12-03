Vue.component('wms-layers',
{
    props: ['config', 'wmsLayers'],
    template:   
        `<form id="wmsLayersForm" style="padding: 0px; margin: 0px;">
        <div class="row" style="padding: 0px; margin: 0px;">
            <div id="wmsCatalog" class="col s5" style="height: calc(100vh - 282px);">
                <div class="row" style="padding: 5px; margin: 0px;">
                    <div class="col s9 input-field">
                        <input id="wmsUrlField" type="text">
                        <label for="wmsUrlField">WMS URL</label>
                    </div>
                    <div class="col s2">
                        <a id="wmsRefreshButton" class="waves-effect waves-light btn-small blue-grey darken-2" onclick="loadWmsLayers();" style="margin-top: 20px;"><em style="position: absolute; top: 4px; left: 4px;" class="material-icons center">cached</em></a>
                        <div id="wmsPanelLoading" class="row" style="display: none;">
                            <div class="preloader-wrapper big active">
                                <div class="spinner-layer spinner-blue-only">
                                    <div class="circle-clipper left">
                                        <div class="circle"></div>
                                    </div><div class="gap-patch">
                                        <div class="circle"></div>
                                    </div><div class="circle-clipper right">
                                        <div class="circle"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col s1">
                    </div>
                </div>
                <div id="wmsPanel" style="display: none;">
                    <div class="row" style="margin: 0px;">
                        <div class="col s9 input-field">
                            <input id="searchWmsTree" type="text" onkeyup="wmsTreeFilter()">
                            <label for="searchWmsTree">Filter</label>
                        </div>
                        <div class="col s2" style="padding: 7px;">
                            <a id="btnResetWmsTreeSearch" class="waves-effect waves-light btn-small blue-grey darken-2" style="margin-top: 20px;"><em style="position: absolute; top: 4px; left: 4px;" class="material-icons center">cancel</em></a>
                        </div>
                        <div class="col s1">
                    </div>
                    </div>
                    <div class="row" style="margin: 0px;">
                        <span id="wmsTreeMatches"></span>
                    </div>							    			
                    <div class="row" style="margin: 0px;">
                        <div id="wms-catalog-tree" class="wms-container"></div>
                    </div>
                </div>
            </div>
            <div class="col s2">
                <div style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);">
                    <div class="row" style="padding: 0px; margin: 5px;">
                        <a class="waves-effect waves-light btn-small blue-grey darken-2" onclick="addSelectedWmsLayer();"><em style="position: absolute; top: 4px; left: 4px;" class="material-icons center">keyboard_arrow_right</em></a>
                    </div>
                </div>
            </div>
            <div id="addedCatalogLayers" class="col s5" style="height: calc(100vh - 282px);">
                <h5>Existing WMS layers</h5>
                <ul id="catalogLayersList" class="collection" style="height: 100%; overflow: auto;">
                    <catalog-item v-for="layer in wmsLayers"
                                  v-bind:layer="layer"
                                  v-bind:key="layer.id">
                    </catalog-item>
                </ul>
            </div>
        </div>
    </form>`
});