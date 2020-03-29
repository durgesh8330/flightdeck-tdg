import { EvcModule } from './evc.module';

describe('EvcModule', () => {
  let evcModule: EvcModule;

  beforeEach(() => {
    evcModule = new EvcModule();
  });

  it('should create an instance', () => {
    expect(evcModule).toBeTruthy();
  });
});
