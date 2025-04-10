import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './style';

/**
 * Drawer component.
 */
class Drawer extends Component {
  /**
   * The component prop types.
   * @type {Object}
   */
  static propTypes = {
    animation: PropTypes.shape({
      duration: PropTypes.number,
      in: PropTypes.string,
      out: PropTypes.string,
    }),
    children: PropTypes.node,
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    // eslint-disable-next-line react/no-unused-prop-types
    onClose: PropTypes.func,
    onDidClose: PropTypes.func,
    onDidOpen: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    onOpen: PropTypes.func,
  };

  /**
   * The component default props.
   * @type {Object}
   */
  static defaultProps = {
    className: '',
    children: null,
    isOpen: false,
    onOpen: () => { },
    onClose: () => { },
    onDidClose: () => { },
    onDidOpen: () => { },
    animation: {
      duration: null,
      in: '',
      out: '',
    },
  };

  /**
   * Initializes the Drawer component.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);
    this.sheetRef = React.createRef();
    this.state = {
      active: props.isOpen,
    };
  }

  /** inheritdoc */
  componentDidMount() {
    if (this.props.isOpen) {
      if (this.sheetRef.current) {
        this.sheetRef.current.focus();
      }
    }
  }

  /**
   * Update state when isOpen changes.
   * @param {Object} nextProps The next component props.
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      if (nextProps.isOpen) {
        if (typeof nextProps.onOpen === 'function') {
          nextProps.onOpen();
        }
        this.setState({ active: true });
      } else if (typeof nextProps.onClose === 'function') {
        nextProps.onClose();
      }
    }
  }

  /**
   * Set focus for a11y when sheet opens
   * @param {Object} prevProps The previous component props.
   */
  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      if (this.sheetRef.current) {
        this.sheetRef.current.focus();
      }
    }
  }

  /**
   * Syncs the internal active state when an animation ends.
   */
  handleAnimationEnd = () => {
    this.setState({ active: this.props.isOpen });
    if (!this.props.isOpen) {
      this.props.onDidClose();
    } else {
      this.props.onDidOpen();
    }
  };

  /**
   * Renders the component.
   * @returns {JSX}
   */
  render() {
    const {
      className,
      children,
      isOpen,
      animation,
    } = this.props;
    const { active } = this.state;

    const animationIn = animation.in || styles.animation.in;
    const animationOut = animation.out || styles.animation.out;

    const combinedClassName = classNames(
      className,
      styles.container,
      { [animationIn]: isOpen },
      { [animationOut]: !isOpen },
      'common__drawer'
    );

    const style = {};
    if (typeof animation.duration === 'number') {
      style.animationDuration = `${animation.duration}ms`;
    }

    return (active) ? (
      <div
        ref={this.sheetRef}
        className={combinedClassName}
        style={style}
        onAnimationEnd={() => {
          this.handleAnimationEnd();
          // clear any residual animation style to fix a11y issue on Android
          // (focus ring is misaligned)
          if (this.sheetRef?.style) {
            this.sheetRef.style.animation = '';
            this.sheetRef.style.transform = 'none';
          }
        }}
        role="dialog"
        aria-modal
        tabIndex={-1}
      >
        {children}
      </div>
    ) : null;
  }
}

export default Drawer;
