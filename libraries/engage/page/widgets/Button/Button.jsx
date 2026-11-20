import { useWidget } from '@shopgate/engage/page/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import WidgetButton from '../../components/WidgetButton';

const useStyles = makeStyles()(theme => ({
  root: {
    padding: theme.spacing(0, 2),
  },
}));

/**
 * The ButtonWidget is used to display a button.
 * @returns {JSX.Element}
 */
const ButtonWidget = () => {
  const { classes } = useStyles();

  const { config } = useWidget();
  const { text, link, buttonAlignment = 'center' } = config;

  if (!text) return null;

  return (
    <WidgetButton
      text={text}
      link={link}
      alignment={buttonAlignment}
      className={classes.root}
    />
  );
};

export default ButtonWidget;
