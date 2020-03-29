import { RuleImportModule } from './rule-import.module';

describe('RuleImportModule', () => {
  let ruleImportModule: RuleImportModule;

  beforeEach(() => {
    ruleImportModule = new RuleImportModule();
  });

  it('should create an instance', () => {
    expect(ruleImportModule).toBeTruthy();
  });
});
