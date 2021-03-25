import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacts-view',
  templateUrl: './contacts-view.component.html',
  styleUrls: ['./contacts-view.component.css']
})
export class ContactsViewComponent implements OnInit {

  contacts = [
    {name: "Amy", telNum: "800-555-1234"},
    {name: "Bob", telNum: "800-555-2345"},
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
