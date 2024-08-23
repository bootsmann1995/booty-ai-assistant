<template>
  <div>
    <FormKit
      type="form"
      id="registration-example"
      submit-label="Register"
      @submit="submitHandler"
      :actions="false"
      #default="{ value }"
    >
      <h1 class="text-2xl font-bold mb-2">Register!</h1>
      <p class="text-sm mb-4">
        You can put any type of element inside a form, not just FormKit inputs
        (although only FormKit inputs are included with the submission).
      </p>
      <FormKit
        type="text"
        name="first_name"
        label="First Name"
        placeholder="Jane"
        help="What do people call you?"
        validation="required"
      />
      <FormKit
        type="text"
        name="last_name"
        label="Last Name"
        placeholder="Doe"
        help="What do people call you?"
        validation="required"
      />
      <FormKit
        type="text"
        name="email"
        label="Your email"
        placeholder="jane@example.com"
        help="What email should we use?"
        validation="required|email"
      />
      <div class="double">
        <FormKit
          type="password"
          name="password"
          label="Password"
          validation="required|length:6|matches:/[^a-zA-Z]/"
          :validation-messages="{
            matches: 'Please include at least one symbol',
          }"
          placeholder="Your password"
          help="Choose a password"
        />
        <FormKit
          type="password"
          name="password_confirm"
          label="Confirm password"
          placeholder="Confirm password"
          validation="required|confirm"
          help="Confirm your password"
        />
      </div>

      <FormKit type="submit" label="Register" />
      <pre wrap>{{ value }}</pre>
    </FormKit>
  </div>
</template>
<script setup>
const { signUp } = useSupabaseFunc();

const submitHandler = async (value) => {
  const user = await signUp(value).then((res) => navigateTo("/login"));
};
</script>
