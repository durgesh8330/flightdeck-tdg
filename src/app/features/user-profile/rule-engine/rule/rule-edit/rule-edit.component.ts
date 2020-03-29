import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from "@angular/forms/src/forms";
import { Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { ProcessComponent } from '../../shared/process';
import { RuleInputService } from '../rule-input/rule-input.service';
import { forkJoin } from 'rxjs';
import { ResponseContentType } from '@angular/http';
import { ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import { RuleService } from '../../shared/services/rule/rule.service';
import { TabService } from '@app/core/tab/tab-service';
import { FilterService } from '../../shared/services/rule/filter.service';
import { Tab } from '@app/core/tab/tab.model';
import { RuleCreateEditComponent } from './rule-create-edit.component';


@Component({
  selector: 'sa-rule-edit',
  templateUrl: './rule-edit.component.html',
  styleUrls: ['./rule-edit.component.css']
})
export class RuleEditComponent implements OnInit ,ProcessComponent {


  @Input() processData: any;
  ruleName: string;
  getNextRules: any[];
  displayResults: boolean;
  loader: boolean = false;
  @Input() data: any;
  public config1 : ToasterConfig = new ToasterConfig({
    positionClass: 'toast-top-full-width',
    animation: 'fade',
    timeout: 10000
  });
  
  constructor(private ruleService: RuleService, 
    public router: Router, private tabService: TabService,
     private filterService: FilterService,
      private ruleInputService: RuleInputService, 
      private toasterService: ToasterService) {
        console.log("in rule edit constructor");
       }

  ngOnInit() {
  }

  search() {
    this.loader = true;
    this.ruleService.findRule(this.ruleName).toPromise().then((response: any) => {
      console.log("response...." + response['message'][0]);
      this.getNextRules = response['message'];
      this.displayResults = true;
      this.loader = false;
    },
      error => {
        let errorMessage = error.error;
        this.loader = false;
        this.toasterService.pop('error', errorMessage['code'], errorMessage['message']);
      });

  }
  onClear() {
    this.loader = true;
    this.ruleName = "";
    this.loader = false;
  }

  onView(res,e : Event) {
    let uuid = UUID.UUID();
    this.ruleService.setRuleData(uuid, res);
    forkJoin([this.filterService.getResourceFields(), 
      this.filterService.getTaskFields(), 
      this.ruleInputService.getAllRuleInputs()]).toPromise().then(results => {
      let tab = new Tab(RuleCreateEditComponent, "Rule:" + res.ruleName, 'edit', { 'availResourceFilter': results[0], 'availTaskFilter': results[1], 'availableRuleInputs': results[2]['message'], 'tabId': Tab.totalTabs, 'uuid': uuid, 'readOnly': true });
      this.tabService.openTab(tab);
    }
    );
  }

  public onEdit(res) {
    let result2 = [{
              "id": "5b055aac5cfc074ce0be7dff",
              "name": "Skill Level",
              "description": "This input determines the skill level for task that a resource has a skill for and rates the task higher if the user is higher skill level.",
              "type": null,
              "script": "int score = 0;\nif ( domain.task.isNull(\"skillList\" ) || domain.resource.isNull (\"resourceSkills\"))\n{\n  return score;\n}\ndef resourceSkills = domain.resource.resourceSkills;\ndef taskSkills = domain.task.skillList;\nprintln(\" TASK SKILL \" + taskSkills);\nif (taskSkills != null && resourceSkills!=null)\n{\n  for (int i=0; i<taskSkills.length();i++)\n  {\n    def taskSkill = taskSkills.get(i); \n    for (int j =0; j<resourceSkills.length(); j++)\n    {\n       def resourceSkill = resourceSkills.get(j);\n       if (taskSkill.skillName == resourceSkill.skillName)\n       {\n          score += getSkillLevelPoints(resourceSkill.expertiseLevel);\n          break;\n       }\n    }\n  }\n  return score;\n}\n\n\ndef getSkillLevelPoints (def resourceSkillLevel)\n{\n  def levels = decisionTable.get(\"Level\");\n  def result = decisionTable.get(\"Results\");\n  for (int i=0; i<levels.size (); i++)\n  {\n    Double level = new Double (levels.get(i));\n    if (level == resourceSkillLevel)\n    { \n      println (\"level Matched\" + level); \n      return Integer.parseInt (result.get(i));\n\n    }\n  }\n    return 0;\n}\n",
              "headings": [{
                      "value": "Level"
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": "10"
                      }, {
                          "value": "1000"
                      }
                  ], [{
                          "value": "9"
                      }, {
                          "value": "900"
                      }
                  ], [{
                          "value": "8"
                      }, {
                          "value": "800"
                      }
                  ], [{
                          "value": "7"
                      }, {
                          "value": "700"
                      }
                  ], [{
                          "value": "6"
                      }, {
                          "value": "600"
                      }
                  ], [{
                          "value": "5"
                      }, {
                          "value": "500"
                      }
                  ], [{
                          "value": "4"
                      }, {
                          "value": "400"
                      }
                  ], [{
                          "value": "3"
                      }, {
                          "value": "300"
                      }
                  ], [{
                          "value": "2"
                      }, {
                          "value": "200"
                      }
                  ], [{
                          "value": "1"
                      }, {
                          "value": "100"
                      }
                  ], [{
                          "value": "0"
                      }, {
                          "value": "0"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5b0d612d5cfc0723986770a5",
              "name": "Task Duration",
              "description": "This input determines the duration of each task (how old it is) and returns a score for each task with the oldest task having the highest score.",
              "type": null,
              "script": "def taskCreatedDate = domain.task.createdDateTime.time;\nprintln (taskCreatedDate);\ndef currentTime = new Date (); \nlong difference = (currentTime.getTime()/1000) - domain.task.createdDateTime.time;\nprintln difference/1000;\nreturn difference;",
              "headings": null,
              "data": null,
              "inputWeightage": 0
          }, {
              "id": "5be0187d327e300001a5ded0",
              "name": "test",
              "description": "test sample",
              "type": null,
              "script": "int a = 2000;\n      ",
              "headings": [{
                      "value": ""
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": "test"
                      }, {
                          "value": "test"
                      }
                  ], [{
                          "value": "test"
                      }, {
                          "value": ""
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5bfe6d40e659170001f7fe93",
              "name": "ruleinput11281",
              "description": "demo",
              "type": null,
              "script": "return 220;\n      ",
              "headings": [{
                      "value": "Header1"
                  }, {
                      "value": "Header2"
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": "10"
                      }, {
                          "value": "100"
                      }, {
                          "value": "110"
                      }
                  ], [{
                          "value": "20"
                      }, {
                          "value": "200"
                      }, {
                          "value": "220"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5c35c7b0da24a60764ca627e",
              "name": "kkadali-ruleInput",
              "description": "task type for auto",
              "type": null,
              "script": "return true;",
              "headings": [{
                      "value": "priority"
                  }, {
                      "value": "paramType"
                  }, {
                      "value": "Operand"
                  }, {
                      "value": "paramValue"
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": "1"
                      }, {
                          "value": "taskType"
                      }, {
                          "value": "contains"
                      }, {
                          "value": "autoagent"
                      }, {
                          "value": "http://google.com"
                      }
                  ], [{
                          "value": "1"
                      }, {
                          "value": "taskType"
                      }, {
                          "value": "contains"
                      }, {
                          "value": "autoagent_"
                      }, {
                          "value": "http://google.com"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5c4b0b06ebc5b70001622496",
              "name": "BPMS-TASKTYPES",
              "description": "BPMS-TASKTYPES",
              "type": null,
              "script": "Boolean validTaskType = false;\n\nif(domain.bpmsTaskRule == null || domain.bpmsTaskRule.taskType == null){\n  return validTaskType;\n}\n\nString tasktype = domain.bpmsTaskRule.taskType;\nprintln \"taskType is....\"+tasktype;\n\nvalidTaskType = getTaskTypeValidity(tasktype);\nreturn validTaskType;\n\ndef getTaskTypeValidity(String taskType)\n{\n  def taskTypes = decisionTable.get(\"taskType\");\n  def result = decisionTable.get(\"Results\");\n  for (int i=0; i<taskTypes.size (); i++)\n  {\n    String taskName = taskTypes.get(i);\n    if(taskType !=null && taskType.equals(taskName)){\n      println(\"taskName:\"+taskName+\", enabled:\"+result.get(i));\n      String value = result.get(i);\n      if(value.equals(\"true\")){\n        return true;\n      }else{\n        return false;\n      }\n    }\n    \n  }\n    return false;\n}",
              "headings": [{
                      "value": "taskType"
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": "CreateASR"
                      }, {
                          "value": "true"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5c4b0c91ebc5b70001ee7287",
              "name": "BPMS-PERFORMERS",
              "description": "BPMS-PERFORMERS",
              "type": null,
              "script": "Boolean validPerformer = false;\nif(domain.bpmsTaskRule == null || domain.bpmsTaskRule.performer == null){\n  return validPerformer;\n}\n\nString performer = domain.bpmsTaskRule.performer;\nvalidPerformer = getPerformerValidity(performer);\n\nreturn validPerformer;\n\n\ndef getPerformerValidity(String performer)\n{\n  def performers = decisionTable.get(\"performer\");\n  def result = decisionTable.get(\"Results\");\n  for (int i=0; i<performers.size (); i++)\n  {\n    String performedBy = performers.get(i);\n    if(performer !=null && performer.equals(performedBy)){\n    \n      println(\"Performer:\"+performer+\", enabled:\"+result.get(i));\n      String value = result.get(i);\n      if(value.equals(\"true\")){\n        return true;\n      }else{\n        return false;\n      }\n      \n    }\n    \n  }\n    return false;\n} ",
              "headings": [{
                      "value": "performer"
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": "ext_automation_oc_autopilot"
                      }, {
                          "value": "true"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5d4c0d91036de0e3d0019a4f",
              "name": "MyTestRuleInputForWorkMate001",
              "description": "Added Test",
              "type": null,
              "script": "def i=10;",
              "headings": [{
                      "value": "Key"
                  }, {
                      "value": "Value"
                  }
              ],
              "data": [[{
                          "value": "Priority"
                      }, {
                          "value": "High"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5d52b3fee5db31d4e494b1f9",
              "name": "Test Rule Input 1",
              "description": "test rule input",
              "type": null,
              "script": "def i =1;",
              "headings": [{
                      "value": "priority"
                  }, {
                      "value": "value"
                  }
              ],
              "data": [[{
                          "value": "1"
                      }, {
                          "value": "20"
                      }
                  ], [{
                          "value": "2"
                      }, {
                          "value": "40"
                      }
                  ], [{
                          "value": "3"
                      }, {
                          "value": "60"
                      }
                  ], [{
                          "value": "4"
                      }, {
                          "value": "80"
                      }
                  ], [{
                          "value": "5"
                      }, {
                          "value": "100"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5d53ba51e5db31d4e494b218",
              "name": "",
              "description": "",
              "type": null,
              "script": "def a = 10;",
              "headings": null,
              "data": null,
              "inputWeightage": 0
          }, {
              "id": "5d67ad8fda3cbb0514b634df",
              "name": "TestRuleInputForOmniVue",
              "description": "Test OmniVue",
              "type": null,
              "script": "def taskInstanceParamsList = [];\nInteger val=0;\ntaskInstanceParamsList = domain.task.taskInstParamRequests;\nfor(def i=0;i< taskInstanceParamsList.length();i++) {\n  def taskInstanceParam =  taskInstanceParamsList.get(i);\n  def paramName = taskInstanceParam.name;\n  def paramValue = taskInstanceParam.value;\n  if(paramName == \"COMMITDATE\") {\n    def commitDate = new Date().parse('MM-dd-yy', paramValue);\n    def currentDate = new Date();\n    Integer difference = (currentDate.getTime() - commitDate.getTime())/(1000*60*60*24);\n    return getCommitDateLevel(difference);\n  } else {\n   return 0; \n  }\n}\n\ndef getCommitDateLevel (def difference)\n{ def levels = decisionTable.get(\"Level\");\n  def result = decisionTable.get(\"Results\");\n  for (int i=0; i<levels.size (); i++) {  \n     Double level = new Double(levels.get(i));\n\t if (level == difference){\n\t\tprintln (\"level Matched\" + level);\n\t\treturn Integer.parseInt(result.get(i));\n       \n     }\n   }\n}",
              "headings": [{
                      "value": "Level"
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": "0"
                      }, {
                          "value": "1000"
                      }
                  ], [{
                          "value": "1"
                      }, {
                          "value": "950"
                      }
                  ], [{
                          "value": "2"
                      }, {
                          "value": "900"
                      }
                  ], [{
                          "value": "3"
                      }, {
                          "value": "850"
                      }
                  ], [{
                          "value": "4"
                      }, {
                          "value": "800"
                      }
                  ], [{
                          "value": "5"
                      }, {
                          "value": "750"
                      }
                  ], [{
                          "value": "6"
                      }, {
                          "value": "700"
                      }
                  ], [{
                          "value": "7"
                      }, {
                          "value": "650"
                      }
                  ], [{
                          "value": "8"
                      }, {
                          "value": "600"
                      }
                  ], [{
                          "value": "9"
                      }, {
                          "value": "550"
                      }
                  ], [{
                          "value": "10"
                      }, {
                          "value": "500"
                      }
                  ], [{
                          "value": "11"
                      }, {
                          "value": "450"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5d6f6801da3cbb0fe841a150",
              "name": "CommitDateRuleInput",
              "description": "",
              "type": null,
              "script": "def taskInstanceParamsList = [];\nInteger val=0;\ntaskInstanceParamsList = domain.task.taskInstParamRequests;\nif(domain.task.isNull(\"taskInstParamRequests\")) {\n  println (\"level Not Matched \");\n return 0;\n} else {\n  \n  for(def i=0;i< taskInstanceParamsList.length();i++) {\n    def taskInstanceParam =  taskInstanceParamsList.get(i);\n    def paramName = taskInstanceParam.name;\n    def paramValue = taskInstanceParam.value;\n    if(paramName == \"COMMITDATE\") {\n      def commitDate = new Date().parse('MM-dd-yy', paramValue);\n      def currentDate = new Date();\n      Integer difference = (currentDate.getTime() - commitDate.getTime())/(1000*60*60*24);\n      return getCommitDateLevel(difference);\n    } else {\n     return 0; \n    }\n  }\n}\ndef getCommitDateLevel (def difference)\n{ def levels = decisionTable.get(\"Level\");\n  def result = decisionTable.get(\"Results\");\n  for (int i=0; i<levels.size (); i++) {  \n     Double level = new Double(levels.get(i));\n\t if (level == difference){\n\t\tprintln (\"level Matched\" + level);\n\t\treturn Integer.parseInt(result.get(i));\n       \n     }\n   }\n}   ",
              "headings": [{
                      "value": "Level"
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": "0"
                      }, {
                          "value": "1000"
                      }
                  ], [{
                          "value": "1"
                      }, {
                          "value": "950"
                      }
                  ], [{
                          "value": "2"
                      }, {
                          "value": "900"
                      }
                  ], [{
                          "value": "3"
                      }, {
                          "value": "850"
                      }
                  ], [{
                          "value": "4"
                      }, {
                          "value": "800"
                      }
                  ], [{
                          "value": "5"
                      }, {
                          "value": "750"
                      }
                  ], [{
                          "value": "6"
                      }, {
                          "value": "700"
                      }
                  ], [{
                          "value": "7"
                      }, {
                          "value": "650"
                      }
                  ], [{
                          "value": "8"
                      }, {
                          "value": "600"
                      }
                  ], [{
                          "value": "9"
                      }, {
                          "value": "550"
                      }
                  ], [{
                          "value": "10"
                      }, {
                          "value": "500"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5d6f6ebada3cbbbb14f3e099",
              "name": "CreatedDateRuleInput",
              "description": "",
              "type": null,
              "script": "\nif(domain.task.isNull(\"createdDtTm\")) {\n  println(\"Created Date time is null\");\n  return 0;\n} else {\n   \n def createdDate = new Date().parse('yyyy-MM-dd H:m:s', domain.task.createdDtTm);\n \n def commitDate = new Date();\n Integer difference = (commitDate - createdDate) / (1000*60*60*24);\n\n return getCreatedDateLevel(difference);\n}\ndef getCreatedDateLevel (def difference)\n{ def levels = decisionTable.get(\"Level\");\n  def result = decisionTable.get(\"Results\");\n  for (int i=0; i<levels.size (); i++) {  \n     Double level = new Double(levels.get(i));\n\t if (level == difference){\n\t\tprintln (\"level Matched\" + level);\n\t\treturn Integer.parseInt(result.get(i));\n       \n     }\n   }\n}     ",
              "headings": [{
                      "value": "Level"
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": "0"
                      }, {
                          "value": "100"
                      }
                  ], [{
                          "value": "1"
                      }, {
                          "value": "150"
                      }
                  ], [{
                          "value": "2"
                      }, {
                          "value": "200"
                      }
                  ], [{
                          "value": "3"
                      }, {
                          "value": "250"
                      }
                  ], [{
                          "value": "4"
                      }, {
                          "value": "300"
                      }
                  ], [{
                          "value": "5"
                      }, {
                          "value": "350"
                      }
                  ], [{
                          "value": "6"
                      }, {
                          "value": "400"
                      }
                  ], [{
                          "value": "7"
                      }, {
                          "value": "450"
                      }
                  ], [{
                          "value": "8"
                      }, {
                          "value": "500"
                      }
                  ], [{
                          "value": "9"
                      }, {
                          "value": "550"
                      }
                  ], [{
                          "value": "10"
                      }, {
                          "value": "600"
                      }
                  ], [{
                          "value": "11"
                      }, {
                          "value": "650"
                      }
                  ], [{
                          "value": "12"
                      }, {
                          "value": "700"
                      }
                  ], [{
                          "value": "13"
                      }, {
                          "value": "750"
                      }
                  ], [{
                          "value": "14"
                      }, {
                          "value": "800"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5d6f9180e5db3196e4c5a929",
              "name": "test1",
              "description": "sample",
              "type": null,
              "script": "int a = 100;\n      ",
              "headings": [{
                      "value": ""
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": "test "
                      }, {
                          "value": "1234"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5d6f92b9e5db3196e4c5a934",
              "name": "test3",
              "description": "sample",
              "type": null,
              "script": "int i =20;",
              "headings": [{
                      "value": ""
                  }, {
                      "value": ""
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": ""
                      }, {
                          "value": "test3"
                      }, {
                          "value": ""
                      }
                  ], [{
                          "value": ""
                      }, {
                          "value": "test4"
                      }, {
                          "value": ""
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5d6f93e8e5db3196e4c5a942",
              "name": "test4",
              "description": "test4",
              "type": null,
              "script": "int x=100;\n      ",
              "headings": [{
                      "value": ""
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": "test4"
                      }, {
                          "value": ""
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5d6f9b3ae5db3196e4c5a991",
              "name": "test5",
              "description": "",
              "type": null,
              "script": "int x=10;\n      ",
              "headings": [{
                      "value": ""
                  }, {
                      "value": ""
                  }, {
                      "value": "Results"
                  }
              ],
              "data": [[{
                          "value": ""
                      }, {
                          "value": "asd"
                      }, {
                          "value": "asd"
                      }
                  ], [{
                          "value": "asd"
                      }, {
                          "value": "asd"
                      }, {
                          "value": "asd"
                      }
                  ]],
              "inputWeightage": 0
          }, {
              "id": "5d6f9caee5db3196e4c5a9a5",
              "name": "test6",
              "description": "",
              "type": null,
              "script": "int x=100;",
              "headings": null,
              "data": null,
              "inputWeightage": 0
          }, {
              "id": "5d6f9d40e5db3196e4c5a9a8",
              "name": "test7",
              "description": "",
              "type": null,
              "script": "int x =90;\n      ",
              "headings": null,
              "data": null,
              "inputWeightage": 0
          }
      ];
      let result0 = [{"fieldName":"createdDateTime","fieldLabel":"Created Date","fieldValue":null,"fieldType":"date","optionsList":null,"operator":null,"fieldDataType":null},{"fieldName":"resourceCuid","fieldLabel":"Resource CUID","fieldValue":null,"fieldType":"textBox","optionsList":null,"operator":null,"fieldDataType":null},{"fieldName":"resourceName","fieldLabel":"Resource Name","fieldValue":null,"fieldType":"textBox","optionsList":null,"operator":null,"fieldDataType":null},{"fieldName":"resourceSkills.skillName","fieldLabel":"Skills List","fieldValue":null,"fieldType":"selectBox","optionsList":["G-FAST","test","GPON","Alternate Equipment Build","Nano Tech","nosql","Auto Test 5","GPON Device Build","Test","Ethernet","Skill1","MongoDB","Auto Test 2"],"operator":null,"fieldDataType":null},{"fieldName":"resourceWorkGroups.workGroupName","fieldLabel":"Workgroups List","fieldValue":null,"fieldType":"selectBox","optionsList":["WCM_workgroup","WG1012","SM-DOCS","WorkGroupForAutoPilot","ASP","CDP","NST"],"operator":null,"fieldDataType":null}];
      let result1 = [{"fieldName":"createdDateTime.time","fieldLabel":"Created Date","fieldValue":null,"fieldType":"date","optionsList":null,"operator":null,"fieldDataType":null},{"fieldName":"escalated","fieldLabel":"Escalated Flag","fieldValue":null,"fieldType":null,"optionsList":["true","false"],"operator":null,"fieldDataType":"boolean"},{"fieldName":"skillList.skillName","fieldLabel":"Skills List","fieldValue":null,"fieldType":"selectBox","optionsList":["Java","G-FAST","test","DEVICE","GPON","Alternate Equipment Build","Nano Tech","nosql","Angular2","Auto Test 5","GPON Device Build","Test","Ethernet","Skill1","GPON-1","GPON-2","MongoDB","Auto Test 2"],"operator":null,"fieldDataType":null},{"fieldName":"sourceSystem","fieldLabel":"Source System","fieldValue":null,"fieldType":"selectBox","optionsList":["HOOVER","DSP","AUTOPILOT","OMNIVue","OMNIVUE","970","553","string"],"operator":null,"fieldDataType":"string"},{"fieldName":"taskStatus","fieldLabel":"Task Status","fieldValue":null,"fieldType":"selectBox","optionsList":["Assigned","Ready","string","Completed","Cancelled","hello","Planned","Open","Created"],"operator":null,"fieldDataType":"string"},{"fieldName":"taskType.taskName","fieldLabel":"Task Type List","fieldValue":null,"fieldType":"selectBox","optionsList":["Create FiberLink Fallout","Remote Access Authentication","Define Route","Disconnect for HotCut","Identify ONT Fallout","Offnet Ethernet Bearer Fallout","StructureLoaderForAddSecondHSIICLCreateService","EOCU/EODS1 Fallout","Infrastructure Uni Activation Task","Supervised Auto-Activation","LMOS TT Task","DeaactiveOrderInCBRASforIMPROV","Create HSI Fallout","MYNAH Script Fallout Task","Manual fallout for select subscriber","UNI-N/ENNI Change and Activation","cpgPortAssignFalloutTask","Select Location","ServiceManualActivationAndProvisioning","Device re-routing rule missing fallout task","Offnet Information Missing","CE Activation Fallout Task -- Implementation","PortAssignmentFailure","ManagementCircuitFalloutTask","Device Test and Turn Up","RFS Date","RuleTest9","Update IP Address","TierCheckFalloutTask","RequestBuilldingLoc","Revert IPTV Manual Task","CancelL1InfraOrderForRevertedDevice","DeactiveOrderInEMS/CMS","Manual task SLA breach for PRISM","H.S.I. CBRAS Martens error","Confirm Inventory Speed Change","EVC/OVC Change and Activation","SuspendorRestoreUpdateInventoryFallout","ASP_Task","ISATActivationForCTLON","Manual task SLA breach for NEWHSI","ASP","ManualActivationAndProvisioning","ResubmitDeviceBuildTask","Update EVC COS ID","UpdateL1InventoryForRevertedDeviceBuild","EVC Due Date Jeopardy Task","ISAT Activation Fallout Task","GPON PRISM Activation","CE SUPP Request For EVC-OVC","In Service UNI/ENNI Activation Request","Activation Fallout Task -- Ordering","Create Gateway NMI/Ethernet Bearer","Automated Hot Cut","DeactivateCustomerService","Structure Loader ICL manual falloutReserveResource","Device Build Launch Notification Task","Resource Order Request (ROR) Cancel","Structure Loader ICL Create IPTV manual fallout task","ASR Stored Sup Review","OFFNET Device Build Launch Notification Task","Disconnect CE OFFNET Infrastructure Manual Task","Structure Loader ICL A&D AddIPTVToHSI  fallout task","Device Management Script","Change EVC-OVC Cancel Task","OLT Can Not Support Service","OffnetCreateInternalOVCManualTask","Update Inv disconnect From Location","SAT Fallout Handling-Other","New Task for HSI Service Feasability Validator","Update Inv-Disconnect Location For IPTV","Port Assignment Failure","EOCU/EODS1 Port Assignment Failure","MynahSubProcessFalloutTask","OFFNET Transport Test","Supervised Activation Review","Add UNI-ENNI Cancel Task","Manual task invalid state for CHANGEHSI","Meetpoint EVC Inventory Fallout Task","EVC/OVC Disconnect","Manually Select Subscriber","MynahSubProcess Fallout","ISAT Activation For Default Change","UpdateInventoryForCancelOfInstall","Supervised Disconnect Review","ArmorStatusNotificationProcess Fallout","Assign And Design For To Location","ENNI LAG Install Activation","Manual task invalid state for NEWHSI","SupervisedManualDeactivationUNITask","Change UNI-ENNI Cancel Task","Unit Mapping Failure","VDSL2 Port Assignment Failure","disconnect_hsi_service","Structure Loader ICL manual fallout task IPTV","PTAP Error Fallout Task","Structure Loader Create HSI fallout task IPTV","Busy Affiliate VLAN","CE Activation Fallout Task -- Ordering","HSI/HIS+IPTV Supp-Manual fallout","Create ONT","Update L1 Inventory For UNIENNI","ICLUpdateServiceFailure","EquipmentBuildProcess-Main Fallout","Invalid Fields","Notification to IMPROV Failure","ASR Stored Completion Attempt","Create OVC VLAN Association Fallout","EVC/OVC Install and Activation","Device Discovery Fallout Task","Manual inventory change","Cancel Device Build Elements in TIRKS","Identify And Assign CTag","Restore Inventory for Cancel","Design and assign HSI service fallout","Cancel Device Build Elements in the Network","Incorrect or Missing Platform ID","Location Test","Activation Fallout Task -- Customer Provisioning","Structure Loader ICL manual falloutForCPELocation","Activation Fallout Task -- Other Errors","Review CEBF","Re-Identify Device for Order","GPON HSI Service Activation","SelectRORLocation","CreateBlackboxForCEOffnetTask","Select Dispatch For Offnet","Set Up CEBF","ASP-1","IMPROV Integration fallout task","NPEPortPrepFalloutTask","CE Activation Fallout Task -- Infrastructure Provisioning","Identify Device for Order","Initiate Manual SAT For New UNI  Installs","UpdateInventoryManualTask","Affiliate Meetpoint Identification Task","EnterSLATemplateName","Manually Design And Assign Fallout Task","Out of Bandwidth Capacity","DSP Service Order Fallout Task","Supervised Hot Cut","Identify Service Area Terminal","Out of Port Capacity","VerifyL1Completion","SuspendorRestoreISATFallout","SLA Template Select Task","Create Subscriber and/or Location in CLC Fallout","Update Inventory For Default Change","Define PON Route","Clean up Network in Inventory Fallout","Structure Loader Create IPTV fallout task IPTV","SupervisedManualActivationTask","Create PON Fallout","DesignAndAssignHSIServicefallout","Manually Select Location","Supervised Auto Deactivation/Activation task","Disconnect UNI-ENNI Cancel Task","LATA Update","Structure Loader ICL manual falloutForCreateHSI","Manual provisioning Set Port Status","Create Subscriber Location in CLC Fallout","Not Enough Bandwidth on the NMI to Support Request Manual Task","Cleanup Network Inventory","Manual Port Assignment Fallout Manual Task","Assign and Design For Remove IPTV","Add EVC-OVC Cancel Task","MLTO Dispatch Successful, Cancel MLTO","CE SUPP Request For UNI-ENNI","Splitter Out Of Capacity","UNI-N/ENNI Disconnect","Manual Task Ready For Service notification","StructureLoaderForAddSecondHSIICLReserveResourceTask","DSL-OVC Activation Fallout","Manual Jeopardy Task","Update SFP on Port","Activation Fallout Task -- Implementation","SAT Fallout Handling-Incomplete","Supervised Bandwidth Change Task","SUPP Request","SupervisedManualDeActivationTask","MEF SLA Fallout Task","ENNI LAG Activation","DGWFallout","H.S.I. CBRAS Ensemble error","Change and Activate with Hotcut","Supervised Activation","Build PROBE UNI","ALU7750 BRAS Configuration","Re-Route CEBF Parent Task","UNI-N/ENNI Validation Error Fallout Manual Task","Assign and Design for Default Change","Manually create location","Create BRIX Device","Activation Fallout Task -- Infrastructure Provisioning","Structure Loader ICL manual fallout task","Re-Route Set Up CEBF","Retrieve Cancelled Device","UNI/ENNI Activation","AssociateLocalEVCFalloutTask","Supervised Review Task For CGE","Supervised EVC/OVC  Member Change  Activation Task","CE-VLAN/S-VLAN ASSIGNMENT MANUAL TASK","MgmtEvcFalloutTask","Men Id Not Found","ONT Out Of Capacity"],"operator":null,"fieldDataType":null},{"fieldName":"workgroupList.workgroupName","fieldLabel":"Workgroups List","fieldValue":null,"fieldType":"selectBox","optionsList":["GPON Inventory","CDP-North - Escalation","WCM workgroup","GPON PRISM Activation-NCNVFL","RPA- CREATE SUBSCRIBER AND/OR LOCATION IN CLC","workgroup-1","CDP","WCM_workgroup","Pending ARMOR-LQ","CDP-North","NPT","GPON PRISM Activation-AL","CDP-South","DSC","LDP","WorkGroupForAutoPilot","Pending Market Unit","GPON Activation-RCMAC","ASP","RPA- UNI/ENNI VALIDATION","GPON PRISM Activation- MO WI","WG1012","Workshare-ASP","CDPN-Affiliate","GPON HSI Activation","GPON HSI Provisioning","SM-DOCS","Workshare-DSC","NST","Pend ARMOR-Affiliate","Pending ARMOR","H.S.I. MARTENS CBRAS","MDW Support","Address Management","IT Fallout","GPON PRISM Provisioning","H.S.I. ENSEMBLE CBRAS","Dispatch Administration","DSC-Affiliate","GPON Provisioning","NIT Infra Special Projects","FRUG"],"operator":null,"fieldDataType":null}]
    console.log('this is on edit button');
    let uuid = UUID.UUID();
    this.ruleService.setRuleData(uuid, res);
    forkJoin([this.filterService.getResourceFields(),
       this.filterService.getTaskFields(), 
       this.ruleInputService.getAllRuleInputs()]).toPromise().then(results => {
      let tab = new Tab(RuleCreateEditComponent, "Rule:" + res.ruleName, 
      'Edit Rule', { 'availResourceFilter': results[0], 'availTaskFilter': results[1], 
      'availableRuleInputs': results[2]['message'], 'tabId': Tab.totalTabs, 'uuid': uuid, 'readOnly': false });
      this.tabService.openTab(tab);
    }
    );
  }


  downloadFile(data) {
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = "rule.zip";
    link.click();
  }
  onExport(res) {
    let uuid = UUID.UUID();
    this.ruleService.setRuleData(uuid, res);
    return this.ruleService.exportRule(res.ruleName).subscribe(result => {
      
      this.downloadFile(result);
    }
      , error => { });
  }
}
