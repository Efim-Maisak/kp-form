import React, {useEffect, useMemo} from "react";
import { Field, useField, useFormikContext } from 'formik';

const TotalWithNdsField = (props) => {

    const {
        values,
        setFieldValue,
      } = useFormikContext();

    const [field] = useField(props);

    const totalCount = useMemo (() => {
        return (values) => {
        const parseValue = (value) => parseFloat(value.replaceAll(/[^\d.,]/g, "").replace(",", "."));
        const total = parseValue(values.total) + parseValue(values.nds);
        return total.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }, [values.total, values.nds]);

    useEffect(() => {
        if(values.total && values.nds) {
            setFieldValue(props.name, totalCount(values));
        } else {
            setFieldValue(props.name, "0,00");
        }

    }, [values.total, values.nds, setFieldValue, props.name]);


    return (
        <>
          <Field {...props} {...field}/>
        </>
      );
};

export default TotalWithNdsField;