import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrl: './notify.component.css'
})
export class NotifyComponent {
  notificationForm: FormGroup;
  students$: Observable<any[]>;

  constructor(private fb: FormBuilder, private db: AngularFireDatabase) {
    this.notificationForm = this.fb.group({
      subject: ['', Validators.required],
      message: ['', Validators.required],
      recipients: ['', Validators.required]
    });

    // Fetch registered students from Firebase
    this.students$ = this.db.list('students').valueChanges();
  }

  ngOnInit(): void {
    this.students$.subscribe(students => {
      const emailList = students.map((student: any) => student.email).join(', ');
      this.notificationForm.controls['recipients'].setValue(emailList);
    });
  }

  onSubmit() {
    if (this.notificationForm.valid) {
      const formValue = this.notificationForm.value;
      this.sendEmail(formValue.subject, formValue.message, formValue.recipients);
    }
  }

  sendEmail(subject: string, message: string, recipients: string) {
    const payload = { subject, message, email: recipients };
    fetch('https://us-central1-test1-59d1e.cloudfunctions.net/sendEmailNotification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      console.log('Success:', data);
      alert('Email sent ');
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error sending email: ' + error.message);
    });
  }
  
}
