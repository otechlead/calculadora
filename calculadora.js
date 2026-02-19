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
    
    // 2. TRATAMENTO DE ERRO: Se o resultado for infinito (divisão por zero)
    // ou se o resultado não for um número (NaN)...
	
    if (resultado == Infinity ) {
        // ...nós forçamos o valor a ser "0" para não assustar o usuário
        resultado = 0;
    }

    // 3. Finalmente, mostramos o resultado final (limpo) de volta no visor
    visor.value = resultado;
}

function converterTextoParaPadraoEval(texto) {
    if (texto == null) return "";

    const textoPadraoEval = String(texto)
        .replace(/²/g, "**2")
        .replace(/³/g, "**3");

    return textoPadraoEval;
}