import dataGeneralxsku from '../dataGeneralsku.js';
import device from '../dispositivo.js';

/** Variables */
let
    filtersValue = {},
    arrayToGraphic = [],
    arrayToTable = [],
    // urlConsult = `https://viewer.mudi.com.co:3589/api/mudiv1/`
    urlConsult = `http://localhost:3589/api/mudiv1/`


async function requestUsability(myTest, myEventView, myInteraction, myDevice) {

    let MyBody = {
        shopper: document.body.querySelector('.selectShopper').value,
        test: myTest,
        viewEvent: myEventView,
        interaction: myInteraction,
        deviceType: myDevice,
        dateInit  : document.body.querySelector('.selectDateInit').value,
        dateEnd   : document.body.querySelector('.selectDateEnd').value,
    }

    const request = await fetch(`${urlConsult}usabilityRequestPixel`, {
        method: 'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(MyBody)
    })

    const response = await request.json();
    const data = await response[0].sessions;
    return data

};

async function requestEngagement(myTest, myEventView, myInteraction) {

    let MyBody = {
        shopper: document.body.querySelector('.selectShopper').value,
        test: myTest,
        viewEvent: myEventView,
        interaction: myInteraction,
    }

    const request = await fetch(`${urlConsult}engagementRequestPixel`, {
        method: 'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(MyBody)
    })

    const response = await request.json();
    const data = await response[0].time;
    return data
};

async function requestAddToCar(myTest, myEventView, myInteraction, myAddToCar, myDevice) {
    let MyBody = {
        shopper: document.body.querySelector('.selectShopper').value,
        test: myTest,
        viewEvent: myEventView,
        interaction: myInteraction,
        addToCar: myAddToCar,
        deviceType: myDevice
    }


    const request = await fetch(`${urlConsult}addTocarRequestPixel`, {
        method: 'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(MyBody)
    })

    const response = await request.json();
    const data = await response[0].totalAddtocar;
    return data
};

async function requestPurchase(myTest, purchase, myDevice) {

    let MyBody = {
        shopper: document.body.querySelector('.selectShopper').value,
        test: myTest,
        purchase: purchase,
        deviceType: myDevice
    }

    const request = await fetch(`${urlConsult}purchaseRequestPixel`, {
        method: 'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(MyBody)
    })

    const response = await request.json();
    const data = await response[0].purchaseTotal;
    return data
};

async function allResultsRequest(test) {

    let results = {

        usability: {
            withDesk: null,
            withMobile: null,
            withOutDesk: null,
            withOutMobile: null,
        },
        engagement: {
            with: null,
            withOut: null,
            diference: null
        },
        addToCar: {
            withDesk: null,
            withMobile: null,
            withOutDesk: null,
            withOutMobile: null
        },
        purchase: {
            withDesk: null,
            withMobile: null,
            withOutDesk: null,
            withOutMobile: null
        },


    };

    test == 'A' && (
        results.usability.withDesk = await requestUsability(test, '>', '>', 'desk'),
        results.usability.withMobile = await requestUsability(test, '>', '>', 'mobile'),
        results.usability.withOutDesk = await requestUsability(test, '>', '=', 'desk'),
        results.usability.withOutMobile = await requestUsability(test, '>', '=', 'mobile'),

        results.engagement.with = await requestEngagement(test, '>', '>'),
        results.engagement.withOut = await requestEngagement(test, '>', '='),

        results.addToCar.withDesk = await requestAddToCar(test, '>', '>', '>', 'desk'),
        results.addToCar.withMobile = await requestAddToCar(test, '>', '>', '>', 'mobile'),
        results.addToCar.withOutDesk = await requestAddToCar(test, '>', '=', '>', 'desk'),
        results.addToCar.withOutMobile = await requestAddToCar(test, '>', '=', '>', 'mobile'),

        results.purchase.withDesk = await requestPurchase(test, '>', 'desk'),
        results.purchase.withMobile = await requestPurchase(test, '>', 'mobile'),
        results.purchase.withOutDesk = await requestPurchase(test, '=', 'desk'),
        results.purchase.withOutMobile = await requestPurchase(test, '=', 'mobile')


    )

    test == 'B' && (
        results.usability.withOutDesk = await requestUsability(test, '=', '=', 'desk'),
        results.usability.withOutMobile = await requestUsability(test, '=', '=', 'mobile'),

        results.engagement.withOut = await requestEngagement(test, '=', '='),

        results.addToCar.withOutDesk = await requestAddToCar(test, '=', '=', '>', 'desk'),
        results.addToCar.withOutMobile = await requestAddToCar(test, '=', '=', '>', 'mobile'),

        results.purchase.withOutDesk = await requestPurchase(test, '>', 'desk'),
        results.purchase.withOutMobile = await requestPurchase(test, '>', 'mobile')
    )
    /** Construimos las diferencias */

    // results.usability.diference     = (results.usability.withDesk + results.usability.withMobile);

    // results.addToCar.diference      = ((results.addToCar.with / results.addToCar.withOut)*100).toFixed(0);

    // /** Purchase */
    // results.purchase.with           = Math.ceil(results.purchase.with * (results.usability.diference/100).toFixed(2));
    // results.purchase.withOut        = Math.ceil(results.purchase.withOut * .15);
    // results.purchase.diference      = results.purchase.withOut - results.purchase.with;

    return results;
};


