// @flow
import * as React from 'react';
import classnames from 'classnames';
import { AccordionContainer, ChevronIcon } from '@shopgate/pwa-ui-shared';
import AccordionContent from './components/AccordionContent';
import * as styles from './style';

type Props = {
  renderLabel: ({ open: boolean }) => void,
  children: React.Node,
  handleLabel?: string,
  testId?: string,
  className?: string,
  contentClassName?: string,
  openWithChevron?: boolean,
}

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function Accordion(props: Props) {
  const {
    renderLabel, handleLabel, children, testId, className, contentClassName, openWithChevron,
  } = props;

  if (!renderLabel || !children) {
    return null;
  }

  const controlsId = testId ? `${testId}-content`.replace(/[^\w\s]/gi, '-').replace(' ', '-') : 'accordion-content';

  return (
    <AccordionContainer>
      {({ handleOpen, handleClose, open }) => {
        const clickHandlers = {
          onClick: open ? handleClose : handleOpen,
          onKeyDown: open ? handleClose : handleOpen,
          role: 'button',
          tabIndex: '0',
        };

        return (
          <React.Fragment>
            <div
              {... (openWithChevron ? {} : clickHandlers)}
              className={classnames(className, styles.toggle.toString())}
              data-test-id={testId}
              key="accordion-toggle"
              aria-expanded={open}
              aria-controls={controlsId}
              aria-label={handleLabel}
            >
              {renderLabel({ open })}
              <div className={styles.chevronContainer} {... (openWithChevron ? clickHandlers : {})}>
                <ChevronIcon className={open ? styles.chevronOpen : styles.chevronClosed} />
              </div>
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
  testId: null,
  openWithChevron: false,
};

export default Accordion;
