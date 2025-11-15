import { Routes } from '@angular/router';
import { LoginComponent } from '../Pages/login/login.component';
import { LayoutComponent } from '../Pages/layout/layout.component';
import { DsahboardComponent } from '../Pages/dsahboard/dsahboard.component';
import { SignupComponent } from '../Pages/signup/signup.component';
import { AdminComponent } from '../Pages/admin/admin.component';
import { authGuard } from '../auth/auth.guard';
import { PatientregistrationComponent } from '../Pages/FrontDesk/patientregistration/patientregistration.component';
import { SearchpatientsComponent } from '../Pages/FrontDesk/searchpatients/searchpatients.component';
import { PatientssummaryComponent } from '../Pages/FrontDesk/patientssummary/patientssummary.component';
import { BarcodeeditorComponent } from '../Pages/FrontDesk/barcodeeditor/barcodeeditor.component';
import { RejectionsummaryComponent } from '../Pages/FrontDesk/rejectionsummary/rejectionsummary.component';
import { SamplecollectionComponent } from '../Pages/SampleManagement/samplecollection/samplecollection.component';
import { SampleaccessionComponent } from '../Pages/SampleManagement/sampleaccession/sampleaccession.component';
import { BulkimportComponent } from '../Pages/SampleManagement/bulkimport/bulkimport.component';
import { TrackstatusComponent } from '../Pages/SampleManagement/trackstatus/trackstatus.component';
import { OutLabselectionComponent } from '../Pages/ReportingManagement/out-labselection/out-labselection.component';
import { ReportsentryComponent } from '../Pages/ReportingManagement/reportsentry/reportsentry.component';
import { QuickreportsentryComponent } from '../Pages/ReportingManagement/quickreportsentry/quickreportsentry.component';
import { OutlabreportsentryComponent } from '../Pages/ReportingManagement/outlabreportsentry/outlabreportsentry.component';
import { RejecttestsComponent } from '../Pages/ReportingManagement/rejecttests/rejecttests.component';
import { PrintreportsComponent } from '../Pages/ReportingManagement/printreports/printreports.component';
import { OutLabuploadComponent } from '../Pages/ReportingManagement/out-labupload/out-labupload.component';
import { TestmasterComponent } from '../Pages/Master/Services/testmaster/testmaster.component';
import { ProfilemasterComponent } from '../Pages/Master/Services/profilemaster/profilemaster.component';
import { AnalyzermasterComponent } from '../Pages/Master/Services/analyzermaster/analyzermaster.component';
import { CentreMasterComponent } from '../Pages/Master/Operations/centre-master/centre-master.component';
import { CentreSplRatesComponent } from '../Pages/Master/Operations/centre-spl-rates/centre-spl-rates.component';
import { ClinicMasterComponent } from '../Pages/Master/Operations/clinic-master/clinic-master.component';
import { ClientMasterComponent } from '../Pages/Master/Operations/client-master/client-master.component';
import { ClientSplRatesComponent } from '../Pages/Master/Operations/client-spl-rates/client-spl-rates.component';
import { OutLabMasterComponent } from '../Pages/Master/Operations/out-lab-master/out-lab-master.component';
import { EmployeeMasterComponent } from '../Pages/Master/Operations/employee-master/employee-master.component';
import { BarcodeManagerComponent } from '../Pages/Master/Operations/barcode-manager/barcode-manager.component';
import { ProjectMasterComponent } from '../Pages/Master/Operations/project-master/project-master.component';
import { CentreBlockedComponent } from '../Pages/Master/Operations/centre-blocked/centre-blocked.component';
import { UserRoleMasterComponent } from '../Pages/Master/security/user-role-master/user-role-master.component';
import { UserMasterComponent } from '../Pages/Master/security/user-master/user-master.component';
import { MetaDataComponent } from '../Pages/Master/security/meta-data/meta-data.component';
import { GlobalRolesAccessComponent } from '../Pages/Master/security/global-roles-access/global-roles-access.component';
import { SampleCollectionPlaceComponent } from '../Pages/Master/security/sample-collection-place/sample-collection-place.component';
import { BillingSummaryComponent } from '../Pages/AccountManagement/billing-summary/billing-summary.component';
import { AccountsReceivablesComponent } from '../Pages/AccountManagement/accounts-receivables/accounts-receivables.component';
import { ClientLedgerComponent } from '../Pages/AccountManagement/client-ledger/client-ledger.component';
import { ProfitBillingSummaryComponent } from '../Pages/AccountManagement/profit-billing-summary/profit-billing-summary.component';
import { OutlabBillingSummaryComponent } from '../Pages/AccountManagement/outlab-billing-summary/outlab-billing-summary.component';
import { TestWiseSummaryComponent } from '../Pages/AccountManagement/test-wise-summary/test-wise-summary.component';
import { FranchiseeBillingComponent } from '../Pages/AccountManagement/franchisee-billing/franchisee-billing.component';
import { AdduserComponent } from '../Pages/Master/security/adduser/adduser.component';
import { LisPageMasterComponent } from '../Pages/Master/security/lis-page-master/lis-page-master.component';
import { ClientdashboardComponent } from '../Pages/clientdashboard/clientdashboard.component';
import { ProjectSplRatesComponent } from '../Pages/Master/Operations/project-spl-rates/project-spl-rates.component';

