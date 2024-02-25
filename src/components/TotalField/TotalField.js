import React, {useEffect} from "react";
import { Field, useField, useFormikContext } from 'formik';


const TotalField = (props) => {

    const {
      values,
      setFieldValue,
    } = useFormikContext();

    const [field] = useField(props);

    const countTotal = (values) => {
        const parseValue = (value) => parseFloat(value.replaceAll(/[^\d.,]/g, "").replace(",", "."));
        const filtered = values.goods.filter( item => item.subtotal !== "");
        const total = filtered.reduce((acc, curr) => {
            return acc + parseValue(curr.subtotal);
        }, 0);
        return total.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    useEffect(() => {
        if (values.goods.length > 0) {
          setFieldValue(props.name, countTotal(values));
        }
      }, [ values.goods, setFieldValue, props.name]);


    return (
      <>
        <Field {...props} {...field}/>
      </>
    );
};

export default TotalField;