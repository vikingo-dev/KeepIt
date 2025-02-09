import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from '@ui/dialog';
import { configSite } from 'config';
import { Sparkles, Bookmark } from 'lucide-react';

const ModalNewUser = () => {
  const [open, setOpen] = useState(false);
  const tokenKey = `${configSite.title} - newuser`;

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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] md:max-w-[550px] bg-gradient-to-br from-pink-100 to-blue-100 rounded-2xl shadow-lg p-6">
        <DialogHeader className="text-center">
          <div className="flex justify-center items-center gap-2 text-pink-600">
            <Sparkles className="w-6 h-6 animate-pulse" />
            <DialogTitle className="capitalize text-2xl font-bold">¡Bienvenido a {configSite.title}!</DialogTitle>
          </div>
          <p className="mt-2 text-gray-700 text-lg">
            📌 Organiza y gestiona tus enlaces de manera <span className="font-semibold text-blue-600">súper eficiente</span>.
            Sabemos que encontrar un sitio web entre cientos de marcadores es un caos.
            Con {configSite.title}, todo estará en su lugar, listo para cuando lo necesites.
          </p>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          <Bookmark className="w-12 h-12 text-yellow-500 animate-bounce" />
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full shadow-md hover:scale-105 transition-transform"
          >
            🎉 ¡Entendido, quiero empezar!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNewUser;
