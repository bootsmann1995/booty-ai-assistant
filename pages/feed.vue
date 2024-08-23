<template>
  <div>
    <div v-if="!isLoading">
      <h1>Booty ai feed</h1>
      <h2 v-if="user">
        Hi Welcome back {{ user?.user_metadata?.first_name }}!
      </h2>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>

    <div v-if="!isLoadingFeed && feed">
      <h1>Feed</h1>
      <p>Here is the feed</p>

      <div v-for="item in feed">
        <h3 v-if="item.point">Subject: {{ item.point.subject }}</h3>
        <Markdown v-if="item.chat" :source="item.chat"></Markdown>
      </div>

      <hr />
    </div>
    <div v-else>
      <p>Loading feed...</p>
    </div>

    <button @click="addPointActive = true" v-if="!addPointActive">
      Add point +
    </button>
    <div v-show="addPointActive">
      <h2>add education points</h2>

      <FormKit
        type="form"
        id="registration-example"
        submit-label="Register"
        @submit="addEducationPoint"
        :actions="false"
        #default="{ value }"
      >
        <FormKit
          type="text"
          name="subject"
          label="subject"
          placeholder="Jane"
          help="What do people call you?"
          validation="required"
        />
        <FormKit
          type="radio"
          name="education_type"
          label="Education type"
          :options="[
            'News',
            'News with examples',
            'Learning',
            'Learning with examples',
          ]"
          help="How would you like to be smarter?"
        />
        <FormKit
          type="text"
          name="tags"
          label="Add tags for better education"
          placeholder="tag, tag, tag"
          help="Write tags regarding your education subject"
          validation="required"
        />

        <FormKit type="submit" label="Register" />
      </FormKit>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { getUser, updateUser } = useSupabaseFunc();
const user = useState("user");
const addPointActive = ref(false);
const isLoading = ref(true);
const isLoadingFeed = ref(true);
definePageMeta({
  middleware: ["auth"],
});

const feed = ref([]);

onMounted(async () => {
  await fetchUser();
});

const fetchUser = async () => {
  if (!user.value) {
    user.value = await getUser();
    isLoading.value = false;
    isLoadingFeed.value = true;
    await fetchEducationalNews();
  }
};

const addEducationPoint = async (value: any) => {
  isLoading.value = true;
  if (user.value && user.value) {
    const currentPoints = user.value.database?.data.education_points ?? [];
    try {
      user.value = await updateUser({
        education_points: [
          ...currentPoints,
          { ...value, id: generateGuid(), first_prompt_fired: false },
        ],
      });
      addPointActive.value = false;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update user");
    } finally {
      isLoading.value = false;
    }
  }
  fetchEducationalNews();
};

const fetchEducationalNews = async () => {
  feed.value = [];
  try {
    const currentPoints = user.value?.database?.data.education_points ?? [];
    const updateArr = await sendTextsAndSetFeed(currentPoints);
    isLoadingFeed.value = false;
    if (currentPoints && currentPoints.length > 0) {
      const newUser = await updateUser({
        education_points: updateArr,
      });
      user.value = newUser;
    }
  } catch (error) {
    console.error(error);
  }
};

async function sendTextsAndSetFeed(currentPoints: any[]) {
  const updatedPoints = [];

  for (const point of currentPoints) {
    const newPoint = { ...point };

    try {
      const feedItem = await $fetch("/api/text", {
        method: "POST",
        body: point,
      }).catch((error) => {
        console.error(error);
        throw new Error("Failed to fetch feed");
      });

      feed.value.push({
        point,
        chat: feedItem.chat,
      });

      newPoint.last_prompt_fired = new Date();
      newPoint.chatModel = feedItem.chatModel;

      if (point.first_prompt_fired === false) {
        newPoint.first_prompt_fired = true;
      }

      isLoadingFeed.value = false;

      // Process and update point data
      updatedPoints.push(await processPointWithDelay(newPoint)); // Call a separate function for delayed processing
    } catch (error) {
      console.error(error);
    }
  }

  return updatedPoints;
}

async function processPointWithDelay(point) {
  // Simulate 200m delay (replace with actual distance calculation if needed)
  await new Promise((resolve) => setTimeout(resolve, 200)); // Adjust delayTime as needed
  return point; // Or return modified point after processing
}
</script>
