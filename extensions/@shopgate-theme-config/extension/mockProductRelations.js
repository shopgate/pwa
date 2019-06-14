const { relations } = require('./mockedRelations');

module.exports = async (context) => {
  if (!context.config.enableMocks) {
    return { relations: [] };
  }

  return {
    relations,
  };
};
