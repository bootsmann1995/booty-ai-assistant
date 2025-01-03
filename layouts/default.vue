<template>
  <div class="font-roboto">
    <NuxtPage />

    <div
      class="fixed bg-white h-[62px] w-full left-0 bottom-0 z-10 px-4 flex gap-7 justify-center items-center"
    >
      <NuxtLink
        to="/"
        class="h-full aspect-square flex items-center justify-center"
      >
        <Icon name="gravity-ui:house" class="w-7 h-7 text-orange-400" />
      </NuxtLink>
      <NuxtLink
        to="/feed"
        class="h-full aspect-square flex items-center justify-center"
      >
        <Icon name="stash:feed" class="w-7 h-7 text-orange-400" />
      </NuxtLink>
      <NuxtLink
        to="/add-point"
        class="h-full aspect-square flex items-center justify-center"
      >
        <Icon name="mingcute:add-fill" class="w-7 h-7 text-orange-400" />
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style></style>
