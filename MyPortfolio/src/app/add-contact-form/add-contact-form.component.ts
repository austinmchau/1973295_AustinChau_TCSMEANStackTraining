import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-add-contact-form',
  templateUrl: './add-contact-form.component.html',
  styleUrls: ['./add-contact-form.component.css'],
  providers: [ContactsService]
})
export class AddContactFormComponent implements OnInit {

  addContactForm = this.fb.group({
    contactName: ['', [Validators.required, Validators.minLength(2)]],
    telNum: ['', [Validators.required, Validators.pattern(/[0-9]{3}-[0-9]{3}-[0-9]{4}/)]],
  });

  get contactName() { return this.addContactForm.get("contactName") as FormControl; }
  get telNum() { return this.addContactForm.get("telNum") as FormControl; }

  constructor(private fb: FormBuilder, private contactsService: ContactsService) { }

  ngOnInit(): void { }

  onSubmit() {
    const invalids = [this.contactName, this.telNum].filter(contact => contact.invalid);

    if (invalids.length) {
      invalids.forEach(control => control.markAsTouched());
    } else {
      const contact = {
        fullName: this.contactName.value,
        telNum: this.telNum.value,
      }
      this.contactsService.addContact(contact);
    }
  }
}
