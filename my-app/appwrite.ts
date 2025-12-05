import { Account, Client } from "appwrite"

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

const account = new Account(client)

// Экспортируем client для использования в других сервисах
export { account, client }