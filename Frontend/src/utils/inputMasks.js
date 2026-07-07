const soloDigitos = (valor) => String(valor || '').replace(/\D/g, '');

export const formatearCedula = (valor) => {
  const digitos = soloDigitos(valor).slice(0, 9);
  if (digitos.length <= 1) return digitos;
  if (digitos.length <= 5) return `${digitos.slice(0, 1)}-${digitos.slice(1)}`;
  return `${digitos.slice(0, 1)}-${digitos.slice(1, 5)}-${digitos.slice(5)}`;
};

export const formatearTelefono = (valor) => {
  const digitos = soloDigitos(valor).slice(0, 8);
  if (digitos.length <= 4) return digitos;
  return `${digitos.slice(0, 4)}-${digitos.slice(4)}`;
};

export const CEDULA_REGEX = /^\d-\d{4}-\d{4}$/;
export const TELEFONO_REGEX = /^\d{4}-\d{4}$/;

export const esCedulaValida = (valor) => CEDULA_REGEX.test(String(valor || ''));
export const esTelefonoValido = (valor) => TELEFONO_REGEX.test(String(valor || ''));

export const MENSAJE_CEDULA_INVALIDA = 'La cédula debe tener el formato 6-0491-0942.';
export const MENSAJE_TELEFONO_INVALIDO = 'El teléfono debe tener el formato 7104-1281.';
