import { vueComponent, importComponents } from '../vue-util.js'

function parsePair( val ) {
    if ( val == null ) return
    return `${ val[ 0 ] }, ${ val[ 1 ] }`
}

const pairPattern = /^\s*\d+\s*,\s*\d+\s*$/
function validatePair( val ) {
    if ( !val ) return null
    if ( !pairPattern.test( val ) ) return
    return val.split( ',' ).map( function ( v ) { return parseInt( v ) } )
}

function validateInt( val ) {
    return parseInt( val )
}

function validateFloat( val ) {
    return parseFloat( val )
}

export default importComponents( [
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        data: function () {
            return {
                dashArrayPattern: /^((\s*\d+\s+)+\d+\s*)?$/,
                pairPattern: pairPattern,
                assetsKey: 1,
                assets: null
            }
        },
        computed: {
            hasMarker: attributeAccessor( 'marker', function ( val ) {
                if ( val == null ) return !!this.markerUrl
                return val
            } ),
            markerUrl: attributeAccessor( 'markerUrl' ),
            markerSize: attributeAccessor( 'markerSize', parsePair, validatePair ),
            markerOffset: attributeAccessor( 'markerOffset', parsePair, validatePair ),
            shadowUrl: attributeAccessor( 'shadowUrl' ),
            shadowSize: attributeAccessor( 'shadowSize', parsePair, validatePair ),

            isStroked: attributeAccessor( 'stroke', true ),
            strokeColor: attributeAccessor( 'strokeColor', '#3388ff' ),
            strokeWidth: attributeAccessor( 'strokeWidth', 3, validateInt ),
            strokeOpacity: attributeAccessor( 'strokeOpacity', 1, validateFloat ),
            strokeCap: attributeAccessor( 'strokeCap', 'round' ),
            strokeJoin: attributeAccessor( 'strokeJoin', 'round' ),
            strokeDashes: attributeAccessor( 'strokeDashes', null, function ( val ) {
                if ( !this.dashArrayPattern.test( val ) ) return
                return val
            } ),

            isFilled: attributeAccessor( 'fill', false ),
            fillColor: attributeAccessor( 'fillColor', function ( v ) { return v == null ? this.strokeColor : v } ),
            fillOpacity: attributeAccessor( 'fillOpacity', .2, validateFloat ),

            showLegendTitle: {
                get: function () {
                    var ly = this.$store.getters.configLayer( this.itemId )
                    return !ly.legend || !ly.legend.title || !!ly.legend.title.trim()
                },
                set: function ( val ) {
                    var ly = this.$store.getters.configLayer( this.itemId )
                    if ( val ) {
                        ly.legend.title = null
                    }
                    else {
                        if ( !ly.legend ) ly.legend = {}
                        ly.legend.title = ' '
                    }
                    this.$store.dispatch( 'configLayer', ly )
                }
            },
            legendTitle: {
                get: function () {
                    var ly = this.$store.getters.configLayer( this.itemId )
                    return ( ly.legend && ly.legend.title ) || ly.title
                },
                set: function ( val ) {
                    if ( !val ) val = ' '
                    this.setLegend( 'title', val )
                }
            },
            legendPoint: {
                get: function () {
                    var ly = this.$store.getters.configLayer( this.itemId )
                    return ly.legend && ly.legend.point
                },
                set: function ( val ) {
                    this.setLegend( 'point', val )
                }
            },
            legendLine: {
                get: function () {
                    var ly = this.$store.getters.configLayer( this.itemId )
                    return ly.legend && ly.legend.line
                },
                set: function ( val ) {
                    this.setLegend( 'line', val )
                }
            },
            legendFill: {
                get: function () {
                    var ly = this.$store.getters.configLayer( this.itemId )
                    return ly.legend && ly.legend.fill
                },
                set: function ( val ) {
                    this.setLegend( 'fill', val )
                }
            }
        },
        watch: {
            hasMarker: function ( val ) {
                if ( !val ) {
                    this.markerUrl = null
                    M.Collapsible.getInstance( this.$refs.collapsible ).close( 0 )
                }

            },
            isStroked: function ( val ) {
                if ( !val ) {
                    M.Collapsible.getInstance( this.$refs.collapsible ).close( 1 )
                }
            },
            isFilled: function ( val ) {
                if ( !val ) {
                    M.Collapsible.getInstance( this.$refs.collapsible ).close( 2 )
                }
            },
            markerUrl: function ( val ) {
                this.markerSize = null
                this.markerOffset = null
            }
        },
        methods: {
            invalid: function () {
                console.log('invalid')
            },
            setLegend( geometryType, visible ) {
                var legend = this.$store.getters.configLayer( this.itemId ).legend || {}
                legend[ geometryType ] = visible

                var legends = !legend.point && !legend.line && !legend.fill ? false : null

                this.$store.dispatch( 'configLayer', { id: this.itemId, legends: legends, legend: legend } )
            },
            loadAssets: function () {
                var self = this

                return fetch( '/catalog/asset' )
                    .then( function ( resp ) {
                        return resp.json()
                    } )
                    .then( function ( catalog ) {
                        self.assets = catalog
                        self.assetsKey += 1
                    } )
                    .catch( function ( err ) {
                        M.toast( { html: err.toString().replace( /^(Error: )+/, '' ) } )
                    } )
            },
            markerUpload: function ( ev ) {
                var self = this

                var file = ev.target.files[ 0 ]
                if ( !file ) return

                var formData = new FormData()
                formData.append( 'file', file )

                return fetch( `/catalog/asset`, {
                        method: 'POST',
                        cache: 'no-cache',
                        body: formData
                    } )
                    .then( function( resp ) {
                        return resp.json()
                    } )
                    .then( function ( result ) {
                        if ( !result.ok ) throw Error( result.message )
                        self.loadAssets().then( function () {
                            self.markerUrl = result.title
                            self.assetsKey += 1
                        } )
                    } )
                    .catch( function ( err ) {
                        M.toast( { html: err.toString().replace( /^(Error: )+/, '' ) } )
                    } )
            },
            markerImageLoad: function ( ev ) {
                if ( !this.$refs.markerImage || !this.$refs.markerImage.naturalWidth ) return

                if ( !this.markerSize )
                    this.markerSize = `${ this.$refs.markerImage.naturalWidth }, ${ this.$refs.markerImage.naturalHeight }`

                if ( !this.markerOffset )
                    this.markerOffset = `${ Math.round( this.$refs.markerImage.naturalWidth / 2 ) }, ${ Math.round( this.$refs.markerImage.naturalHeight / 2 ) }`
            },
            markerImageError: function () {
                this.markerSize = null
                this.markerOffset = null
                this.markerUrl = null
                this.assetsKey += 1
                M.toast( { html: 'Unable to load image' } )
            }
        },
        mounted: function () {
            M.updateTextFields()
            M.Collapsible.init( this.$refs.collapsible )
            this.loadAssets()
        },
    } )
} )

function attributeAccessor( prop, filter, valid ) {
    var filter1 = typeof filter == 'function' ? filter : function ( v ) { return v == null ? filter : v }
    return {
        get: function () {
            var v = this.$store.getters.configLayerStyle( this.itemId )[ prop ]
            return filter1.call( this, v )
        },
        set: function ( val ) {
            if ( valid ) {
                val = valid.call( this, val )
                if ( val === undefined ) return
            }
            this.$store.dispatch( 'configLayerStyle', { id: this.itemId, [ prop ]: val } )
        },
    }
}
