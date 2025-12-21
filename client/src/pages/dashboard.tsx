import MainLayout from '@/components/layout/main-layout';
import ItemStats from '@/components/items/item-stats';
import ItemTable from '@/components/items/item-table';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Plus, Scan } from 'lucide-react';

export default function Dashboard() {
  return (
    <MainLayout title="Dashboard">
      <div className="p-6 space-y-6">
        <ItemStats />
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link href="/add-item">
            <Button data-testid="button-add-item">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </Link>
          <Link href="/scanner">
            <Button variant="outline" data-testid="button-scan">
              <Scan className="h-4 w-4 mr-2" />
              Scan Barcode
            </Button>
          </Link>
        </div>

        <ItemTable />
      </div>
    </MainLayout>
  );
}
