import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RoomPage } from  '../room/room';
import { CounsellorPage } from  '../counsellor/counsellor';

/**
* Generated class for the SigninPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})

export class SigninPage {
  data = { nickname:"" };
  counsellor = ["counsellor1","counsellor2","counsellor3"];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  enterNickname() {
    var isCounsellor = false;
    for(var i=0;i<this.counsellor.length;i++){
      if (this.counsellor[i] == this.data.nickname.toLowerCase()) {
        isCounsellor = true;
        i=this.counsellor.length;
      }
    }
    if(isCounsellor){
      this.navCtrl.setRoot(CounsellorPage, {
        nickname: this.data.nickname.toLowerCase()
      });
    } else{
      if(this.data.nickname == ""){
        this.data.nickname = "Anonymous" + Math.floor(new Date().valueOf() * Math.random()).toString().substring(7);
        console.log(this.data.nickname);
      }
      this.navCtrl.setRoot(RoomPage, {
        nickname: this.data.nickname
      });
    }
  }


}
