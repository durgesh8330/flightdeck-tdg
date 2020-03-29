import { SmeTaskModule } from './sme-task.module';

describe('SmeTaskModule', () => {
  let smeTaskModule: SmeTaskModule;

  beforeEach(() => {
    smeTaskModule = new SmeTaskModule();
  });

  it('should create an instance', () => {
    expect(smeTaskModule).toBeTruthy();
  });
});
