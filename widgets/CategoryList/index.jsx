/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Image from '@shopgate/pwa-common/components/Image';
import List from 'Components/List';
import isEqual from 'lodash/isEqual';
import connect from './connector';
import styles from './style';

/**
 * Core category list widget.
 * @param {Object} props The widget properties
 * @returns {JSX}
 */
class CategoryListWidget extends Component {
  static propTypes = {
    settings: PropTypes.shape().isRequired,
    getCategory: PropTypes.func,
    items: PropTypes.arrayOf(
      PropTypes.shape()
    ),
  };

  static defaultProps = {
    getCategory: () => {},
    items: null,
  };

  /**
   * Get the category data once the component has mounted.
   */
  componentDidMount() {
    if (!this.props.items) {
      this.props.getCategory(this.props.settings.categoryNumber);
    }
  }

  /**
   * Only update when we have category items.
   * @param {Object} nextProps The next set of component props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (nextProps.items && !isEqual(this.props.items, nextProps.items));
  }

  /**
   * The render function.
   * @returns {JSX}
   */
  render() {
    const { items, settings } = this.props;

    if (!items) {
      return null;
    }

    return (
      <div className={styles.container}>
        {(settings.headline) ? <h3 className={styles.headline}>{settings.headline}</h3> : null}
        <List>
          {items.map((item) => {
            // We have to decode the link before using it.
            const link = `/category/${bin2hex(item.id)}`;

            // Only show an avatar if the setting `showImages` is true.
            const Avatar = (settings.showImages) ? <Image src={item.imageUrl} /> : null;

            return (
              <List.Item
                image={Avatar}
                link={link}
                key={item.id}
                title={item.name}
              />
            );
          })}
        </List>
      </div>
    );
  }
}

export default connect(CategoryListWidget);

export { CategoryListWidget as Unwrapped };
