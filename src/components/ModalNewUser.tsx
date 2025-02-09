import { useEffect, useState } from 'react';
import { Sparkles, Bookmark } from 'lucide-react';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from '@ui/dialog';
import { configSite } from 'config';
import useLinksStore from '@store/linksStore';
import { useTranslations } from '@/i18n/utils';

const ModalNewUser = () => {
  const { lang } = useLinksStore()
  const [open, setOpen] = useState(false);
  const tokenKey = `${configSite.name} - newuser`;

  useEffect(() => {
    const isNewUser = !localStorage.getItem(tokenKey);
    if (isNewUser) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(tokenKey, 'true');
    setOpen(false);
  };

  const translateLabels = useTranslations(
    lang
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] md:max-w-[550px] bg-gradient-to-br from-gray-100 from-70% to-blue-100 rounded-2xl shadow-lg p-6">
        <DialogHeader className="text-center">
          <div className="flex justify-center items-center gap-2 text-slate-600">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <DialogTitle className="capitalize text-2xl font-bold">
              {translateLabels("modalNewUser.title")} {configSite.name}!
            </DialogTitle>
          </div>
          <p className="mt-2 text-gray-700 text-lg text-center">
            {translateLabels("modalNewUser.description1")} <span className="font-semibold text-blue-600">{translateLabels("modalNewUser.span")}</span>. {translateLabels("modalNewUser.description2")}
            <br />
            {translateLabels("modalNewUser.description3")} {configSite.name}, {translateLabels("modalNewUser.description4")}
          </p>
          <br />
          <p className="mt-2 text-gray-700 text-lg text-center">
            {translateLabels("modalNewUser.import")}
            <br />
            {translateLabels("modalNewUser.migrate")}
            <br />
            {translateLabels("modalNewUser.categories")}
          </p>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          <Bookmark className="w-12 h-12 text-blue-500 animate-bounce" />
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full shadow-md hover:scale-105 transition-transform"
          >
            {translateLabels("modalNewUser.button")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );

};

export default ModalNewUser;
