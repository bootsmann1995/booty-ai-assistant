<template>
  <div id="smooth-wrapper">
    <div id="smooth-content">
      <div class="bg-gunmetal-500 px-6 text-baby-powder-500">
        <div v-if="!isLoading">
          <h1>Booty ai feed</h1>
          <h2 v-if="user">
            Hi Welcome back {{ user?.user_metadata?.first_name }}!
          </h2>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>

        <div v-if="!isLoadingFeed && feed" class="my-6">
          <h1 class="">Your Feed</h1>
          <p v-if="feed.length === 0">
            You got no items in your feed! add points to learn
          </p>
          <div v-for="item in feed" class="">
            <h3
              class="font-roboto text-[20px] font-bold mb-3"
              v-if="item.point"
            >
              Subject: {{ item.point.subject }}
            </h3>
            <p class="font-roboto font-medium mb-2">
              Last updated:
              {{
                new Date(item.point.last_prompt_fired).toLocaleDateString(
                  "da-DK"
                )
              }}
              {{
                new Date(item.point.last_prompt_fired).toLocaleTimeString(
                  "da-DK"
                )
              }}
            </p>
            <Markdown
              class="[&_ol>li]:list-decimal [&_ul>li]:list-disc [&_ol]:pl-7 [&_ul]:pl-7 [&_p]:mb-4 [&_li]:my-4 [&_pre]:bg-gunmetal-400 [&_pre]:rounded-md [&_pre]:w-min [&_pre]:max-w-full [&_pre]:overflow-auto [&_pre]:p-2 [&_pre]:my-4"
              v-if="item.chat"
              :source="item.chat"
            ></Markdown>

            <hr class="my-5" />
          </div>
        </div>
        <div v-else>
          <p>Loading feed...</p>
        </div>

        <div class="mt-5">
          <p class="">Looking for more?</p>
          <button @click="addPointActive = true" v-if="!addPointActive">
            Add point +
          </button>
          <div
            v-show="addPointActive"
            class="[&_.formkit-input]:text-gunmetal-400"
          >
            <h2>add education points</h2>

            <FormKit
              type="form"
              id="registration-example"
              ref="form"
              submit-label="Register"
              @submit="addEducationPoint"
              :actions="false"
              v-model="model"
            >
              <FormKit
                type="text"
                name="subject"
                label="subject"
                placeholder="Eg. Css3 coding, beginner skill, animation as speciality"
                class=""
                validation="required"
              />
              <FormKit
                type="radio"
                name="education_type"
                label="Education type"
                validation="required"
                :options="[
                  'News',
                  'News with examples',
                  'Learning',
                  'Learning with examples',
                ]"
                help="How would you like to be smarter?"
              />
              <FormKit
                type="radio"
                name="language"
                validation="required"
                label="Language"
                :options="['Engelsk', 'Dansk']"
              />
              <FormKit
                type="text"
                name="tags"
                label="Add tags for better education"
                placeholder="tag, tag, tag"
                help="Write tags regarding your education subject"
                validation="required"
              />

              <div
                class="[&_.formkit-input]:text-baby-powder-500 [&_.formkit-input]:bg-lavender-500 [&_.formkit-input]:px-3 [&_.formkit-input]:py-1"
              >
                <FormKit type="submit" label="Register" />
              </div>
            </FormKit>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { getUser, updateUser } = useSupabaseFunc();
const user = useState("user");
const addPointActive = ref(false);
const isLoading = ref(true);
const isLoadingFeed = ref(true);
const gs = useGsap();
const form = ref(null);
const nuxtApp = useNuxtApp();
const model = ref({});

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
  } else {
    isLoading.value = false;
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
      alert("Failed to add point" + error);
      throw new Error("Failed to update user");
    } finally {
      isLoading.value = false;
    }
  }

  fetchEducationalNews();
  model.value = {};
  return;
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

      if (!feedItem.cancelUpdateDate) {
        newPoint.last_prompt_fired = new Date();
      }

      newPoint.chatModel = feedItem.chatModel;

      if (point.first_prompt_fired === false) {
        newPoint.first_prompt_fired = true;
      }

      isLoadingFeed.value = false;
      feed.value.push({
        point: newPoint,
        chat: feedItem.chat,
      });
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
