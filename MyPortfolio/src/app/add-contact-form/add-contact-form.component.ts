import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-contact-form',
  templateUrl: './add-contact-form.component.html',
  styleUrls: ['./add-contact-form.component.css']
})
export class AddContactFormComponent implements OnInit {

  addContactForm = this.fb.group({
    contactName: ['', Validators.required],
    telNum: ['', [Validators.required, Validators.pattern(/[0-9]{3}-[0-9]{3}-[0-9]{4}/)]],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit() {

  }
}
