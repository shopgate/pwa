const mocks = require('./mockedRelations');

module.exports = async (context, { relations }) => {
  if (!context.config.mocks.enabled) {
    return { relations };
  }

  return {
    relations: mocks.relations,
  };
};
