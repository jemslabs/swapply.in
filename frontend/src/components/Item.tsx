import type { ItemType } from '@/lib/types'
import { Button } from './ui/button'
import { Card } from './ui/card'


function Item({ item }: { item: ItemType }) {
  return (
    <Card className="p-0 flex flex-col h-[400px]">
      <div>
        <img
          src={item.image || ""}
          className="h-40 w-full rounded-xl object-cover"
          alt="Hidden Preview"
        />
      </div>
      
      <div className="flex flex-col justify-between flex-1">
        <div className="p-3">
          <h3 className="text-lg font-semibold truncate">{item.title}</h3>
          <div className="text-xs text-muted-foreground mb-3">
            <span>{item.company}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
          <div className="text-sm text-muted-foreground mt-2">
            <span className="font-medium text-foreground">
              {item.currencyType} {item.currentPrice}
            </span>
            {item.originalPrice && item.originalPrice !== item.currentPrice && (
              <span className="line-through ml-2">
                {item.currencyType} {item.originalPrice}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2 px-3 pb-3 ">
          <Button className='w-full'>View</Button>
        </div>
      </div>
    </Card>
  )
}

export default Item
