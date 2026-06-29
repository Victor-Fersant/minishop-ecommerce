let PRODUTO_ATUAL = null;

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const produtoId = params.get("id");

  if (!produtoId) { 
    document.getElementById("detalhes-container").innerHTML =
      `<p class="text-center text-danger">Produto não informado.</p>`;
    return;
  }

  await carregarDetalhes(produtoId);
});

async function carregarDetalhes(produtoId) {
  const resp = await fetch(`${API_URL}/produtos/${produtoId}`);

  if (!resp.ok) {
    document.getElementById("detalhes-container").innerHTML =
      `<p class="text-center text-danger">Produto não encontrado.</p>`;
    return;
  }

  PRODUTO_ATUAL = await resp.json();
  const usuario = getUsuarioLogado();

  let favoritado = false;
  if (usuario) {
    const respFav = await fetch(`${API_URL}/favoritos?usuarioId=${usuario.id}&produtoId=${produtoId}`);
    const favoritos = await respFav.json();
    favoritado = favoritos.length > 0;
  }

  renderizarDetalhes(PRODUTO_ATUAL, favoritado, !!usuario);
}

function renderizarDetalhes(produto, favoritado, logado) {
  const container = document.getElementById("detalhes-container");
  const coracao = favoritado ? "❤️" : "🤍";
  const disabledAttr = logado ? "" : "disabled";

  container.innerHTML = `
    <div class="row">
      <div class="col-md-6 mb-3">
        <img src="${produto.imagem}" alt="${produto.nome}" class="detalhes-img">
      </div>
      <div class="col-md-6">
        <div class="d-flex justify-content-between align-items-start">
          <h2>${produto.nome}</h2>
          <button class="btn-favorito" id="btn-favorito-detalhes" ${disabledAttr}
            title="${logado ? "Favoritar" : "Faça login para favoritar"}">
            ${coracao}
          </button>
        </div>
        <span class="badge badge-categoria mb-3">${produto.categoria}</span>
        <p class="lead">${produto.descricao}</p>
        <p><strong>Avaliação:</strong> ⭐ ${produto.avaliacao || "N/A"}</p>
        <p><strong>Estoque disponível:</strong> ${produto.estoque} unidades</p>
        <h3 class="preco mt-3">R$ ${produto.preco.toFixed(2)}</h3>
        <button class="btn btn-primary mt-2" disabled title="Funcionalidade de compra fora do escopo deste trabalho">
          Adicionar ao carrinho
        </button>
        <div class="mt-4">
          <a href="index.html" class="btn btn-outline-secondary btn-sm">← Voltar para a loja</a>
        </div>
      </div>
    </div>
  `;

  const btnFav = document.getElementById("btn-favorito-detalhes");
  if (logado) {
    btnFav.addEventListener("click", () => alternarFavoritoDetalhes(produto.id, btnFav));
  }
}

async function alternarFavoritoDetalhes(produtoId, botaoEl) {
  const usuario = getUsuarioLogado();
  if (!usuario) return;

  const resp = await fetch(`${API_URL}/favoritos?usuarioId=${usuario.id}&produtoId=${produtoId}`);
  const registros = await resp.json();

  if (registros.length > 0) {
    for (const reg of registros) {
      await fetch(`${API_URL}/favoritos/${reg.id}`, { method: "DELETE" });
    }
    botaoEl.textContent = "🤍";
  } else {
    await fetch(`${API_URL}/favoritos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: crypto.randomUUID(), usuarioId: usuario.id, produtoId }),
    });
    botaoEl.textContent = "❤️";
  }
}
