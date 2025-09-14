import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Factory, Shield, QrCode, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="verification-badge mb-4">
              <Shield className="w-4 h-4" />
              <span>Secure Verification</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">QR Factory</h1>
          <p className="text-xl text-muted-foreground mt-2">Secure Product Authentication System</p>
          <div className="flex justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <QrCode className="w-4 h-4 text-primary" />
              <span>Scan to Verify</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-medium border-0 hover:shadow-lg transition-smooth pulse-animation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-primary" />
                <span>Manufacturer Portal</span>
              </CardTitle>
              <CardDescription>
                Generate and manage QR codes for your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-md mb-4 text-sm">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Secure QR generation</span>
                </p>
              </div>
              <Button 
                onClick={() => navigate("/login")} 
                className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
              >
                Access Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-0 hover:shadow-lg transition-smooth scanner-container">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span>Consumer Verification</span>
              </CardTitle>
              <CardDescription>
                Scan QR codes to verify product authenticity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-3 rounded-md mb-4 text-sm">
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span>Instant verification results</span>
                </p>
              </div>
              <Button 
                onClick={() => navigate("/consumer")} 
                variant="outline"
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-smooth"
              >
                Verify Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
