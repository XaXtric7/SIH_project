import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import QRCode from "qrcode";

interface ProductData {
  productName: string;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductData>({
    productName: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",
    quantity: 1
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (field: keyof ProductData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'quantity' ? parseInt(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateQRCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.batchNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.quantity < 1 || formData.quantity > 1000) {
      toast.error("Quantity must be between 1 and 1000");
      return;
    }

    setIsGenerating(true);
    
    try {
      const qrCodes = [];
      for (let i = 1; i <= formData.quantity; i++) {
        const qrData = {
          ...formData,
          serialNumber: `${formData.batchNumber}-${i.toString().padStart(4, '0')}`,
          id: `qr-${Date.now()}-${i}`
        };
        
        const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
          width: 200,
          margin: 2,
          color: {
            dark: '#1e293b',
            light: '#ffffff'
          }
        });
        
        qrCodes.push({
          ...qrData,
          qrCodeUrl
        });
      }
      
      // Store in localStorage for the QR codes page
      localStorage.setItem('generatedQRCodes', JSON.stringify(qrCodes));
      
      toast.success(`Successfully generated ${formData.quantity} QR codes!`);
      navigate('/qr-codes');
    } catch (error) {
      console.error('Error generating QR codes:', error);
      toast.error("Failed to generate QR codes. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Generate QR codes for your products</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">MP</span>
            </div>
            <span className="font-medium text-foreground">Manufacturer Portal</span>
          </div>
        </div>

        <Card className="shadow-medium border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Product Information</CardTitle>
            <CardDescription>
              Enter the product details to generate QR codes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={generateQRCodes} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    type="text"
                    placeholder="Enter product name"
                    value={formData.productName}
                    onChange={handleInputChange('productName')}
                    required
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number *</Label>
                  <Input
                    id="batchNumber"
                    type="text"
                    placeholder="Enter batch number"
                    value={formData.batchNumber}
                    onChange={handleInputChange('batchNumber')}
                    required
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
                  <Input
                    id="manufacturingDate"
                    type="date"
                    value={formData.manufacturingDate}
                    onChange={handleInputChange('manufacturingDate')}
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleInputChange('expiryDate')}
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="quantity">Quantity (Number of QR codes to generate)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={handleInputChange('quantity')}
                    className="h-11"
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum 1000 QR codes per batch
                  </p>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-smooth text-lg font-medium"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating QR Codes..." : "Generate QR Codes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;