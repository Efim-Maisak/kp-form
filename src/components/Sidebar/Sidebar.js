import React from "react";
import {
    Box,
    useColorModeValue,
    Drawer,
    DrawerContent,
    useDisclosure,
  } from "@chakra-ui/react";
import MobileNav from "../MobileNav/MobileNav";
import SidebarContent from "../SidebarContent/SidebarContent";

const Sidebar = ({children, linkItems}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        <SidebarContent linkItems={linkItems} onClose={() => onClose} display={{ base: "none", md: "block" }} />
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full">
          <DrawerContent>
            <SidebarContent onClose={onClose} linkItems={linkItems}/>
          </DrawerContent>
        </Drawer>
        <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
        <Box ml={{ base: 0, md: 60 }} p="4">
          {children}
        </Box>
      </Box>
    )
};

export default Sidebar;