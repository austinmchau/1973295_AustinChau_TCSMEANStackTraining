import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DuplicateUser, UserAuthService } from '../user-auth.service';

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
    { label: "First Name", inputType: "text", formControlName: "firstName", autocomplete: "given-name" },
    { label: "Last Name", inputType: "text", formControlName: "lastName", autocomplete: "family-name" },
    { label: "Username", inputType: "text", formControlName: "username", autocomplete: "username" },
    { label: "Password", inputType: "password", formControlName: "password", autocomplete: "current-password" },
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
      "firstName": () => this.firstName.valid ? "Looks good!" : "Please enter a valid First Name. \n It can only contain alphabets with a maximum of 12 characters.",
      "lastName": () => this.lastName.valid ? "Looks good!" : "Please enter a valid Last Name. \n It can only contain alphabets with a maximum of 12 characters.",
      "username": () => this.username.valid ? "Looks good!" : "Please enter a valid username. \n Username must be at least 4 characters in length.",
      "password": () => this.password.valid ? "Looks good!" : "Please enter a valid password. \n Password must be at least 8 characters in length.",
    };
    if (!(key in feedbacks)) { console.error("invalid feedback key"); return "" }
    return feedbacks[key]();
  }

  signupMessage: { msg: string, valid: boolean } | null = null;
  setSignupMessage(signal: "success" | "duplicateUser" | null) {
    this.signupMessage = (() => {
      switch (signal) {
        case "success": return { msg: "You're signed up! Redirecting...", valid: true };
        case "duplicateUser": return { msg: "The username is taken.", valid: false };
        default: return null;
      }
    })();
  }

  constructor(private fb: FormBuilder, private router: Router, private userAuth: UserAuthService) { }

  ngOnInit(): void { }

  onSubmit() {
    console.debug("onSubmit: ", this.signupForm.value);

    const invalids = [this.firstName, this.lastName, this.username, this.password].filter(control => control.invalid)

    if (invalids.length) {
      invalids.forEach(control => {
        control.markAsTouched();
        control.markAsDirty();
      })
    } else {
      console.debug("allValid");
      const user = {
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        username: this.username.value,
        password: this.password.value,
      }
      this.userAuth.addUser(user)
        .then(() => this.setSignupMessage("success"))
        .then(() => new Promise(resolve => setTimeout(resolve, 1500)))
        .then(() => this.router.navigate(['/login']))
        .catch(error => {
          if (error instanceof DuplicateUser) this.setSignupMessage("duplicateUser");
        })
    }
  }

}
