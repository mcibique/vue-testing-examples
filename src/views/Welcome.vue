<template>
  <div>
    <h1 v-if="profile">Welcome {{ profile.firstName }}!</h1>
    <profile :profile="profile"></profile>
  </div>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import Profile from '@/components/Profile';
import ProfileService from '@/services/profile';

@Component({
  components: { Profile }
})
export default class WelcomeView extends Vue {
  profile = null;

  beforeRouteEnter (to, from, next) {
    let profileService = new ProfileService();
    profileService.getProfile().then(function (profile) {
      next(vm => { vm.profile = profile; });
    });
  }
}
</script>
