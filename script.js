
var arrCoins = [];
var arrSelectedCoins = [];
var arrIdSelectedCoins = [];
var IntervalId;

$(() => {
    

    function loadPages(page) {

        spinnerOn("contentContainer");
        clearInterval(IntervalId);

        $.ajax({
            type: "GET",
            url: `${page}.html`,

            success: (result) => {
                $("#contentContainer").html(result);
            },
            error: (error) => {

            },
            complete: (result) => {

                if (page == "homePage") {
                    contentHomePage();
                }
                if (page == "aboutPage") {
                    contentAbout();
                }
                if (page == "liveReport") {
                    contentliveReport();
                }
            }
        })
    }
    loadPages("homePage");

    function contentHomePage() {
    
        $.ajax({
            type: "GET",
            url: "https://api.coingecko.com/api/v3/coins/list",

            success: (result) => {
                arrCoins = result;

            },
            error: (error) => {

            },
            complete: (result) => {

                for (let i = 0; i < 100; i++) {
                    createCard("contentHomePage", arrCoins[i].symbol, arrCoins[i].name, arrCoins[i].id);
                }

                moreInfoBtn();
                checkToggle();
            }
        })
    }


    function contentliveReport() {

        if (arrSelectedCoins.length == 0) {
            alert("There are no coins selected! Please choose coins to display in the graph!");
            loadPages("homePage");
        }
        else {
            spinnerOn("contentLiveReportPage");

            let arrLiveReport1 = [];
            let arrLiveReport2 = [];
            let arrLiveReport3 = [];
            let arrLiveReport4 = [];
            let arrLiveReport5 = [];
            let arrNewLiveReport = [];

            function getCurrencyData() {

                $.ajax({

                    type: "GET",
                    url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${arrSelectedCoins[0]},${arrSelectedCoins[1]},${arrSelectedCoins[2]},${arrSelectedCoins[3]},${arrSelectedCoins[4]}&tsyms=USD`,

                    success: (result) => {

                        if (result.Response === "Error") {
                            clearInterval(IntervalId);
                            alert("There is no data on selected coins, Please choose diffrent coins.");
                            loadPages("homePage");
                        }
                        else {
                            $("#contentLiveReportPage").html(`
                            <div id="chartContainer" style="height: 600px; width: 100%;"</div>
                            `)

                            let dateNow = new Date();
                            let counter = 1;
                            arrNewLiveReport = [];

                            for (let Key in result) {

                                if (counter == 1) {
                                    arrLiveReport1.push({ x: dateNow, y: result[Key].USD });
                                    arrNewLiveReport.push(Key);
                                }
                                if (counter == 2) {
                                    arrLiveReport2.push({ x: dateNow, y: result[Key].USD });
                                    arrNewLiveReport.push(Key);
                                }
                                if (counter == 3) {
                                    arrLiveReport3.push({ x: dateNow, y: result[Key].USD });
                                    arrNewLiveReport.push(Key);
                                }
                                if (counter == 4) {
                                    arrLiveReport4.push({ x: dateNow, y: result[Key].USD });
                                    arrNewLiveReport.push(Key);
                                }
                                if (counter == 5) {
                                    arrLiveReport5.push({ x: dateNow, y: result[Key].USD });
                                    arrNewLiveReport.push(Key);
                                }

                                counter++;
                            }
                            drowGraph();

                        }

                    }
                })
            }

            IntervalId = setInterval(() => {
                getCurrencyData();
            }, 2000);

            function drowGraph() {

                var chart = new CanvasJS.Chart("chartContainer", {
                    exportEnabled: true,
                    animationEnabled: false,

                    title: {
                        text: "Selected CryptoCurrencies price in USD"
                    },
                    axisX: {
                        valueFormatString: "HH:mm:ss",
                    },
                    axisY: {
                        title: "Price in USD",
                        suffix: "$",
                        titleFontColor: "#4F81BC",
                        lineColor: "#4F81BC",
                        labelFontColor: "#4F81BC",
                        tickColor: "#4F81BC",
                        includeZero: true,
                    },
                    toolTip: {
                        shared: true
                    },
                    legend: {
                        cursor: "pointer",
                        itemclick: toggleDataSeries,
                    },
                    data: [{
                        type: "spline",
                        name: arrNewLiveReport[0],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrLiveReport1

                    },
                    {
                        type: "spline",
                        name: arrNewLiveReport[1],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrLiveReport2

                    },
                    {
                        type: "spline",
                        name: arrNewLiveReport[2],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrLiveReport3

                    },
                    {
                        type: "spline",
                        name: arrNewLiveReport[3],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrLiveReport4

                    },
                    {
                        type: "spline",
                        name: arrNewLiveReport[4],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: arrLiveReport5

                    }]

                });

                chart.render();

                function toggleDataSeries(e) {
                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    }
                    else {
                        e.dataSeries.visible = true;
                    }
                    e.chart.render();
                }

            }

        }

    }


    function contentAbout() {

        $("#contentAboutPage").html(`
        
        <div class="row firstdescription">
      
            <div class="col">
            <h1>About this project:</h1>
            <img class="MyPicture" src="/MyImg.jpg" alt="My picture">
            This project was developed for practice purposes. <br>
            The website gives information about virtual currencies and real-time report
            on sellected coins. <br>
            * you may choose up to 5 coins to follow and graph with real time updates.<br>
            * the information is received in real time and updates every 2 minutes. <br>
            </div>
        </div>

        <h1>About me:</h1>
        <div class="row aboutMe">
            <div class="col">My name is Margalit Levkvoits</div>
        </div>
        <div class="row ">
        <div class="col">at the time of this project i am a student in John Bryce</div>
    </div>
      
        <div class="row ">
            <div class="col"><a href="mailto:"margilev@gmail.com">margilev@gmail.com</a></div>
        </div>

        <div class="row">
            <div class="col about">Cell: +972 52-846-3048</div>
        </div>

        <div class="row">
            <div class="col about"><a href="https://github.com/margilev" target="_blank">Github</a></div>
        </div>

        `);
    }

    $("#about").on("click", () => {

        loadPages("aboutPage");

    })

    $("#home").on("click", () => {

        loadPages("homePage");
    })

    $("#liveReport").on("click", () => {
        loadPages("liveReport");
    })


    $("#searchBtn").on("click", () => {

        clearInterval(IntervalId);
        let valSearch = $("#searchCoins").val().toLowerCase();
        let foundCoin;

        for (let i = 0; i < 100; i++) {

            if (valSearch == arrCoins[i].symbol) {
                foundCoin = arrCoins[i];
            }

        }

        if (valSearch == "") {
            loadPages("homePage");
        }

        else {
            if (foundCoin == undefined) {
                alert("Coin is not found!");
            }

            else {
                $("#searchCoins").val("");
                $(".contentContainer .row").html(`
            <div id="contentSearchPage" class="col contentSearchPage">
            </div> 
            `);
                createCard("contentSearchPage", foundCoin.symbol, foundCoin.name, foundCoin.id);
                moreInfoBtn();
                checkToggle();
            }
        }
    });



    function createCard(idE, coinSymbol, coinName, coinId) {
        $(`#${idE}`).append(`
        <div class="card col-sm-3 style="max-width: 18rem;">
        <div class="card-body">
        <h5 class="card-title">${coinSymbol.toUpperCase()}</h5>
        <div class="toggleBtn">
            <label class="switch">
                <input id="${coinId}-toggle" type="checkbox">
                <span class="slider round"></span>
            </label>
        </div>
        <p class="card-text">${coinName}</p>
        <button class="collapsible">More info</button>
        <div class="content">
            <div id=${coinId} class="moreInfo"></div> 
                </div>                                                    
            </div>  
        </div>
`);
        switchToggle(coinId, coinSymbol)
    }

    function getMoreInfo(idE, image, priceUsd, priceEur, priceIls) {

        $(`#${idE}`).html(`
    <div class="col"> <img src=${image}/> </div>
    <div class="col">Price:</div>
    <div class="col">USD: ${priceUsd.toFixed(5)} $</div>
    <div class="col">EUR: ${priceEur.toFixed(5)} €</div>
    <div class="col">ILS: ${priceIls.toFixed(5)} ₪</div>
    `)
    }

    function moreInfoBtn() {

        var coll = document.getElementsByClassName("collapsible");
        var i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                }
                else {
                    content.style.maxHeight = 400 + "px";
                    let coinId = $(this).next().children().attr("id");

                    spinnerOn(coinId);

                    let timeNow = Date.now();
                    let coinBackUp = JSON.parse(localStorage.getItem(coinId));

                    if (coinBackUp != null && (timeNow - coinBackUp.ajaxTime < 120000)) {
                        getMoreInfo(coinId, coinBackUp.image.small, coinBackUp.market_data.current_price.usd, coinBackUp.market_data.current_price.eur, coinBackUp.market_data.current_price.ils);
                    }

                    else {
                        $.ajax({

                            type: "GET",
                            url: `https://api.coingecko.com/api/v3/coins/${coinId}`,

                            success: (result) => {
                                getMoreInfo(result.id, result.image.small, result.market_data.current_price.usd, result.market_data.current_price.eur, result.market_data.current_price.ils);
                            },
                            complete: (result) => {
                                result.responseJSON.ajaxTime = Date.now();
                                localStorage.setItem(result.responseJSON.id, JSON.stringify(result.responseJSON));
                            }
                        })
                    }
                }
            });
        }
    }


    function switchToggle(idE, coinSymbol) {

        $(`#${idE}-toggle`).on("change", () => {

            let newCoinSymbol = coinSymbol.toUpperCase();
            let indexCoinSymbol = arrSelectedCoins.indexOf(newCoinSymbol);
            let indexIdSelectedCoins = arrIdSelectedCoins.indexOf(`${idE}-toggle`);

            if (indexCoinSymbol != -1) {
                arrSelectedCoins.splice(indexCoinSymbol, 1);
                arrIdSelectedCoins.splice(indexIdSelectedCoins, 1);
            }

            else {

                if (arrSelectedCoins.length < 5) {
                    arrSelectedCoins.push(newCoinSymbol);
                    arrIdSelectedCoins.push(`${idE}-toggle`);
                }

                else {

                    $(`#${idE}-toggle`).prop('checked', false);

                    $("#modalWindow").html(`
                    
                    <div id="Modal" class="modal">
                        <div class="modal-content">
                            <span id="close" class="close">&times;</span>
                            <div id="coinContent" class="coinContent">
                            <div class="row modalMessage">
                              <div class="col">Live Report can show up to five coins.</div>
                            </div>
                            <div class="row modalMessage">
                              <div class="col">If you'd like to choose <span class="coinAdd">'${coinSymbol.toUpperCase()}'</span> coin, please replace one of the coins below or close the window to cancel </div>
                            </div>
                        </div>
                    </div>
                    
                    `)

                    $("#Modal").css("display", "block");

                    $("#close").on("click", () => {
                        $("#Modal").css("display", "none");
                    })

                    let counterId = 1;

                    for (let i = 0; i < arrSelectedCoins.length; i++) {

                        $("#coinContent").append(`   
                        <div class="row">
                            <div class="card col" style="width: 18rem;">
                                <div class="card-body">
                                    <h5 class="card-title">${arrSelectedCoins[i]}</h5>
                                    <div class="toggleBtn">
                                        <label class="switch">
                                            <input id="toggle-Choice${counterId}" type="checkbox">
                                            <span class="slider round"></span>
                                        </label>
                                    </div>                                          
                                </div>
                            </div>
                         </div>
                        `);

                        $(`#toggle-Choice${counterId}`).prop('checked', true);

                        $(`#toggle-Choice${counterId}`).on("change", () => {

                            let indexCoinRemove = arrSelectedCoins.indexOf(arrSelectedCoins[i]);
                            let ToggleTofalse = arrIdSelectedCoins[indexCoinRemove];
                            arrSelectedCoins.splice(indexCoinRemove, 1);
                            arrIdSelectedCoins.splice(indexCoinRemove, 1);

                            arrSelectedCoins.push(coinSymbol.toUpperCase());
                            arrIdSelectedCoins.push(`${idE}-toggle`);

                            $("#Modal").css("display", "none");
                            $(`#${ToggleTofalse}`).prop('checked', false);
                            checkToggle();
                        })
                        counterId++;
                    }

                }

            }

        })

    }

    function checkToggle() {

        for (let i = 0; i < arrIdSelectedCoins.length; i++) {
            $(`#${arrIdSelectedCoins[i]}`).prop('checked', true);
        }
    }

    function spinnerOn(idE) {
        $(`#${idE}`).html(`
        <div class="text-center">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
    </div> 
    `)
    };


});
window.onscroll = function () {
    scrollFunction()
};


function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrolltopbutton").style.display = "block";
    } else {
        document.getElementById("scrolltopbutton").style.display = "none";
    }
}


function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}