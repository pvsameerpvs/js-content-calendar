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
