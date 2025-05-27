import { Routes } from '@angular/router';
import { Login } from './auth.login';
import { SignUp } from './auth.signup';

export default [
    { path: '', component: Login },
    { path: 'signup', component: SignUp }
] as Routes;
