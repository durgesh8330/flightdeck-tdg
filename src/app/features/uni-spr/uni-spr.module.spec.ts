import { UniSprModule } from './uni-spr.module';

describe('UniSprModule', () => {
  let uniSprModule: UniSprModule;

  beforeEach(() => {
    uniSprModule = new UniSprModule();
  });

  it('should create an instance', () => {
    expect(uniSprModule).toBeTruthy();
  });
});
