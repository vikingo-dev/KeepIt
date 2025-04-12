import { X } from 'lucide-react'
import type { TagProps } from '@models/links'
import { AnimatePresence, motion } from 'framer-motion'

const TagsSelected = ({ tags, removeTag }: { tags: TagProps[], removeTag: (tag: TagProps) => void }) => {
  return (
    <AnimatePresence>
      {tags.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {tags.map((tag) => (
            <motion.button
              key={tag.id}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-sm capitalize"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              layout
              onClick={() => removeTag(tag)}
            >
              {tag.title}
              <X className="w-3 h-3" />
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TagsSelected