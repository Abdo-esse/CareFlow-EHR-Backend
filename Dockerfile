# Utiliser une image Node légère
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier tout le code source
COPY . .

# Exposer le port de l'application
EXPOSE 3000

# Démarrage du serveur
CMD ["npm", "run", "start"]