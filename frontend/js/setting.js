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

        alert('Touches sauvegardées avec succès!');
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
