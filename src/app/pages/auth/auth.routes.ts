import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { Register } from './register';
import { ForgotPassword } from './forgot-password';

export default [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'forgot-password',
        component: ForgotPassword
    },
    {
        path: 'access',
        component: Access
    },
    {
        path: 'error',
        component: Error
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
] as Routes;
