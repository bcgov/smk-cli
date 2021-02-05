function project( base, nameDefault, opt ) {
    return Object.keys( nameDefault ).reduce( function ( acc, n ) {
        if ( n in opt ) {
            acc[ n ] = opt[ n ]
        }
        else {
            acc[ n ] = nameDefault[ n ]
        }
        return acc
    }, base )
}

function Base ( opt ) {
    return project( {}, {
        type:           null,
        id:             null,
        title:          null,
        isVisible:      true,
        isQueryable:    false,
        opacity:        1.0,
        minScale:       null,
        maxScale:       null,
        titleAttribute: null,
        attributes:     null,
        queries:        null
    }, opt )
}

function EsriDynamic ( opt ) {
    var out = Base( opt )

    out.type = 'esri-dynamic'

    return project( out, {
        mpcmId:         null,
        mpcmWorkspace:  null,
        serviceUrl:     null,
        dynamicLayers:  null
    }, opt )
}

function WMS ( opt ) {
    var out = Base( opt )

    out.type = 'wms'

    return project( out, {
        serviceUrl:null,
        layerName: null,
        styleName: null
    }, opt )
}

function Vector ( opt ) {
    var out = Base( opt )

    out.type = 'vector'

    return project( out, {
        useClustering: false,
        dataUrl: null,
        legend: null,
        style: null
    }, opt )
}

module.exports = {
    EsriDynamic: EsriDynamic,
    WMS: WMS,
    Vector: Vector
}
