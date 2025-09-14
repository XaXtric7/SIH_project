import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer, ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";

interface QRCodeData {
  id: string;
  productName: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  serialNumber: string;
  qrCodeUrl: string;
}

const QRCodes = () => {
  const navigate = useNavigate();
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('generatedQRCodes');
    if (stored) {
      setQrCodes(JSON.parse(stored));
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  const downloadAllQRCodes = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      
      for (const qr of qrCodes) {
        // Convert data URL to blob
        const response = await fetch(qr.qrCodeUrl);
        const blob = await response.blob();
        zip.file(`${qr.serialNumber}.png`, blob);
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR_Codes_${qrCodes[0]?.batchNumber || 'batch'}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success("QR codes downloaded successfully!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download QR codes");
    } finally {
      setIsDownloading(false);
    }
  };

  const printQRCodes = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const printContent = `
        <html>
          <head>
            <title>QR Codes - ${qrCodes[0]?.productName}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .qr-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
              .qr-item { text-align: center; page-break-inside: avoid; }
              .qr-image { width: 150px; height: 150px; }
              .qr-info { margin-top: 8px; font-size: 12px; }
              @media print { .qr-grid { grid-template-columns: repeat(2, 1fr); } }
            </style>
          </head>
          <body>
            <h1>${qrCodes[0]?.productName} - QR Codes</h1>
            <div class="qr-grid">
              ${qrCodes.map(qr => `
                <div class="qr-item">
                  <img src="${qr.qrCodeUrl}" alt="QR Code" class="qr-image" />
                  <div class="qr-info">
                    <div><strong>${qr.serialNumber}</strong></div>
                    <div>Batch: ${qr.batchNumber}</div>
                    ${qr.manufacturingDate ? `<div>Mfg: ${qr.manufacturingDate}</div>` : ''}
                    ${qr.expiryDate ? `<div>Exp: ${qr.expiryDate}</div>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (qrCodes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Generated QR Codes</h1>
              <p className="text-muted-foreground">
                {qrCodes.length} QR codes for {qrCodes[0]?.productName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={printQRCodes}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print All</span>
            </Button>
            <Button
              onClick={downloadAllQRCodes}
              disabled={isDownloading}
              className="flex items-center space-x-2 bg-gradient-primary hover:opacity-90 transition-smooth"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? "Downloading..." : "Download All"}</span>
            </Button>
          </div>
        </div>

        <Card className="shadow-medium border-0 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Product Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Product:</span>
                <div className="font-semibold">{qrCodes[0]?.productName}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Batch:</span>
                <div className="font-semibold">{qrCodes[0]?.batchNumber}</div>
              </div>
              {qrCodes[0]?.manufacturingDate && (
                <div>
                  <span className="font-medium text-muted-foreground">Manufacturing:</span>
                  <div className="font-semibold">{qrCodes[0]?.manufacturingDate}</div>
                </div>
              )}
              {qrCodes[0]?.expiryDate && (
                <div>
                  <span className="font-medium text-muted-foreground">Expiry:</span>
                  <div className="font-semibold">{qrCodes[0]?.expiryDate}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {qrCodes.map((qr) => (
            <Card key={qr.id} className="shadow-soft border-0 hover:shadow-medium transition-smooth">
              <CardContent className="p-4 text-center">
                <img
                  src={qr.qrCodeUrl}
                  alt={`QR Code ${qr.serialNumber}`}
                  className="w-32 h-32 mx-auto mb-3 rounded-md"
                />
                <div className="space-y-1 text-sm">
                  <div className="font-semibold text-foreground">{qr.serialNumber}</div>
                  <div className="text-muted-foreground">Batch: {qr.batchNumber}</div>
                  {qr.manufacturingDate && (
                    <div className="text-muted-foreground text-xs">Mfg: {qr.manufacturingDate}</div>
                  )}
                  {qr.expiryDate && (
                    <div className="text-muted-foreground text-xs">Exp: {qr.expiryDate}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRCodes;