buscaNoticia('areaNoticiasInicio', 0);
buscaTodosRegistros('noticia', noticiaMaisCurtida);
const parametros = new URLSearchParams(window.location.search);

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
    if (senha === confirmaSenha) {
      criaUsuario(email, senha, nomeUsuario);
    } else {
      let alertaCadastro = document.getElementById('alert-cad-usuario');
      alertaCadastro.innerHTML = 'As senhas não correspondem';
      alertaCadastro.classList.remove('d-none');
      alertaCadastro.classList.add('alert-danger');
      alertaCadastro.classList.remove('alert-sucess');
    }
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

function cadastraMensagem() {
  criaMensagem(
    document.getElementById('nomeContato').value,
    document.getElementById('emailContato').value,
    document.getElementById('mensagemContato').value,
  );
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
       var i = 0;
      let resultados = new Array(0);
      querySnapshot.forEach((doc) => {
        resultados.push(doc.data());
        
        resultados[i].id = doc.id;
        i++;
      });
      callback(resultados);
    });
}
function buscaNoticia(id, tipo) {
  let where = [];
  if (tipo !== 0) {
    where = ['categoria', '==', tipo.toString()];
  } else {
    where = ['categoria', '!=', tipo.toString()];
  }
  db.collection('noticia')
    .where(...where)
    .get()
    .then((querySnapshot) => {
      let resultados = new Array(0);
      var i = 0;
      querySnapshot.forEach((doc) => {
        resultados.push(doc.data());
        resultados[i].id = doc.id;
        i++;
      });
      noticiaComum(resultados, id, tipo);
    });
}

function buscarDadosNoticia() {
  db.collection('noticia')
    .doc(parametros.get('id'))
    .get()
    .then((doc) => {
      carregarNoticia(doc.data());
    });
}

function buscarResultado() {
  document.location.href =
    'resultado-busca.html?b=' + document.getElementById('campo-busca').value;
}

function atualizaCurtidaNoticia(operacao) {
  db.collection('noticia')
    .doc(parametros.get('id'))
    .get()
    .then((doc) => {
      let numCurtidas = doc.data().curtidas;
      if (operacao) {
        numCurtidas++;
      } else {
        numCurtidas--;
      }
      doc.ref
        .update({
          curtidas: numCurtidas,
        })
        .then(() => {
          atualizarNumeroCurtida(numCurtidas);
        });
    });
}

function buscaRegistroPorAtributo(nomeTabela, atributos, callback) {
  db.collection(nomeTabela)
    .where(...atributos)
    .get()
    .then((querySnapshot) => {
      let resultados = new Array(0);
      querySnapshot.forEach((doc) => {
        resultados.push(doc.data());
      });
      if (callback) {
        callback(resultados);
      }
    });
}

function removeCurtida(idNoticia) {
  db.collection('curtidas')
    .where('noticia', '==', idNoticia)
    .where('usuario', '==', usuarioLogado.uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
}

function removeRegistro(nomeTabela, atributo, callback) {
  db.collection(nomeTabela)
    .doc(atributo)
    .delete()
    .then(() => {
      mostraModal('Sucesso', 'O registro foi removido com sucesso!');
      if (callback) {
        callback();
      }
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

function criaUsuario(email, senha, nomeUsuario) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, senha)
    .then((user) => {
      user.user.updateProfile({
        displayName: nomeUsuario,
      });
      let alertaCadastro = document.getElementById('alert-cad-usuario');
      alertaCadastro.innerHTML =
        'Usuário cadastrado com sucesso com o id: ' + user.user.uid;
      alertaCadastro.classList.remove('d-none');
      alertaCadastro.classList.remove('alert-danger');
      alertaCadastro.classList.add('alert-success');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    })
    .catch((error) => {
      let alertaCadastro = document.getElementById('alert-cad-usuario');
      alertaCadastro.innerHTML =
        'Não foi possível cadastrar o usuário. [' +
        trataMsgErro(error.code) +
        ']';
      alertaCadastro.classList.remove('d-none');
      alertaCadastro.classList.add('alert-danger');
      alertaCadastro.classList.remove('alert-success');
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
      window.location.href = 'index.html';

      let alertLogin = document.getElementById('alert-login');
      alertLogin.classList.add('d-none');
    })
    .catch(function (error) {
      let tipoErro = trataMsgErro(error.code);
      let alertLogin = document.getElementById('alert-login');
      alertLogin.innerHTML =
        'Não foi possível realizar o Login. [' + tipoErro + ']';
      alertLogin.classList.remove('d-none');
    });
}

function trataMsgErro(code) {
  if (code === 'auth/invalid-email') {
    return 'E-mail inválido ou não preenchido.';
  } else if (code === 'auth/wrong-password') {
    return 'A senha está incorreta ou o usuário não a cadastrou.';
  } else if (code === 'auth/user-not-found') {
    return 'O usuário não foi encontrado.';
  } else if (code === 'auth/email-already-in-use') {
    return 'O e-mail já está inserido em outra conta.';
  }
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
        //mostraModal('O usuário foi deslogado.');
        window.location.href = 'index.html';
      },
      function (error) {
        //mostraModal('Não foi possível deslogar. Erro: ' + error.message);
      },
    );
}

function verificarAuth() {
  var logado = false;
  if (usuarioLogado != null) {
    logado = true;
  }
  return logado;
}

function atualizarAuth() {
  setTimeout(() => {
    if (verificarAuth()) {
      document.getElementById('navLogin').classList.add('d-none');
      document.getElementById('divUsuario').classList.remove('d-none');
      document.getElementById('navNoticia').classList.remove('d-none');
      document.getElementById('navCurtidas').classList.remove('d-none');
      document.getElementById('nomeUsuario').innerHTML =
        usuarioLogado.displayName;
    }
  }, 650);
}
function criaMensagem(nome, email, mensagem) {
  insere('mensagem', {
    nome: nome,
    email: email,
    mensagem: mensagem,
  });
  mostraModal(
    'Mensagem enviada',
    'Responderemos no seu e-mail assim que possível!',
  );
}


function procurarNoticia(){
    let resultados = new Array(0);
    let pesquisa = parametros.get('b');
    db.collection('noticia')
      .get()
      .then((querySnapshot) => {
          var i = 0;
        querySnapshot.forEach((doc) => {
          if(doc.data().titulo.toLowerCase().includes(pesquisa.toLowerCase())){
          resultados.push(doc.data());
          resultados[i].id = doc.id;
          i++;
        }
      });

      carregarBusca(resultados);
    });
}

function noticiasCurtidas(id) {
  db.collection('curtidas')
    .where('usuario', '==', id)
    .get()
    .then((querySnapshot) => {
      let resultados = new Array(0);
      querySnapshot.forEach((doc) => {
        var i = 0;
        db.collection('noticia')
        .doc(doc.data().noticia)
        .get()
        .then((noticia) => {
          resultados.push(noticia.data());
          resultados[i].id = noticia.id;
          i++;
        })
        
        
      }); 
      setTimeout(() => {
        carregarCurtidas(resultados);
      }, 300);
    });
}
