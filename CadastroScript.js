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

            fetch('https://sa-east-1.aws.data.mongodb-api.com/app/data-oomgips/endpoint/data/v1/action/insertOne', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': 'SrWyoUgVrJtOD6MFft5M7QPh1NmquKxFbm8KkhrP9PTl3MOo4vhQOmWE48j75eYP'
                },
                body: JSON.stringify({
                    collection: 'cadastros', // Substitua com o nome da sua coleção
                    database: 'test', // Substitua com o nome do seu banco de dados
                    dataSource: 'Cluster0', // Substitua com o nome do seu cluster
                    document: data
                })
            })
            .then(response => response.json())
            .then(result => {
                loadingDiv.style.display = "none";
                if (result.insertedId) {
                    showSuccessMessage(data);
                } else {
                    console.error('Erro ao enviar os dados:', result);
                }
            })
            .catch(error => {
                console.error('Erro ao enviar os dados:', error);
                loadingDiv.style.display = "none";
            });
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

    var whatsappGroupButton = document.getElementById("whatsappGroupButton");
    whatsappGroupButton.addEventListener("click", function() {
        window.location.href = "https://chat.whatsapp.com/EXEMPLO_DO_LINK_DO_GRUPO"; // Substitua pelo link do seu grupo
    });
});
