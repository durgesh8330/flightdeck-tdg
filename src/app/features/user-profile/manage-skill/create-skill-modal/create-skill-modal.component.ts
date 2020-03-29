import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { UserProfileService } from '../../user-profile.service';
import { SkillList } from '@app/features/uni-spr/uni-spr.model';
import { DataStorageService } from '@app/features/task/data-storage.service';

@Component({
  selector: 'sa-create-skill-modal',
  templateUrl: './create-skill-modal.component.html',
  styleUrls: ['./create-skill-modal.component.scss']
})
export class CreateSkillModalComponent implements OnInit {

  onCreateSkill = new EventEmitter();
  public workgroupSkillDataList = [];
  public uiObject:any = {}
  //   title:"Associate Workgroup Role Skill",
	// 	buttons: [			
	// 		{
	// 			label: "Assign Skill",
  //       style: "btn-success",
  //       type:'submit',
  //       name:"AssignSkill"
	// 		},
	// 		{
	// 			label: "Cancel",
  //       style: "tn-warning",
  //       type:"button",
  //       name:"Cancel"
	// 		}
  //   ],
  // fields:[
  //   {
  //     dataType: null,
  //     data:null,
  //     editable: false,
  //     fieldName: "SkillName",
  //     fieldValue: "",
  //     label: "Skill Name",
  //     mandatory: true,
  //     error:"Skill Name is required.",
  //     multiline: false,
  //     service: null,
  //     size: null,
  //     type: "select",
  //     visible: true,
  //   },
  // ]
  // }
  constructor(@Inject(MAT_DIALOG_DATA) public skill: skill_Dialog_Data, public userProfile:UserProfileService,
      private dataStorage: DataStorageService) { 
        this.uiObject = this.dataStorage.getAddSkillsFields();
  }
  
  ngOnInit() { 
    this.onGetAllSkillList();
  }
  onSelectedSkillValue(event){
    this.skill.skillName = event.target.value;
  }
  onButtonClick(actionName){
    switch(actionName){
      case "Cancel":
      this.closeModal();
      break;
      case "AssignSkill":
      this.createSkill();
      break;
    }
  }
  onGetAllSkillList(){
  this.userProfile.getAllSkillList().toPromise().then((response:any)=>{
    this.workgroupSkillDataList = response;
    if(this.skill.existingSkill){
      let existingskill = this.skill.existingSkill.map((item:any)=>{
          return item.skillName;
      });
      this.workgroupSkillDataList = response.filter(item=>{
        if(existingskill.indexOf(item) ==-1)
          return item;
      })
      this.uiObject.fields[0].data = this.workgroupSkillDataList;
    }
  })
}
  closeModal(){
    this.onCreateSkill.emit(this.skill);
  }

  createSkill(){
    this.skill.buttonClicked = 'createSkill';
    this.onCreateSkill.emit(this.skill);
  }

}

interface skill_Dialog_Data{
  skillName: string;
  desc: string;
  createdById: string;
  buttonClicked: string;
  existingSkill:[];
}
