import { WorkmateTaskModule } from './workmate-task.module';

describe('WorkmateTaskModule', () => {
  let workmateTaskModule: WorkmateTaskModule;

  beforeEach(() => {
    workmateTaskModule = new WorkmateTaskModule();
  });

  it('should create an instance', () => {
    expect(workmateTaskModule).toBeTruthy();
  });
});
