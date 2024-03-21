function init() {
    setHeader();
}
init();

function setHeader() {
    document.addEventListener('DOMContentLoaded', function() {
        const head = document.getElementsByTagName('head')[0];

        const title = document.createElement('title');
        title.textContent = 'ALGOREALM';
        head.appendChild(title);

        const favicon = document.createElement('link');
        favicon.setAttribute('rel', 'icon');
        favicon.setAttribute('type', 'image/png');
        favicon.setAttribute('href', '../frontend/assets/gemme_logo.png');
        head.appendChild(favicon);
    });
}
