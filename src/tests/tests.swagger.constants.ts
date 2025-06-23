export const TestSwaggerDocs = {
  create: {
    summary: 'Create a new test',
    bodyType: 'CreateTestDto',
    responses: {
      201: { description: 'Test successfully created', type: 'Test' },
    },
  },

  findAll: {
    summary: 'Get all tests',
    responses: {
      200: { description: 'List of tests', type: 'Test[]' },
    },
  },

  findOne: {
    summary: 'Get test by ID',
    param: { name: 'id', description: 'UUID of the test' },
    responses: {
      200: { description: 'Test found', type: 'Test' },
      404: { description: 'Test not found' },
    },
  },

  update: {
    summary: 'Update a test',
    param: { name: 'id', description: 'UUID of the test to update' },
    bodyType: 'UpdateTestDto',
    responses: {
      200: { description: 'Test updated', type: 'Test' },
      404: { description: 'Test not found' },
    },
  },

  remove: {
    summary: 'Delete a test',
    param: { name: 'id', description: 'UUID of the test to delete' },
    responses: {
      204: { description: 'Test deleted successfully' },
      404: { description: 'Test not found' },
    },
  },
};
