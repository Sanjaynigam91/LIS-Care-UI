import { Component } from '@angular/core';
import { Toast, ToastService } from '../../../auth/Toaster/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(private toasterService: ToastService) {}
  

  ngOnInit() {
    debugger;
    this.toasterService.toast$.subscribe(toast => {
      debugger;
      this.toasts.push(toast);
      setTimeout(() => this.removeToast(toast), 3000); // Auto-hide after 3 seconds
    });
  }

  removeToast(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  // toaster.component.ts (add this method)
getBackgroundColor(type: 'success' | 'error' | 'info'): string {
  switch (type) {
    case 'success': return 'green';
    case 'error': return 'red';
    case 'info': return 'blue';
    default: return 'gray';
  }
}


}
