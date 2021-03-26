import { Injectable } from '@angular/core';

/**
 * Define an interface for an auth token.
 */
export interface AuthIdentity {
  username: string,
  password: string,
}

/**
 * Define an interface for a user.
 */
export interface User extends AuthIdentity {
  firstName: string,
  lastName: string,
}

/**
 * Define a base error for authentication.
 */
export class AuthError extends Error {
  constructor(...params: any) {
    super(...params);
    this.name = "AuthError";
  }
}

/**
 * Define an error for when a user being added already exists.
 */
export class DuplicateUser extends AuthError {
  constructor(...params: any) {
    super("User already exists", ...params);
    this.name = "DuplicateUser";
  }
}

/**
 * Define an error when retrieving user list fails.
 */
export class RetrieveError extends AuthError {
  constructor(...params: any) {
    super(...params);
    this.name = "RetrieveError";
  }
}

/**
 * A service for authenticating user for login.
 */
@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  // Storage constants

  private usersStorageKey = "siteUsers";
  private get usersStorage() { return localStorage; }
  private tokenStorageKey = "currUser";
  private get tokenStorage() { return sessionStorage; }

  // Constructor

  constructor() { }

  // APIs for auth

  /**
   * Function to authenticate an identity against a stored list of users based on username and password.
   * @param identity an identity which to be authenticated with.
   * @returns a promise that specifies whether identity is authenticated or not.
   */
  async authenticate(identity: AuthIdentity): Promise<boolean> {
    try {
      const users = await this.retrieve()
      return (identity.username in users && users[identity.username].password === identity.password);

    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Function to add a new signed up user to user list.
   * @param identity a user object to be added to a list of users.
   */
  async addUser(identity: User) {
    try {
      await this.store(identity);
    } catch (error) {
      if (error instanceof RetrieveError) { this.usersStorage.removeItem(this.usersStorageKey); }
      throw error;
    }
  }

  /**
   * Function to get a user based on username.
   * @param username a string of the user's username.
   * @returns a promise that returns a match of the user, or null if no match.
   */
  async getUser(username: string): Promise<User | null> {
    return this.retrieve()
      .then(users => username in users ? users[username] : null)
  }

  // Auth Token. Used to store the state of the current authenticated user.

  /**
   * set the current auth token with given identity.
   */
  set currentToken(identity: AuthIdentity | null) {
    if (identity === null) { this.tokenStorage.removeItem(this.tokenStorageKey); }
    else { this.tokenStorage.setItem(this.tokenStorageKey, JSON.stringify(identity)); }
  }

  /**
   * get the current auth token.
   */
  get currentToken(): AuthIdentity | null {
    return JSON.parse(this.tokenStorage.getItem(this.tokenStorageKey) ?? 'null');
  }

  // Internal logic to interact with backend store

  /**
   * Function that retrieves all saved users.
   * @returns a promise that returns an object where the key is the usernames and value is the user.
   */
  private async retrieve(): Promise<{ [username: string]: User; }> {
    return new Promise((resolve) => {
      const storedData = this.usersStorage.getItem(this.usersStorageKey) ?? '{}';
      if (!storedData) throw new RetrieveError(`Invalid Stored Data: ${storedData}`);

      const data = JSON.parse(storedData);
      if (!data) throw new RetrieveError(`Invalid parsed data: ${data}`);

      resolve(data);
    })
  }

  /**
   * A function to add a new user to the storage.
   * @param identity a user to be stored.
   * @returns a promise when storage is complete.
   */
  private async store(identity: User): Promise<void> {
    return this.retrieve()
      .then((data) => {
        if (identity.username in data) throw new DuplicateUser();
        return [data, { [identity.username]: identity }];
      })
      .then(([data, newData]) => ({ ...data, ...newData }))
      .then((newData) => JSON.stringify(newData))
      .then((newData) => {
        this.usersStorage.setItem(this.usersStorageKey, newData);
      })
    // .catch((error) => {
    //   console.debug("caught");
    // })
  }
}
