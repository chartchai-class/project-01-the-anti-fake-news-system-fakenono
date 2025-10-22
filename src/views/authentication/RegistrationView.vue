<script setup lang="ts">

</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
    <form @submit.prevent class="space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Registration</h2>
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2" for="name">First name</label>
        <input id="name" type="text" placeholder="Enter your First name"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2" for="surname">Last name</label>
        <input id="surname" type="text" placeholder="Enter your Last name"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2" for="email">Email</label>
        <input id="email" type="text" placeholder="Enter your Email"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2" for="username">Username</label>
        <input id="username" type="text" placeholder="Enter your username"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2" for="password">Password</label>
        <input id="password" type="password" placeholder="Enter your password"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div class="text-center">
        <button type="submit"
          class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
          Register
        </button>
      </div>
    </form>
  </div>
</template>
