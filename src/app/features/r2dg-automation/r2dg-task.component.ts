import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { Tab } from '@app/core/tab/tab.model';
import { TaskDetailsComponent } from '../task/task-details/task-details.component';
import { TabService } from '@app/core/tab/tab-service';
import { R2DGService } from './r2dg.service';
import { elementEventFullName } from '@angular/core/src/view';

@Component({
  selector: 'sa-r2dg-task',
  templateUrl: './r2dg-task.component.html',
  styleUrls: ['./r2dg-task.component.css']
})
export class R2DGTaskComponent implements OnInit {
  public loader = false;
  public taskDetails: any = {};
  public taskDetailsBackup: any = {};
  header: string;
  label: string;
  fieldName: string;
  fieldValue: string;
  editable: false;
  mandatory: false;
  isReadOnly: boolean = false;
  type: string;
  fieldsData: any = {};
  data: any = {};
  userInfo: any;
  displayTaskDetails: boolean = false;
  options: any;
  pageLayout: any = {};
  Jsondata: any = {};
  IsShowData = false;
  SearchTaskId = '';
  modelValue: any = [];
  OrderValue: any = [];
  PPOrPIValue: any = [];
  loadDataValue: boolean = false;
  IsSucess: boolean = false;
  IsError: boolean = false;
  message: any;
  clearForm: Boolean = false;
  shownotepad: true;
  ShowInputFilter = false;
  SubmitButtonDisabled = false;
  PId = "";
  PidLabel = "";

