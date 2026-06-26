const( defineConfig )=require('@medusajs/utils')

module.exports= defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: "http://localhost:8000",
      adminCors: "http://localhost:7001", 
      authCors: "http://localhost:7001",
      jwtSecret: "supersecret",
      cookieSecret: "supersecret"
    }
  }
})