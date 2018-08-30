import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as styles from './style';

/**
 * The accordion content component.
 */
class AccordionContent extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool,
  }

  static defaultProps = {
    open: false,
  }

  ref = React.createRef();

  /**
   * @returns {JSX}
   */
  render() {
    const { open, children } = this.props;

    return (
      <section
        className={styles.content}
        style={{
          height: (open && this.ref.current) ? this.ref.current.clientHeight : 0,
        }}
      >
        <div ref={this.ref} className={styles.contentInner}>
          {children}
        </div>
      </section>
    );
  }
}

export default AccordionContent;
