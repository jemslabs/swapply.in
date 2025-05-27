import type { ItemType } from '@/lib/types'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'

function Item({ item }: { item: ItemType | undefined }) {
  const hasDiscount =
    item?.originalPrice &&
    item.originalPrice !== item.currentPrice &&
    item.originalPrice > item.currentPrice

  const discountPercent = hasDiscount
    ? Math.round(
        ((item.originalPrice - item.currentPrice) / item.originalPrice) * 100
      )
    : 0

  return (
    <Card className="p-0 flex flex-col h-[400px]">
      <div>
        <img
          src={item?.image || ""}
          className="h-40 w-full rounded-xl object-cover"
          alt="Hidden Preview"
        />
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div className="p-3">
          <h3 className="text-lg font-semibold truncate">{item?.title}</h3>
          <div className="text-xs text-muted-foreground mb-1">
            <span>{item?.company}</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {item?.description}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-bold text-white">
              {item?.currencyType} {item?.currentPrice}
            </span>

            {hasDiscount && (
              <>
                <span className="text-sm line-through text-gray-500">
                  {item?.currencyType} {item?.originalPrice}
                </span>
                <Badge variant="outline" className="text-xs text-green-600 border-green-500">
                  Save {discountPercent}%
                </Badge>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 px-3 pb-3">
          <Link to={`/item/${item?.id}`} className="w-full">
          <Button className="w-full">View</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default Item
