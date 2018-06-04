import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { RouteContext } from '@virtuous/react-conductor/Router';
import getCurrentRoute from '@virtuous/conductor-helpers/getCurrentRoute';

/**
 * @param {function} mapStateToProps The map state to props callback.
 * @param {function} mapDispatchToProps The map dispatch to props callback.
 * @param {function} mergeProps The merge props callback.
 * @param {Object} options The connect options.
 * @return {function} The connected component.
 */
const routeConnect = (
  mapStateToProps = null,
  mapDispatchToProps = null,
  mergeProps = null,
  options = {}
) => {
  // Wrap the real connect method with the local map state to props callback.
  const reduxConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options
  );

  /**
   * Creates a wrapping component that takes care about the current path.
   * @param {Component} WrappedComponent The component to wrap.
   * @return {Component} The component wrapper.
   */
  const RouteConnect = WrappedComponent => class extends Component {
    static displayName = 'ConductorConnect';

    static propTypes = {
      routeId: PropTypes.string,
    };

    static defaultProps = {
      routeId: false,
    }

    /**
     * @param {Object} props The component props.
     */
    constructor(props) {
      super(props);

      /**
       * A flag the represents if the props have changed since
       * this component was last allowed to update.
       */
      this.havePropsChanged = false;
    }

    /**
     * @param {Object} nextProps The next component props.
     */
    componentWillReceiveProps(nextProps) {
      const wrappedProps = this.getWrappedProps(this.props);
      const wrappedNextProps = this.getWrappedProps(nextProps);

      if (!isEqual(wrappedProps, wrappedNextProps)) {
        this.havePropsChanged = true;
      }
    }

    /**
     * Only allows component updates when the current route matches the components mounting route.
     * @return {boolean} Whether to update the component.
     */
    shouldComponentUpdate() {
      if (!this.props.routeId) {
        return false;
      }

      const { id } = getCurrentRoute();

      // Only render if the next route matches the mounted route and the props changed.
      if (id === this.props.routeId && this.havePropsChanged) {
        this.havePropsChanged = false;
        return true;
      }

      return false;
    }

    getWrappedProps = (props) => {
      const { dispatch, routeId, ...wrappedProps } = props;
      return wrappedProps;
    }

    /**
     * Renders the component.
     * @return {Node} The rendered component.
     */
    render() {
      return React.createElement(WrappedComponent, this.props);
    }
  };

  /**
   * 
   */
  return (WrapperComponent) => {
    const HOC = RouteConnect(WrapperComponent);
    return reduxConnect((
      props => (
        <RouteContext.Consumer>
          {({ id }) => <HOC {...props} routeId={id} />}
        </RouteContext.Consumer>
      )
    ));
  };
};

export default routeConnect;
