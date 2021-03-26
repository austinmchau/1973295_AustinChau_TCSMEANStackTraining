import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthError, AuthIdentity, DuplicateUser, UserAuthService } from '../user-auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  get username() { return this.loginForm.get("username") as FormControl; }
  get password() { return this.loginForm.get("password") as FormControl; }

  loginMessage: { msg: string, valid: boolean } | null = null;
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

  ngOnInit(): void {
    // this.userAuth.addUser({ username: "testing123", password: "12345678" })
    //   .catch(error => {
    //     if (error instanceof DuplicateUser) return;
    //     console.debug(error);
    //   })
  }

  onSubmit() {
    console.debug("validate form: ", this.loginForm.value);
    this.loginMessage = null;

    const invalids = [this.username, this.password].filter(control => control.invalid);

    invalids.forEach(control => {
      control.markAsTouched();
    });

    if (!invalids.length) {
      console.debug("all valid");

      const identity = {
        username: this.username.value,
        password: this.password.value,
      }

      this.userAuth.authenticate(identity)
        .then(isAuthenticated => {
          console.debug("auth? ", isAuthenticated);
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
