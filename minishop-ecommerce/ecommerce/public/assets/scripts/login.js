const API_URL = "/api";

// Utilitários de sessão
function getUsuarioLogado() {
  const dados = sessionStorage.getItem("usuarioLogado");
  return dados ? JSON.parse(dados) : null;
}

function setUsuarioLogado(usuario) {
  sessionStorage.setItem("usuarioLogado", JSON.stringify(usuario));
}

function logout() {
  sessionStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

// Login
async function efetuarLogin(login, senha) {
  const resp = await fetch(`${API_URL}/usuarios?login=${encodeURIComponent(login)}`);
  const usuarios = await resp.json();

  const usuario = usuarios.find((u) => u.senha === senha);

  if (!usuario) {
    return { sucesso: false, mensagem: "Login ou senha inválidos." };
  }

  setUsuarioLogado(usuario);
  return { sucesso: true, usuario };
}

// Cadastro de novo usuário 
async function cadastrarUsuario(novoUsuario) {
  // Verifica se já existe login igual
  const resp = await fetch(`${API_URL}/usuarios?login=${encodeURIComponent(novoUsuario.login)}`);
  const existentes = await resp.json();

  if (existentes.length > 0) {
    return { sucesso: false, mensagem: "Este login já está em uso." };
  }

  const usuarioCriado = {
    ...novoUsuario,
    id: crypto.randomUUID(),
    admin: false,
  };

  const respCriacao = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuarioCriado),
  });

  if (!respCriacao.ok) {
    return { sucesso: false, mensagem: "Não foi possível concluir o cadastro." };
  }

  const usuario = await respCriacao.json();
  return { sucesso: true, usuario };
}

// Bind dos formulários (se existirem na página)
document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      const login = document.getElementById("login-usuario").value.trim();
      const senha = document.getElementById("login-senha").value;
      const alertaEl = document.getElementById("login-alerta");

      const resultado = await efetuarLogin(login, senha);

      if (resultado.sucesso) {
        window.location.href = "index.html";
      } else {
        alertaEl.textContent = resultado.mensagem;
        alertaEl.classList.remove("d-none");
      }
    });
  }

  const formCadastroUsuario = document.getElementById("form-cadastro-usuario");
  if (formCadastroUsuario) {
    formCadastroUsuario.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nome = document.getElementById("cad-nome").value.trim();
      const email = document.getElementById("cad-email").value.trim();
      const login = document.getElementById("cad-login").value.trim();
      const senha = document.getElementById("cad-senha").value;
      const alertaEl = document.getElementById("cadastro-alerta");

      const resultado = await cadastrarUsuario({ nome, email, login, senha });

      if (resultado.sucesso) {
        setUsuarioLogado(resultado.usuario);
        window.location.href = "index.html";
      } else {
        alertaEl.textContent = resultado.mensagem;
        alertaEl.classList.remove("d-none");
      }
    });
  }

  // Botão de logout (pode existir em qualquer página)
  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }
});
