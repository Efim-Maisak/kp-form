import React from "react";
import { Box, Container, useMediaQuery } from '@chakra-ui/react'


const FormWrapper = ({children}) => {
    const [isSmallerThan900] = useMediaQuery("(max-width: 900px)");

    return (
        <Box w="100%">
            <Container px="unset" maxW={isSmallerThan900 ? "xl" : "5xl"}>
                {children}
            </Container>
        </Box>
    );
};

export default FormWrapper;