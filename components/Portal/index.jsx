import React, { Component } from 'react';
import PropTypes from 'prop-types';
import last from 'lodash/last';
import portalCollection from '../../helpers/portals/portalCollection';
import { componentsConfig as config } from '../../helpers/config';

const portals = portalCollection.getPortals();

/**
 * The Portal component.
 * It renders out the portals relating to the ID prop.
 */
class Portal extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
    id: PropTypes.string,
  };

  static defaultProps = {
    id: null,
    children: null,
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
  }

  /**
   * Returns the portal components.
   * @return {Array}
   */
  get components() {
    const { name, id } = this.props;
    const components = [];

    Object.keys(config.portals)
      .forEach((key) => {
        const portalTarget = Array.isArray(config.portals[key].target)
          ? config.portals[key].target
          : [config.portals[key].target];

        portalTarget.forEach((target) => {
          if (target === name) {
            const PortalComponent = portals[key];

            if (PortalComponent) {
              components.push(<PortalComponent key={`${key}-${id}`} id={id} />);
            }
          }
        });
      });

    return components;
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
    if (this.state.hasError) {
      return null;
    }

    const { children } = this.props;

    if (children && this.components.length) {
      return last(this.components);
    }

    if (this.components.length) {
      return this.components;
    }

    return children;
  }
}

export default Portal;
