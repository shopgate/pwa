import React, {
  useRef, useState, useMemo, useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import { I18n } from '@shopgate/engage/components';

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
 * @param {Object} props The component props.
 * @param {string} props.title The section title - can be a placeholder.
 * @param {Object} [props.titleParams={}] Additional parameters for the title placeholder.
 * @param {Object} [props.className=null] A class name for the section.
 * @param {NodeList} [props.children=null] Component children.
 * @returns {JSX}
 */
function Section(props) {
  const {
    title, titleParams, children, className, ...rest
  } = props;
  const contentRef = useRef(null);
  const [hasContent, setHasContent] = useState(false);
  const id = useMemo(() => kebabCase(title), [title]);

  const observer = useMemo(() => new MutationObserver(() => {
    setHasContent(hasChildNodes(contentRef, id));
  }), [contentRef, id]);

  useLayoutEffect(() => {
    setHasContent(hasChildNodes(contentRef, id));
    observer.observe(contentRef.current, { childList: true });

    return () => {
      observer.disconnect();
    };
  }, [contentRef, id, observer]);

  if (!hasContent) {
    return (
      <section {...rest} ref={contentRef}>
        {children}
      </section>
    );
  }

  return (
    <section {...rest} ref={contentRef} aria-labelledby={id}>
      <h2 id={id} hidden>
        <I18n.Text string={title} params={titleParams} />
      </h2>
      {children}
    </section>
  );
}

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
