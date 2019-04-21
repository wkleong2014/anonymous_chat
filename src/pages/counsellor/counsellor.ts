import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SigninPage } from  '../signin/signin';
import * as firebase from 'Firebase';

/**
 * Generated class for the CounsellorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-counsellor',
  templateUrl: 'counsellor.html',
})
export class CounsellorPage {
  rooms = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var counsellorname = this.navParams.get("nickname");
    var rooms = [];
    this.rooms = [];
    var ref = firebase.database().ref('chatrooms/');
    ref.on('value', resp => {
      rooms = [];
      resp.forEach(childSnapshot => {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;
        var arr = item[counsellorname];
        if("chats" in arr){
          if(arr.hasNewMessage == true){
            rooms.push({
              key: counsellorname,
              roomname: "" + childSnapshot.key,
              nickname: counsellorname,
              joinkey: childSnapshot.key,
              joinroomname: item[counsellorname].roomname,
              hasNewMessage: true,
            });
          } else{
            rooms.push({
              key: counsellorname,
              roomname: "" + childSnapshot.key,
              nickname: counsellorname,
              joinkey: childSnapshot.key,
              joinroomname: item[counsellorname].roomname,
              hasNewMessage: false,
            });
          }
        }
        return false;
      });
      this.rooms = rooms;
    });

  }

  logout(){
    this.navCtrl.setRoot(SigninPage);
  }

  joinRoom(key, roomname) {
    firebase.database().ref('chatrooms/'+key+'/'+this.navParams.get("nickname")+'/hasNewMessage').set(false);
    this.navCtrl.setRoot(HomePage, {
      key:key,
      roomname:roomname,
      nickname: this.navParams.get("nickname"),
      ref: 'chatrooms/'+key+'/'+this.navParams.get("nickname")+'/chats'
    });
  }

}
