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

                let user = await Usuario.findOne({ where: { google_id: profile.id } });

                if (!user) {
                    // Si no existe por google_id, buscamos por correo
                    user = await Usuario.findOne({ where: { correo: email } });

                    if (user) {
                        // El correo ya existe, enlazamos la cuenta de Google
                        await user.update({
                            google_id: profile.id,
                            provider: 'GOOGLE',
                            avatar_url: user.avatar_url || profile.photos?.[0]?.value || null
                        });
                        console.log('✅ Usuario enlazado a cuenta de Google');
                    } else {
                        user = await Usuario.create({
                            nombre: profile.displayName || 'Usuario Google',
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
                    }
                } else {
                    // Actualizamos correo si difiere (poco probable en Google pero útil)
                    if (user.correo !== email) {
                        try {
                            await user.update({ correo: email });
                            console.log('✅ Correo actualizado para usuario Google');
                        } catch (e) {
                            console.error('No se pudo actualizar el correo:', e.message);
                        }
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
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // GitHub a veces no devuelve el email si está privado
                let email = profile.emails?.[0]?.value;

                // Si no viene el email, lo obtenemos manualmente usando el token
                if (!email) {
                    try {
                        const response = await fetch('https://api.github.com/user/emails', {
                            headers: {
                                'Authorization': `token ${accessToken}`,
                                'User-Agent': 'Node.js'
                            }
                        });
                        if (response.ok) {
                            const emails = await response.json();
                            const primaryEmail = emails.find(e => e.primary) || emails[0];
                            if (primaryEmail) {
                                email = primaryEmail.email;
                            }
                        }
                    } catch (err) {
                        console.error('Error fetching github emails manually:', err);
                    }
                }

                email = email || `github_${profile.id}@noemail.com`;

                let user = await Usuario.findOne({ where: { github_id: profile.id } });

                if (!user) {
                    // Si no existe por github_id, buscamos por correo
                    user = await Usuario.findOne({ where: { correo: email } });

                    if (user) {
                        // El correo ya existe, enlazamos la cuenta de GitHub
                        await user.update({
                            github_id: profile.id,
                            provider: 'GITHUB',
                            avatar_url: user.avatar_url || profile.photos?.[0]?.value || null
                        });
                        console.log('✅ Usuario enlazado a cuenta de GitHub');
                    } else {
                        // No existe ni por github_id ni por correo, creamos uno nuevo
                        user = await Usuario.create({
                            nombre: profile.displayName || profile.username || 'Usuario GitHub',
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
                    }
                } else {
                    // El usuario ya existe por github_id, actualizamos su correo si antes tenía el 'noemail'
                    if (user.correo.includes('@noemail.com') && !email.includes('@noemail.com')) {
                        try {
                            await user.update({ correo: email });
                            console.log('✅ Correo actualizado para usuario GitHub');
                        } catch (e) {
                            console.error('No se pudo actualizar el correo:', e.message);
                        }
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
