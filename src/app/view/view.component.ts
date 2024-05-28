//import { Student } from './../students';
import { Component, EventEmitter, Output } from '@angular/core';
import { Student } from '../students';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { Router } from '@angular/router';
import { StudentDataShareService } from '../student-data-share.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {

//  @Output() public  = new EventEmitter<any>();
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private functions: AngularFireFunctions,
    private router :Router,
    private studentService:StudentDataShareService
  ) {}
  students: Student[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  selectedPhotoUrl: string | null = null;
  async ngOnInit() {
 
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        this.firestore.collection<Student>('students', ref => ref.where('adminId', '==', user.uid))
          .valueChanges().subscribe(data => {
            this.students = data;
          }, error => {
            this.errorMessage = 'Error fetching students. Please try again.';
            console.error('Error fetching students:', error);
          });
      } else {
        this.errorMessage = 'No admin user is currently logged in.';
      }
    } catch (error) {
      this.errorMessage = 'Error fetching students. Please try again.';
      console.error('Error fetching students:', error);
    }
    this.fetchStudents();
  }
  viewPhoto(photoUrl: string) {
    this.selectedPhotoUrl = photoUrl;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedPhotoUrl = null;
  }
  editStudent(student: Student) {
    this.router.navigate(['/register']);
  

  }
  deleteStudent(studentId: string) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.firestore.collection('students').doc(studentId).delete().then(() => {
        console.log('Student deleted successfully');
        this.fetchStudents(); // Refresh the list after deletion
      }).catch(error => {
        console.error('Error deleting student:', error);
        this.errorMessage = 'Error deleting student. Please try again.';
      });
    }}
    fetchStudents() {
      this.firestore.collection<Student>('students').valueChanges({ idField: 'id' }).subscribe(
        data => {
          this.students = data;
        },
        error => {
          console.error('Error fetching students:', error);
          this.errorMessage = 'Error fetching students. Please try again.';
        }
      );
    }
/*  sendSmsReminder(student: Student) {
    this.emailReminderService.sendReminder(student.email,student.name,student.rent)
    .subscribe(
      response => console.log('Email sent successfully', response),
      
      error => console.error('Error sending email', error)
    );*/
 //   const sendEmailReminder = this.functions.httpsCallable('sendEmailReminder');
 //   sendEmailReminder({ email: student.email, name: student.name, rent: student.rent }).subscribe(response => {
 //     console.log('SMS reminder sent', response);
  //    alert('SMS reminder sent successfully!');
    //}, error => {
      //console.error('Error sending SMS reminder', error);
    //  alert('Error sending email reminder. Please try again.');
    //});
//}
}
