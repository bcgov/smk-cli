Vue.component('tools',
{
    props: ['config', 'editingTool'],
    template:
        `<form id="manageToolsForm" style="padding: 0px; margin: 0px;">
            <div class="row" style="padding: 0px; margin: 0px;">
                <div id="allTools" class="col s6" style="height: calc(100vh - 282px);">
                    <h5>Layers</h5>
                    <ul id="catalogLayersList" class="collection" style="height: 100%; overflow: auto;">
                        <tool-component v-for="(tool, index) in config.tools"
                                        v-bind:tool="tool"
                                        v-bind:index="index"
                                        v-bind:key="index">
                        </tool-component>
                    </ul>
                </div>
                <div id="editPanel" class="col s6 z-depth-1" style="height: calc(100vh - 282px); margin-top: 50px;">
                    <edit-tool v-if="editingTool != null" v-bind:tool="editingTool">
                    </edit-tool>
                </div>
            </div>
        </form>`
});
