var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Patch      = require('../models/patch');
var router     = express.Router();

mongoose.connect('mongodb://synthcomp:Monsyn69@ds047732.mongolab.com:47732/heroku_9gr6r0r9'); // connect to our database

// bodyParser gets the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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