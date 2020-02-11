const appconfig = require("./config.js");
var Cell = require("./cell.js");

function neighborDiseaseTransmission(neighbor, cell) {
    if (cell.healthyPop > 0 && (neighbor.infectedRegularPop > 0 || neighbor.infectedSickPop > 0)) {

        let contactedByNeighbor = neighbor.infectedSickPop * (appconfig.neighborSymptomaticContact * Math.random());

        if(appconfig.incubationTransmission) {
            contactedByNeighbor += neighbor.infectedRegularPop * (appconfig.neighborAsymptomaticContact * Math.random());
        }

        let infectedByNeighbor = Math.round(contactedByNeighbor * cell.healthyRatio * appconfig.transmissionRate);
        cell.infectedByNeighbors += infectedByNeighbor;
    }

}

class Region {

    constructor (size, densityPop) {

        /* create a Size x Size grid of Cells
         * with densityPop people in each cell
         */

        this.totalPopulation = densityPop*size*size;

        this.size = size;

        this.densityPop = densityPop;

        this.day = 1

        this.grid = [];
        for (let x = 0; x < size; x++) {
            this.grid[x] = []
            for (let y = 0; y < size; y++) {
                this.grid[x][y] = new Cell(densityPop, 0);
            }
        }

    }

    infectCell(rate, x, y) {
        if(x >= 0 && x < this.size && y >= 0 && y < this.size) {
            this.grid[x][y] = new Cell(this.densityPop, rate);
        } else {
            console.log("Coordinates out of range");
        }
    }

    processNeighbors() {
        for(let x = 0; x < this.size; x++) {
            for(let y = 0; y < this.size; y++) {
                if (this.grid[x - 1] !== undefined && this.grid[x - 1][y] !== undefined) {
                    neighborDiseaseTransmission(this.grid[x - 1][y], this.grid[x][y]);
                }
                if (this.grid[x + 1] !== undefined && this.grid[x + 1][y] !== undefined) {
                    neighborDiseaseTransmission(this.grid[x + 1][y], this.grid[x][y]);
                }
                if (this.grid[x][y - 1] !== undefined) {
                    neighborDiseaseTransmission(this.grid[x][y - 1], this.grid[x][y]);
                }
                if (this.grid[x][y + 1] !== undefined) {
                    neighborDiseaseTransmission(this.grid[x][y + 1], this.grid[x][y]);
                }
            }
        }

    }

    processDay () {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                this.grid[x][y].processDay(this.day);
                 // this.grid[x][y].print();
            }
        }

        this.day++;
    }

    print() {
        // Printa tabela

        // matriz de infectados de cada celula
        let data = this.grid.map(x => {
            return x.map(y => y.infectedSickPop);
        });
        console.log("Day: ", this.day);
        console.table(data);
        console.log();
    }
}

module.exports = Region;