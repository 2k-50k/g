const pkg = require('../package.json');

export const version = pkg.version;
export { Event } from '@antv/g-base';
export { default as Canvas } from './canvas';
export { default as Group } from './group';
export { default as Shape } from './shape';
