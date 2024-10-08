import { useEffect } from "react"
import PropTypes from "prop-types"
import { ChakraProvider, CSSReset, useDisclosure } from "@chakra-ui/react"
import NProgress from "nprogress"
import Router, { useRouter } from "next/router"
import { setOptions, getSession, Provider, providers } from "next-auth/client"
import { ApolloProvider } from "@apollo/client"
import { setDefaultLocale, registerLocale } from "react-datepicker"
import ro from "date-fns/locale/ro"
import formbricks from "@formbricks/js"

import "react-datepicker/dist/react-datepicker.css"

import { useApollo } from "@services/apollo"
import { Layout, LoginModal } from "@components"
import { ModalContext } from "@utils"
import { SITE_URL, FORMBRICKS_API_HOST, FORMBRICKS_ENV_ID } from "@utils/config"
import theme from "../theme"

registerLocale("ro", ro)
setDefaultLocale("ro")

NProgress.configure({ showSpinner: false })
Router.events.on("routeChangeStart", () => NProgress.start())
Router.events.on("routeChangeComplete", () => NProgress.done())
Router.events.on("routeChangeError", () => NProgress.done())

if (typeof window !== "undefined") {
  formbricks.init({
    environmentId: FORMBRICKS_ENV_ID,
    apiHost: FORMBRICKS_API_HOST,
    debug: false,
  })
}

export default function MyApp(props) {
  const { Component, pageProps, ...rest } = props
  const { session } = pageProps
  const { isOpen, onOpen, onClose } = useDisclosure()
  const apolloClient = useApollo(pageProps.initialApolloState)
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = formbricks?.registerRouteChange
    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [])

  return (
    <Provider
      session={session}
      options={{
        clientMaxAge: 0,
        keepAlive: 0,
      }}
    >
      <ChakraProvider theme={theme}>
        <CSSReset />
        <ModalContext.Provider value={onOpen}>
          <ApolloProvider client={apolloClient}>
            <Layout>
              <Component {...pageProps} {...rest} />
            </Layout>
          </ApolloProvider>
          <LoginModal
            isOpen={isOpen}
            onClose={onClose}
            providers={rest.providers}
          />
        </ModalContext.Provider>
      </ChakraProvider>
    </Provider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  setOptions({ site: SITE_URL })
  const session = await getSession(ctx)

  let pageProps = { session }

  if (Component.getInitialProps) {
    pageProps = {
      ...pageProps,
      ...(await Component.getInitialProps(ctx)),
    }
  }

  return {
    pageProps,
    providers: await providers(ctx),
  }
}
