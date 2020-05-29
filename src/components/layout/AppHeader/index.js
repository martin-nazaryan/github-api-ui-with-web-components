"use strict"

;(() => {
  class AppHeader extends HTMLElement {
    static get observedAttributes() {
      return ['active'];
    }

    render() {
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
      }

      const active = this.getAttribute('active');

      this.shadowRoot.innerHTML = `
        ${App.getComponentStyles(this.constructor.name)}
        <header>
          <section>
            <h3 class="logo">Martin's GitHub</h3>
          </section>       
          <nav>
            <ul>
              <li class="${active === 'users' ? 'active' : ''}" data-route="users">Users</li>
              <li class="${active === 'repos' ? 'active' : ''}" data-route="repos">Repos</li>
            </ul>         
          </nav>
        </header>
      `;

      const list = [...this.shadowRoot.querySelectorAll('li:not(.active)')];
      list.forEach((elem) => elem.onclick = this.goToRoute);
      this.shadowRoot.querySelector('.logo').onclick = this.goToRoute
    }

    goToRoute = (e) => {
      const {dataset: {route}} = e.currentTarget;
      this.setAttribute('active', route || 'users');
      window.location.hash = route || 'users';
    }

    connectedCallback() {
      this.setAttribute('active', App.hash.route);
      this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  }

  customElements.define('app-header', AppHeader);
})();
