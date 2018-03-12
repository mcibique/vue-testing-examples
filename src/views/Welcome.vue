<template>
  <section class="welcome" tid="welcome" v-if="!isLoading && !loadingError">
    <h1 class="welcome__header" v-if="profile" tid="welcome__header">Welcome {{ profile | fullName }}!</h1>
    <div tid="welcome__dashboard">
      <dashboard :emails="emails"></dashboard>
    </div>
  </section>
  <div v-else-if="loadingError" tid="welcome_loading-error">
    An error occurred: {{ loadingError }}
  </div>
  <div v-else tid="welcome__loading">
    Loading data ...
  </div>
</template>

<script>
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import { LazyInject } from '@di';
import Dashboard from '@/components/Dashboard';
import { PROFILE_SERVICE_ID } from '@/services/profile';
import { EMAIL_SERVICE_ID } from '@/services/email';
import { fullName } from '@/filters/full-name';

@Component({
  components: { Dashboard },
  filters: { fullName }
})
export default class WelcomeView extends Vue {
  profile = null;
  emails = [];
  isLoading = true;
  loadingError = null;

  @LazyInject(PROFILE_SERVICE_ID) profileService;
  @LazyInject(EMAIL_SERVICE_ID) emailService;

  async created() {
    let [profile, emails] = await Promise.all([this.profileService.getProfile(), this.emailService.getEmails()]).catch(({ response }) => {
      this.loadingError = response.data.error.message;
      return [];
     });
    this.profile = profile;
    this.emails = emails;
    this.isLoading = false;
  }
}
</script>

<style>
  .welcome__header {
    border-bottom: 1px solid #333;
    margin-top: 2rem;
    margin-bottom: 5rem;
    font-size: 4rem;
    line-height: 5rem;
  }
</style>
