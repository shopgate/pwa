/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProductGrid from 'Components/ProductGrid';
import ProductList from 'Components/ProductList';
import { GRID_VIEW, LIST_VIEW } from '../../constants';
import connect from './connector';

/**
 * The Products component
 * This components optimizes the switching between grid and list view by rendering both
 * all the time and then only switching the inline style directly in the real DOM.
 */
class Products extends Component {
  static propTypes = {
    viewMode: PropTypes.string.isRequired,
    getProducts: PropTypes.func,
    products: PropTypes.arrayOf(PropTypes.shape()),
    totalProductCount: PropTypes.number,
  };

  static defaultProps = {
    getProducts: () => {},
    products: null,
    totalProductCount: null,
  };

  /**
   * Initializes the Products component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);

    this.gridContainer = null;
    this.listContainer = null;

    /**
     * Variable to make sure that only one of the two ProductXxx Components
     * is rendered in the first place.
     */
    this.initialRender = true;
  }

  /**
   * Once the component did mount and it renders for the first time
   * we have to set initialRender to false. So that the second ProductXxx components gets
   * rendered the next time.
   */
  componentDidMount() {
    this.initialRender = false;
  }

  /**
   * When the view mode changes apply the updated inline styles directly.
   * @param {Object} nextProps The components new props.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.viewMode !== nextProps.viewMode) {
      this.applyInlineStyle(nextProps);
    }
  }

  /**
   * The component should not update when the viewmode is changed.
   * A different view mode will only cause a different inline style.
   * It is not necessary to re-render the whole tree again.
   * @param {Object} nextProps The components new props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (nextProps.viewMode === this.props.viewMode);
  }

  /**
   * Generates the inline style string for the containers
   * @param {Object} props The component props.
   * @returns {Object}
   */
  getStyles = (props) => {
    let gridStyles;
    let listStyles;

    if (props.viewMode === GRID_VIEW) {
      listStyles = { display: 'none' };
      gridStyles = { display: 'block' };
    } else {
      listStyles = { display: 'block' };
      gridStyles = { display: 'none' };
    }

    return {
      gridStyles,
      listStyles,
    };
  };

  /**
   * Applies the styling directly to the DOM element without using react.
   * @param {Object} props The component props.
   */
  applyInlineStyle = (props) => {
    const { gridStyles, listStyles } = this.getStyles(props);

    if (this.gridContainer) {
      Object.keys(gridStyles).forEach((key) => {
        this.gridContainer.style[key] = gridStyles[key];
      });
    }

    if (this.listContainer) {
      Object.keys(listStyles).forEach((key) => {
        this.listContainer.style[key] = listStyles[key];
      });
    }
  };

  /**
   * Updates the dom element reference of the grid container.
   * @param {HTMLElement} element Reference to the HTML element.
   */
  updateGridReference = (element) => {
    this.gridContainer = element;
    this.applyInlineStyle(this.props);
  };

  /**
   * Updates the dom element reference of the list container.
   * @param {HTMLElement} element Reference to the HTML element.
   */
  updateListReference = (element) => {
    this.listContainer = element;
    this.applyInlineStyle(this.props);
  };

  /**
   * Renders the Products component.
   * @returns {JSX}
   */
  render() {
    if (!this.props.products) {
      return null;
    }

    return (
      <div>
        {(!this.initialRender || this.props.viewMode === GRID_VIEW) &&
          <div ref={this.updateGridReference}>
            <ProductGrid
              handleGetProducts={this.props.getProducts}
              products={this.props.products}
              totalProductCount={this.props.totalProductCount}
            />
          </div>}
        {(!this.initialRender || this.props.viewMode === LIST_VIEW) &&
          <div ref={this.updateListReference}>
            <ProductList
              handleGetProducts={this.props.getProducts}
              products={this.props.products}
              totalProductCount={this.props.totalProductCount}
            />
          </div>}
      </div>
    );
  }
}

export default connect(Products);
