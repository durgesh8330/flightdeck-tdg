import { LmosModule } from './lmos.module';

describe('LmosModule', () => {
  let lmosModule: LmosModule;

  beforeEach(() => {
    lmosModule = new LmosModule();
  });

  it('should create an instance', () => {
    expect(lmosModule).toBeTruthy();
  });
});
