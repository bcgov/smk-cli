import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/materialize.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId', 'queryId' ],
        data: function () {
            return {
                // queriesKey: 1,
                activeParameterIndex: null
            }
        },
        computed: {
            parameters: function () {
                return this.$store.getters.configLayerQueryParameters( this.itemId, this.queryId )
            },
            parameterTitle: attributeAccessor( 'title' ),
            parameterValue: attributeAccessor( 'value' ),
            parameterChoices: attributeAccessor( 'choices' ),
            parameterUniqueAttribute: attributeAccessor( 'uniqueAttribute' ),
            parameterUseFallback: attributeAccessor( 'useFallback' ),
            attributes: function () {
                return this.$store.getters.configLayer( this.itemId ).attributes
            }
        },
        methods: {
            addParameter: function () {
                var ps = this.parameters
                ps.push( {
                    id: 'parameter-' + ps.length, // todo check unique
                    title: 'New parameter title',
                    type: 'input',
                } )
                this.$store.dispatch( 'configLayerQueryParameters', { id: this.itemId, queryId: this.queryId, parameters: ps } )
            },
            removeQuery: function ( index ) {
                var ps = this.parameters
                ps.splice( index, 1 )
                this.$store.dispatch( 'configLayerQueryParameters', { id: this.itemId, queryId: this.queryId, parameters: ps } )
            },
            getParameterType: function ( index ) {
                return this.parameters[ index ].type
            },
            setParameterType: function ( index, type ) {
                var ps = this.parameters
                ps[ index ].type = type
                this.$store.dispatch( 'configLayerQueryParameters', { id: this.itemId, queryId: this.queryId, parameters: ps } )
            }
        },
        mounted: function () {
            var self = this

            M.updateTextFields()
            M.Collapsible.init( this.$refs.collapsible, {
                onOpenStart: function ( el ) {
                    self.activeParameterIndex = 1 * el.dataset.index
                },
            } )
        },
        updated: function () {
            var self = this

            M.updateTextFields()
            M.Collapsible.init( this.$refs.collapsible, {
                onOpenStart: function ( el ) {
                    self.activeParameterIndex = 1 * el.dataset.index
                },
            } )
        },
    } )
} )

function attributeAccessor( prop ) {
    return {
        get: function () {
            if ( this.activeParameterIndex == null ) return
            return this.parameters[ this.activeParameterIndex ][ prop ]
        },
        set: function ( val ) {
            if ( this.activeParameterIndex == null ) return
            var ps = this.parameters
            ps[ this.activeParameterIndex ][ prop ] = val
            this.$store.dispatch( 'configLayerQueryParameters', { id: this.itemId, queryId: this.queryId, parameters: ps } )
        }
    }
}