/** Función para construir la tabla de datos generales */
async function buildTable(test) {

    const results = await allResultsRequest(test);

    /** Imprimiendo la usabilidad Con y Sin interacción */
    const withI = (results.usability.withDesk + results.usability.withMobile);
    const withOutI = (results.usability.withOutDesk + results.usability.withOutMobile);
    const diferencia = (withI / withOutI * 100).toFixed(0);
    test == 'A' && (document.body.querySelector(`.usabilityWith${test}`).innerHTML = `Con interacción: <span class="valorKPI">${withI}</span>`);
    document.body.querySelector(`.usabilityWithOut${test}`).innerHTML = `Sin interacción: <span class="valorKPI">${withOutI}</span>`;
    test == 'A' && (document.body.querySelector(`.diferenceUsability${test}`).innerHTML = `% Diferencia : ${diferencia}%`);

    /** Imprimiendo la engagement Con y Sin interacción */
    test == 'A' && (document.body.querySelector(`.engagementWith${test}`).innerHTML = `Con interacción: <span class="valorKPI">${results.engagement.with}</span>`);
    document.body.querySelector(`.engagementWithOut${test}`).innerHTML = `Sin interacción: <span class="valorKPI">${results.engagement.withOut}</span>`;
    document.body.querySelector(`.diferenceEngagement${test}`).innerHTML = `% Diferencia : ${results.engagement.diference}%`;

    /** Impirmiendo el add To Car Con y Ain interacción */
    const withIAddToCart = (results.addToCar.withDesk + results.addToCar.withMobile);
    const withOutIAddToCart = (results.addToCar.withOutDesk + results.addToCar.withOutMobile);
    const diferenciaAddToCart = (withIAddToCart / withOutIAddToCart * 100).toFixed(0);
    console.log(results.addToCar.withOutMobile);
    test == 'A' && (document.body.querySelector(`.addToCarWith${test}`).innerHTML = `Con interacción: <span class="valorKPI">${withIAddToCart}(${(withIAddToCart / withI).toFixed(2)}%)</span>`);
    document.body.querySelector(`.addToCarWithOut${test}`).innerHTML = `Sin interacción: <span class="valorKPI">${withOutIAddToCart}(${(withOutIAddToCart / withOutI).toFixed(2)}%)</span>`;
    test == 'A' && (document.body.querySelector(`.diferenceAddToCar${test}`).innerHTML = `% Diferencia : ${diferenciaAddToCart}%`);

    /** Imprimiendo la conversión Con y Sin  interacción */
    const withIPurchase = (results.purchase.withDesk + results.purchase.withMobile);
    const withOutIPurchase = (results.purchase.withOutDesk + results.purchase.withOutMobile);
    const diferenciaPurchase = (withIPurchase / withOutIPurchase * 100).toFixed(0);
    test == 'A' && (document.body.querySelector(`.purchaseWith${test}`).innerHTML = `Con interacción: <span class="valorKPI">${withIPurchase}/(${(withIPurchase / withI).toFixed(2)}%)</span>`);
    document.body.querySelector(`.purchaseWithOut${test}`).innerHTML = `Sin interacción: <span class="valorKPI">${withOutIPurchase}/(${(withOutIPurchase / withOutI).toFixed(2)}%)</span>`;
    test == 'A' && (document.body.querySelector(`.diferencePurchase${test}`).innerHTML = `% Diferencia : ${diferenciaPurchase}`);

    /** Renderizar la gráfica de usabilidad */

    graphicUsability(results.usability, test);

    /** Renderizar la gráfica de Engagement */
    //graphicEngagement(results.engagement);

    /** Renderizar la gráfica de AddToCar */
    graphicAddToCar(results.addToCar, test);

    /** Renderizar la gráfica de Purchase */
    graphicPurchase(results.purchase, test);


};

