// Go back to the main page
function goBack() {
    sessionStorage.clear(); // Clear all session storage data
    window.location.href = "index.html";
}

// Slide between pages (0 = Main Page, 1 = Page 1, 2 = Page 2)
function showPageCart(page, id) {
    $(".listcard").css('background-color', 'white');
    const pages = [
        $('#category')[0],
        $('#item')[0]
    ];

    if (page === 0) {
        $('.cardHeader').addClass('hidden');
        $('.categoryList').addClass("hidden");
    }
    if (page === 1) {
        $('#category' + id).removeClass("hidden");
        $('.cardHeader').removeClass('hidden');
    }

    // Slide pages horizontally
    pages.forEach((p, index) => {
        const offset = (index - page) * 100;
        $(p).css({
            'transform': `translateX(${offset}%)`
        });
    });

}


function loadItem(data) {

    var i = 0;
    var total = 0;
    var html = "";
    const description = JSON.parse(data);
    if (description.length > 0) {

        description.forEach(item => {
            total++;
            // var data = JSON.parse(jsonResponse);

            var price = item.price;
            var totprice = item.price * item.count;

            html = html + '<div class="itemList" id="item-' + item.id + '">';
            html = html + '<div class="row justify-content-center align-items-center">';
            html = html + '<div class="col-md-1 my-auto">';
            html = html + '<a href="#!" onclick="deleteitem(this)" id="del-' + item.id + '" class="text-danger"> ';
            html = html + '<i class="fa fa-trash fs-1"></i></a> ';
            html = html + '</div>';

            html = html + '<div class="col-md-2 px-0">';
            html = html + '<img src="' + item.url + '"';
            html = html + 'class="img-fluid rounded-3">';
            html = html + '</div>';
            html = html + '<div class="col-md-5 my-auto">';
            html = html + '<h5 class="text-primary hidden" id="class-' + item.id + '">' + item.item + '</h5>';
            html = html + '<h5 style="font-size: 2rem!important" class="text-primary" id="details-' + item.id + '">' + item.details + '</h5>';
            html = html + '<h6 style="display:none;" class="text-muted" id="price-' + item.id + '">RM ' + parseFloat(price).toFixed(2) + '</h6>';
            html = html + '<h6 style="font-size: 1.5rem!important" class="mb-0 totPrice" id="totPrice-' + item.id + '">RM ' + parseFloat(totprice).toFixed(2) + '</h6>';
            if (item.item == "Rice") {
                html = html + '<div class="form-check mt-3 d-flex align-items-center gap-2"><input class="form-check-input" type="checkbox" value="" id="checkHalf-' + item.id + '" onclick="toggleCheck(this)">';
                html = html + '<label class="form-check-label " for="defaultCheck1">Half Rice</label></div>';
                html = html + '<div class="form-check mt-3 d-flex align-items-center gap-2"><input class="form-check-input" type="checkbox" value="" id="checkBrown-' + item.id + '" onclick="toggleCheckBrown(this)">';
                html = html + '<label class="form-check-label " for="defaultCheck1">Brown Rice</label></div>';
            }
            html = html + '</div>';
            html = html + '<div class="col-md-3 d-flex">';
            html = html + '<button data-mdb-button-init data-mdb-ripple-init id="' + item.id + '" data-name="' + item.item + '" ';
            html = html + 'class="btn border h-0 btn-link px-0"';
            html = html + 'style="height:100px; width:50px; border-right: 0!important;"';
            html = html + 'onclick="minusQty(this)">';
            html = html + '<i class="fa fa-minus"></i>';
            html = html + '</button>';

            html = html + '<input min="1" name="quantity" id="qty-' + item.id + '" value="' + item.count + '" ';
            html = html + 'style="height:100px; width:80px;border-radius: 0; font-size: 2.25rem !important;"';
            html = html + 'type="number" class="form-control " />';

            html = html + '<button data-mdb-button-init data-mdb-ripple-init id="' + item.id + '" data-name="' + item.item + '"  ';
            html = html + 'class="btn border btn-link px-0" ';
            html = html + 'style="height:100px; width:50px;border-left: 0!important;"';
            html = html + 'onclick="addQty(this)">';
            html = html + '<i class="fa fa-plus"></i>';
            html = html + '</button>';
            html = html + '</div>';
            html = html + '</div>';
            html = html + '<hr class="my-4">';
            html = html + '</div>'



        });
    }
    $('#detectedlist').append(html);


    calcFinalAmt();
    $("#totalitem").html(total + " item");
}

