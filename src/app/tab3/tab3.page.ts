/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import * as firebase from 'firebase/compat/app';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  profile_items: { icon: string; label: string; link: string }[];
  username = '';
  email = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.profile_items = [
      {
        icon: 'clipboard',
        label: 'Edit Profile',
        link: '/edit-profile',
      },
      {
        icon: 'car',
        label: 'Track Order',
        link: '/tabs/tab2',
      },
      {
        icon: 'card',
        label: 'My Credits',
        link: '/credit',
      },
      // {
      //   'icon': 'barcode',
      //   'label': 'My QRCode',
      //   'link': '/qrcode',
      // },
      {
        icon: 'contacts',
        label: 'Restaurants! Partner with us',
        link: '/restaurant-tabs',
      },
    ];
  }
  ngOnInit() {
    const userId = firebase.default.auth().currentUser
      ? firebase.default.auth().currentUser.uid
      : '';
    firebase.default
      .database()
      .ref('/userProfiles/' + userId)
      .once('value')
      .then((snapshot) => {
        const username =
          (snapshot.val() && snapshot.val().username) || 'Anonymous';
        const email = snapshot.val().email;

        this.username = username;
        this.email = email;
      });
  }
  ionViewWillEnter() {
    this.ngOnInit();
  }
  tryLogout() {
    this.authService
      .logoutUser()
      .then((res) => {
        console.log(res);
        // this.router.navigate(['/signin']);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
