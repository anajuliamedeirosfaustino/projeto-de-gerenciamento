var cadForm = document.getElementById("form_cadastro");
cadForm.addEventListener('submit', (e) => {

    e.preventDefault();
    
    checkInputs();
    console.log('Ok, input');

});


function checkInputs() {
    let emailUsuario = document.getElementById('emailUsuario');
    let nomeUsuario = document.getElementById('nomeUsuario');
    let senhaUsuario = document.getElementById('senhaUsuario');
    
    if (nomeUsuario.value === "") {
    setErrorFor(nomeUsuario, "O nome de usuário é obrigatório.");
  } else {
    setSuccessFor(nomeUsuario);
  }

  if (emailUsuario.value === "") {
    setErrorFor(emailUsuario, "O email é obrigatório.");
  } else if (!checkEmail(emailUsuario.value)) {
    setErrorFor(emailUsuario, "Por favor, insira um email válido.");
  } else {
    setSuccessFor(emailUsuario);
  }

  if (senhaUsuario === "") {
    setErrorFor(senhaUsuario, "A senha é obrigatória.");
  } else if (senhaUsuario.value.length < 4) {
    setErrorFor(senhaUsuario, "A senha precisa ter no mínimo 4 caracteres.");
  } else {
    setSuccessFor(senhaUsuario);
  }

   if (
        nomeUsuario.parentElement.classList.contains('success') &&
        emailUsuario.parentElement.classList.contains('success') &&
        senhaUsuario.parentElement.classList.contains('success')
    ) {
        addUsers(); // Chama a função para adicionar usuários se todos os campos forem válidos
    }
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  // Adiciona a mensagem de erro
  small.innerText = message;

  // Adiciona a classe de erro
  formControl.className = "input-field error";
}

function setSuccessFor(input) {
  const formControl = input.parentElement;

  // Adicionar a classe de sucesso
  formControl.className = "input-field success";
}

function checkEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

function addUsers() {

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
        window.location.href = "index.html"
    } 

  usuarios.push({ email_usuario: emailUsuario, nome_usuario: nomeUsuario, senha_usuario: senhaUsuario, tarefas: []});

    // Salva no localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Usuário criado com sucesso!")
    window.location.href = "index.html"

    console.log('Push')
  };
    

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
        window.location.href = "index.html"
    }
});
