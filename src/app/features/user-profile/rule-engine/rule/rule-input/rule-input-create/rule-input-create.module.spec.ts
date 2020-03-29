import { RuleInputCreateModule } from './rule-input-create.module';

describe('RuleInputCreateModule', () => {
  let ruleInputCreateModule: RuleInputCreateModule;

  beforeEach(() => {
    ruleInputCreateModule = new RuleInputCreateModule();
  });

  it('should create an instance', () => {
    expect(ruleInputCreateModule).toBeTruthy();
  });
});
