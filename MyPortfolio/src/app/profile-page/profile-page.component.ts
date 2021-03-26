import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../user-auth.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  username = "Austin";
  loggedIn = (this.userAuth.currentToken !== undefined || this.userAuth.currentToken !== null);

  constructor(private router: Router, private userAuth: UserAuthService) { }

  ngOnInit(): void {
    const currToken = this.userAuth.currentToken;
    this.userAuth.getUser(currToken.username)
      .then(user => user?.firstName ?? "User")
      .then(firstName => this.username = firstName)
      .catch(error => console.error(error))

  }

}
