# Utiliser une image Node.js officielle comme image de base
FROM node:14

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances npm
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Installer http-server pour servir l'application
RUN npm install -g http-server

# Exposer le port sur lequel l'application va tourner
EXPOSE 8080

# Démarrer l'application en utilisant http-server
CMD [ "http-server", "frontend", "-p", "8080" ]