/** Función para renderizar la grafica de la card usabilidad */
function graphicUsability(object, test) {
    document.body.querySelector('.graphicUsabilityRender' + test).innerHTML = ``;
    let
        totalDesk = object.withDesk + object.withOutDesk,
        totalMobile = object.withMobile + object.withOutMobile

    const
        canvas = document.createElement('CANVAS');
    canvas.id = `chartUsability${test}`;
    canvas.classList.add('graphicTableKpi');

    document.body.querySelector('.graphicUsabilityRender' + test).appendChild(canvas);
    const ctx = document.body.querySelector(`#chartUsability${test}`).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Desk', 'Mobile'],
            datasets: [{
                label: 'Desk VS Mobile',
                data: [totalDesk, totalMobile], // El primer valor es el valor de la referencia
                borderWidth: 1,
                backgroundColor: ['#ff0700', '#0e2c59'],
                barThickness: 40,
                borderWidth: 3,
                borderRadius: 10
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'top'
                }
            }
        }
    });


};

/** Función para renderizar la grafica de la card Engagement */
function graphicEngagement(object, test) {

    document.body.querySelector('.graphicEngagementRender' + test).innerHTML = ``;

    const
        canvas = document.createElement('CANVAS');
    canvas.id = "chartEngagement";
    canvas.classList.add('graphicTableKpi');

    document.body.querySelector('.graphicEngagementRender' + test).appendChild(canvas);

    const ctx = document.body.querySelector('#chartEngagement').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sin', `Con`],
            datasets: [{
                label: 'Sin VS Con',
                data: [object.withOut, object.with], // El primer valor es el valor de la referencia
                borderWidth: 1,
                backgroundColor: ['#ff0700', '#0e2c59'],
                barThickness: 40,
                borderWidth: 3,
                borderRadius: 10
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'top'
                }
            }
        }
    });

};

/** Función para renderizar la gráfica de la card Add To Car*/
function graphicAddToCar(object, test) {
    document.body.querySelector('.graphicAddToCarRender' + test).innerHTML = ``;
    let
        totalDesk = object.withDesk + object.withOutDesk,
        totalMobile = object.withMobile + object.withOutMobile

    const
        canvas = document.createElement('CANVAS');
    canvas.id = `chartAddToCar${test}`;
    canvas.classList.add('graphicTableKpi');

    document.body.querySelector('.graphicAddToCarRender' + test).appendChild(canvas);

    const ctx = document.body.querySelector(`#chartAddToCar${test}`).getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Desk', `Mobile`],
            datasets: [{
                label: 'Sin VS Con',
                data: [totalDesk, totalMobile], // El primer valor es el valor de la referencia
                borderWidth: 1,
                backgroundColor: ['#ff0700', '#0e2c59'],
                barThickness: 40,
                borderWidth: 3,
                borderRadius: 10
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'top'
                }
            }
        }
    });

};

