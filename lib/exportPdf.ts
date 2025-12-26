import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Export the element as an A4 landscape PDF.
 * - Uses html2canvas scale=2 for crisp output.
 * - Uses jsPDF A4 landscape and fits the rendered image exactly.
 */
export async function exportA4LandscapePdf(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png", 1.0);

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, "PNG", 0, 0, pageW, pageH, undefined, "FAST");
  pdf.save(filename);

  return pdf;
}

/**
 * Export the element as a 16:9 Presentation PDF (338mm x 190mm).
 * - Uses html2canvas scale=4 for high quality.
 * - Uses exact 338x190mm dimensions to match the UI design.
 */
export async function exportPresentationPdf(element: HTMLElement, filename: string) {
  // Wait a bit to ensure images are fully loaded/rendered if needed (caller handles main delay)
  const canvas = await html2canvas(element, {
    scale: 3, // Reduced from 4 to avoid sub-pixel rendering glitches
    useCORS: true,
    backgroundColor: "#ffffff", // Ensure white background
    scrollX: 0,
    scrollY: -window.scrollY,
    logging: true,
  });

  const imgData = canvas.toDataURL("image/jpeg", 1.0);
  
  // Custom format [338, 190] for 16:9 presentation
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [338, 190],
    compress: true,
  });

  const pdfWidth = 338;
  const pdfHeight = 190;

  pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
  pdf.save(filename);

  return pdf;
}
