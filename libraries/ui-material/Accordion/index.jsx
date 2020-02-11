import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { AccordionContainer, ChevronIcon } from '@shopgate/pwa-ui-shared';
import AccordionContent from './components/AccordionContent';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Accordion = (props) => {
  const {
    renderLabel, handleLabel, children, testId, className,
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
            className={classnames(className, styles.toggle.toString())}
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
  children: PropTypes.node.isRequired,
  renderLabel: PropTypes.func.isRequired,
  className: PropTypes.string,
  handleLabel: PropTypes.string,
  testId: PropTypes.string,
};

Accordion.defaultProps = {
  className: null,
  handleLabel: null,
  testId: null,
};

export default Accordion;
