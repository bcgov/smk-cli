const fs = require( 'fs' )
const path = require( 'path' )
const DOMParser = require( "xmldom" ).DOMParser
const kmlToGeoJson = require( '@tmcw/togeojson' )
const shapefile = require( 'shapefile' )
// const fgdb = require( 'fgdb' )
const unzipper = require( 'unzipper' )
const Projector = require( './projector' )
// const shell = require( 'shelljs' )
const multer = require( 'multer' )
const { promisify } = require( 'util' )
const readdir = promisify( fs.readdir )
const rmdir = promisify( fs.rmdir )
const unlink = promisify( fs.unlink )

module.exports = function( app, logger ) {
    var tempPath = path.resolve( app.get( 'temp' ) )
    rmdirs( tempPath ).then( function () {
        fs.mkdirSync( tempPath )
    } ).catch( function () {} )

    var upload = multer( { dest: tempPath, limits: { fieldSize: Number.POSITIVE_INFINITY } } ).single( 'file' )

    app.use(  '/convert', logger )

    app.post( '/convert/geojson', upload, unzip, convertGeoJson, cleanup )
    app.post( '/convert/kml',     upload, unzip, convertKml, cleanup )
    app.post( '/convert/shape',   upload, unzip, convertShape, cleanup )
    app.post( '/convert/csv',     upload, unzip, convertCsv, cleanup )
    // app.post( '/convert/wfs',     upload, convertWfs )

    function unzip( req, res, next ) {
        var unzip = req.file.path + '-unzip'
        fs.mkdirSync( unzip )

        fs.createReadStream( req.file.path )
            .pipe( unzipper.Extract( { path: unzip } ) )
            .on( 'close', function () {
                console.log( `    Unzipped into ${ unzip }` )
                req.file.unzip = unzip
                readdir( req.file.unzip, { withFileTypes: true } )
                    .then( function ( entries ) {
                        req.file.unzips = entries.map( function ( e ) { return e.name } )
                        next()
                    } )
            } )
            .on( 'error', function ( error ) {
                rmdirs( unzip ).catch( function () {} )
                next()
            } )
    }

    function cleanup( req, res, next ) {
        if ( fs.existsSync( req.file.path ) ) {
            unlink( req.file.path ).catch( function () {} )
        }

        if ( req.file.unzip && fs.existsSync( req.file.unzip ) ) {
            rmdirs( req.file.unzip ).catch( function () {} )
        }
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function convertGeoJson( req, res, next ) {
    const input = selectInputFile( req, 'geojson' ) || selectInputFile( req, 'json' ) || selectInputFile( req )
    if ( !input)
        throw Error( 'No suitable input file found' )

    console.log( `    Convert GeoJson from ${ input }` )

    const geojson = JSON.parse( fs.readFileSync( input, { encoding: 'utf8' } ) )
    // check for geojson-ness

    res.json( {
        ok: true,
        message: `Converted ${ req.file.originalname }`,
        data: geojson
    } )

    console.log('    Success!');
    next()
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function convertKml( req, res, next ) {
    const input = selectInputFile( req, 'kml' ) || selectInputFile( req )
    if ( !input)
        throw Error( 'No suitable input file found' )

    console.log( `    Convert KML from ${ input }` )

    var kml = fs.readFileSync( input, { encoding: 'utf8' } )
    var parsed = new DOMParser().parseFromString( kml )
    var geojson = kmlToGeoJson.kml( parsed, { styles: true } )

    res.json( {
        ok: true,
        message: `Converted ${ req.file.originalname }`,
        data: geojson
    } )

    console.log('    Success!');
    next()
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function convertShape( req, res, next ) {
    const shp = selectInputFile( req, 'shp' )
    const dbf = selectInputFile( req, 'dbf' )
    if ( !shp || !dbf )
        throw Error( 'No suitable input file found' )

    console.log( `    Convert Shape ${ shp }` )

    var geojson = { type: "FeatureCollection", features: [] }

    var projector
    const prj = selectInputFile( req, 'prj' )
    if ( prj ) {
        var fromProj = fs.readFileSync( prj, { encoding: 'utf8' } )
        projector = new Projector( fromProj )

        console.log( `    Projecting from ${ fromProj } to EPSG:4326` )
    }

    shapefile.open( shp, dbf )
        .then( function ( source ) {
            return source.read().then( readFeature )

            function readFeature( result ) {
                if ( result.done ) return

                if ( projector )
                    projector.project( result.value.geometry )

                geojson.features.push( result.value )

                return source.read().then( readFeature )
            }
        } )
        .then( function () {
            res.json( {
                ok: true,
                message: `Converted ${ req.file.originalname }`,
                data: geojson
            } )

            console.log('    Success!');
            next()
        } )
        .catch( function ( err ) {
            next( err )
        } )
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function convertCsv( req, res, next ) {
    console.log( `    Convert CSV ${ req.file.path }` )
    next()
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function selectInputFile( req, ext ) {
    if ( !req.file.unzip ) return req.file.path

    if ( ext ) {
        ext = '.' + ext.toLowerCase()
        var inps = req.file.unzips.filter( function ( f ) {
            return path.parse( f ).ext.toLowerCase() == ext
        } )

        if ( inps.length != 1 )
            return

        return path.join( req.file.unzip, inps[ 0 ] )
    }

    if ( req.file.unzips.length == 1 )
        return path.join( req.file.unzip, req.file.unzips[ 0 ] )
}


// function processFgdb(req, res, next)
// {
//     console.log('processFgdb ->');

//     console.log('Unzipping FGDB...');
//     fs.createReadStream('./attachments/temp.zip').pipe(unzipper.Extract({ path: './attachments' }).on('close', function(finish)
//     {
//         // find a directory with a .gdb extension
//         fs.readdir('./attachments', function (err, files)
//         {
//             if (err)
//             {
//                 console.error('Error during FGDB convert...');
//                 console.error(error);
//                 console.log('cleaning temp files');
//                 cleanupTempFiles('./attachments', ['temp.zip']);
//                 throw new Error(error);
//             }

//             var gdbPath = '';

//             for(var i = 0 ; i < files.length; i++)
//             {
//                 var fromPath = path.join('./attachments', files[i]);
//                 if(fromPath.includes('.gdb')) gdbPath = fromPath;
//             }

//             console.log('Found FGDB in path: ' + gdbPath);
//             console.log('Processing FGDB...');
//             fgdb(gdbPath)
//             .then(function(objectOfGeojson)
//             {
//                 console.log('Successfully processed FGDB!');

//                 // there may be multiple feature classes, and we may need to do some projection...
//                 var featureClassKeys = Object.keys(objectOfGeojson);
//                 for(var i = 0; i < featureClassKeys.length; i++)
//                 {
//                     var key = featureClassKeys[i];
//                     var featureClass = objectOfGeojson[key];

//                     if(featureClass.bbox[0] > 180 || featureClass.bbox[0] < 180)
//                     {
//                         console.log('Reprojecting feature: ' + key);
//                         // not WGS84, reproject
//                         // we don't know the source projection, so assume BCAlbers?
//                         var projector = new Projector('EPSG:3005', 'EPSG:4326');
//                         for(var featureIdx = 0; featureIdx < featureClass.features.length; featureIdx++)
//                         {
//                             var feature = featureClass.features[featureIdx];
//                             projector.project(feature.geometry);
//                         }
//                     }
//                 }

//                 console.log('Sending geojson response...');
//                 // send the feature classes back. The Processor will create layers
//                 // for each feature class
//                 res.json(objectOfGeojson);

//                 cleanupTempFiles('./attachments', ['temp.zip']);
//                 // cleanup temp folder too!
//             },
//             function(error)
//             {
//                 console.error('Error during FGDB convert...');
//                 console.error(error);
//                 console.log('cleaning temp files');
//                 cleanupTempFiles('./attachments', ['temp.zip']);
//                 throw new Error(error);
//             });
//         });
//     }));
// }


async function rmdirs( dir ) {
    let entries = await readdir( dir, { withFileTypes: true } )
    await Promise.all( entries.map( entry => {
        let fullPath = path.join( dir, entry.name )
        return entry.isDirectory() ? rmdirs( fullPath ) : unlink( fullPath )
    } ) )
    await rmdir(dir)
}
