import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()(theme => ({
  root: {
    '--sg-palette-price-color': theme.palette.primary.main,
  },
  price: {
    color: theme.components.price.color,
  },
  card: {
    [theme.vars.components.price.color]: theme.palette.secondary.main,
    height: 100,
    width: 100,
    backgroundColor: '#fff',
    borderColor: theme.palette.grey[300],
    borderWidth: 1,
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
}));

const Price = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.price}>
      9.99€
    </div>
  );
};

/**
 * The CSSColorOverride component demonstrates how to override component token values using CSS variables.
 */
const CSSColorOverride = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.root}>
      <Price />

      <div className={classes.card}>
        <Price />
      </div>
    </div>
  );
};

export default CSSColorOverride;
