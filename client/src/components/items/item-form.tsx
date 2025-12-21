// import { useState } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { apiRequest } from '@/lib/queryClient';
// import { useToast } from '@/hooks/use-toast';

// const itemSchema = z.object({
//   name: z.string().min(1, 'Item name is required'),
//   brand: z.string().optional(),
//   category: z.enum(['groceries', 'medicines', 'cosmetics', 'household', 'other']),
//   quantity: z.number().min(1, 'Quantity must be at least 1'),
//   expiryDate: z.string().min(1, 'Expiry date is required'),
//   notes: z.string().optional(),
// });

// type ItemFormData = z.infer<typeof itemSchema>;

// interface ItemFormProps {
//   onSuccess?: () => void;
// }

// export default function ItemForm({ onSuccess }: ItemFormProps) {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const form = useForm<ItemFormData>({
//     resolver: zodResolver(itemSchema),
//     defaultValues: {
//       name: '',
//       brand: '',
//       category: 'groceries',
//       quantity: 1,
//       expiryDate: '',
//       notes: '',
//     },
//   });

//   const createItemMutation = useMutation({
//     mutationFn: (data: ItemFormData) => 
//       apiRequest('POST', '/api/items', data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['/api/items'] });
//       queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
//       toast({ title: 'Success', description: 'Item added successfully' });
//       form.reset();
//       onSuccess?.();
//     },
//     onError: (error: any) => {
//       toast({ 
//         title: 'Error', 
//         description: error.message || 'Failed to add item',
//         variant: 'destructive' 
//       });
//     },
//   });

//   const onSubmit = (data: ItemFormData) => {
//     createItemMutation.mutate(data);
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Item Name</FormLabel>
//                 <FormControl>
//                   <Input 
//                     placeholder="e.g., Milk, Aspirin, Face Cream"
//                     data-testid="input-item-name"
//                     {...field} 
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
          
//           <FormField
//             control={form.control}
//             name="brand"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Brand (Optional)</FormLabel>
//                 <FormControl>
//                   <Input 
//                     placeholder="e.g., Organic Farm"
//                     data-testid="input-brand"
//                     {...field} 
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="category"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Category</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger data-testid="select-category">
//                       <SelectValue placeholder="Select Category" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="groceries">Groceries</SelectItem>
//                     <SelectItem value="medicines">Medicines</SelectItem>
//                     <SelectItem value="cosmetics">Cosmetics</SelectItem>
//                     <SelectItem value="household">Household</SelectItem>
//                     <SelectItem value="other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
          
//           <FormField
//             control={form.control}
//             name="quantity"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Quantity</FormLabel>
//                 <FormControl>
//                   <Input
//                     type="number"
//                     min="1"
//                     data-testid="input-quantity"
//                     {...field}
//                     onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="expiryDate"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Expiry Date</FormLabel>
//               <FormControl>
//                 <Input
//                   type="date"
//                   data-testid="input-expiry-date"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="notes"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Notes (Optional)</FormLabel>
//               <FormControl>
//                 <Textarea
//                   placeholder="Additional notes about this item..."
//                   data-testid="textarea-notes"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="flex gap-4">
//           <Button
//             type="submit"
//             disabled={createItemMutation.isPending}
//             data-testid="button-submit"
//           >
//             {createItemMutation.isPending ? 'Adding...' : 'Add Item'}
//           </Button>
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => form.reset()}
//             data-testid="button-reset"
//           >
//             Reset
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }



import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// ⭐ Add barcode to schema
const itemSchema = z.object({
  barcode: z.string().min(1, "Barcode is required"),
  name: z.string().min(1, 'Item name is required'),
  brand: z.string().optional(),
  category: z.enum(['groceries', 'medicines', 'cosmetics', 'household', 'other']),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  notes: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemFormProps {
  onSuccess?: () => void;
  scannedData?: Partial<ItemFormData>;
}

export default function ItemForm({ onSuccess, scannedData }: ItemFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      barcode: scannedData?.barcode || "",
      name: scannedData?.name || "",
      brand: scannedData?.brand || "",
      category: scannedData?.category || "groceries",
      quantity: 1,
      expiryDate: "",
      notes: "",
    },
  });

  const createItemMutation = useMutation({
    mutationFn: (data: ItemFormData) => apiRequest('POST', '/api/items', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
      toast({ title: 'Success', description: 'Item added successfully' });
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ItemFormData) => {
    createItemMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* ⭐ Barcode Field */}
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input placeholder="Scan or enter barcode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Existing Fields Below */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="groceries">Groceries</SelectItem>
                    <SelectItem value="medicines">Medicines</SelectItem>
                    <SelectItem value="cosmetics">Cosmetics</SelectItem>
                    <SelectItem value="household">Household</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Item</Button>
      </form>
    </Form>
  );
}
