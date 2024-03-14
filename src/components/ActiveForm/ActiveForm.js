import React, { useState, useEffect} from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { Flex, VStack, Input, Box, Text, Textarea, IconButton, Heading, Link, Button as ChakraButton } from '@chakra-ui/react';
import { CloseIcon, PlusSquareIcon } from "@chakra-ui/icons";
import SubTotalField from "../SubTotalField/SubTotalField";
import TotalField from "../TotalField/TotalField";
import NdsField from "../NdsField/NdsField";
import TotalWithNdsField from "../TotalWithNdsField/TotalWithNdsField";
import AsyncSelect from "react-select/async";
import { TemplateHandler } from 'easy-template-x';
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import { getRespectfullTitle } from "../../utils/getRespectfullTitle";


const ActiveForm = () => {

    const baseUrl = process.env.REACT_APP_BASEROW_URL;
    const fileUrl = process.env.REACT_APP_BASEROW_MEDIA_URL;
    const token = process.env.REACT_APP_BASEROW_TOKEN;

    const [options, setOptions] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [documentUrl, setDocumentUrl] = useState(null);
    const [filename, setFilename] = useState(null);
    const [linkIsShown, setLinkIsShown] = useState(false);
    const [templateDoc, setTemplateDoc] = useState(null);
    const [loading, setLoading] = useState(true);


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

    const selectStyles = {
        control: (baseStyles, { isFocused, isSelected }) => ({
          ...baseStyles,
          borderRadius: 8,
          borderColor: isSelected ? "#FEB2B2" : "#E2E8F0",
          boxShadow: isFocused ? "0 0 0 2px #FEB2B2" : "none",
          '&:hover': {
            borderColor: isFocused ? "#E2E8F0": "#CBD5E0"
          }
        }),
        option: (baseStyles, { isDisabled, isSelected }) => ({
          ...baseStyles,
          backgroundColor: isSelected ? "#F56565" : "#fff",
          color: isDisabled ? "#ccc" : "#333",
          '&:hover': {
            backgroundColor: "#FEB2B2"
          }
        })
      };

    const prepareCustomersData = (data) => {
        const preparedData = {
            customerName: data.field_7625,
            executor: data.field_7639,
            customesBossFullName: data.field_7968,
            customerPosition: data.field_7969,
            customerAddress: data.field_7970,
            customerBossShortName: data.field_7971,
            customerBossName: data.field_7968.split(" ").slice(-2).join(" "),
            appeal: getRespectfullTitle(data.field_7968.split(" ")[2])
        }

        return preparedData;
    };

    const createOptionsList = (customersArr) => {
        let optionsArr = [];

        if(customersArr.length > 0) {
            for(let i = 0; i <= customersArr.length; i++) {
                if(customersArr[i]) {
                    optionsArr.push({
                        value: customersArr[i].id,
                        label: customersArr[i].field_7625
                    });
                }
            }
        }
        setOptions(optionsArr);
    };

    const getCustomersList = async () => {
        try {
            const response = await fetch(`${baseUrl}?filter__field_7972__boolean=true&include=-field_7625,-field_7972&order_by=field_7625`, {
                method: "GET",
                headers: {
                    Authorization: token
                }
            });
            await response.json().then( data => {
                 createOptionsList(data.results);
                });
        }catch(e) {
            throw new Error(e.message);
        }
    };

    const getCustomersData = async (id) => {
        try {
            const response = await fetch(`${baseUrl}${id}/`, {
                method: "GET",
                headers: {
                    Authorization: token
                }
            });
            await response.json().then(data => {
                setCustomer(prepareCustomersData(data));
            })
        } catch(e) {
            throw new Error(e.message);
        }
    };

    const getTemplate = async () => {
        const fileName = "5K0doSGXKLtx0NchZpcUdsa757IrNvtE_4c55413bb599d9672b70789bc61b1a44de8488e2a88c6a217c82794d606355b4.docx";
        //const url = "https://corsproxy.io/?" + encodeURIComponent(`${fileUrl}/${fileName}`);
        //const url = `https://api.codetabs.com/v1/proxy?quest=${fileUrl}/${fileName}`;
        const url = `https://api.allorigins.win/raw?url=${fileUrl}/${fileName}`;
        try {
            const response = await fetch( url, {
                method: "GET"
            });
            const templateFile = await response.blob();
            setTemplateDoc(templateFile);
            setLoading(false);
        }catch(e) {
            throw new Error(`Ошибка получения шаблона документа: ${e.message}`);
        }
    };

    const createFromTemplate = async (formData, customerData, templateFile) => {
        const templateData = {...formData, ...customerData};
        try {
            const handler = new TemplateHandler();
            const doc = await handler.process(templateFile, templateData);
            setDocumentUrl(URL.createObjectURL(doc));
            setFilename(`КП № ${formData.outgoing_number} от ${formData.outgoing_date} в ${customerData.customerName}.docx`);
            setLinkIsShown(true);
        }catch(e) {
            throw new Error(`Ошибка формирования документа: ${e.message}`);
        }
    };

    const loadOptions = (searchValue, callback) => {
        const filteredOptions = options.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()));
        callback(filteredOptions);
    };

    const handleSelectChange = (selectedValue) => {
        setSelectedOption(selectedValue);
        getCustomersData(selectedValue.value);
    };

    useEffect(() => {
        getCustomersList();
        getTemplate();
    }, []);


    return (
        <>
        <Flex bg="white" flexDirection="column" h="100vh" alignContent="center" p={8}>
            <Heading as="h1" py="32px" size="lg">Расчет коммерческого предложения</Heading>
            <Box maxW="408px">
                <Box py="16px">
                    <Text fontWeight="bold">Заказчик</Text>
                </Box>
                <AsyncSelect
                autoFocus
                placeholder="Выбор организации..."
                onChange={handleSelectChange}
                loadOptions={loadOptions}
                defaultOptions={options}
                styles={selectStyles}
                />
            </Box>
            <Formik
            validateOnBlur
            initialValues={initialValues}
            onSubmit={async (values, {setSubmitting}) => {
                setSubmitting(true);
                const formatedValues = {
                    ...values,
                    outgoing_date: formatDate(values.outgoing_date),
                    incoming_date: formatDate(values.incoming_date),
                    base_text: !values.incoming_number ? true : false,
                    goods: formatPrice(values.goods)
                }
                console.log(formatedValues);
                createFromTemplate(formatedValues, customer, templateDoc);
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
                isDisabled={loading || isSubmitting || Object.keys(errors).length > 0 ? true : false}>
                    Создать предложение
                </ChakraButton>
                </Form>
                )}
            </Formik>
            <Box pb="16px">
                {linkIsShown ? <Link color="blue.500" download={filename} href={documentUrl}>{filename}</Link> : null}
            </Box>
        </Flex>
        </>
    );
};

export default ActiveForm;