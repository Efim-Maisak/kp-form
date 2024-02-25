import React from "react";
import { Box, Container } from '@chakra-ui/react'


const FormWrapper = ({children}) => {
 return (
    <Box bg="red.300" w="100%" h="100vh">
        <Container maxW="5xl">
            {children}
        </Container>
    </Box>
 );
};

export default FormWrapper;