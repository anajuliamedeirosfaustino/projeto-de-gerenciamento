  let local = localStorage;
  
  window.onload = function() {  
  let usuarios = local.getItem('usuarios');
  usuarios = JSON.parse(usuarios)
  let count = usuarios[usuarios.length - 1];
  console.log(count.nome_usuario);

  let welcome = document.getElementById("usuarioSessao");
  let message = count.nome_usuario;
  welcome.innerText = "Bem vindo(a) " + message;

  exibirTarefas(); // Chama a função para exibir as tarefas na tabela
    let usuarioLogadoSessao = JSON.parse(localStorage.getItem("usuarioLogado"));
    let campoUsuario = document.getElementById("usuarioSessao").value;
    campoUsuario.add(usuarioLogadoSessao.nome_usuario.value);
}

var cadForm = document.getElementById("form_cadastro");
cadForm.addEventListener('submit', (e) => {

    e.preventDefault();

    let emailUsuario = document.getElementById('emailUsuario').value;
    let nomeUsuario = document.getElementById('nomeUsuario').value;
    let senhaUsuario = document.getElementById('senhaUsuario').value;

    console.log(emailUsuario);
    console.log(nomeUsuario);
    console.log(senhaUsuario);

    let usuarios = new Array();

    if (localStorage.hasOwnProperty("usuarios")) {
        //recuperar os valores da propriedade usuarios do localStorage
        //converte string para object
        usuarios = JSON.parse(localStorage.getItem("usuarios"));
    }
    let usuarioDuplicado = usuarios.find(usuario => {
        return usuario.email_usuario === emailUsuario;
    });
    if(usuarioDuplicado){
        alert("Já existe um usuário cadastrado com o email informado.\nEmail já utilizado: " + emailUsuario);
        window.location.href = "login.html"
    }else{
    // Adiciona um novo objeto no array de usuarios
    usuarios.push({ email_usuario: emailUsuario, nome_usuario: nomeUsuario, senha_usuario: senhaUsuario, tarefas: []});

    // Salva no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Usuário criado com sucesso!")
    window.location.href = "login.html"
    }
});



let loginForm = document.getElementById("form_login");
loginForm.addEventListener('submit', (l) => {
    l.preventDefault();

    let emailLogin = document.getElementById('emailLogin').value;
    let senhaLogin = document.getElementById('senhaLogin').value;
    
    //procura usuários cadastrados:
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    //vê se há correspondência com os parametros que chegaram em relação a lista de cadastros:
    let usuarioAutentica = usuarios.find(usuario => {
        return usuario.email_usuario === emailLogin && usuario.senha_usuario === senhaLogin;
    });
    if(usuarioAutentica){
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAutentica));
        alert("Você está autênticado.")
        window.location.href = "manageTasks.html"
    }else{
        alert("OOPS! Sua senha ou email estão incorretos.")
        window.location.href = "login.html"
    }
});

function adicionarTarefa(event) {
    event.preventDefault();

    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Encontrar o usuário logado no array de usuários
    let usuarioIndex = usuarios.findIndex(user => user.email_usuario === usuarioLogado.email_usuario);

    if (usuarioIndex !== -1) {
        // Adicionar a nova tarefa ao usuário logado
        let tarefaCriada = {
            nomeTarefa : document.getElementById('nomeTarefa').value,
            dataInicio: document.getElementById('dataInicio').value,
            horaInicio: document.getElementById('horaInicio').value,
            dataTermino: document.getElementById('dataTermino').value,
            horaTermino: document.getElementById('horaTermino').value,
            descricaoTarefa: document.getElementById('descricaoTarefa').value
            };

        usuarios[usuarioIndex].tarefas.push(tarefaCriada);

        // Atualizar o localStorage com o novo array de usuários
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
        // Limpa o conteúdo do tbody antes de exibir as tarefas
        tbody.innerHTML = "";

        // Verifica se o usuário tem tarefas
        if (usuarioLogado.tarefas.length > 0) {
            // Cria as linhas da tabela com as tarefas do usuário logado
            usuarioLogado.tarefas.forEach((tarefa, index) => {
                let row = tbody.insertRow();
                let cellTarefa = row.insertCell(0);
                let cellDataInicio = row.insertCell(1);
                let cellHoraInicio = row.insertCell(2)
                let cellDataTermino = row.insertCell(2);
                let cellStatus = row.insertCell(3);
                let cellAlterar = row.insertCell(4);

                cellTarefa.textContent = tarefa.nomeTarefa || '';
                cellDataInicio.textContent = tarefa.dataInicio +" às "+tarefa.horaInicio || '';
                cellDataTermino.textContent = tarefa.dataTermino +" às "+tarefa.horaTermino || '';
                cellStatus.textContent = tarefa.statusTarefa || '';

                let btnAlterar = document.createElement('button');
                btnAlterar.textContent = 'Alterar';
                btnAlterar.classList.add('btn', 'btn-success');
                btnAlterar.addEventListener('click', function() {
                });
                cellAlterar.appendChild(btnAlterar);
               
            });
        } else {
            tbody.innerHTML = "<tr><td colspan='6'>Nenhuma tarefa encontrada.</td></tr>";
        }
    } else {
        tbody.innerHTML = "<tr><td colspan='6'>Usuário não logado ou não encontrado.</td></tr>";
    }

logoutUser = () => {
    local.removeItem("usuarios");
    window.location.href = "login.html"
    }
}