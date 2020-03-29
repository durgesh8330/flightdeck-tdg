import { TaskRoutingModule } from './task-routing.module';

describe('TaskRoutingModule', () => {
  let taskRoutingModule: TaskRoutingModule;

  beforeEach(() => {
    taskRoutingModule = new TaskRoutingModule();
  });

  it('should create an instance', () => {
    expect(taskRoutingModule).toBeTruthy();
  });
});
