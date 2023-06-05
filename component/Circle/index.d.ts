import React from 'react';
import { TextStyle, ViewProperties } from 'react-native';
interface DefaultPropTypes extends ViewProperties {
  /**
   * Whether or not to animate changes to progress.
   *
   * @type {boolean}
   * @memberof DefaultPropTypes
   * @default true
   */
  animated?: boolean;

  /**
   * If set to true, the indicator will spin and progress prop will be ignored.
   *
   * @type {boolean}
   * @memberof DefaultPropTypes
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Sets animation duration in milliseconds when indeterminate is set.
   *
   * @type {number}
   * @memberof BarPropTypes
   * @default 1000
   */
  indeterminateAnimationDuration?: number;

  /**
   * Progress of whatever the indicator is indicating. A number between `0` and `1`
   *
   * @type {(0 | 1)}
   * @memberof DefaultPropTypes
   * @default 0
   */
  progress?: number;

  /**
   * Fill color of the indicator.
   *
   * @type {string}
   * @memberof DefaultPropTypes
   * @default rgba(0, 122, 255, 1)
   */
  color?: string;

  /**
   * Color of the remaining progress.
   *
   * @type {string}
   * @memberof DefaultPropTypes
   * @default None
   */
  unfilledColor?: string;

  /**
   * Width of outer border, set to `0` to remove.
   *
   * @type {number}
   * @memberof DefaultPropTypes
   * @default 1
   */
  borderWidth?: number;

  /**
   * Color of outer border.
   *
   * @type {string}
   * @memberof DefaultPropTypes
   * @default color
   */
  borderColor?: string;
}
interface CirclePropTypes extends DefaultPropTypes {
  /**
   * Diameter of the circle.
   *
   * @type {number}
   * @memberof CirclePropTypes
   * @default 40
   */
  size?: number;

  /**
   * Thickness of the inner circle.
   *
   * @type {number}
   * @memberof CirclePropTypes
   * @default 3
   */
  thickness?: number;

  /**
   * Whether or not to show a text representation of current progress.
   *
   * @type {boolean}
   * @memberof CirclePropTypes
   * @default false
   */
  showsText?: boolean;

  /**
   * A function returning a string to be displayed for the textual representation.
   *
   * @memberof CirclePropTypes
   * @default See source
   */
  formatText?: (progress: number) => void;

  /**
   * Styles for progress text, defaults to a same `color` as circle and `fontSize` proportional to `size` prop.
   *
   * @type {TextStyle}
   * @memberof CirclePropTypes
   * @default None
   */
  textStyle?: TextStyle;

  /**
   * Whether or not to respect device font scale setting.
   *
   * @type {boolean}
   * @memberof CirclePropTypes
   * @default true
   */
  allowFontScaling?: boolean;

  /**
   * Direction of the circle `clockwise` or `counter-clockwise`.
   *
   * @type {('clockwise' | 'counter-clockwise')}
   * @memberof CirclePropTypes
   * @default clockwise
   */
  direction?: 'clockwise' | 'counter-clockwise';

  /**
   * Stroke Cap style for the circle `butt`, `square` or `round`.
   *
   * @type {('butt' | 'square' | 'round')}
   * @memberof CirclePropTypes
   * @default butt
   */
  strokeCap?: 'butt' | 'square' | 'round';

  /**
   * Fill color of the inner circle.
   *
   * @type {string}
   * @memberof CirclePropTypes
   * @default None
   */
  fill?: string;

  /**
   * Determines the endAngle of the circle.
   *
   * @type {number}
   * @memberof CirclePropTypes
   * @default 0.9
   */
  endAngle?: number;
}
export default class Circle extends React.Component<CirclePropTypes> { }