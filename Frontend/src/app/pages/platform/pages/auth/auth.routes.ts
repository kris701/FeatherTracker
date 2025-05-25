import { Routes } from '@angular/router';
import { Login } from './auth.login';
import { Register } from './auth.register';

export default [
    { path: '', component: Login },
    { path: 'register', component: Register },
] as Routes;
