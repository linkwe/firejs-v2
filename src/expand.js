require('./polyfill');

var core = require('./core');
core.extras         = require('./extras');
core.filters        = require('./filters');
core.loaders        = require('./loaders');
core.mesh           = require('./mesh');
core.loader = new core.loaders.Loader();

module.exports = qset.call( q , { cover:core } );

