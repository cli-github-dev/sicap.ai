export const isDev = process.env.NODE_ENV === "development"

export const ES_INDEX = "licitatii-publice"
export const ES_INDEX_DIRECT = "achizitii-directe"

export const ES_HOST = process.env.ES_URL

export const SITE_URL = isDev ? "http://localhost:3000" : "https://sicap.ai"

export const APM_RUM_URL = process.env.NEXT_PUBLIC_APM_RUM_URL

export const auth = {
  GOOGLE_ID: process.env.GOOGLE_ID,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  SECRET: process.env.SECRET,
}

export const FATHOM_CODE = process.env.NEXT_PUBLIC_FATHOM_CODE

export const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID

export const FORMBRICKS_API_HOST = process.env.NEXT_PUBLIC_FORMBRICKS_API_HOST
export const FORMBRICKS_ENV_ID = process.env.NEXT_PUBLIC_FORMBRICKS_ENV_ID
