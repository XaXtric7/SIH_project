import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Factory } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">QR Factory</h1>
          <p className="text-xl text-muted-foreground mt-2">Secure Product Authentication System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-medium border-0 hover:shadow-lg transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="w-5 h-5" />
                <span>Manufacturer Portal</span>
              </CardTitle>
              <CardDescription>
                Generate and manage QR codes for your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/login")} 
                className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
              >
                Access Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-0 hover:shadow-lg transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                <span>Consumer Verification</span>
              </CardTitle>
              <CardDescription>
                Scan QR codes to verify product authenticity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/consumer")} 
                className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
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
