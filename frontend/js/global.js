function init() {
    setHeader();
    createNavbar();
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
        favicon.setAttribute('href', '../frontend/assets_old/main_menu/logos/gemme_logo.png');
        head.appendChild(favicon);

        const navbarStyle = document.createElement('link');
        navbarStyle.setAttribute('rel', 'stylesheet');
        navbarStyle.setAttribute('href', '../frontend/css/navbar.css');
        head.appendChild(navbarStyle);
    });
}

function createNavbar() {
    document.addEventListener('DOMContentLoaded', function() {
        const navbar = document.createElement('div');
        navbar.innerHTML = `
            <nav class="navbar">
                <ul class="navbar-list">
                    <li class="navbar-item"><a href="/index.html" class="navbar-link">Home</a></li>
                    <li class="navbar-item"><a href="/game.html" class="navbar-link">Game</a></li>
                    <li class="navbar-item"><a href="/option.html" class="navbar-link">Options</a></li>
                </ul>
            </nav>
        `;
        document.body.insertBefore(navbar, document.body.firstChild);
    });
}
