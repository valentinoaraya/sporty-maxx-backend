import "dotenv/config";
import {initializeApp} from "firebase/app";
import {getFirestore, doc, addDoc, getDoc, getDocs, collection, query, where, documentId } from "firebase/firestore";

// Configuración para conectarse a la DB
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measuramentId: process.env.FIREBASE_MEASUREMENT_ID
}

// Conexión a la DB
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Funciones de acceso a la DB --- //
// Obtener todos los productos
export async function getProductsFB() {
    const productsSnapshot = await getDocs(collection(db, "products"));
    const productsArray = productsSnapshot.docs.map(doc => doc.data());
    return productsArray;
}

// Obtener un producto por ID
export async function getProductByIdFB(id) {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

// Subir un nuevo producto (Solo lo podrá hacer el administrador)
export async function addProductFB(product) {
    // TODO
}

// Editar un producto (Solo lo podrá hacer el administrador)
export async function editProductFB(id, product) {
    // TODO
}

// Eliminar un producto (Solo lo podrá hacer el administrador)
export async function deleteProductFB(id) {
    // TODO
}
