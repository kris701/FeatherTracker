import { Routes } from '@angular/router';
import { Login } from './auth.login';
import { SignUp } from './auth.signup';
import { ResetPassword } from './auth.resetpassword';

export default [
    { path: '', component: Login },
    { path: 'signup', component: SignUp },
    { path: 'resetpassword', component: ResetPassword }
] as Routes;
