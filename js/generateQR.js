// const { trim } = require("jquery");
// const QRCode = require('qrcode');

const { session } = require("electron");

function generateQRCode() {
    $('#starQR').html("");
    var finalAmt = $("#finalAmt").html().replace('RM', '');

    var qrcode;

    if (window.innerWidth > 1024 === false) {
        qrcode = new QRCode(document.getElementById("starQR"), {
            width: 300,
            height: 300
        });

    } else {
        qrcode = new QRCode(document.getElementById("starQR"), {
            width: 500,
            height: 500
        });
    }



    //var batch_id = crypto.randomUUID().replace(/-/g, '').slice(0, 20); //for manual transaction

    const getPC = window.systemInfo.getPCName();
    const terminalId = getPC;
    const transactionId = crypto.randomUUID().replace(/-/g, '').slice(0, 20);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    var batch_id = `${terminalId}_${transactionId}_${timestamp}`;

    if (sessionStorage.getItem("transactionId") !== null) {
        if (sessionStorage.getItem("transactionId").length > 0) {
            batch_id = sessionStorage.getItem("transactionId"); //get from image processing
        }
    }


    $('#transactionid').val(batch_id);

    var text = "https://starsystem.mmemyspace.com/login.php?next=/autopay&amount=" + finalAmt.trim() + "&transaction_id=" + batch_id;

    //$('#starQRtest').attr("href", "http://localhost:8080/starsystem.mmemyspace.com/login.php?next=/autopay&amount=" + finalAmt.trim() + "&transaction_id=" + batch_id);
    qrcode.clear(); // Clear previous QR code
    qrcode.makeCode(text); // Generate new QR code
}
