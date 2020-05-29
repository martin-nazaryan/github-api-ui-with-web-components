"use strict"

;(() => {
  class UserRoute extends HTMLElement {
    user = [];
    repos = [];
    page = 1;
    total = 0;

    get reposListHTML() {
      const repos = this.repos.reduce((prev, repo) => (`
        ${prev}
        <article>
          <h3>${repo.name || ''}</h3>
        </article>
      `), '');

      return `
        <pagination-element page="${this.page}" total="${this.total}"></pagination-element>
        ${repos}
      `
    }

    render() {
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
      }

      const {user, repos} = this;

      this.shadowRoot.innerHTML = `
        ${App.getComponentStyles(this.constructor.name)}
        <section>
          <button class="back-button">⬅️ Users</button>
          <section class="info-container">
            <user-card>
              <img slot="img" src="${user.avatar_url}" width="60">
              <h4 class="login" slot="login">${user.login}</h4>               
            </user-card>
            
            <article class="user-info-container">
              <h3>Info</h3>
              <ul>
                <li>Name: ${user.name || ''}</li>
                <li>Bio: ${user.bio || ''}</li>
                <li>Location: ${user.location || ''}</li>
                <li>Followers: ${user.followers || 0}</li>
                <li>Following: ${user.following || 0}</li>
                <li>Repos: ${user.public_repos || 0}</li>
              </ul>
            </article>
          </section>
          <section>
              <article class="repos-container">
                  <h3>Repos</h3>
                  ${repos.length ? this.reposListHTML : '<p>No public repos</p>'}
              </article>
          </section>
        </section>
      `;

      this.shadowRoot.querySelector('.back-button').onclick = this.backToUsers;
    }

    async getUser() {
      try {
        const userRes = await fetch(`${App.githubUserUrl}/${App.hash.path}`);
        this.user = await userRes.json();
      } catch (e) {
        App.limitError();
      }
    }

    async getUserRepos() {
      try {
        const {page} = this;
        let url = `${App.githubApiSearchUrl}/repositories?q=user:${App.hash.path}&page=${page}&per_page=${App.PER_PAGE}`;
        const res = await fetch(url);
        const {items, total_count} = await res.json();
        this.repos = items || [];
        this.total = total_count;
      } catch (e) {
        App.limitError();
      }
    }

    paginate = async (e) => {
      this.page = e.detail;
      await this.getUserRepos();
      this.render();
    }

    backToUsers = () => window.location.hash = 'users';

    addListeners() {
      document.addEventListener('paginate', this.paginate);
    }

    removeListeners() {
      document.removeEventListener('paginate', this.paginate);
    }

    async connectedCallback() {
      await this.getUser();
      await this.getUserRepos();
      this.render();
      this.addListeners();
    }

    disconnectedCallback() {
      this.removeListeners();
    }
  }

  customElements.define('user-route', UserRoute);
})();
