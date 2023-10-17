import { ANIMATION_DURATION, RESIDENCE_TIME } from 'constants/animation';
import { LottieRefCurrentProps } from 'lottie-react';

export enum ArrowDirection {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
}

export enum CheckerboardType {
  ORDINARY = 'ordinary',
  TREASURE = 'treasure',
  IMAGE = 'image',
  EMPTY = 'empty',
}

export interface ICheckerboardItem {
  id: number;
  type: CheckerboardType;
  arrow?: ArrowDirection;
  arrowColor?: string;
  positionImage?: string;
  image?: string;
  width?: number;
  height?: number;
}

export interface ICheckerboardNode {
  row: number;
  column: number;
  info: ICheckerboardItem;
}

export interface IJumpCallbackParams {
  x: number;
  y: number;
  state: boolean;
  currentNode?: CheckerboardNode;
}

export class CheckerboardNode {
  info: ICheckerboardNode;
  next: CheckerboardNode | null;
  constructor(val: ICheckerboardNode) {
    this.info = val;
    this.next = null;
  }
}

export class CheckerboardList {
  head: CheckerboardNode | null;
  private currentNode: CheckerboardNode | null;
  private step: number;
  private baseWidth: number;
  private baseHeight: number;
  private animationDuration: number;

  constructor(props?: { baseWidth?: number; baseHeight?: number; animationDuration?: number }) {
    this.head = null;
    this.currentNode = null;
    this.step = 0;
    this.baseWidth = props?.baseWidth ?? 60;
    this.baseHeight = props?.baseHeight ?? 60;
    this.animationDuration = props?.animationDuration ?? ANIMATION_DURATION;
  }

  private next({
    animation,
    callback,
  }: {
    animation?: LottieRefCurrentProps;
    callback: (props: IJumpCallbackParams) => void;
  }) {
    const current = this.currentNode || this.head;
    const firstNode = this.head;
    if (current?.next && firstNode) {
      const nextNode = current.next;
      const x = (nextNode.info.column - firstNode.info.column) * this.baseWidth;
      const y = (nextNode.info.row - firstNode.info.row) * this.baseHeight;
      this.currentNode = nextNode;
      animation && animation.play();
      this.step -= 1;
      callback({
        x,
        y,
        state: this.step > 0,
        currentNode: this.step > 0 ? undefined : this.currentNode,
      });
      const timer = setTimeout(() => {
        animation && animation.pause();
        clearTimeout(timer);
      }, this.animationDuration);
      const timer2 = setTimeout(() => {
        if (this.step > 0) {
          this.next({
            animation,
            callback,
          });
        }
        clearTimeout(timer2);
      }, this.animationDuration + RESIDENCE_TIME);
    }
  }

  append(value: ICheckerboardNode) {
    const newNode = new CheckerboardNode(value);

    if (!this.head) {
      this.head = newNode;
      newNode.next = this.head;
    } else {
      let current: CheckerboardNode | null = this.head;
      while (current?.next && current.next !== this.head) {
        current = current.next;
      }
      current.next = newNode;
      newNode.next = this.head;
    }
  }

  updateCurrentNode(node: CheckerboardNode | null) {
    this.currentNode = node;
  }

  resize(baseWidth: number, baseHeight: number) {
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
  }

  jump(params: { step: number; animation?: LottieRefCurrentProps; baseWidth?: number; baseHeight?: number }) {
    this.step = params.step;

    return (callback: (props: IJumpCallbackParams) => void) => {
      this.next({
        animation: params.animation,
        callback,
      });
    };
  }
}