async function loadCategory() {
    var html = "";
    var category = [];
    var categoryName = [];
    const apiUrl = 'http://163.50.55.62:5000/processCategoryGET';
    //const apiUrl = 'http://localhost:5000/processCategoryGET';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        $.each(data, function (key, value) {
            category.push(value.id);
            categoryName.push(value.category);

            html = html + '<a class="col-lg-6 col-md-6 text-decoration-none" href="#" onclick="showPageCart(1, this.id)" id="' + value.id + '">';
            html = html + '<div class="card listcard mb-3 p-3" id="category-' + value.category + '" ><img src="' + value.url + '" class="img-fluid rounded-3" style="height:200px">';

            html = html + '<div class="my-auto"> ';
            // html = html + '<h5 class="text-primary">' + value.item + '</h5> ';
            html = html + '<h6 class="text-primary">' + value.category + '</h6>';
            html = html + '</div>';
            html = html + '</div>';
            html = html + '</a>';

        });

        $('#list-category').html(html);
        console.log(category);
        loadAll(category, categoryName);

    } catch (error) {

        showCustomAlert('Database Fetch Error:' + error, 'error');
    }
}

async function loadAll(category, categoryName) {
    var html = "";
    const apiUrl = 'http://163.50.55.62:5000/testprocessGET';
    //const apiUrl = 'http://localhost:5000/processGET';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        var i = 0;
        category.forEach(group => {
            html += `<div class="row hidden categoryList" id="category${group}"><h4 class="text-uppercase mt-4">${categoryName[i]}</h4>`;

            const filteredItems = data.filter(item => item.category === group.toString());
            console.log(filteredItems);

            $.each(filteredItems, function (key, value) {

                var price = value.price;
                var unit = value.unit;

                if (unit != "" && unit != null) {
                    unit = '(per ' + value.unit + ')';
                } else {
                    unit = '';
                }

                if (group == 2) {
                    html = html + '<a class="col-lg-4 col-md-6 text-decoration-none" href="#" onclick="addItem(this.id)" id="add-' + value.item + '" data-id= ' + value.id + ' data-price=' + parseFloat(price).toFixed(2) + ' data-url="' + value.url + '" data-details="' + value.details + '">';
                } else {
                    html = html + '<a class="col-lg-6 col-md-6 text-decoration-none" href="#" onclick="addItem(this.id)" id="add-' + value.item + '" data-id= ' + value.id + ' data-price=' + parseFloat(price).toFixed(2) + ' data-url="' + value.url + '" data-details="' + value.details + '">';
                }
                html = html + '<div class="card listcard mb-3 p-3" id="card-' + value.item + '" ><img src="' + value.url + '" class="img-fluid rounded-3" style="height:200px">';

                if (group != 1) {
                    html = html + '<div class="my-auto" style="min-height:150px !important"> ';
                } else {
                    html = html + '<div class="my-auto"> ';
                }
                // html = html + '<h5 class="text-primary">' + value.item + '</h5> ';
                html = html + '<h6 class="text-primary">' + value.details + '</h6>';
                html = html + '<h4 class="text-muted">' + value.translate + '</h4>';
                html = html + '<h6 class="text-muted" style="font-size:1.5rem !important">RM ' + parseFloat(price).toFixed(2) + '<span style="font-size: large;"> ' + unit + ' </span></h6>';
                html = html + '</div>';
                html = html + '</div>';
                html = html + '</a>';

            });

            html += `</div>`; // Close group row
            i++;
        });


        $('#list-item').html(html);


    } catch (error) {

        showCustomAlert('Database Fetch Error:' + error, 'error');
    }
}

async function loadAllforTablet() {
    var html = "";
    const apiUrl = 'http://163.50.55.62:5000/processTabletGET';
    //const apiUrl = 'http://localhost:5000/processTabletGET';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        var i = 0;

        html += `<div class="row hidden categoryList" id="category0"><h4 class="text-uppercase mt-4">CANTEEN ITEM</h4>`;




        $.each(data, function (key, value) {

            var price = value.price;
            var unit = value.unit;

            if (unit != "" && unit != null) {
                unit = '(per ' + value.unit + ')';
            } else {
                unit = '';
            }


            html = html + '<a class="col-lg-4 col-md-6 text-decoration-none" href="#" onclick="addItem(this.id)" id="add-' + value.item + '" data-id= ' + value.id + ' data-price=' + parseFloat(price).toFixed(2) + ' data-url="' + value.url + '" data-details="' + value.details + '">';

            html = html + '<div class="card listcard mb-3 p-3" id="card-' + value.item + '" ><img src="' + value.url + '" class="img-fluid rounded-3" style="height:200px">';


            html = html + '<div class="my-auto" style="min-height: 100px!important;"> ';

            // html = html + '<h5 class="text-primary">' + value.item + '</h5> ';
            html = html + '<h6 class="text-primary" style="font-size:20px!important">' + value.details + '</h6>';
            html = html + '<h4 class="text-muted">' + value.translate + '</h4>';
            html = html + '<h6 class="text-muted" style="font-size:1.5rem !important">RM ' + parseFloat(price).toFixed(2) + '<span style="font-size: large;"> ' + unit + ' </span></h6>';
            html = html + '</div>';
            html = html + '</div>';
            html = html + '</a>';

        });


        i++;



        $('#list-item').html(html);


    } catch (error) {

        showCustomAlert('Database Fetch Error:' + error, 'error');
    }
}



function addItem(id) {
    var item = (id).replace('add-', '');
    var isExist = false;
    var price = $("#" + id).attr("data-price");
    var itemid = $("#" + id).attr("data-id");
    var url = $("#" + id).attr("data-url");
    var details = $("#" + id).attr("data-details");

    $('.itemList').each(function () {
        var checkid = (this.id).replace('item-', '');
        var checkitem = $("#class-" + checkid).html();
        if (checkitem == item) {
            isExist = true;
            return false
        }

    });

    if (isExist == true) {
        showCustomAlert('Item already added! ', 'warning');
        return false
    } else {
        $("#card-" + item).css('background-color', 'lightgrey');

    }

    $("#card-" + item).toggleClass('highlight');
    var i = 0;
    var total = $("#totalitem").html()
    total = (total).replace('items', '');
    total = parseFloat(total) + 1;


    data = [{
        "id": itemid,
        "item": item,
        "count": 1,
        "price": price,
        "url": url,
        "details": details
    }]

    loadItem(JSON.stringify(data));
    calcFinalAmt();
    $("#totalitem").html(total + " item");
    //$('#modal-addon').modal('hide');

}


function openTngQR() {
    const getPC = window.systemInfo.getPCName();
    $('#mmestar').css('display', 'none');
    $('#nfcImg').css('display', 'block');

    //Testing const getPC = "MME-DT0244";

    /* MME55847 Comment Out - Ori
    if (getPC == "MME-DT0244" || getPC == "MME-DT0245" || getPC == "MME-DT0249") {
        document.getElementById('nfcImg').src = "images/QR.PNG"; 
    }

    else {
        document.getElementById('nfcImg').src = "images/QR2.PNG";
    }
    */

    /*  // MME55847 13Feb26
        // Choose which file to show (adjust if you want QR1 on some PCs)
        const qrFile =
            (getPC === "MME-DT0244" || getPC === "MME-DT0245" || getPC === "MME-DT0249")
            ? "QR.PNG"
            : "QR2.PNG";
        // MME55847 13Feb26 End
    */
    // MME55847 02Apr26
    const TERMINALS = {
        "MME-DT0244": { name: "Terminal 1", qr: "Terminal 1 QR (3092).jpeg" },
        "MME-DT0245": { name: "Terminal 2", qr: "Terminal 2 QR (2986).jpeg" },
        "MME-DT0246": { name: "Terminal 3", qr: "Terminal 3 QR (3089).jpeg" },
        "MME-DT0247": { name: "Terminal 4", qr: "Terminal 4 QR (2001).jpeg" },
        "MME-DT0248": { name: "Terminal 5", qr: "Terminal 5 QR (3008).jpeg" },
        "MME-DT0249": { name: "Terminal 6", qr: "Terminal 6 QR (3091).jpeg" }
    };

    const terminal = TERMINALS[getPC];
    // if PC name not equal to any terminal, will return terminal 1 QR img
    const qrFile = terminal
        ? terminal.qr
        : "Terminal 1 QR (3092).jpeg";

    if (!terminal) {
        console.error(`[TNG QR] Unknown terminal: ${getPC}`);
        //return; // will back to cart page
    }
    // MME55847 02Apr26 End

    // MME55847 13Feb26
    // ✅ IMPORTANT: no require() here
    // ✅ IMPORTANT: match exact filename case on disk (QR2.png, not QR2.PNG)
    document.getElementById('nfcImg').src =
        window.systemInfo.getResourceUrl(`images/${qrFile}`);

    //console.log(document.getElementById('nfcImg').src);
    //console.log("[TNG QR] ", getPC, " - ", terminal?.name," - ", qrFile," - ",document.getElementById('nfcImg').src);
    // MME55847 13Feb26 End

    $("#paymenttype").val("ewallet");
    $('#btn-eWallet').css('display', 'block');

    proceedPay();
}

