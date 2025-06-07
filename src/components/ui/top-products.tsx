'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface TopProductsProps {
  data: {
    name: string
    count: number
  }[]
}

export default function TopProducts({ data }: TopProductsProps) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.name}</p>
          </div>
          <div className="ml-auto font-medium">+{item.count} penjualan</div>
        </div>
      ))}
    </div>
  )
}