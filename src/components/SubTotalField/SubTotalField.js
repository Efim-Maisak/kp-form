import React, {useEffect, useMemo} from "react";
import { Field, useField, useFormikContext } from 'formik';


const SubTotalField = (props) => {

    const {
      values,
      setFieldValue,
    } = useFormikContext();

    const [field] = useField(props);

    const subTotalCount = useMemo( () => {
      return (price, amount) => {
      if (typeof price === "string") {
          const multiplicated = (parseFloat(price.replace(",", ".")) * Number(amount)).toFixed(2);
          const formattedNumber = parseFloat(multiplicated).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          return formattedNumber;
        }
      };
    }, [values.goods[props.index].price, values.goods[props.index].amount]);

    useEffect(() => {
      if (
        values.goods.length > 0 &&
        values.goods[props.index].price.trim() !== "" &&
        values.goods[props.index].amount.trim() !== ""
      ) {
        setFieldValue(props.name, subTotalCount(values.goods[props.index].price, values.goods[props.index].amount));
      } else {
        setFieldValue(props.name, "0,00");
      }
    }, [ values.goods[props.index].price, values.goods[props.index].amount, setFieldValue, props.name]);

    return (
      <>
        <Field {...props} {...field}/>
      </>
    );
};

export default SubTotalField;