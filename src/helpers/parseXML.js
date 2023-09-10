export default function parseXML(xml) {
  const tree = new DOMParser().parseFromString(xml, 'text/xml');
  const mainTitle = tree.querySelector('channel title').textContent;
  const items = Array.from(tree.querySelectorAll('item')).map((i) => {
    const title = i.querySelector('title').textContent;
    const link = i.querySelector('link').textContent;
    return { title, link };
  });
  return { mainTitle, items };
}
