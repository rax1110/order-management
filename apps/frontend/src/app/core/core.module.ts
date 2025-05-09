import { NgModule } from '@angular/core';

import { ToastService } from './services/toast.service.js';

@NgModule({
  providers: [
    ToastService,
  ]
})
export class CoreModule {
  constructor(parentModule: CoreModule | null) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it only in AppModule');
    }
  }

  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: []
    };
  }
}
