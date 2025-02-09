import { Input } from '@ui/input';
import { Label } from '@ui/label';
import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { ScrollArea } from '@ui/scroll-area';
import type { BookmarkProps } from '@models/general';
import { pastelizeColorPastel } from '@/utils/formattedColor';

interface ImportBookmarksProps {
  bookmarks: BookmarkProps[]
  setBookmarks: (newItems: BookmarkProps[]) => void
  currentBookmark: BookmarkProps
  setCurrentBookmark: (newItems: BookmarkProps) => void
  description: string
  setDescription: (newText: string) => void
  color: string
  setColor: (newColor: string) => void
  isImporting: boolean
  selectFile: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
  startImport: () => void
  saveBookmarks: () => void
  cancelImport: () => void
  currentIndex: number
}

const ImportBookmarks = ({ bookmarks, setBookmarks, currentBookmark, setCurrentBookmark, isImporting, selectFile, startImport, saveBookmarks, description, setDescription, color, setColor, cancelImport, currentIndex }: ImportBookmarksProps) => {

  const selectAll = (all = true) => {
    setBookmarks(bookmarks.map(b => ({ ...b, selected: all })));
  };

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(pastelizeColorPastel(e?.target?.value))
  }

  return (
    <>
      {!bookmarks.length && !isImporting && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Importa marcadores desde un archivo HTML exportado de tu navegador.
            <br />
            <br />
            Si usas un navegador basado en Chromium, ve a <span className="font-medium">chrome://bookmarks/</span>,
            haz clic en los tres puntos ⋮ y selecciona "Exportar marcadores".
          </p>
          <div>
            <Input
              type="file"
              accept=".html"
              onChange={selectFile}
              className="hidden"
              id="bookmarks-file"
            />
            <label htmlFor="bookmarks-file">
              <Button asChild>
                <span>Seleccionar archivo de Marcadores (html)</span>
              </Button>
            </label>
          </div>
        </div>
      )}

      {bookmarks.length > 0 && !isImporting && (
        <div className="space-y-4">
          <div className='flex flex-col md:flex-row gap-2 justify-between items-center'>
            <p className="text-sm text-muted-foreground">
              Selecciona que links vas a importar.
            </p>
            <Button onClick={() => selectAll(bookmarks.filter(b => b.selected).length !== bookmarks?.length)}>
              {bookmarks.filter(b => b.selected).length !== bookmarks?.length ? "Seleccionar Todos" : "Deseleccionar todos"}
            </Button>
          </div>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-2">
              {bookmarks.map((bookmark, index) => (
                <div className='flex-col gap-1'>
                  <div key={index} className="flex items-start space-x-3 max-w-[400px]">
                    <Checkbox
                      id={`bookmark-${index}`}
                      checked={bookmark.selected}
                      className="cursor-pointer"
                      onCheckedChange={(checked) => {
                        setBookmarks(bookmarks.map((b, i) =>
                          i === index ? { ...b, selected: !!checked } : b
                        ));
                      }}
                    />
                    <Label
                      htmlFor={`bookmark-${index}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      <div className="font-medium text-ellipsis">{bookmark.title || "Sin título"}</div>
                      <div className="text-xs text-muted-foreground mt-1 text-ellipsis text-nowrap">
                        {bookmark.url}
                      </div>
                    </Label>
                  </div>
                  <hr className='my-2' />
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-between">
            <Button variant='outline' onClick={cancelImport}>
              Cancelar
            </Button>
            <Button onClick={startImport}>
              Marcadores seleccionados ({bookmarks.filter(b => b.selected).length})
            </Button>
          </div>
        </div>
      )}

      {isImporting && currentBookmark && (
        <div className="space-y-4">
          {currentIndex + 1} de{bookmarks.filter(b => b.selected).length}
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={currentBookmark.title}
              onChange={(e) => setCurrentBookmark({ ...currentBookmark, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={currentBookmark.url}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input
              value={description || "Sin Descripción"}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ingresa una descripción..."
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={handleColor}
                className="w-10 h-10 p-1 rounded-md"
              />
              <div className='w-full h-10 rounded-md' style={{ backgroundColor: color }} />
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <Button variant='outline' onClick={cancelImport}>
              Cancelar
            </Button>
            <Button onClick={saveBookmarks}>
              Save & Continue
            </Button>
          </div>
        </div>
      )}</>
  )
}

export default ImportBookmarks