import Cookie from "./cookie.js";
import { create2DArray } from "./utils.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille {
  cookiesSelectionnees = [];
  score = 0;
  multiplicateurChute = 1; // Pour gérer les scores multipliés après plusieurs chutes
  temps = 0; // Le temps écoulé en secondes
  intervalId = null; // L'identifiant de l'intervalle pour pouvoir l'arrêter plus tard

  constructor(l, c) {
    this.colonnes = c;
    this.lignes = l;
    // le tableau des cookies
    this.cookies = create2DArray(l);

    //let existeAlignement = false;
    this.remplirTableauDeCookies(6);
    /*
    do {
      this.remplirTableauDeCookies(6);
      existeAlignement = this.testAlignementDansTouteLaGrille();
      console.log("ExisteAlignement : " + existeAlignement)
    } while(existeAlignement)
    */
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      let ligne = Math.floor(index / this.lignes);
      let colonne = index % this.colonnes;

      let cookie = this.cookies[ligne][colonne];
      let img = cookie.htmlImage;

      // On met un écouteur de click sur l'image
      img.onclick = (event) => {
        let cookieClickee = this.getCookieFromImage(event.target);

        // on regarde combien on a de cookies selectionnées
        if (this.cookiesSelectionnees.length === 0) {
          cookieClickee.selectionnee();
          this.cookiesSelectionnees.push(cookieClickee);
        } else if (this.cookiesSelectionnees.length === 1) {
          cookieClickee.selectionnee();
          console.log("On essaie de swapper !")
          this.cookiesSelectionnees.push(cookieClickee);
          // on essaie de swapper
          Cookie.swapCookies(this.cookiesSelectionnees[0],
            this.cookiesSelectionnees[1]);
          // on remet le tableau des cookies selectionnées à 0
          this.cookiesSelectionnees = [];
        } else {
          console.log("Deux cookies sont déjà sélectionnées...")
        }
      }

      // On met un écouteur de drag'n'drop sur l'image
      img.ondragstart = (event) => {
        let cookieDragguee = this.getCookieFromImage(event.target);
        cookieDragguee.selectionnee();

        // on remet à zero le tableau des cookies selectionnees
        this.cookiesSelectionnees = [];
        this.cookiesSelectionnees.push(cookieDragguee);
      }

      img.ondragover = (event) => {
        return false;
      }

      img.ondragenter = (event) => {
        const i = event.target;
        i.classList.add("imgDragOver");
      }

      img.ondragleave = (event) => {
        const i = event.target;
        i.classList.remove("imgDragOver");
      }

      img.ondrop = (event) => {
        let cookieDragguee = this.getCookieFromImage(event.target);
        cookieDragguee.selectionnee();

        // on ajoute au tableau la deuxième cookie
        this.cookiesSelectionnees.push(cookieDragguee);

        // et on regarde si on peut les swapper
        Cookie.swapCookies(this.cookiesSelectionnees[0], this.cookiesSelectionnees[1]);

        // on remet le tableau des cookies selectionnées à 0
        this.cookiesSelectionnees = [];
        cookieDragguee.htmlImage.classList.remove("imgDragOver");

        
      }

      div.appendChild(img);
    });
  }

  getCookieFromImage(i) {
    let ligneCookie = i.dataset.ligne;
    let colonneCookie = i.dataset.colonne;
    return this.cookies[ligneCookie][colonneCookie];
  }
  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    for (let l = 0; l < this.lignes; l++) {
      for (let c = 0; c < this.colonnes; c++) {
        //console.log("ligne = " + l + " colonne = " + c);
        const type = Math.round(Math.random() * (nbDeCookiesDifferents - 1))
        this.cookies[l][c] = new Cookie(type, l, c);
      }
    }
  }


  // Test des alignements de 3 cookies ou plus, horizontalement et verticalement

  testAlignementDansTouteLaGrille() {
    let alignementExisteLignes = false;
    let alignementExisteColonnes = false;

    alignementExisteLignes = this.testAlignementToutesLesLignes();
    alignementExisteColonnes = this.testAlignementToutesLesColonnes();

    //this.jouerSon("allignement");

    return (alignementExisteLignes || alignementExisteColonnes);
  }

  testAlignementToutesLesLignes() {
    let alignementLignes = false;

    for (let i = 0; i < this.lignes; i++) {
      alignementLignes = this.testAlignementLigne(i);
    }

    return alignementLignes;
  }

  testAlignementLigne(ligne) {
    let points = 0; // Pour calculer les points basés sur la longueur de l'alignement

    for (let c = 0; c < this.colonnes; c++) {
        let count = 1; // Compte le nombre de cookies identiques consécutifs
        for (let k = c + 1; k < this.colonnes && this.cookies[ligne][c].type === this.cookies[ligne][k].type; k++) {
            count++;
        }
        if (count >= 3) {
            for (let k = c; k < c + count; k++) {
                this.cookies[ligne][k].cachee();
            }
            points += count - 2; // Calcul des points
            c += count - 1; // Avance dans la vérification
        }
    }

    if (points > 0) {
        this.ajouterPoints(points);
        this.jouerSon("allignement");
        return true;
    }
    return false;
  }

  testAlignementToutesLesColonnes() {
    let alignementColonnes = false;
    for (let i = 0; i < this.colonnes; i++) {
      alignementColonnes = this.testAlignementColonne(i);
    }

    return alignementColonnes;
  }

  testAlignementColonne(colonne) {
    let points = 0;

    for (let l = 0; l < this.lignes; l++) {
        let count = 1;
        for (let k = l + 1; k < this.lignes && this.cookies[l][colonne].type === this.cookies[k][colonne].type; k++) {
            count++;
        }
        if (count >= 3) {
            for (let k = l; k < l + count; k++) {
                this.cookies[k][colonne].cachee();
            }
            points += count - 2;
            l += count - 1;
        }
    }

    if (points > 0) {
        this.ajouterPoints(points);
        this.jouerSon("allignement");
        return true;
    }
    return false;
  }
  

  /** 
  detecterMatch3Lignes() {
    let aMarquer = []; // Pour garder une trace des cookies à cacher
  
    for (let l = 0; l < this.lignes; l++) {
      for (let c = 0; c < this.colonnes - 2; c++) {
        let current = this.cookies[l][c];
        let next1 = this.cookies[l][c + 1];
        let next2 = this.cookies[l][c + 2];
  
        if (current.type === next1.type && current.type === next2.type) {
          // Si on trouve un match, on ajoute ces cookies dans la liste à marquer
          aMarquer.push(current, next1, next2);
        }
      }
    }
    aMarquer.forEach(cookie => cookie.cachee());
  }

  detecterMatch3Colonnes() {
    let aMarquer = []; // Pour garder une trace des cookies à cacher
  
    for (let c = 0; c < this.colonnes; c++) {
      for (let l = 0; l < this.lignes - 2; l++) {
        let current = this.cookies[l][c];
        let next1 = this.cookies[l + 1][c];
        let next2 = this.cookies[l + 2][c];
  
        if (current.type === next1.type && current.type === next2.type) {
          // Si on trouve un match, on ajoute ces cookies dans la liste à marquer
          aMarquer.push(current, next1, next2);
        }
      }
    }
  
    // Marquage des cookies trouvés
    aMarquer.forEach(cookie => cookie.cachee());
  }
  */

  
  chuteColonne(colonne) {
    let changement = false; // Indicateur de changement pour savoir si une chute a eu lieu

    do {
      changement = false; // Réinitialiser l'indicateur de changement pour chaque itération

      for (let l = this.lignes - 2; l >= 0; l--) { // Partir de l'avant-dernière ligne
        if (!this.cookies[l][colonne].htmlImage.classList.contains("cookieCachee") &&
          this.cookies[l + 1][colonne].htmlImage.classList.contains("cookieCachee")) {
          // Échange des cookies pour faire "tomber" le cookie non-caché dans le trou
          [this.cookies[l][colonne], this.cookies[l + 1][colonne]] = [this.cookies[l + 1][colonne], this.cookies[l][colonne]];

          // Mise à jour des positions
          this.cookies[l][colonne].ligne = l;
          this.cookies[l + 1][colonne].ligne = l + 1;

          // Mise à jour des attributs data-ligne et data-colonne
          this.cookies[l][colonne].htmlImage.dataset.ligne = l;
          this.cookies[l][colonne].htmlImage.dataset.colonne = colonne;
          this.cookies[l + 1][colonne].htmlImage.dataset.ligne = l + 1;
          this.cookies[l + 1][colonne].htmlImage.dataset.colonne = colonne;

          changement = true; // Marquer qu'un changement a eu lieu
        }
      }
    } while (changement); // Continuer tant qu'il y a des changements

    // Remplir les trous en haut de la colonne avec de nouveaux cookies
    for (let l = 0; l < this.lignes; l++) {
      if (this.cookies[l][colonne].htmlImage.classList.contains("cookieCachee")) {
        this.cookies[l][colonne] = new Cookie(Math.floor(Math.random() * 6), l, colonne);
        // on utilise la focntion jouerSon pour jouer le son de la chute
        this.jouerSon("kill");
      }
    }

    this.showCookies(); // Mise à jour de l'affichage
  }




  /*chuteColonne(colonne) {
    let trouve = false;
    // Identifier le premier cookie caché en partant du bas
    for (let l = this.lignes - 1; l >= 0; l--) {
        if (this.cookies[l][colonne].htmlImage.classList.contains("cookieCachee")) {
            trouve = true;
            // Déplacer tous les cookies au-dessus du trou d'une position vers le bas
            for (let k = l; k > 0; k--) {
                // Éviter de déplacer un cookie caché sur un autre cookie caché
                if (!this.cookies[k - 1][colonne].htmlImage.classList.contains("cookieCachee")) {
                    this.cookies[k][colonne] = this.cookies[k - 1][colonne];
                    // Mise à jour des propriétés ligne du cookie déplacé
                    this.cookies[k][colonne].ligne = k;
                    // Mise à jour des attributs data-ligne et data-colonne si utilisés
                    this.cookies[k][colonne].htmlImage.dataset.ligne = k;
                    this.cookies[k][colonne].htmlImage.dataset.colonne = colonne;
                }
            }
            // Créer un nouveau cookie en haut si nécessaire
            this.cookies[0][colonne] = new Cookie(Math.floor(Math.random() * 6), 0, colonne);
            this.cookies[0][colonne].htmlImage.dataset.ligne = 0;
            this.cookies[0][colonne].htmlImage.dataset.colonne = colonne;
        }
    }

    if (trouve) {
        this.showCookies(); // Rafraîchir l'affichage seulement si des changements ont été faits
    }*/

  
  // Ajouter des points au score
  ajouterPoints(points) {
    this.score += points;
    console.log(`Score actuel : ${this.score}`);
    this.mettreAJourScore(); // Met à jour l'affichage du score
  }
  mettreAJourScore() {
    // Sélectionner l'élément du score par son ID
    const elementScore = document.getElementById('scoreAffichage');
    // Mettre à jour le contenu textuel de cet élément avec le score actuel
    if (elementScore) elementScore.textContent = `Score : ${this.score}`;
  }
  


  // fonction qui va tester les allignement sur les lignes et les colonnes et va ensuite appeler la fonction chuteColonne
  // pour chaque colonne qui a des cookies cachés
  testAlignementEtChute() {
    let existeAlignement = true;

    //while (existeAlignement) {
      // Test alignement 
      existeAlignement = this.testAlignementDansTouteLaGrille();

      // temps d'attente pour l'animation
      setTimeout(() => {
        // Chute des colonnes
        for (let c = 0; c < this.colonnes; c++) {
          this.chuteColonne(c);
        }
      }, 400);

    //}

  }

  // boucle en continue pour tester les alignements et les chutes

  

  
  


  // Définition globale des sons
  sons = {
    swap: new Audio('./assets/sons/swap.wav'),
    kill: new Audio('./assets/sons/kill.wav'),
    allignement: new Audio('./assets/sons/allignement.wav')
  };

  // Fonction pour jouer un son spécifique
  jouerSon(nom) {
    if (this.sons[nom]) {
      this.sons[nom].currentTime = 0; // Réinitialise le son
      this.sons[nom].play().catch(e => console.error("Erreur lors de la lecture du son:", e));
    }
  }



  temps = 0; // Le temps écoulé en secondes
  intervalId = null; // L'identifiant de l'intervalle pour pouvoir l'arrêter plus tard

  demarrerTemps() {
    this.intervalId = setInterval(() => {
      this.temps++; // Incrémente le temps
      const elementTemps = document.getElementById('tempsAffichage');
      if (elementTemps) {
        elementTemps.textContent = `Temps : ${this.temps}`; // Met à jour l'affichage du temps
      }
    }, 1000); // Mise à jour chaque seconde
  }

  

}
