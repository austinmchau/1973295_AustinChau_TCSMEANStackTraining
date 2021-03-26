import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void { }

  onSubmit() {
    console.log("validate form: ", this.loginForm.value);
    [this.username, this.password].forEach(control => {
      if (control.invalid) { control.markAsTouched(); }
    });

    if (this.loginForm.valid) {
      console.log("all valid");
    }
  }

}
