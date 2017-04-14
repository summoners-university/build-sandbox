(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($scope) {
    var _this = this;

    _lodash2.default.extend(this, {
        tab: null,

        gameVersion: _globals2.default.version
    });

    $scope.$on('tab.changed', function (e, tab) {
        _this.tab = tab;
    });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _globals = require('services/globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"lodash":"lodash","services/globals":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'sandbox/components/app/template.html',
        controller: _controller2.default,
        bindToController: {},
        controllerAs: 'ctrl'
    };
};

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./controller":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('sandbox.components.app', []).directive('suSandboxApp', _directive2.default);

},{"./directive":2,"angular":"angular"}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('sandbox.components', [require('./tabs').default.name, require('./app').default.name]);

},{"./app":3,"./tabs":7,"angular":"angular"}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = /*@ngInject*/function ($rootScope, $scope, hash) {
    _lodash2.default.extend(this, {
        tab: TABS[hash] || DEFAULT_TAB,

        select: function select(tab) {
            this.tab = tab;
            $rootScope.$broadcast('tab.changed', tab);
            _analytics2.default.trackPageView(TABS_ANALYTICS[tab]);
        }
    });

    $rootScope.$broadcast('tab.changed', this.tab);
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _analytics = require('services/analytics');

var _analytics2 = _interopRequireDefault(_analytics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_TAB = 'champions';
var TABS = {
    'champions': 'champions',
    'runes': 'runes',
    'masteries': 'masteries'
};
var TABS_ANALYTICS = {
    'champions': _analytics.Pages.CHAMPIONS,
    'masteries': _analytics.Pages.MASTERIES,
    'runes': _analytics.Pages.RUNES
};

;

},{"lodash":"lodash","services/analytics":9}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        templateUrl: 'sandbox/components/tabs/template.html',
        controller: _controller2.default,
        bindToController: {},
        controllerAs: 'ctrl'
    };
};

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

},{"./controller":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _directive = require('./directive');

var _directive2 = _interopRequireDefault(_directive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('sandbox.components.tabs', []).directive('suSandboxTabs', _directive2.default);

},{"./directive":6,"angular":"angular"}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _angularRaven = require('angular-raven');

var _angularRaven2 = _interopRequireDefault(_angularRaven);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('sandbox', ['ngRaven', 'sandbox.templates', 'common', 'champions', 'masteries', 'runes', 'stats', require('./components').default.name]).constant('hash', window.location.hash.replace(/#/g, ''));

},{"./components":4,"angular":"angular","angular-raven":"angular-raven"}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Pages = {
  INDEX: '/',
  CHAMPIONS: '/champions',
  RUNES: '/runes',
  MASTERIES: '/masteries'
};

var EventCategories = {
  CHAMPION: 'champion',
  RUNE: 'rune',
  MASTERY: 'mastery'
};
var EventActions = {
  CLICK: 'click',
  SELECTED: 'selected'

};
var EventLabels = {
  ADDED: 'added',
  REMOVED: 'removed'
};

exports.Pages = Pages;
exports.EventCategories = EventCategories;
exports.EventActions = EventActions;
exports.EventLabels = EventLabels;
exports.default = {

  /**
   * Tracks a page view.
   *
   * @param {string} path - The path of the current URL. Prefixed with '/'
   */

  trackPageView: function trackPageView(path) {
    ga('send', {
      hitType: 'pageview',
      page: path
    });
  },

  /**
   * Tracks an event or interaction on the page.
   *
   * @param {string} category - The type of thing interacted with. (eg. Video)
   * @param {string} action - The type of interaction. (eg. play)
   * @param {string} label - Typically a subcategory.
   * @param {number} value - A useful and unique identification of the thing interacted with.
   */
  trackEvent: function trackEvent(_ref) {
    var category = _ref.category;
    var action = _ref.action;
    var label = _ref.label;
    var value = _ref.value;

    ga('send', Object.assign({
      hitType: 'event'
    }, {
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value
    }));
  }
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    version: '7.6.1'
};

exports.default = config;

},{}]},{},[8])

//# sourceMappingURL=sandbox.js.map
