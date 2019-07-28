const fs = require('fs');
const readline = require('readline');

const rd = readline.createInterface({
    input: fs.createReadStream('./arquivo.txt'),  
    console: false
});

let formula = [];

rd.on('line', line => {
    if(line[0] !== 'c' && line[0] !== 'p'){
        formula.push(line.split(' '));
    }
});

rd.on('close', () => {
    let atomicasSatisfativeis = []; 
    let insatisfativel = false;

    while(temClausulaNaoVazia(formula) && !insatisfativel){
        while(buscarAtomicas(formula) !== -1 && !insatisfativel){
            let atomica = buscarAtomicas(formula);
            atomicasSatisfativeis.push(atomica);
            formula = buscarAtomicasNasClausulas(atomica, formula);
            insatisfativel = buscarInsatisfabilidade(atomica, formula);
        }

        while(buscarAtomicas(formula) === -1 && !insatisfativel && temClausulaNaoVazia(formula)){
            let primeiraClausulaIndex = formula.findIndex(clausula => clausula.length > 1);
            
            if(primeiraClausulaIndex !== -1){
                let atomica = formula[primeiraClausulaIndex][0];
                atomicasSatisfativeis.push(atomica);
                formula = buscarAtomicasNasClausulas(atomica, formula);
                insatisfativel = buscarInsatisfabilidade(atomica, formula);
            }
        }
    }

    console.log(insatisfativel ? 'insatifativel': `satisfativel ${atomicasSatisfativeis}`);
});

const temClausulaNaoVazia = (formula = [[]]) => formula.some(clausula => clausula.length > 0);

const buscarAtomicas = (formula = []) => {
    let atomicaIndex = formula.findIndex(clausula => clausula.length === 1);

    return atomicaIndex === -1 ? -1 : formula[atomicaIndex][0];
};

const buscarInsatisfabilidade = (atomica = '', formula = []) => {
    let retorno = false;

    formula.forEach(clausula => {
        if(atomica[0] !== '-'){
            let atomicaClausulaIndex = clausula.findIndex(atomicaClausula => atomicaClausula === atomica || atomicaClausula === `-${atomica}`);

            if(atomicaClausulaIndex !== -1){
                if(clausula[atomicaClausulaIndex][0] === '-' && clausula.length === 1){
                    retorno = true;
                } 
            }   
        } else {
            let atomicaClausulaIndex = clausula.findIndex(atomicaClausula => atomicaClausula === atomica || atomicaClausula === atomica.replace('-', ''));

            if(atomicaClausulaIndex !== -1){
                if(clausula[atomicaClausulaIndex][0] !== '-' && clausula.length === 1){
                    retorno = true
                } 
            }
        }
    });

    return retorno;
};

const buscarAtomicasNasClausulas = (atomica = '', formula = []) => {
    formula.forEach((clausula, index) => {
        if(atomica[0] !== '-'){
            let atomicaClausulaIndex = clausula.findIndex(atomicaClausula => atomicaClausula === atomica || atomicaClausula === `-${atomica}`);

            if(atomicaClausulaIndex !== -1){
                if(clausula[atomicaClausulaIndex][0] !== '-'){
                    formula[index] = [];
                } else if(clausula.length > 1){
                    clausula.splice(atomicaClausulaIndex, 1);
                }
            }   
        } else {
            let atomicaClausulaIndex = clausula.findIndex(atomicaClausula => atomicaClausula === atomica || atomicaClausula === atomica.replace('-', ''));

            if(atomicaClausulaIndex !== -1){
                if(clausula[atomicaClausulaIndex][0] === '-'){
                    formula[index] = [];
                } else if(clausula.length > 1){
                    clausula.splice(atomicaClausulaIndex, 1);
                }
            }
        }
    });
    
    return formula;
};