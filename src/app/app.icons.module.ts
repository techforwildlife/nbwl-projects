import { NgModule } from '@angular/core';

import { FontAwesomeModule, FaIconComponent, FaIconLibrary } from '@fortawesome/angular-fontawesome';

// import { faSpinner as fasSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
// import { faHistory as fasHistory } from '@fortawesome/free-solid-svg-icons/faHistory';
// import { faTimes as fasTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
// import { faLayerGroup as fasLayerGroup } from '@fortawesome/free-solid-svg-icons/faLayerGroup';

@NgModule({
  imports: [FontAwesomeModule],
  exports: [FaIconComponent],
})
export class AppIconsModule {
  constructor(private library: FaIconLibrary) {
    // this.library.addIcons(fasSpinner, fasHistory, fasTimes, fasLayerGroup);
  }
}
