const fs = require('fs');
const path = require('path');

// Tamaño máximo del archivo en bytes (16 MB)
const MAX_SIZE = 16 * 1024 * 1024;

// Ruta del directorio a verificar (directorio actual)
const directoryPath = process.cwd();

console.log(`Validando archivos en el directorio: ${directoryPath}`);

// Verifica si el directorio existe
if (!fs.existsSync(directoryPath)) {
  console.error("El directorio no existe.");
  process.exit(1);
}

// Función para validar archivos recursivamente
function validateFiles(dir) {
  const files = fs.readdirSync(dir);
  let allFilesValid = true;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      // Si es un directorio, realizar validación recursiva
      if (!validateFiles(filePath)) {
        allFilesValid = false;
      }
    } else {
      // Si es un archivo, validar su tamaño
      const fileSize = fileStat.size;

      if (fileSize > MAX_SIZE) {
        console.error(`El archivo ${filePath} es demasiado grande. Tamaño máximo permitido: ${MAX_SIZE / 1024 / 1024} MB.`);
        allFilesValid = false;
      } else {
        console.log(`El archivo ${filePath} está dentro del tamaño permitido.`);
      }
    }
  });

  return allFilesValid;
}

if (!validateFiles(directoryPath)) {
  process.exit(1);
}

process.exit(0);

