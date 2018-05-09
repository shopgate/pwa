import pipelineBuffer from '../PipelineBuffer';

const pipelineName = 'TestPipeline';
const dependant = 'testDependant';

describe('PipelineBuffer', () => {
  describe('set()', () => {
    it('should throw for none string pipeline name', (done) => {
      try {
        pipelineBuffer.set(123);
        done('Did not throw!');
      } catch (e) {
        expect(e.message).toEqual('Expected string for \'pipelineName\'. Received: \'number\'');
        done();
      }
    });

    it('should throw for no dependant is set', (done) => {
      try {
        pipelineBuffer.set(pipelineName);
        done('Did not throw!');
      } catch (e) {
        expect(e.message).toEqual('No dependant was set!');
        done();
      }
    });

    it('should throw for no dependant is not string or array', (done) => {
      try {
        pipelineBuffer.set(pipelineName, { some: 'value' });
        done('Did not throw!');
      } catch (e) {
        expect(e.message).toEqual('Expected string or array for \'dependant\'. Received: \'object\'');
        done();
      }
    });

    it('should add a new dependant', () => {
      pipelineBuffer.set(pipelineName, dependant);
      const pbuffer = pipelineBuffer.get(pipelineName);
      expect(pbuffer.includes(dependant)).toEqual(true);
    });
  });

  describe('get()', () => {
    it('should throw for none string pipeline name', (done) => {
      try {
        pipelineBuffer.get(123);
        done('Did not throw!');
      } catch (e) {
        expect(e.message).toEqual('Expected string for \'pipelineName\'. Received: \'number\'');
        done();
      }
    });

    it('should have two dependants', () => {
      pipelineBuffer.set(pipelineName, dependant);
      const pbuffer = pipelineBuffer.get(pipelineName);
      expect(pbuffer.includes(dependant)).toEqual(true);
      expect(pbuffer.length).toEqual(2);
    });

    it('should return an empty array if no result found.', () => {
      const pbuffer = pipelineBuffer.get('somethingWeird');
      expect(Array.isArray(pbuffer)).toEqual(true);
      expect(pbuffer.length).toEqual(0);
    });
  });
});
