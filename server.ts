import express from "express"
import dotenv from "dotenv"
import { Midjourney } from "midjourney"
import { v4 as uuidv4 } from "uuid"

dotenv.config()

const app = express()
app.use(express.json())

function ensureEnvVar(name: string): string {
   const value = process.env[name]
   if (!value) {
      throw new Error(`Environment variable ${name} is not set`)
   }
   return value
}

const client = new Midjourney({
   ServerId: ensureEnvVar("SERVER_ID"),
   ChannelId: ensureEnvVar("CHANNEL_ID"),
   SalaiToken: ensureEnvVar("SALAI_TOKEN"),
   Debug: true,
   Ws: true,
})

app.post("/generate", async (req, res) => {
   const { prompt } = req.body

   if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Valid prompt is required" })
   }

   try {
      console.log(`Starting image generation for prompt: ${prompt}`)
      const result = await client.Imagine(
         prompt,
         (uri: string, progress: string) => {
            console.log(`Progress: ${progress}`)
         }
      )

      if (!result) {
         throw new Error("No result from Midjourney")
      }

      console.log(`Initial image generation completed. ID: ${result.id}`)
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
      console.log(JSON.stringify(result))
      console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

      const UpscaleOptions = ["U1", "U2", "U3", "U4"]

      // Find the U1 (first upscale) option
      const UpscaleOption = result.options?.find(
         (option) =>
            option.label ===
            UpscaleOptions[Math.floor(Math.random() * UpscaleOptions.length)]
      )
      if (!UpscaleOption || !UpscaleOption.custom) {
         throw new Error("upscale option not found")
      }

      console.log(`Starting first upscale process for U1`)
      const firstUpscaledResult = await client.Custom({
         msgId: result.id!,
         customId: UpscaleOption.custom,
         content: prompt, // Include original prompt for consistency
         flags: result.flags,
      })

      console.log(JSON.stringify(firstUpscaledResult))
      // res.json({ imageUrl: firstUpscaledResult?.proxy_url })

      if (!firstUpscaledResult || !firstUpscaledResult.uri) {
         throw new Error("First upscale process failed or didn't return a URI")
      }

      console.log(
         `First upscale completed. URL: ${firstUpscaledResult.proxy_url}`
      )

      // Perform second upscale
      console.log(`Starting second upscale process`)
      const secondUpscaledResult = await client.Custom({
         msgId: firstUpscaledResult.id!,
         customId: firstUpscaledResult.options![0].custom,
         content: prompt,
         flags: result.flags,
      })

      if (!secondUpscaledResult || !secondUpscaledResult.uri) {
         throw new Error("Second upscale process failed or didn't return a URI")
      }

      console.log(
         `Second upscale completed. URL: ${secondUpscaledResult.proxy_url}`
      )
      res.json({ imageUrl: secondUpscaledResult.proxy_url })
   } catch (error) {
      console.error("Error during image generation or upscaling:", error)
      res.status(500).json({
         error: error instanceof Error ? error.message : "Unknown error",
      })
   }
})

async function startServer() {
   try {
      await client.init()
      const port = process.env.PORT || 3000
      app.listen(port, () => {
         console.log(`Server is running on port ${port}`)
      })
   } catch (error) {
      console.error("Failed to initialize Midjourney client:", error)
      process.exit(1)
   }
}

startServer()
