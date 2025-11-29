import { Account, Client } from "appwrite"

const VITE_APPWRITE_PROJECT_ID = "692a59150020cabc7981"
const VITE_APPWRITE_PROJECT_NAME = "presentation-maker"
const VITE_APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1"
        
const client = new Client().setEndpoint(VITE_APPWRITE_ENDPOINT).setProject(VITE_APPWRITE_PROJECT_ID)

const account = new Account(client)

export {
  account
}