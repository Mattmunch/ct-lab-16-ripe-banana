const Reviewer = require('./Reviewer');
describe('Reviewer model', () => {
  it('requires a name', () => {
    const reviewer = new Reviewer({
      company:'some place'
    });
    const { errors } = reviewer.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });
  it('requires a company', () => {
    const reviewer = new Reviewer({
      name:'some place'
    });
    const { errors } = reviewer.validateSync();
    expect(errors.company.message).toEqual('Path `company` is required.');
  });
})
;
