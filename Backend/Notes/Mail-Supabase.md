✅ ¿Qué funciona correctamente?
1. Nivel de Modelo (Sequelize + Supabase) El modelo 

usuario.js
 tiene una restricción de unicidad correctamente definida en dos capas:

javascript
correo: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } }
unique: true → Crea un índice UNIQUE en la tabla de Supabase/PostgreSQL. Si alguien intenta insertar un correo duplicado directamente a la DB, PostgreSQL lo rechaza con un error 23505.
validate: { isEmail: true } → Sequelize valida el formato antes de siquiera ir a la DB.

2. Registro manual (/auth/register) En 

authController.js
, hay un findOne explícito antes del create, que devuelve un error 409 Conflict limpio:

javascript
const existingUser = await Usuario.findOne({ where: { correo: email } });
if (existingUser) {
  return res.status(409).json({ success: false, message: 'Ya existe una cuenta con ese email' });
}
Esto está bien. El usuario recibe un error claro.

⚠️ Caso borde: El flujo de Google OAuth — aquí está el problema real
En 

passport.js
, cuando un correo ya existe en la DB (registrado manualmente), Google no lo rechaza, sino que lo vincula silenciosamente:

javascript
} else {
  // ⚠️ Si el correo ya existe, le agrega google_id y cambia el provider a GOOGLE
  if (!user.google_id) {
    await user.update({
      google_id: profile.id,
      provider: 'GOOGLE',    // 🚨 Sobreescribe el provider original (LOCAL)
      avatar_url: ...
    });
  }
}
¿Qué significa esto? Si un usuario se registró manualmente con correo@fwd.com y su contraseña, y luego intenta hacer "Login con Google" usando la misma cuenta de Gmail, el sistema:

Encuentra el usuario existente en la DB.
Le sobreescribe el provider a GOOGLE (pierde que era LOCAL).
Lo autentica y genera un token válido.
Esto no bloquea el acceso duplicado, sino que lo permite de una forma potencialmente no intencional. No es un bug de seguridad crítico hoy, pero sí un comportamiento inconsistente.

✅ En conclusión: ¿Se puede repetir el correo?
No, la DB no permite correos duplicados. El índice UNIQUE de PostgreSQL y las validaciones de Sequelize son la última línea de defensa y están activas.

El flujo es:

Registro manual → findOne(correo) → 409 si existe ✅
Google OAuth    → findOne(correo) → si existe, lo vincula (no lo duplica, pero modifica el provider) ⚠️
Login normal    → findOne(correo) → bcrypt.compare → estado_cuenta ✅
El registro y el login están correctos. ¿Quieres que arregle el comportamiento del OAuth para que, si un correo ya existe como usuario LOCAL