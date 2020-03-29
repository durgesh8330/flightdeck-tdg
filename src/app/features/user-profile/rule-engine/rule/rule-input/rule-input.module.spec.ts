import { RuleInputModule } from './rule-input.module';

describe('RuleInputModule', () => {
  let ruleInputModule: RuleInputModule;

  beforeEach(() => {
    ruleInputModule = new RuleInputModule();
  });

  it('should create an instance', () => {
    expect(ruleInputModule).toBeTruthy();
  });
});
