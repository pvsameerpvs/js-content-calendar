import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export async function exportProposalPdf(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) {
    toast.error("Container not found");
    return;
  }

  toast.loading("Generating PDF...");
  
  try {
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
    });

    const pages = container.querySelectorAll('.proposal-page-wrapper'); 
    
    if (pages.length === 0) {
        toast.dismiss();
        toast.error("No pages to export");
        return;
    }

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const pageContent = page.firstChild as HTMLElement; // Get the inner content, not the wrapper
        
        const canvas = await html2canvas(pageContent, {
            scale: 2, 
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pageWidth = 210;
        const pageHeight = 297;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
    }

    pdf.save("JustSearch_Proposal.pdf");
    toast.dismiss();
    toast.success("PDF Downloaded");

  } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to generate PDF");
  }
}
