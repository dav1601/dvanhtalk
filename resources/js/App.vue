<template>
  <!-- App.vue -->
  <v-app>
    <v-app-bar app v-show="!isNotFound">
      <v-container class="d-flex justify-content-end">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="indigo" dark v-bind="attrs" v-on="on">
              Hi! {{ name }}
            </v-btn>
          </template>

          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                    alt="John"
                  />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ name }}</v-list-item-title>
                  <v-list-item-subtitle> {{ email }} </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    :class="fav ? 'red--text' : ''"
                    icon
                    @click="fav = !fav"
                  >
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text @click="menu = false"> Đóng </v-btn>
              <v-btn
                color="primary"
                text
                onclick="event.preventDefault();
                              document.getElementById('logout-form').submit();"
              >
                Đăng xuất
              </v-btn>
              <form
                id="logout-form"
                action="/logout"
                method="POST"
                style="display: none"
              >
                <input type="hidden" name="_token" :value="csrfToken" />
              </form>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-container>
    </v-app-bar>
    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container :class="{ full: !isHome }">
        <!-- <div class="card" :class="{ fix1: isHome }">
          <v-slide-x-transition mode="out-in">
            <router-view></router-view>
          </v-slide-x-transition>
        </div> -->
        <v-card :class="{ fix1: isHome }">
          <v-slide-x-transition mode="out-in">
            <router-view></router-view>
          </v-slide-x-transition>
        </v-card>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import user from "./mixin/user";
import ListUser from "./pages/TheLobby.vue";
export default {
  components: { ListUser },
  mixins: [user],
  name: "App",
  data: () => ({
    fav: true,
    csrfToken: document.head.querySelector('meta[name="csrf-token"]').content,
    menu: false,
  }),
  async created() {
    await this.setMe;
    Echo.join(`lobby`)
      .here((users) => {
        this.$store.dispatch("users/getUsersOnline", users);
      })
      .joining((user) => {
        this.$store.dispatch("users/pushUsersOnline", user);
      })
      .leaving((user) => {
        this.$store.dispatch("users/deleteUser", user);
      })
      .listen("Lobby", (e) => {
        console.log(e);
      });
  },
  computed: {
    async setMe() {
      await this.$store
        .dispatch("auth/getMe")
        .then((req) => {})
        .catch((err) => {
          console.log(err);
        });
    },
    isNotFound() {
      return this.$route.name == "404";
    },
  },
};
</script>
<style lang="scss" >
.list-group-item {
  border-radius: 8px !important;
}
.fix1 {
  border: none;
  .border-right {
    border-right: none !important;
  }
  .row {
    justify-content: center;
  }
}
.full {
  max-width: 100% !important;
}
.me-chat {
  background: #ff7675 !important;
  color: #fff !important;
}
.friend-chat {
  background: #a29bfe !important;
  color: #fff;
}
.listUser {
  max-height: 748px;
  overflow: auto;
}
.list-group-item.active {
  border-radius: 8px;
  background: #a29bfe !important;
  transition: background 0.25s;
}
.list-group-item:hover {
  border-radius: 8px;
  background: #a29bfe !important;
  transition: background 0.25s;
}
.list-group-item {
  background: #121212 !important;
  color: #fff !important;
  margin-bottom: 10px;
}
.chat-online {
  color: #34ce57;
}

.chat-offline {
  color: #e4606d;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  height: 590px;
  overflow-y: scroll;
}

.chat-message-left,
.chat-message-right {
  display: flex;
  flex-shrink: 0;
}

.chat-message-left {
  margin-right: auto;
}

.chat-message-right {
  flex-direction: row-reverse;
  margin-left: auto;
}
.py-3 {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}
.px-4 {
  padding-right: 1.5rem !important;
  padding-left: 1.5rem !important;
}
.flex-grow-0 {
  flex-grow: 0 !important;
}
.border-top {
  border-top: 1px solid #dee2e6 !important;
}
.scroll-custom::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 10px;
}

.scroll-custom::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

.scroll-custom::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    color-stop(0.44, rgb(122, 153, 217)),
    color-stop(0.72, rgb(73, 125, 189)),
    color-stop(0.86, rgb(28, 58, 148))
  );
}
</style>
