Vue.component('query-select-options',
{
    props: ['choice', 'query', 'parameter', 'index'],
    template:
        `<div class="row">
            <div class="col s5 input-field">
                <input type="text" v-model="choice.value">
                <label>Value</label>
            </div>
            <div class="col s5 input-field">
                <input type="text" v-model="choice.title">
                <label>Label</label>
            </div>
            <div class="col s2 input-field">
                <a class="waves-effect waves-light btn-small blue-grey darken-2" v-bind:onclick="'deleteSelectOption(\\'' + query.id + '\\', \\'' + parameter.id + '\\', \\'' + index + '\\')'" style="width: 140px;">Delete</a>
            </div>
        </div>`
});