import { motion } from 'framer-motion';
import { ChevronsUpDown, ExternalLink } from 'lucide-react';

import { Button } from '@ui/button';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import type { LinkProps } from '@models/general'
import { getDarkerColor } from '@/utils/formattedColor';

const LinkItem = ({ link, setSelectedLink }: { link: LinkProps, setSelectedLink: (item: LinkProps) => void }) => {
  const { lang } = useLinksStore()

  const translateLabels = useTranslations(
    lang
  );

  return (
    <motion.div
      key={link.id}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative"
    >
      <div className={`rounded-lg shadow-sm hover:shadow-lg transition-shadow px-3 py-1 flex items-center gap-3 max-w-[400px] min-w-[250px] flex-1`}
        style={{
          backgroundColor: link?.color || "white",
          color: getDarkerColor((link.color), 0.35),
        }}>
        <button
          onClick={() => window.open(link.url, '_blank')}
          className="flex-1 text-left w-full"
        >
          <h3 className="font-medium line-clamp-1 capitalize text-sm">
            {link.title || translateLabels("linkItem.title")}
          </h3>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setSelectedLink(link)}
        >
          <ChevronsUpDown className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  )
}

export default LinkItem