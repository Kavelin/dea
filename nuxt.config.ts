// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  logLevel:'info',
  telemetry: false,
    app: {
        head: {
          title: "Dea",
          meta: [
            {
              name: "viewport",
              content: "width=device-width, initial-scale=1",
            },
            {
              charset: "utf-8",
            },
          ]
        },
      },
})
