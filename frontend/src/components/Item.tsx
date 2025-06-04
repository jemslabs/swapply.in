import type { ItemType } from '@/lib/types'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Link } from 'react-router-dom'
import ScoreBadge from './ScoreBadge'
import { Rocket } from 'lucide-react'
import { useApp } from '@/stores/useApp'
import { useState } from 'react'

function Item({ item, isBoost }: { item: ItemType | undefined, isBoost: boolean }) {
  if (!item) return null
  const [isBoosting, setIsBoosting] = useState(false)

  const hasDiscount =
    item.originalPrice &&
    item.originalPrice !== item.currentPrice &&
    item.originalPrice > item.currentPrice

  const discountPercent = hasDiscount
    ? Math.round(((item.originalPrice - item.currentPrice) / item.originalPrice) * 100)
    : 0

  const { boostItem } = useApp()
  const handleBoostItem = async () => {
    setIsBoosting(true)
    await boostItem(item?.id)
    setIsBoosting(false)
  }

  const isBoosted = item?.boostedItem?.itemId === item?.id
  return (
    <Card className={`p-2 flex flex-col relative ${isBoosted && 'border-[#c084fc] border-2'}`}>
      {isBoosted && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-[#c084fc] text-black text-xs px-2 py-1 shadow-md rounded-full flex items-center gap-1">
            <Rocket className="h-3 w-3" />
            Boosted
          </Badge>
        </div>
      )}

      <div className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-md">
        <ScoreBadge score={item.score ?? 0} />
      </div>

      <img
        src={item.image || ''}
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

          {isBoost && (
            <div className="w-full my-2">
              {isBoosting ? (
                <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary animate-pulse">
                  <Rocket className="h-4 w-4 boosting" />
                  Boosting...
                </div>
              ) : isBoosted ? (
                <Button disabled className="w-full  text-white" variant={"outline"}>
                  <Rocket className="h-4 w-4" />
                  Boosted
                </Button>
              ) : (
                <Button className="w-full" variant="outline" onClick={handleBoostItem}>
                  <Rocket className="h-4 w-4" />
                  Boost
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default Item
