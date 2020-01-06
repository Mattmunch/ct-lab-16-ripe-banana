const Film = require('../models/Film');

describe('Film model', () => {
  it('requires a title', () => {
    const film = new Film({
      studio: 'sdfsodgsodifj',
      released: 1234,
      cast: [{
        role: 'jon smith',
        actor:'lsjhdglksjdlkfsdlfk'
      }]
    });
    const { errors } = film.validateSync();
    expect(errors.title.message).toEqual('Path `title` is required.');
  });
  it('requires a studio', () => {
    const film = new Film({
      title: 'things',
      released: 1234,
      cast: [{
        role: 'jon smith',
        actor:'lsjhdglksjdlkfsdlfk'
      }]
    
    });
    const { errors } = film.validateSync();
    expect(errors.studio.message).toEqual('Path `studio` is required.');
  });
  it('requires a released date', () => {
    const film = new Film({
      title: 'things',
      studio: 'sdfsodgsodifj',
      cast: [{
        role: 'jon smith',
        actor:'lsjhdglksjdlkfsdlfk'
      }]
    
    });
    const { errors } = film.validateSync();
    expect(errors.released.message).toEqual('Path `released` is required.');
  });
  it('requires a cast', () => {
    const film = new Film({
      title: 'things',
      studio: 'sdfsodgsodifj',
      released: 1234,
     
    
    });
    const { errors } = film.validateSync();
    expect(errors.cast.message).toEqual('Path `released` is required.');
  });
})
;
