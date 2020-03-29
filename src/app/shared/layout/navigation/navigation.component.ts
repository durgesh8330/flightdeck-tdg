import { Component, OnInit, Type, Output, EventEmitter, Input } from '@angular/core';
import { LayoutService } from '@app/core/services';
@Component({
  selector: 'sa-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  menuLevel = {
    LeftMenu_LMOS: '',
    LeftMenu_RCMAC: '',
    LeftMenu_Basic: '',
    LeftMenu_rule_engine:'',
    LeftMenu_NotAssigned: '',
    LeftMenu_IPVPN: '',
    LeftMenu_SME: '',
    count: 0,
    LeftMenu_WG_R2DG:'',
    LeftMenu_QH:'',
    LeftMenu_R2DG:'',
  };
  @Input('Headermenustatus') Headermenustatus: any;
  @Output() AutoSelectCall = new EventEmitter();
  @Output() MainLoaderStatus = new EventEmitter();
  @Output() messageData = new EventEmitter();
  constructor(private layoutService: LayoutService) {
   }

  ngOnInit() {    
    const userObj = JSON.parse(localStorage.getItem('fd_user'));
    if (userObj && userObj.authorizations) {
      if (userObj.authorizations.indexOf("LeftMenu_LMOS") > -1) {
        this.menuLevel.LeftMenu_LMOS = "LeftMenu_LMOS";
        ++this.menuLevel.count;
      }
      if (userObj.authorizations.indexOf("LeftMenu_RCMAC") > -1) {
        this.menuLevel.LeftMenu_RCMAC = "LeftMenu_RCMAC";
        ++this.menuLevel.count;
      }
      if (userObj.authorizations.indexOf("LeftMenu_Basic") > -1) {
        this.menuLevel.LeftMenu_Basic = "LeftMenu_Basic";
        // this.menuLevel.LeftMenu_rule_engine = "LeftMenu_rule_engine";
        ++this.menuLevel.count;
      }
      if (userObj.authorizations.indexOf("LeftMenu_IPVPN") > -1) {
        this.menuLevel.LeftMenu_IPVPN = "LeftMenu_IPVPN";
        ++this.menuLevel.count;
      }
      if (userObj.authorizations.indexOf("LeftMenu_SME") > -1) {
        this.menuLevel.LeftMenu_SME = "LeftMenu_SME";
        ++this.menuLevel.count;
      }
      if(userObj.authorizations.indexOf("LeftMenu_R2DG") > -1) {
        this.menuLevel.LeftMenu_R2DG = "LeftMenu_R2DG";
        ++this.menuLevel.count;
      }
    
      if(this.menuLevel.count < 1){
        if(userObj.workgroupRolesList.length > 0){
          this.menuLevel.LeftMenu_Basic = "LeftMenu_Basic";
          ++this.menuLevel.count;
        }
      }

      if(userObj.authorizations.indexOf("LeftMenu_QueryHistory") > -1){
        this.menuLevel.LeftMenu_QH = 'LeftMenu_QueryHistory'
        ++this.menuLevel.count;
      }

      
      // Commented block below is for Query history Left Menu, use it whenever its needed//

      // if(this.menuLevel.LeftMenu_WG_QH ==""){
      //   this.menuLevel.LeftMenu_WG_QH = 'display'
      //   ++this.menuLevel.count;
      // }
      } else {
      // No template assigned Component
      this.menuLevel.LeftMenu_NotAssigned = "LeftMenu_NotAssigned";      
      //this.menuLevel.LeftMenu_Basic = "LeftMenu_Basic";
      //++this.menuLevel.count;
    }
  }
  toggleOnHover(state) {
    console.log(state)
    this.layoutService.onMouseToggleMenu(state);
  }

  public showSME: boolean = false;
  public showFL: boolean = false;
  public showLOMS: boolean = false;
  public showIPVPN: boolean = false;
  showMenu() {
    this.showFL = false;
    this.showSME = false;
    this.showLOMS = false;
    this.showIPVPN = false;
  }

  autoselect() {
    this.AutoSelectCall.emit();
  }

  MainLoader(data) {
    this.MainLoaderStatus.emit(data);
  }

  messageCall(data) {
    this.messageData.emit(data);
  }
}
