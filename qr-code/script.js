document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const urlInput = document.getElementById('urlInput');
    const generateBtn = document.getElementById('generateBtn');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const startScannerBtn = document.getElementById('startScannerBtn');
    const scannerContainer = document.getElementById('scannerContainer');
    const scanResult = document.getElementById('scanResult');
    
    let qrCode = null;
    let html5QrCode = null;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            if (tabId !== 'scanner' && html5QrCode) {
                html5QrCode.stop().catch(err => console.error(err));
                html5QrCode = null;
                scannerContainer.innerHTML = '';
            }
        });
    });

    generateBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Iltimos, URL ni kiriting!');
            return;
        }

        qrCodeContainer.innerHTML = '';
        
        qrCode = new QRCode(qrCodeContainer, {
            text: url,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    });

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });

    startScannerBtn.addEventListener('click', async () => {
        if (html5QrCode) {
            return;
        }

        html5QrCode = new Html5Qrcode("scannerContainer");
        
        try {
            await html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    scanResult.innerHTML = `
                        <p>Skanerlandi!</p>
                        <a href="${decodedText}" target="_blank">${decodedText}</a>
                    `;
                    
                    if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) {
                        window.open(decodedText, '_blank');
                    }
                },
                (errorMessage) => {}
            );
        } catch (err) {
            console.error('Skanerni boshlashda xatolik:', err);
            alert('Kameraga ruxsat berilmagan yoki xatolik yuz berdi!');
        }
    });
});