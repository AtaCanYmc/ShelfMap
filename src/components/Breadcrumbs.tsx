import { Fragment, type FC } from 'react'
import type { BreadcrumbNode } from '../types'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbsProps {
  path: BreadcrumbNode[]
  onNavigate: (containerId: string | null) => void
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ path, onNavigate }) => {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-slate-400 overflow-x-auto py-2 px-1 scrollbar-none">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1.5 hover:text-white transition-colors py-1 px-2 rounded-md hover:bg-slate-800 shrink-0 font-medium"
      >
        <Home className="w-3.5 h-3.5 text-indigo-400" />
        <span>Ana Konum</span>
      </button>

      {path.map((node, index) => {
        const isLast = index === path.length - 1
        return (
          <Fragment key={node.id}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <button
              onClick={() => onNavigate(node.id)}
              className={`py-1 px-2 rounded-md transition-colors shrink-0 max-w-[160px] truncate ${
                isLast
                  ? 'text-indigo-400 font-semibold bg-indigo-950/60 border border-indigo-800/50'
                  : 'hover:text-white hover:bg-slate-800'
              }`}
              title={node.name}
            >
              {node.name}
            </button>
          </Fragment>
        )
      })}
    </nav>
  )
}
