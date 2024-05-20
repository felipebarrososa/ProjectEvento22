document.addEventListener("DOMContentLoaded", function() {
    const lerQRCodeButton = document.getElementById("lerQRCodeButton");
    const adicionarManualButton = document.getElementById("adicionarManualButton");
    const modal = document.getElementById("manualEntryModal");
    const closeButton = document.querySelector(".close-button");
    const manualForm = document.getElementById("manualForm");
    const resultadoDiv = document.getElementById("resultado");
    const qrCodeScanner = new Html5Qrcode("qr-reader");
    let isReading = false;

    function iniciarLeituraQRCode() {
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                const cameraId = devices[0].id;
                qrCodeScanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: 250
                    },
                    qrCodeMessage => {
                        if (isReading) {
                            isReading = false;
                            qrCodeScanner.stop().then(() => {
                                resultadoDiv.innerText = "QR Code lido: " + qrCodeMessage;
                                enviarDadosParaServidor(qrCodeMessage);
                                const data = JSON.parse(qrCodeMessage);
                                alert(`Check-in do usuário realizado com sucesso!\n\nNome: ${data.nome}\nEmail: ${data.email}\nWhatsApp: ${data.whatsapp}\nCidade: ${data.cidade}\nEstado: ${data.estado}`);
                            }).catch(err => {
                                console.error(`Erro ao pausar a leitura do QR Code: ${err}`);
                            });
                        }
                    },
                    errorMessage => {
                        console.warn(`Erro ao ler o QR Code: ${errorMessage}`);
                    }
                ).catch(err => {
                    console.error(`Erro ao iniciar a câmera: ${err}`);
                    alert("Para usar esta funcionalidade, conceda permissão para acessar a câmera.");
                });
            }
        }).catch(err => {
            console.error(`Erro ao obter as câmeras: ${err}`);
        });
    }

    function enviarDadosParaServidor(content) {
        const checkinData = {
            checkin: content
        };

        fetch('/salvarCheckin', {  // Certifique-se de usar a URL correta
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkinData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Sucesso:', data);
            alert('Check-in salvo com sucesso!');
        })
        .catch((error) => {
            console.error('Erro:', error);
            alert('Erro ao salvar o check-in.');
        });
    }

    function enviarDadosManuais(data) {
        const checkinData = {
            checkin: JSON.stringify(data) // Serializa os dados do formulário para o campo checkin
        };

        fetch('http://localhost:3000/salvarCheckin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkinData)
        })
        .then(response => response.json()) // Espera uma resposta JSON
        .then(data => {
            console.log('Sucesso:', data);
            alert(`Cadastro manual salvo com sucesso!\n\nNome: ${data.nome}\nEmail: ${data.email}\nWhatsApp: ${data.whatsapp}\nCidade: ${data.cidade}\nEstado: ${data.estado}`);
            limparCamposFormulario(); // Limpar os campos do formulário após o envio
        })
        .catch((error) => {
            console.error('Erro:', error);
            alert('Erro ao salvar o cadastro manual.');
        });
    }

    function limparCamposFormulario() {
        document.getElementById("nomeManual").value = '';
        document.getElementById("emailManual").value = '';
        document.getElementById("whatsappManual").value = '';
        document.getElementById("cidadeManual").value = '';
        document.getElementById("estadoManual").value = '';
    }

    lerQRCodeButton.addEventListener("click", () => {
        if (!isReading) {
            isReading = true;
            iniciarLeituraQRCode();
        }
    });

    adicionarManualButton.addEventListener("click", () => {
        modal.style.display = "block";
        limparCamposFormulario(); // Limpar os campos do formulário ao abrir o modal
    });

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    manualForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const nome = document.getElementById("nomeManual").value;
        const email = document.getElementById("emailManual").value;
        const whatsapp = document.getElementById("whatsappManual").value;
        const cidade = document.getElementById("cidadeManual").value;
        const estado = document.getElementById("estadoManual").value.toUpperCase();

        const data = {
            nome: nome,
            email: email,
            whatsapp: whatsapp,
            cidade: cidade,
            estado: estado
        };

        enviarDadosManuais(data);
        modal.style.display = "none";
    });

    // Formatação do número de telefone (WhatsApp) enquanto o usuário digita
    document.getElementById("whatsappManual").addEventListener("input", function() {
        var campo = document.getElementById("whatsappManual");
        var valor = campo.value;

        valor = valor.replace(/\D/g, "");
        valor = valor.replace(/(\d{2})(\d{1,5})(\d{0,4})/, "($1) $2-$3");

        campo.value = valor;
    });
});
