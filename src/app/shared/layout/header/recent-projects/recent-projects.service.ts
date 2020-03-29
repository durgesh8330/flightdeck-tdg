import {Injectable} from '@angular/core';

@Injectable()
export class RecentProjectsService {
  projects:any;

  constructor() {
    this.projects = [
      {
        "href": "/",
        "title": "Searched for Task"
      },
      {
        "href": "/",
        "title": "Launched Dashboard"
      },
      {
        "href": "/",
        "title": "Launched My Profile"
      }
    ]

  }

  getProjects() {
    return this.projects
  }

  clearProjects() {
    this.projects = []
  }

}
