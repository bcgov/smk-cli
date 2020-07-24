Vue.component('basemap',
{
    props: ['config'],
    template:   
        `<form id="basemapForm" style="padding: 0px; margin: 0px;">
        <div class="row" style="padding: 0px; margin: 0px;">
            <div class="col s4">
                <p>
                    <label>
                        <input name="basemapGroup" type="radio" onclick="setBasemap('Streets')" id="Streets" value="Streets" v-model="config.viewer.baseMap"/>
                        <span>Streets</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input name="basemapGroup" type="radio" onclick="setBasemap('Topographic')" id="Topographic" value="Topographic" v-model="config.viewer.baseMap"/>
                        <span>Topographic</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input name="basemapGroup" type="radio" onclick="setBasemap('NationalGeographic')" id="NationalGeographic" value="NationalGeographic" v-model="config.viewer.baseMap"/>
                        <span>National Geographic</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input name="basemapGroup" type="radio" onclick="setBasemap('Oceans')" id="Oceans" value="Oceans" v-model="config.viewer.baseMap"/>
                        <span>Oceans</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input name="basemapGroup" type="radio" onclick="setBasemap('Gray')" id="Gray" value="Gray" v-model="config.viewer.baseMap"/>
                        <span>Gray</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input name="basemapGroup" type="radio" onclick="setBasemap('DarkGray')" id="DarkGray" value="DarkGray" v-model="config.viewer.baseMap"/>
                        <span>Dark Gray</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input name="basemapGroup" type="radio" onclick="setBasemap('Imagery')" id="Imagery" value="Imagery" v-model="config.viewer.baseMap"/>
                        <span>Imagery</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input name="basemapGroup" type="radio" onclick="setBasemap('ShadedRelief')" id="ShadedRelief" value="ShadedRelief" v-model="config.viewer.baseMap"/>
                        <span>Shaded Relief</span>
                    </label>
                </p>
                <div style="height: 20px;"></div>
                <p>
                    Select a basemap above to set your applications default basemap. Pan and zoom the map to the right to set the applications initial extent.
                </p>
            </div>
            <div class="col s8" style="height: calc(100vh - 330px);">
                <div id="basemapViewer" style="height: 100%; width: 100%;"></div>
            </div>
        </div>
    </form>`
});