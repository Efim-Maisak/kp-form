import React from "react";
import {
    Box,
    CloseButton,
    Flex,
    useColorModeValue,
    Text,
    Image
  } from '@chakra-ui/react'
import NavItem from "../NavItem/NavItem";
import logo from "../../assets/logo/contract-dep-logo.png"


const SidebarContent = ({onClose, linkItems, ...rest}) => {
    return (
        <Box
          bg={useColorModeValue('white', 'gray.900')}
          borderRight="1px"
          borderRightColor={useColorModeValue('gray.200', 'gray.700')}
          w={{ base: 'full', md: 60 }}
          pos="fixed"
          h="full"
          {...rest}>
          <Flex h="100px" py="8px" alignItems="center" mx="8" justifyContent="space-between">
            <Box w="100%" display={{ base: "none", md: "block" }}>
                <Image
                    objectFit="cover"
                    src={logo}
                    alt="Логотип"
                />
            </Box>
            <Text display={{ base: "block", md: "none" }} fontSize="2xl" fontWeight="bold">Меню</Text>
            <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
          </Flex>
          {linkItems && linkItems.map((element) => (
            <NavItem key={element.name} icon={element.icon} link={element.link}>
              {element.name}
            </NavItem>
          ))}
        </Box>
      )
};

export default SidebarContent;