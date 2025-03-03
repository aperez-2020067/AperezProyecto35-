//Configurar el servidor de express (HTTP)

//Modular | + efectiva | trabaja en funciones

'use strict'

// ECModules | ESModules
import express from 'express' //Servidor HTTP
import morgan from 'morgan' //Logs
import helmet from 'helmet' //Seguridad para HTTP
import cors from 'cors' //Acceso al API
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import productRoutes from '../src/producto/product.routes.js'
import cartRoutes from '../src/cart/cart.routes.js'
import invoiceRoutes from '../src/invoice/invoice.routes.js'
import orderRoutes from '../src/order/order.routes.js'
import { limiter } from '../middlewares/rate.limit.js'


const configs = (app)=>{
    app.use(express.json()) //Aceptar y enviar datos en JSON
    app.use(express.urlencoded({extended: false})) //No encriptar la URL
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
}

const routes = (app)=>{
    app.use(authRoutes)
    app.use(categoryRoutes)
    app.use(productRoutes)
    app.use(cartRoutes)
    app.use(invoiceRoutes)
    app.use(orderRoutes)
    //Buenas prácticas de rutas
            //pre ruta o ruta general
    app.use('/v1/user', userRoutes)
}


//ESModules no acepta exports.
export const initServer = async()=>{
    const app = express() //Instancia de express
    try{
        configs(app) //Aplicar configuraciones al servidor
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    }catch(err){
        console.error('Server init failed', err)
    }
}
