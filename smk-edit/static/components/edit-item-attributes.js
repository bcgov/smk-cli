import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/materialize.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        data: function () {
            return {
                activeAttributeIndex: null
            }
        },
        computed: {
            attributes: function () {
                return this.$store.getters.configLayer( this.itemId ).attributes
            },
            // attributeName: attributeAccessor( 'name' ),
            attributeTitle: attributeAccessor( 'title' ),
            titleAttribute: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).titleAttribute
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, titleAttribute: val } )
                },
            },
            geometryAttribute: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).geometryAttribute
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, geometryAttribute: val } )
                },
            }
        },
        methods: {
            isAttributeVisible: function ( index ) {
                return this.attributes[ index ].visible
            },
            setAtributeVisible: function ( index, val ) {
                var attrs = this.attributes
                attrs[ index ].visible = val
                this.$store.dispatch( 'configLayer', { id: this.itemId, attributes: attrs } )
            },
            canMoveUp: function ( index ) { return index > 0 },
            canMoveDown: function ( index ) { return index < ( this.attributes.length - 1 ) },
            moveUp: function ( index ) {
                M.Collapsible.getInstance( this.$refs.collapsible ).close( index )
                var attrs = this.attributes
                attrs.splice( index - 1, 2, attrs[ index ], attrs[ index - 1 ] )
                this.$store.dispatch( 'configLayer', { id: this.itemId, attributes: attrs } )
                M.Collapsible.getInstance( this.$refs.collapsible ).open( index - 1 )
            },
            moveDown: function ( index ) {
                M.Collapsible.getInstance( this.$refs.collapsible ).close( index )
                var attrs = this.attributes
                attrs.splice( index, 2, attrs[ index + 1 ], attrs[ index ] )
                this.$store.dispatch( 'configLayer', { id: this.itemId, attributes: attrs } )
                M.Collapsible.getInstance( this.$refs.collapsible ).open( index + 1 )
            },
        },
        mounted: function () {
            var self = this

            M.updateTextFields()
            M.Collapsible.init( this.$refs.collapsible, {
                onOpenStart: function ( el ) {
                    self.activeAttributeIndex = 1 * el.dataset.index
                },
                onOpenEnd: function ( el ) {
                    el.scrollIntoView( { behavior: 'smooth', block: 'center' } )
                }

            } )
        },
        updated: function () {
            M.updateTextFields()
        }
    } )
} )

function attributeAccessor( prop ) {
    return {
        get: function () {
            if ( this.activeAttributeIndex == null ) return
            return this.attributes[ this.activeAttributeIndex ][ prop ]
        },
        set: function ( val ) {
            if ( this.activeAttributeIndex == null ) return
            var attrs = this.attributes
            attrs[ this.activeAttributeIndex ][ prop ] = val
            this.$store.dispatch( 'configLayer', { id: this.itemId, attributes: attrs } )
        },
    }
}
