var core = require('../core');

function Layout(){


}

Layout.prototype = Object.create(core.Container.prototype);
Layout.prototype.constructor = Layout;
module.exports = Layout;


Layout.prototype.vbox = function( panel , children , ops){


}


Layout.prototype.hbox = function( panel , children , ops){


}


Layout.prototype.grid = function( panel , children , ops){


}


Layout.prototype.relative = function( panel , children , ops){


}


Layout.TYPE = {
    VBOX:0,
    HBOX:1,
    GRID:2,
    REL:3
};



