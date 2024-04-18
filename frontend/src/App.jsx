import './App.css'
import From from './components/From/From'
import { ChainId, DAppProvider } from '@usedapp/core'
import { MULTICALL_ADDRESS } from './constants'
import Header from './components/Header'
import Footer from './components/Footer'
import Banner from './components/Banner'



function App() {




  return (
    <>
      <DAppProvider config={{
        autoConnect: true,
        fastMulticallEncoding: false,
        networks: [ChainId.Localhost],
        multicallAddresses: {
          [ChainId.Localhost]: MULTICALL_ADDRESS
        }
      }}>

        <Header></Header>
        <Banner></Banner>
        <From ></From>
        <Footer></Footer>
      </DAppProvider>
    </>
  )
}

export default App
