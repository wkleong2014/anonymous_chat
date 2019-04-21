import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CounsellorPage } from './counsellor';

@NgModule({
  declarations: [
    CounsellorPage,
  ],
  imports: [
    IonicPageModule.forChild(CounsellorPage),
  ],
})
export class CounsellorPageModule {}
