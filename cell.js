class Cell {

    constructor(pop, infectedRatio, x, y) {

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

        // Amount of people contacted by sick neighbors
        this.contactedByNeighbor = 0;

        // X position in the grid
        this.x = x;

        // Y position in the grid
        this.y = y;
    }

    processDay(day) {
        // Targets available ratio
        this.healthyRatio = this.healthyPop / this.totalPop;

        //// Healthy -> Infected

        let peopleContactedbyInfectedPeople = this.infectedSickPop * appconfig.sickPeopleContact;

        if (appconfig.incubationTransmission) {
            peopleContactedbyInfectedPeople += this.infectedRegularPop * appconfig.regularPeopleContact;
        }

        // Process infection by neighbour
        peopleContactedbyInfectedPeople += this.contactedByNeighbor;
        this.contactedByNeighbor = 0;

        // Total contacted people * Probability of a person be healthy (target) * Probability of Transmission
        let newInfected = Math.round(peopleContactedbyInfectedPeople * this.healthyRatio * appconfig.transmissionRate);


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

    print() {
        console.log("Population: ", this.totalPop);
        console.log("Healthy (targets): ", this.healthyPop);
        console.log("Infected: ", this.infectedRegularPop + this.infectedSickPop);
        console.log("   Host: ", this.infectedRegularPop);
        console.log("   Sick: ", this.infectedSickPop);
        console.log("Recovered: ", this.recoveredPop);
        console.log(" ");
    }

    draw(size) {
        let x = this.x * size;
        let y = this.y * size;

        let sickRate = (this.infectedSickPop + this.infectedRegularPop)/this.totalPop;
        // sickRate -> 1 -> red
        // sickRate -> 0 -> white
        let r = 255;
        let g = 255*(1-sickRate);
        let b = 255*(1-sickRate);

        let dist_mouse = dist(mouseX, mouseY, x + size/2, y + size/2);

        // selected cell
        if(dist_mouse <= size/2) {
            fill(r-50, g-50, b-50);
            selectedCellx = this.x;
            selectedCelly = this.y;
        } else {
            fill(r, g, b);
        }

        // draw cell
        rect(1 + x, 1 + y, size, size);    



        // line(x + size/2, y + size/2, mouseX, mouseY);
        // push();
        // translate((x + mouseX) / 2, (y + mouseY) / 2);
        // rotate(atan2(mouseY - y, mouseX - x));
        // text(nfc(dist_mouse, 1), 0, -5);
        // pop();
    }


}