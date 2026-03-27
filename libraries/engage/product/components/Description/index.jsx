import React from 'react';
import PropTypes from 'prop-types';
import {
  SurroundPortals, PlaceholderParagraph, HtmlSanitizer, I18n,
} from '@shopgate/engage/components';
import { PRODUCT_DESCRIPTION } from '@shopgate/engage/product';
import { makeStyles } from '@shopgate/engage/styles';
import classNames from 'classnames';
import connect from './connector';

const useStyles = makeStyles()(theme => ({
  container: {
    fontSize: '0.875rem',
    padding: '0.8125rem 1rem 1rem',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 500,
    marginBottom: '0.5rem',
    color: theme.palette.text.primary,
  },
  content: {
    lineHeight: 1.7,
    overflow: 'hidden',
    wordBreak: ['break-all', 'break-word'],
    color: theme.palette.text.primary,
    hyphens: 'auto',
    ' ul': {
      listStyle: 'disc',
    },
    ' ol': {
      listStyle: 'decimal',
    },
    ' ul, ol': {
      margin: '.75em 0',
      paddingLeft: '1.2em',
    },
    ' a': {
      color: theme.palette.primary.main,
      margin: '-.35em',
      padding: '.35em',
      position: 'relative',
    },
  },
  placeholder: {
    height: '0.875rem',
  },
}));

/**
 * The product description.
 * @param {Object} props The component props.
 * @param {string} props.html html describing the product
 * @param {Function} props.navigate where to navigate on click
 * @returns {JSX.Element}
 */
function Description({ html, navigate, ...props }) {
  const { classes } = useStyles();

  return (
    <SurroundPortals
      portalName={PRODUCT_DESCRIPTION}
      portalProps={{
        html,
        navigate,
        ...props,
      }}
    >
      {(html !== '') && (
        <div className={`${classes.container} engage__product__description`}>
          <div className={classNames(classes.title, 'theme__description_heading')}>
            <I18n.Text string="product.description_heading" />
          </div>
          <PlaceholderParagraph className={classes.placeholder} ready={!!html}>
            <div className={classes.content} data-test-id="description">
              <HtmlSanitizer
                settings={{
                  html,
                  handleClick: navigate,
                }}
              >
                {html}
              </HtmlSanitizer>
            </div>
          </PlaceholderParagraph>
        </div>
      )}
    </SurroundPortals>
  );
}

Description.propTypes = {
  html: PropTypes.string,
  navigate: PropTypes.func,
};

Description.defaultProps = {
  html: null,
  navigate: () => { },
};

export default connect(Description);
