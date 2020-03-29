import { ProfileListModule } from './profile-list.module';

describe('WorkmateTaskModule', () => {
  let profileListModule: ProfileListModule;

  beforeEach(() => {
    profileListModule = new ProfileListModule();
  });

  it('should create an instance', () => {
    expect(profileListModule).toBeTruthy();
  });
});
