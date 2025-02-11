import { configSite } from "config";
import { FaGithub } from "react-icons/fa";

import useLinksStore from "@store/linksStore";
import { useTranslations } from "@/i18n/utils";

const Footer = () => {
  const { lang } = useLinksStore();
  const translateLabels = useTranslations(lang);

  return (
    <footer className="bg-background/80 backdrop-blur-lg border-t w-full px-6 py-1 overflow-x-hidden">
      <div className="max-w-screen-xl py-8 marContainer">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center">
          {/* GitHub Icon */}
          <div className="flex justify-center sm:justify-start">
            <a
              className="hover:bg-gray-200 aspect-square p-1 rounded-md hover:scale-105 transition-transform"
              href="https://github.com/vikingo-dev/KeepIt.git"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="w-7 h-7 text-black" />
            </a>
          </div>

          {/* App Version */}
          <p className="text-sm text-gray-500 my-4 sm:my-0">
            {configSite.version}
          </p>

          {/* Credits */}
          <p className="text-sm text-gray-500">
            {translateLabels("footer.made")}{" "}
            <a
              className="text-black hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/vikingo-dev"
            >
              {translateLabels("footer.by")}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
