var express    = require('express');        // call express
var Patch      = require('../models/patch');
var router     = express.Router();

router.route('/get').get( function( request, response ) {
    Patch.find( function( error, patches ) {

        if ( error ) {
            response.send( error );
        }

        response.json( patches );
    });
});

router.route('/get/:id').get( function(request, response ) {
    Patch.findById( request.params.id, function( error, patch ) {

        if ( error ) {
            response.send( error );
        }

        response.json( patch );
    });
});

router.route('/add').post( function( request, response ) {

    var patch = new Patch();

    patch.name        = request.body.name;
    patch.user_id     = request.body.user_id;
    patch.user_name   = request.body.user_name;
    patch.modules     = request.body.modules;
    patch.connections = request.body.connections;

    patch.save( function( error, post ) {

        if ( error ) {
            response.send( error );
        }

        response.json( post );
    });
});

router.route('/remove/:id').delete( function( request, response ) {
    Patch.remove({
    	_id: request.params.id
    }, function( error, post ) {

        if ( error ) {
            response.send( error );
        }

        response.json({ message: 'that patch is gone.' });
    });
});

module.exports = router;