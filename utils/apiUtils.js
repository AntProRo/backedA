//Generate Radom password
 const generatePassword = () => {
    const Allowed = {
      Uppers: "QWERTYUIOPASDFGHJKLZXCVBNM",
      Lowers: "qwertyuiopasdfghjklzxcvbnm",
      Numbers: "1234567890",
      Symbols: "!@#$%^&*",
    };
    let length = 8; // password will be @Param-length, default to 8, and have at least one upper, one lower, one number and one symbol
    const getRandomCharFromString = (str) =>
      str.charAt(Math.floor(Math.random() * str.length));
    let pwd = "";
    pwd += getRandomCharFromString(Allowed.Uppers); //pwd will have at least one upper
    pwd += getRandomCharFromString(Allowed.Lowers); //pwd will have at least one lower
    pwd += getRandomCharFromString(Allowed.Numbers); //pwd will have at least one number
    pwd += getRandomCharFromString(Allowed.Symbols); //pwd will have at least one symbolo
    for (let i = pwd.length; i < length; i++)
      pwd += getRandomCharFromString(Object.values(Allowed).join("")); //fill the rest of the pwd with random characters
    return pwd;
  };

  const verifyPass = (pass) => {
    let charCheck = pass.length > 7 && pass.length < 31;
    let capitalCheck = /[A-Z]/g.test(pass);
    let numberCheck = /[0-9]/g.test(pass);
    let symbolCheck = /[,?!:;.@#%]/g.test(pass);
    return charCheck && capitalCheck && numberCheck && symbolCheck;
  };
  
  module.exports = {generatePassword,verifyPass}

 
  