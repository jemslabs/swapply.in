import { cn } from '@/lib/utils'

function getScoreColor(score: number) {
  if (score >= 80) return 'bg-green-100 text-green-800'
  if (score >= 50) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full shadow-sm',
        getScoreColor(score)
      )}
    >
      {score} <span className="text-xs font-normal opacity-80">/ 100</span>
    </div>
  )
}

export default ScoreBadge
