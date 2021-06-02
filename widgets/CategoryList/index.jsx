import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import Image from '@shopgate/pwa-common/components/Image';
import { SheetList } from '@shopgate/engage/components';
import Headline from 'Components/Headline';
import isEqual from 'lodash/isEqual';
import connect from './connector';

/**
 * Core category list widget.
 * @param {Object} props The widget properties
 * @returns {JSX}
 */
class CategoryListWidget extends Component {
  static propTypes = {
    settings: PropTypes.shape().isRequired,
    getCategory: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.shape()),
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
      <Fragment>
        {(settings.headline) && <Headline text={settings.headline} />}
        <SheetList hasImages={settings.showImages}>
          {items.map((item) => {
            // We have to decode the link before using it.
            const link = `/category/${bin2hex(item.id)}`;

            // Only show an avatar if the setting `showImages` is true.
            const Avatar = settings.showImages && item.imageUrl ? (
              <Image src={item.imageUrl} />
            ) : null;

            return (
              <SheetList.Item
                image={Avatar}
                link={link}
                key={item.id}
                title={item.name}
                testId={item.name}
              />
            );
          })}
        </SheetList>
      </Fragment>
    );
  }
}

export default connect(CategoryListWidget);

export { CategoryListWidget as Unwrapped };
