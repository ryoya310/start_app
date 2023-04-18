import { AppProps } from 'next/app'
import { CookiesProvider } from 'react-cookie';
import '../public/css/destyle.css'

function App ({ Component, pageProps, router }: AppProps) {
  return  <>
    <CookiesProvider>
      <Component key={router.asPath} {...pageProps} />
    </CookiesProvider>
  </>
}

export default App