window.onload = function () {
    // -- Chama a função para exibir as tarefas na tabela -- //
    exibirTarefas();
    let usuarioLogadoSessao = JSON.parse(localStorage.getItem("usuarioLogado"));
    let tag_usu = document.getElementById("usuarioSessaoNome");
    tag_usu.innerHTML = "Bem vindo, " + usuarioLogadoSessao.nome_usuario;

};

function adicionarTarefa(event) {
    event.preventDefault();

    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // -- Encontrar o usuário logado no array de usuários -- //
    let usuarioIndex = usuarios.findIndex(user => user.email_usuario === usuarioLogado.email_usuario);

    if (usuarioIndex !== -1) {

        // -- Adicionar a nova tarefa ao usuário logado -- //
        idTarefaAnterior = JSON.parse(localStorage.getItem("ultimaTarefa"));
        if (idTarefaAnterior === null) {
            idTarefaAnterior = 0;
        }
        let idTarefa = 0;
        let tarefaCriada = {
            idTarefa: idTarefaAnterior + 1,
            nomeTarefa: document.getElementById('nomeTarefa').value,
            dataInicio: document.getElementById('dataInicio').value,
            horaInicio: document.getElementById('horaInicio').value,
            dataTermino: document.getElementById('dataTermino').value,
            horaTermino: document.getElementById('horaTermino').value,
            descricaoTarefa: document.getElementById('descricaoTarefa').value,
            statusTarefa: ''
        };

        usuarios[usuarioIndex].tarefas.push(tarefaCriada);
        localStorage.setItem("ultimaTarefa", JSON.stringify(tarefaCriada.idTarefa));
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarios[usuarioIndex]));
        alert("Tarefa criada com sucesso.");
        window.location.href = "manageTasks.html";

    } else {
        alert("Não foi possível criar uma tarefa.");
    }
}

function exibirTarefas() {
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    let tbody = document.querySelector("#tabelaTarefas tbody");

    if (usuarioLogado) {
        tbody.innerHTML = "";
        if (usuarioLogado.tarefas.length > 0) {
            usuarioLogado.tarefas.forEach((tarefa) => {

                // -- Células -- //
                let row = tbody.insertRow();
                let cellTarefa = row.insertCell(0);
                let cellDataInicio = row.insertCell(1);
                let cellDataTermino = row.insertCell(2);
                let cellStatus = row.insertCell(3);
                let cellAlterar = row.insertCell(4);

                // -- Datas (formatação) -- //
                let dataInicioAmericana = tarefa.dataInicio;
                let dataInicioFormatada = dataInicioAmericana.split('-').reverse().join('/');
                let dataTerminoAmericana = tarefa.dataTermino;
                let dataTerminoFormatada = dataTerminoAmericana.split('-').reverse().join('/');

                // -- Status relacionado às datas -- //
                let dataPTBRTermino = dataTerminoFormatada;
                let parts = dataPTBRTermino.split('/')
                let dataAtual = new Date();
                dataPTBRTermino = new Date(parts[2], parts[1] - 1, parts[0]);

                if (tarefa.statusTarefa !== 'Realizada') {
                    if (dataAtual.getTime() > dataPTBRTermino.getTime()) {
                        tarefa.statusTarefa = 'Em atraso';
                        cellStatus.textContent = tarefa.statusTarefa || '';
                        cellStatus.style.color = 'red';
                    } else {
                        let intervalo24H = 24 * 60 * 60 * 1000;
                        if (dataPTBRTermino.getTime() - dataAtual.getTime() < intervalo24H) {
                            tarefa.statusTarefa = 'Pendente';
                            cellStatus.textContent = tarefa.statusTarefa || '';
                            cellStatus.style.color = 'Orange';
                        } else {
                            tarefa.statusTarefa = 'Em andamento';
                            cellStatus.textContent = tarefa.statusTarefa || '';
                            cellStatus.style.color = 'blue';
                        }
                    }
                } else {
                    cellStatus.textContent = tarefa.statusTarefa || '';
                    cellStatus.style.color = 'green';
                }

                cellTarefa.textContent = tarefa.nomeTarefa || '';
                cellTarefa.addEventListener('click', (e) => {
                    e.preventDefault();
                    const descricao = tarefa.descricaoTarefa || 'Descrição não encontrada';
                    const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
                    const modalBody = document.querySelector('.modal-body');
                    let modalLabel = document.getElementById("exampleModalLabel");

                    modalLabel.innerHTML = `Descrição da tarefa "${tarefa.nomeTarefa}"`;
                    modalBody.textContent = descricao;

                    modal.show();
                });
                cellDataInicio.textContent = dataInicioFormatada + " às " + tarefa.horaInicio || '';
                cellDataTermino.textContent = dataTerminoFormatada + " às " + tarefa.horaTermino || '';
                // -- Botão alterar -- //
                let btnAlterar = document.createElement('button');
                btnAlterar.textContent = 'Alterar';
                btnAlterar.classList.add('btn', 'btn-warning');
                btnAlterar.setAttribute('data-id', tarefa.idTarefa);
                btnAlterar.addEventListener('click', (e) => {
                    e.preventDefault();
                    let idTarefa = e.target.getAttribute('data-id');
                    usuSessao = JSON.parse(localStorage.getItem('usuarioLogado'));
                    let tarefaEncontrada = usuSessao.tarefas.find(tarefa => tarefa.idTarefa === parseInt(idTarefa));

                    if (tarefaEncontrada) {
                        localStorage.setItem("idAcao", idTarefa);

                        document.getElementById("nomeTarefaEdit").value = tarefaEncontrada.nomeTarefa;
                        document.getElementById("dataInicioEdit").value = tarefaEncontrada.dataInicio;
                        document.getElementById("horaInicioEdit").value = tarefaEncontrada.horaInicio;
                        document.getElementById("dataTerminoEdit").value = tarefaEncontrada.dataTermino;
                        document.getElementById("horaTerminoEdit").value = tarefaEncontrada.horaTermino;

                        document.getElementById("criacaoTarefa").style.display = 'none';
                        document.getElementById("edicaoTarefa").style.display = 'block';
                    } else {
                        alert('Não foi encontrada nenhuma tarefa correspondente ao ID informado.');
                    }
                });

                cellAlterar.appendChild(btnAlterar);
            });
        } else {
            tbody.innerHTML = "<tr><td colspan='6'>Nenhuma tarefa encontrada.</td></tr>";
        }
    } else {
        tbody.innerHTML = "<tr><td colspan='6'>Usuário não logado ou não encontrado.</td></tr>";
    }
}

