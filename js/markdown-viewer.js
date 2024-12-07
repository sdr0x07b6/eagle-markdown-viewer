const { marked } = require('marked');
const hljs = require('highlight.js');

async function updateTheme(theme) {
  const THEME_SUPPORT = {
    AUTO: eagle.app.isDarkColors() ? 'gray' : 'light',
    LIGHT: 'light',
    LIGHTGRAY: 'lightgray',
    GRAY: 'gray',
    DARK: 'dark',
    BLUE: 'blue',
    PURPLE: 'purple',
  };

  if (!theme) {
    theme =
      typeof eagle.app.theme === 'string'
        ? eagle.app.theme
        : await eagle.app.theme;
  }
  if (!theme) theme = 'DARK';

  const themeName = THEME_SUPPORT[theme.toUpperCase()] ?? 'dark';
  const htmlEl = document.querySelector('html');
  htmlEl.setAttribute('theme', themeName);
}

async function renderMarkdown() {
  const urlParams = new URLSearchParams(window.location.search);
  const filePath = urlParams.get('path');

  fetch(filePath)
    .then((response) => response.text())
    .then((markdown) => {
      const contentEl = document.getElementById('content');
      contentEl.innerHTML = marked(markdown);

      // Highlight code-blocks
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    })
    .catch((error) => {
      console.error('Error loading markdown file:', error);
    });
}

// Listen to plugin creation
eagle.onPluginCreate(async (plugin) => {
  console.log('Plugin created:', plugin);

  await updateTheme();

  renderMarkdown();
});

// Listen to theme changes
eagle.onThemeChanged(async (theme) => {
  console.log(`The theme has been changed to: ${theme}`);

  await updateTheme(theme);
});
