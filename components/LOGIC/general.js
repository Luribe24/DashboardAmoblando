function renderLoading() {

    let kpiContainer = document.body.querySelectorAll('.containerKPIS')
    for (let i = 0; i < kpiContainer.length; i++) {
        let kpiChildren = kpiContainer[i].children

        for (let i = 0; i < kpiChildren.length; i++) {
            let kpis = kpiChildren[i]
            kpis.innerHTML = 'Cargando...'
        }
    }
}

/** Variables */
let
    filtersValue = {},
    arrayToGraphic = [],
    arrayToTable = [],
    // urlConsult = `https://viewer.mudi.com.co:3589/api/mudiv1/`
    urlConsult = `http://localhost:3589/api/mudiv1/`


    async function requestUsers(myTest,) {

        let MyBody = {
            shopper: document.body.querySelector('.selectShopper').value,
            test: myTest,
            dateInit: document.body.querySelector('.selectDateInit').value,
            dateEnd: document.body.querySelector('.selectDateEnd').value,
        }
    
        const request = await fetch(`${urlConsult}usersRequestPixel`, {
            method: 'POST',
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(MyBody)
        })
    
        const response = await request.json();
        const data = await response[0].totalUsers;
        return data
   
    };


async function requestUsability(myTest, myEventView, myInteraction, myDevice) {

    let MyBody = {
        shopper: document.body.querySelector('.selectShopper').value,
        test: myTest,
        viewEvent: myEventView,
        interaction: myInteraction,
        deviceType: myDevice,
        dateInit: document.body.querySelector('.selectDateInit').value,
        dateEnd: document.body.querySelector('.selectDateEnd').value,
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

async function requestEngagement(myTest, myEventView, myInteraction, myDevice) {

    let MyBody = {
        shopper: document.body.querySelector('.selectShopper').value,
        test: myTest,
        viewEvent: myEventView,
        interaction: myInteraction,
        deviceType: myDevice,
        dateInit: document.body.querySelector('.selectDateInit').value,
        dateEnd: document.body.querySelector('.selectDateEnd').value,
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
        deviceType: myDevice,
        dateInit: document.body.querySelector('.selectDateInit').value,
        dateEnd: document.body.querySelector('.selectDateEnd').value,
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

async function requestPurchase(myTest, purchase, myDevice, myInteraction) {

    let MyBody = {
        shopper: document.body.querySelector('.selectShopper').value,
        test: myTest,
        purchase: purchase,
        deviceType: myDevice,
        interaction: myInteraction,
        dateInit: document.body.querySelector('.selectDateInit').value,
        dateEnd: document.body.querySelector('.selectDateEnd').value,
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

        users:{
            totaUser: null,
        },

        usability: {
            withDesk: null,
            withMobile: null,
            withOutDesk: null,
            withOutMobile: null,
        },
        engagement: {
            withDesk: null,
            withMobile: null,
            withOutDesk: null,
            withOutMobile: null,
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
        results.users.totaUser              = await requestUsers(test),

        results.usability.withDesk          = await requestUsability(test, '>', '>', 'desk'),
        results.usability.withMobile        = await requestUsability(test, '>', '>', 'mobile'),
        results.usability.withOutDesk       = await requestUsability(test, '>', '=', 'desk'),
        results.usability.withOutMobile     = await requestUsability(test, '>', '=', 'mobile'),

        results.engagement.withDesk         = await requestEngagement(test, '>', '>', 'desk'),
        results.engagement.withMobile       = await requestEngagement(test, '>', '>', 'mobile'),
        results.engagement.withOutDesk      = await requestEngagement(test, '>', '=', 'desk'),
        results.engagement.withOutMobile    = await requestEngagement(test, '>', '=', 'mobile'),

        results.addToCar.withDesk           = await requestAddToCar(test, '>', '>', '>', 'desk'),
        results.addToCar.withMobile         = await requestAddToCar(test, '>', '>', '>', 'mobile'),
        results.addToCar.withOutDesk        = await requestAddToCar(test, '>', '=', '>', 'desk'),
        results.addToCar.withOutMobile      = await requestAddToCar(test, '>', '=', '>', 'mobile'),

        results.purchase.withDesk           = await requestPurchase(test, '>', 'desk','>'),
        results.purchase.withMobile         = await requestPurchase(test, '>', 'mobile','>'),
        results.purchase.withOutDesk        = await requestPurchase(test, '>', 'desk','='),
        results.purchase.withOutMobile      = await requestPurchase(test, '>', 'mobile','=')


    )

    test == 'B' && (

        results.users.totaUser              = await requestUsers(test),
        results.usability.withOutDesk       = await requestUsability(test, '=', '=', 'desk'),
        results.usability.withOutMobile     = await requestUsability(test, '=', '=', 'mobile'),

        results.engagement.withOutDesk      = await requestEngagement(test, '=', '=', 'desk'),
        results.engagement.withOutMobile    = await requestEngagement(test, '=', '=', 'mobile'),

        results.addToCar.withOutDesk        = await requestAddToCar(test, '=', '=', '>', 'desk'),
        results.addToCar.withOutMobile      = await requestAddToCar(test, '=', '=', '>', 'mobile'),

        results.purchase.withOutDesk        = await requestPurchase(test, '>', 'desk','='),
        results.purchase.withOutMobile      = await requestPurchase(test, '>', 'mobile','=')
    )
    return results;

   
};

/** Suma de Engagement */
function plusTime(object) {

    let structure = {
        withDesk: null,
        withMobile: null,
        withOutDesk: null,
        withOutMobile: null,
        totalWith: null,
        totalWithout: null

    }

    structure.withDesk = object.withDesk == null ? [0, 0, 0] : object.withDesk.split(':'),
        structure.withMobile = object.withMobile == null ? [0, 0, 0] : object.withMobile.split(':'),
        structure.withOutDesk = object.withOutDesk == null ? [0, 0, 0] : object.withOutDesk.split(':'),
        structure.withOutMobile = object.withOutMobile == null ? [0, 0, 0] : object.withOutMobile.split(':')


    structure.withDesk[1] = structure.withDesk == 0 ? 0 : parseInt(structure.withDesk[1]) * 60
    structure.withDesk = parseInt(structure.withDesk[0]) + parseInt(structure.withDesk[1]) + parseInt(structure.withDesk[2])

    structure.withMobile[1] = structure.withMobile == 0 ? 0 : parseInt(structure.withMobile[1]) * 60
    structure.withMobile = parseInt(structure.withMobile[0]) + parseInt(structure.withMobile[1]) + parseInt(structure.withMobile[2])

    structure.withOutDesk[1] = structure.withOutDesk == 0 ? 0 : parseInt(structure.withOutDesk[1]) * 60
    structure.withOutDesk = parseInt(structure.withOutDesk[0]) + parseInt(structure.withOutDesk[1]) + parseInt(structure.withOutDesk[2])

    structure.withOutMobile[1] = structure.withOutMobile == 0 ? 0 : parseInt(structure.withOutMobile[1]) * 60
    structure.withOutMobile = parseInt(structure.withOutMobile[0]) + parseInt(structure.withOutMobile[1]) + parseInt(structure.withOutMobile[2])

    structure.totalWith = structure.withDesk + structure.withMobile;
    structure.totalWithout = structure.withOutDesk + structure.withOutMobile;

    return (structure);

}

/** Función para construir la tabla de datos generales */
async function buildTable(test) {

    const results   = await allResultsRequest(test);
    const totalTime = plusTime(results.engagement);

    test == 'A' && (document.body.querySelector(`.Users${test}`).innerHTML = `Usuarios: <span class="">${results.users.totaUser}</span>`);
    test == 'B' && (document.body.querySelector(`.Users${test}`).innerHTML = `Usuarios: <span class="">${results.users.totaUser}</span>`);
    /** Imprimiendo la usabilidad Con y Sin interacción */
    const withI = (results.usability.withDesk + results.usability.withMobile);
    const withOutI = (results.usability.withOutDesk + results.usability.withOutMobile);
    const diferencia = (withI / withOutI * 100).toFixed(0);
   
    test == 'A' && (document.body.querySelector(`.usabilityWith${test}`).innerHTML = `Con interacción: <span class="valorKPI">${withI}</span>`);
    document.body.querySelector(`.usabilityWithOut${test}`).innerHTML = `Sin interacción: <span class="valorKPI">${withOutI}</span>`;
    test == 'A' && (document.body.querySelector(`.diferenceUsability${test}`).innerHTML = `% Diferencia : ${diferencia}%`);

    /** Imprimiendo la engagement Con y Sin interacción */
    test == 'A' && (document.body.querySelector(`.engagementWith${test}`).innerHTML = `Con interacción: <span class="valorKPI">${Math.floor(totalTime.totalWith / 60)} min ${totalTime.totalWith % 60} seg</span>`);
    document.body.querySelector(`.engagementWithOut${test}`).innerHTML = `Sin interacción: <span class="valorKPI">${Math.floor(totalTime.totalWithout / 60)} min ${totalTime.totalWithout % 60} seg</span>`;
    test == 'A' && (document.body.querySelector(`.diferenceEngagement${test}`).innerHTML = `% Diferencia : ${parseInt((totalTime.totalWith / totalTime.totalWithout) * 100).toFixed(0)}%`);

    /** Impirmiendo el add To Car Con y Ain interacción */
    const withIAddToCart = (results.addToCar.withDesk + results.addToCar.withMobile);
    const withOutIAddToCart = (results.addToCar.withOutDesk + results.addToCar.withOutMobile);
    const diferenciaAddToCart = (withIAddToCart / withOutIAddToCart * 100).toFixed(0);

    test == 'A' && (document.body.querySelector(`.addToCarWith${test}`).innerHTML = `Con interacción: <span class="valorKPI">${withIAddToCart}(${(withIAddToCart / withI).toFixed(2)}%)</span>`);
    document.body.querySelector(`.addToCarWithOut${test}`).innerHTML = `Sin interacción: <span class="valorKPI">${withOutIAddToCart}(${(withOutIAddToCart / withOutI).toFixed(2)}%)</span>`;
    test == 'A' && (document.body.querySelector(`.diferenceAddToCar${test}`).innerHTML = `% Diferencia : ${diferenciaAddToCart}%`);

    /** Imprimiendo la conversión Con y Sin  interacción */
    const withIPurchase = (results.purchase.withDesk + results.purchase.withMobile);
    const withOutIPurchase = (results.purchase.withOutDesk + results.purchase.withOutMobile);
    const diferenciaPurchase = (withIPurchase / withOutIPurchase * 100).toFixed(0);

    test == 'A' && (document.body.querySelector(`.purchaseWith${test}`).innerHTML = `Con interacción: <span class="valorKPI">${withIPurchase}(${(withIPurchase / withI).toFixed(2)}%)</span>`);
    document.body.querySelector(`.purchaseWithOut${test}`).innerHTML = `Sin interacción: <span class="valorKPI">${withOutIPurchase}(${(withOutIPurchase / withOutI).toFixed(2)}%)</span>`;
    test == 'A' && (document.body.querySelector(`.diferencePurchase${test}`).innerHTML = `% Diferencia : ${diferenciaPurchase}%`);

    /** Renderizar la gráfica de usabilidad */

    graphicUsability(results.usability, test);

    /** Renderizar la gráfica de Engagement */
    graphicEngagement(totalTime, test);

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

    document.body.querySelector(`.graphicEngagementRender${test}`).innerHTML = ``;
    const structure = {
        desk: object.withDesk + object.withOutDesk,
        mobile: object.withMobile + object.withOutMobile
    }

    const
        canvas = document.createElement('CANVAS');
    canvas.id = `chartEngagement${test}`;
    canvas.classList.add('graphicTableKpi');

    document.body.querySelector('.graphicEngagementRender' + test).appendChild(canvas);

    const ctx = document.body.querySelector(`#chartEngagement${test}`).getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Desk', `Mobile`],
            datasets: [{
                label: 'Desk VS Mobile',
                data: [structure.desk, structure.mobile], // El primer valor es el valor de la referencia
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

await buildTable('A');
await buildTable('B');

document.body.querySelector('.selectShopper').addEventListener('input', async () => {
    renderLoading()
    await buildTable('A');
    await buildTable('B');
})

document.body.querySelector('.selectDateInit').addEventListener('input', async () => {
     renderLoading()
    await buildTable('A');
    await buildTable('B');
})
document.body.querySelector('.selectDateEnd').addEventListener('input', async () => {
     renderLoading()
    await buildTable('A');
    await buildTable('B');
})


