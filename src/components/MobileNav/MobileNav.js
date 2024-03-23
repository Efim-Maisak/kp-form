import React from "react";
import {
    IconButton,
    Flex,
    useColorModeValue,
    Box,
    Image
  } from '@chakra-ui/react'
import { FiMenu } from "react-icons/fi";
import logo from "../../assets/logo/contract-dep-logo.png";


const MobileNav = ({ onOpen, ...rest }) => {
    return (
        <Flex
          ml={{ base: 0, md: 60 }}
          px={{ base: 4, md: 24 }}
          height="20"
          alignItems="center"
          bg={useColorModeValue('white', 'gray.900')}
          borderBottomWidth="1px"
          borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
          justifyContent="space-between"
          {...rest}>
          <IconButton
            variant="outline"
            onClick={onOpen}
            aria-label="open menu"
            icon={<FiMenu />}
          />
          <Box w="150px">
          <Image
            objectFit="contain"
            src={logo}
            alt="Логотип"
            />
          </Box>
        </Flex>
      )
};

export default MobileNav;