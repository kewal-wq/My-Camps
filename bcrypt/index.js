const bcrypt = require('bcrypt');

const hashPassword = async(pw) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pw, salt);
}

const login = async(pw, hasedPw) => {
const result = await bcrypt.compare(pw, hasedPw);
if (result) {
    console.log('Logged you in successfully!');

}
else{
    console.log('Incorrect password!');
}
}