/**
 * Extracts text and form field data from a PDF file.
 */
export async function extractPdfData(file: File): Promise<{ text: string, fields: Record<string, any> }> {
    const pdfjs = await import('pdfjs-dist');

    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";
    const fields: Record<string, any> = {};

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const annotations = await page.getAnnotations();
        annotations.forEach((annot: any) => {
            if (annot.fieldName && annot.fieldValue !== undefined) {
                fields[annot.fieldName] = annot.fieldValue;
            }
        });

        const textContent = await page.getTextContent();
        const items = textContent.items as any[];
        items.sort((a, b) => {
            const yDiff = b.transform[5] - a.transform[5];
            if (Math.abs(yDiff) > 5) {
                return yDiff;
            }
            return a.transform[4] - b.transform[4];
        });

        const pageText = items
            .map((item: any) => item.str)
            .join("  ");
        fullText += pageText + "\n";
    }

    return { text: fullText, fields };
}
