function atualizarMenu() {
  const usuario = getUsuarioLogado();

  const linkFavoritos = document.getElementById("nav-link-favoritos");
  const linkCadastroItens = document.getElementById("nav-link-cadastro-itens");
  const linkLogin = document.getElementById("nav-link-login");
  const linkLogout = document.getElementById("nav-link-logout");
  const saudacao = document.getElementById("nav-saudacao");

  if (usuario) {
    // Usuário logado
    if (linkFavoritos) linkFavoritos.classList.remove("d-none");
    if (linkLogin) linkLogin.classList.add("d-none");
    if (linkLogout) linkLogout.classList.remove("d-none");
    if (saudacao) {
      saudacao.textContent = `Olá, ${usuario.nome.split(" ")[0]}`;
      saudacao.classList.remove("d-none");
    }
    if (linkCadastroItens) {
      linkCadastroItens.classList.toggle("d-none", !usuario.admin);
    }
  } else {
    // Visitante
    if (linkFavoritos) linkFavoritos.classList.add("d-none");
    if (linkLogin) linkLogin.classList.remove("d-none");
    if (linkLogout) linkLogout.classList.add("d-none");
    if (saudacao) saudacao.classList.add("d-none");
    if (linkCadastroItens) linkCadastroItens.classList.add("d-none");
  }
}

document.addEventListener("DOMContentLoaded", atualizarMenu);
