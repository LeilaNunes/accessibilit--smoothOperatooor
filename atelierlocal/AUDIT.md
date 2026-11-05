# Audit AtelierLocal

## Binôme et environnement

- Membres : Leïla Nunes De Barros, Jérémie Levan
- Navigateur et version : Firefox Version 159.0

---

## Problème 1 — Bouton « Détails de l'atelier » inaccessible au clavier

### Problème identifié

Le déclencheur « Détails de l'atelier » n'est pas focusable par défaut et n'est pas restitué comme un contrôle interactif par les technologies d'assistance.

### Reproduction

1. Appuyer sur Tab depuis le haut de la page pour parcourir les éléments focusables.
2. Le déclencheur « Détails de l'atelier » est ignoré : le focus passe directement du compteur de résultats au bouton « M'inscrire ».

### Comportement attendu

Le déclencheur doit être accessible au clavier (Tab pour atteindre, Entrée ou Espace pour activer). Son état doit être communiqué, et le panneau contrôlé doit être identifié.

### Correction à apporter

Remplacer le `<div>` par un `<button type="button">`. Ajouter `aria-expanded={expanded}` et `aria-controls={panelId}` où `panelId` est l'`id` du panneau de détails.

---

## Problème 2 — Panneau de détails masqué uniquement par CSS

### Problème identifié

Lorsque le panneau de détails est fermé, il est masqué visuellement. Le lien « Consulter les informations pratiques » présent dans le panneau reste focusable au clavier même quand le panneau est fermé.

### Reproduction

1. Parcourir les éléments au clavier avec Tab.
2. Le focus atterrit sur le lien « Consulter les informations pratiques » alors que le panneau est visuellement fermé.

### Comportement attendu

Quand le panneau est fermé, son contenu ne doit pas être atteignable au clavier ni restitué par les technologies d'assistance.

### Correction à apporter

Ajouter l'attribut HTML `hidden` sur le panneau, en remplacement d'`aria-hidden`. L'attribut `hidden` retire l'élément du rendu et du flux de navigation.

---

## Problème 3 — Image de sérigraphie sans attribut `alt`

### Problème identifié

L'image de l'atelier « Premiers pas en sérigraphie » est rendue sans attribut `alt`. Les deux autres ateliers disposent de `alt=""`. Sans attribut `alt`, certains lecteurs d'écran restituent le nom du fichier source (`serigraphie.svg`) comme alternative textuelle, ce qui ne donne aucune information utile et dégrade l'expérience des personnes non-voyantes.

### Reproduction

1. Inspecter le DOM de la carte « Premiers pas en sérigraphie ».
2. Constater que l'élément `<img>` ne possède pas d'attribut `alt`.
3. Avec un lecteur d'écran, lire la carte : le nom du fichier est restitué.

### Comportement attendu

Toutes les images doivent posséder un attribut `alt`.

### Correction à apporter

Ajouter `alt=""` sur le `<img>` de la sérigraphie, en cohérence avec les deux autres cartes.

---

## Problème 4 — Titre de carte sans sémantique de titre

### Problème identifié

Le nom de chaque atelier est affiché avec un `<p class="workshop-title">`. Un paragraphe n'est pas un élément de titre ; il n'apparaît donc pas dans le plan du document ni dans la liste des titres proposée par les lecteurs d'écran.

### Reproduction

1. Demander la liste des titres de la page.
2. Les noms d'ateliers n'apparaissent pas dans cette liste.

### Comportement attendu

Chaque nom d'atelier doit être un titre de niveau approprié afin que les utilisateurs de lecteurs d'écran puissent naviguer directement vers un atelier.

### Correction à apporter

Remplacer `<p className="workshop-title">` par `<h3 className="workshop-title">`.

---

## Problème 5 — Label de recherche non lié au champ

### Problème identifié

L'indication « Rechercher un atelier » est rendue avec un `<p class="search-label">`, qui n'est pas associé au champ `<input type="search" id="workshop-search">`. Un lecteur d'écran annonce le champ sans son libellé, ce qui laisse l'utilisateur sans indication sur ce qu'il doit saisir.

### Reproduction

1. Naviguer au clavier jusqu'au champ de recherche.
2. Avec un lecteur d'écran, écouter l'annonce du champ.
3. Seul le rôle « zone de recherche » est annoncé, sans le libellé « Rechercher un atelier ».

### Comportement attendu

Le libellé doit être un `<label>` avec un attribut `for` correspondant à l'`id` du champ.

### Correction à apporter

Remplacer `<p className="search-label">` par `<label htmlFor="workshop-search" className="search-label">`.

---

## Problème 6 — Focus non déplacé après une préinscription

### Problème identifié

Après avoir cliqué sur « M'inscrire », un message de confirmation apparaît en bas de page. Mais le focus clavier reste sur le bouton d'inscription, et la zone de confirmation n'est ni une région live ni une cible de focus.

### Reproduction

1. Naviguer au clavier jusqu'au bouton « M'inscrire à [atelier] » et appuyer sur Entrée.
2. Constater que le focus reste sur le bouton et qu'aucun lecteur d'écran n'annonce la confirmation.

### Comportement attendu

Après une préinscription réussie, la confirmation doit être perceptible sans action supplémentaire : soit par annonce automatique (région live), soit par déplacement du focus vers la confirmation.

### Correction à apporter

Ajouter `role="status"` sur la zone de confirmation pour l'annoncer automatiquement, et `tabIndex={-1}` pour permettre de recevoir le focus programmatique. Dans la fonction `reserve`, appeler `noticeRef.current?.focus()` après la mise à jour du message.

---

## Problème 7 — Recherche étendue à la catégorie

### Problème identifiée

Le filtre de recherche ne portait que sur le titre et la ville de l'atelier, et non la catégorie.

### Reproduction

1. Rechercher une catégorie d'atelier
2. Aucun résultat n'apparait.

### Comportement attendu

L'utilisateur devrait pouvoir rechercher la catégorie de l'atelier.

### Correction à apporter

Dans `App.tsx`, la chaîne de filtrage a été étendue pour inclure `workshop.category` :

`${workshop.title} ${workshop.location} ${workshop.category}`.toLocaleLowerCase("fr").includes(normalized)

Le texte d'aide sous le champ a également été mis à jour : « Saisissez un titre, une ville ou une catégorie. » Le message d'état vide a lui aussi été adapté en conséquence.

---

## Problème 8 — Indicateur de focus absent sur le bouton « M'inscrire »

### Problème identifié

Lorsqu'on navigue au clavier jusqu'au bouton « M'inscrire », aucun contour visible n'apparaît autour de lui.

### Reproduction

1. Parcourir la page au clavier avec Tab jusqu'à atteindre un bouton « M'inscrire ».
2. Aucun contour n'apparaît autour du bouton malgré la présence du focus.

### Comportement attendu

Tout élément interactif doit afficher un indicateur de focus visible lors de la navigation au clavier.

### Correction à apporter

Supprimer la règle `.reserve-button:focus-visible { outline: none; box-shadow: none; }` dans `styles.css` afin que la règle globale `button:focus-visible` s'applique normalement.

---

## Composant créé

Expliquez vos principaux choix d’accessibilité et les manipulations réalisées pour les vérifier.

## Mini-test

Indiquez le fichier, le résultat et ce que le test permet de vérifier.