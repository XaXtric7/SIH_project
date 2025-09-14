import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Package, Shield, QrCode } from 'lucide-react';

interface QRData {
  productName: string;
  batchNumber: string;
  serialNumber: string;
  manufacturingDate?: string;
  expiryDate?: string;
  id: string;
}

const Result = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<'genuine' | 'fake' | 'invalid'>('invalid');
  const [productData, setProductData] = useState<QRData | null>(null);

  useEffect(() => {
    // Check if there's a stored scan result
    const scanResult = localStorage.getItem('scanResult');
    if (scanResult === 'invalid') {
      setResult('invalid');
      return;
    }

    // Try to get and parse the scanned QR data
    const scannedDataStr = localStorage.getItem('scannedQRData');
    if (!scannedDataStr) {
      setResult('invalid');
      return;
    }

    try {
      const scannedData = JSON.parse(scannedDataStr) as QRData;
      setProductData(scannedData);

      // Check if this product has been scanned before
      // In a real app, this would be a server call to check a database
      const scannedProducts = JSON.parse(localStorage.getItem('scannedProducts') || '[]');
      
      if (scannedProducts.includes(scannedData.id)) {
        // Product has been scanned before - potential counterfeit
        setResult('fake');
      } else {
        // First scan - genuine product
        setResult('genuine');
        
        // Add this product ID to the scanned products list
        scannedProducts.push(scannedData.id);
        localStorage.setItem('scannedProducts', JSON.stringify(scannedProducts));
      }
    } catch (error) {
      console.error('Error parsing QR data:', error);
      setResult('invalid');
    }
  }, []);

  const getResultContent = () => {
    switch (result) {
      case 'genuine':
        return (
          <div className="text-center space-y-4">
            <div className="verification-badge mx-auto mb-2">
              <Shield className="w-4 h-4" />
              <span>Verification Complete</span>
            </div>
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto pulse-animation">
              <CheckCircle2 className="w-16 h-16 text-primary" />
            </div>
            <AlertTitle className="text-2xl font-bold text-primary mt-4">Genuine Product</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              This product is authentic and has been verified for the first time.
            </AlertDescription>
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <div className="bg-primary/5 p-3 rounded-lg">
                <div className="font-medium text-primary">First Scan</div>
                <div className="text-muted-foreground">Verified Original</div>
              </div>
              <div className="bg-primary/5 p-3 rounded-lg">
                <div className="font-medium text-primary">Secure</div>
                <div className="text-muted-foreground">Blockchain Verified</div>
              </div>
            </div>
          </div>
        );
      case 'fake':
        return (
          <div className="text-center space-y-4">
            <div className="verification-badge mx-auto mb-2 bg-destructive/10 text-destructive border-destructive/20">
              <AlertTriangle className="w-4 h-4" />
              <span>Verification Alert</span>
            </div>
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
            <AlertTitle className="text-2xl font-bold text-destructive mt-4">Warning! Potential Counterfeit</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              This product has been scanned before. It may be a counterfeit or already used product.
            </AlertDescription>
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <div className="bg-destructive/5 p-3 rounded-lg">
                <div className="font-medium text-destructive">Multiple Scans</div>
                <div className="text-muted-foreground">Previously Verified</div>
              </div>
              <div className="bg-destructive/5 p-3 rounded-lg">
                <div className="font-medium text-destructive">Action Required</div>
                <div className="text-muted-foreground">Contact Manufacturer</div>
              </div>
            </div>
          </div>
        );
      case 'invalid':
      default:
        return (
          <div className="text-center space-y-4">
            <div className="verification-badge mx-auto mb-2 bg-muted text-muted-foreground border-muted/20">
              <XCircle className="w-4 h-4" />
              <span>Verification Failed</span>
            </div>
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-16 h-16 text-muted-foreground" />
            </div>
            <AlertTitle className="text-2xl font-bold text-muted-foreground mt-4">Invalid Code</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              The QR code could not be recognized as a valid product code.
            </AlertDescription>
            <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="font-medium">Try Again</div>
                <div className="text-muted-foreground">Rescan QR Code</div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="font-medium">Need Help?</div>
                <div className="text-muted-foreground">Contact Support</div>
              </div>
            </div>
          </div>
        );
    }
  };

  const getBackgroundColor = () => {
    switch (result) {
      case 'genuine': return 'bg-gradient-subtle';
      case 'fake': return 'bg-gradient-subtle';
      case 'invalid': default: return 'bg-gradient-subtle';
    }
  };

  return (
    <div className={`min-h-screen consumer-bg flex flex-col`}>
      <div className="p-4">
        <Button
          variant="outline"
          onClick={() => navigate('/consumer')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <Card className="w-full max-w-md shadow-medium border-0 mb-6 overflow-hidden scanner-container glass-panel">
          <div className={`p-6 ${result === 'genuine' ? 'bg-primary/5' : result === 'fake' ? 'bg-destructive/5' : 'bg-muted/10'}`}>
            {getResultContent()}
          </div>

          {productData && result !== 'invalid' && (
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-primary">Product Information</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <span className="font-medium text-muted-foreground">Product:</span>
                    <div className="font-semibold">{productData.productName}</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <span className="font-medium text-muted-foreground">Batch:</span>
                    <div className="font-semibold">{productData.batchNumber}</div>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <span className="font-medium text-muted-foreground">Serial Number:</span>
                    <div className="font-semibold">{productData.serialNumber}</div>
                  </div>
                  {productData.manufacturingDate && (
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <span className="font-medium text-muted-foreground">Manufacturing Date:</span>
                      <div className="font-semibold">{productData.manufacturingDate}</div>
                    </div>
                  )}
                  {productData.expiryDate && (
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <span className="font-medium text-muted-foreground">Expiry Date:</span>
                      <div className="font-semibold">{productData.expiryDate}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="flex flex-col gap-3 w-full max-w-md">
          <Button
            onClick={() => navigate('/scanner')}
            className="bg-gradient-primary hover:opacity-90 transition-smooth"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Scan Another Product
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/consumer')}
            className="border-primary/20 text-primary hover:bg-primary/5"
          >
            <Shield className="w-4 h-4 mr-2" />
            Return to Verification Portal
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Result;