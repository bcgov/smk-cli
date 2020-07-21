Vue.component('identity',
{
    props: ['config'],
    template:
        `<form id="identityForm" action="#">
            <div class="row" style="margin-bottom: 0px;">
                <div class="col s12 input-field">
                    <input id="mashupName" type="text" class="validate active" disabled v-model="config.name">
                        <label for="mashupName">Name/ID</label>
                </div>
            </div>
            <div class="row" style="margin-top: 20px;">
                <div class="col s12">
                    <p>What kind of map viewer do you want to use?</p>
                </div>
            </div>
            <div class="row">
                <div class="col s12">
                    <p>
                        <label>
                            <input name="viewerGroup" type="radio" id="leafletViewer" value="leaflet" v-model="config.viewer.type"/>
                            <span>Leaflet</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input name="viewerGroup" type="radio" id="esri3dViewer" value="esri3d" v-model="config.viewer.type"/>
                            <span>ESRI ArcGIS 3D</span>
                        </label>
                    </p>
                </div>
            </div>
            <div class="row" style="margin-top: 20px;">
                <div class="col s12">
                    <p>What kind of device is the viewer going to be used on?</p>
                </div>
            </div>
            <div class="row">
                <div class="col s12">
                    <p>
                        <label>
                            <input name="viewerModeGroup" type="radio" id="autoMode" value="auto" v-model="config.viewer.device"/>
                            <span>Auto-Detect</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input name="viewerModeGroup" type="radio" id="desktopMode" value="desktop" v-model="config.viewer.device"/>
                            <span>Desktop</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input name="viewerModeGroup" type="radio" id="mobileMode" value="mobile" v-model="config.viewer.device"/>
                            <span>Mobile</span>
                        </label>
                    </p>
                </div>
            </div>
            <div class="row" style="margin-bottom: 0px;">
                <div class="col s6 input-field">
                    <input id="defaultPanelWidth" type="text" class="validate active" v-model="config.viewer.panelWidth">
                        <label for="defaultPanelWidth">Side Panel Width (in pixels)</label>
                </div>
            </div>
            <div class="row" style="margin-bottom: 0px;">
                <div class="col s6 input-field">
                    <input id="autoTogglePanelWidth" type="text" class="validate active" v-model="config.viewer.deviceAutoBreakpoint">
                        <label for="defaultPanelWidth">Auto-toggle to Mobile width (in pixels)</label>
                </div>
            </div>
            <!--<div class="row" style="padding-bottom: 30px;">
                <div class="col s6 input-field">
                    <label>
                        <input type="checkbox" class="filled-in" id="visible" v-model="config.viewer.clusterOption.showCoverageOnHover" />
                        <span>Show coverage on vector clusters hover</span>
                    </label>
                </div>
            </div>-->
            <!--<div class="row">
                <div class="col s6 input-field">
                    <input id="createdDateField" type="text" disabled="true" v-model="config.createdDate">
                        <label for="createdDateField">Created Date</label>
                </div>
                <div class="col s6 input-field">
                    <input id="updatedDateField" type="text" disabled="true" v-model="config.modifiedDate">
                        <label for="updatedDateField">Updated Date</label>
                </div>
            </div>-->
        </form>`
});