import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  //imports: [MatMenuModule, MatIcon, MatButtonModule],
    imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  router = inject(Router);
  partnerId: string | any;
  roleId: string | any;

  // Menu visibility flags
  isFrontDeskMenuDisabled = false;
  isMasterMenuDisabled = false;
  isAccountMenuDisabled = false;
  isSampleMenuDisabled = false;
  isReportsMenuDisabled = false;

  // Feature-specific disable flags
  isSCMenuDisabled = false;
  isSampleAccessionDisabled = false;
  isBulkImportDisabled = false;
  isOutLabSelectionDisabled = false;
  isReportsEntryDisabled = false;
  isQuickReportsEntryDisabled = false;
  isOutLabEntryDispabled = false;
  isRejectTestDisabled = false;
  isPrintReportsDisabled = false;
  isOutLabUpload = false;
  isRejectionSummaryDisabled = false;

  // 🔹 Dynamic Master Menu List (for role-specific Masters)
  masterMenuItems: any[] = [];
  accountMenuItems: any[] = [];
  reportingItems:any[]=[];

  ngOnInit(): void {
    this.partnerId = localStorage.getItem('partnerId');
    this.roleId = localStorage.getItem('roleId');
    this.configureMenuForRole(this.roleId);
  }

  /**
   * Configure menu visibility and masters list based on role
   */
  private configureMenuForRole(roleId: string) {
    switch (roleId) {
      case '1': // Lab Admin
      case '2': // Super Admin
        break;

      case '13': // 🔹 Center Admin
        // Disable other major menus
        this.isFrontDeskMenuDisabled = false;
        this.isSampleMenuDisabled = false;
        this.isReportsMenuDisabled = false;
        this.isAccountMenuDisabled = false;
        this.isRejectionSummaryDisabled = false;
        break;

      case '4': // Front Desk
        this.isFrontDeskMenuDisabled = false;
        this.isSampleMenuDisabled = false;
        this.isAccountMenuDisabled = true;
        this.isMasterMenuDisabled = true;
        this.isReportsMenuDisabled = false;
        this.isRejectionSummaryDisabled = true;
        break;

      case '7': // Accounts
        this.isFrontDeskMenuDisabled = true;
        this.isAccountMenuDisabled = false;
        this.isMasterMenuDisabled = true;
        this.isSampleMenuDisabled = true;
        this.isReportsMenuDisabled = true;
        this.isRejectionSummaryDisabled = true;
        break;

      default:
        this.masterMenuItems = []; // default: no Masters
        break;
    }
  }

  /**
   * Unified navigation method
   */
  onMenuItemClick(routeKey: string) {
    debugger;
    this.router.navigate([routeKey]);
    console.log(`${routeKey} clicked`);
  }
}
