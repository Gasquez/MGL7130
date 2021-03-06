# MGL7130

## Configuration de l'environnement de travail avec Ionic, Git et Github

Installer une ligne de commande Git sous Windows : https://git-for-windows.github.io/

Placez-vous dans un repertoire de travail puis entrez les commandes suivantes :

$ ionic start Simplyk blank

A la question de la création d'un compte ionic.io répondez non. Vous pouvez le faire plus tard si vous voulez.

$ cd Simplyk

$ git init .

$ git remote add -t \\* -f origin https://github.com/Warlot-PQ/MGL7130.git

$ git checkout master

Une erreur s'affiche, supprimer les fichiers qui créeront des doublons.

$ git checkout master

Installer les plugin Facebook et Cache (détails plus bas).

L'environnement ionic est prêt et le lien avec GitHub est établi.

## Configuration du live reload

Placez-vous dans le repertoire Simplyk.

Ajouter un watcher au fichier ionic.project pour que le live reload soit actif sur d'autres fichiers que sur index.html et une tache GULP pour activer le live reload.

Exemple ionic.project :
```
{
  "name": "Simplyk",
  "app_id": "",
  "watchPatterns": [
    "www/*",
    "www/js/*",
    "!www/css/**/*"
  ],
  "gulpStartupTasks": [
    "sass",
    "watch"
  ]
}
```

Lancer le serveur simulant les appareils android et IOS :

$ ionic serve --lab

## Déploiement sur téléphone par l'application Ionic View

Identifiez-vous avec votre login et mot de passe Ionic.

$ ionic login

Envoyez le code du projet sur internet.

$ ionic upload

Utilisez l'application mobile Ionic View pour visualier l'application Ionic.

## Déploiement sur téléphone par PhoneGap

Identifiez-vous sur https://build.phonegap.com/ avec votre Adobe ID.

Avant de zipper, déplacer les dossiers .git (si vous utilisez un outil de diff, par exemple winmerge) et node_modules de la racine du projet hors du dossier de projet. 

Faites un zip du repertoire www au complet et envoyez le sur le site phonegap. Lancez la compilation, scanner le QR code et c'est prêt.

Référence : http://pointdeveloper.com/how-to-build-ionic-app-with-phonegap-build/

##Plugin Notification pour téléphone

Le plugin "org.apache.cordova.dialogs" permet un affichage propre des alert. Il est utilisable sur téléphone mais pas sur navigateur.

```javascript
if (navigator.notification) {
  navigator.notification.alert( 'alert text', callBack on exit, 'title', 'button text' );
}
else {
  alert( 'alert text' );
}
```

Source : https://mindfiremobile.wordpress.com/2013/10/30/using-phonegap-notification-api-to-display-customized-alert/

##Plugin Facebook

Installer le plugin :

https://github.com/jeduan/cordova-plugin-facebook4

Enregistrer et configurer l'app Facebook :

Source : http://www.lafermeduweb.net/tutorial/creer-une-nouvelle-application-facebook-p80.html

## Plugin Splashscreen

Installer le plugin cordova-plugin-splashscreen.

##Plugin Facebook

Télécharger le zip : https://github.com/moderna/cordova-plugin-cache

Installer le plugin en utilisant le chemin relative du fichier zip.
