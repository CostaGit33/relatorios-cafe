document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('relatorio-form');
  const empresaSelect = document.getElementById('empresa');
  const fornecedorSelect = document.getElementById('fornecedor');
  const produtoSelect = document.getElementById('produto');
  const tipoEstoqueSelect = document.getElementById('tipoEstoque');
  const tabelasContainer = document.getElementById('tabelas-container');
  const exportarPdfBtn = document.getElementById('exportar-pdf');

  const fornecedoresPadrao = ['Paquetá', 'Jequié', 'Dona Lita', 'Paquera', 'Maira Rosa'];

  const fornecedoresPorEmpresa = {
    'Atacadao': fornecedoresPadrao,
    'BH': fornecedoresPadrao,
    'Mix Matheus': fornecedoresPadrao,
    'Mercadinho da Esquina': fornecedoresPadrao,
    'Mercadinho Limeira': fornecedoresPadrao,
    'Supermercado Econômico': fornecedoresPadrao,
    'Supermercado Nacional': fornecedoresPadrao,
    'Supermercado Niban': fornecedoresPadrao,
    'Supermercado Cardoso': fornecedoresPadrao,
    'Supermercado Junior 1': fornecedoresPadrao,
    'Supermercado Junior 2': fornecedoresPadrao,
    'Supermercado Santana': fornecedoresPadrao,
    'Compraki Conveniência': fornecedoresPadrao,
    'Supermercado cambui': fornecedoresPadrao,
    'Supermercado Mini Preço': fornecedoresPadrao,
    'Supermercado Guimarães': fornecedoresPadrao,
    'Supermercado Noronha': fornecedoresPadrao,
    'Marck Sul': fornecedoresPadrao,
    'Marck Sul Xpress': fornecedoresPadrao,
    'Cestão do povo': fornecedoresPadrao,
    'Supermercado Colares': fornecedoresPadrao,
  };

  const produtosPorFornecedor = {
    Paquetá: [
      'Tradicional a Vácuo',
      'Tradicional Almofada',
      'E. Forte Vácuo',
      'E. Forte Almofada'
    ],
    Jequié: [
      'E. Forte Vácuo',
      'Tradicional Vácuo',
      'E. Forte Almofada',
      'Tradicional Almofada',
      'Premium Vácuo'
    ],
    'Maira Rosa': [
      'E. Forte Vácuo',
      'Tradicional Vácuo',
      'E. Forte Almofada',
      'Tradicional Almofada'
    ],
    Paquera: [
      'E. Forte Vácuo',
      'Tradicional Vácuo',
      'E. Forte Almofada',
      'Tradicional Almofada'
    ],
    'Dona Lita': [
      'E. Forte Vácuo',
      'Tradicional Vácuo',
      'E. Forte Almofada',
      'Tradicional Almofada'
    ]
  };

  const imagensPorFornecedor = {
    Paquetá: {
      src: 'img/paqueta.jpeg',
      alt: 'Café Paquetá'
    },
    Jequié: {
      src: 'img/jequie.jpeg',
      alt: 'Café Jequié'
    },
    'Dona Lita': {
      src: 'img/donalita.jpeg',
      alt: 'Café Dona Lita'
    },
    Paquera: {
      src: 'img/paquera.jpeg',
      alt: 'Café Paquera'
    },
    'Maira Rosa': {
      src: 'img/mariarosa.jpeg',
      alt: 'Café Maira Rosa'
    }
  };

  const imagensPorEmpresa = {
    BH: {
      src: 'img/bh-logo.webp',
      alt: 'BH'
    },
    Atacadao: {
      src: 'img/atacadao.png',
      alt: 'Atacadao'
    },
    'Mix Matheus': {
      src: 'img/mix.png',
      alt: 'Mix Matheus'
    }
  };

  const storageKey = 'relatoriosEmpresas';

  const carregarStorage = () => JSON.parse(localStorage.getItem(storageKey)) || {};
  const salvarStorage = dados => localStorage.setItem(storageKey, JSON.stringify(dados));

  function normalizarDataParaInput(dataStr) {
    if (!dataStr) return '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
      return dataStr;
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataStr)) {
      const [dia, mes, ano] = dataStr.split('/');
      return `${ano}-${mes}-${dia}`;
    }

    return '';
  }

  function parseValidade(dataStr) {
    const dataISO = normalizarDataParaInput(dataStr);
    return dataISO ? new Date(`${dataISO}T00:00:00`) : new Date(0);
  }

  function formatarData(dataStr) {
    const dataISO = normalizarDataParaInput(dataStr);
    if (!dataISO) return '';

    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function formatarPreco(valor) {
    if (!valor) return '';
    const numero = parseFloat(String(valor).replace(',', '.'));
    return isNaN(numero) ? '' : numero.toFixed(2).replace('.', ',');
  }

  function atualizarFornecedores() {
    const empresa = empresaSelect.value;
    fornecedorSelect.innerHTML = '<option value="" disabled selected>Escolha o fornecedor</option>';

    if (fornecedoresPorEmpresa[empresa]) {
      fornecedoresPorEmpresa[empresa].forEach(fornecedor => {
        const opt = document.createElement('option');
        opt.value = fornecedor;
        opt.textContent = fornecedor;
        fornecedorSelect.appendChild(opt);
      });
    }

    produtoSelect.innerHTML = '<option value="" disabled selected>Escolha o produto</option>';
  }

  function atualizarProdutos() {
    const fornecedor = fornecedorSelect.value;
    produtoSelect.innerHTML = '<option value="" disabled selected>Escolha o produto</option>';

    if (produtosPorFornecedor[fornecedor]) {
      produtosPorFornecedor[fornecedor].forEach(produto => {
        const opt = document.createElement('option');
        opt.value = produto;
        opt.textContent = produto;
        produtoSelect.appendChild(opt);
      });
    }
  }

  function validarFormulario() {
    const empresa = empresaSelect.value;
    const fornecedor = fornecedorSelect.value;
    const produto = produtoSelect.value;
    const estoque = document.getElementById('estoque').value;
    const validade = document.getElementById('validade').value;
    const preco = document.getElementById('preco').value;

    if (!empresa || !fornecedor || !produto || !estoque || !validade || !preco) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if (parseFloat(estoque) < 0) {
      alert('O estoque não pode ser negativo.');
      return false;
    }

    const precoRegex = /^\d+(,\d{1,2})?$/;
    if (!precoRegex.test(preco)) {
      alert('Por favor, insira um preço válido (ex: 2,99).');
      return false;
    }

    return true;
  }

  function criarMensagemVazia(texto) {
    const mensagem = document.createElement('p');
    mensagem.className = 'empty-message';
    mensagem.textContent = texto;
    tabelasContainer.appendChild(mensagem);
  }

  function renderizarTabelas() {
    tabelasContainer.innerHTML = '';

    const empresaSelecionada = empresaSelect.value;
    if (!empresaSelecionada) {
      criarMensagemVazia('Selecione um atacado para visualizar os relatórios.');
      return;
    }

    const dados = carregarStorage();
    const dadosEmpresa = dados[empresaSelecionada];

    if (!dadosEmpresa || Object.keys(dadosEmpresa).length === 0) {
      criarMensagemVazia(`Nenhum relatório cadastrado para ${empresaSelecionada}.`);
      return;
    }

    let renderizouTabela = false;

    for (const fornecedor in dadosEmpresa) {
      const lista = dadosEmpresa[fornecedor];
      if (!lista || lista.length === 0) continue;

      lista.sort((a, b) => parseValidade(a.validade) - parseValidade(b.validade));

      const wrapper = document.createElement('div');
      wrapper.classList.add('empresa-tabela', 'active');

      const logosDiv = document.createElement('div');
      logosDiv.className = 'top-logos';
      const imagemEmpresa = imagensPorEmpresa[empresaSelecionada];
      const imagemFornecedor = imagensPorFornecedor[fornecedor];
      logosDiv.innerHTML = `
        ${imagemEmpresa ? `<img src="${imagemEmpresa.src}" alt="${imagemEmpresa.alt}" onerror="this.style.display='none'" />` : ''}
        ${imagemFornecedor ? `<img src="${imagemFornecedor.src}" alt="${imagemFornecedor.alt}" onerror="this.style.display='none'" />` : ''}
      `;
      wrapper.appendChild(logosDiv);

      const titulo = document.createElement('h2');
      titulo.className = 'empresa-titulo';
      titulo.textContent = `${empresaSelecionada} - ${fornecedor}`;
      wrapper.appendChild(titulo);

      const tabela = document.createElement('table');
      tabela.innerHTML = `
        <thead>
          <tr>
            <th>Produto</th>
            <th>Estq</th>
            <th>Val</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
      `;

      const tbody = document.createElement('tbody');

      lista.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td title="${item.produto}">${item.produto}</td>
          <td>${item.estoque} ${item.tipoEstoque}</td>
          <td>${formatarData(item.validade)}</td>
          <td>${formatarPreco(item.preco)}</td>
          <td>
            <button class="editar" data-index="${index}" data-empresa="${empresaSelecionada}" data-fornecedor="${fornecedor}" title="Editar">&#9998;</button>
            <button class="excluir" data-index="${index}" data-empresa="${empresaSelecionada}" data-fornecedor="${fornecedor}" title="Excluir">&#128465;</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      tabela.appendChild(tbody);
      wrapper.appendChild(tabela);
      tabelasContainer.appendChild(wrapper);
      renderizouTabela = true;
    }

    if (!renderizouTabela) {
      criarMensagemVazia(`Nenhum relatório cadastrado para ${empresaSelecionada}.`);
    }

    document.querySelectorAll('.excluir').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;

        const index = parseInt(e.currentTarget.dataset.index, 10);
        const empresa = e.currentTarget.dataset.empresa;
        const fornecedor = e.currentTarget.dataset.fornecedor;

        const dados = carregarStorage();
        dados[empresa][fornecedor].splice(index, 1);

        if (dados[empresa][fornecedor].length === 0) {
          delete dados[empresa][fornecedor];
        }

        if (Object.keys(dados[empresa]).length === 0) {
          delete dados[empresa];
        }

        salvarStorage(dados);
        renderizarTabelas();
      });
    });

    document.querySelectorAll('.editar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.dataset.index, 10);
        const empresa = e.currentTarget.dataset.empresa;
        const fornecedor = e.currentTarget.dataset.fornecedor;
        const dados = carregarStorage();
        const item = dados[empresa][fornecedor][index];

        empresaSelect.value = empresa;
        atualizarFornecedores();
        fornecedorSelect.value = fornecedor;
        atualizarProdutos();
        produtoSelect.value = item.produto;
        document.getElementById('estoque').value = item.estoque;
        tipoEstoqueSelect.value = item.tipoEstoque;
        document.getElementById('validade').value = normalizarDataParaInput(item.validade);
        document.getElementById('preco').value = item.preco;

        dados[empresa][fornecedor].splice(index, 1);
        salvarStorage(dados);
        renderizarTabelas();

        form.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const empresa = empresaSelect.value;
    const fornecedor = fornecedorSelect.value;
    const produto = produtoSelect.value;
    const estoque = document.getElementById('estoque').value;
    const tipoEstoque = tipoEstoqueSelect.value;
    const validade = document.getElementById('validade').value;
    const preco = document.getElementById('preco').value;

    const dados = carregarStorage();
    if (!dados[empresa]) dados[empresa] = {};
    if (!dados[empresa][fornecedor]) dados[empresa][fornecedor] = [];

    dados[empresa][fornecedor].push({
      produto,
      estoque: parseInt(estoque, 10),
      tipoEstoque,
      validade,
      preco
    });

    salvarStorage(dados);
    form.reset();
    empresaSelect.value = empresa;
    atualizarFornecedores();
    renderizarTabelas();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Adicionado!';
    submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
    }, 1500);
  });

  empresaSelect.addEventListener('change', () => {
    atualizarFornecedores();
    renderizarTabelas();
  });

  fornecedorSelect.addEventListener('change', atualizarProdutos);

  exportarPdfBtn.addEventListener('click', () => {
    if (!empresaSelect.value) {
      alert('Selecione um atacado antes de exportar.');
      return;
    }

    if (!tabelasContainer.querySelector('.empresa-tabela')) {
      alert('Não há relatório para exportar neste atacado.');
      return;
    }

    window.print();
  });

  atualizarFornecedores();
  renderizarTabelas();
});
