// @flow
import * as React from 'react';
import classnames from 'classnames';
import { AccordionContainer, ChevronIcon } from '@shopgate/pwa-ui-shared';
import { i18n } from '@shopgate/engage/core';
import AccordionContent from './components/AccordionContent';
import * as styles from './style';

type Props = {
  renderLabel: ({ open: boolean }) => void,
  children: React.Node,
  handleLabel?: string,
  role?: string,
  testId?: string,
  className?: string,
  contentClassName?: string,
  openWithChevron?: boolean,
  startOpened?: boolean,
  chevronPosition?: "left"|"right",
}

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Accordion(props: Props) {
  const {
    renderLabel,
    handleLabel,
    role,
    children,
    testId,
    className,
    contentClassName,
    openWithChevron,
    startOpened,
    chevronPosition,
  } = props;

  if (!renderLabel || !children) {
    return null;
  }

  const controlsId = testId ? `${testId}-content`.replace(/[^\w\s]/gi, '-').replace(' ', '-') : 'accordion-content';

  return (
    <AccordionContainer open={startOpened}>
      {({ handleOpen, handleClose, open }) => {
        const clickHandlers = {
          onClick: open ? handleClose : handleOpen,
          onKeyDown: open ? handleClose : handleOpen,
          role,
          tabIndex: '0',
        };

        return (
          <React.Fragment>
            <div
              {... (openWithChevron ? {} : clickHandlers)}
              className={classnames(
                className,
                chevronPosition === 'right'
                  ? styles.toggle.toString()
                  : styles.toggleLeftAligned.toString()
              )}
              data-test-id={testId}
              key="accordion-toggle"
              aria-expanded={open}
              aria-controls={controlsId}
              aria-label={handleLabel}
            >
              {chevronPosition === 'left' ? (
                <div
                  className={styles.chevronContainerLeft}
                  {... (openWithChevron ? clickHandlers : {})}
                  aria-label={i18n.text(open ? 'favorites.close_list' : 'favorites.open_list')}
                >
                  <ChevronIcon
                    className={open ? styles.chevronOpen : styles.chevronClosed}
                  />
                </div>
              ) : null}
              {renderLabel({ open })}
              {chevronPosition === 'right' ? (
                <div
                  className={styles.chevronContainer}
                  {... (openWithChevron ? clickHandlers : {})}
                  aria-label={i18n.text(open ? 'favorites.close_list' : 'favorites.open_list')}
                >
                  <ChevronIcon
                    className={open ? styles.chevronOpen : styles.chevronClosed}
                  />
                </div>
              ) : null}
            </div>
            <AccordionContent
              open={open}
              id={controlsId}
              key={controlsId}
              className={contentClassName}
            >
              {children}
            </AccordionContent>
          </React.Fragment>
        );
      }}
    </AccordionContainer>
  );
}

Accordion.defaultProps = {
  className: null,
  contentClassName: null,
  handleLabel: null,
  role: 'button',
  testId: null,
  openWithChevron: false,
  chevronPosition: 'right',
  startOpened: false,
};

export default Accordion;
