import Base from './base';
import { IElement, IShape, IGroup, ICanvas, IContainer, ICtor } from '../interfaces';
import { ShapeCfg, CanvasCfg, Point } from '../types';
import ContainerUtil from '../util/container';
import { isBrowser, isString, isObject } from '../util/util';
const PX_SUFFIX = 'px';

abstract class Canvas extends Base implements ICanvas {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    cfg['children'] = [];
    cfg['visible'] = true;
    cfg['capture'] = true;
    return cfg;
  }

  constructor(cfg: CanvasCfg) {
    super(cfg);
    this.initContainer();
    this.initDom();
    this.initEvents();
  }

  /**
   * @protected
   * 初始化容器
   */
  initContainer() {
    let container = this.get('container');
    if (isString(container)) {
      container = document.getElementById(container);
      this.set('container', container);
    }
  }

  /**
   * @protected
   * 初始化 DOM
   */
  initDom() {
    const el = this.createDom();
    this.set('el', el);
    // 附加到容器
    const container = this.get('container');
    container.appendChild(el);
    // 设置初始宽度
    this.setDOMSize(this.get('width'), this.get('height'));
  }

  /**
   * 创建画布容器
   * @return {HTMLElement} 画布容器
   */
  abstract createDom(): HTMLElement | SVGSVGElement;

  /**
   * @protected
   * 初始化绑定的事件
   */
  initEvents() {}

  /**
   * @protected
   * 修改画布对应的 DOM 的大小
   * @param {number} width  宽度
   * @param {number} height 高度
   */
  setDOMSize(width: number, height: number) {
    const el = this.get('el');
    if (isBrowser) {
      el.style.width = width + PX_SUFFIX;
      el.style.height = height + PX_SUFFIX;
    }
  }

  // 实现接口
  changeSize(width: number, height: number) {
    this.setDOMSize(width, height);
    this.set('width', width);
    this.set('height', height);
  }

  // 实现接口
  getPointByClient(clientX: number, clientY: number): Point {
    const el = this.get('el');
    const bbox = el.getBoundingClientRect();
    return {
      x: clientX - bbox.left,
      y: clientY - bbox.top,
    };
  }

  // 实现接口
  getClientByPoint(x: number, y: number): Point {
    const el = this.get('el');
    const bbox = el.getBoundingClientRect();
    return {
      x: x + bbox.left,
      y: y + bbox.top,
    };
  }

  // 实现接口
  draw() {}

  /**
   * @protected
   * 销毁 DOM 容器
   */
  removeDom() {
    const el = this.get('el');
    el.parentNode.removeChild(el);
  }

  /**
   * @protected
   * 清理所有的事件
   */
  clearEvents() {}

  isCanvas() {
    return true;
  }

  getParent() {
    return null;
  }

  // 继承自 IContainer 的方法，由于 ts 的 mixin 非常复杂，而且很难控制好局部解耦
  // 所以 canvas 和 group 中的代码重复
  // 但是具体实现都已经提取到 util/container 中
  abstract getShapeBase(): ICtor<IShape>;
  abstract getGroupBase(): ICtor<IGroup>;

  // 兼容老版本的接口
  addShape(...args): IShape {
    const type = args[0];
    let cfg = args[1];
    if (isObject(type)) {
      cfg = type;
    } else {
      cfg['type'] = type;
    }
    return ContainerUtil.addShape(this, cfg);
  }

  addGroup(...args): IGroup {
    const [groupClass, cfg] = args;
    return ContainerUtil.addGroup(this, groupClass, cfg);
  }

  getShape(x: number, y: number): IShape {
    return ContainerUtil.getShape(this, x, y);
  }

  add(element: IElement) {
    ContainerUtil.add(this, element);
  }

  getChildren(): IElement[] {
    return this.get('children');
  }

  sort() {
    ContainerUtil.sort(this);
  }

  clear() {
    ContainerUtil.clear(this);
  }

  destroy() {
    if (this.get('destroyed')) {
      return;
    }
    this.clear();
    // 同初始化时相反顺序调用
    this.clearEvents();
    this.removeDom();
    super.destroy();
  }
}

export default Canvas;
