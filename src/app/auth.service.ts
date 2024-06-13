import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth : AngularFireAuth) { }

  async signup(email:string ,password :string)
  {
return await this.auth.createUserWithEmailAndPassword(email,password);
  }
async login(email:string,password:string)
{
  return await this.auth.signInWithEmailAndPassword(email,password);
}
async logout()
{
  return await this.auth.signOut();
}
signInWithGoogle() {
  return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
}
getUser() {
  return this.auth.user;
}
}
