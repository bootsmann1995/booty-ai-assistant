<template>
  <div>
    test
    {{ data }}
  </div>
</template>
<script setup lang="ts" async>
const { data } = await useFetch("/api/text");
definePageMeta({
  middleware: ["auth"],
});
</script>
