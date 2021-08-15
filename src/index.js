/*******************************************************************************************************/
// Requerimos las dependencias //
/*******************************************************************************************************/
const express = require('express');
const http = require('http');
const { platform } = require('os');
const Stripe = require('stripe');
const cors = require('cors');
const dotenv = require('dotenv');

/*******************************************************************************************************/
// Habilitamos las variables de entorno //
/*******************************************************************************************************/
dotenv.config();

/*******************************************************************************************************/
// Declaramos la variable de aplicación express //
/*******************************************************************************************************/
const app = express();

/*******************************************************************************************************/
// Configuración de Stripe //
/*******************************************************************************************************/
// Llave privada de stripe (Se debe colocar la creada con su cuenta personal en la página de Stripe)
const private_key = process.env.STRIPE_PRIVATE_KEY || '';
// Creamos el objeto de stripe
const stripe = new Stripe(private_key);

/*******************************************************************************************************/
// Middlewares de la aplicación //
/*******************************************************************************************************/
// Realiza un parse de los formatos aplication/json
app.use(express.json());
// Decodifica los datos enviados desde un formulario
app.use(express.urlencoded({ extended: false }));
// Permite acceder a recursos del servidor desde otros dominios
app.use('*', cors());

/*******************************************************************************************************/
// Rutas de la aplicación //
/*******************************************************************************************************/
// Ruta para el validar el checkout
app.post('/api/checkout', async (req, res) => {
	// Obtenemos el body
	const { body } = req;
	// Obtenemos las propiedades del cuerpo de la petición
	const { id, amount } = body;

	try {
		// Realizamos el pago con stripe
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: 'USD',
			payment_method: id,
			description: 'Laptop Dell Alienware M15',
			confirm: true
		});

		// Mostramos en consola el pago
		console.log(payment);

		// Devolvemos el payment
		res.send({ status: true, payment });
	} catch (error) {
		// Mostramos el error en consola
		console.log(error);

		// Devolvemos el error
		res.json({ status: false, message: error.raw.message });
	}
});

/*******************************************************************************************************/
// Creamos el Servidor HTTP //
/*******************************************************************************************************/
const server = http.createServer(app);

/*******************************************************************************************************/
// Parámetros del servidor //
/*******************************************************************************************************/
const appHost = 'http://localhost';
const appPort = 4000;

/*******************************************************************************************************/
// Arrancamos el Servidor HTTP con Express //
/*******************************************************************************************************/
server.listen(appPort, () => {
	console.log('********************************************************************************');
	console.log(`🚀 Servidor ${platform().toUpperCase()}, listo en: ${appHost}:${appPort}  🚀  `);
	console.log('********************************************************************************');
});
