import { DistributedRuleModule } from './distributed-rule.module';

describe('DistributedRuleModule', () => {
  let distributedRuleModule: DistributedRuleModule;

  beforeEach(() => {
    distributedRuleModule = new DistributedRuleModule();
  });

  it('should create an instance', () => {
    expect(distributedRuleModule).toBeTruthy();
  });
});
