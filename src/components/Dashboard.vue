<template>
  <section class="c-dashboard__emails" tid="dashboard__emails">
    <h1 class="c-dashboard__emails-header" v-if="hasUnreadEmails" key="dashboard-emails-header" tid="dashboard__emails-header">You have {{ unreadEmails.length }} new emails:</h1>
    <h1 class="c-dashboard__emails-header" v-else tid="dashboard__emails-header" key="dashboard-emails-header">You have no unread emails</h1>
    <ul class="c-dashboard__emails-list" tid="dashboard__emails-list">
      <li class="c-dashboard__email" :class="{ 'c-dashboard__email--unread': email.unread }" v-for="email in emails" :key="email.id" tid="dashboard__email">
        <div class="c-dashboard__email-subject" :class="{ 'c-dashboard__email-subject--unread': email.unread }" @click="toggleEmail(email)" tid="dashboard__email-subject">{{ email.subject }}</div>
        <em class="c-dashboard__email-sender" tid="dashboard__email-sender">from {{ email.sender }}</em>
        <div class="c-dashboard__email-body" v-show="openEmailId === email.id" tid="dashboard__email-body">{{ email.body }}</div>
      </li>
    </ul>
  </section>
</template>

<script>
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Dashboard extends Vue {
  @Prop({ type: Array, default: () => [] }) emails;

  openEmailId = null;

  get unreadEmails () {
    return this.emails.filter(e => e.unread);
  }

  get hasUnreadEmails () {
    return this.unreadEmails.length > 0;
  }

  toggleEmail (email) {
    if (this.openEmailId === email.id) {
      this.openEmailId = null;
    } else {
      this.$emit('open-email', email);
      this.openEmailId = email.id;
    }
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
  padding: 1rem 2.5rem 1rem 6rem;
  position: relative;
}

.c-dashboard__email:before {
  content: "✉";
  font-size: 6rem;
  line-height: 6rem;
  height: 6rem;
  color: rgba(204, 204, 204, 0.6);
  position: absolute;
  left: 0;
  top: 0;
}

.c-dashboard__email--unread:before {
  font-weight: bolder;
}

.c-dashboard__email + .c-dashboard__email {
  border-top: 1px solid #ccc;
}

.c-dashboard__email-subject {
  display: block;
  font-size: 2rem;
  cursor: pointer;
}

.c-dashboard__email-subject--unread {
  font-weight: bolder;
}

.c-dashboard__email-sender {
  display: block;
  color: #999;
}

.c-dashboard__email-body {
  margin-top: 1rem;
}
</style>
