import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/materialize.js',
    './components/edit-item-query-parameters.js',
    './components/edit-item-query-predicate.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        data: function () {
            return {
                // queriesKey: 1,
                activeQueryIndex: null
            }
        },
        computed: {
            queries: function () {
                return this.$store.getters.configLayerQueries( this.itemId )
            },
            queryId: function () {
                if ( this.activeQueryIndex == null ) return
                return this.queries[ this.activeQueryIndex ].id
            },
            queryTitle: {
                get: function () {
                    if ( this.activeQueryIndex == null ) return
                    return this.queries[ this.activeQueryIndex ].title
                },
                set: function ( val ) {
                    if ( this.activeQueryIndex == null ) return
                    var qs = this.queries
                    qs[ this.activeQueryIndex ].title = val
                    this.$store.dispatch( 'configLayerQueries', { id: this.itemId, queries: qs } )
                },
            },
            queryDescription: {
                get: function () {
                    if ( this.activeQueryIndex == null ) return
                    return this.queries[ this.activeQueryIndex ].description
                },
                set: function ( val ) {
                    if ( this.activeQueryIndex == null ) return
                    var qs = this.queries
                    qs[ this.activeQueryIndex ].description = val
                    this.$store.dispatch( 'configLayerQueries', { id: this.itemId, queries: qs } )
                },
            }
        },
        methods: {
            addQuery: function () {
                var qs = this.queries
                qs.push( {
                    id: this.itemId + '-query-' + qs.length, // todo check unique
                    title: 'New query title',
                    description: 'New query description',
                    parameters: [],
                    predicate: null
                } )
                this.$store.dispatch( 'configLayerQueries', { id: this.itemId, queries: qs } )
            },
            removeQuery: function ( index ) {
                var qs = this.queries
                qs.splice( index, 1 )
                this.$store.dispatch( 'configLayerQueries', { id: this.itemId, queries: qs } )
            }
        },
        mounted: function () {
            var self = this

            M.updateTextFields()
            M.Collapsible.init( this.$refs.collapsible, {
                onOpenStart: function ( el ) {
                    self.activeQueryIndex = 1 * el.dataset.index
                },
            } )
        },
        updated: function () {
            var self = this

            M.updateTextFields()
            M.Collapsible.init( this.$refs.collapsible, {
                onOpenStart: function ( el ) {
                    self.activeQueryIndex = 1 * el.dataset.index
                },
            } )
        },
    } )
} )
