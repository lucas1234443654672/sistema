document.addEventListener('DOMContentLoaded', function () {
    const produtoForm = document.getElementById('produtoForm');
    const estoqueTable = document.getElementById('estoqueTable').getElementsByTagName('tbody')[0];
    const historicoTable = document.getElementById('historicoTable').getElementsByTagName('tbody')[0];

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let historico = JSON.parse(localStorage.getItem('historico')) || [];

    function atualizarTabelaEstoque() {
        estoqueTable.innerHTML = '';
        produtos.forEach(produto => {
            let row = estoqueTable.insertRow();
            row.innerHTML = `
                <td>${produto.codigo}</td>
                <td>${produto.descricao}</td>
                <td>${produto.localizacao}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.usuario}</td>
                <td>${produto.adicionadoEm}</td>
                <td><button class="editarBtn" data-codigo="${produto.codigo}">Editar</button></td>
            `;
        });

        document.querySelectorAll('.editarBtn').forEach(button => {
            button.addEventListener('click', function () {
                const codigo = this.dataset.codigo;
                const produto = produtos.find(p => p.codigo === codigo);
                if (produto) {
                    document.getElementById('editarCodigo').value = produto.codigo;
                    document.getElementById('editarDescricao').value = produto.descricao;
                    document.getElementById('editarLocalizacao').value = produto.localizacao;
                    document.getElementById('editarQuantidade').value = produto.quantidade;
                    document.getElementById('editarUsuario').value = produto.usuario;
                    document.getElementById('editarProdutoForm').style.display = 'block';
                }
            });
        });
    }

    function atualizarTabelaHistorico() {
        historicoTable.innerHTML = '';
        historico.forEach(item => {
            let row = historicoTable.insertRow();
            row.innerHTML = `
                <td>${item.timestamp}</td>
                <td>${item.codigo}</td>
                <td>${item.acao}</td>
                <td>${item.descricao}</td>
                <td>${item.localizacaoAnterior}</td>
                <td>${item.localizacaoNova}</td>
                <td>${item.quantidade}</td>
                <td>${item.usuario}</td>
            `;
        });
    }

    produtoForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const codigo = document.getElementById('codigo').value;
        const descricao = document.getElementById('descricao').value;
        const localizacao = document.getElementById('localizacao').value;
        const quantidade = parseInt(document.getElementById('quantidade').value);
        const usuario = document.getElementById('usuario').value;
        const timestamp = new Date().toLocaleString();

        produtos.push({ codigo, descricao, localizacao, quantidade, usuario, adicionadoEm: timestamp });
        historico.push({ timestamp, codigo, acao: 'Adição', descricao, localizacaoAnterior: '', localizacaoNova: localizacao, quantidade, usuario });

        localStorage.setItem('produtos', JSON.stringify(produtos));
        localStorage.setItem('historico', JSON.stringify(historico));

        atualizarTabelaEstoque();
        atualizarTabelaHistorico();
        produtoForm.reset();
    });

    document.getElementById('editarForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const codigo = document.getElementById('editarCodigo').value;
        const descricao = document.getElementById('editarDescricao').value;
        const localizacao = document.getElementById('editarLocalizacao').value;
        const quantidade = parseInt(document.getElementById('editarQuantidade').value);
        const usuario = document.getElementById('editarUsuario').value;

        const produtoIndex = produtos.findIndex(p => p.codigo === codigo);
        if (produtoIndex !== -1) {
            const produtoAnterior = produtos[produtoIndex];
            produtos[produtoIndex] = { codigo, descricao, localizacao, quantidade, usuario, adicionadoEm: produtoAnterior.adicionadoEm };
            historico.push({ timestamp: new Date().toLocaleString(), codigo, acao: 'Edição', descricao, localizacaoAnterior: produtoAnterior.localizacao, localizacaoNova: localizacao, quantidade, usuario });
            localStorage.setItem('produtos', JSON.stringify(produtos));
            localStorage.setItem('historico', JSON.stringify(historico));
            atualizarTabelaEstoque();
            atualizarTabelaHistorico();
            document.getElementById('editarProdutoForm').style.display = 'none';
        }
    });

    document.getElementById('cancelarEdicao').addEventListener('click', function () {
        document.getElementById('editarProdutoForm').style.display = 'none';
    });

    atualizarTabelaEstoque();
    atualizarTabelaHistorico();
});