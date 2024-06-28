import "dotenv/config";
import {initializeApp} from "firebase/app";
import {
    getFirestore, 
    doc, 
    addDoc, 
    getDoc, 
    getDocs, 
    collection, 
    updateDoc,
    deleteDoc,
    query,
    where,
    documentId,
    writeBatch,
    arrayUnion,
} from "firebase/firestore";

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

// Obtener productos por categoría
export async function getProductsFB() {
    try{
        const productsSnapshot = await getDocs(collection(db, "products"));
        const productsArray = productsSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
        return productsArray;
    }catch (error){
        console.log(error)
    }
    
}

// Obtener un producto por ID
export async function getProductByIdFB(id) {
    try{
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        const product = {...docSnap.data(), id: docSnap.id}; 
        return product;
    }catch (error){
        console.log(error)
    }
}

// Subir un nuevo producto (Solo lo podrá hacer el administrador)
export async function addProductFB(product) {
    try{
        const collectionRef = collection(db, "products"); 
        await addDoc(collectionRef, product)        
        return `Producto ${product.nombre} agregado correctamente a Firebase`;
    }catch (error){
        console.log(error)
    }
}

// Editar un producto (Solo lo podrá hacer el administrador)
export async function editProductFB(id, data) {
    try{
        const docRef = doc(db, "products", id);
        await updateDoc(docRef, data)
        console.log(`Product updated`)
        return data
    } catch (error) {
        console.log(error)
    }
}

// Eliminar un producto (Solo lo podrá hacer el administrador)
export async function deleteProductFB(id) {
    try{
        // Primero obtengo el producto
        const deletedProduct = await getProductByIdFB(id)

        // Elimino el producto y lo retorno
        const docRef = doc(db, "products", id);
        await deleteDoc(docRef)
        return deletedProduct
    } catch (error) {
        console.log(error)
    }    
}

export const createBuyOrder = async (order, buyerId)=> {
    try{
        const productsRef = collection(db, "products")
        const orderRef = collection(db, "orders")

        // Busco los ids de los productos a comprar
        const ids = order.products.map(product => product.id)

        // Traigo esos productos de la base de datos
        const q = query(productsRef, where(documentId(), "in", ids))
        const querySnapshot = await getDocs(q)

        // Uso batch para actualizar el stock de los productos
        const batch = writeBatch(db)

        querySnapshot.docs.forEach(doc => {
            const stockDisponible = doc.data().stock
            const productInCart = order.products.find(product => product.id === doc.id)
            const quantity = productInCart.count
            if (stockDisponible < quantity){
                console.log("No hay stock suficiente");
                throw new Error("No hay stock suficiente")
            } else {
                batch.update(doc.ref, {stock: stockDisponible - quantity})
            }
        })

        await batch.commit()
        const newOrder = await addDoc(orderRef, order)

        if (buyerId){
            const userRef = collection(db, "users")
            const q = query(userRef, where("idUser", "==", buyerId))
            const querySnapshot = await getDocs(q)
            const docRef = querySnapshot.docs[0].ref
            await updateDoc(docRef, {
                orders: arrayUnion({
                    date: order.date,
                    total: order.total,
                    products: order.products,
                    id: newOrder.id
                })
            })
        }
        console.log("Orden creada correctamente");
        return newOrder
    } catch (error) {
        console.log(error)
    }
}