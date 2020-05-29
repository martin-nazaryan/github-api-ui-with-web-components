for (const key in App.COMPONENTS_MAPPING) {
  const script = document.createElement("script");
  script.src = `src/components/${App.COMPONENTS_MAPPING[key]}/index.js`;
  document.head.appendChild(script);
}
