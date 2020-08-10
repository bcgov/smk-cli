import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/catalog-item.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'item', 'selectedIds', 'enabledIds' ],
        computed: {
            selected: {
                get: function () { return this.selectedIds.includes( this.item.id ) },
                set: function ( val ) { this.selectionChanged( val ) }
            },
            enabled: function () { return this.enabledIds.includes( this.item.id ) },
        },
        methods: {
            selectionChanged: function ( select, id ) {
                this.$emit( 'select-changed', select, id || this.item.id )
            }
        }
    } )
} )