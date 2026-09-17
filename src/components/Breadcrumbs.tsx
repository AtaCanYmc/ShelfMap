import { Fragment, type FC } from 'react'
import type { BreadcrumbNode } from '../types'
import { Home } from 'lucide-react'
import { useI18n } from '../services/i18n'

interface BreadcrumbsProps {
  path: BreadcrumbNode[]
  onNavigate: (containerId: string | null) => void
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ path, onNavigate }) => {
  const { t } = useI18n()

  return (
    <nav className="flex items-center text-xs text-slate-600 dark:text-slate-400 overflow-x-auto py-1.5 px-0.5 scrollbar-none font-mono">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors py-1 px-2 rounded hover:bg-slate-200 dark:hover:bg-[#161c28] shrink-0 font-medium"
      >
        <Home className="w-3.5 h-3.5 text-amber-500" />
        <span>{t('root').split('/')[0].trim()}</span>
      </button>

      {path.map((node, index) => {
        const isLast = index === path.length - 1
        return (
          <Fragment key={node.id}>
            <span className="text-slate-500 dark:text-slate-600 px-1 select-none">/</span>
            <button
              onClick={() => onNavigate(node.id)}
              className={`py-1 px-2 rounded transition-colors shrink-0 max-w-[180px] truncate ${
                isLast
                  ? 'text-amber-500 font-semibold bg-amber-100 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/40'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#161c28]'
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
