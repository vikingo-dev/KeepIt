import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./Navbar";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import LinksList from "./LinksList";
import { languageList } from "@/i18n/ui";
import ModalNewUser from "./ModalNewUser";
import useLinksStore from "@store/linksStore";
import FloatingButton from "./FloatingButton";

const App = ({ lang }: { lang: keyof typeof languageList }) => {
  const { links, isLoading, getLinks, setLang } = useLinksStore()

  useEffect(() => {
    getLinks()
  }, [])

  useEffect(() => {
    setLang(lang)
  }, [lang])

  return (
    <div className="min-h-screen flex flex-col">
      <ModalNewUser />
      <ToastContainer position="bottom-right" />
      <Navbar />

      <motion.div
        className="container mx-auto padContainer pt-24 pb-20 flex-1 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SearchBar />
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              className="flex justify-center items-center flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </motion.div>
          ) : (
            <LinksList links={links} onLinkDeleted={getLinks} onLinkUpdated={getLinks} />
          )}
        </AnimatePresence>
      </motion.div>

      <Footer />
      <FloatingButton />
    </div>
  );

}

export default App