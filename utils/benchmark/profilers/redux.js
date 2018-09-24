import Benchmark from '..';

export default () => next => (action) => {
  Benchmark.getKeyFigure('ActionCount').startMeasure(action.type);
  Benchmark.getKeyFigure('ActionTime').startMeasure(action.type);
  Benchmark.getKeyFigure('ActionEvents').startMeasure(action.type);
  const result = next(action);
  Benchmark.getKeyFigure('ActionEvents').stopMeasure(action.type);
  Benchmark.getKeyFigure('ActionTime').stopMeasure(action.type);
  Benchmark.getKeyFigure('ActionCount').stopMeasure(action.type);

  return result;
};
