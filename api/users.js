var express = require('express');        // call express
var User    = require('../models/users');
var router  = express.Router();

router.route('/get/:id').get( function(request, response ) {
    User.findById( request.params.id, function( error, patch ) {

        if ( error ) {
            response.send( error );
        }

        response.json( patch );
    });
});

router.route('/add').post( function( request, response ) {

    var user = new User();

    user.user_name = request.body.user_name;
    user.email = request.body.email;
    user.password = request.body.password;
    user.member_since = new Date

    user.save( function( error, post ) {

        if ( error ) {
            response.send( error );
        }

        response.json( post );
    });
});

router.route('/remove/:id').delete( function( request, response ) {
    User.remove({
    	_id: request.params.id
    }, function( error, post ) {

        if ( error ) {
            response.send( error );
        }

        response.json({ message: 'that patch is gone.' });
    });
});

module.exports = router;