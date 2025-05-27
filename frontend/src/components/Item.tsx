import type { ItemType } from '@/lib/types'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'

function Item({ item }: { item: ItemType | undefined }) {
  if (!item) return null

  const hasDiscount =
    item.originalPrice &&
    item.originalPrice !== item.currentPrice &&
    item.originalPrice > item.currentPrice

  const discountPercent = hasDiscount
    ? Math.round(((item.originalPrice - item.currentPrice) / item.originalPrice) * 100)
    : 0

  return (
    <Card className="p-2 flex flex-col max-w-sm">
      <img
        src={item.image || ""}
        alt={item.title}
        className="h-36 w-full rounded-lg object-cover mb-2"
      />

      <div className="flex flex-col flex-1">
        <div className="flex-1 flex flex-col justify-between">
          <div className="mb-1">
            <h3 className="text-md font-semibold truncate">{item.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{item.company}</p>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold">
              {item.currencyType} {item.currentPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-xs line-through text-gray-500">
                  {item.currencyType} {item.originalPrice.toLocaleString()}
                </span>
                <Badge variant="outline" className="text-xs text-green-600 border-green-500">
                  Save {discountPercent}%
                </Badge>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-1 text-xs my-4">
            <Badge variant="secondary" className="uppercase">
              {item.condition}
            </Badge>
            <Badge variant="secondary" className="uppercase">
              {item.category}
            </Badge>
            {item.hasBill && (
              <Badge variant="secondary" className="uppercase">
                Bill Available
              </Badge>
            )}
            {item.isSwapped && (
              <Badge variant="secondary" className="uppercase">
                Swappable
              </Badge>
            )}
          </div>
        </div>

        <div>
          <Link to={`/item/${item.id}`} className="w-full">
            <Button className="w-full text-sm py-1">View Details</Button>
          </Link>
        </div>
      </div>
    </Card>


  )
}

export default Item
