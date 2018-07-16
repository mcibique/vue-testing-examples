<template>
  <section class="c-welcome" tid="welcome" v-if="!isLoading && !loadingError">
    <h1 class="c-welcome__header" v-if="profile" tid="welcome__header">Welcome {{ profile | fullName }}!</h1>
    <div tid="welcome__dashboard">
      <dashboard :emails="emails" @open-email="onEmailOpen"></dashboard>
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

  async created () {
    let [profile, emails] = await Promise.all([this.profileService.getProfile(), this.emailService.getEmails()]).catch(({ response }) => {
      this.loadingError = response.data.error.message;
      return [];
    });
    this.profile = profile;
    this.emails = emails;
    this.isLoading = false;
  }

  async onEmailOpen (email) {
    if (email.unread) {
      await this.emailService.markEmailAsRead(email.id);
      email.unread = false;
    }
  }
}
</script>

<style>
.c-welcome {
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(4, 34, 62, 1);
  border-radius: 0.4rem;
  box-shadow: 0.3rem 0.3rem 0.4rem 0.1rem rgba(4, 34, 62, 1);
  padding: 0.5rem 2rem;
}

.c-welcome__header {
  border-bottom: 1px solid #333;
  margin-top: 2rem;
  margin-bottom: 5rem;
  font-size: 4rem;
  line-height: 5rem;
}
</style>
