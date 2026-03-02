import { useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import startCase from 'lodash/startCase';
import { Typography } from '@shopgate/engage/components';
import { makeStyles, useTheme } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  group: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
  },
  entry: {
    display: 'flex',
    flexDirection: 'column',
    height: 80,
    width: 80,
    padding: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: theme.palette.grey[500],
    borderWidth: 1,
    borderStyle: 'solid',
    ...theme.applyStyles('dark', {
      '& *': {
        fontWeight: 'bold',
      },
    }),
  },
  entryText: {

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
  const theme = useTheme();

  // Determine text color
  const color = useMemo(() => {
    if (!entry.value) {
      return '#fff';
    }

    if (entry?.group?.contrastText) {
      return entry.group.contrastText;
    }

    return 'transparent';
  }, [
    entry.value,
    entry.group,
  ]);

  const { classes } = useStyles();

  return (
    <div
      className={classes.entry}
      style={{ backgroundColor: entry.name === 'contrastText' ? theme.palette.grey[500] : entry.value }}
    >
      {entry.name ? (
        <Typography
          variant="caption"
          className={classes.entryText}
          style={{ color }}
        >
          {entry.name}
        </Typography>
      ) : null}
      {/* <Typography
        variant="caption"
        className={classes.entryText}
        style={{ color }}
      >
        {entry.value.toLowerCase()}
      </Typography> */}
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
              name,
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
          entries: subEntries.filter(({ name }) => name !== 'contrastText'),
        };
      }),
    [theme.palette]
  );

  return (
    <div className={classes.root}>
      {entries.map(({ headline, entries: subEntries }) => (
        <Fragment key={headline}>
          <Typography variant="h3" gutterBottom>{startCase(headline)}</Typography>
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
