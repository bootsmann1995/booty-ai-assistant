<template>
  <div>
    <div class="">
      <div
        v-if="isLoading"
        class="fixed left-0 top-0 bottom-0 right-0 w-screen h-screen z-30 flex items-center justify-center"
      >
        <div
          class="absolute left-0 top-0 bg-white opacity-80 w-full h-full"
        ></div>
        <div>
          <Icon
            name="svg-spinners:bars-scale-middle"
            class="text-orange-400 w-10 h-10"
          ></Icon>
        </div>
      </div>
      <div
        v-if="!isLoading"
        class="bg-gunmetal-500 h-screen px-6 pt-8 text-baby-powder-500"
      >
        <div class="">
          <p class="text-lg uppercase mb-4">Add point</p>

          <div class="[&_.formkit-input]:text-gunmetal-400">
            <h2 class="font-bold mb-1">Add education points</h2>

            <FormKit
              type="form"
              id="registration-example"
              ref="form"
              submit-label="Register"
              @submit="addEducationPoint"
              :actions="false"
              v-model="model"
            >
              <div
                class="mb-3 [&_.formkit-label]:font-bold [&_.formkit-label]:mb-3 [&_.formkit-input]:w-full [&_.formkit-input]:py-2 [&_.formkit-input]:px-2 [&_.formkit-input]:rounded-md"
              >
                <FormKit
                  type="text"
                  name="Subject"
                  label="Subject"
                  placeholder="Eg. Css3 coding, beginner skill, animation as speciality"
                  validation="required"
                />
              </div>
              <div class="mb-3 [&_.formkit-legend]:font-bold">
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
              </div>
              <div
                class="mb-3 [&_.formkit-legend]:font-bold [&_.formkit-label]:mb-3"
              >
                <FormKit
                  type="radio"
                  name="language"
                  validation="required"
                  label="Language"
                  :options="['Engelsk', 'Dansk']"
                />
              </div>
              <div
                class="mb-3 [&_.formkit-label]:font-bold [&_.formkit-label]:mb-3 [&_.formkit-help]:text-sm [&_.formkit-help]:italic [&_.formkit-input]:w-full [&_.formkit-input]:py-2 [&_.formkit-input]:px-2 [&_.formkit-input]:rounded-md"
              >
                <FormKit
                  type="text"
                  name="tags"
                  label="Add tags for better education"
                  placeholder="tag, tag, tag"
                  help="Write tags regarding your education subject"
                  validation="required"
                />
              </div>

              <div
                class="[&_.formkit-input]:bg-orange-400 [&_.formkit-input]:text-white [&_.formkit-input]:rounded-md [&_.formkit-input]:px-3 [&_.formkit-input]:py-1"
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
const isLoading = ref(false);
const addPointActive = ref(false);
const user = useState("user");
const { getUser, updateUser } = useSupabaseFunc();
const model = ref({});

definePageMeta({
  middleware: ["auth"],
});

onMounted(async () => {
  await fetchUser();
});

const fetchUser = async () => {
  if (!user.value) {
    user.value = await getUser();
    isLoading.value = false;
  } else {
    isLoading.value = false;
  }
};

const addEducationPoint = async (value: any) => {
  isLoading.value = true;
  console.log(value);
  if (user.value) {
    const currentPoints = user.value.database?.data.education_points ?? [];
    try {
      user.value = await updateUser({
        education_points: [
          ...currentPoints,
          { ...value, id: generateGuid(), first_prompt_fired: false },
        ],
      });
      addPointActive.value = false;
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to add point" + error);
      throw new Error("Failed to update user");
    } finally {
      isLoading.value = false;
    }
  }

  model.value = {};
  return;
};
</script>

<style lang="scss"></style>
