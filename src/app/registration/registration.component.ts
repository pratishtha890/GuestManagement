import { Component, Input, SimpleChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Student } from '../students';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})

export class RegistrationComponent {
 


isEdit: boolean = false;
  student: Student = {
    id:'',
    name: '',
    email: '',
    rent: 0,
    address:'',
    photo: '',
    phoneNumber:'',
    leaseAgreement: '',
    startDate: new Date()
  };
  successMessage: string = '';
  errorMessage: string = '';
  photo: File | null = null;
  leaseAgreement: File | null = null;
 
  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private storage :AngularFireStorage
  ) 
   
  {}
  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    if (fileType === 'photo') {
      this.photo = file;
    } else if (fileType === 'leaseAgreement') {
      this.leaseAgreement = file;
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
    if (!this.photo || !this.leaseAgreement) {
      this.errorMessage = 'Please upload both photo and lease agreement.';
      return;
    }

    try {
      const user = await this.afAuth.currentUser;
      if (user) {
         
        const photoPath = `photos/${this.student.email}_${this.photo.name}`;
        const leaseAgreementPath = `leaseAgreements/${this.student.email}_${this.leaseAgreement.name}`;
        
        const photoUrl = await this.uploadFile(this.photo, photoPath);
        const leaseAgreementUrl = await this.uploadFile(this.leaseAgreement, leaseAgreementPath);

        this.student.photo = photoUrl;
        this.student.leaseAgreement = leaseAgreementUrl;
        this.student.adminId = user.uid;
   
    
            if (this.isEdit) {
              // Update existing student
              await this.firestore.collection('students').doc(this.student.id).update(this.student);
              console.log('Student updated successfully');
              this.successMessage = 'Student updated successfully';
            } else {
              // Add new student
              this.isEdit=false;
              const docRef = await this.firestore.collection('students').add(this.student);
              this.student.id = docRef.id;
              await this.firestore.collection('students').doc(docRef.id).update({ id: docRef.id });
              console.log('Student registered successfully with ID:', docRef.id);
              this.successMessage = 'Student registered successfully';
            }
    
        this.errorMessage = '';

        // Reset form
        this.student = {
          phoneNumber:'',
          id:'',
          name: '',
          email: '',
          rent: 0,
          address: '',
          photo: '',
          leaseAgreement: '',
          startDate: new Date()
        };
       this.photo = null;
       this.leaseAgreement = null;

        // Reset file inputs
        (document.getElementById('photo') as HTMLInputElement).value = '';
        (document.getElementById('leaseAgreement') as HTMLInputElement).value = '';

        console.log("registered");
      } else {
        this.errorMessage = 'No admin user is currently logged in.';
      }
    } catch (error) {
      console.error('Error registering student:', error);
      this.errorMessage = 'Error registering student. Please try again.';
    }
  }
  }

