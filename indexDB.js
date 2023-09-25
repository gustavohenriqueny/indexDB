// Abre o banco localmente no navegador.
var request = window.indexedDB.open("MCTI", 1);

// E executado quando o banco vai ser atualizado/criado.
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