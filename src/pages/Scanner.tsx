import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, QrCode, Loader2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

const Scanner = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-reader';

  useEffect(() => {
    // Initialize scanner
    scannerRef.current = new Html5Qrcode(scannerContainerId);

    // Start scanning when component mounts
    startScanner();

    // Clean up when component unmounts
    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch(error => {
          console.error('Error stopping scanner:', error);
        });
      }
    };
  }, []);

  const startScanner = async () => {
    if (!scannerRef.current) return;

    try {
      setScanning(true);
      setError('');

      const qrCodeSuccessCallback = (decodedText: string) => {
        // Stop scanning after successful scan
        if (scannerRef.current) {
          scannerRef.current.stop().catch(error => {
            console.error('Error stopping scanner:', error);
          });
        }

        try {
          // Try to parse the QR code data
          const qrData = JSON.parse(decodedText);
          
          // Validate that the QR data has the required fields
          if (!qrData.productName || !qrData.batchNumber || !qrData.serialNumber || !qrData.id) {
            console.error('Invalid QR code format: Missing required fields');
            localStorage.setItem('scanResult', 'invalid');
            navigate('/result');
            return;
          }
          
          // Store the scanned data in localStorage for the result page
          localStorage.setItem('scannedQRData', decodedText);
          localStorage.removeItem('scanResult'); // Clear any previous invalid result
          
          // Navigate to the result page
          navigate('/result');
        } catch (error) {
          // If parsing fails, it's an invalid QR code
          console.error('Error parsing QR code:', error);
          localStorage.setItem('scanResult', 'invalid');
          navigate('/result');
        }
      };

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        (errorMessage) => {
          // Handle scan errors silently - we don't want to show transient errors
          console.log(errorMessage);
        }
      );
    } catch (err) {
      setScanning(false);
      setError('Camera access denied or not available. Please check your camera permissions.');
      console.error('Scanner error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <div className="p-4">
        <Button
          variant="outline"
          onClick={() => navigate('/consumer')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center mb-6">
          <div className="verification-badge mx-auto mb-4">
            <QrCode className="w-4 h-4" />
            <span>Scanning Active</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Scan QR Code</h1>
          <p className="text-muted-foreground mt-1">Position the QR code within the frame</p>
        </div>

        <Card className="w-full max-w-md overflow-hidden shadow-medium border-0 mb-6 scanner-container">
          {error ? (
            <div className="p-6 text-center text-destructive">
              <p>{error}</p>
              <Button 
                onClick={startScanner} 
                className="mt-4 bg-gradient-primary hover:opacity-90 transition-smooth"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div id={scannerContainerId} className="w-full aspect-square"></div>
              <div className="absolute inset-0 pointer-events-none border-2 border-accent/50 rounded-lg flex items-center justify-center">
                {scanning && (
                  <div className="pulse-animation p-4 bg-background/80 rounded-full">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}
              </div>
            </>
          )}
        </Card>

        <div className="text-center text-sm text-muted-foreground max-w-md space-y-2">
          <p className="font-medium">Scanning Tips:</p>
          <ul className="flex flex-col gap-1">
            <li>• Make sure the QR code is well-lit and clearly visible</li>
            <li>• Hold your device steady while scanning</li>
            <li>• Ensure the entire QR code is within the frame</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Scanner;