/** Función para renderizar la gráfica de Conversión */
function graphicPurchase(object, test) {

    document.body.querySelector('.graphicPurchaseRender' + test).innerHTML = ``;
    let
        totalDesk = object.withDesk + object.withOutDesk,
        totalMobile = object.withMobile + object.withOutMobile


    const
        canvas = document.createElement('CANVAS');
    canvas.id = `chartPurchase${test}`;
    canvas.classList.add('graphicTableKpi');

    document.body.querySelector('.graphicPurchaseRender' + test).appendChild(canvas);

    const ctx = document.body.querySelector(`#chartPurchase${test}`).getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Desk', `Mobile`],
            datasets: [{
                label: 'Sin VS Con',
                data: [totalDesk, totalMobile], // El primer valor es el valor de la referencia
                borderWidth: 1,
                backgroundColor: ['#ff0700', '#0e2c59'],
                barThickness: 40,
                borderWidth: 3,
                borderRadius: 10
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false,
                    position: 'top'
                }
            }
        }
    });
};

await buildTable('A');
await buildTable('B');

document.body.querySelector('.selectShopper').addEventListener('input', async () => {
    await buildTable('A');
    await buildTable('B');
})

document.body.querySelector('.selectDateInit').addEventListener('input', async () => {
    await buildTable('A');
    await buildTable('B');
})
document.body.querySelector('.selectDateEnd').addEventListener('input', async () => {
    await buildTable('A');
    await buildTable('B');
})

/** Actualizar los valores del filtro */
function updateValuesFilters() {
    /** tomar los valores de los selects */
    filtersValue = {
        Pais: document.body.querySelector('.selectCountry').value,
        Mes: document.body.querySelector('.selectDate').value,
        Categoria: document.body.querySelector('.selectCategory').value,
        Sku: document.body.querySelector('.selectSku').value
    };
};

/** Se filtra por País por Mes y por Categoría */
function filterProcess() {

    /** Nuevo Array  */
    let filterArray = [];

    /** Actualizamos los valores de los filtros  */
    updateValuesFilters();

    /** Empezamos el proceso de filtrado */
    filtersValue.Pais !== "null" && (filterArray = dataGeneralxsku.filter(registry => registry.pais == filtersValue.Pais));

    /** Actualizamos el array para renderizar las gráficas */
    arrayToGraphic = filterArray;

    filtersValue.Categoria !== "null" && (filterArray = filterArray.filter(registry => registry.categoria == filtersValue.Categoria));
    filtersValue.Mes !== "null" && (filterArray = filterArray.filter(registry => registry.Mes == filtersValue.Mes));
    filtersValue.Sku !== "null" && (filterArray = filterArray.filter(registry => registry.sku == filtersValue.Sku));

    /** Actaulimos el array para renderizar la tabla */
    arrayToTable = filterArray;

    createOptionSku(arrayToTable)

};

/** función para creación de lista de SKUS */
function createOptionSku(array) {

    document.body.querySelector('.selectSku').innerHTML = ``;
    document.body.querySelector('.selectSku').innerHTML += `<option value="null">Seleccione SKU</option>`

    array.map(registry => {

        if (registry.sku == "null" || registry.sku == "Null" || registry.sku == "") { return };
        document.body.querySelector('.selectSku').innerHTML += `<option value="${registry.sku}">${registry.sku}</option>`
    })

}


/** ___________________ Constructores _________________ */

/** Función para construir la usabilidad apartir de un array de registros */
function buildUsability(array) {

    let elementToreturn = {
        with: 0,
        withOut: 0,
        diference: 0
    };

    array.map((registry) => {
        elementToreturn.with += registry.conInteraccion;
        elementToreturn.withOut += registry.sinInteraccion;
    })

    elementToreturn.diference = (elementToreturn.with / ((elementToreturn.withOut + elementToreturn.with)) * 100).toFixed(2)
    return elementToreturn;
};