function openStarQR() {
    $('#nfcImg').css('display', 'none');
    $('#mmestar').css('display', 'block');
    $('#btn-eWallet').css('display', 'none');

    generateQRCode();

    $("#paymenttype").val("mmestar");


    proceedPay();
}


function showPayAlert(message, icon = 'success') {
    //disable first during UAT
    //Integration of MMEStar QR Method
    Swal.fire({
        title: 'Please Choose payment option',
        html: `
    <button id="tngBtn" class="swal2-confirm swal2-styled" style="background-color:#ffc107; margin:5px; font-size:2.5rem">TnG/eWallet</button>
    <button id="starBtn" class="swal2-confirm swal2-styled" style="background-color:#3085d6; font-size:2.5rem; margin:5px;">MME-Star Wallet</button>
    `,
        showConfirmButton: false,
        showCancelButton: false,
        didOpen: () => {
            document.getElementById('tngBtn').addEventListener('click', () => {
                Swal.close();
                openTngQR();
            });
            document.getElementById('starBtn').addEventListener('click', () => {
                Swal.close();
                openStarQR();
            });
        }
    });
    /**/

    // Enable it for only TNG Payment Method
    //openTngQR();

}


function proceedPay() {
    var finalAmt = $("#finalAmt").html().replace('RM', '');


    if (parseFloat(finalAmt) > 0) {

        $("#paynote").html("RM " + finalAmt);
        checkReader();


    } else {
        // alert("Amount Cannot be 0, Please Rescan")
        showCustomAlert('Amount Cannot be 0, Please Rescan or add item!', 'warning');
    }



}


function toggleCheck(element) {
    var totprice;
    var id = (element.id).replace('checkHalf-', '');
    var price = parseFloat($("#price-" + id).html().replace('RM', ''));
    var checkboxBrown = $('#checkBrown-' + id);

    console.log("price:" + price);
    if (element.checked) {
        if (checkboxBrown.is(':checked')) {
            totprice = 1.00;
        } else {
            totprice = 0.4;
        }

    } else {
        if (checkboxBrown.is(':checked')) {
            totprice = 1.30;
        } else {
            totprice = 0.7;
        }

    }
    totprice = parseFloat($("#qty-" + id).val()).toFixed(2) * (totprice);

    $("#totPrice-" + id).html("RM " + totprice.toFixed(2));


    calcFinalAmt();

}
function toggleCheckBrown(element) {
    var totprice;
    var id = (element.id).replace('checkBrown-', '');
    var price = parseFloat($("#price-" + id).html().replace('RM', ''));
    var checkboxHalf = $('#checkHalf-' + id);

    console.log("price:" + price);
    if (element.checked) {
        if (checkboxHalf.is(':checked')) {
            totprice = 1.00;
        } else {
            totprice = 1.30;
        }

    } else {
        if (checkboxHalf.is(':checked')) {
            totprice = 0.40;
        } else {
            totprice = 0.70;
        }

    }
    totprice = parseFloat($("#qty-" + id).val()).toFixed(2) * (totprice);

    $("#totPrice-" + id).html("RM " + totprice.toFixed(2));


    calcFinalAmt();

}



function addQty(element) {
    var totprice = 0;
    var type = $("#" + element.id).attr("data-type");



    element.parentNode.querySelector("input[type=number]").stepUp();


    var item = $("#" + element.id).attr("data-name");
    var price = $("#price-" + element.id).html().replace('RM', '');

    if (item == "Rice") {

        var checkboxHalf = $('#checkHalf-' + element.id);
        var checkboxBrown = $('#checkBrown-' + element.id);
        if (checkboxBrown.is(':checked')) {
            if (checkboxHalf.is(':checked')) {
                totprice = 1.00;
            } else {
                totprice = 1.30;
            }

        } else {
            if (checkboxHalf.is(':checked')) {
                totprice = 0.40;
            } else {
                totprice = 0.70;
            }

        }
    } else {
        totprice = price;
    }


    totprice = parseFloat(totprice) * (parseFloat($("#qty-" + element.id).val()));

    $("#totPrice-" + element.id).html("RM " + parseFloat(totprice).toFixed(2));


    calcFinalAmt();

}

