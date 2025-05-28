import { cn } from '@/lib/utils'

function ScoreBadge({ score }: { score: number }) {
  const getStyles = () => {
    if (score < 50) {
      return {
        bg: 'bg-red-100 text-red-700 border border-red-300',
      }
    } else if (score < 75) {
      return {
        bg: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      }
    } else {
      return {
        bg: 'bg-green-100 text-green-800 border border-green-300',
      }
    }
  }

  const { bg } = getStyles()

  return (
    <div
      className={cn(
        'px-2 py-[2px] text-xs font-medium rounded-md shadow-sm',
        bg
      )}
    >
      Product Score: {score}
    </div>
  )
}

export default ScoreBadge
