import React, { useRef, useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '../';
import { headline, hidden } from './style';

/**
 * Checks the section ref has suitable child nodes.
 * @param {Object} ref A React ref.
 * @returns {bool}
 */
const hasChildNodes = (ref) => {
  if (!ref.current) {
    return false;
  }

  // Determine all child nodes except the headline.
  const childNodes = [].filter.call(
    ref.current.childNodes,
    el => !el.classList.contains(headline.toString())
  );

  return childNodes.length > 0;
};

/**
 * The Section component is supposed to be used to structure the content to improve a11y. It
 * renders a headline on top which is only visible for screen readers and describes the section.
 * Internally a MutationObserver maintains the visibility based on the presence of rendered content.
 * @param {string} title The section title - can be a translation placeholder.
 * @param {Object} titleParams Additional parameters for the title  translation placeholder.
 * @param {NodeList} children Component children.
 * @returns {JSX}
 */
const Section = ({ title, titleParams, children }) => {
  const contentRef = useRef(null);
  const [hasContent, setHasContent] = useState(false);

  const observer = useMemo(() => new MutationObserver(() => {
    setHasContent(hasChildNodes(contentRef));
  }));

  useEffect(() => {
    setHasContent(hasChildNodes(contentRef));
    observer.observe(contentRef.current, { childList: true });

    return () => {
      observer.disconnect();
    };
  }, [contentRef]);

  return (
    <section ref={contentRef} className={hasContent ? null : hidden}>
      <h1 className={headline}>
        <I18n.Text string={title} params={titleParams} />
      </h1>
      {children}
    </section>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  titleParams: PropTypes.shape(),
};

Section.defaultProps = {
  children: null,
  titleParams: {},
};

export default Section;
