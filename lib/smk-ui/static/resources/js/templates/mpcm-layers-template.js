Vue.component('mpcm-layers',
{
    props: ['config', 'catalogLayers'],
    template:   
        `<form id="mpcmLayersForm" style="padding: 0px; margin: 0px;">
            <div class="row" style="padding: 0px; margin: 0px;">
                <div id="dbcCatalog" class="col s5" style="height: calc(100vh - 282px);">
                    <div class="row" style="margin: 0px;">
                        <div class="col s10 input-field">
                            <input id="searchDbcTree" type="text" onkeyup="catalogTreeFilter()">
                            <label for="searchDbcTree">Filter</label>
                        </div>
                        <div class="col s1" style="padding: 7px;">
                            <a id="btnResetDbcTreeSearch" class="waves-effect waves-light btn-small blue-grey darken-2" style="margin-top: 20px;"><em style="position: absolute; top: 4px; left: 4px;" class="material-icons center">cancel</em></a>
                        </div>
                        <div class="col s1">
                        </div>
                    </div>
                    <div id="panelLoading" class="row" style="margin-top: 50%; margin-left: 50%;">
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
                    <div class="row" style="margin: 0px;">
                        <span id="dbcTreeMatches"></span>
                    </div>
                    <div class="row" style="margin: 0px; height: 100%;">
                        <div id="catalog-tree" class="dbc-container" style="overflow: auto; height: 100%;"></div>
                    </div>
                </div>
                <div class="col s2">
                    <div style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%);">
                        <div class="row" style="padding: 0px; margin: 5px;">
                            <a class="waves-effect waves-light btn-small blue-grey darken-2" onclick="addSelectedCatalogLayer();"><em style="position: absolute; top: 4px; left: 4px;" class="material-icons center">keyboard_arrow_right</em></a>
                        </div>
                    </div>
                </div>
                <div id="addedCatalogLayers" class="col s5" style="height: calc(100vh - 282px);">
                    <h5>Existing DataBC layers</h5>
                    <ul id="catalogLayersList" class="collection" style="height: 100%; overflow: auto;">
                        <catalog-item v-for="layer in catalogLayers"
                                      v-bind:layer="layer"
                                      v-bind:key="layer.id">
                        </catalog-item>
                    </ul>
                </div>
            </div>
        </form>`
});