function alterarTarefa(event) {
    event.preventDefault();
    let nomeTarefaEdit = document.getElementById("nomeTarefaEdit").value;
    let dataInicioEdit = document.getElementById("dataInicioEdit").value;
    let horaInicioEdit = document.getElementById("horaInicioEdit").value;
    let dataTerminoEdit = document.getElementById("dataTerminoEdit").value;
    let horaTerminoEdit = document.getElementById("horaTerminoEdit").value;
    let descricaoTarefaEdit = document.getElementById("descricaoTarefaEdit").value;
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let idAcao = JSON.parse(localStorage.getItem("idAcao"));
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    let usuarioIndex = usuarios.findIndex(user => user.email_usuario === usuarioLogado.email_usuario);

    if (usuarioIndex !== -1) {
        let tarefaIndex = usuarios[usuarioIndex].tarefas.findIndex(tarefa => tarefa.idTarefa === idAcao);

        if (tarefaIndex !== -1) {
            usuarios[usuarioIndex].tarefas[tarefaIndex].nomeTarefa = nomeTarefaEdit;
            usuarios[usuarioIndex].tarefas[tarefaIndex].dataInicio = dataInicioEdit;
            usuarios[usuarioIndex].tarefas[tarefaIndex].horaInicio = horaInicioEdit;
            usuarios[usuarioIndex].tarefas[tarefaIndex].dataTermino = dataTerminoEdit;
            usuarios[usuarioIndex].tarefas[tarefaIndex].horaTermino = horaTerminoEdit;
            usuarios[usuarioIndex].tarefas[tarefaIndex].descricaoTarefa = descricaoTarefaEdit;

            localStorage.setItem("usuarios", JSON.stringify(usuarios));
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarios[usuarioIndex]));

            alert("Tarefa atualizada com sucesso!");
            window.location.href = "manageTasks.html";
        } else {
            alert('Não foi encontrada nenhuma tarefa que corresponda ao ID informado.');
        }
    } else {
        alert('Usuário não encontrado.');
    }
}
function excluirTarefa(event) {
    event.preventDefault();
    let idAcao = JSON.parse(localStorage.getItem("idAcao"));
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    let usuarioIndex = usuarios.findIndex(user => user.email_usuario === usuarioLogado.email_usuario);
    let tarefaIndex = usuarios[usuarioIndex].tarefas.findIndex(tarefa => tarefa.idTarefa === idAcao);

    if (tarefaIndex !== -1) {
        alert("Tarefa excluída com sucesso.");
        usuarios[usuarioIndex].tarefas.splice(tarefaIndex, 1);

        for (let i = tarefaIndex; i < usuarios[usuarioIndex].tarefas.length; i++) {
            usuarios[usuarioIndex].tarefas[i].idTarefa = usuarios[usuarioIndex].tarefas[i].idTarefa - 1;
        }

        let ultimaTarefaAlt = JSON.parse(localStorage.getItem("ultimaTarefa"));
        let ultimaTarefaAtt = ultimaTarefaAlt - 1;

        localStorage.setItem("ultimaTarefa", JSON.stringify(ultimaTarefaAtt));
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        usuarioLogado = usuarios[usuarioIndex];

        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

        exibirTarefas();

        window.location.href = "manageTasks.html";
    }
}
function alterarStatus(event) {
    event.preventDefault();

    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    let usuarioIndex = usuarios.findIndex(user => user.email_usuario === usuarioLogado.email_usuario);
    let idAcao = JSON.parse(localStorage.getItem("idAcao"));
    let tarefaIndex = usuarios[usuarioIndex].tarefas.findIndex(tarefa => tarefa.idTarefa === idAcao);

    usuarios[usuarioIndex].tarefas[tarefaIndex].statusTarefa = 'Realizada';

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarios[usuarioIndex]));

    window.location.href = 'manageTasks.html';
}