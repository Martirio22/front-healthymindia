// import { Routes } from '@angular/router';
// import { AppLayout } from './app/layout/component/app.layout';
// import { Dashboard } from './app/pages/dashboard/dashboard';
// import { Documentation } from './app/pages/documentation/documentation';
// import { Landing } from './app/pages/landing/landing';
// import { Notfound } from './app/pages/notfound/notfound';

// export const appRoutes: Routes = [
//     {
//         path: '',
//         component: AppLayout,
//         children: [
//             { path: '', component: Dashboard },
//             { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
//             { path: 'documentation', component: Documentation },
//             { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
//         ]
//     },
//     { path: 'landing', component: Landing },
//     { path: 'notfound', component: Notfound },
//     { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
//     { path: '**', redirectTo: '/notfound' }
// ];

import { Routes } from '@angular/router';

import { authGuard } from './app/app/core/guards/auth-guard';
import { adminGuard } from './app/app/core/guards/admin-guard';
import { Notfound } from './app/pages/notfound/notfound';
import { Landing } from './app/pages/landing/landing';
import { AppLayout } from './app/layout/component/app.layout';

export const appRoutes: Routes = [
    {
        path: '',
        component: Landing
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./app/pages/auth/auth.routes')
    },
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./app/pages/dashboard/dashboard')
                        .then(module => module.Dashboard)
            },
            {
                path: 'habits',
                loadComponent: () =>
                    import(
                        './app/app/pages/habits/habit-list/habit-list'
                    ).then(module => module.HabitList)
            },
            {
                path: 'habits/new',
                loadComponent: () =>
                    import(
                        './app/app/pages/habits/habit-form/habit-form'
                    ).then(module => module.HabitForm)
            },
            {
                path: 'habits/:id',
                loadComponent: () =>
                    import(
                        './app/app/pages/habits/habit-detail/habit-detail'
                    ).then(module => module.HabitDetail)
            },
            {
                path: 'daily-record',
                loadComponent: () =>
                    import(
                        './app/app/pages/habits/daily-record/daily-record'
                    ).then(module => module.DailyRecord)
            },
            {
                path: 'statistics',
                loadComponent: () =>
                    import(
                        './app/app/pages/statistics/statistics/statistics'
                    ).then(module => module.Statistics)
            },
            {
                path: 'recommendations',
                loadComponent: () =>
                    import(
                        './app/app/pages/recommendations/recommendations/recommendations'
                    ).then(module => module.Recommendations)
            },
            {
                path: 'recommendations/:id',
                loadComponent: () =>
                    import(
                        './app/app/pages/recommendations/recommendation-detail/recommendation-detail'
                    ).then(module => module.RecommendationDetail)
            },
            {
                path: 'profile',
                loadComponent: () =>
                    import(
                        './app/app/pages/profile/profile/profile'
                    ).then(module => module.Profile)
            }
        ]
    },
    {
        path: 'admin',
        component: AppLayout,
        canActivate: [authGuard, adminGuard],
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            {
                path: 'users',
                loadComponent: () =>
                    import(
                        './app/app/pages/admin/users/user-list/user-list'
                    ).then(module => module.UserList)
            },
            {
                path: 'users/new',
                loadComponent: () =>
                    import(
                        './app/app/pages/admin/users/user-form/user-form'
                    ).then(module => module.UserForm)
            },
            {
                path: 'users/:id',
                loadComponent: () =>
                    import(
                        './app/app/pages/admin/users/user-detail/user-detail'
                    ).then(module => module.UserDetail)
            }
        ]
    },
    {
        path: 'landing',
        component: Landing
    },
    {
        path: 'notfound',
        component: Notfound
    },
    {
        path: '**',
        redirectTo: '/notfound'
    }
];
