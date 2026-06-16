import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '../../../core';
import { RadioGroupItem } from '../../../components';

const useStyles = makeStyles()(theme => ({
  radioItem: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 0),
    boxShadow: `0 1px 0 ${theme.components.border.light}`,
  },
  itemLabel: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 0,
  },
  radioGroupLabel: {
    flex: 1,
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

/**
 * Renders a RadioItem element to be used by the FulfillmentPathSelector component.
 * This component is meant to be rendered as a child of a RadioGroup.
 * @param {Object} props The component props required by the RadioGroupItem component.
 * @param {React.ReactNode|null} [props.children=null] The child elements.
 * @param {string} props.name The name of the radio item.
 * @returns {JSX.Element} The rendered component.
 */
export const FulfillmentPathItem = ({ name, children, ...rest }) => {
  const { classes, cx } = useStyles();

  return (
    <RadioGroupItem
      {...rest}
      name={name}
      className={classes.radioItem}
      label={(
        <div className={cx(classes.radioGroupLabel, classes.itemLabel)}>
          <Typography variant="body1" component="span">
            {i18n.text(name)}
          </Typography>
          {children}
        </div>
      )}
    />
  );
};

FulfillmentPathItem.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
};

FulfillmentPathItem.defaultProps = {
  children: null,
};
