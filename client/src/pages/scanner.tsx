// import { useState } from 'react';
// import { useMutation } from '@tanstack/react-query';
// import MainLayout from '@/components/layout/main-layout';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { apiRequest } from '@/lib/queryClient';
// import { useToast } from '@/hooks/use-toast';
// import { Camera, Search } from 'lucide-react';

// interface BarcodeProduct {
//   title: string;
//   brand?: string;
//   category?: string;
//   description?: string;
// }

// export default function Scanner() {
//   const [manualBarcode, setManualBarcode] = useState('');
//   const [product, setProduct] = useState<BarcodeProduct | null>(null);
//   const { toast } = useToast();

//   const lookupMutation = useMutation({
//     mutationFn: (barcode: string) => 
//       apiRequest('POST', '/api/barcode/lookup', { barcode }),
//     onSuccess: async (response) => {
//       const productData = await response.json();
//       if (productData) {
//         setProduct(productData);
//         toast({ title: 'Success', description: 'Product found!' });
//       } else {
//         toast({ 
//           title: 'Not Found', 
//           description: 'Product not found in database',
//           variant: 'destructive' 
//         });
//       }
//     },
//     onError: (error: any) => {
//       toast({ 
//         title: 'Error', 
//         description: error.message || 'Failed to lookup barcode',
//         variant: 'destructive' 
//       });
//     },
//   });

//   const handleLookup = () => {
//     if (!manualBarcode.trim()) {
//       toast({ 
//         title: 'Error', 
//         description: 'Please enter a barcode',
//         variant: 'destructive' 
//       });
//       return;
//     }
//     lookupMutation.mutate(manualBarcode);
//   };

//   return (
//     <MainLayout title="Barcode Scanner">
//       <div className="p-6 space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Scan Barcode</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Camera preview placeholder */}
//             <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
//               <div className="text-center">
//                 <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                 <p className="text-muted-foreground">Camera preview will appear here</p>
//                 <p className="text-sm text-muted-foreground mt-2">
//                   Camera functionality requires additional implementation
//                 </p>
//               </div>
//             </div>
            
//             {/* Manual barcode entry */}
//             <div className="space-y-2">
//               <Label htmlFor="barcode">Or enter barcode manually</Label>
//               <div className="flex gap-2">
//                 <Input
//                   id="barcode"
//                   placeholder="Enter barcode number"
//                   value={manualBarcode}
//                   onChange={(e) => setManualBarcode(e.target.value)}
//                   data-testid="input-barcode"
//                 />
//                 <Button
//                   onClick={handleLookup}
//                   disabled={lookupMutation.isPending}
//                   data-testid="button-lookup"
//                 >
//                   <Search className="h-4 w-4 mr-2" />
//                   {lookupMutation.isPending ? 'Looking up...' : 'Lookup'}
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Product result */}
//         {product && (
//           <Card>
//             <CardHeader>
//               <CardTitle>Product Found</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <div>
//                   <Label>Product Name</Label>
//                   <p className="font-medium" data-testid="text-product-name">{product.title}</p>
//                 </div>
//                 {product.brand && (
//                   <div>
//                     <Label>Brand</Label>
//                     <p data-testid="text-product-brand">{product.brand}</p>
//                   </div>
//                 )}
//                 {product.category && (
//                   <div>
//                     <Label>Category</Label>
//                     <p data-testid="text-product-category">{product.category}</p>
//                   </div>
//                 )}
//                 {product.description && (
//                   <div>
//                     <Label>Description</Label>
//                     <p className="text-sm text-muted-foreground">{product.description}</p>
//                   </div>
//                 )}
//               </div>
              
//               <div className="mt-4">
//                 <Button data-testid="button-add-product">
//                   Add This Item
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </MainLayout>
//   );
// }




import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Camera, Search } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode"; // ⭐ added
import { useLocation } from "wouter"; // ⭐ added

interface BarcodeProduct {
  name: string;   // ⭐ changed from title → name
  brand?: string;
  category?: string;
}

export default function Scanner() {
  const [manualBarcode, setManualBarcode] = useState("");
  const [product, setProduct] = useState<BarcodeProduct | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation(); // ⭐ added

  // ⭐ Mutation is now only used for manual lookup
  const lookupMutation = useMutation({
    mutationFn: async (barcode: string) =>
      await apiRequest("GET", `/api/products/${barcode}`), // ⭐ changed to GET
    onSuccess: async (response) => {
      const productData = await response.json();
      if (productData.exists) {
        setProduct(productData.product);
        toast({ title: "Success", description: "Product found!" });
      } else {
        toast({
          title: "Not Found",
          description: "Product not found in database",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to lookup barcode",
        variant: "destructive",
      });
    },
  });

  const handleLookup = () => {
    if (!manualBarcode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a barcode",
        variant: "destructive",
      });
      return;
    }
    lookupMutation.mutate(manualBarcode);
  };

  // ⭐ Fully implemented camera scanner
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "camera-preview", // div id
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(async (decodedText: string) => {
      console.log("Scanned:", decodedText);

      try {
        const response = await apiRequest("GET", `/api/products/${decodedText}`);
        const result = await response.json();

        if (result.exists) {
          const product = result.product;

          // ⭐ Redirect to AddItem with autofill
          setLocation(
            `/additem?barcode=${decodedText}&name=${product.name}&brand=${product.brand ?? ""}&category=${product.category}`
          );
        } else {
          // ⭐ Still redirect with only barcode
          setLocation(`/additem?barcode=${decodedText}`);
        }

        scanner.clear(); // ⭐ stop scanner
      } catch (error) {
        console.error(error);
      }
    });

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <MainLayout title="Barcode Scanner">
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Scan Barcode</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ⭐ LIVE CAMERA PREVIEW */}
            <div
              id="camera-preview"
              className="rounded-lg h-64 border border-muted flex items-center justify-center"
            ></div>

            {/* Manual barcode entry */}
            <div className="space-y-2">
              <Label htmlFor="barcode">Or enter barcode manually</Label>
              <div className="flex gap-2">
                <Input
                  id="barcode"
                  placeholder="Enter barcode number"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  data-testid="input-barcode"
                />
                <Button
                  onClick={handleLookup}
                  disabled={lookupMutation.isPending}
                  data-testid="button-lookup"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {lookupMutation.isPending ? "Looking up..." : "Lookup"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product result display (manual lookup only) */}
        {product && (
          <Card>
            <CardHeader>
              <CardTitle>Product Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label>Product Name</Label>
                  <p className="font-medium">{product.name}</p>
                </div>

                {product.brand && (
                  <div>
                    <Label>Brand</Label>
                    <p>{product.brand}</p>
                  </div>
                )}

                {product.category && (
                  <div>
                    <Label>Category</Label>
                    <p>{product.category}</p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Button
                  onClick={() =>
                    setLocation(
                      `/additem?barcode=${manualBarcode}&name=${product.name}&brand=${product.brand}&category=${product.category}`
                    )
                  }
                  data-testid="button-add-product"
                >
                  Add This Item
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
