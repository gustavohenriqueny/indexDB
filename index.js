var usuarios = [];
var banco;
const nomeBanco = "APP";
const objetoUsuario = "USUARIO";
const versaoBanco = 1;

var inicializarAplicacao = async () => {
    inicializarBanco();
    await obterUsuarios();
};

let inicializarBanco = () => {
    return new Promise((resolve, reject) => {
        if(!banco){
            const requisicao = window.indexedDB.open(nomeBanco, versaoBanco);
            requisicao.onupgradeneeded = (event) => {
            const banco = event.target.result;
            if(!banco.objectStoreNames.contains(objetoUsuario)) {
                let store = banco.createObjectStore(objetoUsuario, { keyPath: "nome"});
                store.createIndex("Nome", "nome");
                store.createIndex("Idade", "idade");
                store.createIndex("Email", "email");  
            };
            console.log("Banco criado com sucesso!");
        };
        requisicao.onsuccess = (event) => resolve(event.target.result);
        requisicao.onerror = (event) => reject(event.target.error);
        } else {
            resolve(banco);
        }
    });
}

let adicionarUsuario = () => {
    return new Promise(async (resolve, reject) => {
        banco = await inicializarBanco();
        const transacao = banco.transaction(objetoUsuario, "readwrite");
        const objectStore = transacao.objectStore(objetoUsuario);
        const requisicao = objectStore.add(usuario());
        requisicao.onsuccess = (event) => resolve(event.target.result);
        requisicao.onerror = (event) => reject(event.target.error);
        limparInputs();
        limparTabela();
        obterUsuarios();
    });
};

let obterUsuarios = () => {
    return new Promise(async (resolve, reject) => {
        banco = await inicializarBanco();
        const transacao = banco.transaction(objetoUsuario, "readonly");
        const store = transacao.objectStore(objetoUsuario);
        const consulta = store.getAll();
        consulta.onsuccess = (event) => {
            usuarios = event.target.result;
            adicionarUsuariosATabela(usuarios);
        };
        consulta.onerror = (event) => reject(event.target.error);
    });
};

// let buscarUsuario = () => {
//     let requisicao = window.indexedDB.open(nomeBanco);
//     requisicao.onsuccess = () => {
//         banco = openDBRequest.result;
//         let transacao = banco.transaction("Usuario", "readonly");
//         let store = transacao.objectStore("Usuario");
//         let indexIdade = store.index("Idade");
//         let consulta = indexIdade.get("12");
//         consulta.onsuccess = () => {
//             console.log(consulta.result);
//         };
//     };
// };

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
    usuarios?.forEach(usuario => {
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

let limparInputs = () => {
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
    document.getElementById("email").value = "";
};


let usuario = () => {
    return {
        nome: document.getElementById("nome").value,
        idade: document.getElementById("idade").value,
        email: document.getElementById("email").value
    }
};