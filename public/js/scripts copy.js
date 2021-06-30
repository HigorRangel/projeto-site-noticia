function limpaCampos(event) {
  tipoUsuario = document.getElementById('tipoUsuarioRegistro').value = 0;
  email = document.getElementById('emailUsuarioRegistro').value = '';
  primeiroNome = document.getElementById('primeiroNomeRegistro').value = '';
  nomesDoMeio = document.getElementById('nomesMeioRegistro').value = '';
  ultimoNome = document.getElementById('ultimoNomeRegistro').value = '';
  senha = document.getElementById('senhaRegistro').value = '';
  confirmaSenha = document.getElementById('confirmarSenhaRegistro').value = '';
}

function cadastraUsuario(event) {
  let formNovoUsuario = document.getElementById('formNovoUsuario');

  let resultValidacao = formNovoUsuario.reportValidity();

  if (resultValidacao) {
    let tipoUsuario = document.getElementById('tipoUsuarioRegistro').value;
    let email = document.getElementById('emailUsuarioRegistro').value;
    let primeiroNome = document.getElementById('primeiroNomeRegistro').value;
    let nomesDoMeio = document.getElementById('nomesMeioRegistro').value;
    let ultimoNome = document.getElementById('ultimoNomeRegistro').value;
    let senha = document.getElementById('senhaRegistro').value;
    let confirmaSenha = document.getElementById('confirmarSenhaRegistro').value;

    criaUsuario(
      email,
      senha,
      tipoUsuario,
      primeiroNome,
      nomesDoMeio,
      ultimoNome,
    );
  }
}

function insere(nomeTabela, objetoInsercao) {
  db.collection(nomeTabela)
    .add(objetoInsercao)
    .then(function (docRef) {})
    .catch(function (error) {
      mostraModal(
        'Não foi possível inserir o registro.',
        'Erro: ' + error.code,
      );
    });
}

function buscaTodosRegistros(nomeTabela, callback) {
  let resultados = [];
  db.collection(nomeTabela)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        callback(doc);
      });
    });
  console.log(resultados);
  return resultados;
}

function buscaRegistroPorAtributo(nomeTabela, atributos, callback) {
  db.collection(nomeTabela)
    .where(...atributos)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        callback(doc);
      });
    });
}

function removeRegistro(nomeTabela, atributo) {
  db.collection(nomeTabela)
    .doc(atributo)
    .delete()
    .then(() => {
      mostraModal('Sucesso', 'O registro foi removido com sucesso!');
    })
    .catch((error) => {
      mostraModal('Falha', 'O registro não foi removido. Erro: ' + error);
    });
}

function criaUsuario(email, senha, nomeUsuario) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, senha)
    .then((user) => {
      user.user.updateProfile({
        displayName: nomeUsuario,
      });
      mostraModal(
        'Usuário criado',
        'O usuário foi inserido com sucesso com o ID: ' + user.user.uid,
      );
    })
    .catch((error) => {
      let msgErro;
      if (error.code === 'auth/email-already-in-use') {
        msgErro = 'O e-mail já está cadastrado para outra conta.';
        mostraModal('Erro ao inserir o usuário.', msgErro);
      } else {
        mostraModal('Erro ao inserir o usuário.', error.code);
      }
    });
}

function mostraModal(titulo, mensagem) {
  var myModal = new bootstrap.Modal(document.getElementById('modalMsg'), {});

  document.getElementById('tituloModal').innerHTML = titulo;
  document.getElementById('mensagemModal').innerHTML = mensagem;

  myModal.show();
}

function esqueceuSenha() {
  let email = document.getElementById('emailLogin').value;

  if (email != '' && email != null) {
    atualizaSenha(email);
  } else {
    mostraModal('Falha na solicitação.', 'Digite um e-mail válido.');
  }
}
function atualizaSenha(email) {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(function () {
      mostraModal(
        'Solicitação efetuada com sucesso.',
        'Um link para redefinição da senha foi enviada para o e-mail: ' +
          email +
          '.',
      );
    })
    .catch(function (error) {
      mostraModal(
        'Erro na solicitação',
        'Não foi possível solicitar a redefinição de senha.',
      );
    });
}

function carregaListaUsuarios() {
  let listaUsuarios = buscaTodosRegistros('usuario', addLinhaUsuario);
}

