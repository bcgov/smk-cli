import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
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
            attributeName: attributeAccessor( 'name' ),
            attributeTitle: attributeAccessor( 'title' ),
            // attributeVisible: attributeAccessor( 'visible' ),
            canMoveUp: function () { return this.activeAttributeIndex > 0 },
            canMoveDown: function () { return this.activeAttributeIndex < ( this.attributes.length - 1 ) },
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
            moveUp: function () {
                var attrs = this.attributes
                attrs.splice( this.activeAttributeIndex - 1, 2, attrs[ this.activeAttributeIndex ], attrs[ this.activeAttributeIndex - 1 ] )
                this.$store.dispatch( 'configLayer', { id: this.itemId, attributes: attrs } )
                // this.activeAttributeIndex -= 1
                M.Collapsible.getInstance( this.$refs.collapsible ).open( this.activeAttributeIndex - 1 )
            },
            moveDown: function () {
                var attrs = this.attributes
                attrs.splice( this.activeAttributeIndex, 2, attrs[ this.activeAttributeIndex + 1 ], attrs[ this.activeAttributeIndex ] )
                this.$store.dispatch( 'configLayer', { id: this.itemId, attributes: attrs } )
                // this.activeAttributeIndex += 1
                M.Collapsible.getInstance( this.$refs.collapsible ).open( this.activeAttributeIndex + 1 )

            },
        },
        mounted: function () {
            var self = this

            M.updateTextFields()
            M.Collapsible.init( this.$refs.collapsible, {
                onOpenStart: function ( el ) {
                    self.activeAttributeIndex = 1 * el.dataset.index
                },
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
