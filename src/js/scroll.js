export function scrollToTop(scroll = 0) {
  window.scrollTo({
    top: scroll,
    behavior: "smooth"
  });
}