import React, { Component } from 'react';
import PropTypes from 'prop-types';
import portalCollection from '../../helpers/portals/portalCollection';
import { componentsConfig as config } from '../../helpers/config';

/**
 * The Portal component.
 */
class Portal extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
    props: PropTypes.shape(),
  };

  static defaultProps = {
    children: null,
    props: null,
  };

  /**
   * Constructor.
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.portals = portalCollection.getPortals();
    this.state = {
      hasError: false,
    };
  }

  /**
   * Catches errors.
   */
  componentDidCatch() {
    this.setState({ hasError: true });
  }

  /**
   * Returns the portal components.
   * @param {string} name - The component name to match.
   * @param {Object} props - The props to pass to the component.
   * @return {Array}
   */
  getComponents = (name, props) => {
    const components = [];

    if (!config || !config.portals) {
      return components;
    }

    // Loop over the portal keys.
    Object.keys(config.portals).forEach((key, index) => {
      const portalTarget = Array.isArray(config.portals[key].target)
        ? config.portals[key].target
        : [config.portals[key].target];

      if (portalTarget.length === 0) {
        return;
      }

      portalTarget.forEach((target) => {
        // Stop if there is no key that matches the given name (prop).
        if (target !== name) {
          return;
        }

        const PortalComponent = this.portals[key];

        // Check that the component is valid.
        if (PortalComponent) {
          const componentKey = `${key}-${index}`;
          components.push((
            <PortalComponent {...props} key={componentKey} />
          ));
        }
      });
    });

    return components;
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    const components = this.getComponents(this.props.name, this.props.props);
    const hasComponents = components.length > 0;

    /**
     * Render nothing if there are no children, matching components
     * via name or an error occured.
     */
    if (hasError || !(hasComponents || children)) {
      return null;
    }

    /**
     *  If there are matching components then render them.
     */
    if (hasComponents) {
      /**
       * If there is a child component then we treat the match as an override
       * and we render the last match only.
       */
      if (children) {
        return components[components.length - 1];
      }

      return components;
    }

    return children;
  }
}

export default Portal;
