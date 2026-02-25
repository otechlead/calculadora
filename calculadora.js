const CalculadoraDB = indexedDB.open("Calculadora", 1)
let db

CalculadoraDB.onupgradeneeded = function(event) {
    const db = event.target.result
    db.createObjectStore("calculos", { keyPath: "id", autoIncrement: true })
}

CalculadoraDB.onsuccess = function(event) {
    db = event.target.result
    console.log("Conexao feita")
    deletarContas()
}

CalculadoraDB.onerror = (event) => {
    console.log("Error ao conectar ao IndexedDB")
}

function salvarConta(objetoConta) {
    const transacao = db.transaction(["calculos"], "readwrite")

    const objetoCalculos = transacao.objectStore("calculos")
    const addCalculo = objetoCalculos.add(objetoConta)

    addCalculo.onsuccess = (event) => {
        console.log("Conta salva")
    }

    addCalculo.onerror = (event) => {
        console.log("Error ao salvar a conta")
        console.log(event.target.error)
    }
}

function deletarContas() {
    const transacao = db.transaction(["calculos"], "readwrite")

    const objetoCalculos = transacao.objectStore("calculos")
    const deletarCalculos = objetoCalculos.clear()

    deletarCalculos.onsuccess = (event) => {
        console.log("Deletado")
    }

    deletarCalculos.onerror = (event) => {
        console.log("Error ao deletar")
        console.log(event.target.error)
    }
}

function mostrarContas(calculos) {
    const historico = document.getElementsByClassName('calculadora-historico')[0]
    const conta = document.createElement('p')

    conta.innerHTML = `
        ${calculos[calculos.length - 1].conta} = 
        ${calculos[calculos.length - 1].resultado}
    `
    conta.className = "conta-historico"
    historico.appendChild(conta)
}

function carregarContas() {

    const transacao = db.transaction(["calculos"], "readonly")
    const objetoCalculos = transacao.objectStore("calculos")

    const getCalculos = objetoCalculos.getAll();

    getCalculos.onsuccess = function(event) {
        const calculos = event.target.result    
        mostrarContas(calculos)
    }

    getCalculos.onerror = function(event) {
        console.log("Error ao carregar as contas")
    }
}

// Função que é executada toda vez que clicamos em um número ou operador
function digitar(caractere) {
    // 1. Criamos um "atalho" para encontrar o visor do HTML pelo ID
    let visor = document.getElementById("visor");

    // 2. Se o visor estiver mostrando apenas o "0" (estado inicial)...
    if (visor.value == "0") {
        // ...nós substituímos esse "0" pelo caractere que o usuário clicou
        visor.value = caractere;
    } else {
        // 3. Caso contrário, nós "grudamos" o novo caractere ao que já estava lá
        // Exemplo: se já tinha "1" e clicou "2", o visor passa a ter "12"
        visor.value = visor.value + caractere;
    }
}

// Função que digitar um textoInicial + texto personalizado via prompt. Muito útil para personalizar valores das operações
function digitarComPrompt(textoInicial, textoPrompt, valorDefaultPrompt) {
    let textoPersonalizado = window.prompt(textoPrompt, valorDefaultPrompt);
    let resultado = textoInicial + textoPersonalizado;
    digitar(resultado);
}

// Função responsável por resetar a calculadora (botão C)
function limpar() {
    // Localiza o visor e volta o texto dele para "0"
    document.getElementById("visor").value = "0";
}

// Função que processa toda a expressão matemática (botão =)
function calcular() {
    // Busca o visor para ler a conta que está escrita nele
    let visor = document.getElementById("visor");

    visor.value = converterTextoParaPadraoEval(visor.value);

    // 1. O comando 'eval' lê o texto (ex: "5+5") e o resolve como matemática (10)
    let resultado = eval(visor.value);

    salvarConta({ 
        conta: visor.value, 
        resultado: resultado,
    })

    // 2. TRATAMENTO DE ERRO: Se o resultado for infinito (divisão por zero)
    // ou se o resultado não for um número (NaN)...

    if (resultado == Infinity) {
        // ...nós forçamos o valor a ser "0" para não assustar o usuário
        resultado = 0;
    }

    // 3. Finalmente, mostramos o resultado final (limpo) de volta no visor
    visor.value = resultado;
    carregarContas()
}

function converterTextoParaPadraoEval(texto) {
    if (texto == null) return "";

    const textoPadraoEval = String(texto)
        .replace(/²/g, "**2") //potência quadrada
        .replace(/³/g, "**3") //potência cubica
        .replace(/√(\d+)/, "Math.sqrt($1)"); //raiz quadrada

    return textoPadraoEval;
}

function verificarLetra() {
    const visor = document.getElementById("visor")
    const listaTexto = visor.value.split("")

    if (/[^0-9/*\-+.]/g.test(listaTexto[listaTexto.length - 1])) {
        listaTexto.pop()
    }

    visor.value = listaTexto.join("")
}

// MAIN

document.addEventListener("DOMContentLoaded", function () {

    // Função para mostrar/esconder botões científicos
    const checkbox = document.getElementById("toggleCientifica");
    const botoesCientificos = document.querySelectorAll(".cientifica");

    botoesCientificos.forEach(botao => botao.style.display = "none");

    checkbox.addEventListener("change", function () {
        botoesCientificos.forEach(botao => {
            if (this.checked) {
                botao.style.display = "block";
            } else {
                botao.style.display = "none";
            }
        });
    });
});


