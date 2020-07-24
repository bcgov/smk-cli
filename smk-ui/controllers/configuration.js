const fs = require('fs');
const shell = require('shelljs');

module.exports = function ( app ) {
    app.get( '/config', handleReq( getConfig ) )
    app.post( '/config', handleReq( saveConfig ) )

    app.post("/SaveImage/:fileName", (req, res, next) =>
    {
        try
        {
            saveImage(req, res, next);
        }
        catch(err)
        {
            console.error(err);
            res.writeHead(500);
            res.end();
        }
    });

    app.post("/SaveAttachment/:fileName", (req, res, next) =>
    {
        try
        {
            saveAttachment(req, res, next);
        }
        catch(err)
        {
            console.error(err);
            res.writeHead(500);
            res.end();
        }
    });

    // app.post("/TestConfig", (req, res, next) =>
    // {
    //     try
    //     {
    //         testConfig(req, res, next);
    //     }
    //     catch(err)
    //     {
    //         console.error(err);
    //         res.writeHead(500);
    //         res.end();
    //     }
    // });

    // app.post("/BuildConfig/:release", (req, res, next) =>
    // {
    //     try
    //     {
    //         buildConfig(req, res, next);
    //     }
    //     catch(err)
    //     {
    //         console.error(err);
    //         res.writeHead(500);
    //         res.end();
    //     }
    // });

        // try
        // {
            // getConfig(req, res, next);
        // }
        // catch(err)
        // {
            // console.log(err);
            // res.writeHead(500);
            // res.end();
        // }
    // } )

    function handleReq( handler ) {
        return function ( req, res, next ) {
            console.log( (new Date()).toISOString(), req.method, req.url )
            try {
                handler.call( null, req, res, next )
            }
            catch ( err ) {
                console.warn( err );
                res.status( 500 ).json( { error: err.toString() } )
            }
        }
    }
};

function saveImage(req, res, next)
{
    console.log('SaveImage ->');
    var fileName = req.params.fileName;
    var body = '';
    console.log('Reading body content...');
    req.on('data', function(data)
    {
        body += data;
    });

    req.on('end', function ()
    {
        console.log(body);
        var base64Data = body.split(';base64,').pop();
        console.log(base64Data);

        // check the datatype first, png, jpg etc.

        fs.writeFile('./attachments/' + fileName + '.png', base64Data, {encoding: 'base64'}, function(err)
        {
            if(err)
            {
                console.error(err);
                res.writeHead(500);
                res.end();
            }
            else res.json({ message: 'Success' });
        });
    });
}

function saveAttachment(req, res, next)
{
    console.log('SaveAttachment ->');

    var fileName = req.params.fileName;
    var body = '';
    console.log('Reading body content...');
    req.on('data', function(data)
    {
        body += data;
    });

    req.on('end', function ()
    {
        console.log('Attempting to store attachment ' + fileName + '.json...');
        fs.writeFile('./attachments/' + fileName + '.json', body, function(err)
        {
            if(err)
            {
                console.error(err);
                res.writeHead(500);
                res.end();
            }
            else
            {
                console.log('Success!');
                res.json({ message: 'Success' });
            }
        });
    });
}

function getConfig( req, res, next ) {
    var configFile = req.app.get( 'smk config' )

    console.log( `    Reading config from ${ configFile }` );
    const data = JSON.parse( fs.readFileSync( configFile, { encoding: 'utf8' } ) )// function(err, data)
    res.json( data )
}

function saveConfig( req, res, next ) {
    var configFile = req.app.get( 'smk config' )

    // console.log('    Reading body content...');
    var body = '';
    req.on( 'data', function( data ) { body += data } )
    req.on( 'end', function () {
        console.log( `    Saving to ${ configFile }` )
        var json = JSON.parse( body )
        fs.writeFileSync( configFile, JSON.stringify( json, null, '    ' ) )
        res.json( { ok: true, message: 'Successfully saved to ' + configFile } )
    } )
}

// function testConfig(req, res, next)
// {
//     console.log('TestConfig ->');

//     // this will launch a grunt server process... but will lock up our running service.active
//     // we may need to embed SMK, but that will need to be template specific
//     shell.exec('npm install --production');
//     shell.exec('npm install grunt-release --save-dev');
//     shell.exec('grunt');

//     console.log('Success!');
//     res.json({ message: 'Success' });
// }

// function buildConfig(req, res, next)
// {
//     console.log('BuildConfig ->');

//     var release = req.params.release.toLowerCase() === 'true' ? true : false;

//     console.log('Building release version? ' + release);
//     var command = 'grunt' + (release ? ' release' : ' develop');
//     console.log('Executing: ' + command);

//     shell.exec('npm install --production');
//     shell.exec('npm install grunt-release --save-dev');

//     var orgDir = process.cwd();
//     process.chdir(orgDir + "/src");

//     var result = shell.exec(command);
//     process.chdir(orgDir);

//     console.log('Complete');
//     res.json({ message: 'Success', result: result });
// }

