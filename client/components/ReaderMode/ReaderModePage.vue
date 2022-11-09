<!-- Default page that also displays freets -->

<template>
  <main data-theme="dark" >
    <section v-if="$store.state.username">
      <header class="title py-4">reader mode</header>
      <ReaderModeButton />
    </section>

    <section>
      <header>
        <div class="left">
          <h2 class="py-8">
            Viewing all freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get freets"
            user="$store.state.username"
          />
        </div>
      </header>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetOrEventComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
// import FreetComponent from '@/components/Freet/FreetComponent.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import FreetOrEventComponent from '@/components/common/FreetOrEventComponent.vue';
import ReaderModeButton from '@/components/ReaderMode/ReaderModeButton.vue'

export default {
  name: 'ReaderModePage',
  components: {FreetOrEventComponent, GetFreetsForm, ReaderModeButton},
  mounted() {
    this.$refs.getFreetsForm.submit();
    this.$store.commit('refreshBookmarks');
    this.$store.commit('refreshLikes');
    this.$store.commit('refreshEventAnnouncements');
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
.title {
    font-size: 32px;
    margin: 0 5px;
}
</style>
