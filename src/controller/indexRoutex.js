export const vistaHome = (req, res) => {
    res.render('index', {title: 'Home'})
}

export const vistaLogin = (req, res) => {
    res.render('login', {title: 'Login'})
}

export const vistaRegistro = (req, res) => {
    res.render('registro', {title: 'Registro'})
}



export const postMetodo = async (req, res) => {
    const [result] = await pool1.query('SELECT 1+1 as result')
    res.json(result[0])
}
