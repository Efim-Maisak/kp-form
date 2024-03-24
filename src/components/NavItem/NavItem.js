import React from "react";
import {
    Box,
    Flex,
    Icon
  } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";


const NavItem = ({icon, link, children, ...rest}) => {
  return (
      <Box
        as={RouterLink}
        to={link}
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