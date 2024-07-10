function solution() {
    let somme = 0;
    for(var i = 1; i <= 10; i++) {
        if (i % 2 === 0) {
            somme += i;
        }
    }
    return somme;
}

function testEnigme() {
    let code = document.getElementById("terminal").value;
    let outputDiv = document.getElementById("Console");

    try {
        if (code.includes('for(') && code.includes('%')) {
            let func = new Function(code);
            let result = func();

            if (result === solution()) {
                outputDiv.textContent = "Console: Enigme résolue";
                setTimeout(() => window.close(), 2000);
                localStorage.setItem('enigmeSolved', 'true');
            } else {
                outputDiv.textContent = "Console: Mauvaise réponse";
            }
        } else {
            outputDiv.textContent = "Console: Le code doit contenir un 'for' et utiliser l'opérateur modulo '%'.";
        }
    } catch (error) {
        outputDiv.textContent = "Console: Erreur - " + error.message;
    }
}

function openDocumentation() {
    window.open('https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/for', '_blank');
}
