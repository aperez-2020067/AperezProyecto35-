'use strict'

import jwt from 'jsonwebtoken'

// Middleware para validar el JWT
export const validateJwt = async (req, res, next) => {
    try {
        // Obtener la llave de acceso al token desde las variables de entorno
        let secretKey = process.env.SECRET_KEY
        // Obtener el token de los headers
        let { authorization } = req.headers

        // Verificar si el token no viene
        if (!authorization) {
            return res.status(401).send({ message: 'Unauthorized, token missing' })
        }

        // Desencriptar el token
        let user = jwt.verify(authorization, secretKey)

        // Inyectar la información del usuario en la solicitud para su uso posterior
        req.user = user
        
        // Todo salió bien, pasar a la siguiente función
        next()

    } catch (err) {
        console.error(err)
        return res.status(401).send({ message: 'Invalid token or expired' })
    }
}


// Middleware para verificar si el usuario es ADMIN
export const isAdmin = (req, res, next) => {
    // Verificar si el rol del usuario es ADMIN
    if (req.user.role !== 'ADMIN') {
        return res.status(403).send({ message: 'Forbidden, only admins allowed' })
    }
    // Si el usuario es ADMIN, pasa a la siguiente función
    next()
}

// Middleware para verificar si el usuario es CLIENTE
export const isClient = (req, res, next) => {
    // Verificar si el rol del usuario es CLIENTE
    if (req.user.role !== 'CLIENT') {
        return res.status(403).send({ message: 'Forbidden, only clients allowed' })
    }
    // Si el usuario es CLIENTE, pasa a la siguiente función
    next()
}

// Middleware para verificar si el usuario es ADMIN o el mismo usuario
export const isAdminOrSameUser = (req, res, next) => {
    const { user } = req; // Este viene del JWT
    const { id } = req.params; // ID del usuario que se quiere actualizar/eliminar

    // Verificar si el usuario es ADMIN o si el ID del usuario en el token es igual al que se pasa como parámetro
    if (user.role === 'ADMIN' || user.uid === id) {
        return next(); // Si pasa la validación, sigue al siguiente middleware o función
    }

    return res.status(403).send({ message: 'Forbidden, you are not allowed to perform this action' });
};
