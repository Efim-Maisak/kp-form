export const prepareCustomersData = (data) => {
    const preparedData = {
        customerName: data.field_7625,
        executor: data.field_7639,
        executorPosition: data.field_8239,
        customerAddress: data.field_7970,
        signer: data.field_17389,
        signerName: data.field_17388
    }
    return preparedData;
};