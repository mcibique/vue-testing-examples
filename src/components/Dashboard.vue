<template>
  <section class="c-dashboard__emails" tid="dashboard__emails">
    <h1 class="c-dashboard__emails-header" v-if="hasUnreadEmails" tid="dashboard__emails-header">You have {{ unreadEmails.length }} new emails:</h1>
    <h1 class="c-dashboard__emails-header" v-else tid="dashboard__emails-header">You have no unread emails</h1>
    <ul class="c-dashboard__emails-list" v-if="hasUnreadEmails" tid="dashboard__emails-list">
      <li class="c-dashboard__email" v-for="email in emails" :key="email.id" tid="dashboard__email">
        <div class="c-dashboard__email-subject" :class="{ 'c-dashboard__email-subject--unread': email.unread }" tid="dashboard__email-subject">{{ email.subject }}</div>
        <em class="c-dashboard__email-sender" tid="dashboard__email-sender">from {{ email.sender }}</em>
      </li>
    </ul>
  </section>
</template>

<script>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class WelcomeView extends Vue {
  @Prop({ type: Array, default: () => [] }) emails;

  get unreadEmails () {
    return this.emails.filter(e => e.unread);
  }

  get hasUnreadEmails () {
    return this.unreadEmails.length > 0;
  }
}
</script>

<style>
.c-dashboard__emails-list {
  display: block;
  border: 1px solid #ccc;
  padding: 0;
}

.c-dashboard__email {
  display: block;
  padding: 1rem 2.5rem;
}

.c-dashboard__email + .c-dashboard__email {
  border-top: 1px solid #ccc;
}

.c-dashboard__email-subject {
  display: block;
  font-size: 2rem;
}

.c-dashboard__email-subject--unread {
  font-weight: bolder;
}

.c-dashboard__email-sender {
  display: block;
}
</style>
