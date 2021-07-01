function noticiaComum(listaNoticias,id) {
  listaNoticias = embaralhaNoticias(listaNoticias);
  var k = '';
  var tipo = '';
  if(id == 'areaNoticiasPolitica'){
    tipo = 'politica';
  }else if (id == 'areaNoticiasSaude'){
    tipo = 'saude';
  }else if(id == 'areaNoticiasEducacao'){
    tipo = 'educacao';
  }

  listaNoticias.forEach((noticia) => {
    console.log(noticia);
    k += '<div class="col-xs-12 col-sm-6 col-md-12 ">';
    k += '<div class="col-12 px-2">';
    k +=
      '<div class="row noticia border-radius-principal border-noticia-' + tipo +' mt-3 ">';
    k += '<div class="col-12 col-md-6 col-lg-4  p-0">';
    k +=
      '<a href="#"><img class=" imagem-noticia" src="' +
      noticia.imagemUrl +
      '" alt="Noticia"></a>';
    k += '</div>';
    k += '<div class="col-12 col-md-6 col-lg-8 p-0 m-0 pt-2 px-2 d-flex ">';
    k += '<div class="row w-100">';
    k += '<div class="col-12 d-flex flex-column justify-content-between">';
    k +=
      '<a href="#" class="h5 text-principal titulo-noticia-normal" style="font-size: 16px;">' +
      noticia.titulo +
      '</a>';
    k +=
      '<p class="text-cinza mt-2" style="text-align: justify ; font-size: 12px;">' +
      noticia.olho +
      '</p>';
    k += '</div>';

    k += '<div class="col-12 row align-content-center mb-1 mb-md-2 mb-lg-0">';
    k += '<div class="col-lg-1 col-2 me-2 me-md-0">';
    k +=
      '<img src="https://via.placeholder.com/20x20" class=" imagem-autor border-principal" alt="" width="25">';
    k += '</div>';

    k += '<div class="col-lg-8 col-6 p-0  d-flex align-items-center">';
    k +=
      '<p class="nome-autor m-0 text-principal" style="font-size: small; font-weight: 600;">sdfs</p>';
    k += '</div>';

    k +=
      '<div class="col-3 p-0  d-flex justify-content-end align-items-center">';
    k +=
      '<p class="nome-autor m-0 text-principal" style="font-size: .6em; font-weight: 600;">10 min. atrás</p>';

    k += '</div>';
    k += '</div>';
    k += '</div>';
    k += '</div>';
    k += '</div>';
    k += '</div>';
    k += '</div>';
  });
  document.getElementById(id).innerHTML = k;
}

function embaralhaNoticias(lista) {
  var elementos = lista.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (elementos) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * elementos--);

    // And swap it with the current element.
    t = lista[elementos];
    lista[elementos] = lista[i];
    lista[i] = t;
  }

  return lista;
}
