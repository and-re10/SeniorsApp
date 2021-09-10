export function signIn(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                token: 'jfhuefisfbsidgemkgsemggijrh654hb6dfgh4df',
                user: {
                    name: 'André',
                    email: 'andre@bsahtech.be'
                }
            });
        }, 2000);
    });
}; 