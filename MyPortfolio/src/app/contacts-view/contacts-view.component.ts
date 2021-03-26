import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../contacts.service';

/**
 * Component for the contact listing table.
 */
@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.css'],
  providers: [ContactsService]
})
export class ContactsViewComponent implements OnInit {

  /**
   * Getter for all stored contacts sorted by name ascending.
   */
  get contacts() {
    return this.contactsService.contacts.sort((a, b) => a.fullName.localeCompare(b.fullName));
  }

  constructor(private contactsService: ContactsService) { }

  ngOnInit(): void { }

}
