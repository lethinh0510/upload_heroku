/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var keystone = require('keystone');
/**
    Inits the error handler functions into `res`
*/
exports.initErrorHandlers = function(req, res, next) {

    res.err = function(err, title, message) {
			console.log(message);
			res.status(500).render('errors/500', {
					err: err,
					errorTitle: title,
					errorMsg: message,
					layout: 'order'
			});
    }
		//
    res.notfound = function(title, message) {
        res.status(404).render('errors/404', {
        });
    }
    next();
};
