import "dotenv/config";
import admin from "firebase-admin";
import path from "path";
import { readFileSync } from "fs";

const serviceAccountPath = path.resolve(process.env.FIREBASE_ADMIN_KEY_PATH);
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

// --- funcion para darle admin a un usuario (Matías o yo) --- //
// const grantAdminRole = async (userId) => {
//     try {
//         await admin.auth().setCustomUserClaims(userId, {role: "admin"});
//         console.log("Admin granted")
//     } catch (error){
//         console.log(error)
//         console.log("Admin not granted")
//     }
// }
// const userId = ""
// await grantAdminRole(userId)

export default admin;