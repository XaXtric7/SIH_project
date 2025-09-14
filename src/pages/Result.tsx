import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Package } from 'lucide-react';

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
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <AlertTitle className="text-2xl font-bold text-green-600">Genuine Product</AlertTitle>
            <AlertDescription className="text-green-600">
              This product is authentic and has been verified for the first time.
            </AlertDescription>
          </div>
        );
      case 'fake':
        return (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <AlertTitle className="text-2xl font-bold text-red-600">Warning! This product may be fake</AlertTitle>
            <AlertDescription className="text-red-600">
              This product has been scanned before. It may be a counterfeit or already used product.
            </AlertDescription>
          </div>
        );
      case 'invalid':
      default:
        return (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-12 h-12 text-gray-600" />
            </div>
            <AlertTitle className="text-2xl font-bold text-gray-600">Invalid Code</AlertTitle>
            <AlertDescription className="text-gray-600">
              The QR code could not be recognized as a valid product code.
            </AlertDescription>
          </div>
        );
    }
  };

  const getBackgroundColor = () => {
    switch (result) {
      case 'genuine': return 'bg-green-50';
      case 'fake': return 'bg-red-50';
      case 'invalid': default: return 'bg-gray-50';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundColor()} flex flex-col`}>
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
        <Card className="w-full max-w-md shadow-medium border-0 mb-6 overflow-hidden">
          <div className={`p-6 ${result === 'genuine' ? 'bg-green-100' : result === 'fake' ? 'bg-red-100' : 'bg-gray-100'}`}>
            {getResultContent()}
          </div>

          {productData && result !== 'invalid' && (
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold">Product Information</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Product:</span>
                    <div className="font-semibold">{productData.productName}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Batch:</span>
                    <div className="font-semibold">{productData.batchNumber}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Serial Number:</span>
                    <div className="font-semibold">{productData.serialNumber}</div>
                  </div>
                  {productData.manufacturingDate && (
                    <div>
                      <span className="font-medium text-muted-foreground">Manufacturing Date:</span>
                      <div className="font-semibold">{productData.manufacturingDate}</div>
                    </div>
                  )}
                  {productData.expiryDate && (
                    <div>
                      <span className="font-medium text-muted-foreground">Expiry Date:</span>
                      <div className="font-semibold">{productData.expiryDate}</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <Button
          onClick={() => navigate('/scanner')}
          className="bg-gradient-primary hover:opacity-90 transition-smooth"
        >
          Scan Another Product
        </Button>
      </div>
    </div>
  );
};

export default Result;