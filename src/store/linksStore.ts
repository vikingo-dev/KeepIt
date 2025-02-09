import { create } from 'zustand';
import type { languageList } from '@/i18n/ui';
import type { LinkProps } from '@models/general';
import { getAllLinks, searchLinks } from '@lib/db';

interface LinksStateProps {
  links: LinkProps[]
  setLinks: (newLinks: LinkProps[]) => void
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  getLinks: () => void
  handleSearch: (query: string, tags: string[]) => void
  lang: keyof typeof languageList
  setLang: (value: string) => void;
}

const useLinksStore = create<LinksStateProps>((set) => ({
  links: [],
  setLinks: (newLinks: LinkProps[]) =>
    set((state) => ({ ...state, links: newLinks })),
  isLoading: false,
  setIsLoading: (value: boolean) =>
    set((state) => ({ ...state, isLoading: value })),
  getLinks: async () => {
    set((state) => ({ ...state, isLoading: true }));
    const data = await getAllLinks();
    set((state) => ({ ...state, isLoading: false, links: data }));
  },
  handleSearch: async (query: string, tags: string[]) => {
    set((state) => ({ ...state, isLoading: true }));
    const results = await searchLinks(query, tags);
    set((state) => ({ ...state, isLoading: false, links: results }));
  },
  lang: "es",
  setLang: (value: keyof typeof languageList) =>
    set((state) => ({ ...state, lang: value })),
}));

export default useLinksStore;

