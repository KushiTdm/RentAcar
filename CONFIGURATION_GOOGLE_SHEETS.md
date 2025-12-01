# Configuration Google Sheets - Guide Complet

Ce guide détaillé vous explique comment connecter votre application React de location de voitures à Google Sheets pour gérer dynamiquement les données des véhicules.

## Table des Matières

1. [Préparation du Google Sheet](#1-préparation-du-google-sheet)
2. [Activation de l'API Google Sheets](#2-activation-de-lapi-google-sheets)
3. [Obtention des identifiants d'API](#3-obtention-des-identifiants-dapi)
4. [Configuration dans le projet React](#4-configuration-dans-le-projet-react)
5. [Logique de vérification de disponibilité](#5-logique-de-vérification-de-disponibilité)
6. [Test de la connexion](#6-test-de-la-connexion)
7. [Déploiement sur Netlify](#7-déploiement-sur-netlify)
8. [Dépannage](#8-dépannage)

---

## 1. Préparation du Google Sheet

### Étape 1.1 : Créer le Google Sheet

1. Accédez à [Google Sheets](https://sheets.google.com)
2. Créez un nouveau document
3. Nommez-le exactement **"FlotteLocation"** (ou modifiez le nom dans le code)

### Étape 1.2 : Configurer les colonnes

Créez **exactement** les colonnes suivantes dans la première ligne (ligne 1) :

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | Marque | Modèle | TarifJournalier | Statut | DateDebutReservation | DateFinReservation |

### Étape 1.3 : Ajouter les données exemple

Remplissez les lignes 2 à 6 avec vos 5 véhicules. Exemple :

| ID | Marque | Modèle | TarifJournalier | Statut | DateDebutReservation | DateFinReservation |
|----|--------|--------|-----------------|--------|---------------------|-------------------|
| 1 | Peugeot | 208 | 45 | Disponible | | |
| 2 | Renault | Clio | 42 | Disponible | | |
| 3 | Citroën | C3 | 48 | Réservé | 2025-12-05 | 2025-12-10 |
| 4 | Volkswagen | Golf | 55 | Disponible | | |
| 5 | Toyota | Yaris | 50 | Disponible | | |

**Important :**
- Les dates doivent être au format **AAAA-MM-JJ** (exemple: 2025-12-05)
- Le statut doit être exactement "Disponible" ou "Réservé"
- Les tarifs doivent être des nombres (sans le symbole €)

### Étape 1.4 : Partager le Google Sheet

1. Cliquez sur le bouton **"Partager"** en haut à droite
2. Dans la section "Accès général", sélectionnez **"Tous les utilisateurs disposant du lien"**
3. Assurez-vous que le niveau d'accès est défini sur **"Lecteur"**
4. Cliquez sur **"Copier le lien"** et sauvegardez-le temporairement

---

## 2. Activation de l'API Google Sheets

### Étape 2.1 : Accéder à Google Cloud Console

1. Rendez-vous sur [Google Cloud Console](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google

### Étape 2.2 : Créer un nouveau projet

1. Cliquez sur le sélecteur de projet en haut de la page
2. Cliquez sur **"Nouveau projet"**
3. Nommez votre projet (exemple: "location-voitures")
4. Cliquez sur **"Créer"**
5. Attendez quelques secondes, puis sélectionnez votre nouveau projet

### Étape 2.3 : Activer l'API Google Sheets

1. Dans le menu de gauche, allez dans **"API et services"** → **"Bibliothèque"**
2. Recherchez **"Google Sheets API"**
3. Cliquez sur **"Google Sheets API"**
4. Cliquez sur le bouton **"Activer"**

---

## 3. Obtention des identifiants d'API

### Étape 3.1 : Créer une clé API

1. Dans le menu de gauche, allez dans **"API et services"** → **"Identifiants"**
2. Cliquez sur **"+ Créer des identifiants"** en haut
3. Sélectionnez **"Clé API"**
4. Une clé API sera générée. **Copiez-la immédiatement** (vous en aurez besoin plus tard)

### Étape 3.2 : Restreindre la clé API (recommandé)

1. Cliquez sur **"Modifier la clé API"** (ou sur l'icône crayon à côté de votre clé)
2. Sous "Restrictions relatives à l'API", sélectionnez **"Restreindre la clé"**
3. Dans la liste déroulante, cochez **"Google Sheets API"**
4. Cliquez sur **"Enregistrer"**

### Étape 3.3 : Obtenir l'ID du Google Sheet

1. Ouvrez votre Google Sheet "FlotteLocation"
2. Regardez l'URL dans la barre d'adresse. Elle ressemble à :
   ```
   https://docs.google.com/spreadsheets/d/VOTRE_SHEET_ID_ICI/edit#gid=0
   ```
3. **Copiez la partie VOTRE_SHEET_ID_ICI** (entre `/d/` et `/edit`)
4. C'est votre **Sheet ID**

Exemple :
- URL complète : `https://docs.google.com/spreadsheets/d/1AbC2DeF3GhI4JkL5MnO6PqR/edit#gid=0`
- Sheet ID : `1AbC2DeF3GhI4JkL5MnO6PqR`

---

## 4. Configuration dans le projet React

### Étape 4.1 : Créer le fichier .env

1. À la racine de votre projet React, créez un fichier nommé **`.env`**
2. Ajoutez les deux lignes suivantes :

```env
VITE_GOOGLE_SHEET_ID=votre_sheet_id_ici
VITE_GOOGLE_API_KEY=votre_api_key_ici
```

3. Remplacez `votre_sheet_id_ici` par l'ID de votre Google Sheet (Étape 3.3)
4. Remplacez `votre_api_key_ici` par votre clé API Google (Étape 3.1)

**Exemple de fichier .env complet :**

```env
VITE_GOOGLE_SHEET_ID=1AbC2DeF3GhI4JkL5MnO6PqR
VITE_GOOGLE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Étape 4.2 : Sécurité importante

**⚠️ ATTENTION :**
- Ne partagez **JAMAIS** votre fichier `.env` publiquement
- Ne committez **JAMAIS** ce fichier dans Git
- Le fichier `.gitignore` doit contenir `.env` (déjà configuré dans ce projet)

### Étape 4.3 : Redémarrer le serveur de développement

Si votre application est déjà en cours d'exécution :
1. Arrêtez le serveur (Ctrl+C)
2. Relancez avec `npm run dev`
3. L'application devrait maintenant charger les données depuis Google Sheets

---

## 5. Logique de vérification de disponibilité

### Comment fonctionne la vérification ?

L'application vérifie la disponibilité d'un véhicule en suivant cette logique :

#### 5.1 Vérification du statut

```
SI Statut = "Disponible"
  → Le véhicule est disponible pour toutes les dates
SINON SI Statut = "Réservé"
  → Passer à l'étape 5.2
```

#### 5.2 Vérification des dates de réservation

Si le véhicule est marqué "Réservé", l'application compare les dates demandées avec les dates de réservation existantes :

```
Date demandée de début : dateDebut
Date demandée de fin : dateFin
Date réservation début : DateDebutReservation (colonne F)
Date réservation fin : DateFinReservation (colonne G)

Le véhicule EST DISPONIBLE si :
  - dateFin < DateDebutReservation (la demande se termine avant la réservation)
  OU
  - dateDebut > DateFinReservation (la demande commence après la réservation)

Le véhicule N'EST PAS DISPONIBLE si :
  - Il y a un chevauchement entre les dates demandées et les dates réservées
```

#### 5.3 Exemple concret

**Véhicule réservé du 5 au 10 décembre 2025 :**

| Demande | Disponible ? | Raison |
|---------|--------------|--------|
| 1-4 déc | ✅ Oui | Se termine avant la réservation |
| 3-7 déc | ❌ Non | Chevauche la réservation (3-4 libre, 5-7 réservé) |
| 8-12 déc | ❌ Non | Chevauche la réservation (8-10 réservé, 11-12 libre) |
| 11-15 déc | ✅ Oui | Commence après la réservation |

### 5.4 Code de vérification

Le code se trouve dans `src/services/googleSheets.ts` :

```typescript
export function isVehicleAvailable(
  vehicle: Vehicle,
  requestedStart: string,
  requestedEnd: string
): boolean {
  // Si le statut est "Disponible", toujours disponible
  if (vehicle.statut === 'Disponible') {
    return true;
  }

  // Si pas de dates de réservation, se baser sur le statut
  if (!vehicle.dateDebutReservation || !vehicle.dateFinReservation) {
    return vehicle.statut === 'Disponible';
  }

  // Convertir les dates en objets Date
  const requestStart = new Date(requestedStart);
  const requestEnd = new Date(requestedEnd);
  const reservedStart = new Date(vehicle.dateDebutReservation);
  const reservedEnd = new Date(vehicle.dateFinReservation);

  // Vérifier s'il n'y a pas de chevauchement
  return requestEnd < reservedStart || requestStart > reservedEnd;
}
```

---

## 6. Test de la connexion

### Étape 6.1 : Vérifier le chargement des données

1. Lancez l'application : `npm run dev`
2. Ouvrez votre navigateur à l'adresse indiquée (généralement http://localhost:5173)
3. Vous devriez voir vos 5 véhicules affichés avec leurs informations

### Étape 6.2 : Vérifier la console

1. Ouvrez la console du navigateur (F12)
2. Recherchez des erreurs ou des avertissements
3. Si vous voyez "Google Sheets credentials not configured. Using mock data.", vérifiez votre fichier `.env`

### Étape 6.3 : Tester une réservation

1. Cliquez sur "Réserver ce véhicule" pour un véhicule disponible
2. Remplissez le formulaire avec des dates futures
3. Vérifiez que le total est correctement calculé
4. Cliquez sur "Confirmer"
5. Un message de succès devrait apparaître

### Étape 6.4 : Modifier les données dans Google Sheets

1. Retournez dans votre Google Sheet
2. Modifiez un tarif ou un statut
3. Cliquez sur le bouton "Actualiser" dans l'application
4. Les modifications devraient apparaître immédiatement

---

## 7. Déploiement sur Netlify

### Étape 7.1 : Préparer le projet

1. Assurez-vous que votre code est sur GitHub, GitLab ou Bitbucket
2. N'incluez **PAS** le fichier `.env` dans votre repository

### Étape 7.2 : Connecter Netlify

1. Allez sur [Netlify](https://www.netlify.com/)
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Connectez votre repository Git
4. Sélectionnez le repository de votre application

### Étape 7.3 : Configurer les variables d'environnement

**Important :** Les variables d'environnement doivent être configurées dans Netlify

1. Dans Netlify, allez dans **"Site settings"** → **"Environment variables"**
2. Cliquez sur **"Add a variable"**
3. Ajoutez ces deux variables :

   - **Clé :** `VITE_GOOGLE_SHEET_ID`
   - **Valeur :** Votre Sheet ID

   - **Clé :** `VITE_GOOGLE_API_KEY`
   - **Valeur :** Votre clé API Google

### Étape 7.4 : Configurer le build

1. **Build command :** `npm run build`
2. **Publish directory :** `dist`
3. Cliquez sur **"Deploy site"**

### Étape 7.5 : Vérifier le déploiement

1. Attendez que le déploiement soit terminé
2. Cliquez sur le lien du site généré par Netlify
3. Vérifiez que l'application fonctionne et charge les données de Google Sheets

---

## 8. Dépannage

### Problème : "Failed to fetch vehicle data"

**Solutions :**
- Vérifiez que votre Google Sheet est bien partagé publiquement
- Vérifiez que le Sheet ID est correct
- Vérifiez que l'API Google Sheets est bien activée dans Google Cloud Console
- Vérifiez que votre clé API est valide

### Problème : "Using mock data"

**Solutions :**
- Vérifiez que le fichier `.env` existe à la racine du projet
- Vérifiez que les variables commencent bien par `VITE_`
- Redémarrez le serveur de développement après avoir modifié le `.env`

### Problème : Les données ne s'actualisent pas

**Solutions :**
- Cliquez sur le bouton "Actualiser" dans l'application
- Videz le cache de votre navigateur (Ctrl+Shift+R)
- Vérifiez que les modifications dans Google Sheets sont bien sauvegardées

### Problème : Erreur 403 (Forbidden)

**Solutions :**
- Vérifiez que votre clé API a les bonnes restrictions (Google Sheets API autorisée)
- Vérifiez que le Google Sheet est partagé publiquement en lecture
- Recréez une nouvelle clé API si nécessaire

### Problème : Les dates ne fonctionnent pas correctement

**Solutions :**
- Assurez-vous que les dates dans Google Sheets sont au format AAAA-MM-JJ
- Vérifiez qu'il n'y a pas d'espaces avant ou après les dates
- Les cellules vides dans DateDebutReservation et DateFinReservation sont normales pour les véhicules disponibles

---

## Résumé des fichiers importants

- **`src/services/googleSheets.ts`** : Logique de connexion à l'API Google Sheets
- **`src/types/vehicle.ts`** : Définition du type Vehicle
- **`.env`** : Variables d'environnement (NE PAS PARTAGER)
- **`.env.example`** : Exemple de fichier .env (peut être partagé)

---

## Structure du Google Sheet attendue

```
Ligne 1 (En-têtes) :
| ID | Marque | Modèle | TarifJournalier | Statut | DateDebutReservation | DateFinReservation |

Lignes 2-6 (Données) :
| 1 | Peugeot | 208 | 45 | Disponible | | |
| 2 | Renault | Clio | 42 | Disponible | | |
| 3 | Citroën | C3 | 48 | Réservé | 2025-12-05 | 2025-12-10 |
| 4 | Volkswagen | Golf | 55 | Disponible | | |
| 5 | Toyota | Yaris | 50 | Disponible | | |
```

---

## Support et ressources

- [Documentation Google Sheets API](https://developers.google.com/sheets/api)
- [Documentation Vite - Variables d'environnement](https://vitejs.dev/guide/env-and-mode.html)
- [Documentation Netlify - Variables d'environnement](https://docs.netlify.com/environment-variables/overview/)

---

**Félicitations !** Vous avez maintenant une application de location de voitures connectée à Google Sheets et prête pour la production.
