import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../students';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  @ViewChild('registerForm') registerForm!: NgForm;
  isEdit: boolean = false;
  minDate: string = '';
  student: Student = {
    id: '',
    name: '',
    email: '',
    rent: 0,
    address: '',
    photo: '',
    phoneNumber: '',
    leaseAgreement: '',
    startDate: new Date()
  };
  successMessage: string = '';
  errorMessage: string = '';
  photo: File | null = null;
  leaseAgreement: File | null = null;
  existingPhotoUrl: string | null = null;
  existingLeaseAgreementUrl: string | null = null;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; 
    this.route.queryParams.subscribe(params => {
      const studentId = params['id'];
      if (studentId) {
        this.isEdit = true;
        this.firestore.collection<Student>('students').doc(studentId).valueChanges().subscribe(student => {
          if (student) {
            this.student = student;
            this.existingPhotoUrl = student.photo;
            this.existingLeaseAgreementUrl = student.leaseAgreement;
          }
        });
      }
    });
  }

  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    if (fileType === 'photo') {
      this.photo = file;
      this.existingPhotoUrl = null; // Clear existing URL if a new file is chosen
    } else if (fileType === 'leaseAgreement') {
      this.leaseAgreement = file;
      this.existingLeaseAgreementUrl = null; // Clear existing URL if a new file is chosen
    }
  }

  async uploadFile(file: File, path: string): Promise<string> {
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, file);
    
    await task.snapshotChanges().pipe(
      finalize(() => console.log('File uploaded successfully!'))
    ).toPromise();

    const downloadURL = await fileRef.getDownloadURL().toPromise();
    return downloadURL;
  }

  async registerStudent() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        if (!this.photo && !this.existingPhotoUrl) {
          this.errorMessage = 'Please upload a photo.';
          return;
        }

        if (!this.leaseAgreement && !this.existingLeaseAgreementUrl) {
          this.errorMessage = 'Please upload a lease agreement.';
          return;
        }

        if (this.photo) {
          const photoPath = `photos/${this.student.email}_${this.photo.name}`;
          this.student.photo = await this.uploadFile(this.photo, photoPath);
        } else if (this.existingPhotoUrl) {
          this.student.photo = this.existingPhotoUrl;
        }

        if (this.leaseAgreement) {
          const leaseAgreementPath = `leaseAgreements/${this.student.email}_${this.leaseAgreement.name}`;
          this.student.leaseAgreement = await this.uploadFile(this.leaseAgreement, leaseAgreementPath);
        } else if (this.existingLeaseAgreementUrl) {
          this.student.leaseAgreement = this.existingLeaseAgreementUrl;
        }

        if (this.isEdit) {
          await this.firestore.collection('students').doc(this.student.id).update(this.student);
          alert('Student updated successfully');
          this.successMessage = 'Student updated successfully';
          this.router.navigate(['/view']);
        } else {
          const docRef = await this.firestore.collection('students').add(this.student);
          this.student.id = docRef.id;
          await this.firestore.collection('students').doc(docRef.id).update({ id: docRef.id });
          alert('Student registered successfully');
          this.successMessage = 'Student registered successfully';
        }
        this.cd.detectChanges();
        this.errorMessage = '';
        this.resetForm();
      } else {
        this.errorMessage = 'No admin user is currently logged in.';
      }
    } catch (error) {
      console.error('Error registering student:', error);
      this.errorMessage = 'Error registering student. Please try again.';
    }
  }

  resetForm() {
    this.student = {
      id: '',
      name: '',
      email: '',
      rent: 0,
      address: '',
      photo: '',
      phoneNumber: '',
      leaseAgreement: '',
      startDate: new Date()
    };
    this.photo = null;
    this.leaseAgreement = null;
    this.existingPhotoUrl = null;
    this.existingLeaseAgreementUrl = null;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm) {
      this.registerForm.resetForm();
    }
  }
}
