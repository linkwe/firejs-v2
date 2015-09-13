// require('./polyfill');

// global.Q = module.exports = require('./application');




require('./polyfill');
var core = module.exports = require('./core');

core.app = require('./application');

core.extras         = require('./extras');
core.filters        = require('./filters');
// core.interaction    = require('./interaction');
core.loaders        = require('./loaders');
core.mesh           = require('./mesh');
core.loader = new core.loaders.Loader();


global.Q = global.PIXI = core;//Object.assign(core,app);


