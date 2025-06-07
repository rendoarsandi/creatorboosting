'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface RecentActivityProps {
  data: {
    name: string
    amount: number
    sale_date: string
  }[]
}

export default function RecentActivity({ data }: RecentActivityProps) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Penjualan Baru: {item.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(item.sale_date).toLocaleTimeString()}
            </p>
          </div>
          <div className="ml-auto font-medium">+${item.amount.toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}