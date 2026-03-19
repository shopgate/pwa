import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withForwardedRef } from '@shopgate/engage/core';
import { withStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Grid from '@shopgate/pwa-common/components/Grid';
import Link from '@shopgate/pwa-common/components/Link';
import Glow from '@shopgate/pwa-ui-shared/Glow';

const { colors, variables } = themeConfig;
const IMAGE_SPACE = 72;
const glowHover = {
  boxShadow: `-${variables.gap.bigger}px 0 0 ${colors.shade8}, ${variables.gap.bigger}px 0 0 ${colors.shade8}`,
};

/**
 * The list item component.
 */
class Item extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      description: PropTypes.string,
      disabled: PropTypes.string,
      grid: PropTypes.string,
      image: PropTypes.string,
      selected: PropTypes.string,
      title: PropTypes.string,
    }),
    className: PropTypes.string,
    description: PropTypes.string,
    forwardedRef: PropTypes.shape(),
    image: PropTypes.element,
    isDisabled: PropTypes.bool,
    isSelected: PropTypes.bool,
    leftComponent: PropTypes.element,
    link: PropTypes.string,
    linkComponent: PropTypes.elementType,
    linkState: PropTypes.shape(),
    onClick: PropTypes.func,
    rightComponent: PropTypes.element,
    testId: PropTypes.string,
  };

  static defaultProps = {
    classes: {
      description: '',
      disabled: '',
      grid: '',
      image: '',
      selected: '',
      title: '',
    },
    className: null,
    description: null,
    forwardedRef: null,
    image: null,
    isDisabled: false,
    isSelected: false,
    leftComponent: null,
    link: null,
    linkComponent: Link,
    linkState: null,
    onClick: null,
    rightComponent: null,
    testId: null,
  };

  /**
   * Should only update when the `selected` or `disabled` or 'leftComponent' props change.
   * @param {Object} nextProps The next set of component props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.isSelected !== nextProps.isSelected ||
      this.props.isDisabled !== nextProps.isDisabled ||
      this.props.leftComponent !== nextProps.leftComponent
    );
  }

  /**
   * Renders the bulk of the content.
   * @param {boolean} [isNested=true] Tells if the content is rendered nested.
   * @returns {JSX.Element}
   */
  renderContent(isNested = true) {
    const {
      isDisabled, isSelected, title, image, rightComponent,
      leftComponent, forwardedRef, description,
    } = this.props;
    const classes = withStyles.getClasses(this.props);

    const gridStyles = {
      [classes.grid]: true,
      [classes.selected]: isSelected,
    };
    const titleStyles = {
      [classes.title]: true,
      [classes.disabled]: isDisabled,
    };

    const ref = isNested ? null : forwardedRef;

    return (
      <div data-test-id={this.props.testId} ref={ref} className="engage__sheet-list__item">
        <Grid className={classNames(gridStyles)} component="div">
          {(image !== null) && (
            <div className={classes.image}>
              {image}
            </div>
          )}
          {(leftComponent !== null) && (
            <Grid.Item component="div" grow={1}>
              {leftComponent}
            </Grid.Item>
          )}
          <Grid.Item className={classNames(titleStyles)} component="div" grow={1}>
            <div>
              {title}
            </div>
            { description && (
              <div
                className={classes.description}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </Grid.Item>
          {(rightComponent !== null) && (
            <Grid.Item component="div" grow={1}>
              {rightComponent}
            </Grid.Item>
          )}
        </Grid>
      </div>
    );
  }

  /**
   * @returns {JSX.Element}
   */
  render() {
    const {
      link,
      linkState,
      linkComponent: LinkComponent,
      onClick,
      className,
      isDisabled,
      testId,
      forwardedRef,
      isSelected,
    } = this.props;

    /**
     * If this item is disabled, selected or doesn't have a valid
     * link or click handler then wrap the content with other components.
     */
    if (isDisabled || (!link && !onClick)) {
      return this.renderContent(false);
    }

    // Wrap with a <Link> if the `link` prop is set.
    if (link) {
      return (
        <Glow
          ref={forwardedRef}
          className={className}
          styles={{ hover: glowHover }}
        >
          <LinkComponent href={link} onClick={onClick} state={linkState} tabIndex={0}>
            {this.renderContent()}
          </LinkComponent>
        </Glow>
      );
    }

    return (
      <div
        onKeyPress={() => { }}
        onClick={onClick}
        data-test-id={testId}
        ref={forwardedRef}
        tabIndex={0}
        role="option"
        aria-selected={isSelected}
      >
        <Glow className={className} styles={{ hover: glowHover }}>
          {this.renderContent()}
        </Glow>
      </div>
    );
  }
}

export default withForwardedRef(withStyles(
  Item,
  () => ({
    disabled: {
      color: colors.shade5,
      cursor: 'not-allowed',
    },
    selected: {
      background: 'var(--color-background-accent)',
      boxShadow: '-16px 0 0 0 var(--color-background-accent) !important',
    },
    title: {
      width: '100%',
      marginTop: variables.gap.xsmall,
      paddingRight: variables.gap.big,
      hyphens: 'auto',
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
      color: 'var(--color-text-high-emphasis)',
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        padding: variables.gap.big,
        margin: 0,
        fontSize: '1.25rem',
        lineHeight: '1.5rem',
      },
    },
    description: {
      display: 'none',
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        display: 'block',
        color: 'var(--color-text-medium-emphasis)',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        fontWeight: 'initial',
        paddingTop: variables.gap.small,
      },
    },
    grid: {
      alignItems: 'center',
      minHeight: 56,
      padding: `${variables.gap.small}px 0`,
      position: 'relative',
      zIndex: 2,
      [responsiveMediaQuery('>xs', { webOnly: true })]: {
        padding: 0,
      },
    },
    image: {
      alignSelf: 'flex-start',
      flexShrink: 0,
      margin: `0 ${variables.gap.big}px 0 ${-IMAGE_SPACE + variables.gap.big}px`,
      width: 40,
    },
  })
));
