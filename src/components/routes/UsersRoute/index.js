"use strict"

;(() => {
  class UsersRoute extends HTMLElement {
    users = [];
    total = 0;
    page = 1;
    q = '';

    render() {
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
      }

      const {users, total, page} = this;

      this.shadowRoot.innerHTML = users.length ? (`
        ${App.getComponentStyles(this.constructor.name)}
        <section>
          <pagination-element page="${page}" total="${total}"></pagination-element>
          <section class="users-list">
              ${this.usersListHTML}
          </section>
        </section>
      `) : (`
        <p>No User Found</p>
      `);
    }

    get usersListHTML() {
      return this.users.reduce((prev, user) => (`
        ${prev}
        <user-card class="user-card" data-login="${user.login}">
            <img slot="img" src="${user.avatar_url}" width="60">
            <h4 class="login" slot="login">${user.login}</h4>
        </user-card>
      `), '');
    }

    goToUser = (e) => {
      this.removeListeners();

      const {login} = e.detail.currentTarget.dataset;
      window.location.hash = `user/${login}`;
    }

    getUsers = async () => {
      try {
        const {page, q} = this;
        const res = await fetch(`${App.githubApiSearchUrl}/users?q=${q}&page=${page}&per_page=${App.PER_PAGE}`);
        const {total_count, items} = await res.json();
        this.users = items;
        this.total = total_count;
      } catch (e) {
        App.limitError();
      }
    }

    search = async (e) => {
      this.q = e.detail;
      await this.getUsers();
      this.render();
    }

    paginate = async (e) => {
      this.page = e.detail;
      await this.getUsers();
      this.render();
    }

    addListeners() {
      document.addEventListener('gitSearch', this.search);
      document.addEventListener('userCardClick', this.goToUser);
      document.addEventListener('paginate', this.paginate);
    }

    removeListeners() {
      document.removeEventListener('gitSearch', this.search);
      document.removeEventListener('userCardClick', this.goToUser);
      document.removeEventListener('paginate', this.paginate);
    }

    connectedCallback() {
      this.render();
      this.addListeners();
    }

    disconnectedCallback() {
      this.removeListeners();
    }
  }

  customElements.define('users-route', UsersRoute);
})();
