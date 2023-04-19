import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { AccordionContainer, ChevronIcon } from '@shopgate/pwa-ui-shared';
import AccordionContent from './components/AccordionContent';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Accordion = (props) => {
  const {
    renderLabel, handleLabel, children, testId,
  } = props;

  if (!renderLabel || !children) {
    return null;
  }

  const controlsId = `${testId}-content`.replace(/[^\w\s]/gi, '-').replace(' ', '-');

  return (
    <AccordionContainer>
      {({ handleOpen, handleClose, open }) => (
        <Fragment>
          <div
            onClick={open ? handleClose : handleOpen}
            onKeyDown={open ? handleClose : handleOpen}
            role="button"
            tabIndex="0"
            className={`${styles.toggle} ui-material__accordion`}
            data-test-id={testId}
            key="accordion-toggle"
            aria-expanded={open}
            aria-controls={controlsId}
            aria-label={handleLabel}
          >
            {renderLabel({ open })}
            <div className={styles.chevronContainer}>
              <ChevronIcon className={open ? styles.chevronOpen : styles.chevronClosed} />
            </div>
          </div>
          <AccordionContent open={open} id={controlsId} key={controlsId}>
            {children}
          </AccordionContent>
        </Fragment>
      )}
    </AccordionContainer>
  );
};

Accordion.propTypes = {
  children: PropTypes.node,
  handleLabel: PropTypes.string,
  renderLabel: PropTypes.func,
  testId: PropTypes.string,
};

Accordion.defaultProps = {
  children: null,
  renderLabel: null,
  handleLabel: null,
  testId: null,
};

export default Accordion;
