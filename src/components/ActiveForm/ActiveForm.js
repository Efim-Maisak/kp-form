import React from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { Flex, VStack, Input, Box, Text, IconButton, Heading, Button as ChakraButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons'
import SubTotalField from "../SubTotalField/SubTotalField";
import TotalField from "../TotalField/TotalField";
import NdsField from "../NdsField/NdsField";
import TotalWithNdsField from "../TotalWithNdsField/TotalWithNdsField";


const ActiveForm = () => {

    const initialValues = {
        outgoing_number: "",
        outgoing_date: "",
        goods: [
          {
            name: "",
            price: "",
            amount: "",
            subtotal: ""
          },
        ],
        total: "",
        nds: "",
        totalWithNds: ""
    };

    const validateName = (value) => {
        let error;
        if (!value) {
          error = "Поле не должно быть пустым";
        }
        return error;
    };

    const validatePrice = (value) => {
        let error;
        const priceRegex = /^\d+(,\d{2})?$/;
        if(!priceRegex.test(value)) {
            error = "Неверный формат";
        }
        return error;
    };

    const validateAmount = (value) => {
        let error;
        const amountRegex = /^(0|[1-9]\d*)$/;
        if(!amountRegex.test(value)) {
            error = "Введите число";
        }
        return error;
    };


    return (
        <>
        <Flex bg="white" flexDirection="column" h="100vh" alignContent="center" p={8}>
            <Heading as="h1" py="32px"  size="lg">Расчет коммерческого предложения</Heading>
            <Formik
            validateOnBlur
            initialValues={initialValues}
            onSubmit={async (values, {setSubmitting}) => {
                await new Promise((r) => setTimeout(r, 500));
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
            }}
            >
                {({ values, isSubmitting, errors }) => (
                <Form>
                    <VStack maxW="500px" py="16px">
                        <Box py="8px" alignSelf="flex-start">
                        <Text fontWeight="bold">Реквизиты исходящего письма</Text>
                        </Box>
                        <Flex w="100%" flexDirection="row" justifyContent="flex-start">
                            <Box w="200px" mr="8px">
                                <Field
                                w="100%"
                                name={`outgoing_number`}
                                placeholder="Номер"
                                focusBorderColor="red.200"
                                autoComplete="off"
                                type="text"
                                as={Input}
                                validate={validateName}
                                />
                                <ErrorMessage
                                name={`outgoing_number`}
                                component={Box}
                                className="field-error"
                                color="red"
                                fontSize="14px"
                                />
                            </Box>
                            <Box w="200px">
                                <Field
                                w="100%"
                                name={`outgoing_date`}
                                focusBorderColor="red.200"
                                type="date"
                                as={Input}
                                />
                            </Box>
                        </Flex>
                    </VStack>
                <FieldArray name="goods">
                    {({ insert, remove, push }) => (
                    <div>
                        {values.goods.length > 0 &&
                        values.goods.map((good, index) => (
                        <Flex h="75px" flexDirection="row" justifyContent="space-between" alignItems="flex-start" className="row" key={index} pt={4}>
                            <Box w="40px" h="40px" borderRadius="full" bg="red.300" mr="8px" display="flex" justifyContent="center" alignItems="center">
                                <Text color="white" fontWeight="bold" textAlign="center" verticalAlign="middle" fontSize="18px">{index + 1}</Text>
                            </Box>
                            <Box w="350px" mr="8px" className="col">
                                <Field
                                w="100%"
                                name={`goods.${index}.name`}
                                placeholder="Наименование"
                                focusBorderColor="red.200"
                                autoComplete="off"
                                type="text"
                                as={Input}
                                validate={validateName}
                                />
                                <ErrorMessage
                                name={`goods.${index}.name`}
                                component={Box}
                                className="field-error"
                                color="red"
                                fontSize="14px"
                                />
                            </Box>
                            <Box maxW="150px" mr="8px" className="col">
                                <Field
                                name={`goods.${index}.price`}
                                placeholder="Цена"
                                focusBorderColor="red.200"
                                autoComplete="off"
                                type="text"
                                as={Input}
                                validate={validatePrice}
                                />
                                <ErrorMessage
                                name={`goods.${index}.price`}
                                component={Box}
                                className="field-error"
                                color="red"
                                fontSize="14px"
                                />
                            </Box>
                            <Box maxW="100px" mr="8px" className="col">
                                <Field
                                name={`goods.${index}.amount`}
                                placeholder="Кол-во"
                                focusBorderColor="red.200"
                                autoComplete="off"
                                type="text"
                                as={Input}
                                validate={validateAmount}
                                />
                                <ErrorMessage
                                name={`goods.${index}.amount`}
                                component={Box}
                                className="field-error"
                                color="red"
                                fontSize="14px"
                                />
                            </Box>
                            <Box maxW="150px" mr="8px" className="col">
                                <SubTotalField
                                variant="filled"
                                focusBorderColor="red.200"
                                isReadOnly
                                name={`goods.${index}.subtotal`}
                                type="text"
                                as={Input}
                                index={index}
                                />
                            </Box>
                            <IconButton
                            variant="ghost"
                            colorScheme="gray"
                            icon={<CloseIcon />}
                            onClick={() => remove(index)}
                            />
                        </Flex>
                    ))}
                    <ChakraButton
                    mt={4}
                    colorScheme="gray"
                    variant="outline"
                    onClick={() => push({ name: "", price: "", amount: "", subtotal: "" })}
                    >
                    Добавить позицию
                    </ChakraButton>
                </div>
                )}
                </FieldArray>
                <Flex w="100%" pt="8px" flexDirection="row" justifyContent="right">
                    <Box w="400px">
                        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
                            <Text pr="8px" fontWeight="bold">Итого: </Text>
                            <TotalField
                                w="200px"
                                variant="filled"
                                focusBorderColor="red.200"
                                isReadOnly
                                name={`total`}
                                type="text"
                                as={Input}
                                />
                        </Flex>
                        <Flex pt="8px" flexDirection="row" justifyContent="flex-end" alignItems="center">
                            <Text pr="8px" fontWeight="bold">НДС: </Text>
                            <NdsField
                                w="200px"
                                variant="filled"
                                focusBorderColor="red.200"
                                isReadOnly
                                name={`nds`}
                                type="text"
                                as={Input}
                                />
                        </Flex>
                        <Flex pt="8px" flexDirection="row" justifyContent="flex-end" alignItems="center">
                            <Text pr="8px" fontWeight="bold">Итого с НДС: </Text>
                            <TotalWithNdsField
                                w="200px"
                                variant="filled"
                                focusBorderColor="red.200"
                                isReadOnly
                                name={`totalWithNds`}
                                type="text"
                                as={Input}
                                />
                        </Flex>
                    </Box>
                </Flex>
                <ChakraButton
                colorScheme="gray"
                type="submit"
                variant="solid"
                mt={4}
                isDisabled={isSubmitting || Object.keys(errors).length > 0 ? true : false}>
                    Создать предложение
                </ChakraButton>
                </Form>
                )}
            </Formik>
        </Flex>
        </>
    );
};

export default ActiveForm;