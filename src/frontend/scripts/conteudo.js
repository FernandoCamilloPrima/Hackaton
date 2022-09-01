String.prototype.toHtmlEntities = function() {
    return this.replace(/./gm, function(s) {
        // return "&#" + s.charCodeAt(0) + ";";
        return (s.match(/[a-z0-9\s]+/i)) ? s : "&#" + s.charCodeAt(0) + ";";
    });
};


let dados = {};


const copiarConteudo = function() {
    let previsto = $("#previsto").val();
    $("#realizado").val(previsto);
}


const habilitarTarefa = function() {
    let checked = $("#possuiTarefa").is(':checked');
    if (checked) {
        $("#camposTarefa").css("display", "");
    } else {
        $("#camposTarefa").css("display", "none");
    }
}


const excluirAnexo = function(codigoAnexo) {
    if (dados.anexos) {
        for (i = 0; i < dados.anexos.length; i++) {
            if (dados.anexos[i].codigo == codigoAnexo) {
                dados.anexos.splice(i, 1);
                break;
            }
        }
        carregarListaDeAnexos();
    }
}


const baixarAnexo = function(codigoAnexo) {
    if (dados.anexos) {
        for (i = 0; i < dados.anexos.length; i++) {
            if (dados.anexos[i].codigo == codigoAnexo) {
                window.alert("Download de " + dados.anexos[i].nome + "...");
                break;
            }
        }
    }
}


const uploadAnexo = function() {
    $("#inputFileAnexo").click();
}


const handleFiles = function(files) {
    $.each(files, function(i, file) {
        dados.anexos.push(
            {
                codigo: ((new Date().getTime()) + Math.random()) * -1,
                nome: file.name
            }
        )
    });
    carregarListaDeAnexos();
}


const carregarTela = function() {
    $("#dadosGerais").html(`
        <h2>${dados.periodo.toHtmlEntities()} - ${dados.disciplina.toHtmlEntities()} - ${dados.turma.toHtmlEntities()}</h2>
        <h3>Aula ${dados.aula} - ${dados.dia}</h3>
    `);

    $("#previsto").val(dados.conteudoPrevisto);
    $("#realizado").val(dados.conteudoRealizado);
    $("#possuiTarefa").prop("checked", dados.possuiTarefa);
    
    habilitarTarefa();

    if (dados.possuiTarefa) {
        $("#realizado").val(dados.conteudoTarefa);
        if (dados.dataEntregaTarefa) {
            $("#dataTarefa").val(dados.dataEntregaTarefa.substring(6) + "-" + dados.dataEntregaTarefa.substring(3,5) + "-" + dados.dataEntregaTarefa.substring(0,2));
        }
        carregarListaDeAnexos();
    }
}


const carregarListaDeAnexos = function() {
    $('#anexosTarefa').html("");
    $.each(dados.anexos, function(i, anexo) {
        $('#anexosTarefa').append(`
            <li data-codigo="${anexo.codigo}" class="list-group-item d-flex justify-content-between align-items-center">
                <a href="javascript:void(0)" onclick="baixarAnexo(${anexo.codigo})">${anexo.nome.toHtmlEntities()}</a>
                <a href="javascript:void(0)" onclick="excluirAnexo(${anexo.codigo})"><span class="text-dark fa fa-trash-can"></span></a>
            </li>
        `);
    });
}


const carregarDados = function() {
    //TODO: Obter dados do servidor
    var jqxhr = $.getJSON("dadosFake/conteudo.json?x=" + new Date().getTime(), function (data) {
        dados = data;
        carregarTela();
        $("#formulario").show();
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


// === Parte do reconhecimento de voz:
//Copiado de: https://www.google.com/intl/en/chrome/demos/speech.html

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

if (!('webkitSpeechRecognition' in window)) {
    document.getElementById("ditarRealizado").style.display = "none";
} else {
    document.getElementById("ditarRealizado").style.display = "block";
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        recognizing = true;
        document.getElementById("ditarRealizado").innerHTML = "<span class=\"fa fa-microphone-slash\"></span> Parar";
    };

    recognition.onerror = function (event) {
        if (event.error == 'no-speech') {
            document.getElementById("ditarRealizado").innerHTML = "Erro";
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            document.getElementById("ditarRealizado").innerHTML = "Sem microfone";
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
                document.getElementById("ditarRealizado").innerHTML = "Não permitido (bloqueado)";
            } else {
                document.getElementById("ditarRealizado").innerHTML = "Não permitido (negado)";
            }
            ignore_onend = true;
        }
    };

    recognition.onend = function () {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        document.getElementById("ditarRealizado").innerHTML = "<span class=\"fa fa-microphone\"></span> Ditar";
        if (!final_transcript) {
            return;
        }
    };

    recognition.onresult = function (event) {
        var interim_transcript = '';
        if (typeof (event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
            document.getElementById("ditarRealizado").innerHTML = "Erro";
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_transcript = capitalize(final_transcript);

        if (interim_transcript) {
            document.getElementById("realizado").value = interim_transcript;
        }
        if (final_transcript) {
            document.getElementById("realizado").value = final_transcript;
        }

        //document.getElementById("realizado").value = final_transcript;
        //if (final_transcript) console.log("Final transcript: " + final_transcript);
        //if (interim_transcript) console.log("Interim transcript: " + final_transcript);

        //final_span.innerHTML = linebreak(final_transcript);
        //interim_span.innerHTML = linebreak(interim_transcript);
        //if (final_transcript || interim_transcript) {
        //    showButtons('inline-block');
        //}
    };
}

//var two_line = /\n\n/g;
//var one_line = /\n/g;
//function linebreak(s) {
//    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
//}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function (m) { return m.toUpperCase(); });
}


function ditarConteudoRealizado(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = 'pt-BR';
    recognition.start();
    ignore_onend = false;
    //final_span.innerHTML = '';
    //interim_span.innerHTML = '';
    //start_img.src = '/intl/en/chrome/assets/common/images/content/mic-slash.gif';
    //showInfo('info_allow');
    //showButtons('none');
    //document.getElementById("realizado").value = "";
    start_timestamp = event.timeStamp;
}
