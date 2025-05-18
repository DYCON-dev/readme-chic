<!-- BadgePage component template -->
<template>
  <!-- Badge customization page -->
  <div class="banner mx-auto flex flex-col justify-between h-full gap-4 border-4 border-primary p-4">
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

    <!-- Preview Badge -->
    <div class="relative w-full overflow-visible flex justify-center items-center pb-8 pt-6">
      <img
        v-if="blockLink"
        :src="blockLink"
        :width="width"
        :height="height"
        alt="Badge Preview"
      />
      <p v-else class="text-sm text-base-300 m-2">No badge generated.</p>
    </div>

    <!-- Select -->
    <div class="relative w-full overflow-visible pb-4">
      <div v-if="hoveredItem"
           class="hover-panel absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-base-100 p-4 rounded-box shadow-lg z-50 border border-primary"
           style="width:50vw;">
        <button @click="hoveredItem=''" class="btn btn-sm btn-ghost absolute top-2 right-2">✕</button>
        <div v-if="hoveredItem==='Size'" class="flex gap-4 w-full">
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Preset</label>
            <select v-model="size" class="select select-sm w-full">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
        <div v-else-if="hoveredItem==='Color'" class="flex gap-4">
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Background</label>
            <input type="color" v-model="bgColor" class="input input-sm w-full" />
          </div>
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Text</label>
            <input type="color" v-model="textColor" class="input input-sm w-full" />
          </div>
        </div>
        <div v-else-if="hoveredItem==='Text'" class="flex gap-4">
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Text</label>
            <input type="text" v-model="text" class="input input-sm w-full" />
          </div>
        </div>
        <div v-else-if="hoveredItem==='Image'" class="flex flex-col gap-4">
          <label class="font-bold mb-1">Image URL or Icon</label>
          <div class="flex items-center gap-2">
            <input type="text"
                   v-model="bgImageUrl"
                   placeholder="Image URL"
                   class="input input-sm flex-1"/>
            <input
              type="text"
              v-model="selectedIcon"
              @input="updateIcon"
              list="icon-list"
              placeholder="Search icon"
              class="input input-sm w-32"
            />
            <datalist id="icon-list">
              <option v-for="icon in iconList" :key="icon" :value="icon" />
            </datalist>
            <input type="color" v-model="iconColor" class="input input-sm w-10" title="Icon color"/>
          </div>
          <div v-html="iconSvg" class="h-8 w-8"></div>
        </div>
        <div v-else-if="hoveredItem==='Border'" class="flex flex-col gap-4">
          <div class="flex gap-4 w-full">
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Border Radius (px)</label>
              <input type="number" v-model.number="borderRadius" class="input input-sm w-full" />
            </div>
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Border Width (px)</label>
              <input type="number" v-model.number="borderWidth" class="input input-sm w-full" />
            </div>
          </div>
          <div class="flex gap-4 w-full">
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Border Color</label>
              <input type="color" v-model="borderColor" class="input input-sm w-full" />
            </div>
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Border Style</label>
              <select v-model="borderStyle" class="select select-sm w-full">
                <option value="solid">solid</option>
                <option value="dashed">dashed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <ul
        class="menu menu-horizontal bg-base-100 gap-4 rounded-box border border-primary"
        style="width: 50vw;"
      >
        <li class="flex-1" @mouseenter="onHover($event,'Size')">
          <a :class="['flex items-center justify-center gap-2 w-full px-4 py-2', hoveredItem==='Size'?'bg-neutral':'bg-base-200']">
            Size
          </a>
        </li>
        <li class="flex-1" @mouseenter="onHover($event,'Color')">
          <a :class="['flex items-center justify-center gap-2 w-full px-4 py-2', hoveredItem==='Color'?'bg-neutral':'bg-base-200']">
            Color
          </a>
        </li>
        <li class="flex-1" @mouseenter="onHover($event,'Text')">
          <a :class="['flex items-center justify-center gap-2 w-full px-4 py-2', hoveredItem==='Text'?'bg-neutral':'bg-base-200']">
            Text
          </a>
        </li>
        <li class="flex-1" @mouseenter="onHover($event,'Image')">
          <a :class="['flex items-center justify-center gap-2 w-full px-4 py-2',
                     hoveredItem==='Image'?'bg-neutral':'bg-base-200']">
            Image
          </a>
        </li>
        <li class="flex-1" @mouseenter="onHover($event,'Border')">
          <a :class="[
            'flex items-center justify-center gap-2 w-full px-4 py-2',
            hoveredItem==='Border'?'bg-neutral':'bg-base-200'
          ]">
            Border
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// Component logic for BadgePage
// Load all SVGs as raw text
const iconModules = import.meta.glob('../assets/icon/logo/*.svg', { eager: true, as: 'raw' });
const dynamicIconList = Object.keys(iconModules).map(path => path.replace('../assets/icon/logo/', ''));
export default {
  name: 'BadgePage',
  data() {
    return {
      hoveredItem: '',
      hoverX: 0,
      size: 'medium',
      width: 200,
      height: 50,
      bgColor: '#030712',
      textColor: '#f1f2f4',
      text: 'My Badge',
      blockLink: '',
      presets: {
        small: { width: 200, height: 30, fontSize: 10 },
        medium: { width: 200, height: 50, fontSize: 16 },
        large: { width: 300, height: 70, fontSize: 24 }
      },
      fontSize: 16,
      bgImageUrl: '',
      borderRadius: 0,
      borderWidth: 0,
      borderColor: '#1D232A',
      borderStyle: 'solid',
      updateTimer: null,
      iconList: dynamicIconList,
      selectedIcon: '',
      iconColor: '#000000',
      iconSvg: '',
    };
  },
  created() {
    this.updateLink();
  },
  methods: {
    updateLink() {
      const base = 'https://readme-chic.dycon-pv.workers.dev/?template=badge';
      const params = new URLSearchParams({
        size: this.size,
        w: this.width,
        h: this.height,
        fontSize: this.fontSize,
        bgColor: this.bgColor,
        textColor: this.textColor,
        text: this.text,
        bgImageUrl: this.bgImageUrl,
        borderRadius: this.borderRadius,
        borderWidth: this.borderWidth,
        borderColor: this.borderColor,
        borderStyle: this.borderStyle,
      });
      this.blockLink = `${base}&${params.toString()}`;
    },
    openLink() { if (this.blockLink) window.open(this.blockLink, '_blank'); },
    copyLink() {
      if (this.blockLink) {
        const markdown = `![${this.text}](${this.blockLink})
<!--
## ${this.text}
-->`;
        navigator.clipboard.writeText(markdown);
      }
    },
    onHover(e, item) {
      this.hoveredItem = item;
      const parentRect = e.currentTarget.parentNode.getBoundingClientRect();
      const liRect = e.currentTarget.getBoundingClientRect();
      this.hoverX = liRect.left - parentRect.left + liRect.width / 2;
    },
    onLeave() {
      this.hoveredItem = '';
    },
    async updateIcon() {
      if (!this.selectedIcon) {
        this.iconSvg = '';
        return;
      }
      let svgText = iconModules[`../assets/icon/logo/${this.selectedIcon}`];
      // Inject fill and stroke on the root <svg> element
      svgText = svgText.replace(
        /<svg([^>]*)>/,
        `<svg$1 fill="${this.iconColor}" stroke="${this.iconColor}">`
      );
      // Update fill attributes
      svgText = svgText.replace(/fill="[^"]*"/g, `fill="${this.iconColor}"`);
      // Update stroke attributes
      svgText = svgText.replace(/stroke="[^"]*"/g, `stroke="${this.iconColor}"`);
      // Set Data URI for badge preview
      const base64 = btoa(svgText);
      this.bgImageUrl = `data:image/svg+xml;base64,${base64}`;
      this.iconSvg = svgText;
      // Rebuild badge URL to include updated bgImageUrl
      this.updateLink();
    },
  },
  watch: {
    size(newVal) {
      const preset = this.presets[newVal];
      this.width = preset.width;
      this.height = preset.height;
      this.fontSize = preset.fontSize;
      this.updateLink();
    },
    width: 'updateLink',
    height: 'updateLink',
    bgColor: 'updateLink',
    textColor: 'updateLink',
    text: 'updateLink',
    bgImageUrl: 'updateLink',
    borderRadius: 'updateLink',
    borderWidth: 'updateLink',
    borderColor: 'updateLink',
    borderStyle: 'updateLink',
    selectedIcon: 'updateIcon',
    iconColor: 'updateIcon',
  }
};
</script>
  
<style scoped>
/* Scoped styles for BadgePage component */
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