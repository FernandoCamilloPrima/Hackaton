let dados = {
    alunos: [
        {
            codigo: 1,
            nome: "Abel Pereira Goulart",
            situacao: "E"
        },
        {
            codigo: 2,
            nome: "Caio de Oliveira Ramos",
            situacao: "E"
        },
        {
            codigo: 3,
            nome: "Maria Aparecida dos Santos",
            situacao: "E"
        }
    ]
}

const alternar = function(elemento) {
    let situacaoAtual = $(elemento).data("situacao");
    let novaSituacao = "";
    if (situacaoAtual == "E") {
        novaSituacao = "N";
    } else if (situacaoAtual == "N") {
        novaSituacao = "I";
    } else {
        novaSituacao = "E";
    }
    $(elemento).data("situacao", novaSituacao);
    aplicarHtml(elemento, novaSituacao);
}

const aplicarHtml = function(elemento, novaSituacao) {
    let htmlAtual = $(elemento).html();
    let htmlNovo = "";
    if (novaSituacao == "N") {
        htmlNovo = htmlAtual.replace("Entregou", "Não entregou").replace("fa-check", "fa-x");
        $(elemento).removeClass("btn-success");
        $(elemento).addClass("btn-danger");
    } else if (novaSituacao == "I") {
        htmlNovo = htmlAtual.replace("Não entregou", "Incompleta").replace("fa-x", "fa-triangle-exclamation");
        $(elemento).removeClass("btn-danger");
        $(elemento).addClass("btn-warning");
    } else {
        htmlNovo = htmlAtual.replace("Incompleta", "Entregou").replace("fa-triangle-exclamation", "fa-check");
        $(elemento).removeClass("btn-warning");
        $(elemento).addClass("btn-success");
    }
    $(elemento).html(htmlNovo);
}
