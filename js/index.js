function isPC() {
    return window.innerWidth > 1024;
}


// Function to show a beautiful alert
function showCustomAlert(message, icon = 'success') {
    Swal.fire({
        title: 'Notification',
        text: message,
        icon: icon, // 'success', 'error', 'warning', 'info'
        confirmButtonText: 'OK',
        timer: 1000, // Auto-close after 5 seconds
        timerProgressBar: true
    });
}



function showAlertAndReload(message, icon = 'success') {
    Swal.fire({
        title: 'Notification',
        text: message,
        icon: icon, // 'success', 'error', 'warning', 'info'
        confirmButtonText: 'OK',
        timer: 1000, // Auto-close after 5 seconds
        timerProgressBar: true

    }).then((result) => {
        if (result.isConfirmed) {
            location.reload(); // Reload the page
        }
    });

}

// Access the webcam
async function startCamera() {
    document.getElementById('btnStart').disabled = false;
    try {
        document.querySelector('.processedImage-container').style.display = 'none';
        document.querySelector('.video-container').style.display = 'flex';
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        startTimer();
    } catch (err) {
        showCustomAlert('Camera access denied: ' + err.message, 'error');
        document.querySelector('.processedImage-container').style.display = 'flex';
        document.querySelector('.video-container').style.display = 'none';
        document.querySelector('.timeloader-container').style.display = 'none';

    }
}

// Timer for auto-capture
function startTimer() {
    let timeLeft = 1;
    document.querySelector('.timeloader-container').style.display = 'flex';
    const timerElement = document.getElementById('timer');
    timerElement.textContent = timeLeft;

    const countdown = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            document.querySelector('.timeloader-container').style.display = 'none';
            captureAndSend();
            stopCamera();

        }
    }, 1000);
}

// Capture and Send Image
function captureAndSend() {

    const getPC = window.systemInfo.getPCName();

    const terminalId = getPC;
    const transactionId = crypto.randomUUID().replace(/-/g, '').slice(0, 20);


    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${terminalId}_${transactionId}_${timestamp}.jpg`;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
        // Send image to Flask server
        fetch("http://163.50.55.62:5000/process_live", {
            //fetch("http://localhost:5000/process", {
            method: "POST",
            headers: {
                'Content-Type': 'application/octet-stream',
                "X-Terminal-ID": terminalId,
                "X-Transaction-ID": transactionId,
                "Cache-Control": "no-cache"
            },
            body: blob
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {


                if (data.status !== "success") {
                    console.warn("Server returned error:", data);
                    showCustomAlert("❌ Image processing failed. Please retry.", "error");
                    return;
                }

                // Safety check only. Do not display wrong transaction.
                if (data.terminal_id !== terminalId || data.transaction_id !== transactionId) {
                    console.warn("Wrong response ignored:", {
                        sent_terminal: terminalId,
                        received_terminal: data.terminal_id,
                        sent_transaction: transactionId,
                        received_transaction: data.transaction_id
                    });

                    showCustomAlert("⚠️ Processing mismatch. Please retry.", "error");
                    return;
                }

                // Display the processed image
                const processedImage = document.getElementById("processedImage");
                document.querySelector('.processedImage-container').style.display = 'flex';
                document.querySelector('.video-container').style.display = 'none';
                processedImage.src = `data:image/jpeg;base64,${data.image}`;

                const description = data.description;

                if (description.length > 0) {
                    // Save image description and navigate
                    sessionStorage.setItem("imageDescription", JSON.stringify(description));
                    sessionStorage.setItem("imgid", JSON.stringify(data.imgid));
                    sessionStorage.setItem("terminalId", terminalId);
                    sessionStorage.setItem("transactionId", transactionId);

                    // Show success alert
                    showCustomAlert("✅ Image processed successfully!", "success");
                    showPage(1, "auto");

                } else {
                    sessionStorage.setItem("isManual", "yes");
                    showPage(1, "manual");
                    setTimeout(() => {
                        showPageCart(0);
                    
                        const modalElement = document.getElementById('modal-addon');
                    if (modalElement) {
                        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                       modal.show();
                      }
                     }, 300);
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                showCustomAlert("❌ Error: " + err.message, "error");
            });
    }, "image/jpeg");
}

// Stop the webcam
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

// function showCart() {
//     const descriptionData = sessionStorage.getItem("imageDescription");
//     const description = JSON.parse(descriptionData);
//     if (description.length > 0) {
//         loadPage('cart.html', 'cart');
//         showPage(1);
//     } else {
//         showCustomAlert("❌ No image detected, click start to retry.", "error");
//     }
// }

// Function to load external HTML into a container
function loadPage(url, containerId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        })
        .catch(err => console.error(`Error loading ${url}:`, err));
}

// Slide between pages (0 = Main Page, 1 = Page 1, 2 = Page 2)
function showPage(page, type) {
    const pages = [
        document.getElementById('index'),
        document.getElementById('cart')

    ];


    if (page === 1 && type != "manual") {
        const descriptionData = sessionStorage.getItem("imageDescription");
        loadItem(descriptionData);
    }


    // Set the position of each page
    pages.forEach((p, index) => {
        p.style.transform = `translateX(${(index - page) * 100}%)`;
    });
}

