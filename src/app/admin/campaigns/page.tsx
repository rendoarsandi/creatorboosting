import CampaignTable from '@/components/ui/admin/campaign-table'

export default function AdminCampaignsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Manajemen Kampanye</h1>
      <p className="text-muted-foreground">Lihat dan kelola semua kampanye di platform.</p>
      <CampaignTable />
    </div>
  )
}