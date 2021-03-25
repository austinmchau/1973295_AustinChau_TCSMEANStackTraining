import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.css'],
  providers: [ContactsService]
})
export class ContactsViewComponent implements OnInit {

  get contacts() {
    return this.contactsService.contacts.sort((a, b) => a.fullName.localeCompare(b.fullName));
  }

  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void {
  }

}
