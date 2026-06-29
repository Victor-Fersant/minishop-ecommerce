# MiniShop

Uma aplicação web de e-commerce desenvolvida para simular o cadastro e a visualização de produtos utilizando um banco de dados local com JSON Server. O projeto demonstra conceitos de consumo de API REST, manipulação do DOM e operações CRUD com JavaScript.

## Funcionalidades

- Cadastro de novos produtos (caso seja administrador)
- Listagem dinâmica de produtos
- Armazenamento de dados com JSON Server
- Consumo de API utilizando Fetch API
- Interface responsiva
- Atualização automática da lista após alterações

## Tecnologias

- HTML5
- CSS3
- JavaScript (ES6)
- JSON Server

## Como executar

1. Clone o repositório:

```bash
git clone https://github.com/Victor-Fersant/minishop-ecommerce.git
```

2. Entre na pasta do projeto:

```bash
cd ecommerce
```

3. Instale o JSON Server (caso ainda não tenha):

```bash
npm install -g json-server
```

ou

```bash
npm install json-server
```

4. Inicie o servidor:

```bash
json-server --watch db.json
```

ou

```bash
npx json-server db.json
```

5. Abra o arquivo `index.html` com a extensão **Live Server** do VS Code.

## 📚 Objetivos de aprendizagem

Este projeto foi desenvolvido para praticar:

- Manipulação do DOM
- Requisições assíncronas com Fetch API
- Operações CRUD
- Organização de projetos front-end
- Integração com JSON Server