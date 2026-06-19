const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { Usuario } = require('../Models');

// ── Google ────────────────────────────────────────────────────────────────────
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

                let user = await Usuario.findOne({ where: { correo: email } });

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


// ── GitHub ────────────────────────────────────────────────────────────────────
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/api/auth/github/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // GitHub a veces no devuelve el email si está privado
                const email = profile.emails?.[0]?.value || `github_${profile.id}@noemail.com`;

                let user = await Usuario.findOne({ where: { correo: email } });

                if (!user) {
                    user = await Usuario.create({
                        nombre: profile.displayName || profile.username,
                        correo: email,
                        github_id: profile.id,
                        provider: 'GITHUB',
                        avatar_url: profile.photos?.[0]?.value || null,
                        contrasena_hash: 'GITHUB_LOGIN',
                        cedula: `GITHUB_${profile.id}`,
                        rol: 'ESTUDIANTE',
                        estado_cuenta: 'ACTIVA',
                        perfil_completo: false
                    });
                    console.log('✅ Usuario GitHub creado');
                } else {
                    if (!user.github_id) {
                        await user.update({
                            github_id: profile.id,
                            provider: 'GITHUB',
                            avatar_url: profile.photos?.[0]?.value || null
                        });
                    }
                    console.log('✅ Usuario GitHub existente');
                }

                return done(null, user);
            } catch (error) {
                console.error('GITHUB ERROR:', error);
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