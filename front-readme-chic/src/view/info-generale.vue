<!-- GeneralInfoPage component template -->
<template>
  <div class="container mx-auto p-6 space-y-8 text-left">


    <h2 id="readme-chic-banner" class="text-4xl font-extrabold mb-4 text-left text-neutral">Readme Chic </h2>
    <p class="mb-10 text-lg text-left">Dynamic generator of fully customizable SVG banners to enhance your README.md with style, performance, and flexibility.</p>

    <h2 id="introduction" class="text-3xl font-bold border-b pb-2 mt-10 text-neutral">✨ Introduction</h2>
    <p class="mt-2">
      readme-chic-banner is a service designed to create fully dynamic and customizable SVG banners that you can embed directly in a README.md on GitHub or any other repository. The goal is simple: to enable anyone to generate an elegant graphic banner without the need for SVG or graphic design skills.
    </p>
    <p class="mt-2">
      Whether you want to highlight a project, add a slogan, a quote, or simply display a logo with styled text, the system relies on URL-parameterized templates.
    </p>
    <p class="mt-2">
      It is served by Cloudflare Workers, ensuring extremely fast distribution and optimal response times worldwide.
    </p>
    <p class="mt-2">
      With a simple link, you can generate a custom banner in the colors of your project or personal brand.
    </p>
    <p class="mt-2">
      This project is for anyone looking to enhance the aesthetics of their technical documents while maintaining maximum performance and simple setup. Whether you're a developer, designer, or documentation enthusiast, readme-chic-banner is built for you.
    </p>
    <p class="mt-2">
      It requires no complex hosting or heavy dependencies: everything is served directly from the Cloudflare CDN and generated in milliseconds on the fly. This makes it an ideal choice for open source projects, portfolios, or product documentation.
    </p>
    <p class="mt-2">
      readme-chic-banner is also committed to accessibility. The chosen fonts, color contrasts, and SVG element structure are designed for optimal readability, even in dark mode or on low-resolution screens.
    </p>

    <h2 id="technical-details" class="text-3xl font-bold border-b pb-2 mt-10 text-neutral">⚙️ Technical Details</h2>
    <p class="mt-2">
      The system relies on predefined templates accessible via a <code>?template=</code> parameter. Each template accepts specific query string parameters to customize colors, sizes, text, borders, and images.
    </p>
    <p class="mt-2">
      Example:<br>
      <code>https://your-worker-url.com/?template=fancy&amp;title=Hello%20World&amp;c1=%23ff8a00&amp;c2=%23e52e71</code>
    </p>
    <ul class="list-disc list-inside mt-4 space-y-2">
      <li><strong>Available templates:</strong>
        <ul class="list-disc list-inside ml-4 text-secondary">
          <li><code>fancy</code> — Elegant text banner with solid background, gradient, or image.</li>
          <li><code>badge</code> — Rectangular or rounded badge with an image on the left and text on the right.</li>
          <li><code>block</code> — Block with title, description, logo, and positioning options.</li>
          <li><code>double</code> — Multiple blocks aligned horizontally with spacing.</li>
        </ul>
      </li>
      <li><strong>Visual customization:</strong> <code>bgColor</code>, <code>textColor</code>, <code>borderColor</code>, <code>c1</code>, <code>c2</code>, <code>borderRadius</code>, <code>borderWidth</code>, <code>borderStyle</code>, <code>font</code>, <code>textAlign</code>, <code>textSpacing</code>, <code>padding</code>.</li>
      <li><strong>Content:</strong> <code>title</code>, <code>description</code>, <code>subtitle</code>, <code>aboveText</code>, <code>logoSrc</code>, <code>bgImageUrl</code>, <code>fsTitle</code>, <code>fsDesc</code>, <code>fsAbove</code>, <code>fs1</code>, <code>fs2</code>.</li>
      <li><strong>Dimensions:</strong> <code>width</code>, <code>height</code>, <code>gap</code>, <code>position</code> (<code>top</code>, <code>middle</code>, <code>bottom</code>), <code>horizontalAlign</code> (<code>left</code>, <code>center</code>, <code>right</code>).</li>
      <li><strong>Technical features:</strong> All images are converted to <code>data:image/...;base64,...</code> for GitHub compatibility; text is dynamically wrapped; the SVG is served with the correct headers for inline display.</li>
    </ul>

    <h2 id="resources-used" class="text-3xl font-bold border-b pb-2 mt-10 text-neutral">📚 Resources Used</h2>
    <ul class="list-disc list-inside mt-2 space-y-1">
      <li>Cloudflare Workers for fast, serverless deployment.</li>
      <li>simple-icons-develop for integrating tech SVG logos.</li>
      <li>Native SVG generated on the fly.</li>
      <li>Modern JavaScript for dynamic generation.</li>
      <li>Built-in theme: customizable color palette (tokens like <code>fond1</code>, <code>fond2</code>, <code>contenuFond</code>, etc.), border tokens (<code>b1</code>, <code>b2</code>, <code>pill</code>, etc.), typography, and flexible spacing.</li>
    </ul>

    <h2 id="usage-examples" class="text-3xl font-bold border-b pb-2 mt-10 text-neutral">🧪 Usage Examples</h2>
    <p class="mt-2">Add the following to your README:</p>
    <div class="mockup-code w-full ">
      <pre data-prefix="~"><code>![Badge](https://your-worker-url.com/?template=badge&amp;text=Made%20with%20readme-chic-banner&amp;bgColor=fond1&amp;textColor=contenuFond&amp;logoSrc=https://example.com/logo.png)</code></pre>
    </div>
    <div class="mockup-code w-full">
      <pre data-prefix="~"><code>![Fancy](https://your-worker-url.com/?template=fancy&amp;title=Welcome%20to%20My%20Repo&amp;c1=%23FF5F6D&amp;c2=%23FFC371&amp;font=Fira%20Code)</code></pre>
    </div>
    <div class="mockup-code w-full">
      <pre data-prefix="~"><code>![FancyGradient](https://your-worker-url.com/?template=fancy&amp;title=Gradient&amp;c1=%2300f&amp;c2=%23f0f&amp;font=Arial)</code></pre>
    </div>
    <div class="mockup-code w-full">
      <pre data-prefix="~"><code>![Block](https://your-worker-url.com/?template=block&amp;title=My%20Block&amp;description=Description%20here&amp;logoSrc=https://example.com/logo.svg&amp;bgColor=%23f0f0f0&amp;textColor=%23000&amp;borderRadius=8)</code></pre>
    </div>
    <div class="mockup-code w-full">
      <pre data-prefix="~"><code>![Double](https://your-worker-url.com/?template=double&amp;items=One|Two|Three&amp;gap=12&amp;c1=%23ff0000&amp;c2=%2300ff00)</code></pre>
    </div>

  </div>
</template>

<script>
// Component logic for GeneralInfoPage
export default {
  name: 'GeneralInfoPage'
}
</script>