import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { SurroundPortals } from '@shopgate/engage/components';
import { PRODUCT_REVIEWS_ENTRY } from '@shopgate/engage/product';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Title from './components/Title';
import Rating from './components/Rating';
import Text from './components/Text';
import Info from './components/Info';

const { colors } = themeConfig;

const useStyles = makeStyles()(theme => ({
  item: {
    marginLeft: theme.spacing(2),
    padding: theme.spacing(2, 2, 2, 0),
    borderTop: `1px solid ${colors.shade7}`,
  },
}));

/**
 * Review List Component.
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const List = ({ reviews }) => {
  const { classes } = useStyles();

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <ul className="engage__reviews__list">
      {reviews.map(review => (
        <li key={review.id} className={classes.item} data-test-id={`reviewTitle: ${review.title}`}>
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
};

List.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape()),
};

List.defaultProps = {
  reviews: null,
};

export default memo(List);
