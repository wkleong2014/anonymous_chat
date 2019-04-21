import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SigninPage } from  '../signin/signin';
import * as firebase from 'Firebase';
/**
* Generated class for the RoomPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {
  rooms = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var nickname = this.navParams.get("nickname");

    var ref = firebase.database().ref('chatrooms/' + this.navParams.get("nickname"));
    ref.on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
    });

    firebase.database().ref('chatrooms/').once('value', function(snapshot) {
      if (!snapshot.hasChild(nickname)) {
        let newData1 = ref.child("counsellor1");
        newData1.set({
          roomname:"Speak with Linda",
          hasNewMessage: false,
        });

        let newData2 = ref.child("counsellor2");
        newData2.set({
          roomname:"Speak with Ding Yao",
          hasNewMessage: false,
        });

        let newData3 = ref.child("counsellor3");
        newData3.set({
          roomname:"Speak with Pearlyn",
          hasNewMessage: false,
        });
      }
    });
  }

  logout(){
    this.navCtrl.setRoot(SigninPage);
  }

  joinRoom(key, roomname) {
    this.navCtrl.setRoot(HomePage, {
      key:key,
      roomname:roomname,
      nickname:this.navParams.get("nickname"),
      ref: 'chatrooms/'+this.navParams.get("nickname")+'/'+ key +'/chats'
    });
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];
  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
