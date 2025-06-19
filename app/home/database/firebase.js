import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBKe48WDKDr-hJgE2LkP1q-6qiBqFQ68S4',
  authDomain: 'maintenance-tracking.firebaseapp.com',
  projectId: 'maintenance-tracking',
  storageBucket: 'maintenance-tracking.appspot.com',
  messagingSenderId: '246298287677',
  appId: '1:246298287677:web:6d2fa1a34763b97060d454',
  databaseURL: 'https://maintenance-tracking.firebaseio.com',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const collection_name = 'users';

// const querySnapshot = await getPersons();
// querySnapshot.forEach((doc) => {
//     var id = doc.id;
//     var data = doc.data();

//     const para = document.createElement("p");
//     const node = document.createTextNode(id + " => " + data.name);
//     para.appendChild(node);

//     var body = document.getElementsByTagName("body")[0];
//     body.appendChild(para);
// });

/**
 * @type {ReturnType<any>}
 */
export const getPerson = async function (id) {
  const q = query(collection(db, collection_name), where('userId', '==', id));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.docs[0]) {
    return null;
  }

  return {
    ...querySnapshot.docs[0].data(),
    id: querySnapshot.docs[0].id,
  };
};

// export const getPersonByPathSegment = async function (id) {
//     const docRef = doc(db, collection_name, id);
//     const docSnap = await getDoc(docRef);

//     return docSnap.data();
// }

export const getPersons = async function (q) {
  var q2 = query(collection(db, collection_name), q);
  const querySnapshot = await getDocs(q2);

  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const addPerson = async function (p) {
  const docRef = await addDoc(collection(db, collection_name), p);
  return await getPerson(p.userId);
};

export const updatePerson = async function (p) {
  await updateDoc(doc(db, collection_name, p.id), p);
};

export const setPerson = async function (p) {
  await setDoc(doc(db, collection_name, p.id), p);
};
