var keystone = require('keystone');
var Types = keystone.Field.Types;

var Cart = new keystone.List('Cart', {
	map: {name: 'publishedDate'},
	autokey: {path: 'slug', from: 'publishedDate'},
	nocreate: true,
	noedit: true,
});

Cart.add({
	publishedDate: {type: Date, default: Date.now},
	product: {type: Types.Relationship, ref: 'ProductItem', many: false},
	orderQuanlity: {type: Types.Number},
	price: {type: Types.Number}
});

Cart.register();
