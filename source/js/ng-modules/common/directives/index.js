import angular from 'angular';

//import * as click from './click';
const click = require('./click');
const rclick = require('./rclick');

export default angular.module('common.directives', [])
    .directive(click.name, click.default)
    .directive(rclick.name, rclick.default)