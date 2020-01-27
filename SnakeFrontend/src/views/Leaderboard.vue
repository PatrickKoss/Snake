<template>
  <v-row :dark="state.dark" no-gutters>
    <v-card :dark="state.dark">
      <v-tabs :dark="state.dark" :style="'width:' + windowWidth + 'px'" v-model="tab">
        <v-tab :key="cat" v-for="cat in leaderboardTable.categories.tabCategories">{{cat}}</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item :key="index" v-for="(leaderboard, index) in leaderboardTable.leaderboards">
          <v-card :dark="state.dark" flat>
            <v-card-title>

              <v-spacer/>
              <v-text-field
                      append-icon="mdi-filter"
                      hide-details
                      label="Search"
                      single-line
                      v-model="searchLeaderboards[index]"
              />
            </v-card-title>
            <v-data-table
                    :headers="leaderboardTable.headers[index]"
                    :items="leaderboard"
                    :search="searchLeaderboards[index]"
            />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-row>
</template>

<script>
  import {Component, Vue} from 'vue-property-decorator';
  import {LeaderboardRestClient} from "../model/LeaderboardRestClient";

  @Component
  class Leaderboard extends Vue {
    state = this.$store.state;
    tab = null;
    windowWidth = 500;
    leaderboardTable = {
      headers: [],
      leaderboards: [],
      categories: {
        tabCategories: ['All Scores', 'Solo Scores', 'Vs AI Scores'],
        backendCategories: [null, 'Solo', 'VsAI']
      }
    };
    searchLeaderboards = [];

    /**
     * create the leaderboard table dynamically based on the backend data
     * @returns {Promise<void>}
     */
    async created() {
      this.windowWidth = window.innerWidth - 40;
      // fill the leaderboardTable dynamically based on property backend categories
      let response = null;
      for (const category of this.leaderboardTable.categories.backendCategories) {
        if (category) {
          response = await new LeaderboardRestClient().getLeaderboard(category);
        } else {
          response = await new LeaderboardRestClient().getLeaderboard()
        }
        this.leaderboardTable.leaderboards.push(response.leaderboard);
        if (response.leaderboard.length > 0) {
          let headerProps = Object.keys(response.leaderboard[0]);
          let header = [];
          for (const prop of headerProps) {
            header.push({text: prop, value: prop});
          }
          this.leaderboardTable.headers.push(header);
        }
        this.searchLeaderboards.push("");
      }
      window.addEventListener('resize', this.setWindowWidth);
    }

    setWindowWidth(event) {
      this.windowWidth = event.target.innerWidth - 40;
    }

    /**
     * clean up logic
     */
    beforeDestroy() {
      window.removeEventListener('resize', this.setWindowWidth);
    }
  }

  export default Leaderboard
</script>
<style scoped>
</style>
