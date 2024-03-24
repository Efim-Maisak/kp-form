import React from "react";
import {
    Box,
    Flex,
    Container,
    Text,
    VStack
  } from "@chakra-ui/react";

const NotFoundPage = () => {
    return (
        <Container maxW="xl" centerContent>
            <Flex h="100vh" flexDirection="column" justifyContent="center">
                <Box bg="red.300" w="200px" h="200" borderRadius="50%">
                    <VStack h="100%" direction="column" align="center" justifyContent="center" spacing="unset">
                        <Text color="white" textAlign="center" fontSize="24px" fontWeight="bold">Упс!</Text>
                        <Text color="white" textAlign="center" fontSize="20px" fontWeight="bold">Страница не найдена.</Text>
                    </VStack>
                </Box>
            </Flex>
        </Container>
    );
};

export default NotFoundPage;