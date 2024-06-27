// Función para generar una contraseña aleatoria
function generarContrasenaAleatoria() {
    const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$&+,:;=?@#|'<>.^*()%!-";
    const longitud = 10;
    let contrasena = "";
    for (let i = 0; i < longitud; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        contrasena += caracteres.charAt(indice);
    }
    return contrasena;
}

module.exports = { generarContrasenaAleatoria };
