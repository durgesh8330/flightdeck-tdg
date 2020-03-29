import { ManageUserRoutingModule } from './manage-user-routing.module';

describe('ManageUserRoutingModule', () => {
  let manageUserRoutingModule: ManageUserRoutingModule;

  beforeEach(() => {
    manageUserRoutingModule = new ManageUserRoutingModule();
  });

  it('should create an instance', () => {
    expect(manageUserRoutingModule).toBeTruthy();
  });
});
