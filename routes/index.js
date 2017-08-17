/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var path = require('path');

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
// keystone.pre('render', middleware.requireUser);

// Handle 404 errors
keystone.set('404', function (req, res, next) {
	res.status(404).render('errors/404', {
		layout: "order"
	});
});

// Handle other errors
keystone.set('500', function (err, req, res, next) {
	var title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	res.err(err, title, message);
});

// Import Route Controllers
var routes = {
	download: importRoutes('./download'),
	api: importRoutes('./api'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Angular
	app.use(require('prerender-node'));
	// Downloads
	// app.get('/download/users', routes.download.users);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	app.use(function (req, res, next) {

		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', '*');

		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		res.setHeader('Access-Control-Allow-Credentials', true);

		// Pass to next layer of middleware
		next();
	});
	
	
	
	// Posts
	app.get('/api/posts', [keystone.middleware.api, keystone.middleware.cors], routes.api.posts.list);
	app.get('/api/posts/slide', [keystone.middleware.api, keystone.middleware.cors], routes.api.posts.listSlide);
	app.get('/api/posts/:slug', [keystone.middleware.api, keystone.middleware.cors], routes.api.posts.get);

	// Categories
	app.get('/api/categories', [keystone.middleware.api, keystone.middleware.cors], routes.api.categories.list);
	app.get('/api/categories/:key', [keystone.middleware.api, keystone.middleware.cors], routes.api.categories.get);

	app.get('/api/categories/:key/products', [keystone.middleware.api, keystone.middleware.cors], routes.api.products.byCategory);

	// Products
	app.get('/api/products', [keystone.middleware.api, keystone.middleware.cors], routes.api.products.list);
	app.get('/api/products/:slug', [keystone.middleware.api, keystone.middleware.cors], routes.api.products.get);
	app.get('/api/products/search/:name', [keystone.middleware.api, keystone.middleware.cors], routes.api.products.search);

	// Tags
	app.get('/api/tags', [keystone.middleware.api, keystone.middleware.cors], routes.api.tags.list);

	// Shippings
	app.get('/api/shippings', [keystone.middleware.api, keystone.middleware.cors], routes.api.shipping.list);

	// Authentication
	app.post('/api/authentication', [keystone.middleware.api, keystone.middleware.cors], routes.api.session_auth.signin);

	// Signout
	app.delete('/api/authentication/signout', [keystone.middleware.api, keystone.middleware.cors], routes.api.session_auth.signout);

	// Add a booking
	app.post('/api/bookings', [keystone.middleware.api, keystone.middleware.cors], routes.api.booking.create);

	// Add a feedback
	app.post('/api/feedback', [keystone.middleware.api, keystone.middleware.cors], routes.api.enquiries.create);

	// Comments for post
	app.get('/api/comments/post/:slug', [keystone.middleware.api, keystone.middleware.cors], routes.api.post_comment.list);
	app.post('/api/comments/post/', [keystone.middleware.api, keystone.middleware.cors], routes.api.post_comment.create);

	// Comments for product
	app.get('/api/comments/product/:slug', [keystone.middleware.api, keystone.middleware.cors], routes.api.product_comment.list);
	app.post('/api/comments/product/', [keystone.middleware.api, keystone.middleware.cors], routes.api.product_comment.create);

	// Account
	app.get('/api/user/current', [keystone.middleware.api, keystone.middleware.cors], routes.api.user.currentUser);
	app.post('/api/user/create', [keystone.middleware.api, keystone.middleware.cors], routes.api.user.create);

	// Contact Us
	app.post('/api/enquiries', [keystone.middleware.api, keystone.middleware.cors], routes.api.enquiries.create);

	// Informations
	app.get('/api/information', [keystone.middleware.api, keystone.middleware.cors], routes.api.information.list);

	app.get('/*', function(req, res){
		res.sendFile(path.join(__dirname, '../public/index.html'));
	});

};
