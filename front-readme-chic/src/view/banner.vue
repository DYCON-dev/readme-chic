<!-- BannerPage component template -->
<template>
  <div>
    
  </div>
    <div class="banner flex flex-col justify-between  h-full  gap-4  border-4 border-primary ">
      <!-- Link -->
      <div class="relative w-full overflow-visible pt-4">
        <div class="flex items-center gap-2 rounded-box border border-primary p-2 w-full max-w-3xl mx-auto">
          <input
            type="text"
            :value="blockLink"
            readonly
            placeholder="SVG URL"
            class="input input-ghost input-sm flex-1"
          />
          <button
            v-if="blockLink"
            @click="openLink"
            class="btn btn-sm btn-secondary"
            title="View SVG"
          >
            View
          </button>
          <button
            @click="copyLink"
            class="btn btn-sm btn-accent"
            title="Copy URL"
          >
            Copy
          </button>
        </div>
      </div>
  
      <!-- Block -->
      <div class="relative w-full overflow-visible flex justify-center pb-8 items-center pt-6">
        <ul
          class="flex justify-center items-center gap-4 w-full h-full"
          style="width: auto; height: auto; max-width: 100%; max-height: 100%;"
        >
          <li v-if="blockLink" class="flex-1 flex justify-center items-center">
            <img
              :src="blockLink"
              :width="width"
              :height="height"
              alt="SVG Preview"
            />
          </li>
          <p v-else class="top-0 left-0 text-sm text-base-300 m-2">No SVG generated.</p>
        </ul>
      </div>
  
      <!-- Select -->
      <div class="relative w-full overflow-visible pb-4">
        <div
          v-if="hoveredItem"
          class="hover-panel absolute bottom-full left-1/2 transform -translate-x-1/2 bg-base-100 p-4 rounded-box shadow-lg z-50 border border-primary mb-4"
          style="width: 50vw;"
        >
          <!-- Close button -->
          <button
            @click="hoveredItem = ''"
            class="btn btn-sm btn-ghost absolute top-2 right-2"
            aria-label="Close"
          >
            ✕
          </button>
          <div v-if="hoveredItem === 'Size'" class="flex gap-4 w-full">
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Width (px)</label>
              <input type="number" v-model="width" class="input input-sm w-full" />
            </div>
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Height (px)</label>
              <input type="number" v-model="height" class="input input-sm w-full" />
            </div>
          </div>
          <div v-else-if="hoveredItem === 'Border'" class="flex flex-col gap-4 w-full">
            <h4 class="font-bold">Border</h4>
            <div class="flex gap-4 w-full">
              <div class="flex flex-col flex-1">
                <label class="font-bold mb-1">Border Radius (px)</label>
                <input type="number" v-model="borderRadius" class="input input-sm w-full" />
              </div>
              <div class="flex flex-col flex-1">
                <label class="font-bold mb-1">Border Color</label>
                <input type="color" v-model="borderColor" class="input input-sm w-full" />
              </div>
              <div class="flex flex-col flex-1">
                <label class="font-bold mb-1">Border Width (px)</label>
                <input type="number" v-model="borderWidth" class="input input-sm w-full" />
              </div>
              <div class="flex flex-col flex-1">
                <label class="font-bold mb-1">Border Style</label>
                <select v-model="borderStyle" class="select select-sm w-full">
                  <option value="solid">solid</option>
                  <option value="dashed">dashed</option>
                  <option value="dotted">dotted</option>
                  <option value="double">double</option>
                </select>
              </div>
            </div>
          </div>
          <div v-else-if="hoveredItem === 'Color'" class="flex flex-wrap gap-4">
            <h4 class="font-bold">Color</h4>
            <label class="flex items-center gap-2">Background (c1):
              <input type="color" v-model="c1" class="input input-sm"/>
            </label>
            <label class="flex items-center gap-2">Gradient (c2):
              <input type="color" v-model="c2" class="input input-sm"/>
            </label>
            <label class="flex items-center gap-2">Background image:
              <input type="text" v-model="bgImageUrl" placeholder="Image URL" class="input input-sm"/>
            </label>
          </div>
          <div v-else-if="hoveredItem === 'Text'" class="flex flex-col gap-6 w-full">
            <h4 class="font-bold mb-3">Text</h4>
            <!-- Line 1: Title and fs1 -->
            <div class="flex gap-4 w-full">
              <div class="flex flex-col flex-1">
                <label class="font-bold mb-1">Title</label>
                <input type="text" v-model="title" class="input input-sm w-full" />
              </div>
              <div class="flex flex-col items-end">
                <label class="font-bold mb-1">fs1 (px)</label>
                <input type="number" v-model.number="fs1" class="input input-sm w-24" />
              </div>
            </div>
            <!-- Line 2: Subtitle and fs2 -->
            <div class="flex gap-4 w-full mt-4">
              <div class="flex flex-col flex-1">
                <label class="font-bold mb-1">Subtitle</label>
                <input type="text" v-model="subtitle" class="input input-sm w-full" />
              </div>
              <div class="flex flex-col items-end">
                <label class="font-bold mb-1">fs2 (px)</label>
                <input type="number" v-model.number="fs2" class="input input-sm w-24" />
              </div>
            </div>
            <!-- Text Alignment -->
            <div class="flex gap-4 w-full mt-4 items-center">
              <div class="flex flex-col flex-1">
                <label class="font-bold mb-1">Text Align</label>
                <select v-model="textAlign" class="select select-sm w-full">
                  <option value="left">left</option>
                  <option value="center">center</option>
                  <option value="right">right</option>
                </select>
              </div>
            </div>
            <!-- Text Colors -->
            <div class="flex gap-4 w-full mt-4">
              <div class="flex flex-col flex-1">
                <label class="font-bold mb-1">Col1 (texte principal)</label>
                <input type="color" v-model="col1" class="input input-sm w-full" />
              </div>
              <div class="flex flex-col flex-1">
                <label class="font-bold mb-1">Col2 (texte secondaire)</label>
                <input type="color" v-model="col2" class="input input-sm w-full" />
              </div>
            </div>
            <!-- Line 3: Description and Text Spacing -->
            <div class="flex gap-4 w-full mt-4">
              <div class="flex flex-col flex-1">
                <label class="font-bold mb-1">Description</label>
                <textarea v-model="description" class="textarea textarea-sm w-full"></textarea>
              </div>
              <div class="flex flex-col items-end">
                <label class="font-bold mb-1">Spacing</label>
                <input type="number" step="0.1" v-model.number="textSpacing" class="input input-sm w-24" />
              </div>
            </div>
          </div>
          <div v-else-if="hoveredItem === 'Template'" class="flex gap-4">
            <label class="flex items-center gap-2">Link URL:
              <input type="text" v-model="linkUrl" class="input input-sm" placeholder="e.g. https://..." />
            </label>
            <button @click="applyLink" class="btn btn-primary w-fit">Add Link</button>
          </div>
        </div>
  
        <ul
          class="menu menu-horizontal bg-base-100 gap-4 rounded-box border border-primary"
          style="width: 50vw;"
        >
          <li class="flex-1" @mouseover="hoveredItem = 'Size'">
            <a
              :class="[
                'flex items-center justify-center gap-2 w-full px-4 py-2',
                hoveredItem === 'Size' ? 'bg-neutral' : 'bg-base-200'
              ]"
            >
              <img
                src="/icon/nav/Size.svg"
                alt="Size Icon"
                class="h-5 w-5"
              />
              Size
            </a>
          </li>
          <li class="flex-1" @mouseover="hoveredItem = 'Border'">
            <a
              :class="[
                'flex items-center justify-center gap-2 w-full px-4 py-2',
                hoveredItem === 'Border' ? 'bg-neutral' : 'bg-base-200'
              ]"
            >
              <img
                src="/icon/nav/border.svg"
                alt="Border Icon"
                class="h-5 w-5"
              />
              Border
            </a>
          </li>
          <li class="flex-1" @mouseover="hoveredItem = 'Color'">
            <a
              :class="[
                'flex items-center justify-center gap-2 w-full px-4 py-2',
                hoveredItem === 'Color' ? 'bg-neutral' : 'bg-base-200'
              ]"
            >
              <img
                src="/icon/nav/color.svg"
                alt="Color Icon"
                class="h-5 w-5"
              />
              Color
            </a>
          </li>
          <li class="flex-1" @mouseover="hoveredItem = 'Text'">
            <a
              :class="[
                'flex items-center justify-center gap-2 w-full px-4 py-2',
                hoveredItem === 'Text' ? 'bg-neutral' : 'bg-base-200'
              ]"
            >
              <img
                src="/icon/nav/text.svg"
                alt="Text Icon"
                class="h-5 w-5"
              />
              Text
            </a>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  // Component logic for BannerPage
  export default {
    name: 'BannerPage',
    data() {
      return {
        hoveredItem: '',
        width: 800, // default width
        height: 400, // default height
        c1: '#12161B', // background color
        c2: '', // gradient color
        bgImageUrl: '', // sample image
        textAlign: 'center', // text alignment
        borderRadius: 10, // corner radius
        borderColor: '#1D232A', // border color
        borderWidth: 4, // border width
        borderStyle: 'solid', // border style
        title: 'Welcome to Readme Chic', // default title
        subtitle: 'Your chic subtitle', // default subtitle
        description: 'Chic description text', // default description
        col1: '#FFFFFF',               // primary text color
        col2: '#E0E0E0',               // secondary text color
        fs1: 36, // font size for title
        fs2: 18, // font size for subtitle/description
        textSpacing: 2, // line spacing
        updateTimer: null,
        blockLink: '',
      }
    },
    created() {
      const params = new URLSearchParams(window.location.search);
      const keys = ['width','height','c1','c2','col1','col2','borderRadius','borderWidth','borderStyle','borderColor','bgImageUrl','textAlign','fs1','fs2','textSpacing','title','subtitle','description'];
      keys.forEach(key => {
        if (params.has(key)) {
          const val = params.get(key);
          if (['width','height','borderWidth','fs1','fs2'].includes(key)) {
            this[key] = Number(decodeURIComponent(val));
          } else {
            this[key] = decodeURIComponent(val);
          }
        }
      });
      this.applyLink();
    },
    methods: {
      openLink() {
        if (this.blockLink) window.open(this.blockLink, '_blank');
      },
      scheduleUpdate() {
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
          this.blockLink = this.buildUrl();
        }, 300);
      },
      buildUrl() {
        const endpoint = 'https://readme-chic.dycon-pv.workers.dev/?template=fancy';
        const params = new URLSearchParams();
        const map = {
          width: this.width,
          height: this.height,
          c1: this.c1,
          c2: this.c2,
          col1: this.col1,
          col2: this.col2,
          borderRadius: this.borderRadius,
          borderWidth: this.borderWidth,
          borderStyle: this.borderStyle,
          borderColor: this.borderColor,
          bgImageUrl: this.bgImageUrl,
          textAlign: this.textAlign,
          fs1: this.fs1,
          fs2: this.fs2,
          textSpacing: this.textSpacing,
          title: this.title,
          subtitle: this.subtitle,
          description: this.description
        };
        for (const key in map) {
          const val = map[key];
          if (val !== '' && val != null) {
            let v = val;
            if (['c1','c2','borderColor','col1','col2'].includes(key) && typeof v === 'string' && !v.startsWith('#')) {
              v = `#${v}`;
            }
            params.set(key, v);
          }
        }
        return `${endpoint}&${params.toString()}`;
      },
      applyLink() {
        // Immediate update
        this.blockLink = this.buildUrl();
      },
      copyLink() {
        if (this.blockLink) {
          const markdown = `![${this.title}](${this.blockLink})
<!--
## ${this.title}
-->`;
          navigator.clipboard.writeText(markdown);
        }
      },
    },
    watch: {
      width: 'scheduleUpdate',
      height: 'scheduleUpdate',
      c1: 'scheduleUpdate',
      c2: 'scheduleUpdate',
      col1: 'scheduleUpdate',
      col2: 'scheduleUpdate',
      borderRadius: 'scheduleUpdate',
      borderWidth: 'scheduleUpdate',
      borderStyle: 'scheduleUpdate',
      borderColor: 'scheduleUpdate',
      bgImageUrl: 'scheduleUpdate',
      textAlign: 'scheduleUpdate',
      fs1: 'scheduleUpdate',
      fs2: 'scheduleUpdate',
      textSpacing: 'scheduleUpdate',
      title: 'scheduleUpdate',
      subtitle: 'scheduleUpdate',
      description: 'scheduleUpdate',
    },
  }
  </script>
  
  /* Scoped styles for BannerPage component */
  <style scoped>
  .banner {
    width: 100%;
    height: 90vh;
    border-radius: 20px;
    background-color: #0D1116;
  }
    
    /* Hover panel adjustment */
    .hover-panel {
      transition: opacity 0.2s ease-in-out;
    }
    </style>