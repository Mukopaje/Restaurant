/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';

@Component({
  selector: 'app-restaurant-edit-meal',
  templateUrl: './restaurant-edit-meal.page.html',
  styleUrls: ['./restaurant-edit-meal.page.scss'],
})
export class RestaurantEditMealPage implements OnInit {
  mealId = null;
  meal = {
    name: '',
    price: 0.0,
    description: '',
    picture: '',
    meal_type: 'lunch',
  };

  constructor(private route: ActivatedRoute, public router: Router) {}

  ngOnInit() {
    this.mealId = this.route.snapshot.params.id;
    console.log('RestaurantEditMealPage mealId:' + this.mealId);
    if (this.mealId) {
      this.loadMeal();
    }
  }

  loadMeal() {
    const rootRef = firebase.default.database().ref();
    rootRef
      .child('restaurants/1/meals/')
      .once('value')
      .then((snapshot) => {
        console.log(snapshot.val());
        snapshot.forEach((item) => {
          if (item.key === this.mealId) {
            this.meal = {
              name: item.val().name,
              price: item.val().price,
              description: item.val().description,
              picture: item.val().picture,
              meal_type: item.val().meal_type,
            };
          }
        });
      });
  }

  saveMeal() {
    console.log('saveMeal');
    //console.log(this.meal);
    const tmpMeal: any = this.meal;
    const postData = {
      name: tmpMeal.name ? tmpMeal.name : '',
      price: tmpMeal.price ? tmpMeal.price : 0,
      description: tmpMeal.description ? tmpMeal.description : '',
      picture: tmpMeal.picture ? tmpMeal.picture : '',
      meal_type: tmpMeal.meal_type ? tmpMeal.meal_type : 'lunch',
    };
    console.log(postData);
    if (this.mealId) {
      const seff = this;
      firebase.default
        .database()
        .ref('restaurants/1/meals/' + this.mealId)
        .set(postData, () => {
          this.router.navigate(['/restaurant-tabs']);
        });
    } else {
      const newPostKey = firebase.default
        .database()
        .ref()
        .child('restaurants/1/meals/')
        .push().key;
      const updates = {};
      updates['restaurants/1/meals/' + newPostKey] = postData;
      firebase.default
        .database()
        .ref()
        .update(updates, () => {
          this.router.navigate(['/restaurant-tabs']);
        });
    }
  }

  onChange(selectedValue) {
    console.log('Selected:', selectedValue);
  }
}
