# Usar la imagen oficial de Node.js versión 20
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar el package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el contenido de nuestro proyecto en el contenedor
COPY . .

# Exponer el puerto 4000 para las conexiones
EXPOSE 4000

# Ejecutar la aplicación
CMD ["node", "index.js"]
