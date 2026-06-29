document.addEventListener("DOMContentLoaded", async () => {
  const usuario = getUsuarioLogado();

  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  await carregarFavoritos(usuario.id);
});
 
async function carregarFavoritos(usuarioId) {
  const respFav = await fetch(`${API_URL}/favoritos?usuarioId=${usuarioId}`);
  const favoritos = await respFav.json();
  const container = document.getElementById("lista-favoritos");

  if (favoritos.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">Você ainda não favoritou nenhum produto.</p>`;
    return;
  }

  const produtos = await Promise.all(
    favoritos.map((f) => fetch(`${API_URL}/produtos/${f.produtoId}`).then((r) => r.json()))
  );

  container.innerHTML = produtos
    .map(
      (p) => `
      <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
        <div class="produto-card card" onclick="window.location.href='detalhes.html?id=${p.id}'">
          <img src="${p.imagem}" alt="${p.nome}">
          <div class="card-body">
            <div class="card-header-row">
              <span class="badge badge-categoria">${p.categoria}</span>
              <button class="btn-favorito" onclick="event.stopPropagation(); removerFavorito('${p.id}')">❤️</button>
            </div>
            <h6 class="mt-2 mb-1">${p.nome}</h6>
            <p class="text-muted small flex-grow-1">${p.descricao}</p>
            <div class="preco">R$ ${p.preco.toFixed(2)}</div>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

async function removerFavorito(produtoId) {
  const usuario = getUsuarioLogado();
  const resp = await fetch(`${API_URL}/favoritos?usuarioId=${usuario.id}&produtoId=${produtoId}`);
  const registros = await resp.json();
  for (const reg of registros) {
    await fetch(`${API_URL}/favoritos/${reg.id}`, { method: "DELETE" });
  }
  carregarFavoritos(usuario.id);
}
