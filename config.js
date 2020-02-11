/////////// Global variables
appconfig = {

    //let deathRate = 0;
    //let survivalRate = 1 - deathRate;

    // Incubation time in days (no syntoms)
    incubationTransmission : true,
    incubationPeriod : 5,

    // Time in days to get better after get sick
    restorePeriod : 7,

    // Average contact of a infected person with other people
    sickPeopleContact : 1,
    regularPeopleContact : 8,

    // 
    neighborAsymptomaticContact : 0.3,
    neighborSymptomaticContact : 0.15,

    // Probability of transmission in contact
    transmissionRate : 0.1
}