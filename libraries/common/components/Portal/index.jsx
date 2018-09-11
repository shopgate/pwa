import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { logger } from '@shopgate/pwa-core/helpers';
import portalCollection from '../../helpers/portals/portalCollection';
import { componentsConfig } from '../../helpers/config';

const { portals = null } = componentsConfig;

/**
 * The Portal component.
 */
class Portal extends PureComponent {
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
      components: this.getComponents(props),
    };
  }

  /**
   * Returns the portal components.
   * @param {Object} componentProps The component props.
   * @return {Array}
   */
  getComponents = (componentProps) => {
    const { name, props } = componentProps;
    const components = [];

    if (!portals) {
      return components;
    }

    // Loop over the portal keys.
    Object.keys(portals).forEach((key, index) => {
      const { target: sourceTarget } = portals[key];
      const portalTarget = Array.isArray(sourceTarget) ? sourceTarget : [sourceTarget];

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
   * Catches errors.
   * @param {Error} error The catched error.
   * @param {Object} info The stacktrace infor.
   */
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    logger.error(error, info);
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { children } = this.props;
    const { hasError, components } = this.state;

    /**
     * Render nothing if there are no children, matching components
     * via name or an error occured.
     */
    if (hasError || components.length === 0) {
      return children;
    }

    /**
     * If there is a child component then we treat the match as an override
     * and we render the last match only.
     */
    if (children) {
      return components[components.length - 1];
    }

    return components;
  }
}

export default Portal;
