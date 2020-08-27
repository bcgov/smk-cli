import { vueComponent, importComponents } from '../vue-util.js'
import { toolTypePresentation } from './presentation.js'

export default importComponents( [
    './components/tool-item.js',
    './components/edit-tool-details.js',
    './components/edit-tool-details-about.js',
    './components/edit-tool-details-baseMaps.js',
    './components/edit-tool-details-directions.js',
    './components/edit-tool-details-identify.js',
    './components/edit-tool-details-layers.js',
    './components/edit-tool-details-query.js',
    './components/edit-tool-details-scale.js',
    './components/edit-tool-details-search.js',
    './components/edit-tool-details-select.js',
    './components/edit-tool-details-zoom.js',
    './components/dialog-box.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance', 'showDialog' ],
        computed: {
            detailsComponent: function () {
                return toolTypePresentation[ this.toolType ].details
            }
        },
        methods: {
            openDialog: function () {
                M.Tabs.init( this.$refs.tabs, {} )
                var inst = M.Tabs.getInstance( this.$refs.tabs )
                inst.select( 'details' )
                setTimeout( function () {
                    inst.updateTabIndicator()
                }, 500 )
            },
        },
    } )
} )
