buscaTodosRegistros('noticia', noticiaComum);

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
    let email = document.getElementById('emailUsuarioRegistro').value;
    let nomeUsuario = document.getElementById('campoNomeCadastro').value;
    let senha = document.getElementById('senhaRegistro').value;
    let confirmaSenha = document.getElementById('confirmarSenhaRegistro').value;

    criaUsuario(email, senha, nomeUsuario);
  }
}

function cadastraNoticia(event, email, senha) {
  let image = document.getElementById('imagemForm').files[0];

  let storageRef = firebase.storage().ref('noticia/' + image.name);

  let uploadTask = storageRef.put(image);

  uploadTask.on(
    'state_changed',
    function (snapshot) {
      var progresso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      console.log('O Upload está ' + progresso + ' completo');
    },
    function (error) {
      console.log(error.message);
    },
    function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (URL) {
        let imagemUrl = URL;
        let categoria = document.getElementById('categoriaForm').value;
        let titulo = document.getElementById('tituloForm').value;
        let autor = document.getElementById('autorForm').value;
        let olho = document.getElementById('olhoNoticiaForm').value;
        let corpo = document.getElementById('corpoNoticiaForm').value;

        criaNoticia(categoria, titulo, autor, olho, corpo, imagemUrl);
      });
    },
  );
}

function salvarImagemNoticia() {
  let image = document.getElementById('imagemForm').files[0];

  let storageRef = firebase.storage().ref('noticia/' + image.name);

  let uploadTask = storageRef.put(image);

  uploadTask.on(
    'state_changed',
    function (snapshot) {
      var progresso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      console.log('O Upload está ' + progresso + ' completo');
    },
    function (error) {
      console.log(error.message);
    },
    function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        url = downloadURL;
        console.log(downloadURL);
      });
    },
  );
  return url;
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
  db.collection(nomeTabela)
    .get()
    .then((querySnapshot) => {
      let resultados = new Array(0);
      querySnapshot.forEach((doc) => {
        resultados.push(doc.data());
      });
      callback(resultados);
    });
}

function buscaRegistroPorAtributo(nomeTabela, atributos, callback) {
  db.collection(nomeTabela)
    .where(...atributos)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        resultados.push(doc.data());
        callback(doc);
      });
    });
  return resultados;
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
function criaNoticia(categoria, titulo, autor, olho, corpo, imagemUrl) {
  insere('noticia', {
    categoria: categoria,
    titulo: titulo,
    autor: autor,
    olho: olho,
    corpo: corpo,
    data: firebase.firestore.FieldValue.serverTimestamp(),
    curtidas: 0,
    imagemUrl: imagemUrl,
  });
  mostraModal('Notícia adicionada', 'A notícia foi adicionada com sucesso.');
}
function criaUsuario(
  email,
  senha,
  tipoUsuario,
  primeiroNome,
  nomesDoMeio,
  ultimoNome,
) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, senha)
    .then((user) => {
      insere('usuario', {
        uid: user.user.uid,
        tipo: tipoUsuario,
        email: email,
        primeiro_nome: primeiroNome,
        nomes_meio: nomesDoMeio,
        ultimo_nome: ultimoNome,
        senha: senha,
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
  removeRegistro('usuario', id);

  buscaRegistroPorAtributo('usuario', ['uid', '==']);

  firebase
    .auth()
    .signInWithEmailAndPassword(email, senha)
    .then(() => {
      mostraModal('Sucesso', 'Usuário conectado com sucesso.');

      document.getElementById('btnLogin').classList.add('d-none');
      document.getElementById('btnRegistra').classList.add('d-none');
      document.getElementById('btnExcluir').classList.remove('d-none');
      document.getElementById('btnSair').classList.remove('d-none');
    });

  linha.remove();
}

function login() {
  email = document.getElementById('emailLogin').value;
  senha = document.getElementById('senhaLogin').value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, senha)
    .then(() => {
      mostraModal('Sucesso', 'Usuário conectado com sucesso.');

      // document.getElementById('btnLogin').classList.add('d-none');
      // document.getElementById('btnRegistra').classList.add('d-none');
      // document.getElementById('btnExcluir').classList.remove('d-none');
      // document.getElementById('btnSair').classList.remove('d-none');
      // document.getElementById('secaoLogin').classList.add('d-none');
      // document.getElementById('secaoCadastroTarefa').classList.remove('d-none');
      // document.getElementById('divLista').classList.remove('invisible');
      // document.getElementById('divLista').classList.remove('d-none');
      carregaListaTarefas();
    })
    .catch(function (error) {
      mostraModal(
        'Falha no login',
        'Não foi possível realizar o login. Erro: ' + error.message,
      );
    });
}

function excluir() {
  var user = firebase.auth().currentUser;
  user
    .delete()
    .then(function () {
      mostraModal('Sucesso', 'Usuário excluído com sucesso!');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);

      document.getElementById('btnLogin').classList.remove('d-none');
      document.getElementById('btnRegistra').classList.remove('d-none');
      document.getElementById('btnExcluir').classList.add('d-none');
      document.getElementById('btnSair').classList.add('d-none');
      document.getElementById('msg-label').style.visibility = 'hidden';
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

        document.getElementById('btnLogin').classList.remove('d-none');
        document.getElementById('btnRegistra').classList.remove('d-none');
        document.getElementById('btnExcluir').classList.add('d-none');
        document.getElementById('btnSair').classList.add('d-none');
        document.getElementById('msg-label').style.visibility = 'hidden';
      },
      function (error) {
        mostraModal('', 'Não foi possível deslogar. Erro: ' + error.message);
      },
    );
}
