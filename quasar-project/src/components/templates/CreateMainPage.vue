<script setup lang="ts"></script>

<template>
  <section class="cards" v-if="$route.name == 'Create'">
    <ul>
      <li>
        <RouterLink to="/social/friends/add" class="friend">
          <q-icon size="xxx-large" color="light" name="person" />
          <h2>Add a friend</h2>
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/social/groups/add" class="group">
          <q-icon size="xxx-large" color="light" name="people" />
          <h2>Make a group</h2>
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/create/bill" class="you">
          <q-icon size="xxx-large" color="light" name="receipt" />
          <h2>Make a bill</h2>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
i {
  font-size: xx-large;
  width: 2rem;
  padding: 2rem;

  text-align: center;
  border-radius: 10px;
}

.you::after {
  animation-delay: 3s;
  background: linear-gradient(27deg, rgba(1, 193, 27, 1) 0%, rgba(2, 217, 137, 1) 100%);
}

.friend::after {
  animation-delay: 8s;
  background: linear-gradient(27deg, rgba(59, 36, 255, 1) 0%, rgba(63, 199, 251, 1) 100%);
}

.group::after {
  background: linear-gradient(27deg, rgba(251, 63, 117, 1) 0%, rgba(255, 99, 70, 1) 100%);
}

@keyframes changeRadius {
  0% {
    border-radius: 72% 28% 72% 28% / 43% 84% 16% 57%;
  }
  25% {
    border-radius: 25% 75% 49% 51% / 66% 90% 10% 34%;
  }
  50% {
    border-radius: 51% 49% 29% 71% / 54% 20% 80% 46%;
  }
  75% {
    border-radius: 84% 16% 34% 66% / 16% 81% 19% 84%;
  }
  100% {
    border-radius: 72% 28% 72% 28% / 43% 84% 16% 57%;
  }
}

ul {
  padding: 0;
  margin: 2rem 1rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;

  & li {
    list-style: none;
    flex: 1 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    background-color: $card;
    backdrop-filter: blur(10px);

    a {
      text-decoration: none;
      color: $text;
      text-align: center;
      padding: 0.5rem;
      position: relative;
      width: 100%;
      border: none;
      background: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      &::after {
        z-index: -1;
        display: block;
        position: absolute;
        border-radius: 72% 28% 72% 28% / 43% 84% 16% 57%;
        animation: changeRadius 20s infinite alternate linear;
        top: 1rem;
        filter: blur(5px);
        left: 1rem;
        height: 6rem;
        width: 6rem;
        content: '';
      }
    }

    & h2 {
      color: $text;
    }
  }
}

section {
  background-color: transparent !important;
}
.cards {
  height: 90%;
}

.body--dark {
  ul li {
    background-color: $step-850;
    h2 {
      color: $step-50;
    }
  }
}
</style>
