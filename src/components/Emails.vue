<template>
  <section class="c-emails" tid="c-emails">
    <h1 class="c-emails__header" tid="c-emails__header" v-if="hasUnreadEmails">You have {{ unreadEmails.length }} new emails:</h1>
    <h1 class="c-emails__header" tid="c-emails__header" v-else>You have no unread emails</h1>
    <my-checkbox-list>
      <ul class="c-emails__list" tid="c-emails__list">
        <li class="c-emails-list-item c-email" :class="{ 'c-email--unread': email.unread }" v-for="email in emailsToDisplay" :key="email.id" tid="c-email">
          <my-checkbox class="c-emails-list-item__checkbox" tid="c-emails-list-item__checkbox" v-model="email.selected"></my-checkbox>
          <div class="c-emails-list-item__content">
            <div class="c-email__subject" :class="{ 'c-email__subject--unread': email.unread }" @click="toggleEmail(email)" tid="c-email__subject">{{ email.subject }}</div>
            <em class="c-email__sender" tid="c-email__sender">from {{ email.sender }}</em>
            <div class="c-email__body" v-show="openEmailId === email.id" tid="c-email__body">{{ email.body }}</div>
          </div>
        </li>
      </ul>
      <my-checkbox-list-status>
        <template slot-scope="{ numberOfCheckboxes, numberOfSelectedCheckboxes }">
          <div v-if="numberOfSelectedCheckboxes > 0">
            {{ numberOfSelectedCheckboxes }} of {{ numberOfCheckboxes }} emails have been selected.
            <a href="" class="c-emails__action" @click.prevent="selectAll()" v-if="numberOfSelectedCheckboxes !== numberOfCheckboxes">Select all</a>
            <a href="" class="c-emails__action" @click.prevent="deselectAll()" v-if="numberOfSelectedCheckboxes !== 0">Deselect all</a>
          </div>
          <div v-else>
            No emails have been selected.
            <a href="" class="c-emails__action" @click.prevent="selectAll()">Select all</a>
          </div>
        </template>
      </my-checkbox-list-status>
    </my-checkbox-list>
  </section>
</template>

<script>
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

import MyCheckbox from './MyCheckbox';
import MyCheckboxList from './MyCheckboxList';
import MyCheckboxListStatus from './MyCheckboxListStatus';

@Component({
  components: { MyCheckbox, MyCheckboxList, MyCheckboxListStatus }
})
export default class Dashboard extends Vue {
  @Prop({ type: Array, default: () => [] }) emails;

  openEmailId = null;
  emailsToDisplay = [];

  get unreadEmails () {
    return this.emails.filter(e => e.unread);
  }

  get hasUnreadEmails () {
    return this.unreadEmails.length > 0;
  }

  @Watch('emails', { immediate: true })
  onEmailsUpdated () {
    this.emailsToDisplay = this.emails.map(email => ({ ...email, selected: false }));
  }

  toggleEmail (email) {
    if (this.openEmailId === email.id) {
      this.openEmailId = null;
    } else {
      this.$emit('open-email', email);
      this.openEmailId = email.id;
    }
  }

  selectAll () {
    for (let email of this.emailsToDisplay) {
      email.selected = true;
    }
  }

  deselectAll () {
    for (let email of this.emailsToDisplay) {
      email.selected = false;
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

.c-emails__action + .c-emails__action {
  margin-left: 0.5rem;
}

.c-email {
  display: flex;
  align-items: center;
}

.c-emails-list-item__checkbox {
  padding: 0 1rem;
}

.c-emails-list-item__content {
  padding: 1rem 2.5rem 1rem 6rem;
  position: relative;
  flex-grow: 1;
}

.c-emails-list-item__content:before {
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
