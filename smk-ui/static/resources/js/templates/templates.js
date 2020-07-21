Vue.component('init',
{
    template:   
        `<div>Loading...</div>`
});

Vue.component('layers',
{
    props: ['config'],
    template:   
        `<form id="manageLayersForm" style="padding: 0px; margin: 0px;">
            <div id="layerDisplayOrderContent" class="row" style="background: white; height: calc(100vh - 294px); overflow: auto;">
                <div id="layer-display-tree" class="display-order-container" style="height: 100%;"></div>
            </div>
            <div class="row">
                <label>
                    <input id="toggleNodeVisbility" type="checkbox" class="filled-in" onclick="toggleLayerNodeVisibility()"/>
                    <span>Selected Node is Visible?</span>
                </label>
            </div>
            <div class="row">
                <a class="waves-effect waves-light btn-small blue-grey darken-2" onclick="addNewDisplayFolder();" style="width: 140px;">Add Folder</a>
                <a class="waves-effect waves-light btn-small blue-grey darken-2" onclick="addNewDisplayGroup();" style="width: 140px;">Add Group</a>
                <a class="waves-effect waves-light btn-small blue-grey darken-2" onclick="removeSelectedDisplayLayer();" style="width: 140px;">Remove</a>
                <a class="waves-effect waves-light btn-small blue-grey darken-2" onclick="resetLayerDisplay();" style="width: 140px;">Reset display</a>
            </div>
        </form>`
});

Vue.component('catalog-item',
{
    props: ['layer'],
    template:   
        `<li class="collection-item avatar">
            <i v-if="layer.type ==='esri-dynamic'" class="material-icons circle blue" title="ESRI Dynamic Layer">layers</i>
            <i v-if="layer.type ==='wms'" class="material-icons circle green" title="WMS Layer">backup</i>
            <i v-if="layer.type ==='vector'" class="material-icons circle yellow darken-4" title="Vector Layer">edit</i>
            <span class="title">{{layer.title}}</span>
            <p><a v-bind:href="layer.metadataUrl" target="_blank" v-if="layer.metadataUrl != null">Metadata</a>
            <br />
            <a href="#!" v-bind:onclick="'editLayer(\\'' + layer.id + '\\')'">Edit Layer</a></p>
            <a href="#!" v-bind:onclick="'removeLayer(\\'' + layer.id + '\\')'" class="secondary-content"><i class="material-icons red-text">delete_forever</i></a>
        </li>`
});

