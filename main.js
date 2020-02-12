/*
Ideias futuras:
    Usar o tamanho de cada celula e a densidade demografica
    para calcular a quantidade de pessoas ali contidas.
    (permitira utilizar no programa dados ja mapeados em mapas demograficos)
*/

/*

Definido:

    Cada celula possui um historico (array) de pessoas infectadas (uma celula por dia),
    para poder processar a quantidade de pessoas recuperadas no tempo certo.

    Cada celula ira processar ela mesma, diariamente:            
        -- O espalhamento da doenca dentro dela mesma, levando em conta:
            - A porcentagem da populacao infectada em incubacao 
            - A porcentagem da populacao infectada doente (entra em contato com menos pessoas e se previne mais)
            - Taxa de transmissao
            
        -- A transicao do estado da populacao em incubacao para doente, levando em conta:
            - O tempo de incubaçao da doenca
            - O tempo em que ela foi incubada (baseado no historico)

        -- A transicao do estado da populacao de doente para recuperadas, levando em conta:
            - O tempo de recuperacao da doenca
            - O tempo em que ela ja esta doente (baseado no historico)


    Cada celula ira interagir com suas vizinhas, levando em conta:
        -- O mesmo calculo utilizado para calcular o espalhamento interno

        -- A taxa de locomocao das pessoas entre as celulas (a populacao eh fixa, nao vai se locomover de fato)
            - Celulas ortogonais possuem uma taxa maior que as diagonais?

*/  

// City is a 20x20 grid with 10000 people each unit
city = new Region(25, 10000);

// 1 cell infected (5% at position: x = 7, y = 7)
city.infectCell(0.05, 7, 7);

let selectedCellx = 0;
let selectedCelly = 0;
let size;

function reset () {
    city = new Region(25, 10000);
    city.infectCell(0.05, 3, 3);
    document.querySelector("#day").textContent = city.day;
}

function nextDay() {
    city.processNeighbors();
    city.processDay();
    document.querySelector("#day").textContent = city.day;
    // city.print();
}

function windowResized() {
    resizeCanvas(city.size * size + 2, city.size * size + 2);
}

function setup() {
    frameRate(30);
    background(255);
    size = (windowWidth / (city.size * 3.0));
    let myCanvas = createCanvas(city.size * size + 2, (city.size)*size + 2).style('display', 'block').style('margin', 'auto');
    myCanvas.parent("canvasContainer");
}

function draw() {
    background(255);
    size = (windowWidth/(city.size * 3.0));
    city.drawRegion(size);

    document.querySelector("#x").textContent = selectedCellx;
    document.querySelector("#y").textContent = selectedCelly;
    let cell = city.grid[selectedCellx][selectedCelly];
    document.querySelector("#totpop").textContent = cell.totalPop;
    document.querySelector("#healthy").textContent = cell.healthyPop;
    document.querySelector("#infasymp").textContent = cell.infectedRegularPop;
    document.querySelector("#infsymp").textContent = cell.infectedSickPop;
    document.querySelector("#recovered").textContent = cell.recoveredPop;
}

