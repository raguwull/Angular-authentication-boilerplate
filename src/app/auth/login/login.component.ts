import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function isEmailUnique(control: AbstractControl) {
  if (control.value != 'test@gmail.com') {
    return of(null);
  }
  return of({ EmailNotUnique: true });
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [isEmailUnique],
    }),
    password: new FormControl('', {
      validators: [Validators.minLength(6), Validators.required],
    }),
  });

  ngOnInit(): void {
    const savedForm = window.localStorage.getItem('saved-form');

    if (savedForm) {
      const loadedData = JSON.parse(savedForm);
      this.form.patchValue({
        email: loadedData.email,
      });
    }
    
    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-form',
            JSON.stringify({ email: value.email })
          );
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  isEmailInValid() {
    return (
      this.form.controls.email.invalid &&
      this.form.controls.email.touched &&
      this.form.controls.email.dirty
    );
  }
  isPasswordInValid() {
    return (
      this.form.controls.email.invalid &&
      this.form.controls.email.touched &&
      this.form.controls.email.dirty
    );
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value.email + ' ' + this.form.value.password);
  }
}
