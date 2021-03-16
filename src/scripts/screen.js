export default {
  isTablet() {
    let width = window.innerWidth;
    return width <= 1024 && width > 640;
  },
  isDesktop() {
    return window.innerWidth > 896;
  },
  isMobile() {
    return window.innerWidth <= 1025;
  }
};
