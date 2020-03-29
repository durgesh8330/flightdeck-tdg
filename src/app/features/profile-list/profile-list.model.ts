

export class Application {
  applicationName: string;
}

export class TaskType {
  taskName: string;
}

export class WorkgroupList {
  workgroupName: string;
}

export class SkillList {
  skillName: string;
}

export class FieldList {
  label: string;
  fieldName: string;
  fieldValue: string;
  editable: boolean;
  mandatory: boolean;
  type: string;
  dropdownList: string[];
  service: string;
}

export class TaskFieldList {
  header: string;
  fieldList: FieldList[];
}

export class WorkmateTask {
  appTaskInstanceId: string;
  taskInstDesc: string;
  application: Application;
  sourceSystem: string;
  escalated: boolean;
  taskStatus: string;
  taskInstNotes: string;
  claimId: string;
  taskType: TaskType;
  workgroupList: WorkgroupList[];
  skillList: SkillList[];
  createdById: string;
  taskFieldList: TaskFieldList[];
}
export class RoleModel{
  id:string;
  isEditing:boolean;
  roleName:string;
  accessName:string;
  accessValue:string;
  accessModule:string;
  isSameRoleData:boolean;
  accessList:RoleModel[];
  isNewRole:boolean;
}
export class ProfileModel {
  id:string;
  appName:string;
  workgroupName:string;
  workgroupDesc:string;
  createdById:string;
  modifiedById:string;
  createdDateTime:string;
  modifiedDateTime:string;
  roleList:RoleModel[];
  isRowDetailOpen:boolean;
  isIconMinus:boolean;
  isEditing:boolean;
  isNewAppNAmeWorkgroup:boolean;
  workGroupList:RoleModel[];
}