/** Función para construir el engagement apartir de un array de registros */
function buildEngagement(array) {

    let elementToReturn = { with: null, withFormat: null, withOut: null, withOutFormat: null, diference: null, diferenceFormat: null };
    let timeWI = { hours: 0, minutes: 0, seconds: 0 };
    let timeWOI = { hours: 0, minutes: 0, seconds: 0 };

    array.map(registry => {

        let WregistryHour, WregistryMinute, WregistrySec;
        let WOregistryHour, WOregistryMinute, WOregistrySec;

        WregistryHour = parseInt(registry.tiempoConInteraccion.split(":")[0]);
        WregistryMinute = parseInt(registry.tiempoConInteraccion.split(":")[1]);
        WregistrySec = parseInt(registry.tiempoConInteraccion.split(":")[2]);

        WOregistryHour = parseInt(registry.tiempoSinInteraccion.split(":")[0]);
        WOregistryMinute = parseInt(registry.tiempoSinInteraccion.split(":")[1]);
        WOregistrySec = parseInt(registry.tiempoSinInteraccion.split(":")[2]);

        timeWI.hours += WregistryHour * 60 * 60;
        timeWI.minutes += WregistryMinute * 60;
        timeWI.seconds += WregistrySec;

        timeWOI.hours += WOregistryHour * 60 * 60;
        timeWOI.minutes += WOregistryMinute * 60;
        timeWOI.seconds += WOregistrySec;

    });

    elementToReturn.with = Math.ceil((timeWI.hours + timeWI.minutes + timeWI.seconds) / array.length);
    elementToReturn.withFormat = `${parseInt(elementToReturn.with / 60)}:${parseInt(elementToReturn.with % 60)}`;

    elementToReturn.withOut = Math.ceil((timeWOI.hours + timeWOI.minutes + timeWOI.seconds) / array.length);
    elementToReturn.withOutFormat = `${parseInt(elementToReturn.withOut / 60)}:${parseInt(elementToReturn.withOut % 60)}`;

    elementToReturn.diference = parseInt(((elementToReturn.with / elementToReturn.withOut) * 100).toFixed(0));
    elementToReturn.diferenceFormat = `${parseInt(elementToReturn.diference / 60)}:${parseInt(elementToReturn.diference % 60)}`;

    return elementToReturn;
};

/** Función para construir el addToCar apartir de un array de resgistros */
function buildAddToCar(array) {

    let elementToReturn = {
        with: 0,
        withOut: 0,
        diference: null
    };

    array.forEach(registry => {
        if (registry.AddToCartConInteraccion == 0 || registry.AddToCartSinInteraccion == 0) { return }
        elementToReturn.with += parseFloat(registry.AddToCartConInteraccion.replace('%', ''));
        elementToReturn.withOut += parseFloat(registry.AddToCartSinInteraccion.replace('%', ''));
    });

    elementToReturn.with = Math.ceil(elementToReturn.with / array.length);
    elementToReturn.withOut = Math.ceil(elementToReturn.withOut / array.length);
    elementToReturn.diference = ((elementToReturn.with / elementToReturn.withOut) * 100).toFixed(0);

    return elementToReturn;
};

/** Función para construir el purchase apartir de un array de registros */
function buildPurchase(array) {

    let elementToReturn = {
        with: 0,
        withOut: 0,
        diference: 0
    }

    array.forEach(element => {
        elementToReturn.with += element.TransaccionesConInteraccion;
        elementToReturn.withOut += element.TransaccionesSinInteraccion;
    })

    elementToReturn.with = (elementToReturn.with / array.length).toFixed(3);
    elementToReturn.withOut = (elementToReturn.withOut / array.length).toFixed(3);
    elementToReturn.diference = (elementToReturn.with / elementToReturn.withOut * 100).toFixed(0);

    return elementToReturn;
};

