// ... existing code ...
// Focus Ring
document.getElementById('viewport').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    focusRing.style.left = `${x}px`;
    focusRing.style.top = `${y}px`;
    focusRing.classList.add('active');
    setTimeout(() => focusRing.classList.remove('active'), 1000);
});

// Helper Fungsi Pengunduhan Berkas Serbaguna (Mendukung Android WebView & Browser Seluler)
function downloadMediaFile(dataUrl, fileName) {
    try {
        // Metode 1: Mengubah Base64 DataURL menjadi Blob binary
        const parts = dataUrl.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        const blob = new Blob([uInt8Array], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        // Eksekusi Download lewat ObjectURL
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Cleanup memory
        setTimeout(() => {
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(blobUrl);
        }, 300);

    } catch (e) {
        // Fallback Metode 2: Direct Anchor Base64 Trigger
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = fileName;
        downloadLink.target = '_blank';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}

// Shutter Click dengan Penanganan Simpan Berkas Android
shutterBtn.addEventListener('click', () => {
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        alert("Kamera belum siap, tunggu sebentar...");
        return;
    }

    const app = document.getElementById('app-container');
    app.style.opacity = '0.2';
    setTimeout(() => app.style.opacity = '1', 120);

    try {
        const imageURL = canvas.toDataURL('image/jpeg', 0.95);
        const fileName = `iPhone17ProMax_${currentMode.toUpperCase()}_${resOptions[resIndex].label}_${Date.now()}.jpg`;

        // Panggil fungsi unduh aman untuk Android
        downloadMediaFile(imageURL, fileName);

        // Update Tampilan Pratinjau Galeri
        const galleryBtn = document.getElementById('gallery-btn');
        galleryBtn.innerHTML = `<img src="${imageURL}" style="width:100%; height:100%; object-fit:cover; border-radius:10px;">`;
    } catch (err) {
        alert("Gagal mengambil foto: " + err.message);
    }
});

startCamera();