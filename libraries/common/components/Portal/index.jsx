import React, { PureComponent, Suspense } from 'react';
import PropTypes from 'prop-types';
import { logger } from '@shopgate/pwa-core/helpers';
import Loading from '../Loading';
import portalCollection from '../../helpers/portals/portalCollection';
import { componentsConfig } from '../../helpers/config';

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

    this.state = {
      hasError: false,
    };

    this.components = this.getPortalComponents(props.name);
  }

  /**
   * Catches errors.
   * @param {Error} error The caught error.
   * @param {Object} info The stacktrace info.
   */
  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    logger.error(error, info);
  }

  /**
   * Returns the portal components.
   * @param {Object} props - The props to pass to the component.
   * @return {Array}
   */
  getRenderedComponents = (props) => {
    const { props: propsFromProps, ...reducedProps } = props;

    const componentProps = {
      ...propsFromProps,
      ...reducedProps,
    };

    return this.components.map(({ PortalComponent, key }) => (
      <Suspense fallback={<Loading />} key={key}>
        <PortalComponent {...componentProps} />
      </Suspense>
    ));
  };

  /**
   * Returns the portal components.
   * @param {string} name Name of the portal position
   * @return {Array}
   */
  getPortalComponents = (name) => {
    const components = [];
    const portals = portalCollection.getPortals();
    if (!portals) {
      return components;
    }

    let config = portalCollection.getConfig();
    if (!config) {
      config = componentsConfig.portals;
    }

    // Loop over the portal keys.
    Object.keys(config).forEach((key, index) => {
      const { target: sourceTarget } = config[key];
      const portalTarget = Array.isArray(sourceTarget) ? sourceTarget : [sourceTarget];

      if (portalTarget.length === 0) {
        return;
      }

      portalTarget.forEach((target) => {
        // Stop if there is no key that matches the given name (prop).
        if (target !== name) {
          return;
        }

        const PortalComponent = portals[key];

        // Check that the component is valid.
        if (PortalComponent) {
          const componentKey = `${key}-${index}`;

          components.push({
            key: componentKey,
            PortalComponent,
          });
        }
      });
    });

    return components;
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { children } = this.props;
    const { hasError } = this.state;
    const renderedComponents = this.getRenderedComponents(this.props);
    const hasComponents = renderedComponents.length > 0;

    /**
     * Render nothing if there are no children, matching components
     * via name or an error occurred.
     */
    if (hasError || !(hasComponents || children)) {
      return null;
    }

    /**
     * If there is a child component then we treat the match as an override
     * and we render the last match only.
     */
    if (hasComponents) {
      /**
       * If there is a child component then we treat the match as an override
       * and we render the last match only.
       */
      if (children) {
        return renderedComponents[renderedComponents.length - 1];
      }

      return renderedComponents;
    }

    return children;
  }
}

export default Portal;
