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
            - O tempo em que ela foi incubada (baseado no historico)

        -- A quantidade de pessoas recuperadas, levando em conta:
            - O periodo de recuperacao da doenca
            - O tempo em que ela ja esta doente (baseado no historico)


    Cada celula ira interagir com suas vizinhas, levando em conta:
        -- O mesmo calculo utilizado para calcular o espalhamento interno

        -- A taxa de locomocao das pessoas entre as celulas (a populacao eh fixa, nao vai se locomover de fato)
            - Celulas ortogonais possuem uma taxa maior que as diagonais?


*/

/////////// Global variables of virus

//let deathRate = 0;
//let survivalRate = 1 - deathRate;

// Incubation time in days (no syntoms)
let incubationTransmission = false;
let incubationPeriod = 10;

// Time in days to get better after get sick
let restorePeriod = 7;

// Avarage contact of a infected person with other people
let sickPeopleContact = 2; 
let regularPeopleContact = 10;

// Probability of transmission in contact
let transmissionRate = 0.1; 


class Cell {

    constructor(pop, infectedRatio) {
    
        // Total cell population
        this.totalPop = pop;

        // Infected regular population (hosts)
        this.infectedRegularPop = pop * infectedRatio;

        // Healthy population (targets)
        this.healthyPop = pop * (1-infectedRatio);

        // Infected sick population
        this.infectedSickPop = 0; 

        // Recovered population
        this.recoveredPop = 0;

        // History of people infected per day
        this.infectedHistory = [this.infectedRegularPop];

        // Current day (starting when the cell is infected)
        this.day = 1

    }

    process() {

        // Probability of meeting a healthy person
        let healthyRatio = (this.healthyPop)/this.totalPop;

    //// Healthy -> Infected

        let peopleContactedbyInfectedPeople;

        if (incubationTransmission) peopleContactedbyInfectedPeople = ((this.infectedRegularPop * regularPeopleContact) + (this.infectedSickPop * sickPeopleContact));
        else peopleContactedbyInfectedPeople = (this.infectedSickPop * sickPeopleContact);

        // Total contacted people * Probability of a person be healthy (target) * Probability of Transmission
        let newInfected = Math.round(peopleContactedbyInfectedPeople * healthyRatio * transmissionRate); 
       
        // Set a limit to new infected people if its bigger than the healthy popuplation
        if(newInfected > this.healthyPop) newInfected = this.healthyPop;

        this.infectedHistory.push(newInfected);
        this.infectedRegularPop += newInfected;
        this.healthyPop -= newInfected;

    //// Infected -> Sick
        if(this.day >= incubationPeriod) {
            let infectedToSick = this.infectedHistory[this.day - incubationPeriod];
            this.infectedRegularPop -= infectedToSick;
            this.infectedSickPop += infectedToSick;
        }

    //// Sick -> Recover
        if(this.day >= incubationPeriod+restorePeriod) {
            let recovered = this.infectedHistory[this.day - incubationPeriod - restorePeriod];
            this.infectedSickPop -= recovered;
            this.recoveredPop += recovered;
        }

        this.day++;
    }

    processNeighbours() {

    }

    print() {
        console.log("Day: ", this.day);
        console.log("Population: ", this.totalPop);
        console.log("Healthy (targets): ", this.healthyPop);
        console.log("Infected: ", this.infectedRegularPop+this.infectedSickPop);
        console.log("   Host: ", this.infectedRegularPop);
        console.log("   Sick: ", this.infectedSickPop);
        console.log("Recovered: ", this.recoveredPop);
        console.log(" ");
    }
}

let cell = new Cell(10000, 0.003);
for(let day = 0; day < 60; day++) {
    cell.print();
    cell.process();
}
