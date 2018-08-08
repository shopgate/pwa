import I18nProvider from './components/I18nProvider';
import Placeholder from './components/Placeholder';
import Translate from './components/Translate';
import FormatDate from './components/FormatDate';
import FormatTime from './components/FormatTime';
import FormatPrice from './components/FormatPrice';
import FormatNumber from './components/FormatNumber';

export default {
  Provider: I18nProvider,
  Text: Translate,
  Date: FormatDate,
  Time: FormatTime,
  Placeholder,
  Price: FormatPrice,
  Number: FormatNumber,
};
