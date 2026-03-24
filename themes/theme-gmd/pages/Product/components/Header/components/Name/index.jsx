import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core/helpers';
import { SurroundPortals, PlaceholderLabel } from '@shopgate/engage/components';
import { PRODUCT_NAME } from '@shopgate/engage/product/constants';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  name: {
    fontWeight: 'bold',
    fontSize: '1.25rem',
    lineHeight: '1.25',
    marginBottom: 2,
    marginRight: 72,
    wordBreak: 'break-word',
    hyphens: 'auto',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      wordBreak: 'keep-all',
      hyphens: 'none',
    },
  },
  placeholder: {
    width: '70%',
    height: 24,
    marginTop: 5,
  },
});

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Content = ({ name, longName }) => {
  const { classes } = useStyles();

  return (
    // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
    <div className={`${classes.name} product-name`} role="heading">
      { isBeta()
        ? (
          <PlaceholderLabel className={classes.placeholder} ready={(longName !== null)}>
            <span
              data-test-id={`name: ${longName}`}
              dangerouslySetInnerHTML={{ __html: longName }}
            />
          </PlaceholderLabel>
        )
        : (
          <PlaceholderLabel className={classes.placeholder} ready={(name !== null)}>
            <span
              data-test-id={`name: ${name}`}
              dangerouslySetInnerHTML={{ __html: name }}
            />
          </PlaceholderLabel>
        )}
    </div>
  );
};

Content.propTypes = {
  longName: PropTypes.string,
  name: PropTypes.string,
};

Content.defaultProps = {
  longName: null,
  name: null,
};

/**
 * The Product Name component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Name = props => (
  <SurroundPortals portalName={PRODUCT_NAME} portalProps={props}>
    <Content {...props} />
  </SurroundPortals>
);

Name.propTypes = {
  longName: PropTypes.string,
  name: PropTypes.string,
};

Name.defaultProps = {
  longName: null,
  name: null,
};

export default connect(memo(Name));
