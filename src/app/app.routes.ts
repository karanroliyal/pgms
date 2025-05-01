import { Routes } from '@angular/router';
import { LogInComponent } from './pages/log-in/log-in.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'log-in',
        pathMatch:'full'
    },
    {
     path:'log-in',
     component:LogInComponent
    },

    {
        path:'',
        loadComponent:()=>import('./layout/layout.component').then(m=>m.LayoutComponent),
        children:[
            {
                    path:'dashboard',
                    title:'Dashboard',
                    loadComponent:()=>import('./pages/dashboard/dashboard.component').then(m=>m.DashboardComponent)
            },
            {
                    path:'client-master',
                    title:'Client master',
                    loadComponent:()=>import('./pages/client/client.component').then(m=>m.ClientComponent)
            },
        ]
    },

];
