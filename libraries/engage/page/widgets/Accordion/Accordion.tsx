import { useState } from 'react';
import { ChevronIcon } from '@shopgate/engage/components';
import { WidgetRichText } from '@shopgate/engage/page/components';
import { makeStyles } from '@shopgate/engage/styles';
import WidgetHeadline from '../../components/WidgetHeadline';
import { useAccordionWidget } from './hooks';

const TRANSITION = '250ms cubic-bezier(0.4, 0, 0.2, 1)';

const useStyles = makeStyles()(theme => ({
  root: {
    background: theme.palette.background.surface,
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  entry: {
    borderBottom: `1px solid ${theme.palette.background.emphasized}`,
  },
  heading: {
    margin: 0,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
    width: '100%',
    margin: 0,
    padding: theme.spacing(2),
    border: 0,
    background: 'none',
    color: theme.palette.text.primary,
    font: 'inherit',
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    textAlign: 'left',
    cursor: 'pointer',
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: -2,
    },
  },
  icon: {
    flexShrink: 0,
    transform: 'rotateZ(-90deg)',
    transition: `transform ${TRANSITION}`,
    '[aria-expanded="true"] > &': {
      transform: 'rotateZ(90deg)',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  panel: {
    display: 'grid',
    gridTemplateRows: '0fr',
    transition: `grid-template-rows ${TRANSITION}`,
    '&[data-open]': {
      gridTemplateRows: '1fr',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  panelInner: {
    overflow: 'hidden',
    minHeight: 0,
    visibility: 'hidden',
    transition: 'visibility 250ms',
    '[data-open] > &': {
      visibility: 'visible',
      transition: 'none',
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
  answer: {
    padding: theme.spacing(0, 2, 2),
  },
}));

/** The AccordionWidget shows questions whose answers open and close on tap. */
const Accordion = () => {
  const {
    code, headline, questionTag: QuestionTag, entries, initiallyOpen, allowMultipleOpen,
  } = useAccordionWidget();
  const { classes, cx, theme } = useStyles();
  const startEntries = initiallyOpen === 'first' ? [0] : [];
  const settingsKey = `${initiallyOpen}|${allowMultipleOpen}`;
  const [openEntries, setOpenEntries] = useState<number[]>(startEntries);
  const [openedWith, setOpenedWith] = useState(settingsKey);

  if (openedWith !== settingsKey) {
    setOpenedWith(settingsKey);
    setOpenEntries(startEntries);
  }

  if (!entries.length) return null;

  const toggle = (index: number) => setOpenEntries((current) => {
    if (current.includes(index)) return current.filter(open => open !== index);
    return allowMultipleOpen ? [...current, index] : [index];
  });

  return (
    <div className={cx(classes.root, 'widget__accordion')}>
      {headline ? <WidgetHeadline headline={headline} /> : null}
      <ul className={classes.list}>
        {entries.map((entry, index) => {
          const open = openEntries.includes(index);
          const buttonId = `widget-${code}-accordion-button-${index}`;
          const panelId = `widget-${code}-accordion-panel-${index}`;

          return (
            // eslint-disable-next-line react/no-array-index-key
            <li key={index} className={cx(classes.entry, 'widget__accordion__entry')}>
              <QuestionTag className={classes.heading}>
                <button
                  type="button"
                  id={buttonId}
                  className={cx(classes.button, 'widget__accordion__button')}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                >
                  <span>{entry.question}</span>
                  <ChevronIcon className={classes.icon} size={theme.components.icon.medium} />
                </button>
              </QuestionTag>
              <div
                className={cx(classes.panel, 'widget__accordion__panel')}
                data-open={open ? '' : undefined}
              >
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={classes.panelInner}
                >
                  <WidgetRichText
                    content={entry.answer}
                    className={cx(classes.answer, 'widget__accordion__answer')}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Accordion;
