const xml2js = require( 'xml2js' ).parseString
const http = require( 'http' )
const layer = require( './layer.js' )
const path = require( 'path' )
const fs = require( 'fs' )
const multer = require( 'multer' )
const fetch = require( 'node-fetch' )
// const sizeOf = require( 'image-size' )

// move these into an external config
const DATABC_SERVICE_URL = 'https://maps.gov.bc.ca/arcgis/rest/services/mpcm/bcgw/MapServer'

const MPCM_OPTIONS = {
    host: 'apps.gov.bc.ca',
    port: '80',
    path: 'https://apps.gov.bc.ca/pub/mpcm/services/catalog/PROD',
    method: 'GET',
    headers: {
        accept: 'application/json'
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

module.exports = function( app, logger ) {
    app.use(    '/catalog', logger )

    app.get(    '/catalog/mpcm',            getMpcmCatalog )
    app.get(    '/catalog/mpcm/:id',        getMpcmCatalogLayerConfig )

    app.get(    '/catalog/wms/:url',        getWmsCatalog )
    app.get(    '/catalog/wms/:url/:id',    getWmsCatalogLayerConfig )

    var uploadLayer = multer( {
        dest: path.resolve( app.get( 'layers' ) ),
        limits: {
            fieldSize: Number.POSITIVE_INFINITY
        }
    } ).single( 'file' )

    app.get(    '/catalog/local',           getLocalCatalog )
    app.get(    '/catalog/local/:id',       getLocalCatalogLayerConfig )
    app.post(   '/catalog/local',           uploadLayer, postLocalCatalog )
    app.put(    '/catalog/local/:id',       uploadLayer, putLocalCatalogLayerConfig )
    app.delete( '/catalog/local/:id',       deleteLocalCatalogLayerConfig )

    var uploadAsset = multer( {
        dest: path.resolve( app.get( 'assets' ) ),
        limits: {
            fieldSize: Number.POSITIVE_INFINITY
        }
    } ).single( 'file' )

    app.get(    '/catalog/asset',           getAssetCatalog )
    app.get(    '/catalog/asset/:id',       getAssetCatalogItem )
    app.post(   '/catalog/asset',           uploadAsset, postAssetCatalog )
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var mpcmCatalogCache

function getMpcmCatalog( req, res, next ) {
    if ( mpcmCatalogCache ) {
        console.log( '    Using cached MPCM Catalog' )
        res.json( mpcmCatalogCache )
        return
    }

    console.log( '    Loading MPCM Catalog from ' + MPCM_OPTIONS.path )
    var mpcmReq = http.request( MPCM_OPTIONS, function( resp ) {
        resp.setEncoding('utf8');

        var msg = ''
        resp.on( 'data', function ( chunk ) { msg += chunk } )

        resp.on( 'end', function () {
            var mpcm = JSON.parse( msg )
            var catalog = convertFolders( mpcm.catalog.folders )

            res.json( mpcmCatalogCache = pruneCatalog( catalog ) )
            console.log('    Success!');
        } )
    } )

    mpcmReq.end();

    function convertFolders( folders ) {
        if ( !folders ) return []

        return [].concat( folders.folder ).reduce( function ( acc, f ) {
            acc.push( catalogItem( f.folderName, null, convertFolders( f.folders ).concat( convertLayers( f.layers ) ) ) )
            return acc
        }, [] )
    }

    function convertLayers( layers ) {
        if ( !layers ) return []

        return [].concat( layers.layer ).reduce( function ( acc, l ) {
            acc.push( catalogItem( l.layerDisplayName, { id: l.layerId } ) )
            return acc
        }, [] )
    }
}

function getMpcmCatalogLayerConfig( req, res, next ) {
    var mpcmId = req.params.id

    var options = JSON.parse( JSON.stringify( MPCM_OPTIONS ) )
    options.path += '/' + mpcmId;

    console.log( '    Loading MPCM Layer from ' + options.path )
    var mpcmReq = http.request( options, function ( resp ) {
        resp.setEncoding('utf8');

        var msg = '';
        resp.on( 'data', function( chunk ) { msg += chunk } )

        resp.on( 'end', function() {
            var mpcmLayer = JSON.parse( msg )[ 'gis-layer' ]

            var ly = layer.EsriDynamic( {
                id:             mpcmLayer.layerId,
                title:          mpcmLayer.layerDisplayName,
                opacity:        0.65,
                minScale:       mpcmLayer.minScale,
                maxScale:       mpcmLayer.maxScale,
                isQueryable:    true,
                // titleAttribute: null,
                mpcmId:         mpcmId,
                mpcmWorkspace:  mpcmLayer.workspaceName,
                serviceUrl:     DATABC_SERVICE_URL,
                dynamicLayers:  [ mpcmLayer.dynamicJson ],
            } )

            ly.metadataUrl = mpcmLayer.properties.property.find( function ( p ) {
                return p.key == 'metadata.url'
            } ).value

            ly.attributes = mpcmLayer.fields.field.map( function ( f ) {
                return {
                    name: f.fieldName,
                    title: f.fieldAlias,
                    visible: f.visible
                }
            } )

            res.json( ly )
            console.log( '    Success!' )
        } )
    } )

    mpcmReq.end()
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var wmsCatalogCache = {}
var wmsLayerCache = {}

function getWmsCatalog( req, res, next ) {
    var serviceUrl = req.params.url

    if ( wmsCatalogCache[ serviceUrl ] ) {
        console.log( '    Using cached WMS Catalog for ' + serviceUrl )
        res.json( wmsCatalogCache[ serviceUrl ] )
        return
    }

    console.log( '    Loading WMS Catalog from ' + serviceUrl )

    var url = new URL( serviceUrl )
    url.search = '?version=1.3.0&service=wms&request=GetCapabilities'
    var layerCache = {}

    return fetch( url )
        .then( function ( resp ) {
            return resp.text()
        } )
        .then( function ( text ) {
            return new Promise( function ( res, rej ) {
                xml2js( text, function ( err, result ) {
                    if ( err ) return rej( err )
                    res( result )
                } )
            } )
        } )
        .then( function ( capabilities ) {
            var catalog = convertLayer( assertOne( assertOne( capabilities.WMS_Capabilities.Capability ).Layer ) )

            catalog = pruneCatalog( catalog.children )

            catalog.sort( function ( a, b ) {
                return a.title > b.title ? 1 : -1
            } )

            wmsLayerCache[ serviceUrl ] = layerCache
            res.json( wmsCatalogCache[ serviceUrl ] = catalog );
            console.log('    Success!');
            next()
        } )
        .catch( function ( err ) {
            next( err )
        } )

    function convertLayer( wmsLayer ) {
        var title = assertOne( wmsLayer.Title )

        if ( wmsLayer.Layer ) {
            return catalogItem( title, null, wmsLayer.Layer.map( function ( ly ) {
                return convertLayer( ly )
            } ) )
        }
        else if ( wmsLayer.Style ) {
            var lyName = assertOne( wmsLayer.Name )

            return catalogItem( title, null,
                wmsLayer.Style.map( function ( st ) {
                    var stName = assertOne( st.Name ),
                        lyTitle = `${ title } ( ${ stName } )`,
                        id = slugify( lyName, stName )

                    if ( layerCache[ id ] ) return

                    layerCache[ id ] = layer.WMS( {
                        id: id,
                        title: lyTitle,
                        isQueryable: true,
                        opacity: 0.65,
                        // attribution: "",
                        // minScale: null,
                        // maxScale: null,
                        // titleAttribute: null,
                        metadataUrl: wmsLayer.MetadataURL && wmsLayer.MetadataURL[ 0 ].OnlineResource && wmsLayer.MetadataURL[ 0 ].OnlineResource[ 0 ].$[ "xlink:href" ],
                        // attributes:  [ ],
                        // queries: [],
                        serviceUrl: serviceUrl,
                        layerName: lyName,
                        styleName: stName
                    } )

                    return catalogItem( lyTitle, { id: id } )
                } ).filter( function ( i ) { return i } )
            )
        }
    }
}

function getWmsCatalogLayerConfig( req, res, next ) {
    var serviceUrl = req.params.url
    var id = req.params.id

    console.log( '    Using cached layer ' + id + ' from WMS Catalog for ' + serviceUrl )

    if ( !( serviceUrl in wmsLayerCache ) )
        throw Error( `${ serviceUrl } not in WMS Catalog cache` )

    if ( !( id in wmsLayerCache[ serviceUrl ] ) )
        throw Error( `${ id } not in WMS Catalog cache for ${ serviceUrl }` )

    var ly = wmsLayerCache[ serviceUrl ][ id ]

    if ( ly.attributes || ly.attributes === false ) {
        console.log('    Success!');
        return res.json( ly )
    }

    var url = new URL( serviceUrl )
    url.search = `?service=wfs&version=2.0.0&request=DescribeFeatureType&typeName=${ ly.layerName }&outputFormat=application/json`

    console.log( '    Attempting to populate attributes' );
    return fetch( url )
        .then( function ( resp ) {
            return resp.json()
        } )
        .then( function ( ft ) {
            if ( ft.featureTypes && ( ft.featureTypes[ 0 ].typeName == ly.layerName || `${ ft.targetPrefix }:${ ft.featureTypes[ 0 ].typeName }` == ly.layerName ) ) {
                ly.attributes = ft.featureTypes[ 0 ].properties.map( function ( p ) {
                    return {
                        id: slugify( p.name ),
                        name: p.name,
                        title: p.name.replace( /_/g, ' ' ),
                        visible: true
                    }
                } )
                console.log( `    Got ${ ly.attributes.length } attributes` )
            }
            else {
                console.log( ly )
                console.log( ft )
                ly.attributes = false
            }
            res.json( ly )
            console.log( '    Success!' )
            next()
        } )
        .catch( function ( err ) {
            console.log( err )

            ly.attributes = false
            res.json( ly )
            console.log( '    Success!' )
            next()
        } )
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function getLocalCatalog( req, res, next ) {
    var catalogFile = path.resolve( req.app.get( 'layers' ), '-smk-catalog.json' )

    if ( !fs.existsSync( catalogFile ) ) {
        console.log( `    No catalog at ${ catalogFile }` );
        res.status( 404 ).json( { error: `No catalog at ${ catalogFile }` } )
        return
    }

    console.log( `    Reading catalog from ${ catalogFile }` );
    const catalog = JSON.parse( fs.readFileSync( catalogFile, { encoding: 'utf8' } ) )

    if ( !( 'layers' in catalog ) || !Array.isArray( catalog.layers ) )
        throw Error( 'no layers in catalog' )

    var out = catalog.layers.map( function ( ly ) {
        return catalogItem( ly.title, { id: ly.id } )
    } )

    res.json( out )
    console.log('    Success!');
}

function getLocalCatalogLayerConfig( req, res, next ) {
    var id = req.params.id
    var catalogFile = path.resolve( req.app.get( 'layers' ), '-smk-catalog.json' )

    if ( !fs.existsSync( catalogFile ) ) {
        console.log( `    No catalog at ${ catalogFile }` );
        res.status( 404 ).json( { error: `No catalog at ${ catalogFile }` } )
        return
    }

    console.log( `    Reading catalog from ${ catalogFile }` );
    const catalog = JSON.parse( fs.readFileSync( catalogFile, { encoding: 'utf8' } ) )

    if ( !( 'layers' in catalog ) || !Array.isArray( catalog.layers ) )
        throw Error( 'no layers in catalog' )

    var ly = catalog.layers.find( function ( ly ) { return ly.id == id } )
    if ( !ly ) {
        console.log( `    No layer for ${ id } in ${ catalogFile }` );
        res.status( 404 ).json( { error: `No layer for ${ id } in ${ catalogFile }` } )
        return
    }

    var out = layer.Vector( {
        id: id,
        title: ly.title,
        isQueryable: true,
        opacity: 0.65,
        // attribution: "",
        // minScale: null,
        // maxScale: null,
        // titleAttribute: null,
        // attributes:  [ ],
        // queries: [],
        dataUrl: ly.dataUrl,
        attributes: ly.attributes,
    } )

    res.json( out )
    console.log('    Success!');
}

function postLocalCatalog( req, res, next ) {
    var catalogFile = path.resolve( req.app.get( 'layers' ), '-smk-catalog.json' )

    if ( !fs.existsSync( catalogFile ) ) {
        console.log( `    Creating catalog at ${ catalogFile }` );
        var dir = path.resolve( req.app.get( 'layers' ) )
        if ( !fs.existsSync( dir ) )
            fs.mkdirSync( dir )

        fs.writeFileSync( catalogFile, JSON.stringify( { layers: [] } ) )
    }

    console.log( `    Reading catalog from ${ catalogFile }` );
    const catalog = JSON.parse( fs.readFileSync( catalogFile, { encoding: 'utf8' } ) )

    if ( !( 'layers' in catalog ) || !Array.isArray( catalog.layers ) )
        throw Error( 'no layers in catalog' )

    var ly = JSON.parse( req.body.layer )

    if ( !ly.id )
        ly.id = slugify( ly.title )

    var i = 0
    while ( catalog.layers.find( function ( l ) { return l.id == ly.id } ) ) {
        i += 1
        ly.id = slugify( ly.title, i )
    }

    var outputFile = path.resolve( req.app.get( 'layers' ), `${ ly.id }.geojson` )

    if ( req.file ) {
        console.log( `    Adding ${ ly.id } to catalog from ${ req.file.originalname }` )
        console.log( req.file )
        // TODO
    }
    else if ( req.body.file ) {
        console.log( `    Adding ${ ly.id } to catalog from geojson` )

        var geojson = JSON.parse( req.body.file )
        ly.attributes = extractGeoJsonAttributes( geojson )
        if ( ly.attributes )
            console.log( `    Found ${ ly.attributes.length } attributes` )

        fs.writeFileSync( outputFile, JSON.stringify( geojson ) )
        ly.dataUrl = `./layers/${ ly.id }.geojson`
        finish()
    }
    else {
        console.log( `    Adding ${ ly.id } to catalog from ${ ly.dataUrl }` )

        fetch( ly.dataUrl )
            .then( function ( resp ) {
                if ( !resp.ok ) throw Error( 'request failed' )
                return resp.json()
            } )
            .then( function ( geojson ) {
                ly.attributes = extractGeoJsonAttributes( geojson )
                if ( ly.attributes )
                    console.log( `    Found ${ ly.attributes.length } attributes` )

                finish()
                next()
            } )
    }

    function finish() {
        catalog.layers.push( ly )

        fs.writeFileSync( catalogFile, JSON.stringify( catalog, null, '    ' ) )

        res.json( { ok: true, message: `Successfully added ${ ly.id } to ${ catalogFile }` } )
        console.log('    Success!');
    }
}

function putLocalCatalogLayerConfig( req, res, next ) {
    var id = req.params.id
    var catalogFile = path.resolve( req.app.get( 'layers' ), '-smk-catalog.json' )

    if ( !fs.existsSync( catalogFile ) ) {
        console.log( `    No catalog at ${ catalogFile }` );
        res.status( 404 ).json( { error: `No catalog at ${ catalogFile }` } )
        return
    }

    console.log( `    Reading catalog from ${ catalogFile }` );
    const catalog = JSON.parse( fs.readFileSync( catalogFile, { encoding: 'utf8' } ) )

    if ( !( 'layers' in catalog ) || !Array.isArray( catalog.layers ) )
        throw Error( 'no layers in catalog' )

    var ly = catalog.layers.find( function ( ly ) { return ly.id == id } )
    if ( !ly ) {
        console.log( `    No layer for ${ id } in ${ catalogFile }` );
        res.status( 404 ).json( { error: `No layer for ${ id } in ${ catalogFile }` } )
        return
    }

    console.log( `    Modifying ${ ly.id }` )

    if ( req.body.title ) ly.title = req.body.title

    fs.writeFileSync( catalogFile, JSON.stringify( catalog, null, '    ' ) )

    res.json( { ok: true, message: `Successfully modified ${ ly.id }` } )
    console.log('    Success!');
}

function deleteLocalCatalogLayerConfig( req, res, next ) {
    var id = req.params.id
    var catalogFile = path.resolve( req.app.get( 'layers' ), '-smk-catalog.json' )

    if ( !fs.existsSync( catalogFile ) ) {
        console.log( `    No catalog at ${ catalogFile }` );
        res.status( 404 ).json( { error: `No catalog at ${ catalogFile }` } )
        return
    }

    console.log( `    Reading catalog from ${ catalogFile }` );
    const catalog = JSON.parse( fs.readFileSync( catalogFile, { encoding: 'utf8' } ) )

    if ( !( 'layers' in catalog ) || !Array.isArray( catalog.layers ) )
        throw Error( 'no layers in catalog' )

    var ly = catalog.layers.find( function ( ly ) { return ly.id == id } )
    if ( !ly ) {
        console.log( `    No layer for ${ id } in ${ catalogFile }` );
        res.status( 404 ).json( { error: `No layer for ${ id } in ${ catalogFile }` } )
        return
    }

    console.log( `    Deleting ${ ly.id }` )

    catalog.layers = catalog.layers.filter( function ( item ) { return item.id != id } )

    fs.writeFileSync( catalogFile, JSON.stringify( catalog, null, '    ' ) )

    res.json( { ok: true, message: `Successfully deleted ${ ly.id }` } )
    console.log('    Success!');
}

function extractGeoJsonAttributes( geojson ) {
    var fts

    if ( geojson.type == 'FeatureCollection' ) {
        fts = geojson.features
    }
    else {
        console.log(geojson)
    }

    if ( fts ) {
        return Object.keys( fts[ 0 ].properties ).map( function ( p ) {
            return {
                id: slugify( p ),
                name: p,
                title: p,
                visible: true
            }
        } )
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function getAssetCatalog( req, res, next ) {
    var assetDir = path.resolve( req.app.get( 'assets' ) )

    if ( !fs.existsSync( assetDir ) ) {
        console.log( `    No catalog at ${ assetDir }` );
        fs.mkdirSync( assetDir )
    }

    console.log( `    Reading catalog from ${ assetDir }` );
    var assets = fs.readdirSync( assetDir, { encoding: 'utf8' } )

    var out = assets.map( function ( a ) {
        return catalogItem( 'assets/' + a, { id: slugify( a ) } )
    } )

    res.json( out )
    console.log('    Success!');
}

function getAssetCatalogItem( req, res, next ) {
    var id = req.params.id
    var assetDir = path.resolve( req.app.get( 'assets' ) )

    if ( !fs.existsSync( assetDir ) ) {
        console.log( `    No catalog at ${ assetDir }` );
        fs.mkdirSync( assetDir )
    }

    console.log( `    Reading catalog from ${ assetDir }` );
    var assets = fs.readdirSync( assetDir, { encoding: 'utf8' } )

    var asset = assets.find( function ( a ) { return id == slugify( a ) } )
    if ( !asset ) {
        console.log( `    No asset for ${ id } in ${ assetDir }` );
        res.status( 404 ).json( { error: `No asset for ${ id } in ${ assetDir }` } )
        return
    }

    // var dim = sizeOf( path.resolve( assetDir, asset ) )
    var out = {
        id: slugify( asset ),
        title: 'assets/' + asset,
        // width: dim.width,
        // height: dim.height,
    }

    res.json( out )
    console.log('    Success!');
}

function postAssetCatalog( req, res, next ) {
    var id
    if ( req.file ) {
        id = slugify( req.file.originalname )
        console.log( `    Adding ${ id } to assets from ${ req.file.originalname }` )
        fs.renameSync( req.file.path, path.resolve( req.app.get( 'assets' ), req.file.originalname ) )
    }

    res.json( { ok: true, message: `Successfully added ${ id }`, id: id, title: 'assets/' + req.file.originalname } )
    console.log('    Success!');
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function slugify( ) {
    return [].slice.call( arguments )
        .filter( function ( a ) { return !!a } )
        .map( function ( a ) {
            return ( '' + a ).replace( /[^0-9a-z]+/ig, '-' ).replace( /^[-]+|[-]+$/g, '' ).toLowerCase()
        } )
        .filter( function ( a ) { return !!a } )
        .join( '--' )
}

function catalogItem( title, data, children ) {
    return {
        title: title,
        data: data,
        folder: children && children.length > 0,
        children: children
    }
}

function assertOne( arr ) {
    if ( !Array.isArray( arr ) ) throw Error( 'not an array' )
    if ( arr.length != 1 ) throw Error( 'not exactly one element' )
    return arr[ 0 ]
}

function pruneCatalog( items ) {
    return items.map( function ( i ) {
        if ( !i.folder ) return i

        i.children = pruneCatalog( i.children )

        if ( i.children.length == 1 )
            return i.children[ 0 ]

        return i
    } )
}
