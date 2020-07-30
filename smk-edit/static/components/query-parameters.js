Vue.component('query-parameters',
{
    props: ['query', 'parameter', 'attributes'],
    template:
        `<div>
            <div class="row">
                <div class="col s3 input-field">
                    <input type="text" v-model="parameter.title">
                    <label>Title</label>
                </div>
                <div class="col s2 input-field">
                    <select class="browser-default" v-model="parameter.type">
                        <option value="input" selected>Text Box</option>
                        <option value="select">User Defined Select Box</option>
                        <option value="select-unique">Autofill Select Box</option>
                    </select>
                    <!-- label>Type</label -->
                </div>
                <div class="col s2 input-field">
                    <input type="text" v-model="parameter.value">
                    <label>Default Value</label>
                </div>
                <div class="col s2 input-field">
                    <div v-if="parameter.type ==='select'">
                        <a href="#addOptionModal" onclick="$('.modal').modal();" class="waves-effect waves-light btn-small blue-grey darken-2 modal-trigger" style="width: 140px;">Select Options</a>
                    </div>
                </div>
                <div class="col s3 input-field">
                    <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'deleteParameter(\\'' + query.id + '\\', \\'' + parameter.id + '\\')'" style="width: 140px;">Delete</a>
                </div>
            </div>
            <div id="addOptionModal" class="modal">
                <div class="modal-content">
                    <h4>Query Select Options</h4>
                    <query-select-options v-for="(choice, index) in parameter.choices"
                                          v-bind:choice="choice"
                                          v-bind:query="query"
                                          v-bind:parameter="parameter"
                                          v-bind:index="index"
                                          v-bind:key="index">
                    </query-select-options>
                    <div class="col s3 input-field">
                        <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'addSelectOption(\\'' + query.id + '\\', \\'' + parameter.id + '\\')'" style="width: 140px;">Add Option</a>
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Done</a>
                </div>
            </div>
        </div>`
});
