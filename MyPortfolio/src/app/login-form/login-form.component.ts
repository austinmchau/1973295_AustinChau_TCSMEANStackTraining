import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  loginForm = this.fb.group({
    username: ['', { updateOn: 'blur', validators: [Validators.required, Validators.minLength(4)] }],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get msg() { return `${JSON.stringify({ username: this.username.valid, password: this.password.valid })}`; }

  get username() { return this.loginForm.get("username") as FormControl; }
  get password() { return this.loginForm.get("password") as FormControl; }

  get usernameFeedback() {
    return this.username.valid ? "Looks good!" : "Please enter a valid username. Username must be at least 4 characters in length.";
  }

  get passwordFeedback() {
    return this.username.valid ? "Looks good!" : "Please enter a valid password. Username must be at least 8 characters in length.";
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void { }

  onSubmit() {
    console.log("validate form: ", this.loginForm.value);
  }

}
