import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./Navbar";
import { languageList } from "@/i18n/ui";
import SearchBar from "./SearchBar";
import LinksList from "./LinksList";
import useLinksStore from "@store/linksStore";
import ModalNewUser from "./ModalNewUser";
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
    <div className="min-h-screen relative">

      <ModalNewUser />
      <ToastContainer position="bottom-right" />

      <Navbar />
      <motion.div
        className="container mx-auto padContainer pt-24 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SearchBar />
        <AnimatePresence>
          {isLoading ? (
            <motion.div
              className="flex justify-center items-center h-64"
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
      <FloatingButton />
    </div>

  )
}

export default App