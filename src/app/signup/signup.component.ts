import { Component } from '@angular/core';
import {Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(private router:Router,private auth:AuthService){}
email:string='';
password : string ='';
errorMessage : string ='';
username :string ='';
conpassword:string ='';
signup(){
  this.auth.signup(this.email,this.password).then(res =>{
    console.log("signed in");
    this.router.navigateByUrl('/login');
  } ).catch(error=>{
    console.error('error signing in');
    this.errorMessage= this.getErrorMessage(error.code);
  })
}
signInWithGoogle() {
  this.auth.signInWithGoogle().then(result => {
    console.log('User signed in:', result);
    this.router.navigateByUrl('/landing');
  }).catch(error => {
    console.error('Error signing in:', error);
  });
}
getErrorMessage(error:string):string
{
  switch (error) {
    case 'auth/email-already-in-use':
      return 'This email address is already in use.';
    case 'auth/invalid-email':
      return 'This email address is invalid.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.';
    case 'auth/weak-password':
      return 'The password is too weak.';
    default:
      return 'An unknown error occurred. Please try again.';
}}
login(){
  this.router.navigateByUrl('/login');
}
}
