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
