import React, {useEffect, useMemo} from "react";
import { Field, useField, useFormikContext } from 'formik';

const NdsField = (props) => {

    const {
        values,
        setFieldValue,
      } = useFormikContext();

    const [field] = useField(props);

    const ndsCount = useMemo( () => {
        return (values) => {
        const parseValue = (value) => parseFloat(value.replaceAll(/[^\d.,]/g, "").replace(",", "."));
        const nds = (parseValue(values.total) * 20) / 100;
        return nds.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }, [values.total]);

    useEffect(() => {
        if(values.total) {
            setFieldValue(props.name, ndsCount(values));
        } else {
            setFieldValue(props.name, "0,00");
        }

    }, [values.total, setFieldValue, props.name]);


    return (
        <>
          <Field {...props} {...field}/>
        </>
      );
};

export default NdsField;