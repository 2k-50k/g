/**
 * @fileoverview arrow
 * @author dengfuping_develop@163.com
 */

import { isArray, uniqueId } from '@antv/util';

class Arrow {
  id: string;
  el: SVGMarkerElement;
  child: SVGPathElement | any; // TODO G.Shape, not any
  stroke: string;
  cfg: {
    [key: string]: any;
  } = {};

  constructor(attrs, type) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    const id = uniqueId('marker_');
    el.setAttribute('id', id);
    const shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shape.setAttribute('stroke', 'none');
    shape.setAttribute('fill', attrs.stroke || '#000');
    el.appendChild(shape);
    el.setAttribute('overflow', 'visible');
    el.setAttribute('orient', 'auto-start-reverse');
    this.el = el;
    this.child = shape;
    this.id = id;
    const cfg = attrs[type === 'marker-start' ? 'startArrow' : 'endArrow'];
    this.stroke = attrs.stroke || '#000';
    if (cfg === true) {
      this._setDefaultPath(type, shape);
    } else {
      this.cfg = cfg; // when arrow config exists
      this._setMarker(attrs.lineWidth, shape);
    }
    return this;
  }

  match() {
    return false;
  }

  _setDefaultPath(type, el) {
    const parent = this.el;
    el.setAttribute('d', 'M0,0 L6,3 L0,6 L3,3Z');
    parent.setAttribute('refX', `${3}`);
    parent.setAttribute('refY', `${3}`);
  }

  _setMarker(r, el) {
    const parent = this.el;
    let path = this.cfg.path;
    const d = this.cfg.d;

    if (isArray(path)) {
      path = path
        .map((segment) => {
          return segment.join(' ');
        })
        .join('');
    }
    el.setAttribute('d', path);
    parent.appendChild(el);
    if (d) {
      parent.setAttribute('refX', `${d / r}`);
    }
  }

  update(fill) {
    const child = this.child;
    if (child.attr) {
      child.attr('fill', fill);
    } else {
      child.setAttribute('fill', fill);
    }
  }
}

export default Arrow;
