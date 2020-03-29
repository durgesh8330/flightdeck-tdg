import { ProfileInfoModule } from './profile-info.module';

describe('ProfileInfoModule', () => {
  let profileInfoModule: ProfileInfoModule;

  beforeEach(() => {
    profileInfoModule = new ProfileInfoModule();
  });

  it('should create an instance', () => {
    expect(profileInfoModule).toBeTruthy();
  });
});
