ALTER TABLE usuario ADD COLUMN perfil_completo BOOLEAN NOT NULL DEFAULT false;
UPDATE usuario SET perfil_completo = true WHERE provider = 'LOCAL' OR provider IS NULL;
