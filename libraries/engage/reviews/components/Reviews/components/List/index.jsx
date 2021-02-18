import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { PRODUCT_REVIEWS_ENTRY } from '@shopgate/engage/product';
import Title from './components/Title';
import Rating from './components/Rating';
import Text from './components/Text';
import Info from './components/Info';
import styles from './style';

/**
 * Review List Component.
 */
class List extends PureComponent {
  static propTypes = {
    reviews: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    reviews: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { reviews } = this.props;

    if (!reviews || reviews.length === 0) {
      return null;
    }

    return (
      <ul>
        { reviews.map(review => (
          <li key={review.id} className={styles} data-test-id={`reviewTitle: ${review.title}`}>
            <SurroundPortals portalName={PRODUCT_REVIEWS_ENTRY} portalProps={{ review }}>
              <Title title={review.title} />
              <Rating rate={review.rate} />
              <Text review={review.review} />
              <Info review={review} />
            </SurroundPortals>
          </li>
        ))}
      </ul>
    );
  }
}

export default List;
