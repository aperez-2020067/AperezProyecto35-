import User from '../user/user.model.js';
import Invoice from '../invoice/invoice.model.js'; // Importar el modelo de Invoice
import { checkPassword, encrypt } from '../../utils/encrypt.js';
import { generateJwt } from '../../utils/jwt.js';

export const register = async (req, res) => {
  try {
    // Capturar los datos
    let data = req.body;
    // Aquí van validaciones
    let user = new User(data);

    // Encriptar la password
    user.password = await encrypt(user.password);
    // Asignar rol por defecto
    user.role = 'CLIENT';
    // Guardar
    await user.save();
    // Responder al usuario
    return res.send({ message: `Registered successfully, can be logged with username: ${user.username}` });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'General error with registering user', err });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  try {
    // Capturar los datos (body)
    let { username, password } = req.body;
    // Validar que el usuario exista
    let user = await User.findOne({ username });
    // Verificar que la contraseña coincida
    if (user && await checkPassword(user.password, password)) {
      let loggedUser = { // No puede ir data sensible
        uid: user._id,
        name: user.name,
        username: user.username,
        role: user.role
      };
      // Generar el Token
      let token = await generateJwt(loggedUser);

      // Obtener el historial de compras (facturas) del usuario
      const invoices = await Invoice.find({ userId: user._id }).populate('products.productId');

      // Responder al usuario con el historial de compras y el token
      return res.send({
        message: `Welcome ${user.name}`,
        loggedUser,
        token,
        invoices,  // Incluimos el historial de compras (facturas)
      });
    }
    return res.status(400).send({ message: 'Wrong username or password' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'General error with login function' });
  }
};

// Middleware de prueba (opcional)
export const test = (req, res) => {
  console.log('Test is running');
  return res.send({ message: 'Test is running' });
};