/** Función para construir la información del dispositivo */
function buildInfoDevice() {

    let
        elementToCreate = [],
        country = document.body.querySelector('.selectCountry').value,
        countryArray = Object.entries(device).filter(([key, value]) => key == country),
        kpiArray = Object.entries(countryArray[0][1]).filter(([key, value]) => key == kpiActual)


    switch (kpiActual) {

        case "usabilidad":
            elementToCreate.push((kpiArray[0][1].desk / ((kpiArray[0][1].Without_desk + kpiArray[0][1].desk)) * 100).toFixed(2));
            elementToCreate.push((kpiArray[0][1].tablet / ((kpiArray[0][1].Without_tablet + kpiArray[0][1].tablet)) * 100).toFixed(2));
            elementToCreate.push((kpiArray[0][1].mobile / ((kpiArray[0][1].Without_mobile + kpiArray[0][1].mobile)) * 100).toFixed(2));
            break;

        case "duracion_sesion":
            elementToCreate.push(parseInt(((kpiArray[0][1].desk / kpiArray[0][1].Without_desk) * 100).toFixed(0)));
            elementToCreate.push(parseInt(((kpiArray[0][1].tablet / kpiArray[0][1].Without_tablet) * 100).toFixed(0)));
            elementToCreate.push(parseInt(((kpiArray[0][1].mobile / kpiArray[0][1].Without_mobile) * 100).toFixed(0)));
            break;

        case "añadir_al_carrito":
            elementToCreate.push(((kpiArray[0][1].desk / kpiArray[0][1].Without_desk) * 100).toFixed(0));
            elementToCreate.push(((kpiArray[0][1].tablet / kpiArray[0][1].Without_tablet) * 100).toFixed(0));
            elementToCreate.push(((kpiArray[0][1].mobile / kpiArray[0][1].Without_mobile) * 100).toFixed(0));
            break;

        case "conversion":
            elementToCreate.push((kpiArray[0][1].desk / kpiArray[0][1].Without_desk * 100).toFixed(0));
            elementToCreate.push((kpiArray[0][1].tablet / kpiArray[0][1].Without_tablet * 100).toFixed(0));
            elementToCreate.push((kpiArray[0][1].mobile / kpiArray[0][1].Without_mobile * 100).toFixed(0));
            break;
    };

    graphicDevice(elementToCreate)
};


/** Función para construir la estructura de las gráficas */
function buildStructureToGraphics(array) {

    /** La gráfica acepta dos arreglos con valores para renderizar */
    let elementToReturn = {}

    array.map(registry => {
        if (!(registry.Mes in elementToReturn))
            elementToReturn[registry.Mes] = null;
    })

    Object.entries(elementToReturn).forEach(([key, value]) => {
        let
            registry = array.filter(registry => registry.Mes == key)
        elementToReturn[key] = registry
    });

    return elementToReturn;

};



function graphicDevice(values) {

    document.body.querySelector('.containerGraphicDevice').innerHTML = ``;

    const
        canvas = document.createElement('CANVAS');
    canvas.id = "chartDevice";
    canvas.classList.add('graphicTableKpiDevice');

    document.body.querySelector('.containerGraphicDevice').appendChild(canvas);

    const ctx = document.body.querySelector('#chartDevice').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Desk', 'Tablets', 'Mobile'],
            datasets: [{
                label: '',
                data: [values[0], values[1], values[2]],
                backgroundColor: ['#ff8604', '#0082ac', '#ffaf00'],
                hoverOffset: 4,
                barThickness: 80,
                borderWidth: 3,
                borderRadius: 15
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: `Dispositivo por ${kpiActual}`,
                    color: '#0082ac',
                    font: {
                        size: 18
                    },
                }
            }
        }
    });

};





/** _______________ Renderizadores _______________*/










