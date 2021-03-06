import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DuplicateUser, UserAuthService } from '../user-auth.service';

/**
 * Component for the signup form.
 */
@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  // instance variables

  /**
   * reference to the form using FormBuilder
   */
  signupForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,12}$")]],
    lastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,12}$")]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  /**
   * A list of attributes used for the FormArray to generate the list of input fields.
   */
  divTemplate = [
    { label: "First Name", inputType: "text", formControlName: "firstName", autocomplete: "given-name" },
    { label: "Last Name", inputType: "text", formControlName: "lastName", autocomplete: "family-name" },
    { label: "Username", inputType: "text", formControlName: "username", autocomplete: "username" },
    { label: "Password", inputType: "password", formControlName: "password", autocomplete: "current-password" },
  ]

  /**
   * A convenience function to get the FormControl using its formControlName.
   * @param key the formControlName for the control.
   * @returns The FormControl.
   */
  getControl(key: string) {
    return this.signupForm.get(key) as FormControl;
  }

  // Convenience getters for the FormControls.

  get firstName() { return this.signupForm.get("firstName") as FormControl; }
  get lastName() { return this.signupForm.get("lastName") as FormControl; }
  get username() { return this.signupForm.get("username") as FormControl; }
  get password() { return this.signupForm.get("password") as FormControl; }

  /**
   * A function that takes in a formControlName and returns a feedback string based on whether the control is valid or not.
   * @param key the formControlName for a specific valid/invalid-feedback template.
   * @returns a valid/invalid feedback string.
   */
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

  /**
   * A Message object to be displayed for when the user submit the form.
   */
  signupMessage: { msg: string, valid: boolean } | null = null;

  /**
   * A function to get a valid signupMessage, which tells the html to display a valid message using correct valid/invalid format when user clicks submit.
   * @param signal an enum of signals that returns a valid signupMessage object. 
   */
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

  /**
   * Function for the form onSubmit(). Validates then navigates to the profile page.
   */
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
