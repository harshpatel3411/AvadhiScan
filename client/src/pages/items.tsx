import MainLayout from '@/components/layout/main-layout';
import ItemTable from '@/components/items/item-table';

export default function Items() {
  return (
    <MainLayout title="My Items">
      <div className="p-6">
        <ItemTable />
      </div>
    </MainLayout>
  );
}