function addLinhaUsuario(usuario) {
  let row = document.createElement('tr');

  let coluna1 = document.createElement('td');
  coluna1.innerHTML = usuario.id;
  row.appendChild(coluna1);

  let coluna2 = document.createElement('td');
  coluna2.innerHTML =
    usuario.data().primeiro_nome +
    ' ' +
    usuario.data().nomes_meio +
    ' ' +
    usuario.data().ultimo_nome;
  row.appendChild(coluna2);

  let coluna3 = document.createElement('td');
  coluna3.innerHTML = usuario.data().email;
  row.appendChild(coluna3);

  addBotaoExcluir(row);

  let tabela = document.querySelector('#tabelaUsuarios tbody');
  tabela.appendChild(row);
}

function addBotaoExcluir(linha) {
  let conteudoBotao = document.createElement('td');
  let botao = document.createElement('button');
  botao.classList.add('btn');
  botao.classList.add('btn-danger');
  botao.textContent = 'Excluir';

  botao.addEventListener('click', function () {
    exclui(linha);
  });
  conteudoBotao.appendChild(botao);
  linha.appendChild(conteudoBotao);
}

function exclui(linha) {
  var id = linha.getElementsByTagName('td')[0].innerHTML;
  var email = linha.getElementsByTagName('td')[2].innerHTML;
  buscaRegistroPorAtributo(
    'usuario',
    ['email', '==', email],
    function (usuario) {
      setTimeout(() => {
        login(usuario.data().email, usuario.data().senha);
      }, 2000);
      excluir();
    },
  );
  console.log(usuario);

  login(usuario.data().email, usuario.data().senha);

  removeRegistro('usuario', id);

  linha.remove();
}

function fazerLogin() {
  email = document.getElementById('emailLogin').value;
  senha = document.getElementById('senhaLogin').value;
  login(email, senha, function () {
    mostraModal('Sucesso', 'Usuário conectado com sucesso.');

    document.getElementById('btnLogin').classList.add('d-none');
    document.getElementById('btnRegistra').classList.add('d-none');
    document.getElementById('btnExcluir').classList.remove('d-none');
    document.getElementById('btnSair').classList.remove('d-none');
  }),
    function () {
      mostraModal('Falha no login', 'Não foi possível realizar o login.');
    };
}

function login(email, senha, callbackOK, callbackErro) {
  console.log(email);
  firebase
    .auth()
    .signInWithEmailAndPassword(email, senha)
    .then(() => {
      if (callbackOK) {
        callbackOK();
      }
    })
    .catch(function (error) {
      if (callbackErro) {
        callbackErro();
      }
      console.log(error);
    });

  // firebase
  //   .auth()
  //   .signInWithEmailAndPassword(email, senha)
  //   .then(() => {
  //     search = db.collection('usuario').get();

  //     search
  //       .then((data) => {
  //         let cu = 0;
  //         data.forEach((doc) => {
  //           console.log('fds');
  //           console.log(doc.data());

  //           if (doc.data().email == email) {
  //             cu++;
  //           }
  //         });

  //         if (cu === 1) {
  //           mostraModal('Sucesso', 'Usuário conectado com sucesso.');

  //           document.getElementById('btnLogin').classList.add('d-none');
  //           document.getElementById('btnRegistra').classList.add('d-none');
  //           document.getElementById('btnExcluir').classList.remove('d-none');
  //           document.getElementById('btnSair').classList.remove('d-none');
  //         } else {
  //           var user = firebase.auth().currentUser;
  //           user
  //             .delete()
  //             .then(function () {
  //               mostraModal('Falha', 'Usuário não encontrado');
  //             })
  //             .catch(function (error) {
  //               mostraModal(
  //                 'Falha',
  //                 'Usuário não foi excluído. Erro: ' + error.message,
  //               );
  //             });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log('fds');
  //         console.log(error);
  //       });
  //   })
  //   .catch(function (error) {
  //     mostraModal(
  //       'Falha no login',
  //       'Não foi possível realizar o login. Erro: ' + error.message,
  //     );
  //   });
}

function excluir() {
  var user = firebase.auth().currentUser;
  user
    .delete()
    .then(function () {
      mostraModal('Sucesso', 'Usuário excluído com sucesso!');
      setTimeout(() => {
        //window.location.href = 'login.html';
      }, 2000);
    })
    .catch(function (error) {
      mostraModal('Falha', 'Usuário não foi excluído. Erro: ' + error.message);
    });
}

function logout() {
  firebase
    .auth()
    .signOut()
    .then(
      function () {
        mostraModal('', 'O usuário foi deslogado.');

        setTimeout(() => {
          window.location.href = 'login.html';
        }, 3500);
      },
      function (error) {
        mostraModal('', 'Não foi possível deslogar. Erro: ' + error.message);
      },
    );
}