export const routes: Routes = [
    {
        path:'',redirectTo:'login',pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'',component:LayoutComponent,
        children:[
            {
                path:'dashboard',
                component:DsahboardComponent
            },
            {
                path:'clientdashboard',
                component:ClientdashboardComponent
            },
            {
                path:'searchpatients',
                component:SearchpatientsComponent
            },
            {
                path:'patientregistration',
                component:PatientregistrationComponent
            },
            {
                path:'patientssummary',
                component:PatientssummaryComponent
            },
            {
                path:'barcodeeditor',
                component:BarcodeeditorComponent
            },
            {
                path:'rejectionsummary',
                component:RejectionsummaryComponent
            },
            {
                path:'samplecollection',
                component:SamplecollectionComponent
            },
            {
                path:'sampleaccession',
                component:SampleaccessionComponent
            },
            {
                path:'bulkimport',
                component:BulkimportComponent
            },
            {
                path:'trackstatus',
                component:TrackstatusComponent
            },
            {
                path:'outLabselection',
                component:OutLabselectionComponent
            },
            {
                path:'reportsentry',
                component:ReportsentryComponent
            },
            {
                path:'quickreportsentry',
                component:QuickreportsentryComponent
            },
            {
                path:'outlabreportsentry',
                component:OutlabreportsentryComponent
            },
            {
                path:'rejecttests',
                component:RejecttestsComponent
            },
            {
                path:'printreports',
                component:PrintreportsComponent
            },
            {
                path:'outLabupload',
                component:OutLabuploadComponent
            },
            {
                path:'testmaster',
                component:TestmasterComponent
            },
            {
                path:'profilemaster',
                component:ProfilemasterComponent
            },
            {
                path:'analyzermaster',
                component:AnalyzermasterComponent
            },
            {
                path:'CentreMaster',
                component:CentreMasterComponent
            },
            {
                path:'CentreSplRates',
                component:CentreSplRatesComponent
            },
            {
                path:'ClinicMaster',
                component:ClinicMasterComponent
            },
            {
                path:'ClientMaster',
                component:ClientMasterComponent
            },
            {
                path:'ClientSplRates',
                component:ClientSplRatesComponent
            },
            {
                path:'OutLabMaster',
                component:OutLabMasterComponent
            },
            {
                path:'EmployeeMaster',
                component:EmployeeMasterComponent
            },
            {
                path:'BarcodeManager',
                component:BarcodeManagerComponent
            },
            {
                path:'ProjectMaster',
                component:ProjectMasterComponent
            },
            {
                path:'CentreBlocked',
                component:CentreBlockedComponent
            },
            {
                path:'UserMaster',
                component:UserMasterComponent
            },
            {
                path:'MetaData',
                component:MetaDataComponent
            },
            {
                path:'UserRoleMaster',
                component:UserRoleMasterComponent
            },
            {
                path:'LisPageMaster',
                component:LisPageMasterComponent
            },
            {
                path:'GlobalRolesAccess',
                component:GlobalRolesAccessComponent
            },
            {
                path:'SampleCollectionPlace',
                component:SampleCollectionPlaceComponent
            },
            {
                path:'BillingSummary',
                component:BillingSummaryComponent
            },
            {
                path:'AccountsReceivables',
                component:AccountsReceivablesComponent
            },
            {
                path:'ClientLedger',
                component:ClientLedgerComponent
            },
            {
                path:'ProfitBillingSummary',
                component:ProfitBillingSummaryComponent
            },
            {
                path:'OutlabBillingSummary',
                component:OutlabBillingSummaryComponent
            },
            {
                path:'TestWiseSummary',
                component:TestWiseSummaryComponent
            },
            {
                path:'FranchiseeBilling',
                component:FranchiseeBillingComponent
            },
            {
                path: 'Pages/Master/security/addUser/:userId', component: AdduserComponent
            },
            {
                path: 'ProjectSplRates', component: ProjectSplRatesComponent
            }
            
        ]
    },
    {
        path: 'signup', component: SignupComponent
    },

    {
        path: 'admin', component: AdminComponent, canActivate: [authGuard]
    }
   
   
    
];
