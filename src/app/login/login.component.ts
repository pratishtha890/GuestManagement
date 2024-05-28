import { error } from 'console';
import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private authservice :AuthService,private router:Router){}
  email:string='';
  password :string ='';
  login()
  {
    this.authservice.login(this.email,this.password).then(res=>{
      console.log("logged in",res);
      this.router.navigateByUrl('/landing');
    }).catch(error=>{console.error("error",error);
    console.log(error);
      });
    }

  }


