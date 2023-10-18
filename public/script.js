document.addEventListener('DOMContentLoaded', () => {
    const pdfUploadForm = document.getElementById('pdf-upload-form');
    const downloadLink = document.getElementById('download-link');

    pdfUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(pdfUploadForm);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();

                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.textContent = 'Download New PDF';
                link.download = 'new-pdf.pdf';
                downloadLink.innerHTML = '';
                downloadLink.appendChild(link);
            } else {
                downloadLink.textContent = 'Error processing PDF';
            }
        } catch (error) {
            console.error(error);
            downloadLink.textContent = 'Error processing PDF';
        }
    });
});
