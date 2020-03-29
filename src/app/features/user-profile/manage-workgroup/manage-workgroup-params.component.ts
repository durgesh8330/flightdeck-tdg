import {ActivityLogService} from './../../activity-log/activity-log.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {UserProfileService} from '../user-profile.service';
import {AddAttributeDialog} from './add-attribute-modal/add-attribute-modal.component';
import * as _ from 'lodash';
import {NotificationService} from '@app/core/services';

@Component({
  selector: 'sa-manage-workgroup-params',
  templateUrl: './manage-workgroup-params.component.html',
  styleUrls: ['./manage-workgroup-params.component.scss']
})
export class ManageWorkgroupParameters implements OnInit {
  allWorkgroupRoutingAttributes: any = [];
  attributeTemplate: any = {};
  originalData: any = {}; // original template data from API
  public data = _.cloneDeep(this.originalData); // template data we refer on UI
  originalRoutingParametersData: any = {}; // original form data from API
  routingParametersData: any; // data we refer in ui (to bind the values)
  isSaving = false;

  @Input('tabData') tab: any;
  @Output() closeTab: any = new EventEmitter();
  @Output() onError: any = new EventEmitter();
  @Output() onSuccess: any = new EventEmitter();
  @Output() closeTabFromCancel: any = new EventEmitter();
  constructor(
    private userProfileService: UserProfileService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activityLogService: ActivityLogService,
    public notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.isSaving = false;
    // Call the page layout API to get the layout of the tab
    this.userProfileService
      .getWorkGroupRoutingParametersLayout()
      .toPromise()
      .then((response: any) => {
        // THE JSON WILL COME HERE

      
        this.originalData = response ? response.pageLayoutTemplate.pageLayoutTemplate : {};
        this.attributeTemplate = _.cloneDeep(this.getAttributeFromOriginalTemplate());
        this.data = _.cloneDeep(this.originalData);
        
        
        this.userProfileService
          .getWorkGroupRoutingParameters(this.tab.workgroupName)
          .toPromise()
          .then((data: any) => {
            // append data to the originalData
            this.originalRoutingParametersData = data;

            this.routingParametersData = _.cloneDeep(
              this.originalRoutingParametersData
            );
            const attrTemplates = [];
            _.forEach(
              this.routingParametersData[this.attributeTemplate.fieldName],
              (data: any) => {
                const newAttributeTemplate =  _.cloneDeep(
                  this.attributeTemplate[this.attributeTemplate.fieldName][0]
                );
                // create new attribute template and push it to the list
                attrTemplates.push(
                 {...newAttributeTemplate, fieldLabel: data[newAttributeTemplate.fieldLabelName]}
                );
              }
            );
            const attr = this.getAttributeFromOriginalTemplate();
            attr[this.attributeTemplate.fieldName].length = 0;
            attr[this.attributeTemplate.fieldName] = attrTemplates;
            this.data = _.cloneDeep(this.originalData);
            
            // get all routing attrs list
            this.userProfileService
              .getAllWorkgroupRoutingAttrs(this.tab.workgroupName)
              .toPromise()
              .then((data: any) => {
                this.allWorkgroupRoutingAttributes = data;
              });
          });
      })
      .catch(error => this.onError.emit(error.error.message));
  }

  saveRoutingAttributes() {
    const userData = localStorage.getItem('fd_user');
    
    if(userData) {
      try {
        const parsedData = JSON.parse(userData);
        const userId = parsedData && parsedData.cuid;
        if(userId && this.routingParametersData) {
          const wgRoutingattributesassigned =  _.map(
            this.routingParametersData.routingAttributes,
             (attr: any) => {
               return { 
                 routingParameterName: attr.title,
                 routingParameterValues: attr.assignedRoutingParams
              }
          });
          const data = {
            name: this.tab.workgroupName,
            autoResourseRouting: this.routingParametersData.autoResourseRouting,
            allTaskByOrder: this.routingParametersData.allTaskByOrder,
            createdById: userId,
            modifiedById: userId,
            wgRoutingattributesassigned
          }
        this.isSaving = true;
          this.userProfileService.saveWorkgroupRoutingAttributes(data).toPromise().then((data: any) => {
            console.log("data from response:", data);
            // close the tab
            _.map(
              this.routingParametersData.routingAttributes,
               (attr: any) => {
                attr.isSaved=true;
            });
           this.onSuccess.emit('Workgroup Parameter Updated Successfully');
           this.ngOnInit();
            // this.closeForm();
          }).catch((error: any) => {
            this.isSaving = false;
            this.onError.emit('Error saving attributes, please try again');
          })

        }
      }catch(error) {
        console.error('Error parsing fd_user token from localStorage');
        // TODO - maybe show error message? not sure
      }
    }
    
  }

