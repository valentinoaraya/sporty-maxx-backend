import {MercadoPagoConfig, Preference} from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESTOKEN
})

const preference = new Preference(client)

export default preference;