import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

import { Button } from '@ui/button';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';
import type { LinkProps } from '@models/general'

const LinkItem = ({ link, setSelectedLink }: { link: LinkProps, setSelectedLink: (item: LinkProps) => void }) => {
  const { lang } = useLinksStore()

  const translateLabels = useTranslations(
    lang
  );

  // Caluclar color contrase negro o blanco
  const getContrastColor = (hexcolor: string) => {
    const r = parseInt(hexcolor.slice(1, 3), 16);
    const g = parseInt(hexcolor.slice(3, 5), 16);
    const b = parseInt(hexcolor.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#ffffff';
  };

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
          color: getContrastColor((link.color)),
        }}>
        <button
          onClick={() => setSelectedLink(link)}
          className="flex-1 text-left w-full"
        >
          <h3 className="font-medium line-clamp-1 capitalize">
            {link.title || translateLabels("linkItem.title")}
          </h3>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => window.open(link.url, '_blank')}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}

export default LinkItem