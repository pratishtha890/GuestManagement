import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Student } from './students';

@Injectable({
  providedIn: 'root'
})
export class StudentDataShareService {

  private studentSource = new BehaviorSubject<Student | null>(null);
  currentStudent = this.studentSource.asObservable();

  constructor() {}

  changeStudent(student: Student) {
    this.studentSource.next(student);
  }
  resetStudent() {
    this.studentSource.next(null);
  }
}
