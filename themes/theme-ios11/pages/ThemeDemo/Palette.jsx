import { useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import { Typography } from '@shopgate/engage/components';
import { makeStyles, useTheme } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  entry: {
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  color: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: 8,
    ...theme.applyStyles('dark', {
      borderColor: '#fff',
    }),
  },
  entryName: {

  },
}));

/**
 * @typedef {Object} PaletteEntry
 * @property {string} name The name of the entry.
 * @property {string} value The value of the entry.
 * @property {Object} group The group the entry belongs to, used for determining text color.
 */

/**
 * Displays a single palette entry, showing the color and its name.
 * @param {Object} props The component props.
 * @param {PaletteEntry} props.entry The entry object.
 * @returns {JSX.Element}
 */
const Entry = ({ entry }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.entry}>
      <div className={classes.color} style={{ background: entry.value }}>
        {entry?.group?.contrastText && (
        <Typography
          variant="caption"
          className={classes.entryText}
          style={{ color: entry.group.contrastText }}
        >
          Text
        </Typography>
        )}
      </div>
      <div className={classes.entryName}>
        {entry.name}
      </div>
    </div>
  );
};

Entry.propTypes = {
  entry: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string.isRequired,
    group: PropTypes.shape().isRequired,
  }).isRequired,
};

/**
 * @returns {JSX.Element}
 */
const Palette = () => {
  const { classes } = useStyles();
  const theme = useTheme();

  const entries = useMemo(
    () => Object.entries(theme.palette)
      .filter(([key, group]) => !['function', 'number'].includes(typeof group) && key !== 'mode')
      .map(([groupTitle, group]) => {
        let subEntries;
        if (typeof group === 'object') {
          subEntries = Object.entries(group)
            .filter(([, innerGroup]) => typeof innerGroup === 'string')
            .map(([name, value]) => ({
              name: `${groupTitle}.${name}`,
              value,
              group,
            }));
        } else {
          subEntries = [
            {
              name: '',
              value: group,
              group: {},
            },
          ];
        }

        return {
          headline: groupTitle,
          entries: subEntries.filter(({ name }) => !name.includes('contrastText')),
        };
      }),
    [theme.palette]
  );

  return (
    <div className={classes.root}>
      {entries.map(({ headline, entries: subEntries }) => (
        <Fragment key={headline}>
          <Typography variant="h4" gutterBottom>{startCase(headline)}</Typography>
          <div className={classes.group}>
            {subEntries.map(entry => (
              <Entry key={`${entry.name}${entry.value}`} entry={entry} />
            ))}
          </div>
        </Fragment>
      ))}

    </div>
  );
};

export default Palette;