function minusQty(element) {
    var totprice = 0;
    var type = $("#" + element.id).attr("data-type");



    element.parentNode.querySelector("input[type=number]").stepDown();


    var item = $("#" + element.id).attr("data-name");
    var price = $("#price-" + element.id).html().replace('RM', '');

    if (item == "Rice") {

        var checkboxHalf = $('#checkHalf-' + element.id);
        var checkboxBrown = $('#checkBrown-' + element.id);
        if (checkboxBrown.is(':checked')) {
            if (checkboxHalf.is(':checked')) {
                totprice = 1.00;
            } else {
                totprice = 1.30;
            }

        } else {
            if (checkboxHalf.is(':checked')) {
                totprice = 0.40;
            } else {
                totprice = 0.70;
            }

        }
    } else {
        totprice = price;
    }


    totprice = parseFloat(totprice) * (parseFloat($("#qty-" + element.id).val()));

    $("#totPrice-" + element.id).html("RM " + parseFloat(totprice).toFixed(2));


    calcFinalAmt();

}



function deleteitem(element) {
    // Show the confirmation dialog
    // var result = confirm("Are you sure you want to proceed?");
    // if (result) {
    //     var id = (element.id).replace('del-', '');
    //     $('#item-' + id).remove();
    //     calcFinalAmt();
    // } else {
    //     return false;
    // }


    Swal.fire({
        title: 'Confirmation',
        text: "Are you sure you to proceed?!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.isConfirmed) {
            var id = (element.id).replace('del-', '');
            $('#item-' + id).remove();
            calcFinalAmt();
        }
    })




}

function calcFinalAmt() {

    var finalAmt = 0;
    $('.totPrice').each(function (index) {

        finalAmt = parseFloat($(this).html().replace('RM', '')) + finalAmt;


    });
    $("#finalAmt").html("RM " + parseFloat(finalAmt).toFixed(2));
}

// Handle Payment Submission

function formatRinggit(amount) {
    const ringgit = Math.floor(amount);
    const sen = Math.round((amount - ringgit) * 100);

    let result = '';

    if (ringgit > 0) {
        result += `${ringgit} ringgit`;
    }

    if (sen > 0) {
        result += ringgit > 0 ? ` and ${sen} sen` : `${sen} sen`;
    }

    return result || '0 ringgit';
}




function speak() {
    const amount = $('#paynote').text();
    let formattedAmount = formatRinggit(parseFloat(amount.replace('RM', '')));

    let isModalOpen = () => $('#modal-pay').is(':visible'); // Replace with your actual modal ID

    function repeatSpeech() {
        if (!isModalOpen()) {
            speechSynthesis.cancel(); // Stop speaking if modal is closed
            return;
        }

        const voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
            // Voices not loaded yet, try again shortly
            setTimeout(repeatSpeech, 100);
            return;
        }

        const englishUtterance = new SpeechSynthesisUtterance(`Please pay ${formattedAmount}`);
        const malayUtterance = new SpeechSynthesisUtterance(`Sila Bayar ${formattedAmount}`);

        // Choose a voice (adjust index or filter by language)
        englishUtterance.voice = voices[5];
        malayUtterance.voice = voices[9];

        // Chain the utterances
        englishUtterance.onend = () => {
            if (isModalOpen()) {
                speechSynthesis.speak(malayUtterance);
            }
        };

        malayUtterance.onend = () => {

            if (isModalOpen()) {
                setTimeout(() => {
                    repeatSpeech(voices); // Delay before repeating
                }, 5000);
            }

        };

        speechSynthesis.speak(englishUtterance);
    }

    // Ensure voices are loaded before starting
    if (speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = repeatSpeech;
    } else {
        repeatSpeech();
    }
}




$("#modal-pay").on('hide.bs.modal', function () {
    document.getElementById('pay-container').style.display = 'flex';
    const countdownDisplay = document.getElementById('timer2');
    countdownDisplay.textContent = 30;
    //stopreader();
});


