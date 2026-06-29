let TODOS_PRODUTOS = [];
let FAVORITOS_USUARIO = []; 

// Inicialização 
document.addEventListener("DOMContentLoaded", async () => {
  await carregarProdutos();
  await carregarFavoritosDoUsuario();

  montarCards(TODOS_PRODUTOS);
  montarGraficos(TODOS_PRODUTOS);

  const campoBusca = document.getElementById("campo-busca");
  if (campoBusca) {
    campoBusca.addEventListener("input", (e) => {
      const termo = e.target.value.trim().toLowerCase();
      if (!termo) {
        montarCards(TODOS_PRODUTOS);
        return;
      }
      const filtrados = TODOS_PRODUTOS.filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          p.descricao.toLowerCase().includes(termo)
      );
      montarCards(filtrados);
    });
  }
});

// Dados
async function carregarProdutos() {
  const resp = await fetch(`${API_URL}/produtos`);
  TODOS_PRODUTOS = await resp.json();
}

async function carregarFavoritosDoUsuario() {
  const usuario = getUsuarioLogado();
  if (!usuario) {
    FAVORITOS_USUARIO = [];
    return;
  }
  const resp = await fetch(`${API_URL}/favoritos?usuarioId=${usuario.id}`);
  const favoritos = await resp.json();
  FAVORITOS_USUARIO = favoritos.map((f) => f.produtoId);
}

// Cards
function montarCards(produtos) {
  const container = document.getElementById("lista-produtos");
  if (!container) return;

  const usuario = getUsuarioLogado();

  if (produtos.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">Nenhum produto encontrado.</p>`;
    return;
  }

  container.innerHTML = produtos
    .map((produto) => {
      const isFavorito = FAVORITOS_USUARIO.includes(produto.id);
      const coracao = isFavorito ? "❤️" : "🤍";
      const disabledAttr = usuario ? "" : "disabled";

      return `
        <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
          <div class="produto-card card" onclick="irParaDetalhes('${produto.id}')">
            <img src="${produto.imagem}" alt="${produto.nome}">
            <div class="card-body">
              <div class="card-header-row">
                <span class="badge badge-categoria">${produto.categoria}</span>
                <button class="btn-favorito" ${disabledAttr}
                  onclick="event.stopPropagation(); alternarFavorito('${produto.id}', this)"
                  title="${usuario ? "Favoritar" : "Faça login para favoritar"}">
                  ${coracao}
                </button>
              </div>
              <h6 class="mt-2 mb-1">${produto.nome}</h6>
              <p class="text-muted small flex-grow-1">${produto.descricao}</p>
              <div class="preco">R$ ${produto.preco.toFixed(2)}</div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

async function alternarFavorito(produtoId, botaoEl) {
  const usuario = getUsuarioLogado();
  if (!usuario) return;

  const jaFavorito = FAVORITOS_USUARIO.includes(produtoId);

  if (jaFavorito) {
    // Remove favorito
    const resp = await fetch(`${API_URL}/favoritos?usuarioId=${usuario.id}&produtoId=${produtoId}`);
    const registros = await resp.json();
    for (const reg of registros) {
      await fetch(`${API_URL}/favoritos/${reg.id}`, { method: "DELETE" });
    }
    FAVORITOS_USUARIO = FAVORITOS_USUARIO.filter((id) => id !== produtoId);
    botaoEl.textContent = "🤍";
  } else {
    await fetch(`${API_URL}/favoritos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: crypto.randomUUID(), usuarioId: usuario.id, produtoId }),
    });
    FAVORITOS_USUARIO.push(produtoId);
    botaoEl.textContent = "❤️";
  }
}

// Navegação para detalhes
function irParaDetalhes(produtoId) {
  window.location.href = `detalhes.html?id=${produtoId}`;
}

// Gráficos 
function montarGraficos(produtos) {
  montarGraficoPizza(produtos);
  montarGraficoBarras(produtos);
}

function montarGraficoPizza(produtos) {
  const canvas = document.getElementById("grafico-categorias");
  if (!canvas) return;

  const contagem = {};
  produtos.forEach((p) => {
    contagem[p.categoria] = (contagem[p.categoria] || 0) + 1;
  });

  new Chart(canvas, {
    type: "pie",
    data: {
      labels: Object.keys(contagem),
      datasets: [
        {
          label: "Produtos por categoria",
          data: Object.values(contagem),
          backgroundColor: [
            "#2e5cff",
            "#ff4d6d",
            "#ffb703",
            "#06d6a0",
            "#9b5de5",
            "#fb8500",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: "Produtos por Categoria" },
      },
    },
  });
}

function montarGraficoBarras(produtos) {
  const canvas = document.getElementById("grafico-precos");
  if (!canvas) return;

  const faixas = {
    "Até R$ 100": 0,
    "R$ 100 - 200": 0,
    "R$ 200 - 300": 0,
    "Acima de R$ 300": 0,
  };

  produtos.forEach((p) => {
    if (p.preco <= 100) faixas["Até R$ 100"]++;
    else if (p.preco <= 200) faixas["R$ 100 - 200"]++;
    else if (p.preco <= 300) faixas["R$ 200 - 300"]++;
    else faixas["Acima de R$ 300"]++;
  });

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: Object.keys(faixas),
      datasets: [
        {
          label: "Quantidade de produtos",
          data: Object.values(faixas),
          backgroundColor: "#2e5cff",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: "Produtos por Faixa de Preço" },
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    },
  });
}
