<template>
  <section class="c-emails" tid="emails">
    <h1 class="c-emails__header" tid="emails__header" key="emails-header" v-if="hasUnreadEmails">You have {{ unreadEmails.length }} new emails:</h1>
    <h1 class="c-emails__header" tid="emails__header" key="emails-header" v-else>You have no unread emails</h1>
    <ul class="c-emails__list" tid="emails__list">
      <li class="c-emails__list-item c-email" :class="{ 'c-email--unread': email.unread }" v-for="email in emails" :key="email.id" tid="email">
        <div class="c-email__subject" :class="{ 'c-email__subject--unread': email.unread }" @click="toggleEmail(email)" tid="email__subject">{{ email.subject }}</div>
        <em class="c-email__sender" tid="email__sender">from {{ email.sender }}</em>
        <div class="c-email__body" v-show="openEmailId === email.id" tid="email__body">{{ email.body }}</div>
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
.c-emails__list {
  display: block;
  border: 1px solid var(--border-color);
  padding: 0;
}

.c-email {
  display: block;
  padding: 1rem 2.5rem 1rem 6rem;
  position: relative;
}

.c-email:before {
  content: "✉";
  font-size: 6rem;
  line-height: 6rem;
  height: 6rem;
  color: rgba(204, 204, 204, 0.6);
  position: absolute;
  left: 0;
  top: 0;
}

.c-email--unread:before {
  font-weight: bolder;
}

.c-email + .c-email {
  border-top: 1px solid var(border-color);
}

.c-email__subject {
  display: block;
  font-size: 2rem;
  cursor: pointer;
}

.c-email__subject--unread {
  font-weight: bolder;
}

.c-email__sender {
  display: block;
  color: #999;
}

.c-email__body {
  margin-top: 1rem;
}
</style>