  getRoutingAttributes() {
    if (this.routingParametersData) {
      return this.routingParametersData.routingAttributes;
    }
    return [];
  }

  // from left to right (assigned to unassigned)
  onSingleSelectAppList(attribute, aIndex) {
    const {
      leftListSelectedItems = [],
      leftListFieldName = '',
      rightListFieldName = '',
      rightListSelectedItems = []
    } = attribute;
    const attributes = this.getRoutingAttributes();
    const attr = attributes[aIndex];
    let leftListItems = [];
    let rightListItems = [];
    if (attr) {
      leftListItems = attr[leftListFieldName];
      rightListItems = attr[rightListFieldName];
    }

    if (rightListSelectedItems && rightListSelectedItems.length > 0) {
      rightListSelectedItems.map((item, index) => {
        leftListItems.splice(leftListItems.indexOf(item), 1);
        rightListItems.push(item);
      });
      rightListSelectedItems.length = 0;
      leftListSelectedItems.length = 0;
    }
  }

  // from right to left (unassigned to assigned)
  onSingleUnSelectAppList(attribute, aIndex) {
    const {
      leftListSelectedItems = [],
      leftListFieldName = '',
      rightListFieldName = '',
      rightListSelectedItems = []
    } = attribute;
    const attributes = this.getRoutingAttributes();
    const attr = attributes[aIndex];
    
    let leftListItems = [];
    let rightListItems = [];
    if (attr) {
      leftListItems = attr[leftListFieldName];
      rightListItems = attr[rightListFieldName];
    }
    
    if (leftListSelectedItems && leftListSelectedItems.length > 0) {
      leftListSelectedItems.map((item, index) => {
        rightListItems.splice(rightListItems.indexOf(item), 1);
        leftListItems.push(item);
      });
      rightListSelectedItems.length = 0;
      leftListSelectedItems.length = 0;
    }
  }
  getAttributeFromTemplate() {
    console.log(this.data);
    console.log(this.data.fieldList);
    return _.find(
      this.data && this.data.fieldList,
      (f: any) => f.fieldType === 'attributes'
    );
  }
  getAttributeFromOriginalTemplate() {
    return _.find(
      this.data && this.originalData.fieldList,
      (f: any) => f.fieldType === 'attributes'
    );
  }

  removeAttribute({fieldLabel}, OnCreate) {
    const attributeField = this.getAttributeFromTemplate();
    console.log(attributeField);
    const dataAttributes = this.getRoutingAttributes();
    console.log(dataAttributes);
    const wgRoutingattributesassigned =  _.filter(
      attributeField.routingAttributes,
       (attr: any) => {
         return { 
          fieldLabel: fieldLabel,
           isSaved: false
        }
    });
    console.log(wgRoutingattributesassigned);
    // return false;
    if(OnCreate){
      console.log('if');
      // return false;
      if (attributeField) {
        _.remove(
          attributeField.routingAttributes,
          (attribute: any) => {
            return ( attribute.fieldLabel === fieldLabel);
          }
        );
      }
      if (dataAttributes) {
        _.remove(dataAttributes, (attribute: any) => {
          return (attribute.title === fieldLabel);
        });
      }
    }else{
      // console.log('else');
      // return false;
    this.userProfileService
    .deleteWorkgroupAttribute(this.tab.workgroupName, fieldLabel)
    .toPromise()
    .then((data: any) => {
      // delete it from the UI
   
    if (attributeField) {
      _.remove(
        attributeField.routingAttributes,
        (attribute: any) => {
          return ( attribute.fieldLabel === fieldLabel);
        }
      );
    }
    if (dataAttributes) {
      _.remove(dataAttributes, (attribute: any) => {
        return (attribute.title === fieldLabel);
      });
    }
      this.onSuccess.emit(`${fieldLabel || 'Attribute'} Deleted Successfully`);
    })
    .catch((error: any) => {
      // show error
      this.onError.emit('Something went wrong while deleting this attribute');
    })
  }
    
  }

