import { Component, ViewChild } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { NavController, NavParams, Content } from 'ionic-angular';
import { RoomPage } from '../room/room';
import { CounsellorPage } from  '../counsellor/counsellor';
import * as firebase from 'Firebase';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //might have issues with the @ViewChild
  @ViewChild(Content) content: Content;
  data = { type:'', nickname:'', message:'' };
  chats = [];
  roomkey:string;
  roomname:string;
  nickname:string;
  realname:string;
  offStatus:boolean = false;
  ref:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
    this.roomkey = this.navParams.get("key") as string;
    this.roomname = this.navParams.get("roomname") as string;
    this.nickname = this.navParams.get("nickname") as string;

    if(this.nickname == "counsellor1"){
      this.realname = "Linda";
    } else if(this.nickname == "counsellor2"){
      this.realname = "Ding Yao";
    } else if(this.nickname == "counsellor3"){
      this.realname = "Pearlyn";
    } else{
      this.realname = this.nickname;
    }

    this.ref = this.navParams.get("ref") as string;
    this.data.type = 'message';
    this.data.nickname = this.nickname;

    let joinData = firebase.database().ref(this.ref).push();
    joinData.set({
      type:'join',
      user:this.nickname,
      message:this.realname+' has joined.',
      sendDate:Date()
    });
    this.data.message = '';

    firebase.database().ref(this.ref).on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);
      setTimeout(() => {
        if(this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
      }, 1000);
    });
  }

  getSuggestion(message) {
    var replyArray = getTextAnalytics(message); //stringArray
    var inputArr = [];
    for(var i=0;i<replyArray.length;i++){
      inputArr.push({
        type:'radio',
        label:replyArray[i],
        value:replyArray[i],
      });
    }
    let alert = this.alertCtrl.create({
      title: 'Suggestions...',
      inputs: inputArr,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Use Suggestion',
          handler: data => {
            this.data.message = data;
          }
      }
    ],
    cssClass: 'textWrapCSS'
  });
  alert.present();
}

sendMessage() {
  let newData = firebase.database().ref(this.ref).push();
  newData.set({
    type:this.data.type,
    user:this.data.nickname,
    message:this.data.message,
    realname:this.realname,
    sendDate:Date()
  });
  if(this.data.nickname != "counsellor1" && this.data.nickname != "counsellor2" && this.data.nickname != "counsellor3"){
    firebase.database().ref(this.ref.substring(0,this.ref.length-5) + 'hasNewMessage').set(true);
  }

  this.data.message = '';
}

exitChat() {
  let exitData = firebase.database().ref(this.ref).push();
  exitData.set({
    type:'exit',
    user:this.nickname,
    message:this.realname+' has exited.',
    sendDate:Date()
  });

  this.offStatus = true;
  if(this.nickname=="counsellor1" || this.nickname=="counsellor2" || this.nickname=="counsellor3"){
    this.navCtrl.setRoot(CounsellorPage, {
      nickname:this.nickname
    });
  } else{
    this.navCtrl.setRoot(RoomPage, {
      nickname:this.nickname
    });
  }

}

}

function getTextAnalytics(message){
  var replyArray = [];
  if(message.indexOf("need help")!=-1 || message.indexOf("need some help")!=-1){
    replyArray.push("Would you care to tell me more?");
    replyArray.push("I am here to help! Would you like to share your problem with me?");
  } else if(message.indexOf("overwhelmed")!=-1 || message.indexOf("cannot keep up")!=-1){
    replyArray.push("Is everything alright? Do you want to tell me more?");
    replyArray.push("Is there any way I can help you sort things out?");
    replyArray.push("It may not seem optimistic now, but I’m sure you’ll pull through eventually. ");
  } else if(message.indexOf("alone")!=-1 && message.indexOf("feel")!=-1){
    replyArray.push("Things may not be how it seems. I’m sure that they love and care about you – they may just be inexpressive.");
    replyArray.push("I am always here if you need someone to share your problems with, you are not alone!");
    replyArray.push("You can always come down and hangout with us! We would love to have you around.");
  } else if(message.indexOf("try my hardest")!=-1 && message.indexOf("not")!=-1 && message.indexOf("doing well")!=-1){
    replyArray.push("If you need more guidance with school, you can always come down – we are always here to help!");
    replyArray.push("Don’t give up! You may not understand some things now but with proper guidance and resources, I am sure you that you’ll excel!");
    replyArray.push("Don’t worry, take it slowly. You have time to catch up!");
  } else if(message.indexOf("bullying")!=-1 && message.indexOf("how to react")!=-1){
    replyArray.push("If you don’t mind, can you tell me more?");
    replyArray.push("Have you told anyone about it?");
  } else if(message.indexOf("Life is")!=-1 && message.indexOf("hard")!=-1 && message.indexOf("purpose")!=-1){
    replyArray.push("What’s wrong? Care to tell me more?");
    replyArray.push("I’m sure you do enjoy some things in life. Think about your hobbies and passions, or maybe someone you love!");
    replyArray.push("Why do you feel this way? Did someone or something affect your views?");
  } else{
    replyArray.push("No Suggestion");
  }
  return replyArray;
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
