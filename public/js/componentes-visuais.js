function noticiaComum(listaNoticias, id) {
  listaNoticias = embaralhaNoticias(listaNoticias);
  var k = '';
  var tipo = '';
  contador = 0;
  listaNoticias.forEach(function (noticia) {
    if (contador < 6 && id == 'areaNoticiasInicio') {
      k += noticiaComumDiv(noticia);
    } else if (id != 'areaNoticiasInicio') {
      k += noticiaComumDiv(noticia);
    }
    contador++;
  });
  document.getElementById(id).innerHTML = k;
}

function noticiaMaisCurtida(listaNoticias) {
  var k = '';
  let curtidas = 0;

  listaNoticias.forEach((noticia) => {
    if (curtidas === 0) {
      curtidas = noticia.curtidas;
      k = noticiaGrande(noticia);
    } else if (noticia.curtidas > curtidas) {
      curtidas = noticia.curtidas;
      k = noticiaGrande(noticia);
    }
  });
  document.getElementById('areaNoticiaGrandeInicio').innerHTML = k;
}

function embaralhaNoticias(lista) {
  var elementos = lista.length,
    t,
    i;

  while (elementos) {
    i = Math.floor(Math.random() * elementos--);
    t = lista[elementos];
    lista[elementos] = lista[i];
    lista[i] = t;
  }

  return lista;
}

function noticiaGrande(noticia) {
  let k = '';
  k += '<div class="noticia-grande col-lg-12 col-xl-9 col-12 pe-xl-0" style="max-height: 555.52px;">';
  k +=
    '<a href="noticia.html?id=' +
    noticia.id +
    '" class="text-center d-flex align-items-end justify-content-center">';
  k +=
    '<img style="max-height: 555.52px;" class="imagem-noticia-grande col-12" src="' +
    noticia.imagemUrl +
    '" alt="Noticia Grande" >';
  k += '</a>';
  k +=
    '<h1 class="h5 text-center text-white titulo-noticia-grande text-black mb-xl-5 mx-xl-5 d-block d-xl-none" style="font-weight: 600; font-size: 1.2em;">' +
    noticia.titulo +
    '</h1>';
  k += ' </div>';

  k +=
    '<div class="corpo-noticia-grande d-xl-block d-none col-12 col-xl-3 mt-lg-0 mt-5 shadow-principal" style="max-height: 555.52px;">';
  k +=
    ' <h1 class="h6 text-principal pt-3 py text-center titulo-sub-secao d-none d-lg-block" style="font-weight: 600;"><span class="">' +
    noticia.titulo +
    '</span></h1>';
  k +=
    ' <div class="corpo-mensagem-grande m-3 d-flex flex-column justify-content-center" style="max-height: 542px;">';
  k +=
    '<p class="" style="text-align: justify; font-size: .9em;">' + noticia.olho;
  k += '</p> </div> </div>';

  return k;
}

function tempoPostagem(data) {
  let dataPostagem = new Date(data.seconds * 1000);
  let dataAtual = new Date();

  let diferencaSegundos = Math.abs(
    dataAtual.getTime() - dataPostagem.getTime(),
  );
  let diferencaDias = Math.floor(diferencaSegundos / (1000 * 3600 * 24));

  if (diferencaDias < 1) {
    return 'Hoje';
  } else if (diferencaDias < 2) {
    return 'Ontem';
  } else {
    return diferencaDias + ' dias';
  }
}

function isCurtida(noticia) {

  if (usuarioLogado != null) {
    buscaRegistroPorAtributo(
      'curtidas',
      ['noticia', '==', getIdNoticia()],
      setBotaoCurtir,
    );
  }
}

function getIdNoticia() {
  let linkNoticia = window.location.href;
  let indexId = linkNoticia.search('(\\w+)(?!.*\\w)');
  idNoticia = linkNoticia.substring(indexId);
  return idNoticia;
}

function setBotaoCurtir(curtidas) {
  if (
    curtidas.filter((e) => e.usuario === usuarioLogado.uid) &&
    curtidas.length !== 0
  ) {
    document
      .getElementById('coracao-curtir-pagina-noticia')
      .classList.remove('far');
    document
      .getElementById('coracao-curtir-pagina-noticia')
      .classList.add('fas');
  } else {
    document
      .getElementById('coracao-curtir-pagina-noticia')
      .classList.remove('fas');
    document
      .getElementById('coracao-curtir-pagina-noticia')
      .classList.add('far');
  }
}

function atualizarNumeroCurtida(numCurtidas) {
  document.getElementById('curtidas-pagina-noticia').innerHTML = numCurtidas;
}

