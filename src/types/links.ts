interface LinkProps {
  id?: number
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