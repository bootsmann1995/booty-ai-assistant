<template>
  <div>
    <div class="">
      <div class="bg-gunmetal-500 px-6 text-baby-powder-500">
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
