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
let conteudoArquivo = '';
let quatidadeDeAtomicasVerdadeiras = 0;

rd.on('line', line => {
    let linhaDoCampo = line.split(',');
    linhaDoCampo = linhaDoCampo.map((item, index) => {
        if(item === '1' || item === '1;'){
            conteudoArquivo += `\n${numeroAtomica(count, index)}`;
            quatidadeDeAtomicasVerdadeiras++;
        }

        return item === '1' || item === '1;' ? true : false
    });
    campoMinado[count] = linhaDoCampo;
    count ++;
});

rd.on('close', () => {
    for(let i = 0; i < campoMinado.length; i++) {
        console.log(campoMinado[i]);
    }
    console.log(verificarSatifabilidade(campoMinado) ? 'Válido' : 'Não Válido');
    escreverNoArquivo();
});

const verificarSatifabilidade = (campo = [[true]]) => {
    conteudoArquivo += verificarQuatidadeDeUns(campo) > 3 ? '\n10' : '';
    conteudoArquivo += `\n-${numeroAtomica(0, 0)} -${numeroAtomica(1, 1)} -${numeroAtomica(2, 2)}`;
    conteudoArquivo += `\n-${numeroAtomica(0, 2)} -${numeroAtomica(1, 1)} -${numeroAtomica(2, 0)}`;
    conteudoArquivo += `\n-${numeroAtomica(0, 0)} -${numeroAtomica(0, 1)} -${numeroAtomica(0, 2)} -${numeroAtomica(1, 0)} -${numeroAtomica(1, 1)} -${numeroAtomica(1, 2)} -${numeroAtomica(2, 0)} -${numeroAtomica(2, 1)} -${numeroAtomica(2, 2)}`;
    conteudoArquivo += `\n-10 -${numeroAtomica(1, 1)}`;

    let diagonalPrincipal = !campo[0][0] || !campo[1][1] || !campo[2][2];
    let diagonalSecundaria = !campo[0][2] || !campo[1][1] || !campo[2][0];
    let clausula1 = verificarTodos(campo);
    let clausula2 = !verificarQuatidadeDeUns(campo) > 3 || !campo[1][1]; 

    return diagonalPrincipal && diagonalSecundaria && clausula1 && clausula2;
};

const verificarTodos = (campo = [[true]]) => {
    let retorno = false;

    campo.forEach(elemento => {
        elemento.forEach(valor => {
            retorno = retorno || !valor;
        })
    });

    return retorno;
};

const verificarQuatidadeDeUns = (campo = [[true]]) => {
    let quatidadeDeUns = 0;

    campo.forEach(elemento => {
        elemento.forEach(valor => {
            quatidadeDeUns += valor ? 1 : 0;
        })
    });

    return quatidadeDeUns;
};

const escreverNoArquivo = () => {
    fs.writeFile('arquivo.txt', `c atomicas de 1 - 9 representam cada posição do campo\nc atomica 10 mostra se o campo tem mais de 3 uns\np cnf 10 ${4 + quatidadeDeAtomicasVerdadeiras}${conteudoArquivo}`, err => {
        if (err) throw err;
        console.log('escrito')
    });
};

const numeroAtomica = (linha, coluna) => {
    let numeros = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ]

    return numeros[linha][coluna];
};