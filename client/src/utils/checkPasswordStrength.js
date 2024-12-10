function checkPasswordStrength(password) {
    let strength = 0;

    // Check for password length
    if (password.length >= 8) strength++;

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) strength++;

    // Check for lowercase letters
    if (/[a-z]/.test(password)) strength++;

    // Check for numbers
    if (/\d/.test(password)) strength++;

    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    // // Evaluate strength score
    // let strengthLevel;
    // switch (strength) {
    //     case 5:
    //         strengthLevel = "Very Strong";
    //         break;
    //     case 4:
    //         strengthLevel = "Strong";
    //         break;
    //     case 3:
    //         strengthLevel = "Medium";
    //         break;
    //     case 2:
    //         strengthLevel = "Weak";
    //         break;
    //     default:
    //         strengthLevel = "Very Weak";
    //         break;
    // }

    return strength;
}

export default checkPasswordStrength;
