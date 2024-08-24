<template>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <!--- ALL YOUR CONTENT HERE --->
      <div class="bg-gunmetal-500 px-6 pt-[120px] gradient-1">
        <div class="grid grid-cols-12 grid-rows-2 h-full">
          <div
            class="col-span-4 flex justify-end items-start flex-col"
            data-lag="0.2"
          >
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
            <p
              data-lag="0.2"
              class="lg:text-[46px] text-baby-powder-500 font-medium"
            >
              Imagine having a dedicated tutor at your fingertips, always ready
              to guide you through engaging learning experiences.
            </p>
          </div>
          <div
            ref="animateTextElTrigger"
            data-lag="0.3"
            class="col-span-full row-start-2 flex-col gap-y-3 text-baby-powder-500 flex items-center justify-center relative"
          ></div>
        </div>
      </div>
      <div
        ref="animateTrigger"
        class="h-screen bg-gunmetal-500 gradient-2 -mt-[1px] relative"
      >
        <div
          ref="animateEl"
          class="absolute left-1/2 w-52 -translate-x-1/2 top-1/4 -translate-y-1/2 aspect-video bg-amber-600"
        ></div>
      </div>
      <div
        class="h-[200vh] bg-gunmetal-500 gradient-3 -mt-[1px] -left-[20px]"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts" async>
import { gsap } from "gsap";
const gs = useGsap();
const animateTrigger = ref(null);
const animateEl = ref(null);

const animateTextElTrigger = ref(null);
const animateTextEl1 = ref(null);
const animateTextEl2 = ref(null);

onMounted(() => {
  animateItem();
});

const animateItem = () => {
  if (animateTrigger.value && animateEl.value) {
    const tl = gsap.timeline({
      scrollTrigger: {
        scrub: 1,
        pin: true,
        trigger: animateTrigger.value,
        start: "50% 50%",
        end: "bottom -100%",
      },
    });

    tl.to(animateEl.value, {
      width: "100vw",
      translateY: "0%",
      top: "50%",
    });
  }
};

definePageMeta({
  middleware: ["auth"],
});
</script>
<style lang="scss">
.gradient-1 {
  background: rgb(30, 59, 72);
  background: -moz-linear-gradient(
    0deg,
    rgba(30, 59, 72, 1) 0%,
    rgba(19, 38, 47, 1) 100%
  );
  background: -webkit-linear-gradient(
    0deg,
    rgba(30, 59, 72, 1) 0%,
    rgba(19, 38, 47, 1) 100%
  );
  background: linear-gradient(
    0deg,
    rgba(30, 59, 72, 1) 0%,
    rgba(19, 38, 47, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#1e3b48",endColorstr="#13262f",GradientType=1);
}

.gradient-2 {
  background: rgb(171, 129, 205);
  background: -moz-linear-gradient(
    0deg,
    rgba(171, 129, 205, 1) 0%,
    rgba(30, 59, 72, 1) 100%
  );
  background: -webkit-linear-gradient(
    0deg,
    rgba(171, 129, 205, 1) 0%,
    rgba(30, 59, 72, 1) 100%
  );
  background: linear-gradient(
    0deg,
    rgba(171, 129, 205, 1) 0%,
    rgba(30, 59, 72, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ab81cd",endColorstr="#1e3b48",GradientType=1);
}

.gradient-3 {
  background: rgb(118, 34, 72);
  background: -moz-linear-gradient(
    0deg,
    rgba(118, 34, 72, 1) 0%,
    rgba(171, 129, 205, 1) 100%
  );
  background: -webkit-linear-gradient(
    0deg,
    rgba(118, 34, 72, 1) 0%,
    rgba(171, 129, 205, 1) 100%
  );
  background: linear-gradient(
    0deg,
    rgba(118, 34, 72, 1) 0%,
    rgba(171, 129, 205, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#762248",endColorstr="#ab81cd",GradientType=1);
}
</style>
