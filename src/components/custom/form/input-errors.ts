export const validationMessages = {
  required: "Este campo es obligatorio",
  email: "El correo electrónico no es válido",
  invalidFormat: "Formato inválido",
  onlyPositive: "Solo números positivos",
  minLength: (length: number) => `Debe tener al menos ${length} caracteres`,
  maxLength: (length: number) => `No puede tener más de ${length} caracteres`,
  passwordMismatch: "Las contraseñas no coinciden",
  invalidPhone: "El número de teléfono no es válido",
};

export default validationMessages;