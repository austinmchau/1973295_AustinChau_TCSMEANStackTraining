import { Injectable } from '@angular/core';

export interface Contact {
  fullName: string,
  telNum: string,
}

function isContact(obj: unknown): obj is Contact {
  return (
    (<Contact>obj).fullName !== undefined && (<Contact>obj).telNum !== undefined
  );
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private readonly storageKey = "contacts";

  constructor() { }

  get contacts(): Contact[] {
    return this.retrieve();
  }

  addContact(contact: Contact) {
    this.store(contact);
  }

  private get storage() { return sessionStorage; }

  private retrieve(): Contact[] {
    const existingContacts: Contact[] = JSON.parse(
      this.storage.getItem(this.storageKey) ?? "[]"
    );
    if (!(Array.isArray(existingContacts) && existingContacts.every(isContact))) {
      console.error("Contact retrieval receives invalid contacts.", { obj: existingContacts });
      return [];
    } else {
      return existingContacts;
    }
  }
  private store(...contacts: Contact[]) {
    const existingContacts = this.retrieve();
    const newNames = new Set(contacts.map(c => c.fullName));
    const updatedContacts = [...existingContacts.filter(item => !(item.fullName in newNames)), ...contacts];

    console.debug("store: ", contacts, existingContacts, newNames, updatedContacts);

    try {
      this.storage.setItem(this.storageKey, JSON.stringify(updatedContacts));
    } catch (error) {
      console.error(error);
      this.storage.removeItem(this.storageKey);
    }
  }
}
