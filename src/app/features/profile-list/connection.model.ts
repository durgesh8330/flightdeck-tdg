import { UserProfile } from '@app/features/profile-list/user-profile.model';
export class Connection {
  userCuid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  id?: number;
  managerId: string;
  department?: any;
  email: string;
  address?: any;
  phone: string;
  title?: any;
  userRole: string;
  profileAppsList?: any;
  createdById: string;
  modifiedById: string;
  createdDateTime: string;
  modifiedDateTime: string;
  collapsed: boolean;
  userProfile: UserProfile;
  isIconMinus:boolean;
  isEditing:boolean;
  isNewConnection:boolean=false;
}