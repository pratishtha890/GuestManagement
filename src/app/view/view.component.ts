import { Component, OnInit } from '@angular/core';
import { Student } from '../students';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  students: Student[] = [];
  errorMessage: string = '';
  showModal: boolean = false;
  selectedPhotoUrl: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  async ngOnInit() {
    this.fetchStudents();
  }

  async fetchStudents() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        this.students = [];
        this.firestore.collection<Student>('students', ref => ref.where('adminId', '==', user.uid))
          .valueChanges({ idField: 'id' }).subscribe(data => {
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
  }

  viewPhoto(photoUrl: string) {
    this.selectedPhotoUrl = photoUrl;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedPhotoUrl = null;
  }

  async deleteStudent(studentId: string) {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const studentDoc = await this.firestore.collection('students').doc(studentId).ref.get();
        if (studentDoc.exists && (studentDoc.data() as Student).adminId === user.uid) { // Type assertion
          if (confirm('Are you sure you want to delete this student?')) {
            await this.firestore.collection('students').doc(studentId).delete();
            console.log('Student deleted successfully');
            this.fetchStudents(); // Refresh the list after deletion
          }
        } else {
          this.errorMessage = 'You are not authorized to delete this student.';
        }
      } else {
        this.errorMessage = 'No admin user is currently logged in.';
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      this.errorMessage = 'Error deleting student. Please try again.';
    }
  }

  editStudent(student: Student) {
    this.router.navigate(['/register'], { queryParams: { id: student.id } });
  }
}
