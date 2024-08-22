<template>
  <div>
    <FormKit
      type="form"
      id="registration-example"
      submit-label="Login"
      @submit="submitHandler"
      :actions="false"
    >
      <h1 class="text-2xl font-bold mb-2">Login!</h1>

      <FormKit
        type="text"
        name="email"
        label="Your email"
        placeholder="jane@example.com"
        help="What email should we use?"
        validation="required|email"
      />
      <FormKit
        type="password"
        name="password"
        label="Password"
        validation="required|length:6|matches:/[^a-zA-Z]/"
        :validation-messages="{
          matches: 'Make sure u\'ve  included a symbol',
        }"
        placeholder="Your password"
        help="Writie a password"
      />

      <FormKit type="submit" label="Login" />
    </FormKit>
  </div>
</template>
<script setup>
const { login } = useSupabaseFunc();
const route = useRoute();

const submitHandler = async (value) => {
  const user = await login({ ...value, redirectTo: route.query.redirectTo });
};
</script>
