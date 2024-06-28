import admin from "../services/firebase-admin.js";

// Middleware de autorización para verificar el token del usuario
export const verificarTokenFirebase = async (req, res, next) => {
    const token = req.headers.authorization;

    try{
        if (!token){
            res.status(401).send({error: "Unauthorized"});
        } else {
            const decodedToken = await admin.auth().verifyIdToken(token.split(' ')[1]);
            if (decodedToken && decodedToken.role === 'admin') {
                req.user = decodedToken;
                next();
            } else {
                res.status(403).send({error: "Unauthorized"});
            }
        }

    } catch (error) {
        console.log("Error al verificar el token: ", error);
        res.status(401).send({error: "Unauthorized"});
    }
}