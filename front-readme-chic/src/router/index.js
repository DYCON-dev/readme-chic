// Router configuration for the application

// Import Vue Router functions
import { createRouter, createWebHistory } from 'vue-router'; // Create router with HTML5 history mode
import Banner      from '../view/banner.vue';      // Banner component for homepage
import Badge       from '../view/badge.vue';       // Badge display component
import Block       from '../view/block.vue';       // Block component for content sections
import GeneralInfo from '../view/info-generale.vue'; // General information component

// Define application routes: path, name, and associated components
const routes = [
  { path: '/',            name: 'Banner',       component: Banner },
  { path: '/badge',       name: 'Badge',        component: Badge  },
  { path: '/block',       name: 'Block',        component: Block  },
  { path: '/intro',       name: 'GeneralInfo',  component: GeneralInfo }, // Introductory information page
];

// Create and configure router instance with history mode and custom scroll behavior
export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // If navigation triggered by browser history, restore saved scroll position
    if (savedPosition) {
      return savedPosition;
    // If the target route contains a hash, scroll smoothly to the element with that ID
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    // Default: scroll to the top of the page
    } else {
      return { top: 0 };
    }
  }
});