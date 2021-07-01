
let firebaseConfig = {
  apiKey: 'AIzaSyAkCbxVqaWE-1Hwc8xGj5oKdTKgFugFlo4',
  authDomain: 'projeto-site-noticia.firebaseapp.com',
  projectId: 'projeto-site-noticia',
  storageBucket: 'projeto-site-noticia.appspot.com',
  messagingSenderId: '531531812993',
  appId: '1:531531812993:web:f45c3b8e4b7b050f2a7d80',
  measurementId: 'G-GEBH1XH3L6',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

let db = firebase.firestore();

let auth = firebase.auth();

let storage = firebase.storage();

let usuarioLogado = null;
// firebase.auth().signInWithEmailAndPassword('higor.rangel@aluno.ifsp.edu.br', '123mudar').catch(function(error) {

//   console.log(error);

// });

//escutando status do firebase
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    usuarioLogado = user;
    console.log(user);
    //console.log(user);
    //online
    // document.getElementById("console").innerHTML = JSON.stringify( user );
  } else {
    //document.getElementById("console").innerHTML = 'OffLine!';
    usuarioLogado = null;
  }
});

// //Ação de criar do botão #create
function criaUsuario(email, senha) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, senha)
    .catch(function (error) {
      return error.code;
    });
}

// //Ação de Login do botão #login
// document.getElementById("login").onclick = function() {

// 	firebase.auth().signInWithEmailAndPassword('email@email.com.br', '123mudar').catch(function(error) {

//   document.getElementById("console").innerHTML = JSON.stringify( error );

//   });
// };

// //Ação de Login do botão #logout
// document.getElementById("logout").onclick = function() {

//   firebase.auth().signOut()
//   .then(function() {
//     document.getElementById("console").innerHTML = 'Logout';
//   }, function(error) {
//     document.getElementById("console").innerHTML = JSON.stringify( error );
//   });

// };

// //Ação de alterar senha do botão #update
// document.getElementById("update").onclick = function() {

//   firebase.auth().currentUser.updatePassword('123mudar')
//   .then(function() {
//     document.getElementById("console").innerHTML = 'Senha Alterada!';
//   })
//   .catch(function(error) {
//     document.getElementById("console").innerHTML = JSON.stringify( error );
//   });

// };

// //Ação de criar do botão #create
// document.getElementById("create").onclick = function() {

//   firebase.auth().createUserWithEmailAndPassword('email@email.com.br', "123mudar").catch(function(error) {
//     document.getElementById("console").innerHTML = JSON.stringify( error );
//   });

// };

// //Ação de excluir do botão #delete
// document.getElementById("delete").onclick = function() {

//   var user = firebase.auth().currentUser;
//   user.delete().then(function() {
//     // User deleted.
//   }).catch(function(error) {
//     document.getElementById("console").innerHTML = JSON.stringify( error );
//   });

// };
