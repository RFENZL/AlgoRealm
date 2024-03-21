function solution(){
        var somme = 0;
        for (var i = 1; i <= 10; i++) {
            if (i % 2 === 0) {
                somme += i;
           } 
        }
        return somme;
    }
    const aideDiv = document.getElementById("aide");
const popupDiv = document.getElementById("popup");

aideDiv.addEventListener("click", function() {
    popupDiv.style.display = "block";
});

function closePopup() {
    popupDiv.style.display = "none";
}

    function testEnigme() {
        let code = document.getElementById("terminal").value;
        let outputDiv = document.getElementById("Console");
    
        try {
            // Vérifier si le code contient un for et utilise l'opérateur modulo %
            if (code.includes('for(') && code.includes('%')) {
                // Créer une nouvelle fonction à partir du code saisi
                let func = new Function(code);
    
                // Exécuter la fonction créée
                let result = func();
    
                // Vérifier si le résultat du code est égal au résultat de la fonction solution()
                if (result === solution()) {
                    // Afficher le résultat dans la console
                    outputDiv.textContent = "Console: Bravo !!!";
                } else {
                    // Afficher le résultat dans la console
                    outputDiv.textContent = "Console: false";
                }
            } else {
                // Afficher un message si les conditions ne sont pas remplies
                outputDiv.textContent = "Console: Le code doit contenir un 'for' et utiliser l'opérateur modulo '%'.";
            }
        } catch (error) {
            // Afficher les erreurs s'il y en a
            outputDiv.textContent = "Console: Erreur - " + error.message;
        }
    }
    
    
    
    
