// import MainLayout from '@/components/layout/main-layout';
// import ItemForm from '@/components/items/item-form';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useLocation } from 'wouter';

// export default function AddItem() {
//   const [, setLocation] = useLocation();

//   const handleSuccess = () => {
//     setLocation('/dashboard');
//   };

//   return (
//     <MainLayout title="Add Item">
//       <div className="p-6">
//         <Card className="max-w-2xl">
//           <CardHeader>
//             <CardTitle>Add New Item</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ItemForm onSuccess={handleSuccess} />
//           </CardContent>
//         </Card>
//       </div>
//     </MainLayout>
//   );
// }


import MainLayout from '@/components/layout/main-layout';
import ItemForm from '@/components/items/item-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocation, useSearch } from 'wouter';

export default function AddItem() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);

  // allowed categories
  const allowedCategories = [
    "groceries",
    "medicines",
    "cosmetics",
    "household",
    "other",
  ] as const;

  const rawCategory = params.get("category");
  const validCategory = allowedCategories.includes(rawCategory as any)
    ? (rawCategory as typeof allowedCategories[number])
    : "groceries";

  // scanned data passed to form
  const scannedData = {
    barcode: params.get("barcode") || "",
    name: params.get("name") || "",
    brand: params.get("brand") || "",
    category: validCategory,
  };

  const handleSuccess = () => {
    setLocation('/dashboard');
  };

  return (
    <MainLayout title="Add Item">
      <div className="p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Add New Item</CardTitle>
          </CardHeader>
          <CardContent>

            {/* pass scanned values into form */}
            <ItemForm scannedData={scannedData} onSuccess={handleSuccess} />

          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