async function checkReader() {
    var paymenttype = $("#paymenttype").val();
    const countdownDisplay = document.getElementById('timer2');

    var modal = new bootstrap.Modal(document.getElementById('modal-pay'), {
        backdrop: 'static',
        keyboard: false
    });
    modal.show();

    // $('#modal-pay').modal('show');

    setTimeout(() => {
        speak(); // Trigger speech after modal is shown
    }, 300);


    try {

        // Step 2: Start Countdown (20 seconds)
        let timeLeft = 30;
        let counter = 0;
        if (paymenttype == "mmestar") {
            timeLeft = 30;
        }
        const countdownInterval = setInterval(async () => {
            countdownDisplay.textContent = timeLeft;


            if ($("#modal-pay").is(":hidden")) {
                clearInterval(countdownInterval);
            }

            timeLeft--;
            counter++;


            if (paymenttype === "mmestar" && counter % 5 === 0) {
                var status = await checkTransactionStatus();
                if (status == "Success") {
                    clearInterval(countdownInterval);
                    $('#modal-pay').modal('hide');
                    saveRecord();
                } else if (status != "ERROR") {
                    showCustomAlert(status, "error");
                    clearInterval(countdownInterval);
                    $('#modal-pay').modal('hide');
                }
            }

            // Auto-hide modal if countdown reaches 0
            if (timeLeft < 0) {
                if (paymenttype == "mmestar") {
                    var status = await checkTransactionStatus();
                    if (status == "Success") {
                        clearInterval(countdownInterval);
                        saveRecord();
                        $('#modal-pay').modal('hide');
                    } else {
                        clearInterval(countdownInterval);
                        $('#modal-pay').modal('hide');
                        showCustomAlert('Payment failed. Please try again.', "error");
                    }
                } else {
                    clearInterval(countdownInterval);
                    saveRecord();
                    $('#modal-pay').modal('hide');
                }
            }
        }, 1000);


        document.getElementById('pay-container').style.display = 'none';


    } catch (error) {
        clearInterval(countdownInterval);
        console.error('Payment Error:', error);
        showCustomAlert('Payment failed. Please try again.', "error");
    } finally {
        clearInterval(countdownInterval);
        $('#modal-pay').modal('hide'); // Ensure modal hides after processing
    }
}

async function checkTransactionStatus() {

    var arr = [];
    var transactionid = $("#transactionid").val();

    arr.push({
        "transactionid": transactionid
    });

    //const apiUrl = "http://localhost:5000/checkMMEStar?transactionid=" + transactionid;
    const apiUrl = "http://163.50.55.62:5000/checkMMEStar?transactionid=" + transactionid;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });


        const data = await response.json();


        if (Array.isArray(data) && data.length > 0) {
            return data[0].status; // return the status value
        }
        return "ERROR"; // return error if empty



    } catch (error) {

        //showCustomAlert('Database Fetch Error:' + error, 'error');
        return "ERROR";
    }
}


async function saveRecord() {

    var arr = [];

    $('.itemList').each(function () {

        var id = this.id;
        id = id.replace('item-', '');
        // alert(id);

        // const imgid = "manual";
        var imgid = "manual";
        var getPC = window.systemInfo.getPCName();

        if (sessionStorage.getItem("imgid") !== null) {
            if (sessionStorage.getItem("imgid").length > 0) {
                imgid = sessionStorage.getItem("imgid")
            }
        }

        var ismanual = null;
        if (sessionStorage.getItem("isManual") !== null) {
            if (sessionStorage.getItem("isManual").length > 0) {
                ismanual = sessionStorage.getItem("isManual")
            }
        }

        var price = $("#price-" + id).html().replace('RM', '');
        var qty = $("#qty-" + id).val();
        var amount = $("#totPrice-" + id).html().replace('RM', '');
        var paymenttype = $("#paymenttype").val();
        var transactionid = $("#transactionid").val();

        arr.push({
            "item": id,
            "qty": qty,
            "price": price,
            "amount": amount,
            "imgid": imgid,
            "terminal": getPC,
            "paymenttype": paymenttype,
            "transactionid": transactionid,
            "ismanual": ismanual

        });

    });


    const response = await fetch('http://163.50.55.62:5000/processPOST', {
        //const response = await fetch('http://localhost:5000/processPOST', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arr)
    });


    if (!response.ok) {
        showCustomAlert('Payment failed. Please try again.', "error");
        throw new Error(`Payment failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (result == "success") {
        // showAlertAndReload('Payment successful!', "success");
        location.reload();

    } else {
        showCustomAlert('Payment failed. Please try again.', "error");
        throw new Error('Payment rejected by server.');

    }




}
