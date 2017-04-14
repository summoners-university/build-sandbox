(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($parse) {
    return function (scope, element, attr) {
        element.click(function ($event) {
            $event.preventDefault();
            var fn = $parse(attr['ngeClick']);

            scope.$apply(function () {
                fn(scope, { $event: $event });
            });

            return false;
        });
    };
};

var name = exports.name = 'suClick';

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import * as click from './click';
var click = require('./click');
var rclick = require('./rclick');

exports.default = _angular2.default.module('common.directives', []).directive(click.name, click.default).directive(rclick.name, rclick.default);

},{"./click":1,"./rclick":3,"angular":"angular"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($parse) {
    return function (scope, element, attr) {
        element.bind('contextmenu', function ($event) {
            $event.preventDefault();
            var fn = $parse(attr[name]);

            scope.$apply(function () {
                fn(scope, { $event: $event });
            });

            return false;
        });
    };
};

var name = exports.name = 'suRclick';

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function () {
    return function (input, places) {
        if (isNaN(input)) return input;
        var factor = '1' + Array(+(places > 0 && places + 1)).join('0');
        return Math.round(input * factor) / factor;
    };
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('common.filters', []).filter('decimal', require('./decimal').default).filter('sanitize', require('./sanitize').default).filter('range', require('./range').default);

},{"./decimal":4,"./range":6,"./sanitize":7,"angular":"angular"}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function () {
    return function (length) {
        return Array.apply(null, { length: length }).map(Number.call, Number);
    };
};

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /* @ngInject */function ($sce) {
    return function (value, type) {
        return $sce.trustAs(type || 'html', value);
    };
};

;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _angularSanitize = require('angular-sanitize');

var _angularSanitize2 = _interopRequireDefault(_angularSanitize);

var _angularRaven = require('angular-raven');

var _angularRaven2 = _interopRequireDefault(_angularRaven);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('common', ['ngRaven',
//'common.templates',
'ngSanitize', require('./filters').default.name, require('./directives').default.name]);

},{"./directives":2,"./filters":5,"angular":"angular","angular-raven":"angular-raven","angular-sanitize":"angular-sanitize"}]},{},[8])

//# sourceMappingURL=common.js.map
