import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, ShieldCheck, CheckCircle, AlertTriangle, Shield, Info } from 'lucide-react';
import { toast } from 'sonner';

const Consumer = () => {
  const navigate = useNavigate();

  const generateTestQRCode = (type = 'genuine') => {
    // Create a valid QR code data object
    const testQRData = {
      productName: "Test Product",
      batchNumber: "TEST-BATCH-001",
      serialNumber: "TEST-BATCH-001-0001",
      manufacturingDate: "2023-01-01",
      expiryDate: "2025-01-01",
      id: type === 'genuine' ? `test-${Date.now()}` : 'test-duplicate-id'
    };
    
    // Store the test QR data in localStorage
    localStorage.setItem('scannedQRData', JSON.stringify(testQRData));
    localStorage.removeItem('scanResult'); // Clear any previous invalid result
    
    // If testing counterfeit, add the ID to scanned products first
    if (type === 'counterfeit') {
      const scannedProducts = JSON.parse(localStorage.getItem('scannedProducts') || '[]');
      if (!scannedProducts.includes(testQRData.id)) {
        scannedProducts.push(testQRData.id);
        localStorage.setItem('scannedProducts', JSON.stringify(scannedProducts));
      }
    }
    
    // Show success message
    toast.success(`Test ${type} QR code generated! Click 'View Result' to see it.`);
  };
  
  const generateInvalidQRCode = () => {
    // Create an invalid QR code (missing required fields)
    const invalidQRData = {
      productName: "Invalid Product"
      // Missing required fields
    };
    
    localStorage.setItem('scannedQRData', JSON.stringify(invalidQRData));
    localStorage.setItem('scanResult', 'invalid');
    
    toast.success("Invalid QR code generated! Click 'View Result' to see it.");
  };

  return (
    <div className="min-h-screen consumer-bg flex flex-col items-center justify-center p-4">
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md text-center mb-8">
        <div className="verification-badge mx-auto mb-4">
          <Shield className="w-4 h-4" />
          <span>Secure Verification</span>
        </div>
        <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 pulse-animation">
          <ShieldCheck className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Product Verification</h1>
        <p className="text-muted-foreground mt-2">Scan QR codes to verify product authenticity</p>
      </div>

      <Card className="w-full max-w-md shadow-medium border-0 mb-6 scanner-container glass-panel">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 text-primary" />
            <span>Verify Your Product</span>
          </CardTitle>
          <CardDescription>
            Scan the QR code on your product to verify its authenticity
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="grid grid-cols-2 gap-3 w-full mb-2">
            <div className="bg-muted p-3 rounded-md text-sm flex flex-col items-center">
              <CheckCircle className="w-5 h-5 text-accent mb-1" />
              <span>Genuine</span>
            </div>
            <div className="bg-muted p-3 rounded-md text-sm flex flex-col items-center">
              <AlertTriangle className="w-5 h-5 text-destructive mb-1" />
              <span>Counterfeit</span>
            </div>
          </div>
          <div className="p-3 bg-muted/20 rounded-lg mb-3">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Info className="w-4 h-4" /> Test QR Code Options
            </h4>
            <p className="text-xs text-muted-foreground mb-2">
              Generate test QR codes to see how the app validates different types of products:
            </p>
            <ul className="text-xs text-muted-foreground mb-3 list-disc pl-4 space-y-1">
              <li><span className="text-green-600 font-medium">Genuine</span> - First scan of a valid product</li>
              <li><span className="text-red-600 font-medium">Counterfeit</span> - Duplicate scan of the same product</li>
              <li><span className="text-amber-600 font-medium">Invalid</span> - Malformed QR code data</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3 w-full mb-3">
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                onClick={() => generateTestQRCode('genuine')}
                className="bg-green-600 hover:bg-green-700 transition-smooth font-medium flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                <span>Test Genuine</span>
              </Button>
              <Button
                onClick={() => generateTestQRCode('counterfeit')}
                className="bg-red-600 hover:bg-red-700 transition-smooth font-medium flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                <span>Test Counterfeit</span>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                onClick={generateInvalidQRCode}
                className="bg-amber-600 hover:bg-amber-700 transition-smooth font-medium flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                <span>Test Invalid</span>
              </Button>
              <Button
                onClick={() => navigate('/result')}
                className="bg-primary hover:bg-primary/90 transition-smooth font-medium flex items-center justify-center gap-2"
              >
                <Shield className="w-5 h-5" />
                <span>View Result</span>
              </Button>
            </div>
          </div>
          <Button
            onClick={() => navigate('/scanner')}
            className="w-full h-14 bg-gradient-primary hover:opacity-90 transition-smooth text-lg font-medium flex items-center justify-center gap-2"
          >
            <QrCode className="w-6 h-6" />
            <span>Scan Product</span>
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground max-w-md space-y-3">
        <p>Our verification system helps you identify genuine products and protect against counterfeits.</p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-accent" />
            <span>Fast Scanning</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Secure Results</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Consumer;