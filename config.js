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

// Preenche os campos do formulario com os valores iniciais acima
document.querySelector("#finctr").checked = appconfig.incubationPeriod;
document.querySelector("#fincp").value = appconfig.incubationPeriod;
document.querySelector("#frestp").value = appconfig.restorePeriod;
document.querySelector("#favgsc").value = appconfig.sickPeopleContact;
document.querySelector("#favghc").value = appconfig.regularPeopleContact;
document.querySelector("#fnac").value = appconfig.neighborAsymptomaticContact;
document.querySelector("#fnsc").value = appconfig.neighborSymptomaticContact;
document.querySelector("#ftransrate").value = appconfig.transmissionRate;

// Funcao de submissao do formulario
function submitForm() {

    appconfig.incubationTransmission = document.getElementById("finctr").checked;
    appconfig.incubationPeriod = Number(document.getElementById("fincp").value);
    appconfig.restorePeriod = Number(document.getElementById("frestp").value);
    appconfig.sickPeopleContact = Number(document.getElementById("favgsc").value);
    appconfig.regularPeopleContact = Number(document.getElementById("favghc").value);
    appconfig.neighborAsymptomaticContact = Number(document.getElementById("fnac").value);
    appconfig.neighborSymptomaticContact = Number(document.getElementById("fnsc").value);
    appconfig.transmissionRate = Number(document.getElementById("ftransrate").value);

    reset();
    console.log(appconfig);
}