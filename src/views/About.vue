<template>
  <section class="c-about">
    <div class="c-about__content-wrapper">
      <h1 class="c-about__heading" tid="c-about__heading">Vue testing examples</h1>
      <p>
        Check out
        <a
          rel="noreferrer noopener"
          href="https://github.com/mcibique/vue-testing-examples"
          target="_blank"
          tid="c-about__github-link"
        >github</a> page. Go
        <router-link :to="{ name: 'root' }" tid="c-about__back-link">back</router-link>.
      </p>
    </div>
  </section>
</template>

<style>
.c-about {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.c-about__content-wrapper {
  background-color: var(--form-background-color);
  border: 1px solid var(--form-border-color);
  border-radius: 0.4rem;
  box-shadow: 0.3rem 0.3rem 0.4rem 0.1rem var(--form-border-color);
  padding: 0.5rem 2rem 4rem;
  min-width: 320px;
  text-align: center;
}
</style>
