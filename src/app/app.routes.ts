import { Routes } from '@angular/router';
import { LogInComponent } from './pages/log-in/log-in.component';
import { TenantLogInComponent } from './pages/tenant-log-in/tenant-log-in.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'tenant-log-in',
        pathMatch: 'full'
    },
    {
        path: 'log-in',
        component: LogInComponent
    },
    {
        path: 'tenant-log-in',
        component: TenantLogInComponent
    },

    {
        path: '',
        loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
        children: [
            {
                path: 'dashboard',
                title: 'Dashboard',
                loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'client-master',
                title: 'Client master',
                loadComponent: () => import('./pages/client/client.component').then(m => m.ClientComponent)
            },
            {
                path: 'property-master',
                title: 'Property',
                loadComponent: () => import('./pages/property/property.component').then(m=>m.PropertyComponent)
            },
            {
                path:'rooms',
                title: 'Rooms',
                loadComponent: ()=>import('./pages/rooms/rooms.component').then(m=>m.RoomsComponent)
            },
            {
                path:'tenant',
                title:'Tenant',
                loadComponent: ()=>import ('./pages/tenant/tenant.component').then(m=>m.TenantComponent)
            },
            {
                path:'complaints',
                title:'Complaints',
                loadComponent: ()=>import('./pages/complaints/complaints.component').then(m=>m.ComplaintsComponent)
            }
        ]
    },

];
