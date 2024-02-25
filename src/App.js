import React from "react";
import { ChakraProvider } from '@chakra-ui/react'
import ActiveForm from "./components/ActiveForm/ActiveForm";
import FormWrapper from "./components/FormWrapper/FormWrapper";


function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <FormWrapper>
            <ActiveForm/>
        </FormWrapper>
      </div>
    </ChakraProvider>
  );
}

export default App;
