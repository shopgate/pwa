import React, { Suspense, memo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import Loading from '../../../Loading';
import Grid from '../../../Grid';

const useStyles = makeStyles()((
  _t,
  {
    col,
    row,
    width,
    height,
  }
) => ({
  widgetCell: {
    gridColumnStart: col + 1,
    gridColumnEnd: col + width + 1,
    gridRowStart: row + 1,
    gridRowEnd: row + height + 1,
  },
}));

/**
 * @param {Object} props Props.
 * @returns {JSX.Element|null}
 */
const Widget = ({ config, component: Comp }) => {
  const {
    col,
    row,
    height,
    settings,
    width,
  } = config;

  const { classes } = useStyles({
    col,
    row,
    width,
    height,
  });

  if (!Comp) {
    return null;
  }

  return (
    <Grid.Item
      className={`common__widgets__widget ${classes.widgetCell}`}
      component="div"
    >
      <div>
        <Suspense fallback={<Loading />}>
          {React.createElement(Comp, {
            settings,
            ratio: [width, height],
          })}
        </Suspense>
      </div>
    </Grid.Item>
  );
};

Widget.propTypes = {
  config: PropTypes.shape().isRequired,
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.elementType,
  ]),
};

Widget.defaultProps = {
  component: null,
};

export default memo(Widget);
