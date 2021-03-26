import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../user-auth.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  /**
   * name for the welcome message.
   */
  username = "User";
  /**
   * boolean for whether a valid user is logged in.
   */
  loggedIn = false;

  constructor(private router: Router, private userAuth: UserAuthService) { }

  ngOnInit(): void {
    const currToken = this.userAuth.currentToken;
    if (currToken !== null) {
      this.userAuth.getUser(currToken.username)
        .then(user => user?.firstName ?? "User")
        .then(firstName => this.username = firstName)
        .then(() => this.loggedIn = true)
        .catch(error => console.error(error))
    }
  }

}
