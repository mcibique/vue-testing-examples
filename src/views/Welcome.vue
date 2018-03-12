<template>
  <section>
    <h1 v-if="profile">Welcome {{ profile.firstName }}!</h1>
    <profile :profile="profile"></profile>
  </section>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { LazyInject } from '@di';
import Profile from '@/components/Profile';
import { PROFILE_SERVICE_ID } from '@/services/profile';

@Component({
  components: { Profile }
})
export default class WelcomeView extends Vue {
  profile = null;

  @LazyInject(PROFILE_SERVICE_ID) profileService;

  async created () {
    this.profile = await this.profileService.getProfile();
  }
}
</script>
