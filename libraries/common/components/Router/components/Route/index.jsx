import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from '../../../../helpers/validation';
import RouteContentWrapper from './components/Content';

/**
 * Updates the hosted component of the route.
 * @param {Object} route The route component.
 * @param {Object} hostedComponent the new hosted component.
 * @param {Object} wrappedComponent The new wrapped component.
 * @param {Object} componentProps The component properties.
 */
const wrapHostedComponent = (route, hostedComponent, wrappedComponent, componentProps) => {
  const WrappedComponent = RouteContentWrapper(wrappedComponent);

  const newHostedComponent = hostedComponent;
  newHostedComponent.component = (
    <WrappedComponent {...componentProps} />
  );

  route.setState({
    hostedComponents: route.state.hostedComponents.concat([newHostedComponent]),
  });
};

/**
 * Attempts to load this routes component.
 * @param {Object} route The route component.
 */
const loadHostedComponent = (route) => {
  const self = route;
  /**
   * A component was provided, do not use on-demand import.
   */
  self.wrappedComponent = route.props.component;
};

/**
 * The Route component.
 */
class Route extends Component {
  static propTypes = {
    path: PropTypes.string.isRequired,
    component: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
    ]),
  };

  static defaultProps = {
    component: () => (null),
  };

  static contextTypes = {
    registerRoute: PropTypes.func.isRequired,
    routePath: PropTypes.string,
  };

  static childContextTypes = {
    routePath: PropTypes.string,
  };

  /**
   * Initializes the Route component.
   * @param {Object} props The component props.
   * @param {Object} context The component context.
   */
  constructor(props, context) {
    super(props, context);

    // Register to the router with all callbacks.
    this.context.registerRoute(
      props.path,
      this.addRoute,
      this.removeRoute,
      this.showRoute,
      this.hideRoute,
      props
    );

    // Set the route path.
    this.context.routePath = null;

    this.state = {
      hostedComponents: [],
    };

    // Preload the component.
    loadHostedComponent(this);
  }

  /**
   * Forwards the current route path to the child context.
   * @return {Object} The child context.
   */
  getChildContext() {
    return {
      routePath: this.context.routePath,
    };
  }

  /**
   * Finds hosted component by using a shallow compare of parameters.
   * @param {Object} location Route location.
   * @returns {number|null} The index of the component.
   */
  findHostedComponentIndex(location) {
    const index = this.state.hostedComponents.findIndex(c =>
      c.location.immutableKey === location.immutableKey);

    if (index === -1) {
      return null;
    }

    return index;
  }

  /**
   * Finds the actual components reference.
   * When component is a redux connector this will return the actual wrapped component.
   * @param {Object} component Component base reference.
   * @returns {Object}
   */
  findComponentRef = (component) => {
    if (isFunction(component.getWrappedInstance)) {
      return this.findComponentRef(component.getWrappedInstance());
    }
    return component;
  };

  /**
   * Adds a new route to the stack.
   * @param {Object} location The location object.
   * @param {Object} params The parameters of the route.
   */
  addRoute = (location, params) => {
    // Save the current path in our context.
    this.context.routePath = location.pathname;

    const newHostedComponent = {
      component: null,
      dom: null,
      params,
      location,
    };

    const { component: c, ...otherProps } = this.props;

    const componentProps = {
      key: location.key || location.immutableKey || 'root',
      setRef: (element) => {
        newHostedComponent.dom = element;
      },
      setComponentRef: (component) => {
        if (component === null) {
          return;
        }

        newHostedComponent.componentInstance = this.findComponentRef(component);

        // Save a reference of the original componentDidUpdate lifecycle function.
        const originalComponentDidUpdate =
                newHostedComponent.componentInstance.componentDidUpdate || (() => {});

        /**
         * Rewrite the componentDidUpdate lifecycle function to trigger tracking and execute
         * the original function body.
         * @param {Object} prevProps Previous props.
         * @param {Object} prevState Previous state.
         */
        newHostedComponent.componentInstance.componentDidUpdate =
          function componentDidUpdate(prevProps, prevState) {
            originalComponentDidUpdate(prevProps, prevState);
          };
      },
      params,
      ...otherProps,
    };

    if (this.wrappedComponent) {
      wrapHostedComponent(
        this,
        newHostedComponent,
        this.wrappedComponent,
        componentProps
      );
    } else {
      this.loadingPromise.then(() => {
        wrapHostedComponent(
          this,
          newHostedComponent,
          this.wrappedComponent,
          componentProps
        );
      });
    }
  }

  /**
   * Removes a route from the stack.
   * @param {Object} location The location object.
   */
  removeRoute = (location) => {
    this.setState({
      hostedComponents: this.state.hostedComponents.filter((
        (comp, i) => i !== this.findHostedComponentIndex(location)
      )),
    });
  }

  /**
   * Shows a route that was active once.
   * @param {Object} location The location object.
   */
  showRoute = (location) => {
    // Save the current path in our context.
    this.context.routePath = location.pathname;
    this.activateRoute(this.findHostedComponentIndex(location));
  }

  /**
   * Hides a route that is active.
   * @param {Object} location The location object.
   */
  hideRoute = (location) => {
    this.deactivateRoute(this.findHostedComponentIndex(location));
  }

  /**
   * Deactivate / hide the given route.
   * @param {number} index Index of the hosted route.
   */
  deactivateRoute = (index) => {
    const { dom } = this.state.hostedComponents[index];
    dom.style.display = 'none';
  }

  /**
   * Activate / show the given route.
   * @param {number} index Index of the hosted route.
   */
  activateRoute(index) {
    const { dom } = this.state.hostedComponents[index];
    dom.style.display = '';
  }

  /**
   * Renders the route
   * @returns {JSX}
   */
  render() {
    const components = this.state.hostedComponents.map((
      hosted => hosted.component
    ));

    return (
      <div data-route-path={this.props.path}>
        {components}
      </div>
    );
  }
}

export default Route;
