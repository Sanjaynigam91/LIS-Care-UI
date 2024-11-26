import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatMenuModule,MatIcon,MatButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  router = inject(Router);
  partnerId: string |any;
  roleId:any;
  isFrontDeskMenuDisabled:boolean=false; // for FrontDesk Menu
  isMasterMenuDisabled:boolean=false; // For Master Menu
  isAccountMenuDisabled:boolean=false; // For Account Menu
  isSCMenuDisabled:boolean=false; // for Sample Collection 
  isSampleAccessionDisabled:boolean=false;// for Sample Accession
  isBulkImportDisabled:boolean=false;// for Bulk Import
  isSampleMenuDisabled:boolean=false; // for Sample Management Menu
  isReportsMenuDisabled:boolean=false; // for Reports Management Menu
  isOutLabSelectionDisabled:boolean=false;// for Out Lab Selection
  isReportsEntryDisabled:boolean=false; // for Reprts Entry
  isQuickReportsEntryDisabled:boolean=false; // for Quick Reports Entry
  isOutLabEntryDispabled:boolean=false; // for Out Lab Entry
  isRejectTestDisabled:boolean=false; // for Reject Test 
  isPrintReportsDisabled:boolean=false; // for Print Report 
  isOutLabUpload:boolean=false; // for Out Lab Upload


  ngOnInit():void{
    debugger;
    this.partnerId= localStorage.getItem('partnerId');
    this.roleId=localStorage.getItem('roleId');
   this.getMenuItem(this.roleId);
  }
  
 
  private getMenuItem(roleId:any){
    debugger;
    // Define your menu items based on the role
    switch (roleId) {
      case "1": // for Lab admin
        return [
          this.router.navigate(['/dashboard'])
        ];
        case "2": // for super admin
          return [
            this.router.navigate(['/dashboard'])
          ];
        case "3": // for Junior Tech
          this.isFrontDeskMenuDisabled=true;
          this.isAccountMenuDisabled=true;
          this.isMasterMenuDisabled=true;
          this.isSCMenuDisabled=true;
          this.isSampleAccessionDisabled=false;
          this.isBulkImportDisabled=false;
            return [
              this.router.navigate(['/dashboard'])
            ];
        case "4": // for Front Desk
          this.isFrontDeskMenuDisabled=false;
          this.isSCMenuDisabled=false;
          this.isSampleAccessionDisabled=true;
          this.isBulkImportDisabled=true;
          this.isOutLabSelectionDisabled=true;
          this.isReportsEntryDisabled=true;
          this.isQuickReportsEntryDisabled=true;
          this.isOutLabEntryDispabled=true;
          this.isRejectTestDisabled=true;
          this.isPrintReportsDisabled=false;
          this.isOutLabUpload=true;
          this.isAccountMenuDisabled=true;
          this.isMasterMenuDisabled=true;
          return [
            this.router.navigate(['/dashboard'])
          ];
          case "5": // for Coordinator
          return [
            this.router.navigate(['/dashboard'])
          ];
          case "6": // For Senior Tech
            this.isFrontDeskMenuDisabled=true;
            this.isAccountMenuDisabled=true;
            this.isMasterMenuDisabled=true;
            this.isSCMenuDisabled=true;
            this.isSampleAccessionDisabled=false;
            this.isBulkImportDisabled=false;
              return [
                this.router.navigate(['/dashboard'])
              ];
            case "7": // for Accounts
                this.isFrontDeskMenuDisabled=true;
                this.isAccountMenuDisabled=false;
                this.isMasterMenuDisabled=true;
                this.isSampleMenuDisabled=true;
                this.isReportsMenuDisabled=true;
              
                  return [
                    this.router.navigate(['/dashboard'])
                  ];
               case "8": // for CENTRE ADMIN
                    return [
                      this.router.navigate(['/dashboard'])
                    ];
      default:
        return [];
    }


  }


  
  onMenuItemClick(item: string) {
    debugger;
    if(item=="dashboard"){
      this.router.navigate(['/dashboard']);
    }
    else if(item=="searchpatients"){
      this.router.navigate(['/searchpatients']);
    }
    else if(item=="patientregistration"){
      this.router.navigate(['/patientregistration']);
    }
    else if(item=="patientssummary"){
      this.router.navigate(['/patientssummary']);
    }
    else if(item=="barcodeeditor"){
      this.router.navigate(['/barcodeeditor']);
    }
    else if(item=="rejectionsummary"){
      this.router.navigate(['/rejectionsummary']);
    }
    else if(item=="samplecollection"){
      this.router.navigate(['/samplecollection']);
    }
    else if(item=="sampleaccession"){
      this.router.navigate(['/sampleaccession']);
    }
    else if(item=="bulkimport"){
      this.router.navigate(['/bulkimport']);
    }
    else if(item=="trackstatus"){
      this.router.navigate(['/trackstatus']);
    }
    else if(item=="outLabselection"){
      this.router.navigate(['/outLabselection']);
    }
    else if(item=="reportsentry"){
      this.router.navigate(['/reportsentry']);
    }
    else if(item=="quickreportsentry"){
      this.router.navigate(['/quickreportsentry']);
    }
    else if(item=="outlabreportsentry"){
      this.router.navigate(['/outlabreportsentry']);
    }
    else if(item=="rejecttests"){
      this.router.navigate(['/rejecttests']);
    }
    else if(item=="printreports"){
      this.router.navigate(['/printreports']);
    }
    else if(item=="outLabupload"){
      this.router.navigate(['/outLabupload']);
    }
    else if(item=="testmaster"){
      this.router.navigate(['/testmaster']);
    }
    else if(item=="profilemaster"){
      this.router.navigate(['/profilemaster']);
    }
    else if(item=="analyzermaster"){
      this.router.navigate(['/analyzermaster']);
    }
    else if(item=="CentreMaster"){
      this.router.navigate(['/CentreMaster']);
    }
    else if(item=="CentreSplRates"){
      this.router.navigate(['/CentreSplRates']);
    }
    else if(item=="ClinicMaster"){
      this.router.navigate(['/ClinicMaster']);
    }
    else if(item=="ClientMaster"){
      this.router.navigate(['/ClientMaster']);
    }
    else if(item=="ClientSplRates"){
      this.router.navigate(['/ClientSplRates']);
    }
    else if(item=="OutLabMaster"){
      this.router.navigate(['/OutLabMaster']);
    }
    else if(item=="EmployeeMaster"){
      this.router.navigate(['/EmployeeMaster']);
    }
    else if(item=="BarcodeManager"){
      this.router.navigate(['/BarcodeManager']);
    }
    else if(item=="ProjectMaster"){
      this.router.navigate(['/ProjectMaster']);
    }
    else if(item=="CentreBlocked"){
      this.router.navigate(['/CentreBlocked']);
    }
    else if(item=="UserMaster"){
      this.router.navigate(['Pages/Master/security/UserMaster']);
    }
    else if(item=="MetaData"){
      this.router.navigate(['/Pages/Master/security/MetaData']);
    }
    else if(item=="UserRoleMaster"){
      this.router.navigate(['Pages/Master/security/UserRoleMaster']);
    }
    else if(item=="LisPageMaster"){
      this.router.navigate(['Pages/Master/security/LisPageMaster']);
    }
    else if(item=="GlobalRolesAccess"){
      this.router.navigate(['/GlobalRolesAccess']);
    }
    else if(item=="SampleCollectionPlace"){
      this.router.navigate(['/SampleCollectionPlace']);
    }
    else if(item=="BillingSummary"){
      this.router.navigate(['/BillingSummary']);
    }
    else if(item=="AccountsReceivables"){
      this.router.navigate(['/AccountsReceivables']);
    }
    else if(item=="ClientLedger"){
      this.router.navigate(['/ClientLedger']);
    }
    else if(item=="ProfitBillingSummary"){
      this.router.navigate(['/ProfitBillingSummary']);
    }
    else if(item=="OutlabBillingSummary"){
      this.router.navigate(['/OutlabBillingSummary']);
    }
    else if(item=="TestWiseSummary"){
      this.router.navigate(['/TestWiseSummary']);
    }
    else if(item=="FranchiseeBilling"){
      this.router.navigate(['/FranchiseeBilling']);
    }
    
    console.log(`${item} clicked`);
  }
}
