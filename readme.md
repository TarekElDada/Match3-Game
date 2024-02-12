## Documentation du Projet

Je vous soumets la documentation de mon jeu, qui détaille les fonctionnalités implémentées, les défis rencontrés et les aspects du projet sur lesquels j'ai consacré le plus de temps.

## Fonctionnalités Implémentées

# Détection d'Alignements

J'ai mis en place la détéction des alignements des cookies de même type en prenant exemple sur la correction que vous nous avez. Lorsqu'un alignement est trouvé, les cookies correspondants sont marqués pour être supprimés de la grille.

# Chute des Éléments

Après la suppression des cookies alignés, j'ai implémenté un système pour que les cookies situés au-dessus des espaces vides tombent et comblent ces trous, simulant ainsi la gravité dans le jeu. C'est la partie qui m'a consacré le plus de temps car je n'arrivais vraiement pas à le mettre en place, j'ai eu plein de problèmes et de bug (par exemple un cookie qui tombe mais ces coordonnées ne se change pas) et comme je ne suis pas un expère du code, la debogage étais compliqué

# Bouton de Test d'Alignement et Chute

En me basant sur le bouton qu'il y avais dejà présent, j'en ai crée deux nouveau, un pour la chute et l'autre pour faire automatiquement l'alignement puis la chute

# Système de Score / Affichage du temps

Conformément à votre demande, j'ai intégré un système de score qui se met à jour automatiquement dans l'affichage (1 point pour alignement de 3 cookies, 2 points pour 4, 3 points pour 5 etc.).
Le compteur de temps marche aussi, et se lance au chargement de la page.

# Effets Sonores

J'ai aussi intégré des effets sonores qui se déclenchent lors des swaps de cookies, de la suppression d'alignements et de la chute des cookies.

## Défis Rencontrés

# Boucle de Détection d'Alignements et Chute

J'ai rencontré des difficultés à implémenter une boucle qui détecte automatiquement les nouveaux alignements après une chute. j'ai essayer beaucoup de technique pour trouver une solution sans bug mais je n'ai pas réussi. Il faut donc appuyer à chaque fois sur le bouton manuellement.

# Système de Points pour les Combos

En raison des difficultés mentionnées précédemment, le système de multiplicateur de points pour les combos réalisés par des chutes successives n'a pas été implémenté. 