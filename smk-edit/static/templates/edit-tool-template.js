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

Vue.component('tool-component',
{
    props: ['tool', 'index'],
    template:
        `<li class="collection-item avatar">
            <span class="title">{{tool.type}} tool</span>
            <p>
                <label>
                    <input v-bind:name="'' + index + '-operatorGroup'" type="radio" v-bind:value="true" v-model="tool.enabled"/>
                    <span>Enabled</span>
                </label>
                <label>
                    <input v-bind:name="'' + index + '-operatorGroup'" type="radio" v-bind:value="false" v-model="tool.enabled"/>
                    <span>Disabled</span>
                </label>
                <br />
            </p>
            <a href="#!" v-bind:onclick="'editTool(\\'' + index + '\\')'" class="secondary-content"><i class="material-icons black-text">edit</i></a>
        </li>`
});

Vue.component('edit-tool',
{
    props: ['tool'],
    template:
        `<div v-if="tool">
            <div class="row" style="width: 100%; height: calc(100vh - 363px);" id="editPanelData">
                <div v-if="tool.hasOwnProperty('position')" class="col s6 input-field">
                    <select v-model="tool.position">
                        <option value="toolbar" selected>Toolbar</option>
                        <option value="dropdown">Dropdown Menu</option>
                        <option value="list-menu">List Menu</option>
                        <option value="shortcut-menu">Shortcut Menu</option>
                    </select>
                    <label>Location</label>
                </div>
                <div v-if="tool.hasOwnProperty('title')" class="col s6 input-field">
                    <input type="text" v-model="tool.title">
                    <label>Title</label>
                </div>
                <div v-if="tool.hasOwnProperty('content')" class="col s12 input-field">
                    <textarea id="content" class="materialize-textarea" v-model="tool.content"></textarea>
                    <label for="content">Content</label>
                </div>
                <div class="col s6" v-if="tool.hasOwnProperty('mouseWheel')">
                    <label>
                        <input type="checkbox" class="filled-in" id="visible" v-model="tool.mouseWheel" />
                        <span>Zoom with Mouse Wheel</span>
                    </label>
                </div>
                <div class="col s6" v-if="tool.hasOwnProperty('doubleClick')">
                    <label>
                        <input type="checkbox" class="filled-in" id="visible" v-model="tool.doubleClick" />
                        <span>Zoom with double-click</span>
                    </label>
                </div>
                <div class="col s6" v-if="tool.hasOwnProperty('box')">
                    <label>
                        <input type="checkbox" class="filled-in" id="visible" v-model="tool.box" />
                        <span>Zoom by drawing a box</span>
                    </label>
                </div>
                <div class="col s6" v-if="tool.hasOwnProperty('control')">
                    <label>
                        <input type="checkbox" class="filled-in" id="visible" v-model="tool.control" />
                        <span>Zoom with Control Key</span>
                    </label>
                </div>
                <div class="col s6" v-if="tool.hasOwnProperty('showFactor')">
                    <label>
                        <input type="checkbox" class="filled-in" id="visible" v-model="tool.showFactor" />
                        <span>Show scale factor</span>
                    </label>
                </div>
                <div class="col s6" v-if="tool.hasOwnProperty('showBar')">
                    <label>
                        <input type="checkbox" class="filled-in" id="visible" v-model="tool.showBar" />
                        <span>Show scale bar</span>
                    </label>
                </div>
                <div v-if="tool.hasOwnProperty('baseMap')" class="col s6 input-field">
                    <select v-model="tool.baseMap">
                        <option value="Topographic" selected>Topographic</option>
                        <option value="NationalGeographic">National Geographic</option>
                        <option value="Oceans">Oceans</option>
                        <option value="Gray">Gray</option>
                        <option value="DarkGray">Dark Gray</option>
                        <option value="Imagery">Imagery</option>
                        <option value="ShadedRelief">Shaded Relief</option>
                    </select>
                    <label>Minimap basemap</label>
                </div>
                <div v-if="tool.hasOwnProperty('style')" class="col s6 input-field">
                    <input type="text" v-model="tool.style.strokeWidth">
                    <label>Stroke Width</label>
                </div>
                <div v-if="tool.hasOwnProperty('style')" class="col s6 input-field">
                    <input type="text" v-model="tool.style.strokeStyle">
                    <label>Stroke Style</label>
                </div>
                <div v-if="tool.hasOwnProperty('style')" class="col s6 input-field">
                    <input type="color" v-model="tool.style.strokeColor">
                    <label>Stroke Color</label>
                </div>
                <div v-if="tool.hasOwnProperty('style')" class="col s6 input-field">
                    <input type="text" v-model="tool.style.strokeOpacity">
                    <label>Stroke Opacity</label>
                </div>
                <div v-if="tool.hasOwnProperty('style')" class="col s6 input-field">
                    <input type="color" v-model="tool.style.fillColor">
                    <label>Fill Color</label>
                </div>
                <div v-if="tool.hasOwnProperty('style')" class="col s6 input-field">
                    <input type="text" v-model="tool.style.fillOpacity">
                    <label>Fill Opacity</label>
                </div>
                <div v-if="tool.hasOwnProperty('styleOpacity')" class="col s6 input-field">
                    <input type="text" v-model="tool.styleOpacity">
                    <label>Style Opacity</label>
                </div>
                <div v-if="tool.hasOwnProperty('tolerance')" class="col s6 input-field">
                    <input type="text" v-model="tool.tolerance">
                    <label>Tolerance</label>
                </div>
                <div v-if="tool.hasOwnProperty('icon')" class="col s6 input-field">
                    <input type="text" v-model="tool.icon">
                    <label>Materialize Icon ID</label>
                </div>
            </div>
        </div>`
});