  constructor(
    private workMateService: R2DGService,
    private tabService: TabService) { }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('fd_user'));
    this.options = {
      multiple: false,
      tags: true
    };
    this.loader = true;
    //  this.workMateService.getResource('../../assets/api/pagelayouts/R2GCreatetask.json').toPromise().then(data => {

    this.workMateService.getPageLevelTemplate('R2DG Create Task').toPromise().then((data) => {
      //console.log('template data ', data);
      this.pageLayout = data;
      this.loader = false;
      this.loadModuleData();
    }).catch((err) => {
      console.log(err);
      this.loader = false;
    });
    //console.log(this.Jsondata);
  }

  loadModuleData() {
    this.loadDataValue = true;
    this.modelValue = [];
    this.pageLayout.pageLayoutTemplate.forEach(element => {
      if (element.sectionHeader == 'Form') {
        element.body.forEach(list => {
          list.fieldsList.forEach(list1 => {
            this.modelValue.push({ label: list1.label, value: '', header: list.childSectionHeader });
          });
        });
      }
    });

    this.modelValue.map((ele) => {
      if (ele.label == 'Originator CUID') {
        ele.value = this.userInfo['cuid'];
        this.isReadOnly = true;
      } else if (ele.label == 'Primary Contact Details') {
        ele.value = this.userInfo['firstName'] + " " + this.userInfo['lastName'];
      }
      else {
        this.isReadOnly = false;
      }
    });
    //console.log('Model data ' + JSON.stringify(this.modelValue));
  }

  selectedCurrentVersion(value) {
    //console.log(value);
  }

  reset() {
    this.SearchTaskId = '';
    this.PPOrPIValue = '';
    this.OrderValue = '';
    this.PidLabel = '';
    this.modelValue.map((ele) => {
      ele.value = '';
      if (ele.label == 'Originator CUID') {
        ele.value = this.userInfo['cuid'];
      } else if (ele.label == 'Primary Contact Details') {
        ele.value = this.userInfo['firstName'] + " " + this.userInfo['lastName'];
      }
    });
    this.clearForm = true;
  }

  submitData() {
    var order = "";
    this.loader = true;
    this.SubmitButtonDisabled = true;
    let taskInstParamRequests = [];
    const fieldsList = this.pageLayout.pageLayoutTemplate[0].body;
    this.modelValue.forEach(element => {
      const PLFieldData = fieldsList.filter((x) => x.childSectionHeader == element.header);
      var ObjectData = PLFieldData[0].fieldsList.filter((x) => x.label == element.label);
      if (ObjectData.length > 0) {
        if (ObjectData[0].mandatory == true && element.value == '') {
          this.SubmitButtonDisabled = false;
          this.loader = false;
          return false;
        }
      }
    });
    if (!this.loader) {
      return false;
    }
    this.modelValue.forEach((element) => {
      //console.log(element.label + "="+ element.value);
      if (element.label == "Order Type" && element.value == "Q Wave- Optical Wavelength Service") {
        element.value = "Optical Wavelength Service";
      } else if (element.label == "Bandwidth" && element.value == "2.5 GIG(OC-48)") {
        element.value = "OC-48";
      }
      if (element.label != "Order Number") {
        taskInstParamRequests.push({
          "name": element.label,
          "value": element.value
        });
      } else {
        order = element.value;
      }
    });
    taskInstParamRequests.push({
      "name": this.PidLabel,
      "value": this.PPOrPIValue
    })
    let obj1 = {
      orderId: order, sourceSystemName: 'FLIGHTDECK',
      taskInstDesc: 'This is a task that generates AutoPilot Automation for processing Dark Green orders from a Red Swift Order', taskType: { taskName: 'R2DG Automation' }, createdById: this.userInfo['cuid'], taskInstParamRequests: taskInstParamRequests
    }

    //console.log("submitted R2DG data " + JSON.stringify(obj1));
    this.workMateService.taskCreateSubmit(obj1).toPromise().then(data => {
      this.displayTaskDetails = true;
      this.IsSucess = true
      this.loader = false;
      setTimeout(() => {
        this.IsSucess = false;
      }, 7000);
      this.SubmitButtonDisabled = false;
      this.message = data['message'];
      this.modelValue.forEach((element) => {
        if (element.label == "Order Type" && element.value == "Optical Wavelength Service") {
          element.value = "Q Wave- Optical Wavelength Service";
        } else if (element.label == "Bandwidth" && element.value == "OC-48") {
          element.value = "2.5 GIG(OC-48)";
        }
      });
      this.workMateService.getTaskDetailsByTaskId(data['id']).toPromise().then(data => {
        const tab: Tab = new Tab(TaskDetailsComponent, 'Task : ' + data['sourceTaskId'], 'TaskDetailsComponent', data);
        this.tabService.openTab(tab);
      }).catch(err => {
        this.displayTaskDetails = true;
        this.IsSucess = false;
        this.message = err.message;
        this.IsError = true;
        setTimeout(() => {
          this.IsError = false;
        }, 7000);
      });
    }).catch(error => {
      console.log('error response data ' + error);
      this.loader = false;
      this.SubmitButtonDisabled = false;
      this.displayTaskDetails = true;
      this.message = error.message;
      this.IsError = true;
      this.modelValue.forEach((element) => {
        if (element.label == "Order Type" && element.value == "Optical Wavelength Service") {
          element.value = "Q Wave- Optical Wavelength Service";
        } else if (element.label == "Bandwidth" && element.value == "OC-48") {
          element.value = "2.5 GIG(OC-48)";
        }
      });
      setTimeout(() => {
        this.IsError = false;
      }, 7000);
    });
  }
  fetchOrderDataAndFillForm() {
    this.loader = true;
    this.displayTaskDetails = true;
    //this.workMateService.getResource('../../assets/api/swift/response_1572479330544.json').toPromise().then(data => {
    this.workMateService.getSwiftOrderDetailsFromMediation(this.OrderValue).toPromise().then(data => {
      this.loader = false;
      this.resetR2DgFrom();
      this.fillDefaultDropDown();
      this.isPpOrPi(data);
      this.populateTheForm(data);
    }).catch(error => {
      console.log('Error in fetchOrderDataAndFillForm : ' + JSON.stringify(error));
      console.log('Error : ' + error);

      this.loader = false;
      this.displayTaskDetails = true;
      if (error && error.error && error.error.exception.message && error.error.exception.detail) {
        this.message = error.error.exception.message + error.error.exception.detail;
      } else {
        this.message = 'Oops ! Something went wrong with AutoFill, Please Try to Fill it Manually'
      }
      this.IsSucess = false;
      this.IsError = true
      setTimeout(() => {
        this.IsError = false;
      }, 7000);
    });
  }

  populateTheForm(data) {
    this.findAndFill('Order Number', data['transactionId']);
    this.findFromOrderDetails(data);
  }

  fillDefaultDropDown() {
    this.pageLayout.pageLayoutTemplate.forEach(element => {
      if (element.sectionHeader == 'Form') {
        element.body.forEach((list: any) => {
          list.fieldsList.forEach((list1: any) => {
            if (list1.label == "Order Type") {
              this.modelValue.forEach((modelItem: any) => {
                if (modelItem.label == "Order Type") {
                  modelItem.value = list1.dropdownList.length > 0 ? list1.dropdownList[0] : "";
                }
              });
            }
            if (list1.label == "Hand Off Type") {
              this.modelValue.forEach((modelItem: any) => {
                if (modelItem.label == "Hand Off Type") {
                  list1.dataSource.forEach((dataItem: any) => {
                    if (dataItem.toUpperCase().includes('SMF SC') == true) {
                      modelItem.value = list1.dataSource.length > 0 ? list1.dataSource[0] : "";
                    }
                  });
                }
              });
            }
          });
        });
      }
    });
  }

  findAndFill(fieldlabel: String, fieldvalue: String) {
    this.modelValue.map((ele) => {
      if (ele.label == fieldlabel && fieldvalue) {
        ele.value = fieldvalue;
      }
    })
  }
  findFromOrderDetails(data) {

    //Order Contacts
    data.orderContacts && data.orderContacts.forEach(element => {
      if (element.roles && element.roles.includes('Customer Care Manager')) {
        this.findAndFill('CCM Name', element.firstName + ' ' + element.lastName);
        this.findAndFill('CCM Email Address', element.emailAddress);
        this.findAndFill('CCM Number', element.id);

      }
      if (element.roles && element.roles.includes('Local Contact - Primary') || element.roles.includes('A End Local Contact - Primary')) {
        this.findAndFill('Primary Contact FirstName', element.firstName);
        this.findAndFill('Primary Contact LastName', element.lastName);
        this.findAndFill('Primary Contact Number', element.phoneNumber);
        this.findAndFill('Primary Contact Email', element.emailAddress);
      }

    });
    // OffNetSolutions
    data.offnetSolutions && data.offnetSolutions.forEach(element => {
      if (element.solution && element.solution.rocInformation && element.solution.rocInformation.recommendedBid && element.solution.rocInformation.recommendedBid.vendorComments) {
        this.findAndFill('Vendor Comments', element.solution.rocInformation.recommendedBid.vendorComments);
        if (element.solution.rocInformation.recommendedBid.vendorComments.includes("CNDC")) {
          var cndc = element.solution.rocInformation.recommendedBid.vendorComments.split(" ");
          this.findAndFill('CNDC', cndc[1]);
        }
      }
      if (element.solution && element.solution.rocInformation && element.solution.rocInformation.recommendedBid && element.solution.rocInformation.recommendedBid.portSpeed) {
        this.findAndFill('Port Speed', element.solution.rocInformation.recommendedBid.portSpeed);
      }
    });

    //Customer Info
    data.product.attributes && data.product.attributes.productPackages.forEach(element => {
      if (element.productPackageId && element.productPackageId == this.PId) {
        this.findAndFill('Company Name', element.customer.customerName);

        element.serviceAddresses && element.serviceAddresses.productServiceAddressTree.forEach(i => {
          if (i.productPackageId && i.productPackageId == this.PId && i.relationshipName == "Address1") {
            this.findAndFill('Customer PON', i.productPackageId + i.serviceAddress.endUserClli.substring(0, 4) + "W");
            //Location Info A End
            this.findAndFill('A End Street Address', i.serviceAddress.postalAddress.streetNumber + " " + i.serviceAddress.postalAddress.streetName + " " + i.serviceAddress.postalAddress.thoroughfare);
            this.findAndFill('A End City', i.serviceAddress.postalAddress.city);
            this.findAndFill('A End State', i.serviceAddress.postalAddress.stateProvinceCode);
            this.findAndFill('A End Postal Code', i.serviceAddress.postalAddress.postalZipCode);
            this.findAndFill('A End CLLI', i.serviceAddress.endUserClli);
          }

          if (i.productPackageId && i.productPackageId == this.PId && i.relationshipName == "Address2") {
            //Location Info Z End
            this.findAndFill('Z End Street Address', i.serviceAddress.postalAddress.streetNumber + " " + i.serviceAddress.postalAddress.streetName + " " + i.serviceAddress.postalAddress.thoroughfare);
            this.findAndFill('Z End City', i.serviceAddress.postalAddress.city);
            this.findAndFill('Z End State', i.serviceAddress.postalAddress.stateProvinceCode);
            this.findAndFill('Z End Postal Code', i.serviceAddress.postalAddress.postalZipCode);
            this.findAndFill('Z End CLLI', i.serviceAddress.endUserClli);
          }

        });

        //Roc ID and Service Term
        //Rock ID will only be populated if its a Off net
        element.products && element.products.productTree.forEach(pt => {
          if (pt.productPackageId && pt.productPackageId == this.PId && pt.productAttributes) {
            pt.productAttributes.productAttributeTree && pt.productAttributes.productAttributeTree.forEach(at => {
              if (at.attributeName == "Term") {
                this.findAndFill('Service Term', at.attributeValue);
              } else if (at.attributeName == "Auto ROC ID") {
                this.findAndFill('ROCID', at.attributeValue);
              }
            });
          }

          //
          if (pt.productPackageId && pt.productPackageId == this.PId && pt.priceInfoTree && pt.priceInfoTree.priceDetails) {
            pt.priceInfoTree.priceDetails.priceDetails.forEach(bd => {
              if (bd.description.includes("Bandwidth")) {
                var bandwidth = bd.description.split("=")[1].trim();
                console.log('Bandwidth : ' + bandwidth);
                this.fillBandwidth(bandwidth);
              } else if (bd.description.includes("AMS Solution Id")) {
                var amsSolutionId = bd.description.split("=")[1].trim();
                this.findAndFill('AMS Quote ID', amsSolutionId);
              }
            });
          }
          //
        });
      }
    });
  }

  addBreak() {
    return true;
  }

  /* if user selected Product Instance Id or Product Package Id , if user is sumbitting
   ProductInstance Id then we filter & indentify Product Package Id related to it , which will be use
   to populate the form .
   */
  isPpOrPi(data) {
    if (!this.ShowInputFilter) {
      data.product.attributes && data.product.attributes.productPackages.forEach(element => {
        element.products && element.products.productTree.forEach(pt => {
          if (pt.gpid && pt.gpid == this.PPOrPIValue) {
            console.log('Product Name for Given Product Instance Id : ' + pt.gpid + ' is ' + pt.productName);
            this.PId = pt.productPackageId;
          }
        });
      });
      this.PidLabel = 'Service/Circuit ID';
    } else {
      this.PId = this.PPOrPIValue;
      this.PidLabel = 'Product/PSP ID';
    }
  }

  resetR2DgFrom() {
    this.PId = '';
    this.modelValue.map((ele) => {
      ele.value = '';
      if (ele.label == 'Originator CUID') {
        ele.value = this.userInfo['cuid'];
      } else if (ele.label == 'Primary Contact Details') {
        ele.value = this.userInfo['firstName'] + " " + this.userInfo['lastName'];
      }
    });
  }

  fillBandwidth(bd) {
    this.pageLayout.pageLayoutTemplate.forEach(element => {
      if (element.sectionHeader == 'Form') {
        element.body.forEach((list: any) => {
          list.fieldsList.forEach((list1: any) => {
            if (list1.label == "Bandwidth") {
              this.modelValue.forEach((modelItem: any) => {
                if (modelItem.label == "Bandwidth" && list1.dataSource.length > 0 && (list1.dataSource.includes(bd) || bd == "OC-48" || bd == "GIG-E")) {
                  console.log("Inside :" + bd)
                  if (bd == "GIG-E") {
                    modelItem.value = "1GIG-E";
                  } else if (bd == "OC-48") {
                    modelItem.value = "2.5 GIG(OC-48)";
                  } else {
                    modelItem.value = bd;
                  }
                }
              });
            }
          });
        })
      }
    });
  }
}
