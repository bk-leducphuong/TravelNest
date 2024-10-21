
export const clickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      // Check if the click was outside the el and its children
      if (!(el == event.target || el.contains(event.target))) {
        // Call the provided method
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    // Remove the event listener when the directive is unmounted
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};