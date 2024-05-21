document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("cadastroForm");
    var loadingDiv = document.getElementById("loading");
    var successMessageDiv = document.getElementById("mensagem");
    var inputFields = document.querySelectorAll(".input-group");
    var submitBtn = document.getElementById("submitBtn");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        inputFields.forEach(function(field) {
            field.style.display = "none";
        });
        submitBtn.style.display = "none";
        loadingDiv.style.display = "block";
        setTimeout(function() {
            var nome = document.getElementById("nome").value;
            var email = document.getElementById("email").value;
            var whatsapp = document.getElementById("whatsapp").value;
            var cidade = document.getElementById("cidade").value;
            var estado = document.getElementById("estado").value.toUpperCase();

            var data = {
                nome: nome,
                email: email,
                whatsapp: whatsapp,
                cidade: cidade,
                estado: estado
            };

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/cadastro", true); // Atualize a URL para ser relativa
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        loadingDiv.style.display = "none";
                        showSuccessMessage(data);
                    } else {
                        console.error('Erro ao enviar os dados:', xhr.responseText);
                        loadingDiv.style.display = "none";
                    }
                }
            };
            xhr.send(JSON.stringify(data));
        }, 2000); // Tempo de espera em milissegundos
    });

    // Formatação do número de telefone (WhatsApp) enquanto o usuário digita
    document.getElementById("whatsapp").addEventListener("input", function() {
        var campo = document.getElementById("whatsapp");
        var valor = campo.value;

        valor = valor.replace(/\D/g, "");
        valor = valor.replace(/(\d{2})(\d{1,5})(\d{0,4})/, "($1) $2-$3");

        campo.value = valor;
    });

    function showSuccessMessage(data) {
        var qrcodeDiv = document.getElementById("qrcode");
        var qr = new QRCode(qrcodeDiv, {
            text: JSON.stringify(data),
            width: 200,
            height: 200
        });
        successMessageDiv.style.display = "block";
    }
});