function carregarNoticia(noticia) {
  document.getElementById('imagem-pagina-noticia').src = noticia.imagemUrl;
  document.getElementById('titulo-pagina-noticia').innerText = noticia.titulo;
  document.getElementById('corpo-pagina-noticia').innerHTML = noticia.corpo;
  document.getElementById('curtidas-pagina-noticia').innerHTML =
    noticia.curtidas;
  document.getElementById('autor-pagina-noticia').innerHTML = noticia.autor;
  document.getElementById('data-pagina-noticia').innerHTML =
    converteTimestampData(noticia.data);
  isCurtida(noticia);
}

function noticiaComumDiv(noticia) {
  var k = '';
  var texto = '';
  if (noticia.categoria === '1') {
    tipo = 'politica';
  } else if (noticia.categoria === '2') {
    tipo = 'saude';
  } else if (noticia.categoria === '3') {
    tipo = 'educacao';
  }
  
  texto = tipo;

  if(window.location.href.includes("index")){
    texto = "principal";
  }

  k += '<div class="col-xs-12 col-sm-6 col-md-12 ">';
  k += '<div class="col-12 px-2">';
  k +=
    '<div class="row noticia border-radius-principal border-noticia-' +
    tipo +
    ' mt-3 ">';
  k += '<div class="col-12 col-md-6 col-lg-4 p-0" id="divImagemNoticia">';
  k +=
    '<a href="noticia.html?id=' +
    noticia.id +
    '"><img class=" imagem-noticia" src="' +
    noticia.imagemUrl +
    '" alt="Noticia"></a>';
  k += '</div>';
  k += '<div class="col-12 col-md-6 col-lg-8 p-0 m-0 pt-2 px-2 d-flex ">';
  k += '<div class="row w-100">';
  k += '<div class="col-12 d-flex flex-column justify-content-between">';
  k +=
    '<a href="noticia.html?id=' +
    noticia.id +
    '" class="h5 text-'+ texto +' titulo-noticia-normal" style="font-size: 16px;">' +
    noticia.titulo +
    '</a>';
  k +=
    '<p class="text-cinza mt-2" style="text-align: justify ; font-size: 12px;">' +
    noticia.olho +
    '</p>';
  k += '</div>';

  k += '<div class="col-12 row align-content-end pb-1 mb-1 mb-md-2 mb-lg-0">';

  k += '<div class="col-lg-9 col-7 d-flex align-items-center">';
  k +=
    '<p class="nome-autor m-0 text-'+ texto +'" style="font-size: small; font-weight: 600;">' +
    noticia.autor +
    '</p>';
  k += '</div>';

  k +=
    '<div class="col-lg-3 col-5 p-0  d-flex justify-content-end align-items-center">';
  k +=
    '<p class="nome-autor m-0 text-'+ texto +'" style="font-size: .6em; font-weight: 600;">' +
    tempoPostagem(noticia.data) +
    '</p>';

  k += '</div>';
  k += '</div>';
  k += '</div>';
  k += '</div>';
  k += '</div>';
  k += '</div>';
  k += '</div>';

  return k;
}

function carregarBusca(noticias) {
  noticiaComum(noticias, 'areaNoticiasBusca');
}

function carregarCurtidas(noticias){
  noticiaComum(noticias,'areaNoticiasCurtidas');
}

function carregarPaginaCurtidas(){
  
  setTimeout(() => {
    noticiasCurtidas(usuarioLogado.uid);
  }, 1500);
}

function converteTimestampData(timestamp) {
  let data = new Date(timestamp.seconds * 1000);
  (dia = data.getDate().toString()),
    (diaF = dia.length == 1 ? '0' + dia : dia),
    (mes = (data.getMonth() + 1).toString()), //+1 pois no getMonth Janeiro começa com zero.
    (mesF = mes.length == 1 ? '0' + mes : mes),
    (anoF = data.getFullYear());
  return diaF + '/' + mesF + '/' + anoF;
}

function curtirDescurtir() {
  botaoCurtir = document.getElementById('coracao-curtir-pagina-noticia');
  curtida = botaoCurtir.classList.contains('fas');
  if (curtida) {
    removeCurtida(getIdNoticia());
    atualizaCurtidaNoticia(false);
    botaoCurtir.classList.remove('fas');
    botaoCurtir.classList.add('far');
  } else {
    insere('curtidas', { usuario: usuarioLogado.uid, noticia: getIdNoticia() });
    atualizaCurtidaNoticia(true);
    botaoCurtir.classList.remove('far');
    botaoCurtir.classList.add('fas');
  }
}
