import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthRoutes from '../Router/components/AuthRoutes';
import connect from './connector';

/**
 * The Portal component.
 */
class AuthPortal extends Component {
  static propTypes = {
    components: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      hasComponents: props.components.length > 0,
      hasError: false,
    };
  }

  /**
   * @param {Object} nextProps The next component props.
   * @param {Object} nextState The next component state.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.hasComponents !== nextState.hasComponents
      || this.state.hasError !== nextState.hasError
    );
  }

  /**
   * Catches errors.
   */
  componentDidCatch() {
    this.setState({ hasError: true });
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { components } = this.props;
    const { hasComponents, hasError } = this.state;

    /**
     * Render nothing if there are no children, matching components
     * via name or an error occured.
     */
    if (hasError || !hasComponents) {
      return null;
    }

    return (
      <AuthRoutes to="/login">
        {components}
      </AuthRoutes>
    );
  }
}

export default connect(AuthPortal);
