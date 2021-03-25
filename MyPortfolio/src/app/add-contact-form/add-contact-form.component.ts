import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-add-contact-form',
  templateUrl: './add-contact-form.component.html',
  styleUrls: ['./add-contact-form.component.css'],
  providers: [ContactsService]
})
export class AddContactFormComponent implements OnInit {

  addContactForm = this.fb.group({
    contactName: ['', Validators.required],
    telNum: ['', [Validators.required, Validators.pattern(/[0-9]{3}-[0-9]{3}-[0-9]{4}/)]],
  });

  constructor(private fb: FormBuilder, private contactsService: ContactsService) { }

  ngOnInit(): void { }

  onSubmit() {
    let contactName = this.addContactForm.get("contactName")?.value;
    let telNum = this.addContactForm.get("telNum")?.value;

    console.log("got values: ", contactName, telNum);
    this.contactsService.addContact({fullName: contactName, telNum: telNum});
  }
}
