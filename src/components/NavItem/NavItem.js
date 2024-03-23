import React from "react";
import {
    Box,
    Flex,
    Icon
  } from "@chakra-ui/react";


const NavItem = ({icon, children, ...rest}) => {
    return (
        <Box
          as="a"
          href="#"
          style={{ textDecoration: "none" }}
          _focus={{ boxShadow: "none" }}>
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
              bg: "red.300",
              color: 'white',
            }}
            {...rest}>
            {icon && (
              <Icon
                mr="4"
                fontSize="20"
                _groupHover={{
                  color: 'white',
                }}
                as={icon}
              />
            )}
            {children}
          </Flex>
        </Box>
      )
};

export default NavItem;