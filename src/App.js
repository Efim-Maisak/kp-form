import React from "react";
import { Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import {FiFileText} from "react-icons/fi";
import { BsQuestionCircle } from "react-icons/bs";
import OfferPage from "./components/Pages/OfferPage";
import NotFoundPage from "./components/Pages/NotFoundPage";
import AboutPage from "./components/Pages/AboutPage";


function App() {

  const linkItems = [
    { name: "Предложение", icon: FiFileText, link: "/" },
    { name: "О приложении", icon: BsQuestionCircle, link: "/about" }
  ];

  return (
    <ChakraProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<OfferPage linkItems={linkItems}/>}/>
          <Route path="/about" element={<AboutPage linkItems={linkItems}/>}/>
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;