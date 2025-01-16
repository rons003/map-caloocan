import { Routes } from '@angular/router';
import { TrackerManagementComponent } from './pages/tracker-management/tracker-management.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent,
        data: { title: 'Home Page' }
    },
    {
        path: 'tracker-management',
        component: TrackerManagementComponent,
        data: { title: 'Tracker Management Page' }
    },
];
