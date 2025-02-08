export async function parseBookmarks(file: File) {
  const text = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/html"); 

  function parseNode(node: Element) {
    const children = [];
    node.querySelectorAll(":scope > DL > DT").forEach(dt => {
      const folder = dt.querySelector("H3");
      const link = dt.querySelector("A");

      if (folder) {
        children.push({
          title: folder.textContent,
          children: parseNode(dt)
        });
      } else if (link) {
        children.push({
          title: link.textContent,
          url: link.getAttribute("HREF")
        });
      }
    });
    return children;
  }

  return parseNode(doc.body);
}