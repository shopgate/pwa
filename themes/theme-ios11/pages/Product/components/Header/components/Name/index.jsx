import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { isBeta } from '@shopgate/engage/core/helpers';
import {
  SurroundPortals,
  PlaceholderLabel,
  Typography,
} from '@shopgate/engage/components';
import { PRODUCT_NAME } from '@shopgate/engage/product/constants';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  name: {
    fontWeight: theme.typography.fontWeightBold,
    marginBottom: 2,
    marginRight: 72,
    wordBreak: 'break-word',
    hyphens: 'auto',
  },
  placeholder: {
    width: '70%',
    height: 24,
    marginTop: 5,
  },
}));

/**
 * The Product Name component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Content = ({ longName, name }) => {
  const { classes, cx } = useStyles();

  return (

    <Typography variant="h3" component="div" className={cx(classes.name, 'product-name')} role="heading">
      {/* This feature is currently in BETA testing.
        It should only be used for approved BETA Client Projects */}
      { isBeta()
        ? (
          <PlaceholderLabel className={classes.placeholder} ready={(longName !== null)}>
            <span
              data-test-id={`name: ${longName}`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: longName }}
            />
          </PlaceholderLabel>
        )
        : (
          <PlaceholderLabel className={classes.placeholder} ready={(name !== null)}>
            <span
              data-test-id={`name: ${name}`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: name }}
            />
          </PlaceholderLabel>
        )}
    </Typography>

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
