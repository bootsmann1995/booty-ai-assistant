import { gsap } from "gsap";
import { ScrollSmoother, ScrollTrigger } from "gsap/all";

export const useGsap = () => {
  const smoother = ref<ScrollSmoother | null>(null);
  onMounted(async () => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    smoother.value = ScrollSmoother.create({
      smooth: 2,
      effects: true,
    });
  });

  onBeforeUnmount(() => {
    console.log("destroyed");
    smoother.value?.kill();
  });

  return {
    smoother,
    ScrollTrigger,
  };
};
