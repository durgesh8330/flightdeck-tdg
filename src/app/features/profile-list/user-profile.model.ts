export class WorkgroupList {
  name: string;
  roles: string;
  accessList: string[];

}

export class ProfileAppsList {
  profileAppName: string;
  profileAppRole: string;
  appRoleList = [];
  workgroupList: WorkgroupList[];
  workgroupDropDownList= [];
  roleListDropDownList=[];
  accessListDropDownList = [];
  isEditing:boolean=false;
  isNewProfileApp:boolean = false;
}

export class UserProfile {
  userCuid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  managerId: string;
  department?: any;
  email: string;
  address?: any;
  phone: string;
  title?: any;
  userRole: string;
  profileAppsList: ProfileAppsList[];
  createdById: string;
  modifiedById: string;
  createdDateTime: string;
  modifiedDateTime: string;
  isEditing:boolean=false;
}
