import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  signupForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,12}$")]],
    lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,12}$")]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  divTemplate = [
    { label: "First Name", formControlName: "firstName", autocomplete: "given-name" },
    { label: "Last Name", formControlName: "lastName", autocomplete: "family-name" },
    { label: "Username", formControlName: "username", autocomplete: "username" },
    { label: "Password", formControlName: "password", autocomplete: "current-password" },
  ]

  getControl(key: string) {
    return this.signupForm.get(key) as FormControl;
  }

  get firstName() { return this.signupForm.get("firstName") as FormControl; }
  get lastName() { return this.signupForm.get("lastName") as FormControl; }
  get username() { return this.signupForm.get("username") as FormControl; }
  get password() { return this.signupForm.get("password") as FormControl; }

  feedback(key: string): string {
    const feedbacks: { [key: string]: () => string } = {
      "firstName": () => this.firstName.valid ? "Looks good!" : "Please enter a valid First Name. It can only contain alphabets with a maximum of 12 characters.",
      "lastName": () => this.lastName.valid ? "Looks good!" : "Please enter a valid Last Name. \nIt can only contain alphabets with a maximum of 12 characters.",
      "username": () => this.username.valid ? "Looks good!" : "Please enter a valid username. Username must be at least 4 characters in length.",
      "password": () => this.password.valid ? "Looks good!" : "Please enter a valid password. Username must be at least 8 characters in length.",
    };
    if (!(key in feedbacks)) { console.error("invalid feedback key"); return "" }
    return feedbacks[key]();
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.debug("onSubmit: ", this.signupForm.value);
    let allValid = true;
    [this.firstName, this.lastName, this.username, this.password].forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        allValid = false;
      }
    })

    if (allValid) {
      console.debug("allValid");
    }
  }

}
