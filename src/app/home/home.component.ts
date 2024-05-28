import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}
showmodal:boolean=false;
  openLogoutModal() {
 this.showmodal=true
  }

  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);  // Redirect to login page after logout
      this.showmodal=false;
    }).catch(error => {
      console.error('Logout error', error);
    });
  }
  closeModal(){
    this.showmodal=false;
  }
}
