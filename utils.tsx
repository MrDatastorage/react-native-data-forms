export const getColorByBgColor = bgColor => {
  if (!bgColor) {
    return "#000";
  }
  return parseInt(bgColor.replace("#", ""), 16) > 0xffffff / 2
    ? "#000"
    : "#fff";
};

export const trim1 = (s: string) => {
  const removeFirstChar = s.substr(1);
  const removeLastChar = removeFirstChar.substr(0, removeFirstChar.length - 1);
  return removeLastChar;
};

export function uniq(a) {
  var prims = { boolean: {}, number: {}, string: {} },
    objs = [];

  return a.filter(function(item) {
    var type = typeof item;
    if (type in prims)
      return prims[type].hasOwnProperty(item)
        ? false
        : (prims[type][item] = true);
    else return objs.indexOf(item) >= 0 ? false : objs.push(item);
  });
}
