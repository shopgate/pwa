import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import TabBar from 'Components/TabBar';
import styles from './style';

/**
 * The view component.
 */
class Viewport extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.ref = React.createRef();
    // Build the app header DOM element (for attaching the AppBar portal)
    this.headerEl = document.createElement('div');
    this.headerEl.id = 'AppHeader';
    this.headerEl.className = styles.header;
  }

  /**
   * Adds the app header element as the first child node.
   */
  componentDidMount() {
    this.ref.current.insertBefore(this.headerEl, this.ref.current.firstChild);
  }

  /**
   * Removes the app header element if this component unmounts.
   */
  componentWillUnmount() {
    this.ref.current.removeChild(this.el);
  }

  /**
   * @returns {React.Node}
   */
  render() {
    const { children } = this.props;

    return (
      <main ref={this.ref} className={styles.viewport} role="main" itemScope itemProp="http://schema.org/MobileApplication">
        <section className={styles.content}>
          {children}
        </section>
        <footer className={styles.footer} id="AppFooter">
          <TabBar />
        </footer>
      </main>
    );
  }
}

/**
 * @param {Object} prev The previous component props.
 * @param {Object} next The next component props.
 * @return {boolean}
 */
function viewportShouldUpdate(prev, next) {
  if (!prev.children && next.children) {
    return true;
  }

  return false;
}

export default shouldUpdate(viewportShouldUpdate)(Viewport);
