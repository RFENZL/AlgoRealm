function init() {
    initBackButton();
    keyBinding();
    initSaveButton();
    displaySavedKeys()
}
init();


function initBackButton() {
    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

function keyBinding() {
    const keyInputs = document.querySelectorAll('.key-input');
    const resetButtons = document.querySelectorAll('.reset-button');

    resetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const keyId = this.getAttribute('data-key');
            const correspondingInput = document.getElementById(keyId + '-key');
            correspondingInput.value = '';
        });
    });

    keyInputs.forEach(input => {
        input.addEventListener('keydown', function(event) {
            event.preventDefault();
            this.value = event.key.toUpperCase();
        });
    });
}

function initSaveButton() {
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', function() {
        const upKey = document.getElementById('up-key').value;
        const downKey = document.getElementById('down-key').value;
        const leftKey = document.getElementById('left-key').value;
        const rightKey = document.getElementById('right-key').value;

        localStorage.setItem('customKeys', JSON.stringify({
            up: upKey,
            down: downKey,
            left: leftKey,
            right: rightKey
        }));

        showConfirmation();
    });
}

function displaySavedKeys() {
    const savedKeys = JSON.parse(localStorage.getItem('customKeys'));
    if (savedKeys) {
        document.getElementById('up-key').value = savedKeys.up;
        document.getElementById('down-key').value = savedKeys.down;
        document.getElementById('left-key').value = savedKeys.left;
        document.getElementById('right-key').value = savedKeys.right;
    }
}

function showConfirmation() {
    // Créer un nouvel élément div
    const confirmation = document.createElement('div');

    // Ajouter du texte à l'élément div
    confirmation.textContent = 'Paramètres enregistrés avec succès !';

    // Ajouter des styles à l'élément div
    confirmation.style.position = 'fixed';
    confirmation.style.top = '50%';
    confirmation.style.left = '50%';
    confirmation.style.transform = 'translate(-50%, -50%)';
    confirmation.style.padding = '30px';
    confirmation.style.backgroundColor = 'green';
    confirmation.style.color = 'white';
    confirmation.style.textAlign = 'center';
    confirmation.style.borderRadius = '30px';

    // Ajouter l'élément div au body
    document.body.appendChild(confirmation);

    // Supprimer l'élément div après 3 secondes
    setTimeout(() => {
        document.body.removeChild(confirmation);
    }, 3000);
}