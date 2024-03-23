import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import FormWrapper from "../FormWrapper/FormWrapper";
import ActiveForm from "../ActiveForm/ActiveForm";


const OfferPage = ({linkItems}) => {
    return (
        <>
        <Sidebar linkItems={linkItems}>
            <FormWrapper>
                <ActiveForm/>
            </FormWrapper>
        </Sidebar>
        </>
    );
};

export default OfferPage;