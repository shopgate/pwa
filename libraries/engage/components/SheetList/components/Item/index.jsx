import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withForwardedRef } from '@shopgate/engage/core';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import Grid from '@shopgate/pwa-common/components/Grid';
import Link from '@shopgate/pwa-common/components/Link';
import Glow from '@shopgate/pwa-ui-shared/Glow';

const { colors, variables } = themeConfig;
const IMAGE_SPACE = 72;
const glowHover = {
  boxShadow: `-${variables.gap.bigger}px 0 0 ${colors.shade8}, ${variables.gap.bigger}px 0 0 ${colors.shade8}`,
};

const useStyles = makeStyles()({
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
});

/**
 * The list item component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const Item = ({
  title,
  className,
  description,
  forwardedRef,
  image,
  isDisabled,
  isSelected,
  leftComponent,
  link,
  linkComponent: LinkComponent,
  linkState,
  onClick,
  rightComponent,
  testId,
}) => {
  const { classes } = useStyles();

  const renderContent = useCallback((isNested = true) => {
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
      <div data-test-id={testId} ref={ref} className="engage__sheet-list__item">
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
                // eslint-disable-next-line react/no-danger
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
  }, [
    classes,
    description,
    forwardedRef,
    image,
    isDisabled,
    isSelected,
    leftComponent,
    rightComponent,
    testId,
    title,
  ]);

  if (isDisabled || (!link && !onClick)) {
    return renderContent(false);
  }

  if (link) {
    return (
      <Glow
        ref={forwardedRef}
        className={className}
        styles={{ hover: glowHover }}
      >
        <LinkComponent href={link} onClick={onClick} state={linkState} tabIndex={0}>
          {renderContent()}
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
        {renderContent()}
      </Glow>
    </div>
  );
};

Item.propTypes = {
  title: PropTypes.string.isRequired,
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

Item.defaultProps = {
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

export default withForwardedRef(memo(Item));
