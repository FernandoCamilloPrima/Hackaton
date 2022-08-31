let valor1 = "E";
const alternar1 = function() {
    if (valor1 == "E") {
        valor1 = "N";
        let atual = $("#entrega1").html();
        let novo = atual.replace("Entregou", "Não entregou").replace("fa-check", "fa-x");
        $("#entrega1").html(novo);
        $("#entrega1").removeClass("btn-success");
        $("#entrega1").addClass("btn-danger");
    } else if (valor1 == "N") {
        valor1 = "I";
        let atual = $("#entrega1").html();
        let novo = atual.replace("Não entregou", "Incompleta").replace("fa-x", "fa-triangle-exclamation");
        $("#entrega1").html(novo);
        $("#entrega1").removeClass("btn-danger");
        $("#entrega1").addClass("btn-warning");
    } else {
        valor1 = "E";
        let atual = $("#entrega1").html();
        let novo = atual.replace("Incompleta", "Entregou").replace("fa-triangle-exclamation", "fa-check");
        $("#entrega1").html(novo);
        $("#entrega1").removeClass("btn-warning");
        $("#entrega1").addClass("btn-success");
    }
}