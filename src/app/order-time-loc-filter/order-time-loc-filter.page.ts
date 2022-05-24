import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-order-time-loc-filter',
  templateUrl: './order-time-loc-filter.page.html',
  styleUrls: ['./order-time-loc-filter.page.scss'],
})
export class OrderTimeLocFilterPage implements OnInit {
  timeLunch: string;
  locationLunch: string;
  timeDinner: string;
  locationDinner: string;
  category: string;
  filledOut: boolean;
  location = '';
  constructor(
    public router: Router,
    private storage: Storage,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    console.log('filter page init');
    this.storage.get('category').then((val) => {
      this.category = val;
      if (this.category === 'lunch') {
        this.storage.get('time').then((val2) => {
          this.timeLunch = val2;
        });
        this.storage.get('location').then((val3) => {
          this.locationLunch = val3;
        });
      } else {
        this.storage.get('time').then((val4) => {
          this.timeDinner = val4;
        });
        this.storage.get('location').then((val5) => {
          this.locationDinner = val5;
        });
      }
    });
  }
  onChangeTime(time: any) {
    this.storage.set('time', time);
  }
  onChangeLocation(location: any) {
    this.storage.set('location', location);
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
    this.storage.set('category', ev.detail.value);
  }
  reset() {
    this.storage.remove('time');
    this.storage.remove('location');
    this.timeLunch = '';
    this.timeDinner = '';
    this.locationLunch = '';
    this.locationDinner = '';
  }
  applyFilter() {
    this.filledOut = true;
    this.storage.get('time').then((val) => {
      if (!val || val === '') {
        console.log('time is null');
        this.filledOut = false;
      }
      this.storage.get('location').then((val2) => {
        if (!val2 || val2 === '') {
          console.log('location is null');
          this.filledOut = false;
        }
        this.storage.get('category').then((val3) => {
          if (!val3 || val3 === '') {
            console.log('category is null');
            this.filledOut = false;
          }
          if (this.filledOut) {
            this.router.navigate(['']);
          } else {
            this.presentToastEmptyOrder();
          }
        });
      });
    });
  }
  async presentToastEmptyOrder() {
    const toast = await this.toastController.create({
      message: 'Please fill out pick up options.',
      duration: 2000,
    });
    toast.present();
  }
  goBack() {
    this.router.navigate(['']);
  }
}
