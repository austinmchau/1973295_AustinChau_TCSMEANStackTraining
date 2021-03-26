import { Injectable } from '@angular/core';

/**
 * interface representing a contact entry.
 */
export interface Contact {
  fullName: string,
  telNum: string,
}

/**
 * A function for checking whether an object is a Contact.
 * @param obj an object to be checked if it's a contact.
 * @returns true if it is a contact.
 */
function isContact(obj: unknown): obj is Contact {
  return (
    (<Contact>obj).fullName !== undefined && (<Contact>obj).telNum !== undefined
  );
}

/**
 * A service for interacting with the stored contacts. Currently a global contacts for all logged in users.
 */
@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  // Storage constants

  private readonly storageKey = "contacts";
  private get storage() { return sessionStorage; }

  // Constructor

  constructor() { }

  // APIs for interacting with contacts.

  /**
   * Retrieve list of stored contacts
   */
  get contacts(): Contact[] {
    return this.retrieve();
  }

  /**
   * Add a contact into storage.
   * @param contact contact to be added.
   */
  addContact(contact: Contact) {
    this.store(contact);
  }
  
  // Internal method for interacting with backend storage.

  /**
   * Function to retrieve a list of stored contacts.
   * @returns a list of stored contacts.
   */
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

  /**
   * Function to store contacts.
   * @param contacts a variadic list of contacts to be stored.
   */
  private store(...contacts: Contact[]) {
    const existingContacts = this.retrieve();
    const newNames = new Set(contacts.map(c => c.fullName));
    const updatedContacts = [...existingContacts.filter(item => !(item.fullName in newNames)), ...contacts];

    try {
      this.storage.setItem(this.storageKey, JSON.stringify(updatedContacts));
    } catch (error) {
      console.error(error);
      this.storage.removeItem(this.storageKey);
    }
  }
}
