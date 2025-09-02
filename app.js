let listaNomes = [];

const amigoInput = document.getElementById('amigo');
const listaAmigos = document.getElementById('listaAmigos');
const resultado = document.getElementById('resultado');
const btnSortear = document.getElementById('btnSortear');
const btnReiniciar = document.getElementById('btnReiniciar');
const btnAdicionar = document.getElementById('btnAdicionar');

amigoInput.focus();

function normalizarNome(nome) {
  return nome.trim().toLowerCase();
}

function criarItemNome(nome) {
  const li = document.createElement('li');
  li.className = 'name-item';

  const span = document.createElement('span');
  span.className = 'name-text';
  span.textContent = nome;

  const btnEdit = document.createElement('button');
  btnEdit.className = 'btn-edit';
  btnEdit.setAttribute('aria-label', `Editar ${nome}`);
  btnEdit.textContent = '✏️';
  btnEdit.addEventListener('click', () => {
    const novoNome = prompt('Editar nome:', span.textContent);
    if (novoNome && novoNome.trim() !== '') {
      const nomeNormalizado = normalizarNome(novoNome);
      const nomesNormalizados = listaNomes.map(normalizarNome);
      // Verifica se novo nome já existe (exceto o próprio)
      if (nomesNormalizados.includes(nomeNormalizado) && nomeNormalizado !== normalizarNome(span.textContent)) {
        alert('Esse nome já está na lista.');
        return;
      }
      // Atualiza listaNomes e texto do span
      const idx = listaNomes.indexOf(span.textContent);
      if (idx > -1) {
        listaNomes[idx] = novoNome.trim();
        span.textContent = novoNome.trim();
        atualizarLista(); // Para re-renderizar e manter os eventos
      }
    }
  });

  const btnRemove = document.createElement('button');
  btnRemove.className = 'btn-remove';
  btnRemove.setAttribute('aria-label', `Remover ${nome}`);
  btnRemove.textContent = '🗑️';
  btnRemove.addEventListener('click', () => {
    const idx = listaNomes.indexOf(span.textContent);
    if (idx > -1) {
      listaNomes.splice(idx, 1);
      atualizarLista();
      resultado.innerHTML = ''; // limpa resultado para evitar confusão
    }
  });

  li.appendChild(span);
  li.appendChild(btnEdit);
  li.appendChild(btnRemove);

  return li;
}

function adicionarAmigo() {
  const nomeAmigo = amigoInput.value.trim();

  if (nomeAmigo === "") {
    alert("Campo não pode ser vazio ou conter apenas espaços.");
    return;
  }

  const nomesNormalizados = listaNomes.map(normalizarNome);
  const nomeNormalizado = normalizarNome(nomeAmigo);

  if (nomesNormalizados.includes(nomeNormalizado)) {
    alert("Esse nome já está incluso na lista.");
    return;
  }

  listaNomes.push(nomeAmigo);
  atualizarLista();
  limparCampo();
  amigoInput.focus();
}

function limparCampo() {
  amigoInput.value = '';
}

function atualizarLista() {
  listaAmigos.innerHTML = '';
  listaNomes.forEach(nome => {
    const li = criarItemNome(nome);
    listaAmigos.appendChild(li);
  });
  btnSortear.disabled = listaNomes.length < 4;
}

function embaralhar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function sorteioValido(original, sorteado) {
  return original.every((nome, i) => nome !== sorteado[i]);
}

function sortearAmigo() {
  if (listaNomes.length < 4) {
    alert("É necessário ter no mínimo 4 amigos na lista para sortear.");
    return;
  }

  let listaSorteada;
  do {
    listaSorteada = embaralhar(listaNomes);
  } while (!sorteioValido(listaNomes, listaSorteada));

  resultado.innerHTML = listaNomes
    .map((nome, i) => `<li><strong>${nome}</strong> tirou <strong>${listaSorteada[i]}</strong></li>`)
    .join('');
}

function reiniciar() {
  listaNomes = [];
  atualizarLista();
  resultado.innerHTML = '';
  limparCampo();
  amigoInput.focus();
}

btnSortear.addEventListener('click', sortearAmigo);
btnReiniciar.addEventListener('click', reiniciar);
btnAdicionar.addEventListener('click', adicionarAmigo);

amigoInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    adicionarAmigo();
  }
});
