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

Faites un zip du projet au complet et envoyez le sur le site phonegap. Lancez la compilation, scanner le QR code et c'est prêt.

Référence : http://pointdeveloper.com/how-to-build-ionic-app-with-phonegap-build/

## Splashscreen sur iPhone 5

Ajoutez la balise suivante au fichier config.xml sur répertoire www. Default-568h@2x.png contient le splashscreen.

<gap:splash src="Default-568h@2x.png" gap:platform="ios" width="640" height="1136" />
