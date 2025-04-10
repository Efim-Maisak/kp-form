import React from "react";
import {
    Box,
    Flex,
    Text
  } from "@chakra-ui/react";
import FormWrapper from "../FormWrapper/FormWrapper";
import Sidebar from "../Sidebar/Sidebar";


const AboutPage = ({linkItems}) => {
    return (
        <>
        <Sidebar linkItems={linkItems}>
            <FormWrapper>
                <Flex flexDirection="column" justifyContent="center" alignItems="center" h="100vh">
                    <Box bg="white" borderRadius="8px" p="16px" alignSelf="center">
                        <Text>Приложение для автоматизации работы договорного отдела.</Text>
                    </Box>
                </Flex>
            </FormWrapper>
        </Sidebar>
        </>
    );
}

export default AboutPage;