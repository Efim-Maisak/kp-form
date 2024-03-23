import React from "react";
import { ChakraProvider } from '@chakra-ui/react'
import {
  FiFileText,
  FiSettings,
} from "react-icons/fi"
import OfferPage from "./components/Pages/OfferPage";


function App() {

  const linkItems = [
    { name: "Предложение", icon: FiFileText },
    { name: "Настройки", icon: FiSettings }
  ];

  return (
    <ChakraProvider>
      <div className="App">
        <OfferPage linkItems={linkItems}/>
      </div>
    </ChakraProvider>
  );
}

export default App;