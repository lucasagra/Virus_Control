const appconfig = require("./config.js");

class Cell {

    constructor(pop, infectedRatio) {

        // Total cell population
        this.totalPop = pop;

        // Infected regular population (hosts)
        this.infectedRegularPop = pop * infectedRatio;

        // Healthy population (targets)
        this.healthyPop = pop * (1 - infectedRatio);

        // Infected sick population
        this.infectedSickPop = 0;

        // Recovered population
        this.recoveredPop = 0;

        // History of people infected per day
        this.infectedHistory = [this.infectedRegularPop];

        // Probability of meeting a healthy person
        this.healthyRatio = (this.healthyPop) / this.totalPop;

        // Amount of people infected by neighbors
        this.infectedByNeighbors = 0;

    }

    processDay(day) {
        // Changed
        this.healthyRatio = this.healthyPop / this.totalPop;

        //// Healthy -> Infected

        let peopleContactedbyInfectedPeople = this.infectedSickPop * appconfig.sickPeopleContact;

        if (appconfig.incubationTransmission) {
            peopleContactedbyInfectedPeople += this.infectedRegularPop * appconfig.regularPeopleContact;
        }

        // Total contacted people * Probability of a person be healthy (target) * Probability of Transmission
        let newInfected = Math.round(peopleContactedbyInfectedPeople * this.healthyRatio * appconfig.transmissionRate);
        
        // Process infection by neighbour
        newInfected += this.infectedByNeighbors;
        this.infectedByNeighbors = 0;

        // Set a limit to new infected people if its bigger than the healthy population
        if (newInfected > this.healthyPop) {
            newInfected = this.healthyPop;
        }

        this.infectedHistory.push(newInfected);
        this.infectedRegularPop += newInfected;
        this.healthyPop -= newInfected;

        //// Infected -> Sick
        if (day >= appconfig.incubationPeriod) {
            let infectedToSick = this.infectedHistory[day - appconfig.incubationPeriod];
            this.infectedRegularPop -= infectedToSick;
            this.infectedSickPop += infectedToSick;
        }

        //// Sick -> Recover
        if (day >= appconfig.incubationPeriod + appconfig.restorePeriod) {
            let recovered = this.infectedHistory[day - appconfig.incubationPeriod - appconfig.restorePeriod];
            this.infectedSickPop -= recovered;
            this.recoveredPop += recovered;
        }

    }


    print(day) {
        console.log("Day: ", day);
        console.log("Population: ", this.totalPop);
        console.log("Healthy (targets): ", this.healthyPop);
        console.log("Infected: ", this.infectedRegularPop + this.infectedSickPop);
        console.log("   Host: ", this.infectedRegularPop);
        console.log("   Sick: ", this.infectedSickPop);
        console.log("Recovered: ", this.recoveredPop);
        console.log(" ");
    }
}


module.exports = Cell;