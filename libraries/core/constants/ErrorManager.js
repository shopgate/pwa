export const DEFAULT_CONTEXT = '*';
export const SOURCE_APP = 'app';
export const SOURCE_PIPELINE = 'pipeline';
export const SOURCE_TRACKING = 'tracking';
export const SOURCE_CONSOLE = 'console';

export const CODE_TRACKING = 'ETRACKING';

export const Severity = {
  Fatal: Symbol('fatal'),
  Error: Symbol('error'),
  Critical: Symbol('critical'),
  Warning: Symbol('warning'),
  Info: Symbol('info'),
  Debug: Symbol('debug'),
};

export const DEFAULT_SEVERITY = Severity.Error;
