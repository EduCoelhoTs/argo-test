import { Routes } from '@angular/router';
import { ListComponent } from './pages/list/List.component';
import { LoginComponent } from './auth/Login/Login.component';
import { authGuard } from './auth/guard/Auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: ListComponent,
        pathMatch: 'full',
        title: 'To do List',
        canActivate: [authGuard]
    }, 
    {
        path: 'create',
        loadComponent: () => import('./pages/create/Create.component').then(mod => mod.CreateComponent),
        canActivate: [authGuard],
        title: 'Create Task List'
    },
    {
        path: 'login',
        component: LoginComponent,
        title: 'Login'
    }
    
];
