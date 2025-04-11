interface LinkProps {
  id?: number
  emoji?: string
  title: string
  description: string
  url: string
  tags: string[]
  color: string
  createdAt: Date
}

interface TagProps {
  id?: string
  title: string
  createdAt: Date
}

interface BookmarkProps {
  title: string;
  url: string;
  selected?: boolean;
}

export type {
  LinkProps,
  BookmarkProps,
  TagProps
}

const initLink: LinkProps = {
  emoji: "",
  title: "",
  description: "",
  url: "",
  tags: [],
  color: 'hsl(239,  84%, 67%)',
  createdAt: new Date()
}

export {
  initLink
}