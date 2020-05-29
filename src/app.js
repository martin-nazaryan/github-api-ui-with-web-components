"use strict";

class App {
  static COMPONENTS_MAPPING = {
    AppContent: 'layout/AppContent',
    AppHeader: 'layout/AppHeader',
    UsersRoute: 'routes/UsersRoute',
    UserRoute: 'routes/UserRoute',
    ReposRoute: 'routes/ReposRoute',
    UserCard: 'reuse/UserCard',
    SearchElement: 'reuse/SearchElement',
    PaginationElement: 'reuse/PaginationElement',
  }

  static PER_PAGE = 20;

  static GITHUB_API_URL = 'https://api.github.com';

  static get githubApiSearchUrl() {
    return `${this.GITHUB_API_URL}/search`;
  }

  static get githubUserUrl() {
    return `${this.GITHUB_API_URL}/users`;
  }

  static get hash() {
    const [route, path] = window.location.hash.replace('#', '').split('/');
    return {
      route,
      path
    }
  }

  static getComponentStyles(name) {
    const path = this.COMPONENTS_MAPPING[name];
    return `<link rel="stylesheet" href="src/components/${path}/style.css" />`
  }

  static limitError () {
    alert('Github api limit has expired, try later.');
  }
}

window.location.hash = 'users';
