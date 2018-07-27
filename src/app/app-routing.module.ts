import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RouterModule } from '@angular/router';
import { dashboardRoutes } from './dashboard/dashboard.routes';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: '',
        component: DashboardComponent,
        children: dashboardRoutes
    },
    { path: '', component: DashboardComponent },
    { path: '**', redirectTo: '' }

];


@NgModule({

    imports:[
        RouterModule.forRoot( routes )
    ],
    exports: [
        RouterModule
    ]

})

export class AppRoutingModule{


}