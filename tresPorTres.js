const fs = require('fs');
const readline = require('readline');

const rd = readline.createInterface({
    input: fs.createReadStream('./tresPorTres'),  
    console: false
});

let campoMinado = [
    [false, false, false],
    [false, false, false],
    [false, false, false]
];

let count = 0;

rd.on('line', line => {
    let linhaDoCampo = line.split(',');
    linhaDoCampo = linhaDoCampo.map(item => item === '1' || item === '1;' ? true : false);
    campoMinado[count] = linhaDoCampo;
    count ++;
});

rd.on('close', () => {
    for(let i = 0; i < campoMinado.length; i++) {
        console.log(campoMinado[i]);
    }
    console.log(verificarSatifabilidade(campoMinado) ? 'Válido' : 'Não Válido');
});

const verificarSatifabilidade = (campo = [[true]]) => {
    let diagonalPrincipal = !campo[0][0] || !campo[1][1] || !campo[2][2];
    let diagonalSecundaria = !campo[0][2] || !campo[1][1] || !campo[2][0];
    let clausula1 = verificarTodos(campo);
    let clausula2 = !(verificarQuatidadeDeUns(campo) > 3 && campo[1][1]); 

    return diagonalPrincipal && diagonalSecundaria && clausula1 && clausula2;
}

const verificarTodos = (campo = [[true]]) => {
    let retorno = false;

    campo.forEach(elemento => {
        elemento.forEach(valor => {
            retorno = retorno || !valor;
        })
    });

    return retorno;
}

const verificarQuatidadeDeUns = (campo = [[true]]) => {
    let quatidadeDeUns = 0;

    campo.forEach(elemento => {
        elemento.forEach(valor => {
            quatidadeDeUns += valor ? 1 : 0;
        })
    });

    return quatidadeDeUns;
}