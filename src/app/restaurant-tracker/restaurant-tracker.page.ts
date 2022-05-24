/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/compat/app';
import { AlertController } from '@ionic/angular';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';

interface Order {
  id: string;
  username: string;
  delivered: boolean;
  location: string;
  items: Array<Item>;
  paid: boolean;
  pickedup: boolean;
  total: number;
  customer: string;
}

interface Item {
  meal_id: string;
  meal_name: string;
  meal_type: string;
  price: number;
  quantity: number;
  restaurant_id: string;
}

interface CustomerForMeal {
  name: string;
  count: number;
  location: string;
  mealName: string;
}

@Component({
  selector: 'app-restaurant-tracker',
  templateUrl: './restaurant-tracker.page.html',
  styleUrls: ['./restaurant-tracker.page.scss'],
})
export class RestaurantTrackerPage implements OnInit {
  rId = '1';
  trackSelectionFood = true;
  initFinished = false;

  orders: Array<Order> = [];
  mealTrackList: any = [];
  locationTrackList: any = [];
  mealSet: Set<string> = new Set<string>();
  constructor(public alertController: AlertController) {}

  ngOnInit() {
    console.log('RestaurantTrackerPage ngOnInit');
    const self = this;
    const rootRef = firebase.default.database().ref('orders/');
    rootRef
      .orderByChild('restaurant_id')
      .equalTo(self.rId)
      .on('value', (snapshot) => {
        console.log(snapshot.val());
        snapshot.forEach((i) => {
          console.log(i.val().items);
          const order: Order = {
            id: i.key,
            username: i.val().username,
            delivered: i.val().delivered,
            location: i.val().location,
            items: i.val().items,
            paid: i.val().paid,
            pickedup: i.val().pickedup,
            total: i.val().total,
            customer: i.val().customer,
          };
          //console.log(order.items.length);
          //console.log(order.items);
          self.orders.push(order);
        });
        self.getMeals();
        self.parseOrdersbyMeal();
        self.parseOrderbyLocation();
        self.initFinished = true;
      });
  }
  async presentAlertRadio() {
    const alert = await this.alertController.create({
      header: 'Tracking Selection',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: 'Food',
          value: 'Food',
          checked: this.trackSelectionFood,
        },
        {
          name: 'radio6',
          type: 'radio',
          label: 'Location',
          value: 'Location',
          checked: !this.trackSelectionFood,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (data: string) => {
            console.log('Confirm Ok');
            console.log(data);
            const choice = data === 'Food';
            if (this.trackSelectionFood !== choice) {
              this.trackSelectionFood = choice;
              if (data === 'Food') {
                console.log('show List by Food');
              } else if (data === 'Location') {
                console.log('show List by Location');
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertNotification() {
    const alert = await this.alertController.create({
      header: 'Notification Selection',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: 'CMU Hunt',
          value: 'CMU Hunt',
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'CMU Tepper',
          value: 'CMU Tepper',
        },
        {
          name: 'radio3',
          type: 'radio',
          label: 'CMU UC',
          value: 'CMU UC',
        },
        {
          name: 'radio4',
          type: 'radio',
          label: 'UPitts',
          value: 'UPitts',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          /*role: 'cancel',
          cssClass: 'secondary',*/
          handler: (data: string) => {
            console.log('Confirm Cancel');
            console.log(data);
            this.notifyDelivered(data, false);
          },
        },
        {
          text: 'Ok',
          handler: (data: string) => {
            console.log('Confirm Ok');
            console.log(data);
            this.notifyDelivered(data, true);
          },
        },
      ],
    });

    await alert.present();
  }

  notifyDelivered(location: string, isDelivered: boolean) {
    console.log('notifyDelivered set ' + location + ' ' + isDelivered);
    const self = this;
    const rootRef = firebase.default.database().ref('orders/');
    rootRef
      .orderByChild('restaurant_id')
      .equalTo(self.rId)
      .once('value')
      .then((snapshot) => {
        console.log(snapshot.val());
        snapshot.forEach((i) => {
          console.log(i.val().location);
          console.log(location);
          if (i.val().location === location) {
            console.log('Found location');
            console.log(i.key);
            const updateStatus = { delivered: isDelivered };
            rootRef.child(i.key).update(updateStatus);
          }
        });
      });
  }

  parseOrdersbyMeal() {
    console.log('parseOrdersbyMeal');
    let customers: Array<CustomerForMeal> = [];
    const self = this;
    this.mealSet.forEach((item) => {
      console.log('meal:`' + item);
      customers = self.getCustomerbyMeal(item);
      console.log(customers);
      self.mealTrackList.push(customers);
    });
    console.log('mealTrackList');
    console.log(this.mealTrackList);
  }

  parseOrderbyLocation() {
    console.log('parseOrderbyLocation');
    const locationSet = this.getLocation();
    let customers: Array<Array<object>> = [];
    const self = this;
    /*locationSet.forEach(function(loc){
      //console.log("location:`" + loc);
      customers = self.getCustomerbyLocation(loc);
      //console.log(customers);
      self.locationTrackList.push(customers);
    });*/
    for (const loc of locationSet) {
      customers = self.getCustomerbyLocation(loc);
      //console.log(customers);
      self.locationTrackList.push(customers);
    }
    console.log('locationTrackList:');
    console.log(this.locationTrackList);
  }

  getLocation() {
    const set = new Set<string>();
    for (const order of this.orders) {
      set.add(order.location);
    }
    return set;
  }

  getMeals() {
    console.log('getMeals');
    for (const order of this.orders) {
      //console.log(order);
      for (const item of order.items) {
        //console.log(item);
        //console.log(item.meal_name);
        this.mealSet.add(item.meal_name);
      }
    }
  }

  getCustomerbyMeal(mealName: string) {
    const customers: Array<CustomerForMeal> = [];
    for (const order of this.orders) {
      //console.log(order);
      for (const item of order.items) {
        //console.log(item);
        //console.log(item.meal_name);
        if (item.meal_name === mealName) {
          const customerName = order.username;
          console.log(item.meal_name + ': ' + item.quantity);
          if (customers.hasOwnProperty(customerName)) {
            customers[customerName].count += item.quantity;
          } else {
            customers[customerName] = {};
            customers[customerName].count = item.quantity;
            customers[customerName].location = order.location;
            customers[customerName].name = customerName;
            customers[customerName].mealName = mealName;
          }
        }
      }
    }
    const customersArr: Array<CustomerForMeal> = [];
    //console.log("parse to array");
    for (const customer in customers) {
      if (customers[customer]) {
        //console.log(customer.name);
        //console.log(customers[customer]);
        const cus = {
          name: customers[customer].name,
          count: customers[customer].count,
          location: customers[customer].location,
          mealName: customers[customer].mealName,
        };
        customersArr.push(cus);
      }
    }
    return customersArr;
  }

  getCustomerbyLocation(targetLocation: string) {
    console.log('getCustomerbyLocation:' + targetLocation);
    const customers: Array<CustomerForMeal> = [];
    for (const order of this.orders) {
      if (order.location === targetLocation) {
        const userName = order.username;
        if (!customers.hasOwnProperty(userName)) {
          customers[userName] = {};
          customers[userName].location = targetLocation;
          customers[userName].name = userName;
        }
        for (const item of order.items) {
          const mealName = item.meal_name;
          if (customers[userName].hasOwnProperty(mealName)) {
            customers[userName][mealName].count += item.quantity;
          } else {
            customers[userName][mealName] = {};
            customers[userName][mealName].count = item.quantity;
            customers[userName][mealName].mealName = mealName;
          }
        }
      }
    }
    console.log(customers);
    const customersArr: Array<Array<object>> = [];
    for (const customer in customers) {
      if (customers[customer]) {
        const mealsArr: Array<object> = [];
        //let username = customer.name;
        let idx = 0;
        for (const meal of this.mealSet) {
          //console.log(meal);
          if (customers[customer][meal]) {
            console.log(customers[customer].name + ' has ' + meal);
            const cus = {
              index: idx,
              name: customers[customer].name,
              location: customers[customer].location,
              count: customers[customer][meal].count,
              mealname: customers[customer][meal].mealName,
            };
            mealsArr.push(cus);
            idx++;
          }
          //customersArr.push(mealsArr);
        }
        customersArr.push(mealsArr);
      }
    }
    console.log(customersArr);
    return customersArr;
  }
}
