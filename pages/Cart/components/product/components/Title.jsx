import React, { PropTypes } from 'react';
import {
  Grid,
  I18n,
} from 'Library/components';
import { ContextMenu } from 'Templates/components';
import styles from '../style';

/**
 * The ProductTitle component.
 * @param {Object} props The component properties.
 * @returns {JSX}
 */
const ProductTitle = props => (
  <Grid>
    <Grid.Item grow={1}>
      <div className={styles.title}>
        {props.value}
      </div>
    </Grid.Item>
    <Grid.Item className={styles.menuContainer} shrink={0}>
      <div className={styles.menuToggle}>
        <ContextMenu>
          <ContextMenu.Item onClick={props.handleRemove}>
            <I18n.Text string="cart.remove" />
          </ContextMenu.Item>
          <ContextMenu.Item onClick={() => { props.toggleEditMode(true); }}>
            <I18n.Text string="cart.edit" />
          </ContextMenu.Item>
        </ContextMenu>
      </div>
    </Grid.Item>
  </Grid>
);

ProductTitle.propTypes = {
  value: PropTypes.string.isRequired,
  handleRemove: PropTypes.func,
  toggleEditMode: PropTypes.func,
};

ProductTitle.defaultProps = {
  handleRemove: () => {},
  toggleEditMode: () => {},
};

export default ProductTitle;
