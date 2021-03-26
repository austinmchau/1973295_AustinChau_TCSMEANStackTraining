import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { UserAuthService } from '../user-auth.service';

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

  get msg() { return `${JSON.stringify({ username: this.username.valid, password: this.password.valid })}`; }

  get username() { return this.loginForm.get("username") as FormControl; }
  get password() { return this.loginForm.get("password") as FormControl; }

  constructor(private fb: FormBuilder, private userAuth: UserAuthService) { }

  ngOnInit(): void {
    try {
      this.userAuth.addUser({ username: "testing123", password: "12345678" });
    } catch (error) {
      console.debug(error);
    }
  }

  onSubmit() {
    console.debug("validate form: ", this.loginForm.value);
    [this.username, this.password].forEach(control => {
      if (control.invalid) { control.markAsTouched(); }
    });

    if (this.loginForm.valid) {
      console.debug("all valid");

      const identity = {
        username: this.username.value,
        password: this.password.value,
      }

      this.userAuth.authenticate(identity)
        .then(isAuthenticated => {
          console.debug("auth? ", isAuthenticated);
        })
    }
  }

}
