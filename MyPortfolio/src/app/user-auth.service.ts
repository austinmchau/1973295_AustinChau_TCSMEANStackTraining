import { Injectable } from '@angular/core';

export interface AuthIdentity {
  username: string,
  password: string,
}

export class AuthError extends Error {
  constructor(...params: any) {
    super(...params);
    // if (Error.captureStackTrace) { Error.captureStackTrace(this, AuthError); }
    this.name = "AuthError";
  }
}

export class DuplicateUser extends AuthError {
  constructor(...params: any) {
    super("User already exists", ...params);
    this.name = "DuplicateUser";
  }
}

export class RetrieveError extends AuthError {
  constructor(...params: any) {
    super(...params);
    this.name = "RetrieveError";
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private usersStorageKey = "siteUsers";
  private get usersStorage() { return localStorage; }
  private tokenStorageKey = "currUser";
  private get tokenStorage() { return sessionStorage; }

  constructor() { }

  async authenticate(identity: AuthIdentity): Promise<boolean> {
    try {
      const users = await this.retrieve()
      return (identity.username in users && users[identity.username] === identity.password);

    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async addUser(identity: AuthIdentity) {
    try {
      await this.store(identity);
    } catch (error) {
      if (error instanceof RetrieveError) { this.usersStorage.removeItem(this.usersStorageKey); }
      throw error;
    }
  }

  set currentToken(identity: AuthIdentity) {
    this.tokenStorage.setItem(this.tokenStorageKey, JSON.stringify(identity));
  }

  get currentToken(): AuthIdentity {
    return JSON.parse(this.tokenStorage.getItem(this.tokenStorageKey) ?? 'null');
  }

  private async retrieve(): Promise<{ [username: string]: string; }> {
    return new Promise((resolve) => {
      const storedData = this.usersStorage.getItem(this.usersStorageKey) ?? '{}';
      if (!storedData) throw new RetrieveError(`Invalid Stored Data: ${storedData}`);

      const data = JSON.parse(storedData);
      if (!data) throw new RetrieveError(`Invalid parsed data: ${data}`);

      resolve(data);
    })
  }

  private async store(identity: AuthIdentity): Promise<void> {
    this.retrieve()
      .then((data) => {
        if (identity.username in data) throw new DuplicateUser();
        return [data, { [identity.username]: identity.password }];
      })
      .then(([data, newData]) => { return { ...data, ...newData }; })
      .then((newData) => JSON.stringify(newData))
      .then((newData) => {
        this.usersStorage.setItem(this.usersStorageKey, newData);
      })
  }
}
