let PRODUTO_EM_EDICAO = null;
 
document.addEventListener("DOMContentLoaded", () => {
  protegerPaginaAdmin();
  carregarTabelaProdutos();

  const form = document.getElementById("form-produto");
  form.addEventListener("submit", salvarProduto);

  document.getElementById("btn-cancelar-edicao").addEventListener("click", limparFormulario);
});

// Garante que apenas administradores acessem esta página
function protegerPaginaAdmin() {
  const usuario = getUsuarioLogado();
  if (!usuario || !usuario.admin) {
    alert("Acesso restrito a administradores. Faça login com uma conta de administrador.");
    window.location.href = "index.html";
  }
}

async function carregarTabelaProdutos() {
  const resp = await fetch(`${API_URL}/produtos`);
  const produtos = await resp.json();
  const tbody = document.getElementById("tabela-produtos-body");

  tbody.innerHTML = produtos
    .map(
      (p) => `
      <tr>
        <td><img src="${p.imagem}" alt="${p.nome}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;"></td>
        <td>${p.nome}</td>
        <td>${p.categoria}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
        <td>${p.estoque}</td>
        <td>${p.destaque ? "Sim" : "Não"}</td>
        <td class="tabela-acoes">
          <button class="btn btn-sm btn-outline-primary" onclick="editarProduto('${p.id}')">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="excluirProduto('${p.id}')">Excluir</button>
        </td>
      </tr>
    `
    )
    .join("");
}

async function salvarProduto(e) {
  e.preventDefault();

  const produto = {
    nome: document.getElementById("prod-nome").value.trim(),
    categoria: document.getElementById("prod-categoria").value.trim(),
    preco: parseFloat(document.getElementById("prod-preco").value),
    estoque: parseInt(document.getElementById("prod-estoque").value, 10),
    descricao: document.getElementById("prod-descricao").value.trim(),
    imagem: document.getElementById("prod-imagem").value.trim(),
    destaque: document.getElementById("prod-destaque").checked,
    avaliacao: parseFloat(document.getElementById("prod-avaliacao").value) || 0,
  };

  if (PRODUTO_EM_EDICAO) {
    await fetch(`${API_URL}/produtos/${PRODUTO_EM_EDICAO}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: PRODUTO_EM_EDICAO, ...produto }),
    });
  } else {
    await fetch(`${API_URL}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: crypto.randomUUID(), ...produto }),
    });
  }

  limparFormulario();
  carregarTabelaProdutos();
}

async function editarProduto(id) {
  const resp = await fetch(`${API_URL}/produtos/${id}`);
  const produto = await resp.json();

  PRODUTO_EM_EDICAO = id;
  document.getElementById("prod-nome").value = produto.nome;
  document.getElementById("prod-categoria").value = produto.categoria;
  document.getElementById("prod-preco").value = produto.preco;
  document.getElementById("prod-estoque").value = produto.estoque;
  document.getElementById("prod-descricao").value = produto.descricao;
  document.getElementById("prod-imagem").value = produto.imagem;
  document.getElementById("prod-destaque").checked = produto.destaque;
  document.getElementById("prod-avaliacao").value = produto.avaliacao || "";

  document.getElementById("titulo-form").textContent = "Editar Produto";
  document.getElementById("btn-cancelar-edicao").classList.remove("d-none");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;
  await fetch(`${API_URL}/produtos/${id}`, { method: "DELETE" });
  carregarTabelaProdutos();
}

function limparFormulario() {
  PRODUTO_EM_EDICAO = null;
  document.getElementById("form-produto").reset();
  document.getElementById("titulo-form").textContent = "Novo Produto";
  document.getElementById("btn-cancelar-edicao").classList.add("d-none");
}
