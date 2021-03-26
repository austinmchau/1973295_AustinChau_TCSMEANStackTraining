import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthError, AuthIdentity, DuplicateUser, UserAuthService } from '../user-auth.service';

/**
 * A component for the login form.
 */
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  /**
   * reference to the form.
   */
  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  // convenience getter for the FormControl

  get username() { return this.loginForm.get("username") as FormControl; }
  get password() { return this.loginForm.get("password") as FormControl; }

  /**
   * object for the message when user submits form.
   */
  loginMessage: { msg: string, valid: boolean } | null = null;
  
  /**
   * A function for setting loginMessage that would show when user submit the form.
   * @param signal an enum for getting a valid loginMessage.
   * @param identity an optional identity for formatting the message.
   */
  setLoginMessage(signal: "success" | "authError" | null, identity?: AuthIdentity) {
    if (signal === "success" && (identity === undefined)) throw new Error("Missing identity in setLoginMessage");
    this.loginMessage = (() => {
      switch (signal) {
        case "success": return { msg: `Welcome back, ${identity?.username ?? "user"}! Logging in...`, valid: true };
        case "authError": return { msg: "Incorrect login credentials. Please try again.", valid: false };
        default: return null;
      }
    })();
  }

  constructor(private fb: FormBuilder, private router: Router, private userAuth: UserAuthService) { }

  ngOnInit(): void { }

  /**
   * Function for when user submit form. Validate and navigate to profile page.
   */
  onSubmit() {
    this.loginMessage = null;

    const invalids = [this.username, this.password].filter(control => control.invalid);

    invalids.forEach(control => {
      control.markAsTouched();
    });

    if (!invalids.length) {
      const identity = {
        username: this.username.value,
        password: this.password.value,
      }

      this.userAuth.authenticate(identity)
        .then(isAuthenticated => {
          if (isAuthenticated) {
            this.userAuth.currentToken = identity;
            this.setLoginMessage("success", identity);
          } else {
            this.setLoginMessage("authError", identity);
            throw new AuthError();
          }
        })
        .then(() => new Promise(resolve => setTimeout(resolve, 1500)))
        .then(() => this.router.navigate(["/profile"]))
        .catch(error => {
          if (error instanceof AuthError) return;
        })
    }
  }

}
