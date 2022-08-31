const copiarConteudo = function() {
    let previsto = $("#previsto").val();
    $("#realizado").val(previsto);
}

const habilitarTarefa = function() {
    let checked = $("#possuiTarefa").is(':checked'); //document.getElementById('possuiTarefa').checked;
    if (checked) {
        $("#camposTarefa").css("display", "");
        //document.getElementById('camposTarefa').style.display = "";
    } else {
        $("#camposTarefa").css("display", "none");
        //document.getElementById('camposTarefa').style.display = "none";
    }
}


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
