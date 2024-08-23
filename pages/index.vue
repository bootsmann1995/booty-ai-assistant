<template>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <!--- ALL YOUR CONTENT HERE --->
      <div class="bg-gunmetal-500 px-6 pt-[120px]">
        <div class="grid grid-cols-12 grid-rows-2 h-full">
          <div class="col-span-4 flex justify-end items-start flex-col">
            <p
              class="text-baby-powder-500 font-roboto lg:text-[20px] font-thin"
            >
              Meet Emma, your friendly AI assistant who's here to transform your
              learning experience.
            </p>
            <NuxtLink
              class="mt-2 font-thin lg:text-[16px] relative min-w-24 text-center text-baby-powder-500 py-3 px-0 border-b border-b-baby-powder-500 group"
              to="/feed"
            >
              <span>Start journey</span>
              <span class="pl-[20px]">-></span>
              <span
                class="absolute w-full ease-in-out transition-all duration-500 opacity-10 bg-baby-powder-500 left-0 bottom-0 h-0 group-hover:h-full"
              ></span>
            </NuxtLink>
          </div>
          <div class="col-start-6 col-span-7 flex items-end">
            <p class="lg:text-[46px] text-baby-powder-500 font-medium">
              Imagine having a dedicated tutor at your fingertips, always ready
              to guide you through engaging learning experiences.
            </p>
          </div>
        </div>
      </div>
      <div class="h-screen bg-gunmetal-500"></div>
      <div class="h-screen bg-gunmetal-500 -left-[20px]"></div>
    </div>
  </div>
</template>
<script setup lang="ts" async>
import { gsap } from "gsap";
const gs = useGsap();
const link = ref(null);

onMounted(() => {
  if (link.value) {
    // ScrollTrigger.
    gsap.to(link.value.$el, {
      fontSize: "150px",
      right: "50px",
      transformOrigin: "bottom",
      ease: "power3.inOut", // Adjust for smoother transition (optional)
      duration: 2, // Adjust duration for desired animation speed (optional)
      scrollTrigger: {
        markers: true, // Show trigger markers on scroll
        start: "top bottom", // Start animation when "link" enters viewport
        end: "bottom top", // End animation when "link" leaves viewport completely
        scrub: 2, // Continuously update animation based on scroll position
      },
    });
  }
});

definePageMeta({
  middleware: ["auth"],
});
</script>
