const fs = require('fs');
const readline = require('readline');

const rd = readline.createInterface({
    input: fs.createReadStream('./info'),  
    console: false
});

let campoMinado = [
    [false, false, false],
    [false, false, false],
    [false, false, false]
];

let campoMinadoVisual = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let count = 0;

rd.on('line', line => {
    let linhaDoCampo = line.split(',');
    linhaDoCampo = linhaDoCampo.map(item => item === '1' ? true : false);
    campoMinado[count] = linhaDoCampo;0
    count ++;
});

rd.on('close', () => {
    verificar(1, 1);
    verificar(2, 0);
    verificar(1, 0);
    verificar(1, 2);
    for(let i = 0; i < campoMinadoVisual.length; i++) {
        console.log(campoMinadoVisual[i]);
    }
});

const temBomba = (x, y) => {
    return campoMinado[x][y];
};

const temBombaNasAdjacencias = (x, y) => {
    for(let i = x - 1; i <= x + 1; i++){
        for(let j = y - 1; j <= y + 1; j++){
            if(!(i === x && j === y)){
                if(i > -1 && j > -1 && i < campoMinado.length && j < campoMinado.length){
                    campoMinadoVisual[x][y] = campoMinadoVisual[x][y] === 1 ? 1 : (temBomba(i, j) ? 1 : 0);
                }
            }
        }
    }
};

const verificar = (x, y) => {
    for(let i = x - 1; i <= x + 1; i++){
        for(let j = y - 1; j <= y + 1; j++){
            if(!(i === x && j === y)){
                if(i > -1 && j > -1 && i < campoMinado.length && j < campoMinado.length){
                    temBombaNasAdjacencias(i, j);
                }
            }
        }
    }
};