  addAttribute(modalData) {
    // call API to fetch attribute list then open dialog
    const dialogRef: any = this.dialog.open(AddAttributeDialog, {
      width: 'auto',
      data: {
        ...modalData,
        dropdownList: this.allWorkgroupRoutingAttributes[modalData.fieldName]
      }
    });

    dialogRef.componentInstance.onAttributeAdded &&
      dialogRef.componentInstance.onAttributeAdded.subscribe(({result, modalData}) => {
        // get the attribute data from the back end
        this.userProfileService
          .getWorkgroupAttributeData(result)
          .toPromise()
          .then((data: any) => {
            console.log("dataqwe:", data);
            // Now we have the list to render in the assigned section of each new attribute
            // construct new attribute object and append it on the attributes array
            const attributeTemplate = this.getAttributeFromTemplate();
            const attributeField = _.cloneDeep(this.attributeTemplate);

            attributeField.routingAttributes[0]['OnCreate'] = true;
            const newAttrObj = this.createNewAttributeTemplate(
              data,
              attributeField.routingAttributes[0]
            );
            const newAttrData = this.createNewAttrData(data, newAttrObj);

            if (attributeField && attributeTemplate) {
              newAttrObj && attributeTemplate.routingAttributes.push(newAttrObj);
              if (this.routingParametersData) {
                newAttrData &&
                  this.routingParametersData[attributeField.fieldName].push(
                    newAttrData
                  );
              }
            }
          })
          .catch((error: any) => {
            this.onError.emit(error.error.message);
          });
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);
    });
  }
  readyToClose() {
    return  this.isSaving || _.isEqual(this.routingParametersData, this.originalRoutingParametersData);
  }
  showConfirmPopup(callback: any) {
    this.notificationService.smartMessageBox(
      {
        title:
          "<i class='fa fa-sign-out txt-color-orangeDark'></i> Close the tab <span class='txt-color-orangeDark'><strong>" +
          '</strong></span> ?',
        content: 'You will loose all the changes you made in this form. Continue?',
        buttons: '[No][Yes]'
      },
      ButtonPressed => {
        if (ButtonPressed == 'Yes') {
          callback(true);
        }
      }
    );
  }

  closeForm() {
    this.closeTab.emit();
  }

  closeFormCancel() {
    this.closeTabFromCancel.emit();
  }

  clickAction(fieldLabel: string = '', data: any, index: number, OnCreate: any) {
    console.log(fieldLabel, data, OnCreate);
    // return false;
    switch (fieldLabel.toLowerCase()) {
      case 'save':
        return this.saveRoutingAttributes();
      case 'cancel':
        return this.closeFormCancel();
      case 'add_attribute':
        return this.addAttribute(data);
      case 'delete_attribute':
        return this.removeAttribute(data, OnCreate);
      case 'select_items':
        // return this.onSingleSelectAppList(data, index);
        return this.onSingleUnSelectAppList(data, index);
      case 'de_select_items':
        // return this.onSingleUnSelectAppList(data, index);
        return this.onSingleSelectAppList(data, index);
      default:
        return;
    }
  }

  createNewAttributeTemplate(
    {systemParameter, systemParamterItem},
    existingRoutingAttr
  ) {
    if (existingRoutingAttr && systemParamterItem.length) {
      const {
        fieldLabelName,
        leftListLabel,
        rightListLabel,
        leftListFieldName,
        rightListFieldName,
        fieldType,
        iconClass,
        clickAction,
        actions
      } = existingRoutingAttr;
      return {
        fieldLabel: systemParameter,
        fieldLabelName,
        fieldType,
        leftListLabel,
        rightListLabel,
        leftListFieldName,
        rightListFieldName,
        // leftListItems: values,
        lefListSelectedItems: [],
        // rightListItems: [],
        rightListSelectedItems: [],
        deletable: true,
        iconClass,
        clickAction,
        class: existingRoutingAttr.class,
        actions,
        isSaved:false,
        OnCreate: true
      };
    }
  }
  createNewAttrData({systemParameter, systemParamterItem}, newAttrTemplate) {
    // if (newAttrTemplate && systemParamterItem.length) {
      
      if (newAttrTemplate && systemParamterItem.length) {
      const {leftListFieldName, rightListFieldName} = newAttrTemplate;
      return {
        title: systemParameter,
        [leftListFieldName]:[],
        [rightListFieldName]:systemParamterItem
      };
    }
  }

  CheckCreateNewobj(data) {
    // console.log(data[0].);
    Object.keys((data)).forEach(element => {
      console.log(element);
    });
    // if (data[0].OnCreate == undefined) {
    //   console.log(false);
    //   return false;
    // } else {
    //   console.log(true);
    //   return true;
    // }
  }
}
