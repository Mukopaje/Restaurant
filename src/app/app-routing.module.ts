import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'restaurant/:id',
    loadChildren: () =>
      import('./restaurant/restaurant.module').then(
        (m) => m.RestaurantPageModule
      ),
  },
  {
    path: 'dish-detail/:id',
    loadChildren: () =>
      import('./dish-detail/dish-detail.module').then(
        (m) => m.DishDetailPageModule
      ),
  },
  {
    path: 'cart',
    loadChildren: () =>
      import('./cart/cart.module').then((m) => m.CartPageModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./signin/signin.module').then((m) => m.SigninPageModule),
  },
  {
    path: 'edit-profile',
    loadChildren: () =>
      import('./edit-profile/edit-profile.module').then(
        (m) => m.EditProfilePageModule
      ),
  },
  {
    path: 'credit',
    loadChildren: () =>
      import('./credit/credit.module').then((m) => m.CreditPageModule),
  },
  {
    path: 'qrcode',
    loadChildren: () =>
      import('./qrcode/qrcode.module').then((m) => m.QrcodePageModule),
  },
  {
    path: 'owner-meal-list',
    loadChildren: () =>
      import('./owner-meal-list/owner-meal-list.module').then(
        (m) => m.OwnerMealListPageModule
      ),
  },
  {
    path: 'order-time-loc-filter',
    loadChildren: () =>
      import('./order-time-loc-filter/order-time-loc-filter.module').then(
        (m) => m.OrderTimeLocFilterPageModule
      ),
  },
  {
    path: 'restaurant-tabs',
    loadChildren: () =>
      import('./restaurant-tabs/restaurant-tabs.module').then(
        (m) => m.RestaurantTabsPageModule
      ),
  },
  {
    path: 'restaurant-edit-meal',
    loadChildren: () =>
      import('./restaurant-edit-meal/restaurant-edit-meal.module').then(
        (m) => m.RestaurantEditMealPageModule
      ),
  },
  {
    path: 'restaurant-edit-meal/:id',
    loadChildren: () =>
      import('./restaurant-edit-meal/restaurant-edit-meal.module').then(
        (m) => m.RestaurantEditMealPageModule
      ),
  },
  {
    path: 'restaurant-tracker',
    loadChildren: () =>
      import('./restaurant-tracker/restaurant-tracker.module').then(
        (m) => m.RestaurantTrackerPageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
