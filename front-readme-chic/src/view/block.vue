<!-- BlockPage component template -->
<template>
  <div class="banner mx-auto flex flex-col justify-between h-full gap-4 border-4 border-primary p-4">
    <!-- Link -->
    <div class="relative w-full overflow-visible pt-4">
      <div class="flex items-center gap-2 rounded-box border border-primary p-2 w-full max-w-3xl mx-auto">
        <input
          type="text"
          :value="blockLink"
          readonly
          placeholder="Block SVG URL"
          class="input input-ghost input-sm flex-1"
        />
        <button v-if="blockLink" @click="openLink" class="btn btn-sm btn-secondary">View</button>
        <button @click="copyLink" class="btn btn-sm btn-accent">Copy</button>
      </div>
    </div>
    <div class="flex items-center gap-4 mb-4">
      <button @click="addBlock" class="btn btn-sm btn-primary">Ajouter Bloc</button>
      <label>Gap: {{ gap }}px</label>
      <label>Blocs: {{ numBlocks }}</label>
    </div>

    <!-- Preview -->
    <div class="relative w-full overflow-visible flex justify-center items-center pb-8 pt-6">
      <img
        v-if="blockLink"
        :src="blockLink"
        :width="blocks[selectedBlock].width"
        :height="blocks[selectedBlock].height"
        alt="Block Preview"
      />
      <p v-else class="text-sm text-base-300 m-2">No block generated.</p>
    </div>

    <!-- Controls -->
    <div class="relative w-full overflow-visible pb-4">
      <div
        v-if="hoveredItem"
        class="hover-panel absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-base-100 p-4 rounded-box shadow-lg z-50 border border-primary"
        style="width: 50vw;"
      >
        <button @click="hoveredItem=''" class="btn btn-sm btn-ghost absolute top-2 right-2">✕</button>

        <!-- Size -->
        <div v-if="hoveredItem==='Size'" class="flex gap-4">
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Width (px)</label>
            <input type="number" v-model.number="blocks[selectedBlock].width" class="input input-sm w-full" />
          </div>
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Height (px)</label>
            <input type="number" v-model.number="blocks[selectedBlock].height" class="input input-sm w-full" />
          </div>
        </div>

        <!-- Colors -->
        <div v-else-if="hoveredItem==='Color'" class="flex gap-4">
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Background</label>
            <input type="color" v-model="blocks[selectedBlock].bgColor" class="input input-sm w-full" />
          </div>
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Text Color</label>
            <input type="color" v-model="blocks[selectedBlock].textColor" class="input input-sm w-full" />
          </div>
          <!-- Background Image URL -->
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Background Image URL</label>
            <input
              type="text"
              v-model="blocks[selectedBlock].bgImage"
              placeholder="URL image de fond"
              class="input input-sm w-full"
            />
          </div>
        </div>

        <!-- Border -->
        <div v-else-if="hoveredItem==='Border'" class="flex gap-4">
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Radius (px)</label>
            <input type="number" v-model.number="blocks[selectedBlock].borderRadius" class="input input-sm w-full" />
          </div>
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Border Width (px)</label>
            <input type="number" v-model.number="blocks[selectedBlock].borderWidth" class="input input-sm w-full" />
          </div>
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Border Color</label>
            <input type="color" v-model="blocks[selectedBlock].borderColor" class="input input-sm w-full" />
          </div>
          <div class="flex flex-col flex-1">
            <label class="font-bold mb-1">Style</label>
            <select v-model="blocks[selectedBlock].borderStyle" class="select select-sm w-full">
              <option value="solid">solid</option>
              <option value="dashed">dashed</option>
            </select>
          </div>
        </div>

        <!-- Text / Title / Desc -->
        <div v-else-if="hoveredItem==='Text'" class="flex flex-col gap-4">
          <label class="font-bold mb-1">Title</label>
          <input type="text" v-model="blocks[selectedBlock].title" class="input input-sm w-full" />
          <label class="font-bold mb-1">Description</label>
          <textarea v-model="blocks[selectedBlock].description" class="textarea textarea-sm w-full"></textarea>

          <!-- Above Text -->
          <label class="font-bold mb-1">Above Text</label>
          <input type="text" v-model="blocks[selectedBlock].aboveText" class="input input-sm w-full" />

          <div class="flex gap-4 w-full">
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">fsAbove (px)</label>
              <input type="number" v-model.number="blocks[selectedBlock].fsAbove" class="input input-sm w-full" />
            </div>
          </div>

          <!-- Padding & Spacing -->
          <div class="flex gap-4 w-full">
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Padding (px)</label>
              <input type="number" v-model.number="blocks[selectedBlock].padding" class="input input-sm w-full" />
            </div>
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Text Spacing</label>
              <input type="number" step="0.1" v-model.number="blocks[selectedBlock].textSpacing" class="input input-sm w-full" />
            </div>
          </div>

          <!-- Position -->
          <div class="flex gap-4 w-full">
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Vertical Position</label>
              <select v-model="blocks[selectedBlock].position" class="select select-sm w-full">
                <option value="top">top</option>
                <option value="center">center</option>
                <option value="bottom">bottom</option>
              </select>
            </div>
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Horizontal Align</label>
              <select v-model="blocks[selectedBlock].horizontalAlign" class="select select-sm w-full">
                <option value="left">left</option>
                <option value="center">center</option>
                <option value="right">right</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Logo -->
        <div v-else-if="hoveredItem==='Logo'" class="flex flex-col gap-4">
          <label class="font-bold mb-1">Logo URL</label>
          <input type="text" v-model="blocks[selectedBlock].logoSrc" placeholder="URL logo" class="input input-sm w-full" />
          <div class="flex gap-4 w-full">
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Logo Width (px)</label>
              <input
                type="number"
                v-model.number="blocks[selectedBlock].logoWidth"
                @input="buildLink"
                class="input input-sm w-full"
              />
            </div>
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Logo Height (px)</label>
              <input
                type="number"
                v-model.number="blocks[selectedBlock].logoHeight"
                @input="buildLink"
                class="input input-sm w-full"
              />
            </div>
          </div>
          <div class="flex gap-4 w-full">
            <div class="flex flex-col flex-1">
              <label class="font-bold mb-1">Logo Position</label>
              <select
                v-model="blocks[selectedBlock].logoPosition"
                @change="buildLink"
                class="select select-sm w-full"
              >
                <option value="top">top</option>
                <option value="middle">middle</option>
                <option value="bottom">bottom</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Menu principal -->
      <ul class="menu menu-horizontal bg-base-100 gap-4 rounded-box border border-primary" style="width: 50vw;">
        <li class="flex-1" @mouseenter="setHover('Size')">
          <a :class="['flex items-center justify-center gap-2 w-full px-4 py-2', hoveredItem==='Size' ? 'bg-neutral' : 'bg-base-200']">
            Size
          </a>
        </li>
        <li class="flex-1" @mouseenter="setHover('Color')">
          <a :class="['flex items-center justify-center gap-2 w-full px-4 py-2', hoveredItem==='Color' ? 'bg-neutral' : 'bg-base-200']">
            Color
          </a>
        </li>
        <li class="flex-1" @mouseenter="setHover('Border')">
          <a :class="['flex items-center justify-center gap-2 w-full px-4 py-2', hoveredItem==='Border' ? 'bg-neutral' : 'bg-base-200']">
            Border
          </a>
        </li>
        <li class="flex-1" @mouseenter="setHover('Text')">
          <a :class="['flex items-center justify-center gap-2 w-full px-4 py-2', hoveredItem==='Text' ? 'bg-neutral' : 'bg-base-200']">
            Text
          </a>
        </li>
        <li class="flex-1" @mouseenter="setHover('Logo')">
          <a :class="['flex items-center justify-center gap-2 w-full px-4 py-2', hoveredItem==='Logo' ? 'bg-neutral' : 'bg-base-200']">
            Logo
          </a>
        </li>
      </ul>

      <!-- Sélecteur de bloc -->
      <ul class="flex gap-4 mb-4 bg-base-100 p-1 rounded-full mx-auto" style="width:50vw;">
        <li v-for="(b, idx) in blocks" :key="idx" @click="selectBlock(idx)">
          <a
            :class="[
              'flex items-center justify-center px-6 py-2 rounded-full',
              selectedBlock===idx ? 'bg-info text-white' : 'bg-base-200 text-base-content'
            ]"
          >
            Block {{ idx+1 }}
          </a>
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
export default {
  name: 'BlockPage',
  data() {
    return {
      hoveredItem: '',
      numBlocks: 1,
      blocks: Array.from({ length: 1 }, () => ({
        width: 400,
        height: 400,
        bgColor: '#131D2E',
        textColor: '#BFCCDB',
        bgImage: '',               // URL de l'image de fond
        borderRadius: 20,
        padding: 20,
        title: 'Default Title',
        description: 'Default description',
        fsTitle: 24,
        fsDesc: 16,
        aboveText: 'Default above text',
        fsAbove: 24,
        logoSrc: '',
        logoWidth: 48,
        logoHeight: 48,
        logoPosition: 'top',
        textSpacing: 1.3,
        position: 'center',
        horizontalAlign: 'center',
        borderWidth: 1,
        borderColor: '#1E4C8D',
        borderStyle: 'solid'
      })),
      selectedBlock: 0,
      gap: 0,
      blockLink: ''
    };
  },
  methods: {
    setHover(item) {
      this.hoveredItem = item;
    },
    openLink() {
      window.open(this.blockLink, '_blank');
    },
    copyLink() {
      if (this.blockLink) {
        const title = this.blocks[this.selectedBlock].title;
        const markdown = `![${title}](${this.blockLink})
<!--
## ${title}
-->`;
        navigator.clipboard.writeText(markdown);
      }
    },
    addBlock() {
      if (this.numBlocks < 4) {
        this.numBlocks++;
        const template = { ...this.blocks[0] };
        this.blocks.push(template);
        if (this.numBlocks > 1 && this.gap === 0) this.gap = 16;
        this.selectedBlock = this.numBlocks - 1;
        this.buildLink();
      }
    },
    selectBlock(idx) {
      this.selectedBlock = idx;
    },
    buildLink() {
      const base =
        this.numBlocks === 1
          ? 'https://readme-chic.dycon-pv.workers.dev/?template=block'
          : 'https://readme-chic.dycon-pv.workers.dev/?template=double';
      const params = new URLSearchParams();
      if (this.numBlocks === 1) {
        Object.entries(this.blocks[0]).forEach(([key, val]) => {
          if (val !== '' && val != null) params.set(key === 'width' ? 'w' : key, val);
        });
      } else {
        this.blocks.forEach((b, i) => {
          const idx = i + 1;
          params.set(`w${idx}`, b.width);
          params.set(`h${idx}`, b.height);
          params.set(`bgColor${idx}`, b.bgColor);
          params.set(`textColor${idx}`, b.textColor);
          params.set(`bgImage${idx}`, b.bgImage);    // ajout du param bgImage
          params.set(`borderRadius${idx}`, b.borderRadius);
          params.set(`padding${idx}`, b.padding);
          params.set(`title${idx}`, b.title);
          params.set(`description${idx}`, b.description);
          params.set(`fsTitle${idx}`, b.fsTitle);
          params.set(`fsDesc${idx}`, b.fsDesc);
          params.set(`aboveText${idx}`, b.aboveText);
          params.set(`fsAbove${idx}`, b.fsAbove);
          params.set(`logoSrc${idx}`, b.logoSrc);
          params.set(`logoWidth${idx}`, b.logoWidth);
          params.set(`logoHeight${idx}`, b.logoHeight);
          params.set(`logoPosition${idx}`, b.logoPosition);
          params.set(`textSpacing${idx}`, b.textSpacing);
          params.set(`position${idx}`, b.position);
          params.set(`horizontalAlign${idx}`, b.horizontalAlign);
          params.set(`borderWidth${idx}`, b.borderWidth);
          params.set(`borderColor${idx}`, b.borderColor);
          params.set(`borderStyle${idx}`, b.borderStyle);
        });
        params.set('gap', this.gap);
      }
      this.blockLink = `${base}&${params.toString()}`;
    }
  },
  watch: {
    blocks: {
      handler() {
        this.buildLink();
      },
      deep: true
    },
    gap: 'buildLink',
    numBlocks: 'buildLink'
  },
  created() {
    this.buildLink();
  }
};
</script>

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