var usuarios = [];
var openRequest = indexedDB.open("MCTI", 1);
var banco;

openRequest.onupgradeneeded = () => {
    banco = openRequest.result;
    let objectStore = banco.createObjectStore("Usuarios", {keyPath: "id", autoIncrement: true});
    objectStore.createIndex("Nome", "nome");
    objectStore.createIndex("Idade", "idade");
    objectStore.createIndex("Email", "email", {unique: true});
};

openRequest.onsuccess = () => {
    banco = openRequest.result;
    let transacao = banco.transaction("Usuarios", "readwrite");
    let store = transacao.objectStore("Usuarios");
    let indexNome = store.index("Nome");
};

let adicionarUsuario = () => {
    let nome = document.getElementById("nome").value;
    let idade = document.getElementById("idade").value;
    let email = document.getElementById("email").value;
    let transacao = banco.transaction("Usuarios", "readwrite");
    let store = transacao.objectStore("Usuarios");
    store.put({nome: nome, idade: idade, email: email});
    console.log(`Usuário ${nome} adicionado com sucesso...`);
    limparInputs();
    obterUsuarios();
};

let limparInputs = () => {
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("email").value = "";
};

let obterUsuarios = () => {
    let transacao = banco.transaction("Usuarios", "readonly");
    let store = transacao.objectStore("Usuarios");
    let consulta = store.getAll();
    consulta.onsuccess = () => {
        usuarios = consulta.result;
        limparTabela();
        adicionarUsuariosATabela(consulta.result);
    };
};

let limparTabela = () => {
    const tabelaUsuarios = document.getElementById("tabela_usuario");
    const tbody = tabelaUsuarios.querySelector("tbody");
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
};

let adicionarUsuariosATabela = (usuarios) => {
    const tabelaUsuarios = document.getElementById("tabela_usuario");
    const tbody = tabelaUsuarios.querySelector("tbody");
    usuarios.forEach(usuario => {
        const linha = document.createElement("tr");
        const colunaNome = document.createElement("td");
        const colunaIdade = document.createElement("td");
        const colunaEmail = document.createElement("td");

        colunaNome.textContent = usuario.nome;
        colunaIdade.textContent = usuario.idade;
        colunaEmail.textContent = usuario.email;

        linha.appendChild(colunaNome);
        linha.appendChild(colunaIdade);
        linha.appendChild(colunaEmail);

        tbody.appendChild(linha);
    });
};