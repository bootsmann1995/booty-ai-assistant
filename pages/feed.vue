<template>
  <div>
    <div>
      <div class="h-screen">
        <Swiper
          :direction="'vertical'"
          slides-per-view="1"
          class="mySwiper w-full h-full"
          @init="initSwiper"
          @slide-next-transition-end="fetchNextItem()"
        >
          <SwiperSlide>
            <div
              class="bg-gunmetal-500 px-6 text-baby-powder-500 h-full max-w-full overflow-x-auto py-5 relative"
            >
              <video
                muted
                autoplay
                loop
                controls="false"
                class="absolute left-0 top-0 bottom-0 right-0 -z-1 h-full w-full object-cover blur-lg opacity-60"
                src="~/assets/video/bg-video.mp4"
              ></video>
              <div class="relative z-10">
                <div v-if="!isLoading" class="mb-5">
                  <h1 class="text-2xl text-center">Bootie Assistant feed</h1>
                  <h2 class="text-lg text-center" v-if="user">
                    Hi Welcome back
                    {{ user?.user_metadata?.first_name ?? user?.email }}!
                  </h2>
                </div>
                <div v-else>
                  <p>Loading...</p>
                </div>

                <div class="my-6">
                  <h1 class="">Your Feed</h1>
                  <NuxtLink
                    v-if="
                      user?.database == null ||
                      user?.database?.data?.education_points.length === 0
                    "
                    to="/add-point"
                    >You got no points add one here</NuxtLink
                  >

                  <div v-if="feed[0]" class="">
                    <h3
                      class="font-roboto text-[20px] font-bold mb-3"
                      v-if="feed[0].point"
                    >
                      Subject: {{ feed[0].point.subject }}
                    </h3>

                    <Markdown
                      class="[&_ol>li]:list-decimal [&_ul>li]:list-disc [&_ol]:pl-7 [&_ul]:pl-7 [&_p]:mb-4 [&_li]:my-4 [&_pre]:bg-gunmetal-400 [&_pre]:rounded-md [&_pre]:w-min [&_pre]:max-w-full [&_pre]:overflow-auto [&_pre]:p-2 [&_pre]:my-4"
                      v-if="feed[0].chat"
                      :source="feed[0].chat"
                    ></Markdown>

                    <hr class="my-5" />
                    <div
                      class="flex items-center flex-col justify-center mt-14"
                    >
                      <p>Swipe to learn</p>
                      <div
                        class="flex items-center justify-center animate-bounce mt-3"
                      >
                        <Icon
                          name="mingcute:arrows-down-line"
                          class="color-white w-11 h-11"
                        ></Icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide v-for="item in feed.slice(1, feed.length)">
            <div
              class="bg-gunmetal-500 px-6 text-baby-powder-500 h-full max-h-full overflow-y-auto flex items-center relative z-10 overflow-y-auto"
            >
              <video
                muted
                autoplay
                loop
                controls="false"
                class="absolute left-0 top-0 bottom-0 right-0 -z-1 h-full w-full object-cover blur-lg opacity-60"
                src="~/assets/video/bg-video.mp4"
              ></video>
              <div class="relative z-10">
                <div v-if="item" class="">
                  <h3
                    class="font-roboto text-[20px] font-bold mb-3"
                    v-if="item.point"
                  >
                    Subject: {{ item.point.subject }}
                  </h3>

                  <Markdown
                    class="[&_ol>li]:list-decimal [&_ul>li]:list-disc [&_ol]:pl-7 [&_ul]:pl-7 [&_p]:mb-4 [&_li]:my-4 [&_pre]:bg-gunmetal-400 [&_pre]:rounded-md [&_pre]:w-min [&_pre]:max-w-full [&_pre]:overflow-auto [&_pre]:p-2 [&_pre]:my-4"
                    v-if="item.chat"
                    :source="item.chat"
                  ></Markdown>

                  <hr class="my-5" />
                  <div class="flex">
                    <button
                      v-if="
                        pointRemoved.indexOf(item.point.id) === -1 &&
                        !isRemovingPoint
                      "
                      @click="removePoint(item.point.id)"
                    >
                      Stop this feed
                    </button>
                    <div
                      v-if="
                        pointRemoved.indexOf(item.point.id) > -1 &&
                        !isRemovingPoint
                      "
                      class="flex items-center"
                    >
                      <Icon name="carbon:checkmark-filled"></Icon>
                      <p class="text-white ml-3">Point removed from feed</p>
                    </div>
                    <div v-if="isRemovingPoint">
                      <Icon
                        name="line-md:loading-loop"
                        class="text-white w-7 h-7"
                      ></Icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
