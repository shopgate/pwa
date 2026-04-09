import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '../../../core/helpers';

const useStyles = makeStyles()(theme => ({
  openingHoursRow: {
    display: 'table-row',
  },
  openingHoursDay: {
    display: 'table-cell',
    paddingRight: theme.spacing(2),
  },
}));

/**
 * Renders a single opening hours line.
 * @param {Object} props The component props.
 * @param {string} props.day The day.
 * @param {string} props.hours The hours line.
 * @returns {JSX.Element}
 */
export function StoreOpeningHoursLine({ day, hours }) {
  const { classes } = useStyles();
  if (!hours || hours === '') {
    return null;
  }

  return (
    <tr
      className={classes.openingHoursRow}
      aria-label={`${i18n.text(`locations.${day}`)}: ${hours}`}
      tabIndex={0}
      role="row"
    >
      <td className={classes.openingHoursDay} aria-hidden>
        {i18n.text(`locations.${day}`)}
      </td>
      <td aria-hidden>
        {hours}
      </td>
    </tr>
  );
}

StoreOpeningHoursLine.propTypes = {
  day: PropTypes.string.isRequired,
  hours: PropTypes.string,
};

StoreOpeningHoursLine.defaultProps = {
  hours: null,
};
