Vue.component('query-arguments',
{
    props: ['query', 'argument', 'attribute', 'parameter', 'attributes', 'index'],
    template:
        `<div class="row">
            <div class="col s3 input-field">
                <select class="browser-default" v-model="attribute.name">
                    <option v-for="attr in attributes" v-bind:value="attr.name">
                        {{ attr.title }}
                    </option>
                </select>
                <!-- label>Attribute</label -->
            </div>
            <div class="col s3 input-field">
                <select class="browser-default" v-model="argument.operator">
                    <option value="equals" selected>Equals</option>
                    <option value="contains">Contains</option>
                    <option value="less-than">Less Than</option>
                    <option value="greater-than">Greater Than</option>
                    <option value="starts-with">Starts With</option>
                    <option value="ends-with">Ends With</option>
                </select>
                <!-- label>Operator</label -->
            </div>
            <div class="col s3 input-field">
                <select class="browser-default" v-model="parameter.id">
                    <option v-for="param in query.parameters" v-bind:value="param.id">
                        {{ param.title }}
                    </option>
                </select>
                <!-- label>Linked Parameter</label -->
            </div>
            <div class="col s3 input-field">
                <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'deleteArgument(\\'' + query.id + '\\', \\'' + index + '\\')'" style="width: 140px;">Delete</a>
            </div>
        </div>`
});
