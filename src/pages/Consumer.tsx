import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, ShieldCheck } from 'lucide-react';

const Consumer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Product Verification</h1>
        <p className="text-muted-foreground mt-2">Scan QR codes to verify product authenticity</p>
      </div>

      <Card className="w-full max-w-md shadow-medium border-0 mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold">Verify Your Product</CardTitle>
          <CardDescription>
            Scan the QR code on your product to verify its authenticity
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button
            onClick={() => navigate('/scanner')}
            className="w-full h-14 bg-gradient-primary hover:opacity-90 transition-smooth text-lg font-medium flex items-center justify-center gap-2"
          >
            <QrCode className="w-6 h-6" />
            <span>Scan Product</span>
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>Our verification system helps you identify genuine products and protect against counterfeits.</p>
      </div>
    </div>
  );
};

export default Consumer;