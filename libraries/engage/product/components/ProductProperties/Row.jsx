import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { variables: { gap } = {} } = themeConfig;

const useStyles = makeStyles()({
  tableCell: {
    maxWidth: 100,
    padding: `${gap.xsmall * 0.5}px ${gap.small}px`,
    overflowWrap: 'break-word',
    ':first-of-type': {
      paddingLeft: 0,
    },
    ':last-of-type': {
      paddingRight: 0,
    },
  },
});

/**
 * Renders a single properties row.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const Row = ({ label, value, type }) => {
  const { classes } = useStyles();

  return (
    <tr
      className="engage__product__product-property"
      data-type={type}
      data-label={label}
      aria-label={`${typeof label === 'string' ? label : ''}: ${typeof value === 'string' ? value : ''}`}
      tabIndex={0}
    >
      <td className={classes.tableCell} aria-hidden>
        { /* eslint-disable-next-line react/no-danger */}
        <span dangerouslySetInnerHTML={{ __html: label }} />
      </td>
      <td className={classes.tableCell} data-test-id={`property: ${value}`} aria-hidden>
        { /* eslint-disable-next-line react/no-danger */}
        <span dangerouslySetInnerHTML={{ __html: value }} />
      </td>
    </tr>
  );
};

Row.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
};

Row.defaultProps = {
  type: null,
};

export default React.memo(Row);
