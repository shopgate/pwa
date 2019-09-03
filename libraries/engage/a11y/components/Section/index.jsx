import React, {
  useRef, useState, useMemo, useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import kebabCase from 'lodash/kebabCase';
import { I18n } from '@shopgate/engage/components';
import { hidden } from './style';

/**
 * Checks the section ref has suitable child nodes.
 * @param {Object} ref A React ref.
 * @param {string} headlineId The ID of the section headline.
 * @returns {bool}
*/
const hasChildNodes = (ref, headlineId) => {
  if (!ref.current) {
    return false;
  }

  // Determine all child nodes except the headline.
  const childNodes = [].filter.call(
    ref.current.childNodes,
    el => el.getAttribute('id') !== headlineId
  );

  return childNodes.length > 0;
};

/**
 * The Section component is supposed to be used to structure the content to improve a11y. It
 * renders a headline on top which is only visible for screen readers and describes the section.
 * Internally a MutationObserver maintains the visibility based on the presence of rendered content.
 * @param {string} title The section title - can be a translation placeholder.
 * @param {Object} [titleParams={}] Additional parameters for the title  translation placeholder.
 * @param {Object} [className=null] A class name for the section.
 * @param {NodeList} [children=null] Component children.
 * @returns {JSX}
 */
const Section = ({
  title, titleParams, children, className, ...rest
}) => {
  const contentRef = useRef(null);
  const [hasContent, setHasContent] = useState(false);
  const id = useMemo(() => kebabCase(title), [title]);

  const observer = useMemo(() => new MutationObserver(() => {
    setHasContent(hasChildNodes(contentRef, id));
  }));

  useLayoutEffect(() => {
    setHasContent(hasChildNodes(contentRef, id));
    observer.observe(contentRef.current, { childList: true });

    return () => {
      observer.disconnect();
    };
  }, [contentRef, id, observer]);

  const classes = classNames(className, {
    [hidden]: !hasContent,
  });

  return (
    <section {...rest} ref={contentRef} className={classes} aria-labelledby={id}>
      <h1 id={id} hidden>
        <I18n.Text string={title} params={titleParams} />
      </h1>
      {children}
    </section>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  titleParams: PropTypes.shape(),
};

Section.defaultProps = {
  children: null,
  className: null,
  titleParams: {},
};

export default Section;
