// Classes para dados
class Estabelecimento {
  constructor(nome, cnpj, endereco) {
    this.nome = nome;
    this.cnpj = cnpj;
    this.endereco = endereco;
    this.pontos = 0;
  }
}

class Coleta {
  constructor(cnpj, data, quantidade, ponto) {
    this.cnpj = cnpj;
    this.data = data;
    this.quantidade = quantidade;
    this.ponto = ponto;
  }
}

const plataforma = {
  estabelecimentos: [],
  coletas: [],
  pontos: [
    { nome: "ASA Recife Sede", endereco: "Rua da Paz , 82 Afogados" },
    { nome: "Parque Dois Irmãos", endereco: "Praça Farias Neves, Dois Irmãos" }
  ],

  cadastrarEstabelecimento(nome, cnpj, endereco) {
    if (!nome || !cnpj || !endereco) {
      alert("Preencha todos os campos.");
      return false;
    }

    for (let i = 0; i < this.estabelecimentos.length; i++) {
      if (this.estabelecimentos[i].cnpj === cnpj) {
        alert("CNPJ já cadastrado.");
        return false;
      }
    }

    const novo = new Estabelecimento(nome, cnpj, endereco);
    this.estabelecimentos.push(novo);
    alert("✅ Estabelecimento cadastrado!");
    return true;
  },

  agendarColeta(cnpj, data, quantidade, pontoIndex) {
    try {
      if (!cnpj || !data || !quantidade || isNaN(quantidade)) {
        alert("Dados inválidos.");
        return false;
      }

      let i = 0;
      let est = null;
      while (i < this.estabelecimentos.length) {
        if (this.estabelecimentos[i].cnpj === cnpj) {
          est = this.estabelecimentos[i];
          break;
        }
        i++;
      }

      if (!est) {
        alert("Estabelecimento não encontrado.");
        return false;
      }

      if (pontoIndex < 0 || pontoIndex >= this.pontos.length) {
        alert("Ponto de coleta inválido.");
        return false;
      }

      const pontosGanhos = quantidade * 10;
      est.pontos += pontosGanhos;

      const pontoEscolhido = this.pontos[pontoIndex];
      const novaColeta = new Coleta(cnpj, data, quantidade, pontoEscolhido);
      this.coletas.push(novaColeta);

      alert(`✅ Coleta agendada no ponto: ${pontoEscolhido.nome}\nPontos ganhos: ${pontosGanhos}`);
      return true;
    } catch (e) {
      alert("Erro ao agendar coleta: " + e.message);
      return false;
    }
  },

  listarPontos() {
    let texto = "Pontos de Coleta:\n";
    for (let i = 0; i < this.pontos.length; i++) {
      texto += `- ${this.pontos[i].nome} | ${this.pontos[i].endereco}\n`;
    }
    return texto;
  },

  exibirHistorico() {
    if (this.coletas.length === 0) return "Nenhuma coleta agendada.";

    let texto = "Histórico de Coletas:\n";
    for (let i = 0; i < this.coletas.length; i++) {
      const coleta = this.coletas[i];

      let nome = "Desconhecido";
      for (let j = 0; j < this.estabelecimentos.length; j++) {
        if (this.estabelecimentos[j].cnpj === coleta.cnpj) {
          nome = this.estabelecimentos[j].nome;
          break;
        }
      }

      const pontos = coleta.quantidade * 10;
      texto += `${nome} - ${coleta.data} - ${coleta.quantidade}L - ${pontos} pontos - Ponto: ${coleta.ponto.nome}\n`;
    }
    return texto;
  }
};

// Funções para mostrar os formulários e menus

function mostrarMenuPrincipal() {
  const menu = document.getElementById("menu");
  const form = document.getElementById("form-container");
  form.classList.add("hidden");
  menu.innerHTML = `
    <button onclick="mostrarFormCadastro()">Cadastrar Estabelecimento</button>
    <button onclick="mostrarFormAgendar()">Agendar Coleta</button>
    <button onclick="mostrarPontos()">Pontos de Coleta</button>
    <button onclick="mostrarHistorico()">Histórico e Pontuação</button>
  `;
}

function mostrarFormCadastro() {
  const menu = document.getElementById("menu");
  const form = document.getElementById("form-container");

  menu.innerHTML = "";
  form.classList.remove("hidden");
  form.innerHTML = `
    <h2>Cadastro de Estabelecimento</h2>
    <input type="text" id="nome" placeholder="Nome do Estabelecimento" />
    <input type="text" id="cnpj" placeholder="CNPJ" />
    <input type="text" id="endereco" placeholder="Endereço" />
    <button onclick="cadastrarEstabelecimento()">Cadastrar</button>
    <button onclick="mostrarMenuPrincipal()">Voltar</button>
  `;
}

function cadastrarEstabelecimento() {
  const nome = document.getElementById("nome").value.trim();
  const cnpj = document.getElementById("cnpj").value.trim();
  const endereco = document.getElementById("endereco").value.trim();

  if (plataforma.cadastrarEstabelecimento(nome, cnpj, endereco)) {
    mostrarMenuPrincipal();
  }
}

function mostrarFormAgendar() {
  const menu = document.getElementById("menu");
  const form = document.getElementById("form-container");

  menu.innerHTML = "";
  form.classList.remove("hidden");

  // Montar options dos pontos
  let options = "";
  for (let i = 0; i < plataforma.pontos.length; i++) {
    options += `<option value="${i}">${plataforma.pontos[i].nome} - ${plataforma.pontos[i].endereco}</option>`;
  }

  form.innerHTML = `
    <h2>Agendar Coleta</h2>
    <input type="text" id="cnpjColeta" placeholder="CNPJ do estabelecimento" />
    <input type="date" id="dataColeta" />
    <input type="number" id="quantidadeColeta" placeholder="Quantidade em litros" min="1" />
    <select id="pontoColeta">${options}</select>
    <button onclick="agendarColeta()">Agendar</button>
    <button onclick="mostrarMenuPrincipal()">Voltar</button>
  `;
}

function agendarColeta() {
  const cnpj = document.getElementById("cnpjColeta").value.trim();
  const data = document.getElementById("dataColeta").value;
  const quantidade = parseInt(document.getElementById("quantidadeColeta").value);
  const pontoIndex = parseInt(document.getElementById("pontoColeta").value);

  if (plataforma.agendarColeta(cnpj, data, quantidade, pontoIndex)) {
    mostrarMenuPrincipal();
  }
}

function mostrarPontos() {
  alert(plataforma.listarPontos());
}

function mostrarHistorico() {
  alert(plataforma.exibirHistorico());
}

// Inicializa mostrando o menu
mostrarMenuPrincipal();
