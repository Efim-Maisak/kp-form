import React, { useState} from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { Flex, VStack, Input, Box, Text, Textarea, IconButton, Heading, Button as ChakraButton } from '@chakra-ui/react';
import { CloseIcon, PlusSquareIcon } from "@chakra-ui/icons";
import SubTotalField from "../SubTotalField/SubTotalField";
import TotalField from "../TotalField/TotalField";
import NdsField from "../NdsField/NdsField";
import TotalWithNdsField from "../TotalWithNdsField/TotalWithNdsField";
import AsyncSelect from "react-select";


const ActiveForm = () => {

    const [customers, setCustomers] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    const initialValues = {
        outgoing_number: "",
        outgoing_date: "",
        incoming_number: "",
        incoming_date: "",
        dueDate: "по согласованию с заказчиком.",
        paymentConditions: "по согласованию с заказчиком.",
        additionalDetails: "",
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

    const options = [
        {value: "01", label: "АО КБП"},
        {value: "02", label: "ЗАО МНИТИ"},
        {value: "03", label: "ИКИ РАН"}
    ];

    const selectStyles = {
        control: (baseStyles, {isFocused, isSelected}) => {
            return {...baseStyles,
                    borderRadius: 8,
                    borderColor: isSelected ? "#F56565" : "gray",
                 }},
        option: (baseStyles, {data, isDisabled, isFocused, isSelected}) => {
            return {...baseStyles,
                    backgroundColor: isSelected ? "#F56565" : "#fff"
                }
        },
        singleValue: (baseStyles, {isFocused}) => {
            return {
                ...baseStyles,
                backgroundColor: isFocused ? "#FEB2B2" : "#fff"
            }
        }
    };

    const handleSelectChange = (selectedValue) => {
        setSelectedOption(selectedValue);
    };

    const loadOptions = (searchValue, callback) => {
        const filteredOptions = options.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()));
        callback(filteredOptions);
    };


    return (
        <>
        <Flex bg="white" flexDirection="column" h="100vh" alignContent="center" p={8}>
            <Heading as="h1" py="32px" size="lg">Расчет коммерческого предложения</Heading>
            <Box maxW="408px">
                <Box py="16px">
                    <Text fontWeight="bold">Заказчик</Text>
                </Box>
                <AsyncSelect autoFocus placeholder="Выбор организации..." onChange={handleSelectChange} options={options} styles={selectStyles}/>
            </Box>

            <Formik
            validateOnBlur
            initialValues={initialValues}
            onSubmit={async (values, {setSubmitting}) => {
                await new Promise((r) => setTimeout(r, 500));
                alert(JSON.stringify(values, null, 2));
                console.log(JSON.stringify(values, null, 2));
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
                        <Box py="8px" alignSelf="flex-start">
                        <Text fontWeight="bold">Реквизиты входящего письма</Text>
                        </Box>
                        <Flex w="100%" flexDirection="row" justifyContent="flex-start">
                            <Box w="200px" mr="8px">
                                <Field
                                w="100%"
                                name={`incoming_number`}
                                placeholder="Номер"
                                focusBorderColor="red.200"
                                autoComplete="off"
                                type="text"
                                as={Input}
                                />
                            </Box>
                            <Box w="200px">
                                <Field
                                w="100%"
                                name={`incoming_date`}
                                focusBorderColor="red.200"
                                type="date"
                                as={Input}
                                />
                            </Box>
                        </Flex>
                    </VStack>
                    <Box py="8px" alignSelf="flex-start">
                        <Text fontWeight="bold">Номенклатура</Text>
                    </Box>
                <FieldArray name="goods">
                    {({ insert, remove, push }) => (
                    <div>
                        {values.goods.length > 0 &&
                        values.goods.map((good, index) => (
                        <Flex h="75px" flexDirection="row" justifyContent="space-between" alignItems="flex-start" className="row" key={index} pt={4}>
                            <Box w="40px" h="40px" borderRadius="full" bg="red.300" display="flex" justifyContent="center" alignItems="center">
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
                <VStack w="100%" py="16px">
                        <Box py="8px" alignSelf="flex-start">
                            <Text fontWeight="bold">Срок поставки</Text>
                        </Box>
                        <Box w="100%" mr="8px">
                            <Field
                            w="100%"
                            name={`dueDate`}
                            focusBorderColor="red.200"
                            autoComplete="off"
                            type="text"
                            size="sm"
                            as={Textarea}
                            validate={validateName}
                            />
                            <ErrorMessage
                            name={`dueDate`}
                            component={Box}
                            className="field-error"
                            color="red"
                            fontSize="14px"
                            />
                        </Box>
                        <Box py="8px" alignSelf="flex-start">
                            <Text fontWeight="bold">Условия оплаты</Text>
                        </Box>
                        <Box w="100%" mr="8px">
                            <Field
                            w="100%"
                            name={`paymentConditions`}
                            focusBorderColor="red.200"
                            autoComplete="off"
                            type="text"
                            size="sm"
                            as={Textarea}
                            validate={validateName}
                            />
                            <ErrorMessage
                            name={`paymentConditions`}
                            component={Box}
                            className="field-error"
                            color="red"
                            fontSize="14px"
                            />
                        </Box>
                        <Box py="8px" alignSelf="flex-start">
                            <Text fontWeight="bold">Дополнительно</Text>
                        </Box>
                        <Box w="100%" mr="8px">
                            <Field
                            w="100%"
                            name={`additionalDetails`}
                            focusBorderColor="red.200"
                            autoComplete="off"
                            type="text"
                            size="sm"
                            as={Textarea}
                            />
                        </Box>
                    </VStack>
                <ChakraButton
                colorScheme="gray"
                type="submit"
                variant="solid"
                leftIcon={<PlusSquareIcon />}
                my={8}
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