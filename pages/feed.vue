<template>
  <div>
    <div v-if="!isLoading">
      user:
      <pre>
        {{ user }}
      </pre>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>

    <div>
      <h1>Feed</h1>
      <p>Here is the feed</p>
      <pre>
        {{ feed }}
      </pre>
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

const feed = ref([]);

onMounted(async () => {
  await fetchUser();
});

const fetchUser = async () => {
  if (!user.value) {
    user.value = await getUser();
    await fetchEducationalNews();
    isLoading.value = false;
  }
};

const addEducationPoint = async (value: any) => {
  isLoading.value = true;
  if (user.value && user.value) {
    const currentPoints = user.value.user_metadata?.education_points ?? [];
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
};

const fetchEducationalNews = async () => {
  const currentPoints = user.value?.user_metadata?.education_points ?? [];
  const updateArr = await sendTextsAndSetFeed(currentPoints);
  if (currentPoints && currentPoints.length > 0) {
    user.value = await updateUser({
      education_points: [...updateArr],
    });
  }
};

const sendTextsAndSetFeed = async (currentPoints: any[]) => {
  const feedArr: any[] = await Promise.all(
    currentPoints.map(async (point) => {
      const newPoint = { ...point };
      try {
        const feedItem = await $fetch("/api/text", {
          method: "POST",
          body: point,
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
      } catch (error) {
        console.error(error);
      }
      return newPoint;
    })
  );
  return feedArr;
};
</script>
