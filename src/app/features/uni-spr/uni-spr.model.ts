

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

export class UniSpr {
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
