let firebaseConfig = {
  apiKey: 'AIzaSyAkCbxVqaWE-1Hwc8xGj5oKdTKgFugFlo4',
  authDomain: 'projeto-site-noticia.firebaseapp.com',
  projectId: 'projeto-site-noticia',
  storageBucket: 'projeto-site-noticia.appspot.com',
  messagingSenderId: '531531812993',
  appId: '1:531531812993:web:f45c3b8e4b7b050f2a7d80',
  measurementId: 'G-GEBH1XH3L6',
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

let db = firebase.firestore();

let auth = firebase.auth();

let storage = firebase.storage();

let usuarioLogado = null;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    usuarioLogado = user;
  } else {
    usuarioLogado = null;
  }
});

function criaUsuario(email, senha) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, senha)
    .catch(function (error) {
      return error.code;
    });
}