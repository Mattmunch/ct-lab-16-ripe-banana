const Studio = require('./Studio');

describe('Studio model', () => {
  it('requires a name', () => {
    const studio = new Studio({
      address:'some place'
    });
    const { errors } = studio.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });
})
;
