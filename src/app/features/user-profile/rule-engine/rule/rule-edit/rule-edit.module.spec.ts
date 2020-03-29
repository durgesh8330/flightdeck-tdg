import { RuleEditModule } from './rule-edit.module';

describe('RuleEditModule', () => {
  let ruleEditModule: RuleEditModule;

  beforeEach(() => {
    ruleEditModule = new RuleEditModule();
  });

  it('should create an instance', () => {
    expect(ruleEditModule).toBeTruthy();
  });
});
