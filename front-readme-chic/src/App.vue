<!-- Nav component template -->
<template>
  <div class="relative bg-base-100">
    <!-- Navbar -->
    <div class="navbar fond p-4 flex items-center fixed top-0 left-0 right-0 z-20">
      <img src="/readmechic.png" alt="Logo" class="h-8 w-8 mr-2" />
      <span class="text-xl">Readme Chic</span>
      <div class="badge badge-accent ml-2">Beta1</div>
      <div class="ml-auto gitmo flex items-center gap-4">
        <a
          href="https://github.com/your-repo-url"
          target="_blank"
          class="btn btn-sm btn-accent z-10"
          aria-label="GitHub Repository"
        >
          GitHub
        </a>
        <label for="my-drawer" class="btn btn-square btn-ghost z-20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </label>
      </div>
    </div>

    <!-- Drawer -->
    <div class="drawer drawer-mobile h-screen lg:drawer-open">
      <!-- Toggle control -->
      <input id="my-drawer" type="checkbox" class="drawer-toggle" />

      <!-- Sidebar -->
      <div class="drawer-side w-56 lg:fixed lg:inset-y-0 lg:left-0 lg:top-16 z-10">
        <label for="my-drawer" class="drawer-overlay"></label>
        <ul class="menu fond text-base-content w-56 p-4 space-y-2 lg:fixed lg:inset-y-0 lg:left-0 lg:top-16 lg:overflow-y-auto">
          <li>
            <router-link to="/intro" class="block px-4 py-2 hover:bg-neutral" active-class="bg-neutral" exact-active-class="bg-neutral">
              Intro
            </router-link>
          </li>
          <li>
            <details open>
              <summary>Readme Chic Components</summary>
              <ul>
                <li>
                  <router-link to="/" class="block px-4 py-2 hover:bg-neutral" active-class="bg-neutral" exact-active-class="bg-neutral">
                    Banner
                  </router-link>
                </li>
                <li>
                  <router-link to="/badge" class="block px-4 py-2 hover:bg-neutral" active-class="bg-neutral" exact-active-class="bg-neutral">
                    Badge
                  </router-link>
                </li>
                <li>
                  <router-link to="/block" class="block px-4 py-2 hover:bg-neutral" active-class="bg-neutral" exact-active-class="bg-neutral">
                    Block
                  </router-link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>

      <!-- Main content -->
      <div class="drawer-content overflow-auto p-4 lg:ml-56 pt-16">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// Component logic for Nav
export default {
  name: 'Nav'
}
</script>

<style scoped>
/* Scoped styles for Nav component */
/* Utility class for padding (fond) */
ul.menu {
  width: 260px; /* w-56 corresponds to 14rem */
}
.fond{
padding: 20Px;
}
</style>