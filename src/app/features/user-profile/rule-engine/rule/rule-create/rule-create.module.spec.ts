import { RuleCreateModule } from './rule-create.module';

describe('RuleCreateModule', () => {
  let ruleCreateModule: RuleCreateModule;

  beforeEach(() => {
    ruleCreateModule = new RuleCreateModule();
  });

  it('should create an instance', () => {
    expect(ruleCreateModule).toBeTruthy();
  });
});
