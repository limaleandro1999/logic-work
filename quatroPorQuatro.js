const fs = require('fs');
const readline = require('readline');

const rd = readline.createInterface({
    input: fs.createReadStream('./info'),  
    console: false
});

let campoMinado = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
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
    let diagonalPrincipal = (!campo[0][0] || !campo[3][3]) && (!campo[0][0] || !campo[1][1] || !campo[2][2]) && (!campo[1][1] || !campo[2][2] || !campo[3][3]);
    let diagonalSecundaria = (!campo[0][3] || !campo[3][0]) && (!campo[0][3] || !campo[1][2] || !campo[2][1]) && (!campo[3][0] || !campo[2][1] || !campo[1][2]);
    let clausula1 = verificarLinhas(campo) && verificarColunas(campo);
    let clausula2 = verificarQuadrados(campo);
    let clausula3 = verificarLinhasT(campo) && verificarColunasT(campo);
    
    return diagonalPrincipal && diagonalSecundaria && clausula1 && clausula2 && clausula3;
}

const verificarLinhas = (campo = [[true]]) => {
    let retorno = true;

    for(let i = 0; i < campo.length; i++){
        for(let j = 0; j < campo.length; j++){
            let resultadoLinha = !campo[i][0] || !campo[j][3];
            
            retorno = retorno && resultadoLinha;
        }
    }

    return retorno;
}

const verificarColunas = (campo = [[true]]) => {
    let retorno = true;

    for(let i = 0; i < campo.length; i++){
        for(let j = 0; j < campo.length; j++){
            let resultadoLinha = !campo[0][i] || !campo[3][j];
        
            retorno = retorno && resultadoLinha;
        }
    }

    return retorno;
}

const verificarLinhasT = (campo = [[true]]) => {
    let retorno = true;

    for(let i = 0; i < campo.length; i++){
        let t = false;

        for(let j = 0; j < campo.length; j++){
            if(campo[i][j] && i < 2 && j < 2){
                t = !campo[i][j] || !campo[i][j + 1] || !campo[i][j + 2] || !campo[i + 1][j + 1];
            } else {
                t = true;
            }

            retorno = retorno && t;
        }
    }

    return retorno;
}

const verificarColunasT = (campo = [[true]]) => {
    let retorno = true;

    for(let i = 0; i < campo.length; i++){
        let t = false;

        for(let j = 0; j < campo.length; j++){
            if(campo[j][i] && i < 2 && j < 2){
                t = !campo[j][i] || !campo[j + 1][i] || !campo[j + 2][i] || !campo[j + 1][i + 1];
            } else {
                t = true;
            }

            retorno = retorno && t;
        }
    }

    return retorno;
}

const verificarQuadrados = (campo = [[true]]) => { 
    let retorno = true;

    for(let i = 0; i < campo.length; i++){
        let quadrado = false;
        for(let j = 0; j < campo.length; j++){
            if(campo[i][j] && i < 3 && j < 3){
                quadrado = !campo[i][j] || !campo[i + 1][j] || !campo[i][j + 1] || !campo[i + 1][j + 1];
            } else {
                quadrado = true;
            }

            retorno = retorno && quadrado;
        }
    }

    return retorno;
}