"use strict"

;(() => {
  class ReposRoute extends HTMLElement {
    repos = [];
    q = '';
    page = 1;
    total = 0;

    render() {
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
      }

      const {repos, page, total} = this;

      this.shadowRoot.innerHTML = repos.length ? (`
        ${App.getComponentStyles(this.constructor.name)}
        <section>
          <pagination-element page="${page}" total="${total}"></pagination-element>
          <section>
            ${this.reposListHTML}
          </section>
        </section>
      `) : (`
        <p>No Repos Found</p>
      `);
    }

    get reposListHTML () {
      return this.repos.reduce((prev, repo) => (`
        ${prev}
        <article>
          <h3>${repo.name || ''}</h3>
        </article>
      `), '')
    }

    paginate = async (e) => {
      this.page = e.detail;
      await this.getRepos();
      this.render();
    }

    async getRepos() {
      try {
        const {page, q} = this;
        let url = `${App.githubApiSearchUrl}/repositories?q=${q}&page=${page}&per_page=${App.PER_PAGE}`;
        const res = await fetch(url);
        const {items, total_count} = await res.json();
        this.repos = items;
        this.total = total_count;
      } catch (e) {
        App.limitError();
      }
    }

    search = async (e) => {
      this.q = e.detail;
      await this.getRepos();
      this.render();
    }

    addListeners() {
      document.addEventListener('gitSearch', this.search);
      document.addEventListener('paginate', this.paginate);
    }

    removeListeners() {
      document.removeEventListener('gitSearch', this.search);
      document.removeEventListener('paginate', this.paginate);
    }

    async connectedCallback() {
      this.addListeners();
      this.render();
    }

    disconnectedCallback() {
      this.removeListeners();
    }
  }

  customElements.define('repos-route', ReposRoute);
})();
