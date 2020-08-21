import { vueComponent, importComponents } from '../vue-util.js'
import { toolTypePresentation, availableTools } from './presentation.js'

export default importComponents( [
    './components/tool-item.js',
    // './components/edit-item.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        data: function () {
            return {
                layerFilter: null,
                editItemId: null,
                showEditItem: false
            }
        },
        computed: {
            allQueries: function () {
                return this.$store.getters.configLayers
                    .filter( function ( ly ) {
                        return ly.queries && ly.queries.length > 0
                    } )
                    .map( function ( ly ) {
                        return ly.queries.map( function ( q ) {
                            return { type: 'query', instance: `${ ly.id }--${ q.id }`, instanceTitle: q.title, proto: true }
                        } )
                    } )
                    .reduce( function ( acc, a ) {
                        return acc.concat( a )
                    }, [] )
            },
            availableTools: function () {
                return this.$store.getters.configTools
                    .concat( this.allQueries )
                    .concat( availableTools )
                    .sort( sortTools )
                    .reduce( function ( acc, t ) {
                        if ( acc.length == 0 ) return [ t ]
                        var prev = acc[ acc.length - 1 ]
                        if ( t.type != prev.type ) return acc.concat( t )
                        if ( t.instance != prev.instance ) return acc.concat( t )
                        if ( t.proto ) return acc
                        if ( prev.proto ) {
                            acc.splice( acc.length - 1, 1, t )
                            return acc
                        }
                        return acc.concat( t )
                    }, [] )
                    .filter( function ( t ) {
                        return !t.enabled
                    } )
            },
            enabledTools: function () {
                return this.$store.getters.configEnabledTools.sort( sortTools )
            },
        },
        methods: {
            enableTool: function ( type, instance ) {
                if ( instance == 'NEW' )
                    instance = `${ type }-${ nextCounter() }`

                this.$store.dispatch( 'configToolEnable', { type, instance } )
            },
            editTool: function ( type, instance ) {
            },
            removeTool: function ( type, instance ) {
                this.$store.dispatch( 'configToolRemove', { type, instance } )
            },
            disableTool: function ( type, instance ) {
                this.$store.dispatch( 'configTool', { type, instance, enabled: false } )
            }
        }
    } )
} )

function sortTools( a, b ) {
    return a.type > b.type ? 1 : a.type < b.type ? -1 : a.instance > b.instance ? 1 : -1
}

var counter = 100
function nextCounter() {
    counter += 1
    return counter
}