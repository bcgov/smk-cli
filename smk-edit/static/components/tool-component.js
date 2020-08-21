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
