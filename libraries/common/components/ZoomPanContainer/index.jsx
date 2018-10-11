import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';
import clamp from 'lodash/clamp';
import style from './style';

/**
 * Creates a translate3d style string.
 * @param {number} posX The x position.
 * @param {number} posY The y position.
 * @return {string}
 */
const getTranslateStyle = (posX, posY) => `translate3d(${posX}px,${posY}px, 0)`;

/**
 * Creates a scale3d style string.
 * @param {number} scale The scale factor.
 * @return {string}
 */
const getScaleStyle = scale => `scale3d(${scale},${scale},1)`;

/**
 * Creates a transform style string.
 * @param {number} smoothness The current smoothness in ms.
 * @return {string}
 */
const getTransitionStyle = smoothness => `transform ${smoothness}ms ease-out`;

/**
 * Creates a transform origin style string.
 * @param {number} relativeX The relative x position.
 * @param {number} relativeY The relative y position.
 * @return {string}
 */
const getTransformOriginStyle = (relativeX, relativeY) => `${Math.ceil(relativeX * 100)}% ${Math.ceil(relativeY * 100)}%`;

const MODE_PAN = 1;
const MODE_PINCH = 2;

/**
 * A container component that supports panning and zooming of children.
 */
class ZoomPanContainer extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired, // The components children.
    maxZoom: PropTypes.number, // The maximum zoom factor.
    minZoom: PropTypes.number, // The minimum zoom factor.
    onZoom: PropTypes.func, // A callback triggered when the zoom has changed.
    smoothness: PropTypes.number, // The transition time between the zoom/pan changes.
    zoomBounce: PropTypes.number, // The bounciness of the zoom.
    zoomOnTap: PropTypes.number, // The zoom factor to add when double tapped.
  };

  static defaultProps = {
    maxZoom: 4,
    minZoom: 1,
    onZoom: () => {},
    smoothness: 500,
    zoomBounce: 0.3,
    zoomOnTap: 2,
  };

  /**
   * Creates a new zoom pan container container.
   * @param {Object} props The container props.
   */
  constructor(props) {
    super(props);

    this.transformRef = null;
    this.contentRef = null;
    this.lastScale = Math.max(this.props.minZoom, 1);
    this.scale = this.lastScale;
    this.posX = 0;
    this.posY = 0;
    this.lastPosX = 0;
    this.lastPosY = 0;
    this.maxPosX = 0;
    this.maxPosY = 0;
    this.isTransforming = false;
    this.centerX = 0.5;
    this.centerY = 0.5;
    this.cachedTransformWidth = null;
    this.cachedTransformHeight = null;
    this.cachedContentWidth = null;
    this.cachedContentHeight = null;
    this.currentMode = null;
  }

  /**
   * @return {number} The cached width of the transform wrapper.
   */
  get transformWidth() {
    if (!this.cachedTransformWidth) {
      this.cachedTransformWidth = this.transformRef.clientWidth;
    }
    return this.cachedTransformWidth;
  }

  /**
   * @return {number} The cached height of the transform wrapper.
   */
  get transformHeight() {
    if (!this.cachedTransformHeight) {
      this.cachedTransformHeight = this.transformRef.clientHeight;
    }
    return this.cachedTransformHeight;
  }

  /**
   * @return {number} The cached width of the content wrapper.
   */
  get contentWidth() {
    if (!this.cachedContentWidth) {
      this.cachedContentWidth = this.contentRef.clientWidth;
    }
    return this.cachedContentWidth;
  }

  /**
   * @return {number} The cached height of the content wrapper.
   */
  get contentHeight() {
    if (!this.cachedContentHeight) {
      this.cachedContentHeight = this.contentRef.clientHeight;
    }
    return this.cachedContentHeight;
  }

  /**
   * Sets the transform wrapper.
   * @param {DOMElement} ref The dom reference to the transform wrapper element.
   */
  setTransformElement = (ref) => {
    this.transformRef = ref;
  };

  /**
   * Sets the content wrapper.
   * @param {DOMElement} ref The dom reference to the content wrapper element.
   */
  setContentElement = (ref) => {
    this.contentRef = ref;
  };

  /**
   * Handles the pinch start events.
   */
  handlePinchStart = () => {
    if (this.currentMode) {
      return;
    }

    this.currentMode = MODE_PINCH;
  };

  /**
   * Handles the pinch events.
   * @param {Object} event The event object.
   */
  handlePinch = (event) => {
    if (this.currentMode !== MODE_PINCH) {
      return;
    }

    const minZoom = this.props.minZoom - (this.props.minZoom * this.props.zoomBounce);
    const maxZoom = this.props.maxZoom + (this.props.maxZoom * this.props.zoomBounce);

    this.scale = Math.max(minZoom, Math.min(this.lastScale * (event.scale), maxZoom));

    this.posX = this.lastPosX + (event.deltaX);
    this.posY = this.lastPosY + (event.deltaY);

    this.isTransforming = true;

    if (this.scale !== this.props.minZoom) {
      this.updateTransform();
      this.props.onZoom(this.scale);
    }
  };

  /**
   * Handles the pinch end events.
   */
  handlePinchEnd = () => {
    if (this.currentMode !== MODE_PINCH) {
      return;
    }

    this.currentMode = null;

    this.scale = Math.max(
      this.props.minZoom,
      Math.min(this.scale, this.props.maxZoom)
    );
    this.lastScale = this.scale;

    this.isTransforming = false;

    this.updateLimits();

    this.lastPosX = this.posX;
    this.lastPosY = this.posY;

    this.updateTransform();
    this.props.onZoom(this.scale);
  };

  /**
   * Handles the pan start events.
   */
  handlePanStart = () => {
    if (this.currentMode) {
      return;
    }

    this.currentMode = MODE_PAN;
  };

  /**
   * Handles the pan events.
   * @param {Object} event The event object.
   */
  handlePan = (event) => {
    if (this.currentMode !== MODE_PAN) {
      return;
    }

    this.isTransforming = true;

    if (this.scale !== this.props.minZoom) {
      this.posX = this.lastPosX + (event.deltaX);
      this.posY = this.lastPosY + (event.deltaY);

      this.updateTransform();
    }
  };

  /**
   * Handles the pan end events.
   * @param {Object} event The event object.
   */
  handlePanEnd = (event) => {
    if (this.currentMode !== MODE_PAN) {
      return;
    }

    this.currentMode = null;

    this.isTransforming = false;

    this.lastPosX = this.posX + ((event.velocityX) * this.props.smoothness);
    this.lastPosY = this.posY + ((event.velocityY) * this.props.smoothness);

    this.updateLimits();

    this.lastPosX = clamp(this.lastPosX, -this.maxPosX, this.maxPosX);
    this.lastPosY = clamp(this.lastPosY, -this.maxPosY, this.maxPosY);

    this.posX = this.lastPosX;
    this.posY = this.lastPosY;

    this.updateTransform();
  };

  /**
   * Handles the double tap events.
   * @param {Object} event The event object.
   */
  handleDoubleTap = (event) => {
    // Remember the touched position before scaling.
    this.posX = -(event.center.x - (this.transformWidth * 0.5));
    this.posY = -(event.center.y - (this.transformHeight * 0.5));

    if (this.scale === this.props.minZoom) {
      // Zoom in.
      this.scale = Math.min(
        this.scale + this.props.zoomOnTap,
        this.props.maxZoom
      );
    } else {
      // Already zoomed in, revert to original zoom factor.
      this.scale = this.props.minZoom;
    }

    this.posX *= this.scale;
    this.posY *= this.scale;

    this.lastScale = this.scale;
    this.isTransforming = false;

    this.updateLimits();

    this.lastPosX = this.posX;
    this.lastPosY = this.posY;

    this.updateTransform();
    this.props.onZoom(this.scale);
  };

  /**
   * Updates the transform of the inner elements.
   */
  updateTransform = () => {
    /**
     * Apply the style transforms to both containers.
     */
    this.transformRef.style.transform = `${getTranslateStyle(this.posX, this.posY)} ${getScaleStyle(this.scale)}`;

    this.transformRef.style.transition = getTransitionStyle((
      this.isTransforming ? 0 : this.props.smoothness
    ));

    this.transformRef.style.transformOrigin = getTransformOriginStyle(this.centerX, this.centerY);
  };

  /**
   * Updates the limits based on the current scale.
   */
  updateLimits = () => {
    /**
     * We assume the center of the content to be the origin of our transformation,
     * so the maximum panning is half the content width multiplied with the current scale.
     */
    const wrapperWidth = this.transformWidth * 0.5;
    const wrapperHeight = this.transformHeight * 0.5;

    const contentWidth = (this.contentWidth * 0.5) * this.scale;
    const contentHeight = (this.contentHeight * 0.5) * this.scale;

    if (wrapperWidth < contentWidth) {
      this.maxPosX = contentWidth - wrapperWidth;
    } else {
      this.maxPosX = 0;
    }

    if (wrapperHeight < contentHeight) {
      this.maxPosY = contentHeight - wrapperHeight;
    } else {
      this.maxPosY = 0;
    }

    /**
     * Clamp the current position.
     */
    this.posX = clamp(this.posX, -this.maxPosX, this.maxPosX);
    this.posY = clamp(this.posY, -this.maxPosY, this.maxPosY);
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    return (
      <div className={style.container}>
        <Hammer
          onPinchStart={this.handlePinchStart}
          onPinch={this.handlePinch}
          onPinchEnd={this.handlePinchEnd}
          onPanStart={this.handlePanStart}
          onPan={this.handlePan}
          onPanEnd={this.handlePanEnd}
          onDoubleTap={this.handleDoubleTap}
          direction="DIRECTION_ALL"
          options={{
            recognizers: {
              pinch: { enable: true },
            },
          }}
        >
          { /* This element is required to allow ref binding of the react hammer component. */ }
          <div>
            <div
              ref={this.setTransformElement}
              className={style.zoomPanWrapper}
            >
              <div
                ref={this.setContentElement}
                className={style.contentWrapper}
              >
                {this.props.children}
              </div>
            </div>
          </div>
        </Hammer>
      </div>
    );
  }
}

export default ZoomPanContainer;
