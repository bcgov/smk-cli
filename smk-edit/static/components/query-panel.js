Vue.component('query-panel',
{
    props: ['query', 'layer'],
    template:
        `<li>
            <div class="collapsible-header"><i class="material-icons">query_builder</i>{{query.title}}</div>
            <div class="collapsible-body">
                <div class="row">
                    <div class="col s6 input-field">
                        <input type="text" v-model="query.id" disabled>
                        <label>ID</label>
                    </div>
                    <div class="col s6 input-field">
                        <input type="text" v-model="query.title">
                        <label>Title</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 input-field">
                        <input type="text" v-model="query.description">
                        <label>Description</label>
                    </div>
                </div>
                <div class="row">
                    <label>
                        <input name="operatorGroup" type="radio" value="and" v-model="query.predicate.operator"/>
                        <span>Query all arguments combined (and)</span>
                    </label>
                    <label>
                        <input name="operatorGroup" type="radio" value="or" v-model="query.predicate.operator"/>
                        <span>Arguments are seperate queries (or)</span>
                    </label>
                </div>
                <div class="row">
                    A query Parameter is the field you see in the query screen. Parameters can be Text boxes or select boxes. If you include a default value, that value will be pre-populated in the query.
                </div>
                <div class="row">
                    <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'addParameter(\\'' + query.id + '\\')'" style="width: 140px;">Add Parameter</a>
                </div>
                <div class="row">
                    <query-parameters v-for="parameter in query.parameters"
                                        v-bind:query="query"
                                        v-bind:parameter="parameter"
                                        v-bind:key="parameter.id">
                    </query-parameters>
                </div>
                <div class="row">
                    A query Argument defines which attribute in the layer, and how it will be queried. These must be attached to at least one parameter. Multiple arguments can be assigned to a single parameter as well (works well for a single text box that searches multiple attributes).
                </div>
                <div class="row">
                    <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'addArgument(\\'' + query.id + '\\')'" style="width: 140px;">Add Argument</a>
                </div>
                <div class="row">
                    <query-arguments v-for="(argument, index) in query.predicate.arguments"
                                     v-bind:query="query"
                                     v-bind:argument="argument"
                                     v-bind:attributes="layer.attributes"
                                     v-bind:attribute="argument.arguments[0]"
                                     v-bind:parameter="argument.arguments[1]"
                                     v-bind:index="index"
                                     v-bind:key="index">
                    </query-arguments>
                </div>
                <div class="row">
                    <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'deleteQuery(\\'' + query.id + '\\')'" style="width: 140px;">Delete Query</a>
                </div>
            </div>
        </li>`
});
