import Grille from "./grille.js";

// 1 On définisse une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES est chargée

window.onload = init;

let grille;

function init() {
  console.log("Page et ressources prêtes à l'emploi");
  // appelée quand la page et ses ressources sont prêtes.
  // On dit aussi que le DOM est ready (en fait un peu plus...)

  grille = new Grille(9, 9);
  grille.showCookies();
  grille.demarrerTemps();

  let b = document.querySelector("#buttonTestAlignement");
  b.onclick = () => {
    let existeAlignement = grille.testAlignementDansTouteLaGrille();

    console.log("Existe Alignement : " + existeAlignement)
  }

  let bChute = document.querySelector("#buttonTestChute");
  bChute.onclick = () => {
    //grille.chuteColonne(0); // Test avec la colonne 0
    //boucle pour tester avec toutes les colonnes
    for (let i = 0; i < 9; i++) {
      grille.chuteColonne(i);
      //console.log("Chute colonne " + i);
    }
    console.log("Fin de la chute");
  };

  //pour le bouton qui test les 2
  let bTest = document.querySelector("#buttonTestAlignementEtChute");
  bTest.onclick = () => {
    // on lance la fonction testAlignementEtChute de grille qui fait les deux
    grille.testAlignementEtChute();
    console.log("Fin du test alignement et chute");

  }

  

}
