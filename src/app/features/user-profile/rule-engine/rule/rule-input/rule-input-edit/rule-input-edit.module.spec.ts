import { RuleInputEditModule } from './rule-input-edit.module';

describe('RuleInputEditModule', () => {
  let ruleInputEditModule: RuleInputEditModule;

  beforeEach(() => {
    ruleInputEditModule = new RuleInputEditModule();
  });

  it('should create an instance', () => {
    expect(ruleInputEditModule).toBeTruthy();
  });
});
