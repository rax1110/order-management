import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ToastService } from "./toast.service.js";
import { inject } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class ErrorHandlerService {
    private toastService = inject(ToastService);
    private skipNextErrorSubject = new BehaviorSubject<boolean>(false);
    
    /**
     * Call this method before operations where you want to handle errors locally
     * (component level) and prevent the global error handling
     */
    skipNextErrorNotification(): void {
      this.skipNextErrorSubject.next(true);
    }
    
    /**
     * Check if the next error notification should be skipped
     * (used by interceptor)
     */
    shouldSkipErrorNotification(): boolean {
      const shouldSkip = this.skipNextErrorSubject.value;
      
      if (shouldSkip) {
        this.skipNextErrorSubject.next(false);
      }
      
      return shouldSkip;
    }
    
    handleError(error: HttpErrorResponse): void {
      if (this.shouldSkipErrorNotification()) {
        return;
      }
      
      const message = this.getErrorMessage(error);

      this.toastService.showError(message);
    }
    
    getErrorMessage(error: HttpErrorResponse): string {
      switch (error.status) {
        case 0:
          return 'Could not connect to the server. Please check your internet connection.';
        case 400:
          return 'Invalid request data. Please check your inputs.';
        case 401:
          return 'You need to log in to access this resource.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'This resource already exists.';
        case 500:
        case 501:
        case 502:
        case 503:
          return 'Server error. Please try again later.';
        default:
          return 'An unexpected error occurred. Please try again.';
      }
    }
  }