
export const validateEmail = (email) =>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email); 
};

export const addThousandsSeparator = (num)=>{
    if(num == null || isNaN(num)) return ;

    const [integerPart, fractioncalPart] = num.toString().split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\D{3})+(?!\d))/g, ",");

    return fractioncalPart ? `${formattedInteger}.${fractioncalPart}` : formattedInteger;
};