const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Usuario } = require('../Models');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
 async (accessToken, refreshToken, profile, done) => {
  try {

    const email = profile.emails?.[0]?.value;

    let user = await Usuario.findOne({
      where: {
        correo: email
      }
    });

    if (!user) {

      user = await Usuario.create({
        nombre: profile.displayName,
        correo: email,

        google_id: profile.id,

        provider: 'GOOGLE',

        avatar_url: profile.photos?.[0]?.value || null,

        contrasena_hash: 'GOOGLE_LOGIN',

        cedula: `GOOGLE_${profile.id}`,

        rol: 'ESTUDIANTE',

        estado_cuenta: 'ACTIVA',
        
        perfil_completo: false
      });

      console.log('✅ Usuario Google creado');
    } else {

      if (!user.google_id) {
        await user.update({
          google_id: profile.id,
          provider: 'GOOGLE',
          avatar_url: profile.photos?.[0]?.value || null
        });
      }

      console.log('✅ Usuario Google existente');
    }

    return done(null, user);

  } catch (error) {
    console.error('GOOGLE ERROR:', error);
    return done(error, null);
  }
}
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;