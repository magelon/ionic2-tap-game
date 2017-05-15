import { Component } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
//import { AdMob } from '@ionic-native/admob';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

import { BackgroundMode } from '@ionic-native/background-mode';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AdMobFree, BackgroundMode]
  //,
 // providers:[AdMob]
})
export class HomePage {

    public bcoins = 0;
    public scoins = 0;
    public gcoins = 0;
    subscription;

    splash = true;
    tabBarElement: any;


 constructor(public navCtrl: NavController,
  //private admob: AdMob,
     private storage: Storage,
     private backgroundMode: BackgroundMode,
  private admobFree: AdMobFree,
  private platform: Platform) {
     this.tabBarElement = document.querySelector('.tabbar');
     this.backgroundMode.enable();

     storage.ready().then(() => {

         // Or to get a key/value pair
         storage.get('bcoins').then((val) => {
             this.bcoins = val;
             
         })
         storage.get('scoins').then((val) => {
             this.scoins = val;

         })
         storage.get('gcoins').then((val) => {
             this.gcoins = val;

         })
     });
    

  }

 ionViewDidLoad() {
     this.tabBarElement.style.dispaly ='none';
     setTimeout(() => {
         this.splash = false;
         this.tabBarElement.style.dispaly = 'flex';
     }, 4000);

     this.subscription=Observable.interval(1000).subscribe(x => {
          // the number 1000 is on miliseconds so every second is going to have an iteration of what is inside this code.
         this.storage.set('bcoins', this.bcoins);
         this.storage.set('scoins', this.scoins);
         this.storage.set('gcoins', this.gcoins);

         if (this.bcoins >= 100) {
             let coins = this.bcoins / 100;
             this.bcoins = 0;
             this.scoins = this.scoins + coins;
         }
         if (this.scoins >= 100) {
             let coins = this.scoins / 100;
             this.scoins = 0;
             this.gcoins = this.gcoins + coins;
         } 
          this.bcoins++;
      });
 }

 stopTheIterations() {
     this.subscription.unsubscribe();
 }

  interval() {
      
      this.bcoins++;
      if (this.bcoins >= 100) {
          let coins = this.bcoins / 100;
          this.bcoins = 0;
          this.scoins = this.scoins+coins;
      }
      if (this.scoins >= 100) {
          let coins = this.scoins / 100;
          this.scoins = 0;
          this.gcoins = this.gcoins+coins;
      } 
     
  }

onClick(){

const bannerConfig: AdMobFreeBannerConfig = {
 // add your config here
 // for the sake of this example we will just use the test config
 isTesting: true,
 autoShow: true
};

this.admobFree.rewardVideo.config(bannerConfig);

this.admobFree.rewardVideo.prepare()
  .then(() => {
    // banner Ad is ready
    // if we set autoShow to false, then we will need to call the show method here
   
  })
    .catch(e => console.log(e));
    
}
 /* ionViewDidLoad() {
    this.admob.onAdPresent().subscribe(()=>{this.gcoins++;});
  this.admob.onAdDismiss()
    .subscribe(() => { console.log('User dismissed ad'); });
}
// for admob real rewardVideo
onClick() {
  console.log('ads');
  let adId;
  if(this.platform.is('android')) {
    adId = '';
  } else if (this.platform.is('ios')) {
    adId = 'YOUR_ADID_IOS';
  }
  this.admob.prepareRewardVideoAd(adId)
    .then(() => { this.admob.showRewardVideoAd(); });
}*/

}
