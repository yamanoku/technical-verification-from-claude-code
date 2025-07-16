
      import { defaultExtractor as createDefaultExtractor } from "tailwindcss/lib/lib/defaultExtractor.js";
      import { customSafelistExtractor, generateSafelist } from "/home/runner/work/technical-verification-from-calude-code/technical-verification-from-calude-code/2025-07-16/nuxt-pinia-verification/node_modules/@nuxt/ui/dist/runtime/utils/colors";
      import formsPlugin from "@tailwindcss/forms";
      import aspectRatio from "@tailwindcss/aspect-ratio";
      import typography from "@tailwindcss/typography";
      import containerQueries from "@tailwindcss/container-queries";
      import headlessUi from "@headlessui/tailwindcss";

      const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } });

      export default {
        plugins: [
          formsPlugin({ strategy: 'class' }),
          aspectRatio,
          typography,
          containerQueries,
          headlessUi
        ],
        content: {
          files: [
            "/home/runner/work/technical-verification-from-calude-code/technical-verification-from-calude-code/2025-07-16/nuxt-pinia-verification/node_modules/@nuxt/ui/dist/runtime/components/**/*.{vue,mjs,ts}",
            "/home/runner/work/technical-verification-from-calude-code/technical-verification-from-calude-code/2025-07-16/nuxt-pinia-verification/node_modules/@nuxt/ui/dist/runtime/ui.config/**/*.{mjs,js,ts}"
          ],
          transform: {
            vue: (content) => {
              return content.replaceAll(/(?:\r\n|\r|\n)/g, ' ')
            }
          },
          extract: {
            vue: (content) => {
              return [
                ...defaultExtractor(content),
                ...customSafelistExtractor("U", content, ["red","orange","amber","yellow","lime","green","emerald","teal","cyan","sky","blue","indigo","violet","purple","fuchsia","pink","rose","primary"], ["primary"])
              ]
            }
          }
        },
        safelist: generateSafelist(["primary"], ["red","orange","amber","yellow","lime","green","emerald","teal","cyan","sky","blue","indigo","violet","purple","fuchsia","pink","rose","primary"]),
      }
    