const { getUser, updateUser } = useSupabaseFunc();
const user = useState("user");
const isLoading = ref(true);
const isLoadingFeed = ref(false);
const swip = ref();
const pointRemoved = ref([]);
const isRemovingPoint = ref(false);
const lastIndex = ref();

definePageMeta({
  middleware: ["auth"],
});

const feed = ref([]);

onMounted(async () => {
  await fetchUser();
});

const initSwiper = (s: any) => {
  swip.value = s;
};

const fetchNextItem = () => {
  swip.value.activeIndex === feed.value.length - 1
    ? fetchEducationalNews()
    : null;
  fetchEducationalNews();
};

const fetchUser = async () => {
  if (!user.value) {
    user.value = await getUser();
    isLoading.value = false;
    fetchEducationalNews();
  } else {
    isLoading.value = false;
  }

  getLastFeed();
};

const getLastFeed = async () => {
  user.value?.database?.data.education_points.forEach((point: any) => {
    if (point?.isLastUpdated === true) {
      feed.value.push({
        point: point,
        chat:
          getLastModelObject(point.chatModel._history) != null
            ? getLastModelObject(point.chatModel._history).parts[0].text
            : "",
      });
    }
  });
};

const getLastModelObject = (data: any) => {
  let lastModelObject = null;

  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].role === "model") {
      lastModelObject = data[i];
      break; // Exit the loop once the last model object is found
    }
  }

  return lastModelObject;
};

const fetchEducationalNews = async () => {
  isLoadingFeed.value = true;
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
  } finally {
    isLoadingFeed.value = false;
  }
};

async function sendTextsAndSetFeed(currentPoints: any[]) {
  console.log(currentPoints);
  let index = Math.floor(Math.random() * currentPoints.length);
  while (index === lastIndex.value) {
    index = Math.floor(Math.random() * currentPoints.length);
  }
  const newPoint = { ...currentPoints[index] };

  try {
    const feedItem = await $fetch("/api/text", {
      method: "POST",
      body: currentPoints[index],
    }).catch((error) => {
      console.error(error);
      throw new Error("Failed to fetch feed");
    });
    currentPoints.forEach((element) => {
      element != null &&
      element.point != null &&
      element.element.isLastUpdated != null
        ? (element.point.isLastUpdated = false)
        : null;
    });
    newPoint.isLastUpdated = true;

    newPoint.chatModel = feedItem.chatModel;

    if (currentPoints[index].first_prompt_fired === false) {
      newPoint.first_prompt_fired = true;
    }

    isLoadingFeed.value = false;
    feed.value.push({
      point: newPoint,
      chat: feedItem.chat,
    });
    lastIndex.value = index;
    currentPoints[index] = newPoint;
  } catch (error) {
    console.error(error);
  }
  return currentPoints;
}

const removePoint = async (id: string) => {
  isRemovingPoint.value = true;
  try {
    const newPointList = user.value?.database?.data.education_points ?? [];
    const pointIndex = newPointList.findIndex((x) => x.id === id);
    if (pointIndex > -1) {
      newPointList.splice(pointIndex, 1);
      const newUser = await updateUser({
        education_points: newPointList,
      });
      user.value = newUser;
      pointRemoved.value.push(id);
      user.value = await getUser();
      console.log(newPointList);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isRemovingPoint.value = false;
  }
};
</script>
