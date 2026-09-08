import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * Exports a certificate DOM element to a high-resolution A4 landscape PDF.
 * @param {HTMLElement|string} elementOrId - The element or DOM element ID of the certificate.
 * @param {string} fileName - The filename for the downloaded PDF.
 */
export async function downloadCertificateFromElement(elementOrId, fileName = "Certificate.pdf") {
  const element = typeof elementOrId === "string" ? document.getElementById(elementOrId) : elementOrId;
  if (!element) {
    console.error("Certificate element not found for PDF export");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // High resolution (3x) for crisp print quality
      useCORS: true,
      logging: false,
      backgroundColor: "#FCFBF7",
      allowTaint: true
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 297mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    pdf.save(fileName);
  } catch (error) {
    console.error("Failed to generate certificate PDF:", error);
  }
}
