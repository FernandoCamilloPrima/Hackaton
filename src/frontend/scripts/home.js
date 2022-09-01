const alterarUnidade = function () {
    let unidade = $('#unidade').val();
    $('#periodo').val('');

    if(unidade) {
        $('#periodo').css("display", "");
    } else { 
        $('#periodo').css("display", "none");
    }
    alterarPeriodo();
}

const alterarPeriodo = function () {
    let periodo = $('#periodo').val();
    $('#turma').val('');

    if(periodo) {
        $('#turma').css("display", "");
    } else { 
        $('#turma').css("display", "none");
    }
    alterarTurma();
}

const alterarTurma = function () {
    let turma = $('#turma').val();
    $('#disciplina').val('');
    if(turma) {
        $('#disciplina').css("display", "");
    } else { 
        $('#disciplina').css("display", "none");
    }
}

const ativarAba = function (aba) {
    if(aba == 1 && !$('#abaAulas').hasClass('active')) {
        $('#abaAulas').addClass('active');
        $('#abaTarefas').removeClass('active');
        $('#listaAulas').show();
        $('#listaTarefas').hide();
    } else if(aba == 2 && !$('#abaTarefas').hasClass('active')) {
        $('#abaTarefas').addClass('active');
        $('#abaAulas').removeClass('active');
        $('#listaTarefas').show();
        $('#listaAulas').hide();
    }
}