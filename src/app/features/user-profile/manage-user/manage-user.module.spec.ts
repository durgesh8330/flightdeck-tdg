import { ManageUserModule } from './manage-user.module';

describe('ManageUserModule', () => {
  let manageUserModule: ManageUserModule;

  beforeEach(() => {
    manageUserModule = new ManageUserModule();
  });

  it('should create an instance', () => {
    expect(manageUserModule).toBeTruthy();
  });
});
