<template>
  <div class="gradient-1 px-5 min-h-screen w-full pt-[100px]">
    <h1
      ref="headline"
      class="text-white text-3xl text-center opacity-0 translate-y-12"
    >
      <template v-if="user"> Hi {{ user.email }} </template>
    </h1>
    <div
      ref="text"
      class="text-white text-center opacity-0 translate-y-12 mt-3"
    >
      <p class="text-white">
        Welcome back to your educational assistant. What are you waiting for?
        Start learning now!
      </p>
    </div>
    <div
      ref="button"
      class="mt-8 flex items-center justify-center opacity-0 translate-y-12"
    >
      <NuxtLink
        to="/feed"
        class="relative flex items-center h-9 bg-orange-400 text-white px-4 rounded-md"
      >
        <span class="relative z-[2]">Go to feed</span>
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
import { gsap } from "gsap";

const user = ref();
const headline = ref();
const text = ref();
const button = ref();

const { getUser } = useSupabaseFunc();

onMounted(async () => {
  user.value = await getUser();
  animateHeadline();
  animateText();
  animateButton();
});

definePageMeta({
  middleware: ["auth"],
});

const animateHeadline = () => {
  if (headline.value) {
    console.log("animate");
    gsap.to(headline.value, {
      opacity: 1,
      y: 0,
      ease: "power4.inOut",
      duration: 2,
    });
  }
};

const animateText = () => {
  if (text.value) {
    gsap.to(text.value, {
      opacity: 1,
      y: 0,
      ease: "power4.inOut",
      duration: 2,
      delay: 0.2,
    });
  }
};

const animateButton = () => {
  if (button.value) {
    gsap.to(button.value, {
      opacity: 1,
      y: 0,
      ease: "power4.inOut",
      duration: 2,
      delay: 0.4,
    });
  }
};
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
