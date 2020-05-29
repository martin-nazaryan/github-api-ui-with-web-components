"use strict"

;(() => {
  class UserCard extends HTMLElement {
    render() {
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
      }

      this.shadowRoot.innerHTML = `
        ${App.getComponentStyles(this.constructor.name)}
        <section class="user-card">
            <slot name="img"></slot>
            <slot name="login"></slot>
        </section>
      `;
    }

    dispatchClick = (e) => {
      document.dispatchEvent(new CustomEvent('userCardClick', {detail: e || null}));
    }

    connectedCallback() {
      this.render();
      this.addEventListener('click', this.dispatchClick);
    }

    disconnectedCallback() {
      this.removeEventListener('click', this.goToUser);
    }
  }

  customElements.define('user-card', UserCard);
})();
