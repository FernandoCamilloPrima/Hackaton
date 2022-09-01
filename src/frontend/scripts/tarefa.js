String.prototype.toHtmlEntities = function() {
    return this.replace(/./gm, function(s) {
        // return "&#" + s.charCodeAt(0) + ";";
        return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
    });
};


const Situacoes = {
    Entregue: "E",
    NaoEntregue: "N",
    Incompleta: "I"
};


let dados = {};


const alternar = function(elemento) {
    let codigoAluno = $(elemento).data("codigo");
    let situacaoAtual = $(elemento).data("situacao");
    let novaSituacao = "";
    if (situacaoAtual == Situacoes.Entregue) {
        novaSituacao = Situacoes.NaoEntregue;
    } else if (situacaoAtual == Situacoes.NaoEntregue) {
        novaSituacao = Situacoes.Incompleta;
    } else {
        novaSituacao = Situacoes.Entregue;
    }
    $(elemento).data("situacao", novaSituacao);
    atualizarSituacao(codigoAluno, novaSituacao);
    aplicarHtml(elemento, situacaoAtual, novaSituacao);
}


const atualizarSituacao = function(codigoAluno, novaSituacao) {
    $.each(dados.alunos, function(i, aluno) {
        if (aluno.codigo == codigoAluno) {
            aluno.situacao = novaSituacao;
            return;
        }
    });
}


const aplicarHtml = function(elemento, situacaoAtual, novaSituacao) {
    let htmlAtual = $(elemento).html();
    let htmlNovo = "";

    htmlNovo = htmlAtual
        .replace(obterDescricaoSituacao(situacaoAtual), obterDescricaoSituacao(novaSituacao))
        .replace(obterIconeSituacao(situacaoAtual), obterIconeSituacao(novaSituacao));
    
    $(elemento).removeClass("btn-" + obterClasseSituacao(situacaoAtual));
    $(elemento).addClass("btn-" + obterClasseSituacao(novaSituacao));

    $(elemento).html(htmlNovo);
}


const obterDescricaoSituacao = function(situacao) {
    if (situacao == Situacoes.NaoEntregue) {
        return "Não entregou";
    } else if (situacao == Situacoes.Incompleta) {
        return "Incompleta";
    } else {
        return "Entregou";
    }
}


const obterClasseSituacao = function(situacao) {
    if (situacao == Situacoes.NaoEntregue) {
        return "danger";
    } else if (situacao == Situacoes.Incompleta) {
        return "warning";
    } else {
        return "success";
    }
}


const obterIconeSituacao = function(situacao) {
    if (situacao == Situacoes.NaoEntregue) {
        return "fa fa-x";
    } else if (situacao == Situacoes.Incompleta) {
        return "fa fa-triangle-exclamation";
    } else {
        return "fa fa-check";
    }
}


const carregarTela = function() {
    $("#dadosGerais").html(`
        <h2>${dados.periodo.toHtmlEntities()} - ${dados.disciplina.toHtmlEntities()} - ${dados.turma.toHtmlEntities()}</h2>
        <h3>Aula ${dados.aula} - ${dados.dia}</h3>
        <p><strong>Tarefa:</strong> ${dados.tarefaConteudo.toHtmlEntities()}</p>
        <p><strong>Data para entrega:</strong> ${dados.tarefaDataEntrega}</p>
    `);

    $.each(dados.alunos, function(i, aluno) {
        $('#listaAlunos').append(`
            <div class="card mb-3" style="background-color: #eeeeee">
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-8">
                            ${aluno.nome.toHtmlEntities()}
                        </div>
                        <div class="col-sm-4 text-end">
                            <a data-codigo=${aluno.codigo} data-situacao="${aluno.situacao}" href="javascript:void(0)" onclick="alternar(this)" role="button" class="btn btn-sm btn-${obterClasseSituacao(aluno.situacao)} w-100 mt-1">
                                <span class="${obterIconeSituacao(aluno.situacao)}" style="margin-right: 5px;"></span> ${obterDescricaoSituacao(aluno.situacao)} <span class="fa fa-caret-down" style="margin-left: 5px;"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}


const carregarDados = function() {
    //TODO: Obter dados do servidor
    var jqxhr = $.getJSON("dadosFake/tarefas.json?x=" + new Date().getTime(), function (data) {
        dados = data;
        carregarTela();
        $("#botoesOperacoes").show();
    });
}


const botaoSalvar = function() {
    //TODO: Salvar no servidor
    window.alert("Faz de conta que salvou...");
    botaoVoltar();
}


const botaoVoltar = function() {
    window.location="home.html";
}


$(function() {
    carregarDados();
});
