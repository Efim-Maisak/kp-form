import React, { useState, useEffect} from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import { Flex,
         VStack,
         Input,
         Box,
         Text,
         Textarea,
         IconButton,
         Heading,
         Link,
         useToast,
         useMediaQuery,
         Button as ChakraButton } from '@chakra-ui/react';
import { CloseIcon } from "@chakra-ui/icons";
import SubTotalField from "../SubTotalField/SubTotalField";
import TotalField from "../TotalField/TotalField";
import NdsField from "../NdsField/NdsField";
import TotalWithNdsField from "../TotalWithNdsField/TotalWithNdsField";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { TemplateHandler } from 'easy-template-x';
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import { validateName } from "../../utils/validateName";
import { validatePrice } from "../../utils/validatePrice";
import { validateAmount } from "../../utils/validateAmount";
import { prepareCustomersData } from "../../utils/prepareCustomersData";
import { prepareLeaderData } from "../../utils/prepareLeaderData";
import { HiDocumentCheck } from "react-icons/hi2";
import { IoMdAddCircle } from "react-icons/io";


const ActiveForm = () => {

    const baseUrl = process.env.REACT_APP_BASEROW_URL;
    const templateUrl = process.env.REACT_APP_TEMPLATE_URL;
    const fileUrl = process.env.REACT_APP_BASEROW_MEDIA_URL;
    const token = process.env.REACT_APP_BASEROW_TOKEN;

    const [options, setOptions] = useState(null);
    const [leaderOptions, setLeaderOptions] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [leaders, setLeaders] = useState(null);
    const [selectedCustomerOption, setSelectedCustomerOption] = useState(null);
    const [selectedLeader, setSelectedLeader] = useState(null);
    const [documentUrl, setDocumentUrl] = useState(null);
    const [filename, setFilename] = useState(null);
    const [linkIsShown, setLinkIsShown] = useState(false);
    const [templateDoc, setTemplateDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [leaderSelectIsVisible, setLeaderSelectIsVisible] = useState(false);

    const [isSmallerThan900] = useMediaQuery("(max-width: 900px)");
    const [isSmallerThan420] = useMediaQuery("(max-width: 420px)");
    const toast = useToast();

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

      const prepareLeadersOptions = (data) => {
        let leadersArr = [];
        let optionsArr = [];

        if(data.field_8274.length > 0) {
            for(let i = 0; i < data.field_8274.length; i++) {
                optionsArr.push({
                    value: data.field_8274[i].id,
                    label: data.field_8275[i].value
                });
                leadersArr.push({
                    id: data.field_8274[i].id,
                    leaderFullName: data.field_8274[i].value,
                    leaderShortName: data.field_8275[i].value,
                    leaderPosition: data.field_8276[i].value
                });
            }
        };
        setLeaders(leadersArr);
        setSelectedLeader(optionsArr[0]);
        return optionsArr;
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
                setLeaderOptions(prepareLeadersOptions(data));
            })
        } catch(e) {
            throw new Error(e.message);
        }
    };

    const getFileName = async () => {
        try {
            const response = await fetch(templateUrl, {
                method: "GET",
                headers: {
                    Authorization: token
                }
            });
            const data = await response.json();
            return data.field_8014[0].name;
        } catch(e) {
            throw new Error(`Ошибка получения имени файла шаблона: ${e.message}`);
        }
    };


    const getTemplate = async () => {
        const fileName = await getFileName();
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

    const createFromTemplate = async (formData, customerData, selectedLeaderData, leadersData, templateFile) => {
        const leaderData = prepareLeaderData(selectedLeaderData, leadersData);
        const templateData = {...formData, ...customerData, ...leaderData};
        try {
            const handler = new TemplateHandler();
            const doc = await handler.process(templateFile, templateData);
            setDocumentUrl(URL.createObjectURL(doc));
            setFilename(`КП № ${formData.outgoing_number} от ${formData.outgoing_date} в ${customerData.customerName}.docx`);
            setLinkIsShown(true);
            toast({
                description: "Предложение создано",
                status: "success",
                position: "top-right",
                duration: 2000,
                isClosable: false,
              })
        }catch(e) {
            toast({
                description: "Ошибка генерации документа",
                status: "error",
                position: "top-right",
                duration: 2000,
                isClosable: false,
              })
            throw new Error(`Ошибка формирования документа: ${e.message}`);
        }
    };

    const loadOptions = (searchValue, callback) => {
        const filteredOptions = options.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()));
        callback(filteredOptions);
    };

    const handleCutomerSelectChange = (selectedValue) => {
        setSelectedCustomerOption(selectedValue);
        getCustomersData(selectedValue.value);
        setLeaderSelectIsVisible(true);
    };

    const handleLeaderSelectChange = (selectedValue) => {
        setSelectedLeader(selectedValue);
    };

    useEffect(() => {
        getCustomersList();
        getTemplate();
    }, []);


    return (
        <>
        <Flex bg="white" borderRadius="8px" flexDirection="column" alignContent="center" p={isSmallerThan900 ? "4" : "8"}>
            <Heading as="h1" py="32px" size="lg">Расчет коммерческого предложения</Heading>
            <Box maxW="408px">
                <Box py="16px">
                    <Text fontWeight="bold">Заказчик</Text>
                </Box>
                <AsyncSelect
                autoFocus
                placeholder="Выбор организации..."
                onChange={handleCutomerSelectChange}
                loadOptions={loadOptions}
                defaultOptions={options}
                styles={selectStyles}
                />
            </Box>
            <Box
            maxW="408px"
            display={leaderSelectIsVisible ? "block" : "none"}
            >
                <Box py="16px">
                    <Text fontWeight="bold">Руководитель заказчика</Text>
                </Box>
                {leaderOptions && (
                    <Select
                    value={selectedLeader}
                    onChange={handleLeaderSelectChange}
                    options={leaderOptions}
                    styles={selectStyles}
                    />
                )}
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
                createFromTemplate(formatedValues, customer, selectedLeader, leaders, templateDoc);
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
                                placeholder="Дата"
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
                                placeholder="Дата"
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
                        <Flex h={isSmallerThan900 ? "300" : "75"} flexDirection={isSmallerThan900 ? "column" : "row"} justifyContent="space-between" alignItems="flex-start" className="row" key={index} pt={4}>
                            <Box w="40px" h="40px" borderRadius="full" bg="red.300" display="flex" justifyContent="center" alignItems="center">
                                <Text color="white" fontWeight="bold" textAlign="center" verticalAlign="middle" fontSize="18px">{index + 1}</Text>
                            </Box>
                            <Box w={isSmallerThan900 ? "100%" : "350px"} mr="8px" className="col">
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
                    mb={isSmallerThan900 ? 8 : 4}
                    colorScheme="gray"
                    variant="outline"
                    leftIcon={<IoMdAddCircle fontSize="22px"/>}
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
                            <Text pr="8px" fontSize={isSmallerThan420 ? "14px" : null} fontWeight="bold">Итого: </Text>
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
                            <Text pr="8px" fontSize={isSmallerThan420 ? "14px" : null} fontWeight="bold">НДС: </Text>
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
                        <Flex
                        pt="8px"
                        flexDirection="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        >
                            <Text pr="8px" fontSize={isSmallerThan420 ? "14px" : null} fontWeight="bold">Итого с НДС: </Text>
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
                            overflow="hidden"
                            maxH="300px"
                            borderRadius="8px"
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
                            overflow="hidden"
                            maxH="300px"
                            borderRadius="8px"
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
                            overflow="hidden"
                            maxH="400px"
                            borderRadius="8px"
                            as={Textarea}
                            />
                        </Box>
                    </VStack>
                <ChakraButton
                colorScheme="gray"
                type="submit"
                variant="solid"
                leftIcon={<HiDocumentCheck fontSize="22px"/>}
                my={8}
                isDisabled={!selectedCustomerOption ||loading || isSubmitting || Object.keys(errors).length > 0 ? true : false}>
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